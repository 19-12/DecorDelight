
const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Function to initialize the wishlist from localStorage
// function initializeWishlist() {
//     wishlist = 
//     renderWishlistItems();
// }
function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function setWishlist(arr) {
  localStorage.setItem('wishlist', JSON.stringify(arr));
}

renderWishlistItems()

function renderWishlistItems() {
    const wishlistItemsContainer = document.getElementById("wishlistItems");
    console.log(wishlist);
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = `<p>Your wishlist is empty.</p>`;
        return;
    }

    wishlist.forEach((item, index) => {
        wishlistItemsContainer.innerHTML += `
            <div class="cart-item" data-index="${index}">
                <div class="item-thumb">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-title">${item.name}</div>
                </div>
                <div class="item-pricing">
                    <div class="item-old-price">$${(item.old_price || 0).toFixed(2)}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                </div>
                <button class="remove-item" onclick="removeFromWishlist(${item.id})">&times;</button>
                <button class="btn-hover btn-hover-2 hover-slide-up add-cart-btn" onclick="addToCart(${item.id})">
                    <span>Add To Cart</span>
                  </button>
            </div>
        `;
    });
}


function addToWishlist(product) {
    wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    renderWishlistItems();
}


function removeFromWishlist(productId) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(item => item.id !== productId);
  setWishlist(wishlist);
  location.reload()
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    // cartCount.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateWishlistCount() {
  const wishlistCount = document.querySelector('.wishlist-count');
  if (wishlistCount) {
    const wishlist = getWishlist();
    wishlistCount.textContent = wishlist.length;
    // wishlistCount.style.display = wishlist.length > 0 ? 'block' : 'none';
  }
}

 function addToCart(productId){
        const wishListProduct = wishlist.find(item => item.id === productId);
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existingItem = cart.find(item => item.id === wishListProduct.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: wishListProduct.id,
          name: wishListProduct.name,
          image: wishListProduct.image,
          price: wishListProduct.price,
          old_price: wishListProduct.old_price,
          quantity: 1
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${wishListProduct.name} added to cart!`);
      updateCartCount();
      removeFromWishlist(productId);
    };
  

document.addEventListener('DOMContentLoaded', function() {
  updateCartCount();
  updateWishlistCount();
});
