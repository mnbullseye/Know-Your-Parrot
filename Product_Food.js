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
            
            const productsList = data.food; 

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
// --- Cart Utility Functions (Duplicated for standalone use) ---
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to handle adding a product to the cart
function addToCart(productId, productDetails) {
    let cart = getCart();
    // Ensure productId is treated as a string for consistent lookups
    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
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

// --- Product Display Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const productsContainer = document.getElementById('products-container');
    
    // Sidebar toggle functionality (optional, but good practice to include if needed)
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
    
    loadProducts();

    async function loadProducts() {
        try {
            // Note: This assumes you have a products.json file.
            const response = await fetch('products.json');
            
            if (!response.ok) {
                throw new Error('Failed to load products. Check the JSON file path.');
            }
            
            const data = await response.json();
            const productsList = data.food; 

            // IMPORTANT: Save ALL product data to localStorage for the cart/checkout pages to look up details
            localStorage.setItem('allProductsData', JSON.stringify(data)); 
            
            productsList.forEach(product => {
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