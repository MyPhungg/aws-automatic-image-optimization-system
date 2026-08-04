package com.aws.image_optimizer.controller;

import com.aws.image_optimizer.entity.User;
import com.aws.image_optimizer.service.UserService;
import com.aws.image_optimizer.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final SecurityUtils securityUtils;
    @GetMapping
    public ResponseEntity<?> history(
            Authentication authentication
    ) {

//        String userId ="user001";
        String userId = securityUtils.getCurrentUserId(authentication);


        return ResponseEntity.ok(
                userService.getHistory(userId)
        );
    }

    @GetMapping("/all")
    public ResponseEntity<?> users() {

        return ResponseEntity.ok(
                userService.getUsersUsage()
        );
    }


    @GetMapping("/{id}")
    public User get(@PathVariable String id) {

        return userService.findById(id);

    }

    @PostMapping("/test")
    public String saveTestUser() {

        User user = User.builder()
                .userId("123456")
                .email("test@gmail.com")
                .name("Test User")
                .avatarUrl("https://abc.com/avatar.png")
                .role("USER")
                .status("ACTIVE")
                .createdAt(LocalDateTime.now().toString())
                .lastLogin(LocalDateTime.now().toString())
                .build();

        userService.save(user);

        return "Save Success";
    }

}
