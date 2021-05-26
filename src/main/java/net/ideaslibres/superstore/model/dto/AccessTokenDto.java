package net.ideaslibres.superstore.model.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AccessTokenDto {
    @JsonProperty("access_token")
    public String accessToken;

    public AccessTokenDto(String accessToken) {
        this.accessToken = accessToken;
    }
}
