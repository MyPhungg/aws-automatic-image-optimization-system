package com.aws.image_optimizer.repository;

import com.aws.image_optimizer.entity.ImageMetadata;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import software.amazon.awssdk.enhanced.dynamodb.*;
import software.amazon.awssdk.enhanced.dynamodb.model.Page;
import software.amazon.awssdk.enhanced.dynamodb.model.QueryConditional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ImageMetadataRepository {

    private final DynamoDbEnhancedClient enhancedClient;

    @Value("${dynamodb.image-table}")
    private String tableName;

    private DynamoDbTable<ImageMetadata> table;


    @PostConstruct
    public void init() {

        table = enhancedClient.table(
                tableName,
                TableSchema.fromBean(ImageMetadata.class)
        );
    }


    // CREATE
    public void save(ImageMetadata metadata) {

        table.putItem(metadata);
    }


    // GET 1 IMAGE
    public Optional<ImageMetadata> findById(
            String batchId,
            String processingId
    ) {

        Key key = Key.builder()
                .partitionValue(batchId)
                .sortValue(processingId)
                .build();


        return Optional.ofNullable(
                table.getItem(key)
        );
    }


    // GET ALL IMAGE IN BATCH
    public List<ImageMetadata> findByBatchId(
            String batchId
    ) {

        QueryConditional condition =
                QueryConditional.keyEqualTo(
                        Key.builder()
                                .partitionValue(batchId)
                                .build()
                );


        List<ImageMetadata> result =
                new ArrayList<>();


        for(Page<ImageMetadata> page :
                table.query(r ->
                        r.queryConditional(condition))) {

            result.addAll(page.items());
        }


        return result;
    }


    // GET HISTORY OF USER
    public List<ImageMetadata> findByUserId(
            String userId
    ) {

        DynamoDbIndex<ImageMetadata> index =
                table.index("UserImagesIndex");


        QueryConditional condition =
                QueryConditional.keyEqualTo(
                        Key.builder()
                                .partitionValue(userId)
                                .build()
                );


        List<ImageMetadata> result =
                new ArrayList<>();


        for(Page<ImageMetadata> page :
                index.query(r ->
                        r.queryConditional(condition))) {

            result.addAll(page.items());
        }


        return result;
    }



    // UPDATE AFTER LAMBDA COMPLETE
    public void update(
            ImageMetadata metadata
    ) {

        table.updateItem(metadata);
    }


    // DELETE
    public void delete(
            String batchId,
            String processingId
    ) {

        Key key = Key.builder()
                .partitionValue(batchId)
                .sortValue(processingId)
                .build();


        table.deleteItem(key);
    }
}