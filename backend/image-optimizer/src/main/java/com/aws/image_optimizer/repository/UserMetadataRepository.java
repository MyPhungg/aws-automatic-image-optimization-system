package com.aws.image_optimizer.repository;

import com.aws.image_optimizer.entity.User;
import com.aws.image_optimizer.entity.UserMetadata;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import software.amazon.awssdk.enhanced.dynamodb.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Repository
@RequiredArgsConstructor
public class UserMetadataRepository {




//    private DynamoDbTable<UserMetadata> table() {
//
//        return enhancedClient.table(
//                tableName,
//                TableSchema.fromBean(UserMetadata.class)
//        );
//
//    }

//    public UserMetadata findById(String userId) {
//
//        return table().getItem(Key.builder()
//                .partitionValue(userId)
//                .build());
//
//    }

//    public void save(UserMetadata user) {
//
//        table().putItem(user);
//
//    }



}