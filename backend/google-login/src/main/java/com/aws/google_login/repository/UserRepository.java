package com.aws.google_login.repository;

import com.aws.google_login.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.*;

@Repository
@RequiredArgsConstructor
public class UserRepository {

    private final DynamoDbEnhancedClient enhancedClient;

    private static final String TABLE_NAME = "UserMetadata";

    private DynamoDbTable<User> table() {

        return enhancedClient.table(
                TABLE_NAME,
                TableSchema.fromBean(User.class)
        );

    }

    public User findById(String userId) {

        return table().getItem(Key.builder()
                .partitionValue(userId)
                .build());

    }

    public void save(User user) {

        table().putItem(user);

    }

}