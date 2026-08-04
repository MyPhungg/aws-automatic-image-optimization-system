package com.aws.image_optimizer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadRequest {

    private String format;

    private OptimizationConfigRequest optimizationConfig;
}