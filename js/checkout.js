let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCartItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    if (!checkoutItemsContainer) {
        console.error('Cart items container not found in renderCartItems!');
        return;
    }
    
    console.log('Rendering cart items...');
    
    checkoutItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        checkoutItemsContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Your cart is empty</h3>
            </div>
        `;
        return;
    }
    cart.forEach((item) => {
        if(item.quantity === 1){
            const updatePrice = item.price ;
        }
        const updatePrice = item.quantity * item.price;
        checkoutItemsContainer.innerHTML += `
            <tr>
                <td>${item.name}<strong class="mx-2">x</strong> ${item.quantity}</td>
                <td>$${updatePrice}</td>
            </tr>
        `;
    });
}


function updateOrderTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = cart.reduce((total, item) => total + ((item.old_price - item.price) * item.quantity), 0);
    const total = subtotal - discount;
    
  
    const orderSummary = document.querySelector('.site-block-order-table');
    if (orderSummary) {
       
        const existingTotals = orderSummary.querySelectorAll('.order-totals');
        existingTotals.forEach(el => el.remove());
        
      
        orderSummary.innerHTML += `
            <tr class="order-totals">
                <td class="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
                <td class="text-black">$${subtotal.toFixed(2)}</td>
            </tr>
            <tr class="order-totals">
                <td class="text-black font-weight-bold"><strong>Discount</strong></td>
                <td class="text-black">-$${discount.toFixed(2)}</td>
            </tr>
            <tr class="order-totals">
                <td class="text-black font-weight-bold"><strong>Order Total</strong></td>
                <td class="text-black font-weight-bold"><strong>$${total.toFixed(2)}</strong></td>
            </tr>
        `;
    }
}

// Form validation
function validateCheckoutForm() {
    const requiredFields = [
        'c_fname', 'c_lname', 'c_address', 'c_state_country', 
        'c_postal_zip', 'c_email_address', 'c_phone'
    ];
    
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!input || !input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });
    
    // Email validation
    const emailInput = document.getElementById('c_email_address');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailInput && !emailRegex.test(emailInput.value)) {
        isValid = false;
        emailInput.style.borderColor = 'red';
        alert('Please enter a valid email address');
    }
    
    return isValid;
}

// Process order
function processOrder() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return false;
    }
    
    if (!validateCheckoutForm()) {
        alert('Please fill in all required fields correctly.');
        return false;
    }
    
    // Collect customer information
    const orderData = {
        customer: {
            firstName: document.getElementById('c_fname').value,
            lastName: document.getElementById('c_lname').value,
            email: document.getElementById('c_email_address').value,
            phone: document.getElementById('c_phone').value,
            address: document.getElementById('c_address').value,
            state: document.getElementById('c_state_country').value,
            zip: document.getElementById('c_postal_zip').value,
            notes: document.getElementById('c_order_notes').value
        },
        items: cart,
        orderDate: new Date().toISOString(),
        orderId: 'ORD-' + Date.now(),
        status: 'pending'
    };
    
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart after successful order
    localStorage.removeItem('cart');
    cart = [];
    
    // Redirect to thank you page
    window.location.href = 'thankyou.html?orderId=' + orderData.orderId;
    
    return true;
}

// Initialize checkout page
function initCheckout() {
    renderCartItems();
    updateOrderTotals();
    
   
    const placeOrderBtn = document.querySelector('.btn-black.btn-lg');
    if (placeOrderBtn) {
        placeOrderBtn.onclick = processOrder;
    }
    
 
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });
}


document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
});


window.onload = function() {
    initCheckout();
};
