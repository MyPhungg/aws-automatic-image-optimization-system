package com.aws.image_optimizer.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResult {

    private String userId;
    private String token;
    private String email;

    private String name;

    private String avatarUrl;

    private String role;
}
