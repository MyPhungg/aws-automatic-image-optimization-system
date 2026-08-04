package com.aws.image_optimizer.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchResponse {

    private String batchId;

    private List<BatchImageResponse> images;
}