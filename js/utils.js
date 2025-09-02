// Shared utility functions for wishlist and cart management

// Wishlist functions - Using Set for unique product storage
function getWishlist() {
    const wishlistData = localStorage.getItem('wishlist');
    return wishlistData ? new Set(JSON.parse(wishlistData)) : new Set();
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(Array.from(wishlist)));
}

function addToWishlist(productId) {
    const wishlist = getWishlist();
    wishlist.add(productId.toString()); // Ensure string ID for consistency
    saveWishlist(wishlist);
    updateWishlistCount();
    return wishlist;
}

function removeFromWishlist(productId) {
    const wishlist = getWishlist();
    wishlist.delete(productId.toString()); // Ensure string ID for consistency
    saveWishlist(wishlist);
    updateWishlistCount();
    return wishlist;
}

function isInWishlist(productId) {
    const wishlist = getWishlist();
    return wishlist.has(productId.toString()); // Ensure string ID for consistency
}

// Update wishlist count badge
function updateWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    if (wishlistCount) {
        const wishlist = getWishlist();
        wishlistCount.textContent = wishlist.size;
        wishlistCount.style.display = wishlist.size > 0 ? 'block' : 'none';
    }
}

// Cart functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Initialize both counts on page load
function initHeaderCounts() {
    updateWishlistCount();
    updateCartCount();
}

// Add to cart function
function addToCart(product, quantity = 1) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            current_price: product.current_price,
            old_price: product.old_price,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    updateCartCount();
    return cart;
}

// Remove from cart function
function removeFromCart(index) {
    let cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    return cart;
}

// Change cart quantity
function changeCartQuantity(index, change) {
    let cart = getCart();
    const item = cart[index];
    const newQty = item.quantity + change;
    
    if (newQty < 1) {
        return removeFromCart(index);
    }
    
    item.quantity = newQty;
    saveCart(cart);
    updateCartCount();
    return cart;
}
