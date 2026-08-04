package com.aws.image_optimizer.entity;

import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class UserMetadata {


    private String userId;

    private String email;

    private String name;

    private String avatarUrl;

    private String role;

    private String createdAt;

    private String lastLogin;

    private String status;



    @DynamoDbPartitionKey
    public String getUserId() {
        return userId;
    }

}