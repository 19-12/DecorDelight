let allProducts = [];
let priceFilterMax = 1000;


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
      updatePrice: product.current_price,
      quantity: 1
    });
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
  }
}

// ---- Fix: Declare searchedProd globally but empty initially ----
let searchedProd = [];

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
    
    // ---- Fix: Initialize searchedProd here AFTER products load ----
    searchedProd = allProducts.map(product => product.id);
    
    console.log('Products loaded successfully:', allProducts.length, 'products');
    renderProducts();
    renderLatestProducts();
  })
  .catch(error => {
    console.error('Error loading products:', error);
  });

// Your renderLatestProducts and renderProducts functions remain unchanged

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
    .filter(product => product.current_price <= priceFilterMax && searchedProd.includes(product.id))
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
                    onclick="showQuickView(${product.id})"
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
  // Add to Cart and Wishlist functionality unchanged
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
    // cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  }
}

const priceRange = document.getElementById('priceRange');
const priceRangeValue = document.getElementById('priceValue');

function productRange() {
  priceFilterMax = parseInt(priceRange.value, 10);
  priceRangeValue.textContent = `$${priceFilterMax}`;
  renderProducts();
}

const searchBox = document.getElementById("searchBox");

// ---- REMOVED original initial assignment of searchedProd here ----
// let searchedProd = allProducts.map(product => product.id); 

function searchProduct() {
  const searchProduct = searchBox.value.toLowerCase();
  const onlyProduct = allProducts.filter(prod => prod.name.toLowerCase().includes(searchProduct)).map(prod => prod.id);
  searchedProd = onlyProduct;
  renderProducts();
  console.log(onlyProduct);
}

// Your quick view, quantity selector, color selection and DOMContentLoaded logic unchanged ...

function showQuickView(productId) {
  const product = allProducts.find(p => p.id === productId);
  document.querySelector('.modal-title').textContent = product.name;
  document.querySelector('.product-title').textContent = product.name;
  document.querySelector('.price').textContent = `$${product.current_price}.00`;
  document.querySelector('.old_price').textContent = `$${product.old_price}.00`; 
  const discount = Math.round(((product.old_price - product.current_price) / product.old_price) * 100);
  document.querySelector('.discount').textContent = `-${discount}%`;
  const ratingContainer = document.querySelector('.rating-row');
  ratingContainer.innerHTML = `
      ${'<span class="star">&#9733;</span>'.repeat(product.rating)}
      ${'<span class="star">&#9734;</span>'.repeat(5 - product.rating)}
      <span class="score ms-1">${product.rating.toFixed(1)}</span>
      <span>/ 5.0</span>
      <span class="count ms-2">(${product.reviews})</span>
  `;
  document.querySelector('.mainImage').src = product.image;
  document.querySelectorAll('.thumb-img').forEach((img, index) => {
      img.src = product.image;
  });
  document.querySelector('.prod-desc').textContent = product.description || 'No description available';
  document.querySelector('.prod-meta').innerHTML = `
      <span><strong>Category:</strong> ${product.category}</span>
      <span><strong>Material:</strong> Premium Materials</span>
      <span><strong>Dimensions:</strong> Standard Size</span>
  `;
  const addToCartBtn = document.querySelector('.addcart-btn');
  if (addToCartBtn) {
      addToCartBtn.onclick = function() {
          addToCartFromDetails(product);
      };
  }
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
  // Quantity selector and color selection logic unchanged...
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyInput = document.getElementById('qtyInput');
  qtyMinus.onclick = function() {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
  };
  qtyPlus.onclick = function() {
      qtyInput.value = parseInt(qtyInput.value) + 1;
  };
  document.querySelectorAll('.color-dot').forEach(dot => {
      dot.onclick = function() {
          document.querySelectorAll('.color-dot.selected').forEach(d => d.classList.remove('selected'));
          this.classList.add('selected');
      };
  });
}

document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const idx = this.getAttribute('data-idx');
    showQuickView(allProducts[idx]);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateWishlistCount();
});
