document.addEventListener('DOMContentLoaded', function() {
    let allProducts = [];

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
});

function renderLatestProducts() {
  const latestProducts = allProducts.slice(-3); 
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

  allProducts.forEach((product, idx) => {
    grid.innerHTML += `
    <div class="col-md-4 product-item" data-category="${product.category}">
      <article class="product-card">
        <figure>
          <div class="product_thumb position-relative">
            <a class="primary_img" href="javascript:void(0)" data-idx="${idx}">
              <img src="${product.image}" alt="${product.name}">
              <span class="action_links">
                <button 
                  class="btn-quick quick-view-btn" 
                  onclick="showQuickView(${product})"
                  data-idx="${idx}" 
                  data-bs-toggle="modal" 
                  data-bs-target="#quickViewModal">
                  <i class="bi bi-eye"></i>
                </button>
              </span>
            </a>
          </div>
          <figcaption class="product_content">
            <h4 class="product_name">
              <a href="product-details.html?id=${product.id}" class="product-link" data-idx="${idx}">${product.name}</a>
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
                <button class="btn-hover btn-hover-2 hover-slide-up add-cart-btn" data-idx="${idx}">
                  <span>Add To Cart</span>
                </button>
              </div>
              <button type="button" class="wishlist-btn btn-square" data-idx="${idx}">
                <i class="bi bi-heart"></i>
              </button>
            </div>
          </figcaption>
        </figure>
      </article>
    </div>
    `;
  });

  setupInteractivity();
}


function setupInteractivity() {
 
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'), 10);
      const product = allProducts[idx];
      
   
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
  
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          image: product.image,
          current_price: product.current_price,
          old_price: product.old_price,
          quantity: 1
        });
      }
      
      console.log('Adding product to cart:', product); 
      console.log('Current cart before update:', cart); 
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Updated cart after adding:', cart); 
      alert(`${product.name} added to cart!`);
      updateCartCount(); 
    };
  });

  // Wishlist functionality
   document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = function(e) {
      const idx = parseInt(this.getAttribute('data-idx'), 10);
      const product = allProducts[idx];
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (wishlist.some(item => item.id === product.id)) {
        removeFromWishlist(product);
        this.querySelector('i').classList.remove('bi-heart-fill');
        this.querySelector('i').classList.add('bi-heart');
      } else {
        addToWishlist(product);
        this.querySelector('i').classList.add('bi-heart-fill');
        this.querySelector('i').classList.remove('bi-heart');
      }
      
      updateWishlistCount();
     
    };
  });
  function addToWishlist(product) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  if (!wishlist.some(item => item.id === product.id)) {
    wishlist.push({
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.current_price,
          old_price: product.old_price,
          updatePrice:product.current_price,
          quantity: 1
        });
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }
}
}

// Update cart count in header
function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  }
}




// Initialize counts on page load
document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
});
