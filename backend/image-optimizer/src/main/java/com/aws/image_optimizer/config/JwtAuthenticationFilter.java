package com.aws.image_optimizer.config;


import com.aws.image_optimizer.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtService jwtService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    )
            throws ServletException, IOException {


        String jwt = getJwtFromCookie(request);


        try {
            if(jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                String userId = jwtService.extractUsername(jwt);
                String role = jwtService.extractRole(jwt);
                if(userId != null) {
                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(
                                    userId,
                                    null,
                                    List.of(
                                            new SimpleGrantedAuthority(
                                                    "ROLE_" + role
                                            )
                                    )
                            );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (Exception e) {
            SecurityContextHolder.clearContext();
            System.err.println("JWT Authentication failed: " + e.getMessage());
        }

        filterChain.doFilter(
                request,
                response
        );
    }



    private String getJwtFromCookie(
            HttpServletRequest request
    ){

        Cookie[] cookies =
                request.getCookies();


        if(cookies == null)
            return null;


        for(Cookie cookie : cookies){

            if(cookie.getName()
                    .equals("access_token")){

                return cookie.getValue();
            }
        }

        return null;
    }
}