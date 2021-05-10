package net.ideaslibres.rhdstore.service;

import net.ideaslibres.rhdstore.configuration.JwtTokenUtil;
import net.ideaslibres.rhdstore.exception.RecordNotFoundException;
import net.ideaslibres.rhdstore.model.dto.AccessTokenDto;
import net.ideaslibres.rhdstore.model.dto.ItemDto;
import net.ideaslibres.rhdstore.model.dto.OrderDto;
import net.ideaslibres.rhdstore.model.dto.UserDto;
import net.ideaslibres.rhdstore.model.repository.UsersRepository;
import net.ideaslibres.rhdstore.util.SystemUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static net.ideaslibres.rhdstore.model.Constants.ROLE_CLIENT;
import static org.aspectj.util.LangUtil.isEmpty;

@Service
public class UsersService {

    private UsersRepository usersRepository;
    private AuthenticationManager authenticationManager;
    private JwtTokenUtil jwtTokenUtil;

    public UsersService(UsersRepository usersRepository, AuthenticationManager authenticationManager, JwtTokenUtil jwtTokenUtil) {
        this.usersRepository = usersRepository;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public AccessTokenDto login(UserDto user) {
        UserDto dbUser = usersRepository
                .findByUsername(user.username)
                .orElseThrow(() -> new BadCredentialsException("Username not found"));

        if (!dbUser.enabled) throw new BadCredentialsException("User is disabled");

        try {
            user.password = user.password.toUpperCase();
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.username, user.password));

            UserDto authenticatedUser = (UserDto) auth.getPrincipal();
            AccessTokenDto accessTokenDto = new AccessTokenDto(jwtTokenUtil.generateAccessToken(authenticatedUser));

            dbUser.loginAttempts = 0;
            dbUser.lastLoginTimestamp = new Date();
            usersRepository.save(dbUser);

            return accessTokenDto;
        } catch (BadCredentialsException ex) {
            if (dbUser.loginAttempts == null)  dbUser.loginAttempts = 1;
            else  dbUser.loginAttempts++;

            if(dbUser.loginAttempts >= 3) dbUser.enabled = false;

            usersRepository.save(dbUser);
            throw ex;
        }
    }

    public UserDto createUser(UserDto user) {
        user.userId = null;
        user.password = user.password.toUpperCase();
        user.profile = ROLE_CLIENT;
        user.enabled = true;
        UserDto savedUser = usersRepository.save(user);

        savedUser.userId = null;
        savedUser.password = null;
        savedUser.enabled = null;
        savedUser.lastLoginTimestamp = null;
        savedUser.loginAttempts = null;
        savedUser.updateTimestamp = null;

        return savedUser;
    }

    public Page<UserDto> getUsers(String profile, Boolean enable, List<String> orderBy, Integer pageSize, Integer pageNumber) {
        Sort sort = SystemUtils.parseOrderBy(orderBy);
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize, sort);

        Page<UserDto> userPage = null;

        if (!isEmpty(profile) && enable != null) {
            userPage = usersRepository.findAllByProfileAndEnabled(profile, enable, pageRequest);
        } else if (!isEmpty(profile) && enable == null) {
            userPage = usersRepository.findAllByProfile(profile, pageRequest);
        } else if (isEmpty(profile) && enable != null) {
            userPage = usersRepository.findAllByEnabled(enable, pageRequest);
        }else {
            userPage = usersRepository.findAll(pageRequest);
        }

        userPage.stream().forEach((user) -> {
            user.userId = null;
            user.password = null;
        });

        return userPage;
    }

    public Iterable<UserDto> getUsers(String profile, Boolean enable, List<String> orderBy) {
        Sort sort = SystemUtils.parseOrderBy(orderBy);

        Iterable<UserDto> users = null;

        if (!isEmpty(profile) && enable != null) {
            users = usersRepository.findAllByProfileAndEnabled(profile, enable, sort);
        } else if (!isEmpty(profile) && enable == null) {
            users = usersRepository.findAllByProfile(profile, sort);
        } else if (isEmpty(profile) && enable != null) {
            users = usersRepository.findAllByEnabled(enable, sort);
        }else {
            users = usersRepository.findAll(sort);
        }

        users.forEach((user) -> {
            user.userId = null;
            user.password = null;
        });

        return users;
    }

    public UserDto updateUser(UserDto user) {
        UserDto dbUser = usersRepository.findByUsername(user.username)
                .orElseThrow(() -> new IllegalArgumentException("user doesn't exist"));

        dbUser.profile = user.profile;
        dbUser.enabled = user.enabled;
        if (dbUser.enabled) dbUser.loginAttempts = 0;
        dbUser.updateTimestamp = new Date();
        if(!isEmpty(user.password)) dbUser.password = user.password.toUpperCase();

        usersRepository.save(dbUser);

        return new UserDto(dbUser.username, dbUser.profile, dbUser.enabled, dbUser.creationTimestamp, dbUser.updateTimestamp);
    }

    public UserDto getUserByUsername(String username) throws RecordNotFoundException {
        UserDto user = usersRepository.findByUsername(username)
                .orElseThrow(() -> new RecordNotFoundException(String.format("User %s not found", username)));

        user.userId = null;
        user.password = null;
        return user;
    }
}
