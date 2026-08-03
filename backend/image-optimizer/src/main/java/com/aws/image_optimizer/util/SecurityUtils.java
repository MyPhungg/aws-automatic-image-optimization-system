package com.aws.image_optimizer.util;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {


    public String getCurrentUserId(
            Authentication authentication
    ){

        if(authentication == null){
            return "GUEST";
        }


        return authentication.getName();
    }
}