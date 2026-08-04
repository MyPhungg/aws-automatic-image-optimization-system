package com.aws.image_optimizer.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OptimizationConfigRequest {

    private Integer quality;

    private Boolean resizeEnabled;

    private Integer maxWidth;

    private Integer maxHeight;

}