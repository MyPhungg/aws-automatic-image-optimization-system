package com.aws.image_optimizer.service;

import com.aws.image_optimizer.dto.AuthResponse;
import com.aws.image_optimizer.entity.User;
import com.aws.image_optimizer.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AuthResponse loginWithGoogle(String idToken) throws Exception {

        GoogleIdToken.Payload payload =
                googleTokenVerifierService.verify(idToken);

        String userId = payload.getSubject();
        String email = payload.getEmail();
        String name = (String) payload.get("name");
        String avatar = (String) payload.get("picture");

        User user = userRepository.findById(userId);

        if (user == null) {

            user = User.builder()
                    .userId(userId)
                    .email(email)
                    .name(name)
                    .avatarUrl(avatar)
                    .role("USER")
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now().toString())
                    .lastLogin(LocalDateTime.now().toString())
                    .build();

        } else {

            user.setLastLogin(LocalDateTime.now().toString());

        }

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}