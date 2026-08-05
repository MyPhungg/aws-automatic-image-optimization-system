package com.aws.image_optimizer.controller;

import com.aws.image_optimizer.dto.BatchResponse;
import com.aws.image_optimizer.dto.OptimizationConfigRequest;
import com.aws.image_optimizer.service.ImageService;
import com.aws.image_optimizer.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/image")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;
    private final SecurityUtils securityUtils;

    // Upload is now handled directly by API Gateway -> S3 using presigned URLs.


    @GetMapping("/batches/{batchId}")
    public ResponseEntity<BatchResponse> getBatch(
            @PathVariable String batchId
    ){

        return ResponseEntity.ok(
                imageService.getBatch(batchId)
        );
    }

    // Download 1 ảnh
    @GetMapping(
            "/images/{batchId}/{processingId}/download"
    )
    public ResponseEntity<?> downloadSingle(
            @PathVariable String batchId,
            @PathVariable String processingId
    ){

        String url =
                imageService.downloadSingle(
                        batchId,
                        processingId
                );


        return ResponseEntity.ok(
                Map.of(
                        "downloadUrl",
                        url
                )
        );
    }




    // Download toàn bộ batch
    @GetMapping(
            "/batches/{batchId}/download"
    )
    public ResponseEntity<?> downloadBatch(
            @PathVariable String batchId
    ){
        String url =
                imageService.createZipDownloadUrl(
                        batchId
                );


        return ResponseEntity.ok(
                Map.of(
                        "downloadUrl",
                        url
                )
        );

//        List<Map<String,String>> urls =
//                imageService.downloadBatch(
//                        batchId
//                );
//
//
//        return ResponseEntity.ok(
//                urls
//        );
    }
}
