package com.aws.image_optimizer.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoryResponse {

    private String batchId;

    private String uploadedAt;

    private Integer totalImages;

    private Integer successImages;

    private Integer failedImages;
}