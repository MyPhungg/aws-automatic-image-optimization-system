package com.aws.image_optimizer.repository;

import com.aws.image_optimizer.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

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