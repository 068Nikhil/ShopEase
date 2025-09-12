package com.example.Ecomm.service;

import com.example.Ecomm.model.Cart;
import com.example.Ecomm.model.CartItem;
import com.example.Ecomm.model.Product;
import com.example.Ecomm.model.User;
import com.example.Ecomm.repo.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;


    public Cart findCartByUserId(Long userId) {
        User user = userService.findById(userId);
        return cartRepository.findByUser(user);

        //we can also directly use the following-
        // cartRepository.findByUserId(userId);
        //without finding the user first
        //even we do not have any Long userId field in Cart class
        //because there is a column named user_id for cart in DB
    }


    public Cart addToCart(Long userId, Long productId) {
        Product product = productService.getProductById(productId);
        Cart cart = findCartByUserId(userId);

        CartItem cartItem = new CartItem();
        cartItem.setProduct(product);
        cartItem.setCart(cart);
        cartItem.setPrice(product.getPrice());
        cartItem.setQuantity(1);
        cartItem.setTotalPrice(cartItem.getQuantity() * cartItem.getPrice());

        List<CartItem> cartItems = cart.getCartItems();

        if(cartItems.isEmpty()) {
            cartItems.add(cartItem);
            return cartRepository.save(cart);
        } else {
            for(CartItem item : cartItems) {
                if(item.getProduct().getId() == product.getId()) {
                    item.setQuantity(item.getQuantity() + 1);
                    return cartRepository.save(cart);
                }
            }

        }

        cartItems.add(cartItem);
        return cartRepository.save(cart);

    }


    public Cart updateCart(Cart cart) {
        return cartRepository.save(cart);
    }


}
