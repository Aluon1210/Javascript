// Cart page JavaScript
console.log('Cart.js loaded');

let cartItems = [];
let recommendedProducts = [];

// Initialize cart page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Cart page DOM loaded');
    
    // Wait for database to load
    while (!database) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    loadCartItems();
    loadRecommendedProducts();
    updateCartDisplay();
});

function loadCartItems() {
    // Get cart from localStorage
    const savedCart = localStorage.getItem('cart');
    cartItems = savedCart ? JSON.parse(savedCart) : [];
    
    console.log('Loaded cart items:', cartItems);
}

function loadRecommendedProducts() {
    // Get random products for recommendations
    const allProducts = database.products || [];
    const shuffled = allProducts.sort(() => 0.5 - Math.random());
    recommendedProducts = shuffled.slice(0, 4);
    
    displayRecommendedProducts();
}

function updateCartDisplay() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    const cartWithItems = document.getElementById('cartWithItems');
    
    if (cartItems.length === 0) {
        emptyCart.classList.remove('hidden');
        cartWithItems.style.display = 'none';
    } else {
        emptyCart.classList.add('hidden');
        cartWithItems.style.display = 'block';
        displayCartItems();
        updateOrderSummary();
    }
    
    updateCartCount();
}

function displayCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    if (!cartItemsList) return;
    
    cartItemsList.innerHTML = cartItems.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.productName}">
            </div>
            
            <div class="cart-item-info">
                <h4>${item.productName}</h4>
                <p>Mã sản phẩm: #${item.productId}</p>
                <div class="cart-item-variant">${item.variantName}</div>
                <div class="cart-item-price">${formatPrice(item.price)}</div>
            </div>
            
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
    `).join('');
}

function displayRecommendedProducts() {
    const recommendedList = document.getElementById('recommendedList');
    if (!recommendedList || recommendedProducts.length === 0) return;
    
    recommendedList.innerHTML = recommendedProducts.map(product => {
        const variant = database.product_variants.find(v => v.product_id === product.id);
        const price = variant ? formatPrice(variant.price) : 'Liên hệ';
        
        return `
            <div class="recommended-item" onclick="viewProduct(${product.id})">
                <img src="${product.image}" alt="${product.name}">
                <h5>${product.name}</h5>
                <p>${price}</p>
                <button class="quick-add-btn" onclick="event.stopPropagation(); quickAddToCart(${product.id})">
                    <i class="fas fa-plus"></i> Thêm
                </button>
            </div>
        `;
    }).join('');
}

function updateQuantity(index, change) {
    if (index < 0 || index >= cartItems.length) return;
    
    cartItems[index].quantity += change;
    
    if (cartItems[index].quantity <= 0) {
        removeFromCart(index);
        return;
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Update display
    updateCartDisplay();
    
    showNotification('Đã cập nhật số lượng!', 'success');
}

function removeFromCart(index) {
    if (index < 0 || index >= cartItems.length) return;
    
    const item = cartItems[index];
    
    if (confirm(`Bạn có chắc chắn muốn xóa "${item.productName}" khỏi giỏ hàng?`)) {
        cartItems.splice(index, 1);
        
        // Update localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
        
        // Update display
        updateCartDisplay();
        
        showNotification('Đã xóa sản phẩm khỏi giỏ hàng!', 'success');
    }
}

function clearCart() {
    if (cartItems.length === 0) return;
    
    if (confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng?')) {
        cartItems = [];
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartDisplay();
        showNotification('Đã xóa tất cả sản phẩm!', 'success');
    }
}

function updateOrderSummary() {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000; // Free shipping over 500k
    const discount = 0; // No discount applied
    const total = subtotal + shippingFee - discount;
    
    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('shippingFee').textContent = shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee);
    document.getElementById('discount').textContent = formatPrice(discount);
    document.getElementById('total').textContent = formatPrice(total);
    
    // Update checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = cartItems.length === 0;
    }
}

function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim();
    
    if (!couponCode) {
        showNotification('Vui lòng nhập mã giảm giá!', 'error');
        return;
    }
    
    // Demo coupon codes
    const validCoupons = {
        'WELCOME10': { discount: 0.1, minOrder: 200000, description: 'Giảm 10% cho đơn hàng từ 200k' },
        'SAVE50K': { discount: 50000, minOrder: 500000, description: 'Giảm 50k cho đơn hàng từ 500k' },
        'FREESHIP': { freeShipping: true, minOrder: 0, description: 'Miễn phí vận chuyển' }
    };
    
    const coupon = validCoupons[couponCode.toUpperCase()];
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (!coupon) {
        showNotification('Mã giảm giá không hợp lệ!', 'error');
        return;
    }
    
    if (subtotal < coupon.minOrder) {
        showNotification(`Đơn hàng phải từ ${formatPrice(coupon.minOrder)} để sử dụng mã này!`, 'error');
        return;
    }
    
    // Apply coupon (demo - just show notification)
    showNotification(`Đã áp dụng mã giảm giá: ${coupon.description}`, 'success');
    document.getElementById('couponCode').value = '';
}

function proceedToCheckout() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thanh toán!', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    if (cartItems.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        return;
    }
    
    // Create order
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;
    
    const newOrder = {
        id: Math.max(...database.orders.map(o => o.id), 0) + 1,
        user_id: currentUser.id,
        created_date: new Date().toISOString(),
        status: 'pending',
        total_amount: total
    };
    
    database.orders.push(newOrder);
    
    // Create order details
    cartItems.forEach(item => {
        const orderDetail = {
            id: Math.max(...database.order_details.map(od => od.id), 0) + 1,
            order_id: newOrder.id,
            product_id: item.productId,
            variant_id: item.variantId,
            quantity: item.quantity,
            unit_price: item.price
        };
        database.order_details.push(orderDetail);
    });
    
    // Update product quantities
    cartItems.forEach(item => {
        const variant = database.product_variants.find(v => v.id === item.variantId);
        if (variant) {
            variant.quantity = Math.max(0, variant.quantity - item.quantity);
        }
    });
    
    // Save database
    saveDatabase();
    
    // Clear cart
    cartItems = [];
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Show success message and redirect
    showSuccessPage(newOrder);
}

function showSuccessPage(order) {
    document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #007BFF; padding: 2rem;">
            <div style="background: white; padding: 3rem; border-radius: 20px; text-align: center; max-width: 500px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
                <div style="font-size: 4rem; color: #28a745; margin-bottom: 2rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h1 style="color: #333; margin-bottom: 1rem;">Đặt hàng thành công!</h1>
                <p style="color: #666; margin-bottom: 1rem;">Cảm ơn bạn đã mua hàng tại Susan Shop</p>
                <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 10px; margin: 2rem 0;">
                    <h3 style="color: #333; margin-bottom: 1rem;">Thông tin đơn hàng</h3>
                    <p><strong>Mã đơn hàng:</strong> #${order.id}</p>
                    <p><strong>Tổng tiền:</strong> ${formatPrice(order.total_amount)}</p>
                    <p><strong>Trạng thái:</strong> Chờ xử lý</p>
                </div>
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <button onclick="window.location.href='index.html'" style="background: #007BFF; color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-home"></i> Về trang chủ
                    </button>
                    <button onclick="window.location.href='profile.html'" style="background: #28a745; color: white; border: none; padding: 1rem 2rem; border-radius: 25px; cursor: pointer; font-size: 1rem;">
                        <i class="fas fa-shopping-bag"></i> Xem đơn hàng
                    </button>
                </div>
            </div>
        </div>
    `;
}

