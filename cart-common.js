document.addEventListener('DOMContentLoaded', () => {
    // 🛍️ The core state of our cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Selectors for key elements
    const cartIcons = document.querySelectorAll('.cart-icon');
    const cartCountSpans = document.querySelectorAll('.cart-count');
    const cartPopup = document.getElementById('shopping-cart-popup');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const cartSubtotalSpan = document.getElementById('cart-subtotal');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const notification = document.getElementById('add-to-cart-notification');
    
    // Selectors for modal
    const modalQuantityInput = document.getElementById('modalProductQuantity');

    // 🔄 Function to update the cart count across all icons
    const updateCartCount = () => {
        const uniqueProducts = cart.length; // Count unique products, not total quantity
        cartCountSpans.forEach(span => {
            span.textContent = uniqueProducts;
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    // ➕ Function to add a product to the cart
    const addToCart = (product, quantity = 1) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        updateCartCount();
        showNotification(`${product.name} added to cart!`);
        renderCart();
    };

    // ➖ Function to decrease the quantity of a product - removes product when quantity reaches 0
    const decreaseQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        updateCartCount();
        renderCart();
    };

    // ⬆️ Function to increase the quantity of a product
    const increaseQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
        }
        updateCartCount();
        renderCart();
    };

    // 🎨 Function to render the cart's content dynamically
    const renderCart = () => {
        if (!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;
        
        // Handle button visibility based on cart state
        const cartButtons = document.getElementById('cart-buttons');
        const checkoutButtons = document.getElementById('checkout-buttons');
        const subtotalSection = document.getElementById('subtotal-section');

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart text-center py-5">
                    <p class="text-muted mb-0">No products in the cart.</p>
                </div>
            `;
            if (cartSubtotalSpan) cartSubtotalSpan.textContent = '$0.00';
            
            // Show Continue Shopping button, hide checkout buttons and subtotal
            if (cartButtons) cartButtons.style.display = 'block';
            if (checkoutButtons) checkoutButtons.style.display = 'none';
            if (subtotalSection) subtotalSection.style.display = 'none';
            return;
        }
        
        // Hide Continue Shopping button, show checkout buttons and subtotal
        if (cartButtons) cartButtons.style.display = 'none';
        if (checkoutButtons) checkoutButtons.style.display = 'block';
        if (subtotalSection) subtotalSection.style.display = 'flex';
        
        // Add empty class to cart body
        const cartBody = document.querySelector('.cart-body');
        if (cartBody) cartBody.classList.add('empty');

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item', 'mb-3', 'pb-3', 'border-bottom');
            itemElement.setAttribute('data-id', item.id);
            
            const itemPrice = item.price * item.quantity;
            subtotal += itemPrice;

            itemElement.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                    <div class="flex-grow-1">
                        <p class="category text-muted mb-1 small">${item.category}</p>
                        <h6 class="mb-2 fw-semibold" style="font-size: 14px; color: #f4b942;">${item.name}</h6>
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="quantity-controls d-flex align-items-center">
                                <button class="btn btn-sm btn-outline-secondary decrease-popup-qty" data-id="${item.id}" style="width: 25px; height: 25px; font-size: 12px; padding: 0; display: flex; align-items: center; justify-content: center;">-</button>
                                <span class="mx-2 popup-quantity" style="min-width: 20px; text-align: center;">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary increase-popup-qty" data-id="${item.id}" style="width: 25px; height: 25px; font-size: 12px; padding: 0; display: flex; align-items: center; justify-content: center;">+</button>
                            </div>
                            <span class="fw-bold popup-item-total" style="color: #f4b942;">$${itemPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                    <button class="btn btn-sm text-muted remove-popup-item" data-id="${item.id}" style="border: none; background: none; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-times" style="font-size: 12px;"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        if (cartSubtotalSpan) cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
        
        // Force update button visibility
        setTimeout(() => {
            if (cartButtons) cartButtons.style.display = 'none';
            if (checkoutButtons) checkoutButtons.style.display = 'block';
        }, 10);
    };

    // 🔔 Function to show a temporary notification
    const showNotification = (message = 'Item added to cart! 🎉') => {
        if (!notification) return;
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    };

    // Event Delegation for all interactive elements
    document.addEventListener('click', (e) => {
        // Increase quantity button in cart popup
        if (e.target.classList.contains('increase-popup-qty')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            increaseQuantity(productId);
        }

        // Decrease quantity button in cart popup
        if (e.target.classList.contains('decrease-popup-qty')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            decreaseQuantity(productId);
        }

        // Remove item from cart
        if (e.target.classList.contains('fa-times') && e.target.closest('.remove-popup-item')) {
            const productId = parseInt(e.target.closest('.remove-popup-item').getAttribute('data-id'));
            cart = cart.filter(item => item.id !== productId);
            updateCartCount();
            renderCart();
        }
        
        // VIEW CART button click
        if (e.target.textContent.trim() === 'VIEW CART' || 
            (e.target.tagName === 'BUTTON' && e.target.textContent.includes('VIEW CART'))) {
            e.preventDefault();
            window.location.href = 'cart.html';
        }
        
        // CHECKOUT button click
        if (e.target.textContent.trim() === 'CHECKOUT' || 
            (e.target.tagName === 'BUTTON' && e.target.textContent.includes('CHECKOUT'))) {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before checkout.');
                return;
            }
            window.location.href = 'checkout.html';
        }
    });

    // 🔍 Toggle cart popup visibility
    const toggleCartPopup = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartPopup) {
            cartPopup.classList.toggle('visible');
            if (cartPopup.classList.contains('visible')) {
                renderCart();
            }
        }
    };

    cartIcons.forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', toggleCartPopup);
    });
    
    document.querySelectorAll('.fa-basket-shopping').forEach(icon => {
        icon.style.cursor = 'pointer';
        icon.addEventListener('click', toggleCartPopup);
    });

    // ❌ Close button for the cart popup
    if (closeCartBtn && cartPopup) {
        closeCartBtn.addEventListener('click', () => {
            cartPopup.classList.remove('visible');
        });
    }

    // 🌎 Hide cart when clicking outside of it
    document.addEventListener('click', (e) => {
        const isCartIcon = e.target.closest('.cart-icon');
        const isInsideCart = cartPopup && cartPopup.contains(e.target);
        const isCartControl = e.target.closest('.decrease-popup-qty, .increase-popup-qty, .remove-popup-item');

        if (cartPopup && cartPopup.classList.contains('visible') && !isInsideCart && !isCartIcon && !isCartControl) {
            cartPopup.classList.remove('visible');
        }
    });

    // Listen for cart updates from other pages
    window.addEventListener('cartUpdated', () => {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        updateCartCount();
        if (cartPopup && cartPopup.classList.contains('visible')) {
            renderCart();
        }
    });
    
    // Observer for cart popup visibility changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                if (cartPopup && cartPopup.classList.contains('visible')) {
                    cart = JSON.parse(localStorage.getItem('cart')) || [];
                    renderCart();
                }
            }
        });
    });
    
    if (cartPopup) {
        observer.observe(cartPopup, { attributes: true });
    }
    
    // Initial render
    updateCartCount();
    renderCart();

    // Expose primary cart functionality globally
    window.cartManager = {
        addToCart: addToCart,
        updateCartCount: updateCartCount,
        renderCart: renderCart
    };
});