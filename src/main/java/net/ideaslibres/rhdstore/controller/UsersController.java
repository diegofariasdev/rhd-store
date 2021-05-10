package net.ideaslibres.rhdstore.controller;

import net.ideaslibres.rhdstore.configuration.CreateUserValidation;
import net.ideaslibres.rhdstore.configuration.UpdateUserValidation;
import net.ideaslibres.rhdstore.exception.RecordNotFoundException;
import net.ideaslibres.rhdstore.model.dto.AccessTokenDto;
import net.ideaslibres.rhdstore.model.dto.UserDto;
import net.ideaslibres.rhdstore.service.UsersService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.security.RolesAllowed;
import javax.validation.constraints.Pattern;
import java.util.List;

import static net.ideaslibres.rhdstore.model.Constants.ROLE_ADMIN;

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
                    List<@Pattern(regexp = "(desc|asc)\\([a-zA-Z]+\\)") String> orderBy,
            @RequestParam(required = false, defaultValue = "5") Integer pageSize,
            @RequestParam(required = false, defaultValue = "0") Integer pageNumber
    ) {
        return ResponseEntity
                .ok(service.getUsers(profile, enable, orderBy, pageSize, pageNumber));
    }

    @RolesAllowed(ROLE_ADMIN)
    @GetMapping("/{username}")
    public ResponseEntity<UserDto> getUserByUsername(
            @PathVariable String username) throws RecordNotFoundException {
        return ResponseEntity
                .ok(service.getUserByUsername(username));
    }
}
