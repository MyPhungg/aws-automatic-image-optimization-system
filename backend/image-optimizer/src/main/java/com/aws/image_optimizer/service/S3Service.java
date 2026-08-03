package com.aws.image_optimizer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    private final S3Presigner presigner;


    @Value("${s3.input-bucket}")
    private String inputBucket;

    @Value("${s3.output-bucket}")
    private String outputBucket;


    public String generateDownloadUrl(String key) {

        GetObjectRequest objectRequest =
                GetObjectRequest.builder()
                        .bucket(outputBucket)
                        .key(key)
                        .build();


        GetObjectPresignRequest presignRequest =
                GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(30))
                        .getObjectRequest(objectRequest)
                        .build();


        return presigner.presignGetObject(presignRequest)
                .url()
                .toString();
    }
    public String upload(
            MultipartFile file,
            String userId,
            String batchId,
            String processingId
    ) {

        String key = "uploads/"
                + userId + "/"
                + batchId + "/"
                + processingId + "_"
                + file.getOriginalFilename();


        Map<String, String> metadata = new HashMap<>();

        metadata.put("userid", userId);
        metadata.put("batchid", batchId);
        metadata.put("processingid", processingId);


        PutObjectRequest request =
                PutObjectRequest.builder()
                        .bucket(inputBucket)
                        .key(key)
                        .metadata(metadata)
                        .contentType(file.getContentType())
                        .build();


        try {

            s3Client.putObject(
                    request,
                    RequestBody.fromBytes(file.getBytes())
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Upload S3 failed",
                    e
            );
        }


        return key;
    }


    public String getInputBucket(){
        return inputBucket;
    }
}
/*
@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Client s3Client;

    @Value("${s3.bucket-name}")
    private String bucketName;

    public String upload(MultipartFile file, String userId, String batchId, String processingId, String format) {

        String filename = processingId + "_" + file.getOriginalFilename();
        String key = "uploads/" + userId + "/" + batchId + "/" + filename;

        Map<String, String> metadata = new HashMap<>();
        metadata.put("userid", userId);
        metadata.put("batchid", batchId);
        metadata.put("processingid", processingId);
        metadata.put("format", format);

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .metadata(metadata)
                .contentType(file.getContentType())
                .build();

        try {
            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Upload S3 failed", e);
        }

        return key;
    }
}*/