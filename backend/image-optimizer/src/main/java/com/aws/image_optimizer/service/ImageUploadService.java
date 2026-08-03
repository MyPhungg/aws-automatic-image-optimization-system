//package com.aws.image_optimizer.service;
//
//import com.aws.image_optimizer.dto.OptimizationConfigRequest;
//import com.aws.image_optimizer.entity.ImageMetadata;
//import com.aws.image_optimizer.entity.OptimizationConfig;
//import com.aws.image_optimizer.repository.ImageMetadataRepository;
//
//import lombok.RequiredArgsConstructor;
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.time.Instant;
//import java.util.UUID;
//
//@Service
//@RequiredArgsConstructor
//public class ImageUploadService {
//
//    private final ImageMetadataRepository imageMetadataRepository;
//    private final S3Service s3Service;
//
//    public String uploadImages(MultipartFile[] files, String userId, String format, OptimizationConfigRequest configRequest) {
//
//        String batchId = UUID.randomUUID().toString();
//        OptimizationConfig config = OptimizationConfig.builder()
//                .quality(configRequest.getQuality())
//                .resizeEnabled(configRequest.getResizeEnabled())
//                .maxWidth(configRequest.getMaxWidth())
//                .maxHeight(configRequest.getMaxHeight())
//                .build();
//
//        for (MultipartFile file : files) {
//            uploadSingle(file, userId, batchId, format, config);
//        }
//
//        return batchId;
//    }
//
//    private void uploadSingle(MultipartFile file, String userId, String batchId, String format, OptimizationConfig config) {
//
//        String processingId = UUID.randomUUID().toString();
//
//        ImageMetadata metadata = ImageMetadata.builder()
//                .batchId(batchId)
//                .processingId(processingId)
//                .userId(userId)
//                .originalName(file.getOriginalFilename())
//                .format(format)
//                .optimizationConfig(config)
//                .uploadedAt(Instant.now().toString())
//                .status("PENDING")
//                .build();
//
//        imageMetadataRepository.save(metadata);
//
//        String inputKey = s3Service.upload(file, userId, batchId, processingId);
//
//        metadata.setInputBucket(s3Service.getInputBucket());
//        metadata.setInputKey(inputKey);
//
//        imageMetadataRepository.update(metadata);
//    }
//}