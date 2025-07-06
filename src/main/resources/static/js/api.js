//const BASE_URL = "fetch('http://localhost:8080')"

async function loadProducts() {

    try {
        const response = await fetch(`/products`);
        const products = await response.json();

        let trendingList = document.getElementById("trending-products");
        let clothingList = document.getElementById("clothing-products");
        let electronicsList = document.getElementById("electronics-products");

        trendingList.innerHTML="";
        clothingList.innerHTML="";
        electronicsList.innerHTML="";
        // console.log(products);

        products.forEach((product) => {
            
            let productCard = `
                <div class="col-lg-4 col-md-d">
                    <div class="card h-100">

                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price"><strong>₹${product.price}</strong></p>
                        <button class="btn btn-primary mt-auto"
                        onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.imageUrl}')">Add to Cart</button>
                        
                    </div>
                    
                </div>
                
            `;

            if(product.category === "Clothing") {
                clothingList.innerHTML += productCard;
            } else if(product.category === "Electronics") {
                electronicsList.innerHTML += productCard;
            } else {
                trendingList.innerHTML += productCard;
            }

        });

    } catch(error) {

        console.log("Error fetching products : ", error); 
    }
}