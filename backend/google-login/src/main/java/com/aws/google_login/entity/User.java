package com.aws.google_login.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class User {

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