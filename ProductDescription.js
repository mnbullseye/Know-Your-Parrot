document.addEventListener('DOMContentLoaded', () => {
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