package com.example.Ecomm.service;

import com.example.Ecomm.model.Cart;
import com.example.Ecomm.model.PaymentOrder;
import com.example.Ecomm.model.User;
import com.example.Ecomm.repo.PaymentRepo;
import com.example.Ecomm.repo.UserRepository;
import com.razorpay.Order;
import com.razorpay.Payment;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    public String createOrder(PaymentOrder orderDetails) throws RazorpayException {
        RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int)(orderDetails.getAmount()*100));
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + UUID.randomUUID());

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        System.out.println(razorpayOrder.toString());

        orderDetails.setOrderId(razorpayOrder.get("id"));
        orderDetails.setStatus("CREATED");
        orderDetails.setCreatedAt(LocalDateTime.now());

        paymentRepo.save(orderDetails);

        return razorpayOrder.toString();
    }

    public void updateOrderStatus(String orderId, String orderStatus) {
        PaymentOrder paymentOrder = paymentRepo.getByOrderId(orderId);
        paymentOrder.setStatus(orderStatus);
        paymentRepo.save(paymentOrder);

        if("SUCCESS".equalsIgnoreCase(orderStatus)) {
            User user = userRepository.findByEmail(paymentOrder.getEmail());
            Cart cart = cartService.findCartByUserId(user.getId());

            emailService.sendEmail(orderService.createOrder(user.getId(), cart.getCartItems()), paymentOrder.getOrderId());
        }
    }
}
