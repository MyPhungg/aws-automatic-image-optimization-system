package com.aws.image_optimizer.dto;


import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchImageResponse {

    private String processingId;

    private String originalName;

    private String status;

    private Long originalSize;

    private Long processedSize;

    private Double compressionRatio;

    private String format;

    private Integer quality;

    private String downloadUrl;

    private String thumbnailUrl;
}