function quickAddToCart(productId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm sản phẩm!', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }
    
    const product = database.products.find(p => p.id === productId);
    const variant = database.product_variants.find(v => v.product_id === productId);
    
    if (!product || !variant) {
        showNotification('Sản phẩm không tồn tại!', 'error');
        return;
    }
    
    if (variant.quantity <= 0) {
        showNotification('Sản phẩm đã hết hàng!', 'error');
        return;
    }
    
    // Check if item already in cart
    const existingItemIndex = cartItems.findIndex(item => 
        item.productId === productId && item.variantId === variant.id
    );
    
    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity += 1;
    } else {
        cartItems.push({
            productId: productId,
            variantId: variant.id,
            productName: product.name,
            variantName: variant.variant_name,
            price: variant.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Update display
    updateCartDisplay();
    
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`, 'success');
}

function viewProduct(productId) {
    // For now, just show product info
    const product = database.products.find(p => p.id === productId);
    if (product) {
        showNotification(`Xem sản phẩm: ${product.name}`, 'info');
        // In a real app, this would navigate to product detail page
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Override the showCart function from app.js
window.showCart = function() {
    window.location.href = 'cart.html';
};

// Override the addToCart function to redirect to cart page
window.addToCartAndRedirect = function(productId) {
    // Add to cart logic (same as original addToCart)
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    const product = database.products.find(p => p.id === productId);
    const variant = database.product_variants.find(v => v.product_id === productId);
    
    if (!product || !variant) {
        showNotification('Sản phẩm không tồn tại!', 'error');
        return;
    }
    
    const existingItem = cartItems.find(item => item.productId === productId && item.variantId === variant.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            productId: productId,
            variantId: variant.id,
            productName: product.name,
            variantName: variant.variant_name,
            price: variant.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
    
    // Redirect to cart page
    setTimeout(() => {
        window.location.href = 'cart.html';
    }, 1000);
};