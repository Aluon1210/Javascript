// Global variables
let database = null;
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM Content Loaded - Initializing app...');
    
    // Load database first and wait for it to complete
    await loadDatabase();
    console.log('Database loaded, setting up app...');
    
    // Setup event listeners after database is loaded
    setupEventListeners();
    
    // Check user login after database is loaded
    checkUserLogin();
    updateCartCount();
    
    // Load page-specific content
    const pathname = window.location.pathname;
    console.log('Current pathname:', pathname);
    
    if (pathname.includes('index.html') || pathname === '/' || pathname.endsWith('/workspace/') || pathname.endsWith('/')) {
        console.log('Loading home page...');
        await loadHomePage();
    } else if (pathname.includes('products.html')) {
        console.log('Loading products page...');
        loadProductsPage();
    } else if (pathname.includes('admin.html')) {
        console.log('Loading admin page...');
        loadAdminPage();
    }
    
    console.log('App initialization complete!');
});

// Load database from JSON file
async function loadDatabase() {
    try {
        const response = await fetch('data/database.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        database = await response.json();
        console.log('Database loaded successfully', database);
        
        // Validate database structure
        if (!database.users || !database.products || !database.categories) {
            throw new Error('Invalid database structure');
        }
        
    } catch (error) {
        console.error('Error loading database:', error);
        
        // Show user-friendly error message
        showNotification('Không thể tải dữ liệu. Sử dụng dữ liệu mẫu.', 'warning');
        
        // Fallback to sample data
        database = {
            categories: [
                { id: 1, name: "Thời trang nữ", parent_id: null },
                { id: 2, name: "Thời trang nam", parent_id: null },
                { id: 3, name: "Phụ kiện", parent_id: null }
            ],
            products: [
                {
                    id: 1,
                    name: "Áo sơ mi trắng công sở",
                    cate_id: 1,
                    detail: "Áo sơ mi trắng thanh lịch, phù hợp cho môi trường công sở. Chất liệu cotton cao cấp, thoáng mát.",
                    image: "https://via.placeholder.com/300x300/667eea/ffffff?text=Ao+So+Mi+Trang"
                },
                {
                    id: 2,
                    name: "Váy đầm hoa nhí",
                    cate_id: 1,
                    detail: "Váy đầm hoa nhí xinh xắn, phong cách nữ tính. Chất liệu voan mềm mại, thoải mái khi mặc.",
                    image: "https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Vay+Dam+Hoa"
                }
            ],
            product_variants: [
                { id: 1, product_id: 1, variant_name: "Size S - Trắng", price: 299000, quantity: 50, image: "https://via.placeholder.com/300x300/667eea/ffffff?text=S+Trang" },
                { id: 2, product_id: 2, variant_name: "Size M - Hoa nhí", price: 450000, quantity: 30, image: "https://via.placeholder.com/300x300/ff6b6b/ffffff?text=M+Hoa" }
            ],
            users: [
                { id: 1, name: "Admin", email: "admin@susanshop.com", phone: "0123456789", address: "123 ABC", password: "admin123", role: "admin" },
                { id: 2, name: "User Test", email: "user@test.com", phone: "0987654321", address: "456 XYZ", password: "user123", role: "user" }
            ],
            orders: [],
            order_details: []
        };
        
        console.log('Using fallback database:', database);
    }
}

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found, adding event listener');
        loginForm.addEventListener('submit', handleLogin);
    } else {
        console.log('Login form not found');
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Register form found, adding event listener');
        registerForm.addEventListener('submit', handleRegister);
    } else {
        console.log('Register form not found');
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        console.log('Search input found, adding event listener');
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    } else {
        console.log('Search input not found');
    }
}

// Authentication functions
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Attempting login with:', email, password);
    console.log('Database users:', database ? database.users : 'Database not loaded');
    
    if (!database) {
        showNotification('Hệ thống đang tải, vui lòng thử lại!', 'error');
        return;
    }
    
    const user = database.users.find(u => u.email === email && u.password === password);
    console.log('Found user:', user);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateUserInterface();
        closeModal('loginModal');
        showNotification('Đăng nhập thành công!', 'success');
        
        // Redirect to admin if admin user
        if (user.role === 'admin') {
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
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
    // Create dropdown menu
    const existingMenu = document.querySelector('.user-dropdown');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.innerHTML = `
        <div class="user-dropdown-content">
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <div>
                    <strong>${currentUser.name}</strong>
                    <small>${currentUser.email}</small>
                </div>
            </div>
            <hr>
            <a href="#" onclick="viewProfile()">
                <i class="fas fa-user"></i> Thông tin cá nhân
            </a>
            <a href="#" onclick="viewOrders()">
                <i class="fas fa-shopping-bag"></i> Đơn hàng của tôi
            </a>
            ${currentUser.role === 'admin' ? '<a href="admin.html"><i class="fas fa-cog"></i> Quản trị</a>' : ''}
            <hr>
            <a href="#" onclick="logout()" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Đăng xuất
            </a>
        </div>
    `;
    
    // Add styles
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 1000;
        min-width: 250px;
        animation: dropdownSlide 0.3s ease;
    `;
    
    // Add dropdown styles if not exists
    if (!document.getElementById('dropdown-styles')) {
        const style = document.createElement('style');
        style.id = 'dropdown-styles';
        style.textContent = `
            @keyframes dropdownSlide {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .user-dropdown-content {
                padding: 1rem;
            }
            .user-info {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                margin-bottom: 0.5rem;
            }
            .user-info i {
                font-size: 2rem;
                color: #667eea;
            }
            .user-info strong {
                display: block;
                color: #333;
            }
            .user-info small {
                color: #666;
                font-size: 0.8rem;
            }
            .user-dropdown hr {
                border: none;
                border-top: 1px solid #eee;
                margin: 0.8rem 0;
            }
            .user-dropdown a {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                padding: 0.6rem 0;
                color: #333;
                text-decoration: none;
                transition: color 0.3s;
            }
            .user-dropdown a:hover {
                color: #667eea;
            }
            .user-dropdown .logout-btn:hover {
                color: #dc3545;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Position relative to user profile button
    const userProfile = document.getElementById('userProfile');
    userProfile.style.position = 'relative';
    userProfile.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeDropdown(e) {
            if (!userProfile.contains(e.target)) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        });
    }, 100);
}

function viewProfile() {
    showNotification('Tính năng xem thông tin cá nhân đang được phát triển!', 'info');
    document.querySelector('.user-dropdown')?.remove();
}

function viewOrders() {
    showNotification('Tính năng xem đơn hàng đang được phát triển!', 'info');
    document.querySelector('.user-dropdown')?.remove();
}

// Home page functions
async function loadHomePage() {
    // Wait for database to be loaded if it's not ready yet
    while (!database) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
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
    if (!featuredProducts || !database) {
        console.log('Featured products container not found or database not loaded');
        return;
    }
    
    // Get first 6 products as featured
    const products = database.products.slice(0, 6);
    console.log('Loading featured products:', products.length);
    
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
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    } else {
        showNotification('Vui lòng nhập từ khóa tìm kiếm!', 'warning');
    }
}

// Cart functions
function addToCart(productId) {
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
    
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    const colorMap = {
        'success': '#28a745',
        'error': '#dc3545',
        'warning': '#ffc107',
        'info': '#17a2b8'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colorMap[type] || '#17a2b8'};
        color: ${type === 'warning' ? '#212529' : 'white'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add animation styles if not already added
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
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
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
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