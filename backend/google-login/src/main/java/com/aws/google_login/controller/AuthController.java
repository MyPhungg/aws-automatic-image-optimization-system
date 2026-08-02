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
package com.aws.google_login.controller;

import com.aws.google_login.dto.AuthResponse;
import com.aws.google_login.dto.GoogleLoginRequest;
import com.aws.google_login.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/google")
    public AuthResponse login(@RequestBody GoogleLoginRequest request)
            throws Exception {

        return authService.loginWithGoogle(request.getIdToken());
    }
}