// Global variables
let database = null;
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadDatabase();
    checkUserLogin();
    updateCartCount();
    
    // Load page-specific content
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadHomePage();
    } else if (window.location.pathname.includes('products.html')) {
        loadProductsPage();
    } else if (window.location.pathname.includes('admin.html')) {
        loadAdminPage();
    }
    
    // Setup event listeners
    setupEventListeners();
});

// Load database from JSON file
async function loadDatabase() {
    try {
        const response = await fetch('data/database.json');
        database = await response.json();
        console.log('Database loaded successfully');
    } catch (error) {
        console.error('Error loading database:', error);
        // Fallback to empty database structure
        database = {
            categories: [],
            products: [],
            product_variants: [],
            users: [],
            orders: [],
            order_details: []
        };
    }
}

// Setup event listeners
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = database.users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserInterface();
        closeModal('loginModal');
        showNotification('Đăng nhập thành công!', 'success');
        
        // Redirect to admin if admin user
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        }
    } else {
        showNotification('Email hoặc mật khẩu không đúng!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;
    
    // Check if email already exists
    const existingUser = database.users.find(u => u.email === email);
    if (existingUser) {
        showNotification('Email đã được sử dụng!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: database.users.length + 1,
        name: name,
        email: email,
        phone: phone,
        address: address,
        password: password,
        role: 'user'
    };
    
    database.users.push(newUser);
    saveDatabase();
    
    showNotification('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    closeModal('registerModal');
    showLoginModal();
}

function checkUserLogin() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    
    if (currentUser) {
        loginBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        userName.textContent = currentUser.name;
    } else {
        loginBtn.classList.remove('hidden');
        userProfile.classList.add('hidden');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showNotification('Đăng xuất thành công!', 'success');
    
    // Redirect to home if on admin page
    if (window.location.pathname.includes('admin.html')) {
        window.location.href = 'index.html';
    }
}

// Modal functions
function showLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    closeModal('registerModal');
}

function showRegisterModal() {
    document.getElementById('registerModal').style.display = 'block';
    closeModal('loginModal');
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showUserMenu() {
    // Simple implementation - could be expanded
    const menu = confirm('Bạn muốn đăng xuất?');
    if (menu) {
        logout();
    }
}

// Home page functions
function loadHomePage() {
    loadCategories();
    loadFeaturedProducts();
}

function loadCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid || !database) return;
    
    // Get main categories (parent_id is null)
    const mainCategories = database.categories.filter(cat => cat.parent_id === null);
    
    categoriesGrid.innerHTML = mainCategories.map(category => `
        <div class="category-card" onclick="viewCategory(${category.id})">
            <img src="https://via.placeholder.com/300x200/667eea/ffffff?text=${encodeURIComponent(category.name)}" alt="${category.name}">
            <h3>${category.name}</h3>
        </div>
    `).join('');
}

function loadFeaturedProducts() {
    const featuredProducts = document.getElementById('featuredProducts');
    if (!featuredProducts || !database) return;
    
    // Get first 6 products as featured
    const products = database.products.slice(0, 6);
    
    featuredProducts.innerHTML = products.map(product => {
        const variant = database.product_variants.find(v => v.product_id === product.id);
        const price = variant ? formatPrice(variant.price) : 'Liên hệ';
        
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.detail.substring(0, 100)}...</p>
                    <div class="product-price">${price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function viewCategory(categoryId) {
    window.location.href = `products.html?category=${categoryId}`;
}

// Product functions
function loadProductsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const searchQuery = urlParams.get('search');
    
    if (categoryId) {
        loadProductsByCategory(parseInt(categoryId));
    } else if (searchQuery) {
        loadProductsBySearch(searchQuery);
    } else {
        loadAllProducts();
    }
}

function loadAllProducts() {
    const productsContainer = document.getElementById('productsContainer');
    if (!productsContainer || !database) return;
    
    displayProducts(database.products);
}

function loadProductsByCategory(categoryId) {
    if (!database) return;
    
    const products = database.products.filter(p => p.cate_id === categoryId);
    displayProducts(products);
}

function loadProductsBySearch(query) {
    if (!database) return;
    
    const products = database.products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.detail.toLowerCase().includes(query.toLowerCase())
    );
    displayProducts(products);
}

function displayProducts(products) {
    const productsContainer = document.getElementById('productsContainer') || 
                             document.getElementById('featuredProducts');
    
    if (!productsContainer) return;
    
    productsContainer.innerHTML = products.map(product => {
        const variant = database.product_variants.find(v => v.product_id === product.id);
        const price = variant ? formatPrice(variant.price) : 'Liên hệ';
        
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.detail.substring(0, 100)}...</p>
                    <div class="product-price">${price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Cart functions
function addToCart(productId) {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!', 'error');
        showLoginModal();
        return;
    }
    
    const product = database.products.find(p => p.id === productId);
    const variant = database.product_variants.find(v => v.product_id === productId);
    
    if (!product || !variant) {
        showNotification('Sản phẩm không tồn tại!', 'error');
        return;
    }
    
    const existingItem = cart.find(item => item.productId === productId && item.variantId === variant.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            variantId: variant.id,
            productName: product.name,
            variantName: variant.variant_name,
            price: variant.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Đã thêm sản phẩm vào giỏ hàng!', 'success');
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function showCart() {
    const cartModal = document.getElementById('cartModal');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartModal || !cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Giỏ hàng trống</p>';
        cartTotal.textContent = '0';
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.productName}">
                <div class="cart-item-info">
                    <h4>${item.productName}</h4>
                    <p>${item.variantName}</p>
                    <p>${formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-controls">
                    <button onclick="updateCartQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${index}, 1)">+</button>
                    <button onclick="removeFromCart(${index})" style="background: #dc3545; margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = formatPrice(total);
    }
    
    cartModal.style.display = 'block';
}

function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart(); // Refresh cart display
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart(); // Refresh cart display
}

function checkout() {
    if (!currentUser) {
        showNotification('Vui lòng đăng nhập để thanh toán!', 'error');
        showLoginModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Giỏ hàng trống!', 'error');
        return;
    }
    
    // Create new order
    const newOrder = {
        id: database.orders.length + 1,
        user_id: currentUser.id,
        created_date: new Date().toISOString(),
        status: 'pending',
        total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    database.orders.push(newOrder);
    
    // Create order details
    cart.forEach(item => {
        const orderDetail = {
            id: database.order_details.length + 1,
            order_id: newOrder.id,
            product_id: item.productId,
            variant_id: item.variantId,
            quantity: item.quantity,
            unit_price: item.price
        };
        database.order_details.push(orderDetail);
    });
    
    // Update product quantities
    cart.forEach(item => {
        const variant = database.product_variants.find(v => v.id === item.variantId);
        if (variant) {
            variant.quantity -= item.quantity;
        }
    });
    
    saveDatabase();
    
    // Clear cart
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    closeModal('cartModal');
    showThankYouPage();
}

function showThankYouPage() {
    const thankYouHtml = `
        <div style="text-align: center; padding: 50px; background: white; border-radius: 15px; margin: 50px auto; max-width: 600px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <i class="fas fa-check-circle" style="font-size: 80px; color: #28a745; margin-bottom: 20px;"></i>
            <h2 style="color: #333; margin-bottom: 20px;">Cảm ơn bạn đã mua hàng!</h2>
            <p style="color: #666; margin-bottom: 30px;">Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
            <button onclick="window.location.href='index.html'" style="background: #667eea; color: white; padding: 12px 30px; border: none; border-radius: 25px; font-size: 16px; cursor: pointer;">
                Tiếp tục mua sắm
            </button>
        </div>
    `;
    
    document.body.innerHTML = thankYouHtml;
}

// Admin functions
function loadAdminPage() {
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('Bạn không có quyền truy cập trang này!', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    loadAdminDashboard();
}

function loadAdminDashboard() {
    // This will be implemented in admin.js
    console.log('Loading admin dashboard...');
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function saveDatabase() {
    // In a real application, this would send data to a server
    // For this demo, we'll just update localStorage
    localStorage.setItem('database', JSON.stringify(database));
    console.log('Database saved to localStorage');
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}