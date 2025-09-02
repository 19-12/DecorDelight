
let cart = [];

function initializeCart() {
    console.log('Initializing cart from localStorage...');
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    console.log('Cart contents:', cart);
    
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (!cartItemsContainer) {
        console.error('Cart items container not found!');
        return;
    }
    
    renderCartItems();
    updateCartTotals();
    
    // header counts
    if (window.initHeaderCounts) {
        window.initHeaderCounts();
    } else {
        initCartCount();
        if (window.initWishlistCount) {
            window.initWishlistCount();
        }
    }
}

// Remove cart 
function removeFromCart(index) {
    console.log(`Removing item at index: ${index}`);
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartTotals();
    updateCartCount();
}

// Change quantity 
function changeQty(index, change) {
    const item = cart[index];
    const newQty = item.quantity + change;
    if (newQty < 1) {
        removeFromCart(index);
        return;
    }
    
    item.quantity = newQty;
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
    updateCartTotals();
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) {
        console.error('Cart items container not found in renderCartItems!');
        return;
    }
    
    console.log('Rendering cart items...');
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
        <center>
        <div class="empty-cart py-5">
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
                <button class="btn-hover btn-hover-2 hover-slide-up">
          <a href="shop.html" class="">
                  <span>Continue Shopping</span></a>
                </button>
               
            </div>  </center>
        `;
        return;
    }
    
    console.log(`Cart length: ${cart.length}`);

    cart.forEach((item, index) => {
        console.log(`Rendering item: ${item.name}`); 
        
       
        const unitPrice = item.current_price || item.price || 0; 
        if (unitPrice <= 0) {
            console.error(`Invalid price for item: ${item.name}`);
        }
        const totalPrice = item.quantity * unitPrice; 
        
        cartItemsContainer.innerHTML += `
            <div class="cart-item" data-index="${index}">
                <div class="item-thumb">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-title">${item.name}</div>
                    <div class="item-meta">Color: Default</div>
                    <div class="item-meta">Size: Standard</div>
                    <div class="item-qty">
                        <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <input type="number" value="${item.quantity}" min="1" readonly>
                        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="item-pricing">
                    <div class="item-old-price">$${(item.old_price || 0).toFixed(2)}</div>
                    <div class="item-price">$${totalPrice.toFixed(2)}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">&times;</button>
            </div>
        `;
    });
}


function addToCart(product) {
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); 
    renderCartItems();
    updateCartTotals();
}

function updateCartTotals() {
    const summaryRow = document.querySelector('.summary-row');
    if (!summaryRow) {
        console.error('Summary row not found in updateCartTotals!');
        return;
    }
    
  
    const subtotal = cart.reduce((total, item) => {
       
        const itemPrice = item.current_price || item.price || 0;
        return total + (itemPrice * item.quantity);
    }, 0);
    
    const discount = cart.reduce((total, item) => {
        const itemPrice = item.current_price || item.price || 0;
        const itemOldPrice = item.old_price || itemPrice;
        return total + ((itemOldPrice - itemPrice) * item.quantity);
    }, 0);
    
    const total = Math.max(0, subtotal - discount);
    
    console.log(`Subtotal: $${subtotal.toFixed(2)}, Discount: $${discount.toFixed(2)}, Total: $${total.toFixed(2)}`); // Log totals
    
    // summary display
    document.querySelector('.sub-total').textContent = `$${subtotal.toFixed(2)}`;
    document.querySelector('.disc-price').textContent = `$${discount.toFixed(2)}`;
    document.querySelector('.summary-total span:last-child').textContent = `$${total.toFixed(2)}`;
}

function initCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

function initWishlistCount() {
    const wishlistCount = document.querySelector('.wishlist-count');
    console.log('Initializing wishlist count...'); 
    if (wishlistCount && window.getWishlist) {
        const wishlist = window.getWishlist();
        wishlistCount.textContent = wishlist.size;
        wishlistCount.style.display = wishlist.size > 0 ? 'block' : 'none';
    }
}
function removeCart(){
    localStorage.removeItem('cart');
}
const cartCounter = document.querySelector('.cart-selected');
const mainCart = JSON.parse(localStorage.getItem('cart')) || [];
cartCounter.textContent = `${mainCart.length} ITEMS`;

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
});
