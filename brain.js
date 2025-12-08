document.addEventListener('DOMContentLoaded', () => {

    const SHIPPING_COST = 250; 
    
    // --- Cart Utility Functions ---
    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

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
    
    // --- Cart Page Rendering (Cart.html) ---

    function calculateTotals(cart) {
        let subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        let total = subtotal + SHIPPING_COST;
        return { subtotal, total };
    }

    function updateCartSummary(subtotal) {
        const total = subtotal + SHIPPING_COST;
        const subtotalDisplay = document.querySelector(".subtotal .summary-text");
        const totalDisplay = document.querySelector(".total .summary-text");
        const checkoutButton = document.getElementById('checkout-button');

        if (subtotalDisplay) subtotalDisplay.textContent = `Rs.${subtotal.toFixed(2)}`;
        if (totalDisplay) totalDisplay.textContent = `Rs.${total.toFixed(2)}`;

        // Disable checkout button if cart is empty
        if (checkoutButton) {
             checkoutButton.disabled = (subtotal === 0);
             checkoutButton.parentElement.style.pointerEvents = (subtotal === 0) ? 'none' : 'auto';
             checkoutButton.style.opacity = (subtotal === 0) ? 0.6 : 1;
        }
    }

    function renderCartPage() {
        const cart = getCart();
        const itemsContainer = document.querySelector(".items-container");
        let subtotal = 0;

        if (!itemsContainer) return; // Not on the Cart.html page

        itemsContainer.innerHTML = ''; 

        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p style="padding: 2rem; text-align: center;">Your cart is empty. Add some items from the shop!</p>';
            updateCartSummary(0);
            return;
        } 

        cart.forEach(item => {
            const itemHTML = `
                <div class="item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-summary">
                        <h4>${item.name}</h4>
                        <div class="count-container">
                            <button class="dec-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span class="count">${item.quantity}</span>
                            <button class="inc-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                        <p><span class="quantity">${item.quantity}</span> x Rs.<span class="price">${item.price.toFixed(2)}</span></p>
                    </div>
                </div>
            `;
            itemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        const totals = calculateTotals(cart);
        updateCartSummary(totals.subtotal);
    }

    // Expose updateQuantity globally so inline onclick handlers can use it
    window.updateQuantity = function(itemId, delta) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id == itemId);

        if (itemIndex > -1) {
            cart[itemIndex].quantity += delta;

            if (cart[itemIndex].quantity <= 0) {
                if (confirm(`Remove ${cart[itemIndex].name} from cart?`)) {
                    cart.splice(itemIndex, 1);
                } else {
                    cart[itemIndex].quantity = 1; // Revert to 1 if canceled
                }
            }
            saveCart(cart);
            renderCartPage(); // Re-render the cart to update the display
        }
    }

    // Initial load for Cart Page
    if (document.querySelector(".items-container")) {
        renderCartPage();
    }


    // --- Checkout Page Rendering (CheckOut.html) ---

    function renderCheckoutSummary() {
        const cart = getCart();
        const checkoutCartItems = document.querySelector('.cart-summary .cart-items');
        const totals = calculateTotals(cart);
        
        const checkoutSubtotal = document.getElementById('checkout-subtotal');
        const checkoutShipping = document.getElementById('checkout-shipping');
        const checkoutTotal = document.getElementById('checkout-total');
        const checkoutBtn = document.querySelector('.checkout-btn');

        if (!checkoutCartItems) return; // Not on the CheckOut.html page

        checkoutCartItems.innerHTML = '';
        
        if (cart.length === 0) {
            checkoutCartItems.innerHTML = '<p style="padding: 1rem; text-align: center;">Your cart is empty. Please return to the shop.</p>';
            if (checkoutBtn) checkoutBtn.disabled = true; 
        } else {
            if (checkoutBtn) checkoutBtn.disabled = false;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                const itemHTML = `
                    <div class="cart-item">
                        <div class="item-details">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="item-info">
                                <span class="quantity">${item.quantity}</span>
                                <p class="name">${item.name}</p>
                            </div>
                        </div>
                        <span class="price">Rs.${itemTotal.toFixed(2)}</span>
                    </div>
                `;
                checkoutCartItems.insertAdjacentHTML('beforeend', itemHTML);
            });
        }
        
        // Update Summary
        if (checkoutSubtotal) checkoutSubtotal.textContent = `Rs.${totals.subtotal.toFixed(2)}`;
        if (checkoutShipping) checkoutShipping.textContent = `Rs.${SHIPPING_COST.toFixed(2)}`;
        if (checkoutTotal) checkoutTotal.textContent = `Rs.${totals.total.toFixed(2)}`;
    }

    // Initial load for Checkout Page
    if (document.querySelector('.cart-summary')) {
        renderCheckoutSummary();
    }

    // Checkout Form Submission (Simplified)
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutBtn = document.querySelector('.checkout-btn');

    if (checkoutForm && checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Basic form validation for required fields
            const requiredFields = checkoutForm.querySelectorAll('[required]');
            let allValid = true;
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    allValid = false;
                }
            });

            if (!allValid) {
                alert('Please fill out all required fields marked with *.');
            } else if (getCart().length === 0) {
                alert('Your cart is empty. Cannot place an order.');
            } else {
                alert('Order Confirmed and Placed! (Cart has been cleared)');
                
                // Clear cart after successful 'submission'
                saveCart([]);
                // Optional: Redirect to a Thank You page if it exists
                // window.location.href = "ThankYou.html"; 
                
                // Re-render the summary to show an empty cart
                if (document.querySelector('.cart-summary')) {
                    renderCheckoutSummary();
                } else if (document.querySelector(".items-container")) {
                    renderCartPage();
                }
            }
        });
        
       
    }
});