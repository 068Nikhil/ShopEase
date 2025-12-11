package com.example.Ecomm.controller;

import com.example.Ecomm.model.CartItem;
import com.example.Ecomm.model.Order;
import com.example.Ecomm.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;


    @PostMapping("/create")
    public Order createOrder(@RequestParam Long userId,
                             @RequestParam List<CartItem> cartItems) {

        return orderService.createOrder(userId, cartItems);
    }


    @PostMapping("/{orderId}")
    public Order getOrderByOrderId(@PathVariable Long orderId) {
        return orderService.getOrderByOrderId(orderId);
    }


    @PostMapping("/update-status")
    public Order updateOrderStatus(@RequestParam Long id, @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
        //status can be -> PLACED, DELIVERED, CANCELLED
    }

}
