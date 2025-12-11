package com.example.Ecomm.service;

import com.example.Ecomm.model.CartItem;
import com.example.Ecomm.model.Order;
import com.example.Ecomm.model.OrderItem;
import com.example.Ecomm.model.User;
import com.example.Ecomm.repo.OrderRepository;
import com.example.Ecomm.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public Order createOrder(Long userId, List<CartItem>cartItems) {

        double totalPrice = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        User user = userRepository.findById(userId)
                .orElse(null);


        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus("PLACED");

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            orderItem.setOrder(order);

            orderItems.add(orderItem);

            totalPrice += cartItem.getTotalPrice();
        }

        order.setOrderItems(orderItems);
        order.setTotalPrice(totalPrice);

        return orderRepository.save(order);
    }



    public Order getOrderByOrderId(Long orderId) {
         return orderRepository.findById(orderId)
                 .orElse(null);
    }



    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElse(null);

        if(order != null) {
            order.setStatus(status);
            return orderRepository.save(order);
        }
        return null;
    }
}
