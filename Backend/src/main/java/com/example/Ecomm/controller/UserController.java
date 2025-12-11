package com.example.Ecomm.controller;


import com.example.Ecomm.model.Order;
import com.example.Ecomm.model.User;
import com.example.Ecomm.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;


    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.findById(id);
    }


    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }


    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody Map<String, String> body,
                                            HttpSession session) {
        return userService.loginUser(body.get("email"), body.get("password"), session);
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpSession session) {
        return userService.logoutUser(session);
    }


    @GetMapping("/currentUser")
    public ResponseEntity<User> getCurrentUser(HttpSession session) {
        return userService.getCurrentUser(session);
    }



    @GetMapping("/{userId}/orders")
    public List<Order> getOrdersByUserId(@PathVariable Long userId) {
        return userService.getOrdersByUserId(userId);
    }

}
