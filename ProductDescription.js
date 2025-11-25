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

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        loadProductDetails(productId);
    } else {
        document.getElementById('product-name').textContent = 'Error: No product ID found in the URL.';
    }
});

async function loadProductDetails(targetId) {
    try {
        const response = await fetch('products.json');
        
        if (!response.ok) {
            throw new Error('Catalog failed to load.');
        }
        
        const data = await response.json();
        
        let product = null;
        for (const category in data) {
            product = data[category].find(p => p.id === targetId);
            if (product) break; 
        }

        if (product) {
            document.getElementById('product-name').textContent = `${product.title}: ${product.title_line}`;
            document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
            document.getElementById('product-long-description').textContent = product.description;
            document.getElementById('product-image').src = product.image_url;
            document.getElementById('product-image').alt = product.title;
            document.getElementById('add-to-cart-btn').setAttribute('data-product-id', product.id);
        } else {
            document.getElementById('product-name').textContent = 'Product Not Found in Catalog';
        }

    } catch (error) {
        console.error('Error loading product details:', error);
        document.getElementById('product-name').textContent = 'Error Loading Data (Check Network)';
    }
}


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
 * Adds a product (with quantity) to the cart in localStorage.
 * @param {string} productId - The unique ID of the product.
 * @param {number} quantity - The quantity to add.
 * @param {object} productDetails - The full details of the product (title, price, image_url).
 */
function addToCart(productId, quantity, productDetails) {
    let cart = getCart();
    // Ensure productId is treated as a string for consistent lookups
    const existingItem = cart.find(item => String(item.id) === String(productId));

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: String(productId), 
            name: productDetails.title,
            price: productDetails.price,
            image: productDetails.image_url,
            quantity: quantity
        });
    }

    saveCart(cart);
    alert(`Added ${quantity} x ${productDetails.title} to cart!`);
}


// --- Product Page Logic ---

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    // Store product details temporarily for cart addition
    let currentProduct = null;

    if (productId) {
        loadProductDetails(productId);
    } else {
        document.getElementById('product-name').textContent = 'Error: No product ID found in the URL.';
    }

    // Attach event listener to the "Add to Cart" button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const quantityInput = document.getElementById('quantity');

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (!currentProduct) {
                alert('Product details not loaded yet. Please wait or refresh.');
                return;
            }

            const id = addToCartBtn.getAttribute('data-product-id');
            const quantity = parseInt(quantityInput.value, 10);

            if (id && quantity > 0) {
                addToCart(id, quantity, currentProduct);
            } else {
                alert('Please enter a valid quantity.');
            }
        });
    }

    // --- Core Loading Function ---
    async function loadProductDetails(targetId) {
        try {
            const response = await fetch('products.json');
            
            if (!response.ok) {
                throw new Error('Catalog failed to load.');
            }
            
            const data = await response.json();
            
            let product = null;
            // Iterate through categories (food, toys, accessories) to find the product
            for (const category in data) {
                // Ensure IDs are compared as strings if the source JSON uses strings
                product = data[category].find(p => String(p.id) === String(targetId));
                if (product) break; 
            }

            if (product) {
                // Store the loaded product details globally
                currentProduct = product; 

                // Update HTML elements
                document.getElementById('product-name').textContent = `${product.title}`;
                // Assuming 'title_line' is removed as it's not in the previous output, or just use the title
                document.getElementById('page-title').textContent = product.title; 
                document.getElementById('product-price').textContent = `Rs.${product.price.toFixed(2)}`;
                document.getElementById('product-long-description').textContent = product.description;
                document.getElementById('product-image').src = product.image_url;
                document.getElementById('product-image').alt = product.title;
                document.getElementById('add-to-cart-btn').setAttribute('data-product-id', product.id);
            } else {
                document.getElementById('product-name').textContent = 'Product Not Found in Catalog';
            }

        } catch (error) {
            console.error('Error loading product details:', error);
            document.getElementById('product-name').textContent = 'Error Loading Data (Check Network)';
        }
    }
});