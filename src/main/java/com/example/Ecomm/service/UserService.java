package com.example.Ecomm.service;

import com.example.Ecomm.model.User;
import com.example.Ecomm.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        System.out.println("User added to database.");
        return userRepository.save(user);
    }


    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if(user != null && user.getPassword().equals(password)) {
            System.out.println("User logged in successfully.");
            return user;
        }
        System.out.println("Invalid credentials.");
        return null;
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
