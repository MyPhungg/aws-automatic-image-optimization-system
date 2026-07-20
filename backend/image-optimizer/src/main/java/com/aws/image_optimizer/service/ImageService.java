package com.aws.image_optimizer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ImageService {
    private final S3Client s3Client;

    @Value("${s3.bucket-name}")
    private String bucketName;

    public void uploadImages(
            MultipartFile files[],
            String userId,
            String batchId
    ){
        for(MultipartFile file : files){
            uploadSingle(file,userId, batchId);
        }
    }

    public void uploadSingle(MultipartFile file, String userId, String batchId){
        String key = "uploads/"+userId+"/"+batchId+"/"+file.getOriginalFilename();
        Map<String, String> metadata = new HashMap<>();
        metadata.put("userId", userId);
        metadata.put("batchId", batchId);

        PutObjectRequest req = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .metadata(metadata)
                .contentType(file.getContentType())
                .build();

        try {
            s3Client.putObject(req, RequestBody.fromBytes(file.getBytes()));
        } catch (Exception e){
            throw new RuntimeException("Failed to upload file to S3", e);
        }
    }
}
