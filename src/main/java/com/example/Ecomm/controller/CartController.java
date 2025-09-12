package com.example.Ecomm.controller;

import com.example.Ecomm.model.Cart;
import com.example.Ecomm.model.CartItem;
import com.example.Ecomm.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public Cart findCartByUserId(@RequestParam Long userId) {
        return cartService.findCartByUserId(userId);
    }

    @PostMapping
    public Cart addToCart(@RequestParam Long userId, @RequestParam Long productId) {
        return cartService.addToCart(userId, productId);
    }


    @PostMapping("/update")
    public Cart updateCart(@RequestBody Cart cart) {
        return cartService.updateCart(cart);
    }
}
