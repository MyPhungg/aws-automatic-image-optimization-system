package com.aws.image_optimizer.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUsageResponse {

    private String userId;

    private String email;

    private String name;

    private Long totalImages;

    private Long totalBatches;
}