package net.ideaslibres.rhdstore.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import net.ideaslibres.rhdstore.configuration.CreateUserValidation;
import net.ideaslibres.rhdstore.configuration.UpdateUserValidation;
import net.ideaslibres.rhdstore.model.security.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;

@Entity
@Table(name = "users")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDto implements UserDetails {
    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long userId;
    @NotEmpty(groups = {CreateUserValidation.class,UpdateUserValidation.class})
    public String username;
    @NotEmpty(groups = {CreateUserValidation.class})
    @Pattern(regexp = "^[a-fA-F0-9]{32}$", message = "password must be MD5 encoded")
    public String password;
    @NotEmpty(groups = {UpdateUserValidation.class})
    public String profile;
    @Column(name = "login_attempts")
    public Integer loginAttempts;
    @Column(name = "last_login_timestamp")
    public Date lastLoginTimestamp;
    @JsonProperty("enabled")
    @NotNull(groups = {UpdateUserValidation.class})
    public Boolean enabled;
    @Column(name = "creation_timestamp")
    public Date creationTimestamp;
    @Column(name = "update_timestamp")
    public Date updateTimestamp;

    public UserDto() {
    }

    public UserDto(Long userId) {
        this.userId = userId;
    }

    public UserDto(String username) {
        this.username = username;
    }

    public UserDto(String username, String profile, Boolean enabled, Date creationTimestamp, Date updateTimestamp) {
        this.username = username;
        this.profile = profile;
        this.enabled = enabled;
        this.creationTimestamp = creationTimestamp;
        this.updateTimestamp = updateTimestamp;
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Arrays.asList(new Role(profile));
    }

    @Override
    public String getPassword() {
        return password != null ? "{noop}" + password : password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return Boolean.TRUE.equals(enabled);
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return Boolean.TRUE.equals(enabled);
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return Boolean.TRUE.equals(enabled);
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return Boolean.TRUE.equals(enabled);
    }
}
