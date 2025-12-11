const BASE_URL = "http://localhost:8080"; 
async function loadProducts() {

  let loggedIn = false;

  let currentUserApi = await getCurrentUser();
  if (currentUserApi != null) {
    loggedIn = true;
  }

  try {
    const response = await fetch(BASE_URL + "/products");
    const products = await response.json();

    let trendingList = document.getElementById("trending-products");
    let clothingList = document.getElementById("clothing-products");
    let electronicsList = document.getElementById("electronics-products");

    trendingList.innerHTML = "";
    clothingList.innerHTML = "";
    electronicsList.innerHTML = "";

    products.forEach((product) => {
      let productCard = "";  
      if (!loggedIn) {
        productCard = `
                <div class="col-lg-4 col-md-d">
                    <div class="card h-100">

                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price"><strong>₹${product.price}</strong></p>
                        <button 
                            class="btn btn-primary mt-auto"
                            onclick="alert('Please Login First'); window.location.href='login.html';"
                            >Add to Cart
                        </button>
                        
                    </div>
                    
                </div>
                
            `;
      } else {
        
        productCard = `
                <div class="col-lg-4 col-md-d">
                    <div class="card h-100">

                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="price"><strong>₹${product.price}</strong></p>
                        <button 
                            class="btn btn-primary mt-auto"
                            
                            onclick="addToCart(${product.id})"
                            >Add to Cart
                        </button>
                        
                    </div>
                    
                </div>
                
            `;
      }

      if (product.category === "Clothing") {
        clothingList.innerHTML += productCard;
      } else if (product.category === "Electronics") {
        electronicsList.innerHTML += productCard;
      } else {
        trendingList.innerHTML += productCard;
      }
    });
  } catch (error) {
    console.log("Error fetching products : ", error);
  }
}
