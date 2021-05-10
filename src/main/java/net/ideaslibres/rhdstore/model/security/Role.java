package net.ideaslibres.rhdstore.model.security;

import org.springframework.security.core.GrantedAuthority;

public class Role implements GrantedAuthority {

    private String name;

    public Role(String role) {
        this.name = role;
    }

    @Override
    public String getAuthority() {
        return name;
    }
}
