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

import java.util.Map;

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
        cookie.setSecure(false); // localhost
        cookie.setPath("/");
        cookie.setMaxAge(
                24 * 60 * 60
        );


        response.addCookie(cookie);


        return ResponseEntity.ok(
                LoginResult.builder()
                        .userId(authResponse.getUserId())
                        .email(authResponse.getEmail())
                        .name(authResponse.getName())
                        .avatarUrl(authResponse.getAvatarUrl())
                        .build()
        );
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpServletResponse response
    ) {

        Cookie cookie =
                new Cookie(
                        "access_token",
                        null
                );

        cookie.setHttpOnly(true);
        cookie.setSecure(false); // localhost
        cookie.setPath("/");
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