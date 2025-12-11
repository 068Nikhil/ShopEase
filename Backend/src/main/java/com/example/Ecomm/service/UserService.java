package com.example.Ecomm.service;

import com.example.Ecomm.model.Cart;
import com.example.Ecomm.model.Order;
import com.example.Ecomm.model.User;
import com.example.Ecomm.repo.CartRepository;
import com.example.Ecomm.repo.OrderRepository;
import com.example.Ecomm.repo.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;


    public User findById(Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if(optionalUser.isPresent()) {
            return optionalUser.get();
        }
        return new User();
    }


    public User registerUser(User user) {
        if(userRepository.findByEmail(user.getEmail()) != null) {
            System.out.println("User already exists");
            return null;
        }
        User user1 = userRepository.save(user);
        System.out.println("User added to database.");
        Cart cart = new Cart();
        cart.setUser(user1);
        cart.setCartItems(new ArrayList<>());
        cartRepository.save(cart);
        return user1;
    }


    public ResponseEntity<String> loginUser(String email, String password, HttpSession session) {

        User user = userRepository.findByEmail(email);

        if(user != null && user.getPassword().equals(password)) {
            session.setAttribute("user", user);

            System.out.println("User logged in successfully");
            return ResponseEntity.ok("logged in");
        }

        System.out.println("Invalid Email or Password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body("invalid credentials");

    }


    public ResponseEntity<String> logoutUser(HttpSession session) {
        if(session.getAttribute("user") != null) {
            session.invalidate();
            System.out.println("User logged out successfully");
            return ResponseEntity.ok("logged out");
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("no logged in user");

    }


    public ResponseEntity<User> getCurrentUser(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if(user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }




//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }


    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }


}
