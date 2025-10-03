// cart.js - Enhanced cart functionality for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced cart functionality
    const enhanceCartButtons = () => {
        // Handle VIEW CART button clicks
        document.addEventListener('click', function(e) {
            if (e.target.textContent.trim() === 'VIEW CART' || 
                (e.target.tagName === 'BUTTON' && e.target.textContent.includes('VIEW CART'))) {
                e.preventDefault();
                window.location.href = 'cart.html';
            }
            
            // Handle CHECKOUT button clicks
            if (e.target.textContent.trim() === 'CHECKOUT' || 
                (e.target.tagName === 'BUTTON' && e.target.textContent.includes('CHECKOUT'))) {
                e.preventDefault();
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                if (cart.length === 0) {
                    alert('Your cart is empty. Please add items before checkout.');
                    return;
                }
                window.location.href = 'checkout.html';
            }
        });
    };

    // Initialize enhanced cart functionality
    enhanceCartButtons();
});