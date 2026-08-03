package com.aws.image_optimizer.entity;


import lombok.*;
import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;


@DynamoDbBean
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizationConfig {


    private Integer quality;


    private Boolean resizeEnabled;


    private Integer maxWidth;


    private Integer maxHeight;


//    private Boolean removeMetadata;

}