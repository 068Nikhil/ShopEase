async function loadUserProfile() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            window.location.href = "login.html";
            return;
        }

        document.getElementById("user-name").textContent = currentUser.name;
        document.getElementById("user-email").textContent = currentUser.email;

        // Load user orders
        await loadUserOrders(currentUser.id);

    } catch (error) {
        console.error("Error loading user profile:", error);
        showErrorState("Error loading profile. Please try again later.");
    }
}


async function loadUserOrders(userId) {
    try {
        const response = await fetch(BASE_URL + `/users/${userId}/orders`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const orders = await response.json();
        displayOrders(orders);

    } catch (error) {
        console.error("Error loading orders:", error);
        showErrorState("Unable to load orders. Please check your connection and try again.");
    }
}


function displayOrders(orders) {
    const loadingState = document.getElementById("loading-state");
    const ordersContainer = document.getElementById("orders-container");
    
    // Hide loading state
    loadingState.style.display = "none";

    if (!orders || orders.length === 0) {
        showEmptyOrdersState(ordersContainer);
        return;
    }

    // Sort orders by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    let orderCount = 1;
    let ordersHTML = "";
    orders.forEach(order => {
        ordersHTML += generateOrderHTML(order, orderCount);
        orderCount++;
    });

    ordersContainer.innerHTML = ordersHTML;
}


function generateOrderHTML(order, orderCount) {
    const orderDate = formatOrderDate(order.orderDate);
    const statusClass = getStatusClass(order.status);
    const orderItemsHTML = generateOrderItemsHTML(order.orderItems || []);
    
    // Show cancel button only for PLACED orders
    const cancelButton = order.status.toUpperCase() === 'PLACED' ? 
        `<button class="btn btn-outline-danger btn-sm ms-2" onclick="cancelOrder(${order.id})">
            <i class="fas fa-times me-1"></i>Cancel Order
        </button>` : '';
    
    return `
        <div class="order-card">
            <div class="order-header">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">Order #${orderCount}</h5>
                        <small>Placed on ${orderDate}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="status-badge ${statusClass}">${order.status}</span>
                        ${cancelButton}
                    </div>
                </div>
            </div>
            <div class="order-body">
                ${orderItemsHTML}
                <div class="row mt-3 pt-3" style="border-top: 1px solid #dee2e6;">
                    <div class="col-md-6">
                        <strong>Total Items: ${order.orderItems ? order.orderItems.length : 0}</strong>
                    </div>
                    <div class="col-md-6 text-end">
                        <h5 class="mb-0">Total: ₹${order.totalPrice.toFixed(2)}</h5>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function generateOrderItemsHTML(orderItems) {
    if (!orderItems || orderItems.length === 0) {
        return '<div class="order-item"><p class="mb-0 text-muted">No items found</p></div>';
    }

    return orderItems.map(item => `
        <div class="order-item">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${item.product ? item.product.name : 'Product'}</h6>
                    <small class="text-muted">Quantity: ${item.quantity}</small>
                </div>
                <div class="text-end">
                    <span class="fw-bold">₹${item.totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    `).join("");
}


function formatOrderDate(orderDate) {
    return new Date(orderDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}


function getStatusClass(status) {
    switch (status.toLowerCase()) {
        case 'placed':
            return 'status-placed';
        case 'delivered':
            return 'status-delivered';
        case 'cancelled':
            return 'status-cancelled';
        default:
            return 'status-placed';
    }
}


function showEmptyOrdersState(container) {
    container.innerHTML = `
        <div class="no-orders">
            <i class="fas fa-box-open"></i>
            <h4>No Orders Yet</h4>
            <p>Looks like you haven't placed any orders yet.</p>
            <a href="index.html" class="btn btn-primary">
                <i class="fas fa-shopping-bag me-2"></i>Start Shopping
            </a>
        </div>
    `;
}


function showErrorState(message) {
    const loadingState = document.getElementById("loading-state");
    loadingState.innerHTML = `
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
        </div>
    `;
}


async function cancelOrder(orderId) {
    // Show confirmation dialog
    const confirmed = confirm("Are you sure you want to cancel this order? This action cannot be undone.");
    
    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(BASE_URL + "/orders/update-status", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `id=${orderId}&status=CANCELLED`
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Refresh the orders list to reflect changes
        await refreshOrders();

    } catch (error) {
        console.error("Error cancelling order:", error);
        alert("Failed to cancel order. Please try again.");
    }
}


async function refreshOrders() {
    const currentUser = await getCurrentUser();
    if (currentUser) {
        // Show loading state
        const loadingState = document.getElementById("loading-state");
        loadingState.style.display = "block";
        document.getElementById("orders-container").innerHTML = "";
        
        await loadUserOrders(currentUser.id);
    }
}
