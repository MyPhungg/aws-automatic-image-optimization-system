package com.aws.image_optimizer.repository;

import com.aws.image_optimizer.entity.User;
import com.aws.image_optimizer.entity.UserMetadata;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.Key;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class UserRepository {
    private final DynamoDbEnhancedClient enhancedClient;


    @Value("${dynamodb.user-table}")
    private String tableName;


    private DynamoDbTable<User> table;
    @PostConstruct
    public void init(){

        table = enhancedClient.table(
                tableName,
                TableSchema.fromBean(User.class)
        );
    }



//    public void save(UserMetadata user){
//
//        table.putItem(user);
//    }

    public User findById(String userId) {

        return table.getItem(Key.builder()
                .partitionValue(userId)
                .build());

    }

    public void save(User user) {

        table.putItem(user);

    }


//    public Optional<UserMetadata> findById(
//            String userId
//    ){
//
//        return Optional.ofNullable(
//                table.getItem(
//                        Key.builder()
//                                .partitionValue(userId)
//                                .build()
//                )
//        );
//    }



    public List<User> findAll(){

        List<User> result =
                new ArrayList<>();


        table.scan()
                .items()
                .forEach(result::add);


        return result;
    }



    public void update(User user){

        table.updateItem(user);
    }



    public void delete(String userId){

        table.deleteItem(
                Key.builder()
                        .partitionValue(userId)
                        .build()
        );
    }

}