package com.example.Ecomm.repo;


import com.example.Ecomm.model.Order;
import com.example.Ecomm.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o from Order o JOIN FETCH o.user") //this is a jpa query not exact sql query
    List<Order> findAllOrderWithUsers();

    List<Order> findByUser(User user);

}
