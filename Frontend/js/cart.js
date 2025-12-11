

async function addToCart(id) {

  let currentUserCart = await getCurrentUser();

  try {
    console.log("Adding product to cart");

    const response = await fetch(BASE_URL + "/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        userId: currentUserCart.id,
        productId: id,
      }),
    });

    updateCartCounter();
  } catch (error) {
    console.log("error while adding to cart");
  }
}

async function updateCartCounter() {

  let currentUserCart = await getCurrentUser();

  try {
    const response = await fetch(BASE_URL + `/cart?userId=${currentUserCart.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const cart = await response.json();
    document.getElementById("cart-badge").innerText = cart.cartItems.length;
  } catch (error) {
    console.log("error updating counter")
  }
}

async function loadCart() {

  let currentUserCart = await getCurrentUser();

  try {
    const response = await fetch(BASE_URL + `/cart?userId=${currentUserCart.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const cart = await response.json();

    let totalAmount = 0;

    let cartItemsTable = document.getElementById("cart-items");
    cartItemsTable.innerHTML = "";

    cart.cartItems.forEach((item, index) => {
      let itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;

      cartItemsTable.innerHTML += ` 
        
            <tr>
                <td><img src="${item.product.imageUrl}" width="50" ></td>
                <td>${item.product.name}</td>
                <td>₹${item.product.price}</td>
                <td>
                    <button class="btn btn-secondary" onclick="changeQuantity(${index},-1)">-</button>
                    ${item.quantity}
                    <button class="btn btn-secondary" onclick="changeQuantity(${index},1)">+</button>
                </td>
                <td>₹ ${itemTotal}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">X</button></td>
            </tr>
        
        `;
    });
    document.getElementById("total-amount").innerHTML = totalAmount;
  } catch (error) { 
    console.log("error loading cart"); 
  }
}

async function changeQuantity(index, change) {

  let currentUserCart = await getCurrentUser();

  try {
    const response = await fetch(BASE_URL + `/cart?userId=${currentUserCart.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const cart = await response.json();

    cart.cartItems[index].quantity += change;

    if (cart.cartItems[index].quantity <= 0) {
      cart.cartItems.splice(index, 1);
    }

    const responseUpdated = await fetch(BASE_URL + "/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    loadCart();
    updateCartCounter();
  } catch (error) {
    console.log("error while changing quantity");
  }
}

async function removeFromCart(index) {

  let currentUserCart = await getCurrentUser();

  try {
    const response = await fetch(BASE_URL + `/cart?userId=${currentUserCart.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const cart = await response.json();

    cart.cartItems.splice(index, 1);

    const responseUpdated = await fetch(BASE_URL + "/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart),
    });

    loadCart();
    updateCartCounter();
  } catch (error) {
    console.log("error while removing from cart");
  }
}

document.addEventListener("DOMContentLoaded", loadCart);
