package com.aws.google_login.controller;

import com.aws.google_login.entity.User;
import com.aws.google_login.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    public User get(@PathVariable String id){

        return userService.findById(id);

    }
    @PostMapping("/test")
    public String saveTestUser(){

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