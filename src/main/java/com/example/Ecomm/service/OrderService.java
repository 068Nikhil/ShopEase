package com.example.Ecomm.service;


import com.example.Ecomm.dto.OrderDTO;
import com.example.Ecomm.dto.OrderItemDTO;
import com.example.Ecomm.model.Order;
import com.example.Ecomm.model.OrderItem;
import com.example.Ecomm.model.Product;
import com.example.Ecomm.model.User;
import com.example.Ecomm.repo.OrderRepository;
import com.example.Ecomm.repo.ProductRepository;
import com.example.Ecomm.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;


    public OrderDTO placeOrder(Long userId, Map<Long, Integer> productQuantities, double totalAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found!"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(new Date());
        order.setStatus("Pending");
        order.setTotalAmount(totalAmount);

        List<OrderItem> orderItems = new ArrayList<>();
        List<OrderItemDTO> orderItemDTOs = new ArrayList<>();

        for(Map.Entry<Long, Integer> entry : productQuantities.entrySet()) {
            Product product = productRepository.findById(entry.getKey())
                    .orElseThrow(()->new RuntimeException("Product not found!"));

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(entry.getValue());

            orderItems.add(orderItem);
            orderItemDTOs.add(new OrderItemDTO(product.getName(), product.getPrice(), entry.getValue()));
        }

        order.setOrderItems(orderItems);

        Order saveOrder = orderRepository.save(order);

        return new OrderDTO(saveOrder.getId(), saveOrder.getTotalAmount(),
                saveOrder.getStatus(), saveOrder.getOrderDate(), orderItemDTOs);
    }





    public List<OrderDTO> getAllOrders() {
        List<Order> orders =  orderRepository.findAllOrderWithUsers();
        return orders.stream().map(this :: convertToDTO).collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Order order) {  //converting orderDTO to orderItemDTO
        List<OrderItemDTO> orderItems = order.getOrderItems().stream()
                .map(item->new OrderItemDTO(
                        item.getProduct().getName(),
                        item.getProduct().getPrice(),
                        item.getQuantity())).collect(Collectors.toList());

        return new OrderDTO(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getOrderDate(),
                order.getUser() != null ? order.getUser().getName() : "Unknown",
                order.getUser() != null ? order.getUser().getEmail() : "Unknown",
                orderItems
        );
    }






    public List<OrderDTO> getOrderByUser(Long userId) {
        Optional<User> userOp = userRepository.findById(userId); //Optional is used to prevent null pointer exception
        if(userOp.isEmpty()) {
            throw new RuntimeException("user not found");
        }
        User user = userOp.get();
        List<Order> orderList = orderRepository.findByUser(user);
        return orderList.stream().map(this :: convertToDTO).collect(Collectors.toList());
    }
}
