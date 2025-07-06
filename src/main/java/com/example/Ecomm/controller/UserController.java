package com.example.Ecomm.controller;


import com.example.Ecomm.model.User;
import com.example.Ecomm.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin("*")  //(cross-origin => resource sharing between two different domains)
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }


    @PostMapping("/login")
    public User loginUser(@RequestBody User user) {
        return userService.loginUser(user.getEmail(), user.getPassword());
    }


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

}
