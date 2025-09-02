let allProducts = [];
let priceFilterMax = 1000;

// ---- Wishlist Helpers ----
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function setWishlist(arr) {
  localStorage.setItem('wishlist', JSON.stringify(arr));
}

function isInWishlist(id) {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === id);
}

function addToWishlist(product) {
  let wishlist = getWishlist();
  if (!wishlist.some(item => item.id === product.id)) {
    wishlist.push({ 
      id: product.id,
         name: product.name,
          image: product.image,
          price: product.current_price,
          old_price: product.old_price,
          updatePrice:product.current_price,
          quantity: 1  });
    setWishlist(wishlist);
  }
}

function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(item => item.id !== productId);
  setWishlist(wishlist);
}

function updateWishlistCount() {
  const wishlistCount = document.querySelector('.wishlist-count');
  if (wishlistCount) {
    const wishlist = getWishlist();
    wishlistCount.textContent = wishlist.length;
    // wishlistCount.style.display = wishlist.length > 0 ? 'block' : 'none';
  }
}

// ---- Fetch Products ----
fetch('js/products.json')
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    allProducts = data;
    console.log('Products loaded successfully:', allProducts.length, 'products');
    renderProducts();
    renderLatestProducts();
  })
  .catch(error => {
    console.error('Error loading products:', error);
  });

function renderLatestProducts() {
  const latestProducts = allProducts.slice(-3); // Get the last 3 products
  const latestProductsContainer = document.querySelector('.latest-products-list');
  latestProductsContainer.innerHTML = '';
  latestProducts.forEach((product) => {
    latestProductsContainer.innerHTML += `
      <div class="latest-product-card">
        <img src="${product.image}" alt="${product.name}">
          <div class="latest-info">
          <a href="product-details.html?id=${product.id}">${product.name}</a>
          <div class="latest-price">$${product.current_price}</div>
          <div class="latest-rating">
            <span class="stars">★★★★★</span>
            <span class="review-count">(${product.reviews} Reviews)</span>
          </div>
        </div>
      </div>
    `;
  });
}

function renderProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  allProducts
    .filter(product => product.current_price <= priceFilterMax)
    .forEach((product, idx) => {
      const wishClass = isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart';
      grid.innerHTML += `
      <div class="col-md-4 product-item" data-category="${product.category}">
        <article class="product-card">
          <figure>
            <div class="product_thumb position-relative">
              <a class="primary_img" href="javascript:void(0)" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <span class="action_links">
                  <button 
                    class="btn-quick quick-view-btn" 
                    data-id="${product.id}" 
                    data-bs-toggle="modal" 
                    data-bs-target="#quickViewModal">
                    <i class="bi bi-eye"></i>
                  </button>
                </span>
              </a>
            </div>
            <figcaption class="product_content">
              <h4 class="product_name">
                <a href="product-details.html?id=${product.id}" class="product-link" data-id="${product.id}">${product.name}</a>
              </h4>
              <div class="price_box">
                <span class="old_price">$${product.old_price}.00</span>
                <span class="current_price">$${product.current_price}.00</span>
              </div>
              <div class="product_rating">
                <ul class="pl-0 d-inline">
                  ${'<li class="d-inline"><a href="#"><i class="fa fa-star"></i></a></li>'.repeat(product.rating)}
                </ul>
                <span class="reviews-count">(${product.reviews} Reviews)</span>
              </div>
              <div class="d-flex align-items-center gap-2 mt-2">
                <div class="btn-holder">
                  <button class="btn-hover btn-hover-2 hover-slide-up add-cart-btn" data-id="${product.id}">
                    <span>Add To Cart</span>
                  </button>
                </div>
                <button type="button" class="wishlist-btn btn-square" data-idx="${idx}">
                  <i class="bi ${wishClass}"></i>
                </button>
              </div>
            </figcaption>
          </figure>
        </article>
      </div>
      `;
    });

  setupInteractivity();
  updateWishlistCount();
}

function setupInteractivity() {
  // Add to Cart functionality
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.onclick = function() {
      const id = parseInt(this.getAttribute('data-id'), 10);
      const product = allProducts.find(p => p.id === id);
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.current_price,
          old_price: product.old_price,
          quantity: 1
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
      updateCartCount();
    };
  });

  // Wishlist functionality
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = function(e) {
      const idx = parseInt(this.getAttribute('data-idx'), 10);
      const product = allProducts[idx];
      const icon = this.querySelector('i');
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id);
        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
      } else {
        addToWishlist(product);
        icon.classList.add('bi-heart-fill');
        icon.classList.remove('bi-heart');
      }
      updateWishlistCount();
    };
  });
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  }
}


const priceRange = document.getElementById('priceRange');
const priceRangeValue = document.getElementById('priceRangeValue');

if(priceRange && priceRangeValue) {
  priceRange.addEventListener('input', function() {
    priceFilterMax = parseInt(priceRange.value, 10);
    priceRangeValue.textContent = `$${priceFilterMax}`;
    renderProducts();
  });
}


document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateWishlistCount();
});
