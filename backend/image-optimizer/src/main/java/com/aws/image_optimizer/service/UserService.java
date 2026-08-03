package com.aws.image_optimizer.service;

import com.aws.image_optimizer.entity.User;
import com.aws.image_optimizer.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    public User findById(String id){

        return repository.findById(id);

    }

    public void save(User user){

        repository.save(user);

    }

}