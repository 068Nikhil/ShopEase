package com.example.Ecomm.repo;

import com.example.Ecomm.model.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepo extends JpaRepository<PaymentOrder, Long> {
    public PaymentOrder getByOrderId(String orderId);
}
