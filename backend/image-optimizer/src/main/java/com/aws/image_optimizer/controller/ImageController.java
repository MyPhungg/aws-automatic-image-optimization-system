package com.aws.image_optimizer.controller;

import com.aws.image_optimizer.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/image")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("files") MultipartFile files[],
            @RequestParam String userId
            ){
        String batchId = UUID.randomUUID().toString();
        imageService.uploadImages(files, userId, batchId);
        return ResponseEntity.ok(
                Map.of(
                        "batchId", batchId,
                        "message", "Files uploaded successfully"
                )
        );
    }
}
