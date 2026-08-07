//package com.aws.google_login.controller;
//
//import com.aws.google_login.dto.AuthResponse;
//import com.aws.google_login.dto.GoogleLoginRequest;
//import com.aws.google_login.service.GoogleAuthService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    private final GoogleAuthService googleAuthService;
//
//    @PostMapping("/google")
//    public AuthResponse googleLogin(
//            @RequestBody GoogleLoginRequest request
//    ) throws Exception {
//
//        return googleAuthService.login(request.getIdToken());
//
//    }
//
//}
package com.aws.image_optimizer.controller;

import com.aws.image_optimizer.dto.AuthResponse;
import com.aws.image_optimizer.dto.GoogleLoginRequest;
import com.aws.image_optimizer.dto.LoginResult;
import com.aws.image_optimizer.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/google")
    public ResponseEntity<LoginResult> login(
            @RequestBody GoogleLoginRequest request,
            HttpServletResponse response
    )
            throws Exception {


        AuthResponse authResponse =
                authService.loginWithGoogle(
                        request.getIdToken()
                );


        Cookie cookie =
                new Cookie(
                        "access_token",
                        authResponse.getToken()
                );


        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Must be true for cross-origin over HTTPS
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "None"); // Required for cross-domain cookie with GitHub Pages
        cookie.setMaxAge(
                24 * 60 * 60
        );


        response.addCookie(cookie);

        LoginResult result = LoginResult.builder()
                .userId(authResponse.getUserId())
                .token(authResponse.getToken())
                .email(authResponse.getEmail())
                .name(authResponse.getName())
                .avatarUrl(authResponse.getAvatarUrl())
                .role(authResponse.getRole())
                .build();

        log.info("========== [LOGIN RESPONSE DATA] ==========");
        log.info("User ID   : {}", result.getUserId());
        log.info("Email     : {}", result.getEmail());
        log.info("Name      : {}", result.getName());
        log.info("Role      : {}", result.getRole());
        log.info("Avatar URL: {}", result.getAvatarUrl());
        log.info("Token     : {}", result.getToken() != null ? "[PRESENT]" : "[NULL]");
        log.info("===========================================");

        return ResponseEntity.ok(result);
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletResponse response
    ) {

        Cookie cookie =
                new Cookie(
                        "access_token",
                        ""
                );

        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setAttribute("SameSite", "None");
        cookie.setMaxAge(0);


        response.addCookie(cookie);


        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Logout successfully"
                )
        );
    }
//    @PostMapping("/google")
//    public AuthResponse login(@RequestBody GoogleLoginRequest request)
//            throws Exception {
//
//        return authService.loginWithGoogle(request.getIdToken());
//    }
}