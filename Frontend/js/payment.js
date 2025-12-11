document.addEventListener("DOMContentLoaded", () => {
    const payBtn = document.querySelector("#pay-button");
    if(payBtn) {
        payBtn.addEventListener("click", checkout);
    }
})

async function checkout() {

    try {

        let currentUserPayment = await getCurrentUser();

        const response = await fetch(BASE_URL + `/users/${currentUserPayment.id}`, {
            method: "GET"
        });

        const userObj = await response.json();

        const amount = Number(document.getElementById("total-amount").textContent);


        const responseCreate = await fetch(BASE_URL + "/payment/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: userObj.email,
                name: userObj.name,
                amount: amount
            })
        });


        const result = await responseCreate.json();

        const options = {
            key: "rzp_test_R8uF60QGa1JgYb",
            amount: amount * 100,
            currency: "INR",
            name: "ShopEase Shopping",
            description: "Payment for Checkout",
            order_id: result.id,
            theme: {
                color: "#ff6600",
            },
            prefill: {
                name: userObj.name,
                email: userObj.email
            },
            modal: {
                backdropclose: false,
                escape: false
            },

            handler: async function(response) {
                await fetch(BASE_URL + "/payment/update-order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: new URLSearchParams({
                        orderId: response.razorpay_order_id,
                        orderStatus: "SUCCESS"
                    })
                });

                alert("Payment Successful");
            }   
        };
        
        const rzp = new Razorpay(options);
        rzp.open();

    }  catch(err) {
        console.error(err);
        alert("error during payment", err);
    }
}