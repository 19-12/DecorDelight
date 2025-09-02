// Product Details Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-details.html')) {
        loadProductDetails();
        setupProductInteractions();
    }
});

// Load product details based on URL parameter
function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (isNaN(productId)) {
        // Redirect to shop if no product ID
        window.location.href = 'shop.html';
        return;
    }
    
    fetch('js/products.json')
        .then(res => res.json())
        .then(products => {
            const product = products.find(p => p.id === productId);
            
            if (!product) {
                window.location.href = 'shop.html';
                return;
            }
            
            // Update product details
            document.querySelector('.product-title').textContent = product.name;
            document.querySelector('.price').textContent = `$${product.current_price}.00`;
            document.querySelector('.old_price').textContent = `$${product.old_price}.00`;
            
            // Calculate discount percentage
            const discount = Math.round(((product.old_price - product.current_price) / product.old_price) * 100);
            document.querySelector('.discount').textContent = `-${discount}%`;
            
            // Update rating
            const ratingContainer = document.querySelector('.rating-row');
            ratingContainer.innerHTML = `
                ${'<span class="star">&#9733;</span>'.repeat(product.rating)}
                ${'<span class="star">&#9734;</span>'.repeat(5 - product.rating)}
                <span class="score ms-1">${product.rating.toFixed(1)}</span>
                <span>/ 5.0</span>
                <span class="count ms-2">(${product.reviews})</span>
            `;
            
            // Update product images
            document.getElementById('mainImage').src = product.image;
            document.querySelectorAll('.thumb-img').forEach((img, index) => {
                img.src = product.image; // Using same image for all thumbnails for now
            });
            
            // Update product description
            document.querySelector('.prod-desc').textContent = product.description || 'No description available';
            
            // Update meta information
            document.querySelector('.prod-meta').innerHTML = `
                <span><strong>Category:</strong> ${product.category}</span>
                <span><strong>Material:</strong> Premium Materials</span>
                <span><strong>Dimensions:</strong> Standard Size</span>
            `;
            
            // Set up add to cart button
            const addToCartBtn = document.querySelector('.addcart-btn');
            if (addToCartBtn) {
                addToCartBtn.onclick = function() {
                    addToCartFromDetails(product);
                };
            }
        })
        .catch(error => {
            console.error('Error loading product:', error);
            window.location.href = 'shop.html';
        });
}

// Add to cart from product details page
function addToCartFromDetails(product) {
    const quantity = parseInt(document.getElementById('qtyInput').value) || 1;
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            image: product.image,
            price: product.current_price,
            current_price: product.current_price, 
            old_price: product.old_price,
            updatePrice: product.current_price * quantity,
            quantity: quantity
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    
    updateCartCount();
    
    
    window.location.href = 'cart.html';
}


function setupProductInteractions() {
    // Image gallery
    const mainImg = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('.thumb-img');
    
    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            mainImg.src = this.src;
            document.querySelector('.thumb-img.selected').classList.remove('selected');
            this.classList.add('selected');
        });
    });
    
    // Quantity selector
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyInput = document.getElementById('qtyInput');
    
    qtyMinus.onclick = function() {
        qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
    };
    
    qtyPlus.onclick = function() {
        qtyInput.value = parseInt(qtyInput.value) + 1;
    };
    
    // Color selection
    document.querySelectorAll('.color-dot').forEach(dot => {
        dot.onclick = function() {
            document.querySelectorAll('.color-dot.selected').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
        };
    });
}

// Update cart count in header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Initialize cart count
updateCartCount();
