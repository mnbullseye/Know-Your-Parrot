document.addEventListener('DOMContentLoaded', () => {
    // This is the container where all product cards will be placed
    const productsContainer = document.getElementById('products-container');
    
    // Start the process of loading the products
    loadProducts();

    async function loadProducts() {
        try {
            // 1. Fetch the data from your JSON file
            const response = await fetch('products.json');
            
            // If the file loads but returns an error (like a 404), catch it
            if (!response.ok) {
                throw new Error('Failed to load products. Check the JSON file path.');
            }
            
            const data = await response.json();
            
            // We want to display the 'toys' category products on this page
            const productsList = data.food; 

            // 2. Loop through the list of toys and create the HTML for each one
            productsList.forEach(product => {
                
                // Use the product data to create a product card string
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
                
                // 3. Add the HTML string to the container
                productsContainer.insertAdjacentHTML('beforeend', productHTML);
            });
            
            // Note: In the next step, you would call the function to attach 
            // the 'Add to Cart' functionality here.

        } catch (error) {
            // 4. Display a simple error message if loading failed
            console.error('Error loading products:', error);
            productsContainer.innerHTML = '<h2>🚨 Error: Could not load product data. Check the console for details.</h2>';
        }
    }
    
});