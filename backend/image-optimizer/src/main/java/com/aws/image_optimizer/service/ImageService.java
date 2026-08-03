package com.aws.image_optimizer.service;

import com.aws.image_optimizer.dto.BatchImageResponse;
import com.aws.image_optimizer.dto.BatchResponse;
import com.aws.image_optimizer.dto.OptimizationConfigRequest;
import com.aws.image_optimizer.entity.ImageMetadata;
import com.aws.image_optimizer.entity.OptimizationConfig;
import com.aws.image_optimizer.repository.ImageMetadataRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageService {

    private final ImageMetadataRepository imageMetadataRepository;
    private final S3Service s3Service;


    public String uploadImages(
            MultipartFile[] files,
            String userId,
            String format,
            OptimizationConfigRequest configRequest
    ) {

        String batchId = UUID.randomUUID().toString();

        OptimizationConfig config = OptimizationConfig.builder()
                .quality(configRequest.getQuality())
                .resizeEnabled(configRequest.getResizeEnabled())
                .maxWidth(configRequest.getMaxWidth())
                .maxHeight(configRequest.getMaxHeight())
                .build();


        for (MultipartFile file : files) {
            uploadSingle(file, userId, batchId, format, config);
        }

        return batchId;
    }


    private void uploadSingle(
            MultipartFile file,
            String userId,
            String batchId,
            String format,
            OptimizationConfig config
    ) {

        String processingId = UUID.randomUUID().toString();


        ImageMetadata metadata = ImageMetadata.builder()
                .batchId(batchId)
                .processingId(processingId)
                .userId(userId)
                .originalName(file.getOriginalFilename())
                .format(format)
                .originalSize(file.getSize())
                .optimizationConfig(config)
                .uploadedAt(Instant.now().toString())
                .status("PENDING")
                .build();


        // Lưu trước để Lambda update sau
        imageMetadataRepository.save(metadata);


        String inputKey = s3Service.upload(
                file,
                userId,
                batchId,
                processingId
        );


        metadata.setInputBucket(
                s3Service.getInputBucket()
        );

        metadata.setInputKey(inputKey);


        imageMetadataRepository.update(metadata);
    }



    public BatchResponse getBatch(String batchId) {

        List<ImageMetadata> images =
                imageMetadataRepository.findByBatchId(batchId);


        List<BatchImageResponse> response =
                images.stream()
                        .map(image ->
                                BatchImageResponse.builder()
                                        .processingId(image.getProcessingId())
                                        .originalName(image.getOriginalName())
                                        .status(image.getStatus())
                                        .originalSize(image.getOriginalSize())
                                        .processedSize(image.getProcessedSize())
                                        .compressionRatio(image.getCompressionRatio())
                                        .format(image.getFormat())
                                        .downloadUrl(
                                                image.getOutputKey() != null
                                                        ? s3Service.generateDownloadUrl(image.getOutputKey())
                                                        : null
                                        )
                                        .thumbnailUrl(
                                                image.getThumbnailKey() != null
                                                        ? s3Service.generateDownloadUrl(image.getThumbnailKey())
                                                        : null
                                        )
                                        .build()
                        )
                        .toList();


        return BatchResponse.builder()
                .batchId(batchId)
                .images(response)
                .build();
    }
}
//@Service
//@RequiredArgsConstructor
//public class ImageService {
//
//    private final S3Service s3Service;
//    private final ImageMetadataRepository repository;
//
//    public String uploadImages(MultipartFile[] files, String userId, UploadRequestDTO request) {
//
//        String batchId = UUID.randomUUID().toString();
//
//        for (MultipartFile file : files) {
//
//            String processingId = UUID.randomUUID().toString();
//
//            ImageMetadata metadata = ImageMetadata.builder()
//                    .batchId(batchId)
//                    .processingId(processingId)
//                    .userId(userId)
//                    .originalName(file.getOriginalFilename())
//                    .format(request.getFormat())
//                    .optimizationConfig(convertConfig(request.getOptimizationConfig()))
//                    .status("PENDING")
//                    .uploadedAt(Instant.now().toString())
//                    .build();
//
//            repository.save(metadata);
//
//            String key = s3Service.upload(
//                    file,
//                    userId,
//                    batchId,
//                    processingId,
//                    request.getFormat()
//            );
//
//            metadata.setInputKey(key);
//            repository.save(metadata);
//        }
//
//        return batchId;
//    }
//
//
//    private OptimizationConfig convertConfig(OptimizationConfigRequest dto) {
//        return OptimizationConfig.builder()
//                .quality(dto.getQuality())
//                .resizeEnabled(dto.getResizeEnabled())
//                .maxWidth(dto.getMaxWidth())
//                .maxHeight(dto.getMaxHeight())
////                .removeMetadata(dto.getRemoveMetadata())
//                .build();
//    }
//}
////package com.aws.image_optimizer.service;
////
////import lombok.RequiredArgsConstructor;
////import org.springframework.beans.factory.annotation.Value;
////import org.springframework.stereotype.Service;
////import org.springframework.web.multipart.MultipartFile;
////import software.amazon.awssdk.core.sync.RequestBody;
////import software.amazon.awssdk.services.s3.S3Client;
////import software.amazon.awssdk.services.s3.model.PutObjectRequest;
////
////import java.util.HashMap;
////import java.util.Map;
////
////@Service
////@RequiredArgsConstructor
////public class ImageService {
////    private final S3Client s3Client;
////
////    @Value("${s3.bucket-name}")
////    private String bucketName;
////
////    public void uploadImages(
////            MultipartFile files[],
////            String userId,
////            String batchId
////    ){
////        for(MultipartFile file : files){
////            uploadSingle(file,userId, batchId);
////        }
////    }
////
////    public void uploadSingle(MultipartFile file, String userId, String batchId){
////        String key = "uploads/"+userId+"/"+batchId+"/"+file.getOriginalFilename();
////        Map<String, String> metadata = new HashMap<>();
////        metadata.put("userId", userId);
////        metadata.put("batchId", batchId);
////
////        PutObjectRequest req = PutObjectRequest.builder()
////                .bucket(bucketName)
////                .key(key)
////                .metadata(metadata)
////                .contentType(file.getContentType())
////                .build();
////
////        try {
////            s3Client.putObject(req, RequestBody.fromBytes(file.getBytes()));
////        } catch (Exception e){
////            throw new RuntimeException("Failed to upload file to S3", e);
////        }
////    }
////}
