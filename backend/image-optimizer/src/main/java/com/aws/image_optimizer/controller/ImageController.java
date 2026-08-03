package com.aws.image_optimizer.controller;

import com.aws.image_optimizer.dto.BatchResponse;
import com.aws.image_optimizer.dto.OptimizationConfigRequest;
import com.aws.image_optimizer.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.Map;

@RestController
@RequestMapping("api/image")
@RequiredArgsConstructor
public class ImageController {
    private final ImageService imageService;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestPart("files") MultipartFile[] files,
            @RequestPart("format") String format,
            @RequestParam String configReq
    ) throws Exception {
//            Authentication authentication;

        String userId = "user001";
//                authentication.getName();

        ObjectMapper mapper = new ObjectMapper();

        OptimizationConfigRequest config =
                mapper.readValue(configReq, OptimizationConfigRequest.class);
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
