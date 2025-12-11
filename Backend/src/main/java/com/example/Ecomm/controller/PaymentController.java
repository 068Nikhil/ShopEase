package com.example.Ecomm.controller;

import com.example.Ecomm.model.PaymentOrder;
import com.example.Ecomm.service.PaymentService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody PaymentOrder paymentOrder) {
        try {
            String serviceOrder = paymentService.createOrder(paymentOrder);
            return ResponseEntity.ok(serviceOrder);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating order...");
        }
    }


    @PostMapping("/update-order")
    public ResponseEntity<String> updateOrderStatus(@RequestParam String orderId, @RequestParam String orderStatus) {
        paymentService.updateOrderStatus(orderId, orderStatus);
        System.out.println("Email sent Successfully...");
        return ResponseEntity.ok("Order status updated and Email sent successfully");
    }
}
