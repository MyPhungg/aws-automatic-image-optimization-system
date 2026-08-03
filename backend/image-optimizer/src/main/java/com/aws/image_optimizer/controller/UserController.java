package com.aws.image_optimizer.controller;

import com.aws.image_optimizer.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    @GetMapping
    public ResponseEntity<?> history(
            Authentication authentication
    ){

        String userId =
                authentication.getName();


        return ResponseEntity.ok(
                userService.getHistory(userId)
        );
    }
    @GetMapping("/all")
    public ResponseEntity<?> users(){

        return ResponseEntity.ok(
                userService.getUsersUsage()
        );
    }
}
