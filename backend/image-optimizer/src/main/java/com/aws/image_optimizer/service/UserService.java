package com.aws.image_optimizer.service;

import com.aws.image_optimizer.dto.HistoryResponse;
import com.aws.image_optimizer.dto.UserUsageResponse;
import com.aws.image_optimizer.entity.ImageMetadata;
import com.aws.image_optimizer.entity.User;
import com.aws.image_optimizer.entity.UserMetadata;
import com.aws.image_optimizer.repository.ImageMetadataRepository;
import com.aws.image_optimizer.repository.UserMetadataRepository;
import com.aws.image_optimizer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final ImageMetadataRepository imageRepository;

    public List<HistoryResponse> getHistory(String userId) {

        List<ImageMetadata> images =
                imageRepository.findByUserId(userId);


        return images.stream()
                .collect(Collectors.groupingBy(
                        ImageMetadata::getBatchId
                ))
                .values()
                .stream()
                .map(list -> {

                    long success =
                            list.stream()
                                    .filter(i ->
                                            "SUCCESS".equals(i.getStatus())
                                    )
                                    .count();


                    long failed =
                            list.stream()
                                    .filter(i ->
                                            "FAILED".equals(i.getStatus())
                                    )
                                    .count();


                    return HistoryResponse.builder()
                            .batchId(
                                    list.get(0).getBatchId()
                            )
                            .uploadedAt(
                                    list.get(0).getUploadedAt()
                            )
                            .totalImages(
                                    list.size()
                            )
                            .successImages(
                                    (int) success
                            )
                            .failedImages(
                                    (int) failed
                            )
                            .build();

                })
                .toList();
    }
    public List<UserUsageResponse> getUsersUsage() {

        List<User> users =
                userRepository.findAll();


        return users.stream()
                .map(user -> {

                    List<ImageMetadata> images =
                            imageRepository.findByUserId(
                                    user.getUserId()
                            );


                    long batches =
                            images.stream()
                                    .map(ImageMetadata::getBatchId)
                                    .distinct()
                                    .count();


                    return UserUsageResponse.builder()
                            .userId(user.getUserId())
                            .email(user.getEmail())
                            .name(user.getName())
                            .totalImages(
                                    (long) images.size()
                            )
                            .totalBatches(
                                    batches
                            )
                            .build();

                })
                .toList();
    }



    public User findById(String id){

        return userRepository.findById(id);

    }

    public void save(User user){

        userRepository.save(user);

    }

}
