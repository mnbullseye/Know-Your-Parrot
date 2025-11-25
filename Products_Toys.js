document.addEventListener('DOMContentLoaded', () => {


    
    // --- Sidebar Toggle Functionality ---
    const navBtn = document.querySelector(".nav-btn");
    const closeBtn = document.querySelector(".close-icon");
    const sidebar = document.querySelector(".sidebar");

    if (navBtn && sidebar && closeBtn) {
        function toggleSidebar() {
            sidebar.classList.toggle("show");
            navBtn.classList.toggle("show"); 
        }
        navBtn.addEventListener("click", toggleSidebar);
        closeBtn.addEventListener("click", toggleSidebar);
    }

    
    const productsContainer = document.getElementById('products-container');
    
    loadProducts();

    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            
            if (!response.ok) {
                throw new Error('Failed to load products. Check the JSON file path.');
            }
            
            const data = await response.json();
            
            const productsList = data.toys; 

            productsList.forEach(product => {
                
                const productHTML = `
                    <div class="product">
                        <a href="Description.html?id=${product.id}">
                            <img src="${product.image_url}" alt="${product.title}">
                        </a>
                        <div class="pro-description">
                            <span>
                                <a href="Description.html?id=${product.id}">${product.title}</a>
                                <p>$${product.price.toFixed(2)}</p>
                            </span>
                            <a href="#" class="add-to-cart" data-product-id="${product.id}">
                                <i class="fa fa-shopping-cart"></i>
                            </a>
                        </div>
                    </div>
                `;
                
                productsContainer.insertAdjacentHTML('beforeend', productHTML);
            });

        } catch (error) {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = '<h2>🚨 Error: Could not load product data. Check the console for details.</h2>';
        }
    }
    
});



// --- Cart Utility Functions ---

/**
 * Retrieves the cart array from localStorage, or returns an empty array if not found.
 */
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

/**
 * Saves the given cart array to localStorage.
 */
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Adds a product (default quantity 1) to the cart in localStorage.
 * @param {string} productId - The unique ID of the product.
 * @param {object} productDetails - The full details of the product (title, price, image_url).
 */
function addToCart(productId, productDetails) {
    let cart = getCart();
    // Ensure productId is treated as a string for consistent lookups
    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Add new item with default quantity 1
        cart.push({
            id: String(productId), 
            name: productDetails.title,
            price: productDetails.price,
            image: productDetails.image_url,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(`Added 1 x ${productDetails.title} to cart!`);
}


// --- Main Product Loading and Initialization Logic ---

document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    
    loadProducts();

    async function loadProducts() {
        try {
            const response = await fetch('products.json');
            
            if (!response.ok) {
                throw new Error('Failed to load products. Check the JSON file path.');
            }
            
            const data = await response.json();
            
            // IMPORTANT: Save ALL product data to localStorage for cart/checkout to use
            localStorage.setItem('allProductsData', JSON.stringify(data)); 
            
            // Focus on the toys category as specified
            const productsList = data.toys; 

            productsList.forEach(product => {
                
                // NOTE: Replacing '$' with 'Rs.' for price display consistency
                const productHTML = `
                    <div class="product">
                        <a href="Description.html?id=${product.id}">
                            <img src="${product.image_url}" alt="${product.title}">
                        </a>
                        <div class="pro-description">
                            <span>
                                <a href="Description.html?id=${product.id}">${product.title}</a>
                                <p>Rs.${product.price.toFixed(2)}</p>
                            </span>
                            <a href="#" class="add-to-cart" data-product-id="${product.id}">
                                <i class="fa fa-shopping-cart"></i>
                            </a>
                        </div>
                    </div>
                `;
                
                productsContainer.insertAdjacentHTML('beforeend', productHTML);
            });
            
            // Add listeners to the newly created 'Add to Cart' buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productId = button.dataset.productId;
                    
                    // Find the full product details from the loaded list
                    const productDetails = productsList.find(p => String(p.id) === String(productId)); 
                    if (productDetails) {
                        addToCart(productId, productDetails);
                    }
                });
            });


        } catch (error) {
            console.error('Error loading products:', error);
            productsContainer.innerHTML = '<h2>🚨 Error: Could not load product data. Check the console for details.</h2>';
        }
    }
    
});