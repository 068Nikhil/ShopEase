package com.example.Ecomm.service;

import com.example.Ecomm.model.Order;
import com.example.Ecomm.model.OrderItem;
import com.example.Ecomm.model.User;
import com.example.Ecomm.repo.OrderRepository;
import com.example.Ecomm.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private OrderRepository orderRepository;

    public void sendEmail(Order order, String paymentOrderId) {

        StringBuilder itemsBuilder = new StringBuilder();
        for (OrderItem item : order.getOrderItems()) {
            itemsBuilder.append("- ")
                    .append(item.getProduct().getName())  
                    .append(" x ")
                    .append(item.getQuantity())
                    .append(" @ ₹")
                    .append(item.getPrice())
                    .append(" = ₹")
                    .append(item.getTotalPrice())
                    .append("\n");
        }

        User user = order.getUser();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("✅ Payment Successful - ShopEase");
        message.setText("Hi " + user.getName() + ",\n" +
                "Your payment of ₹" + order.getTotalPrice() + " was successful." +
                " Your order has been PLACED.\n" +
                "Thank you for shopping.\n\n" +
                "Order Details :-\n\n" +
                "Order ID : " + paymentOrderId + "\n" +
                "Order Date : " + order.getOrderDate() + "\n\n" +
                "Items : \n" +
                itemsBuilder.toString());

        mailSender.send(message);
    }
}
