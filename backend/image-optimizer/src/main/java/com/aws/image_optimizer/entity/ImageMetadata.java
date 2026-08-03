package com.aws.image_optimizer.entity;


import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.*;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamoDbBean
public class ImageMetadata {


    private String batchId;

    private String processingId;


    private String userId;


    private String originalName;


    private String inputBucket;

    private String outputBucket;


    private String inputKey;

    private String outputKey;


    private String thumbnailKey;


    private String format;


    private OptimizationConfig optimizationConfig;



    private String uploadedAt;

    private String processedAt;


    private String status;


    private String errorMessage;


    private String lambdaRequestId;


    private Long originalSize;


    private Long processedSize;


    private Double compressionRatio;


    private Long processingTimeMs;



    @DynamoDbPartitionKey
    public String getBatchId(){
        return batchId;
    }



    @DynamoDbSortKey
    public String getProcessingId(){
        return processingId;
    }



    @DynamoDbSecondaryPartitionKey(
            indexNames = "UserImagesIndex"
    )
    public String getUserId(){
        return userId;
    }



    @DynamoDbSecondarySortKey(
            indexNames = "UserImagesIndex"
    )
    public String getUploadedAt(){
        return uploadedAt;
    }

    @DynamoDbAttribute("optimizationConfig")
    public OptimizationConfig getOptimizationConfig(){
        return optimizationConfig;
    }

}