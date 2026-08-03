package com.aws.image_optimizer.controller;

import com.aws.image_optimizer.dto.BatchResponse;
import com.aws.image_optimizer.dto.OptimizationConfigRequest;
import com.aws.image_optimizer.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("api/image")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam String format,
            @RequestBody OptimizationConfigRequest config,
            Authentication authentication
    ){

        String userId =
                authentication.getName();


        String batchId =
                imageService.uploadImages(
                        files,
                        userId,
                        format,
                        config
                );


        return ResponseEntity.ok(
                Map.of(
                        "batchId", batchId,
                        "status", "PROCESSING"
                )
        );
    }



    @GetMapping("/batches/{batchId}")
    public ResponseEntity<BatchResponse> getBatch(
            @PathVariable String batchId
    ){

        return ResponseEntity.ok(
                imageService.getBatch(batchId)
        );
    }
}
