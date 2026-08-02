package com.aws.google_login.service;

import com.aws.google_login.entity.User;
import com.aws.google_login.repository.UserRepository;
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