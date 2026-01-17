// Product Details Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('product-details.html')) {
        loadProductDetails();
        // Removed setupProductInteractions() call here,
        // because it's now called after product details load
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
            document.getElementById('thumb-img1').src = product.image;
            document.getElementById('thumb-img2').src = product.image1;
            document.getElementById('thumb-img3').src = product.image2;
            document.getElementById('thumb-img4').src = product.image3;
            document.getElementById('thumb-img5').src = product.image4;

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

            // Update main product image
            const mainImage = document.querySelector('.mainImage');
            mainImage.src = product.image;

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

            // Setup thumbnail click interactions AFTER thumbnails are updated
            setupProductInteractions();
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

// Setup thumbnail image click interactions
function setupProductInteractions() {
    const mainImg = document.querySelector('.mainImage');
    const thumbs = document.querySelectorAll('.thumb-img');

    thumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            mainImg.src = this.src;

            const selectedThumb = document.querySelector('.thumb-img.selected');
            if (selectedThumb) selectedThumb.classList.remove('selected');

            this.classList.add('selected');
        });
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

// Initialize cart count on page load
updateCartCount();
