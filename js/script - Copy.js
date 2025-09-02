let allProducts = [];
let wishlist = new Set();

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
    renderProducts('all');
  })
  .catch(error => {
    console.error('Error loading products:', error);
    // Display error message to user
    const grid = document.getElementById('productGrid');
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="alert alert-warning">
          <h4>Unable to load products</h4>
          <p>There was an error loading the product catalog. Please try refreshing the page.</p>
          <small>Error: ${error.message}</small>
        </div>
      </div>
    `;
  });

// Product rendering
function renderProducts(category) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  console.log(`Filtering products for category: ${category}`);
  let filtered = (category === 'all') ? allProducts : allProducts.filter(p => p.category === category);
  console.log(`Filtered products count: ${filtered.length}`);
  console.log(`First few filtered products:`, JSON.stringify(filtered.slice(0, 3), null, 2));

  filtered.forEach((product, idx) => {
    grid.innerHTML += `
    <div class="col-md-3 product-item" data-category="${product.category}">
      <article class="product-card">
        <figure>
          <div class="product_thumb position-relative">
            <a class="primary_img" href="javascript:void(0)" data-idx="${idx}">
              <img src="${product.image}" alt="${product.name}">
              <span class="action_links">
                <button 
                  class="btn-quick quick-view-btn" 
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
              <a href="product-details.html?id=${idx}" class="product-link" data-idx="${idx}">${product.name}</a>
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
                <i class="bi bi-heart${wishlist.has(idx) ? '-fill' : ''}"></i>
              </button>
            </div>
          </figcaption>
        </figure>
      </article>
    </div>
    `;
  });

  setupInteractivity(filtered);
}

// Event/interactivity logic
function setupInteractivity(productSet) {
  // Quick View Modal
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.onclick = function(e) {
      const idx = this.getAttribute('data-idx');
      showQuickView(productSet[idx]);
    };
  });

  // Product Name: link already goes to details (can further enhance with JS if needed)

  // Wishlist button
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = function(e) {
      const idx = parseInt(this.getAttribute('data-idx'), 10);
      if (wishlist.has(idx)) {
        wishlist.delete(idx);
        this.querySelector('i').classList.remove('bi-heart-fill');
        this.querySelector('i').classList.add('bi-heart');
      } else {
        wishlist.add(idx);
        this.querySelector('i').classList.add('bi-heart-fill');
        this.querySelector('i').classList.remove('bi-heart');
      }
    };
  });

  // Add to Cart
  document.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.getAttribute('data-idx'), 10);
      const product = productSet[idx];
      
      // Get current cart from localStorage or initialize empty array
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Check if product already exists in cart
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
      
      console.log('Current cart before update:', cart); // Debug log
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Show success message and redirect to cart
      alert(`${product.name} added to cart!`);
      window.location.href = "cart.html";
    };
  });
}

// Modal render function
function showQuickView(product) {
  document.querySelector('#quickViewModal .modal-title').textContent = product.name;
  document.querySelector('#quickViewModal .modal-img').src = product.image;
  document.querySelector('#quickViewModal .modal-price').textContent = `$${product.current_price}.00`;
  document.querySelector('#quickViewModal .modal-desc').textContent = `Rating: ${product.rating} stars | ${product.reviews} Reviews`;
}

// Tabs
document.getElementById('productTabs').addEventListener('click', function(e) {
  if(e.target.dataset.category){
    document.querySelectorAll('#productTabs .nav-link').forEach(btn=>btn.classList.remove('active'));
    e.target.classList.add('active');
    renderProducts(e.target.dataset.category);
  }
});



// Attach handlers after products rendered:
document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const idx = this.getAttribute('data-idx');
    // Use your products array; be sure idx matches product!
    showQuickView(allProducts[idx]);
  });
});
