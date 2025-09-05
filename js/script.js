let allProducts = [];

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
          quantity: 1 });
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
  });


function renderProducts(category) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';

  console.log(`Filtering products for category: ${category}`);
  let filtered = (category === 'all') ? allProducts : allProducts.filter(p => p.category === category);

  filtered.forEach((product, idx) => {
    const wishClass = isInWishlist(product.id) ? 'bi-heart-fill' : 'bi-heart';
    // const isInWishlist = window.isInWishlist ? window.isInWishlist(idx) : false;
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
                <i class="bi ${wishClass}"></i>
              </button>
                
              </button>
            </div>
          </figcaption>
        </figure>
      </article>
    </div>
    `;
  });

  setupInteractivity(filtered);
   updateWishlistCount();
}


// function addToWishlist(product) {
//   let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//   if (!wishlist.some(item => item.id === product.id)) {
//     wishlist.push({
//           id: product.id,
//           name: product.name,
//           image: product.image,
//           price: product.current_price,
//           old_price: product.old_price,
//           updatePrice:product.current_price,
//           quantity: 1
//         });
//     localStorage.setItem('wishlist', JSON.stringify(wishlist));
//   }
// }

// function removeFromWishlist(productId) {
//   let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
//   wishlist = wishlist.filter(item => item.id !== productId);
//   localStorage.setItem('wishlist', JSON.stringify(wishlist));
// }

function setupInteractivity(allProducts) {
  // Quick View Modal
  document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.onclick = function(e) {
      const idx = this.getAttribute('data-idx');
      showQuickView(allProducts[idx]);
    };
  });

  // Wishlist functionality
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.onclick = function(e) {
      const idx = parseInt(this.getAttribute('data-idx'), 10);
      const product = allProducts[idx];
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      if (wishlist.some(item => item.id === product.id)) {
        removeFromWishlist(product.id);
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


  // Add to Cart
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
          price: product.current_price,
          old_price: product.old_price,
          updatePrice:product.current_price,
          quantity: 1
        });
      }
      
      console.log('Current cart before update:', cart); 
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${product.name} added to cart!`);
      updateCartCount(); 
      // setTimeout(() => {
      //   window.location.href = "cart.html";
      // }, 2000);
      
      
    };
  });
}

// Modal  function
function showQuickView(product) {
 
            // Update product details
            document.querySelector('.modal-title').textContent = product.name;
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
            document.querySelector('.mainImage').src = product.image;
            document.querySelectorAll('.thumb-img').forEach((img, index) => {
                img.src = product.image; 
            });
            
            // Update product description
            document.querySelector('.prod-desc').textContent = product.description || 'No description available';
            
            // Update meta information
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

// Tabs
document.getElementById('productTabs').addEventListener('click', function(e) {
  if(e.target.dataset.category){
    document.querySelectorAll('#productTabs .nav-link').forEach(btn=>btn.classList.remove('active'));
    e.target.classList.add('active');
    renderProducts(e.target.dataset.category);
  }
});


document.addEventListener("DOMContentLoaded", function() {
  var current = window.location.pathname.split('/').pop();
  if (!current || current === "") current = "index.html";
  document.querySelectorAll('.custom-navbar-nav .nav-link').forEach(function(link) {
    var linkPage = link.getAttribute('href');
    if (linkPage === current) {
      link.parentElement.classList.add("active");
    }
  });
});


document.querySelectorAll('.quick-view-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const idx = this.getAttribute('data-idx');
   
    showQuickView(allProducts[idx]);
  });
});


function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    const wishlist= JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlistCount.textContent = wishlist.length;
      // wishlistCount.style.display = wishlist.length > 0 ? 'block' : 'none';
  }


// Update cart count in header
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    // cartCount.style.display = totalItems > 0 ? 'block' : 'none';
}

// newsletter-form
document.getElementById('newsletter-form').addEventListener('submit', function(e) {
  let hasError = false;


  const firstName = document.getElementById('first-name');
  const email = document.getElementById('email');
  const firstNameError = document.getElementById('first-name-error');
  const emailError = document.getElementById('email-error');


  firstNameError.textContent = "";
  emailError.textContent = "";

 
  if (!firstName.value.trim()) {
    firstNameError.textContent = "First name is required.";
    hasError = true;
  } else if (!/^[a-zA-Z\s]{2,30}$/.test(firstName.value.trim())) {
    firstNameError.textContent = "First name should contain only letters.";
    hasError = true;
  }

  
  if (!email.value.trim()) {
    emailError.textContent = "Email address is required.";
    hasError = true;
  } else if (!/^[\w\.\-]+@[\w\.\-]+\.[a-zA-Z]{2,}$/.test(email.value.trim())) {
    emailError.textContent = "Please enter a valid email address.";
    hasError = true;
  }

  
  if (hasError) e.preventDefault();
});



document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateWishlistCount();
});


