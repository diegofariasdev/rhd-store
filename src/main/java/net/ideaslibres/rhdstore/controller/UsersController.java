package net.ideaslibres.rhdstore.controller;

import net.ideaslibres.rhdstore.configuration.CreateUserValidation;
import net.ideaslibres.rhdstore.configuration.JwtTokenUtil;
import net.ideaslibres.rhdstore.configuration.UpdateUserValidation;
import net.ideaslibres.rhdstore.model.Constants;
import net.ideaslibres.rhdstore.model.dto.AccessTokenDto;
import net.ideaslibres.rhdstore.model.dto.UserDto;
import net.ideaslibres.rhdstore.model.repository.UsersRepository;
import net.ideaslibres.rhdstore.service.UsersService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static net.ideaslibres.rhdstore.model.Constants.ROLE_ADMIN;
import static net.ideaslibres.rhdstore.model.Constants.ROLE_CLIENT;

@RestController
@RequestMapping("/users")
public class UsersController {

    private UsersService service;

    public UsersController(UsersService service) {
        this.service = service;
    }

    @PostMapping("/login")
    public ResponseEntity<AccessTokenDto> login(@Validated(CreateUserValidation.class) @RequestBody UserDto user) {
        return ResponseEntity
                .ok(service.login(user));
    }

    @PostMapping
    public ResponseEntity<UserDto> createUser(@Validated(CreateUserValidation.class) @RequestBody UserDto user) {
        return ResponseEntity
                .ok(service.createUser(user));
    }

    @RolesAllowed(ROLE_ADMIN)
    @PutMapping
    public ResponseEntity<UserDto> updateUser(@Validated(UpdateUserValidation.class) @RequestBody UserDto user) {
        return ResponseEntity
                .ok(service.updateUser(user));
    }

    @RolesAllowed(ROLE_ADMIN)
    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @RequestParam(required = false) String profile,
            @RequestParam(required = false) Boolean enable,
            @RequestParam(required = false, defaultValue = "desc(creationTimestamp)")
                    List<@Pattern(regexp = "(desc|asc)\\([a-zA-Z]+\\)+") String> orderBy,
            @RequestParam(required = false, defaultValue = "8") Integer pageSize,
            @RequestParam(required = false, defaultValue = "0") Integer pageNumber
    ) {
        return ResponseEntity
                .ok(service.getUsers(profile, enable, orderBy, pageSize, pageNumber));
    }
}
