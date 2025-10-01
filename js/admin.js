// Admin page functionality
let currentSection = 'dashboard';

// Initialize admin page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        initializeAdminPage();
    }
});

async function initializeAdminPage() {
    // Check admin access
    if (!currentUser || currentUser.role !== 'admin') {
        showNotification('Bạn không có quyền truy cập trang này!', 'error');
        window.location.href = 'index.html';
        return;
    }
    
    // Wait for database to load
    while (!database) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Update admin user name
    const adminUserName = document.getElementById('adminUserName');
    if (adminUserName) {
        adminUserName.textContent = currentUser.name;
    }
    
    // Load dashboard by default
    loadDashboard();
    loadCategoriesForForms();
    
    // Setup form handlers
    setupAdminForms();
}

function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from nav links
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to nav link
    document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch (sectionName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'categories':
            loadCategories();
            break;
        case 'products':
            loadProducts();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'statistics':
            loadStatistics();
            break;
    }
}

// Dashboard functions
function loadDashboard() {
    updateDashboardStats();
    loadRecentOrders();
}

function updateDashboardStats() {
    const totalProducts = document.getElementById('totalProducts');
    const totalCustomers = document.getElementById('totalCustomers');
    const totalOrders = document.getElementById('totalOrders');
    const totalRevenue = document.getElementById('totalRevenue');
    
    if (totalProducts) totalProducts.textContent = database.products.length;
    if (totalCustomers) totalCustomers.textContent = database.users.filter(u => u.role !== 'admin').length;
    if (totalOrders) totalOrders.textContent = database.orders.length;
    
    const revenue = database.orders.reduce((sum, order) => sum + order.total_amount, 0);
    if (totalRevenue) totalRevenue.textContent = formatPrice(revenue);
}

function loadRecentOrders() {
    const recentOrders = document.getElementById('recentOrders');
    if (!recentOrders) return;
    
    const orders = database.orders
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
        .slice(0, 5);
    
    recentOrders.innerHTML = orders.map(order => {
        const user = database.users.find(u => u.id === order.user_id);
        const userName = user ? user.name : 'Không xác định';
        
        return `
            <div class="recent-order-item">
                <div class="recent-order-info">
                    <h4>Đơn hàng #${order.id}</h4>
                    <p>Khách hàng: ${userName}</p>
                    <p>Ngày: ${formatDate(order.created_date)}</p>
                </div>
                <div class="recent-order-amount">
                    ${formatPrice(order.total_amount)}
                </div>
            </div>
        `;
    }).join('');
}

// Categories management
function loadCategories() {
    const categoriesTable = document.getElementById('categoriesTable');
    if (!categoriesTable) return;
    
    categoriesTable.innerHTML = database.categories.map(category => {
        const parentCategory = database.categories.find(c => c.id === category.parent_id);
        const parentName = parentCategory ? parentCategory.name : 'Danh mục gốc';
        const productCount = database.products.filter(p => p.cate_id === category.id).length;
        
        return `
            <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>${parentName}</td>
                <td>${productCount}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editCategory(${category.id})" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button onclick="deleteCategory(${category.id})" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddCategoryModal() {
    document.getElementById('addCategoryModal').style.display = 'block';
}

function loadCategoriesForForms() {
    const parentCategory = document.getElementById('parentCategory');
    const productCategory = document.getElementById('productCategory');
    
    if (parentCategory) {
        parentCategory.innerHTML = '<option value="">Danh mục gốc</option>';
        database.categories.forEach(category => {
            parentCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    }
    
    if (productCategory) {
        productCategory.innerHTML = '<option value="">Chọn danh mục</option>';
        database.categories.forEach(category => {
            productCategory.innerHTML += `<option value="${category.id}">${category.name}</option>`;
        });
    }
}

// Products management
function loadProducts() {
    const productsTable = document.getElementById('productsTable');
    if (!productsTable) return;
    
    productsTable.innerHTML = database.products.map(product => {
        const category = database.categories.find(c => c.id === product.cate_id);
        const categoryName = category ? category.name : 'Không xác định';
        const variant = database.product_variants.find(v => v.product_id === product.id);
        const price = variant ? formatPrice(variant.price) : 'Chưa có';
        const stock = database.product_variants
            .filter(v => v.product_id === product.id)
            .reduce((sum, v) => sum + v.quantity, 0);
        
        return `
            <tr>
                <td>${product.id}</td>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${categoryName}</td>
                <td>${price}</td>
                <td>${stock}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="editProduct(${product.id})" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                        <button onclick="deleteProduct(${product.id})" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function showAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
}

// Customers management
function loadCustomers() {
    const customersTable = document.getElementById('customersTable');
    if (!customersTable) return;
    
    const customers = database.users.filter(u => u.role !== 'admin');
    
    customersTable.innerHTML = customers.map(customer => {
        const orderCount = database.orders.filter(o => o.user_id === customer.id).length;
        
        return `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td>${orderCount}</td>
                <td>
                    <div class="action-buttons">
                        <button onclick="viewCustomerDetails(${customer.id})" class="btn btn-primary btn-sm">
                            <i class="fas fa-eye"></i> Xem
                        </button>
                        <button onclick="deleteCustomer(${customer.id})" class="btn btn-danger btn-sm">
                            <i class="fas fa-trash"></i> Xóa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Orders management
function loadOrders() {
    const ordersTable = document.getElementById('ordersTable');
    if (!ordersTable) return;
    
    const orders = database.orders.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    ordersTable.innerHTML = orders.map(order => {
        const user = database.users.find(u => u.id === order.user_id);
        const userName = user ? user.name : 'Không xác định';
        
        return `
            <tr>
                <td>${order.id}</td>
                <td>${userName}</td>
                <td>${formatDate(order.created_date)}</td>
                <td>${formatPrice(order.total_amount)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button onclick="viewOrderDetails(${order.id})" class="btn btn-primary btn-sm">
                            <i class="fas fa-eye"></i> Xem
                        </button>
                        <button onclick="editOrderStatus(${order.id})" class="btn btn-warning btn-sm">
                            <i class="fas fa-edit"></i> Sửa
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Statistics
function loadStatistics() {
    loadMonthlyStats();
    loadTopProducts();
    loadVipCustomers();
}

function loadMonthlyStats() {
    const monthStats = document.getElementById('monthStats');
    if (!monthStats) return;
    
    const monthlyData = {};
    
    database.orders.forEach(order => {
        const date = new Date(order.created_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { orders: 0, revenue: 0 };
        }
        
        monthlyData[monthKey].orders++;
        monthlyData[monthKey].revenue += order.total_amount;
    });
    
    const sortedMonths = Object.keys(monthlyData).sort().reverse().slice(0, 6);
    
    monthStats.innerHTML = sortedMonths.map(month => `
        <div class="month-stat-item">
            <div>
                <h4>Tháng ${month}</h4>
                <p>${monthlyData[month].orders} đơn hàng</p>
            </div>
            <p>${formatPrice(monthlyData[month].revenue)}</p>
        </div>
    `).join('');
}

function loadTopProducts() {
    const topProducts = document.getElementById('topProducts');
    if (!topProducts) return;
    
    const productSales = {};
    
    database.order_details.forEach(detail => {
        if (!productSales[detail.product_id]) {
            productSales[detail.product_id] = 0;
        }
        productSales[detail.product_id] += detail.quantity;
    });
    
    const sortedProducts = Object.entries(productSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);
    
    topProducts.innerHTML = sortedProducts.map(([productId, sales]) => {
        const product = database.products.find(p => p.id === parseInt(productId));
        if (!product) return '';
        
        return `
            <div class="top-product-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p>Đã bán: ${sales} sản phẩm</p>
                </div>
                <div class="product-sales">${sales}</div>
            </div>
        `;
    }).join('');
}

function loadVipCustomers() {
    const vipCustomers = document.getElementById('vipCustomers');
    if (!vipCustomers) return;
    
    const customerOrders = {};
    
    database.orders.forEach(order => {
        if (!customerOrders[order.user_id]) {
            customerOrders[order.user_id] = { count: 0, total: 0 };
        }
        customerOrders[order.user_id].count++;
        customerOrders[order.user_id].total += order.total_amount;
    });
    
    const sortedCustomers = Object.entries(customerOrders)
        .sort(([,a], [,b]) => b.total - a.total)
        .slice(0, 5);
    
    vipCustomers.innerHTML = sortedCustomers.map(([userId, data]) => {
        const user = database.users.find(u => u.id === parseInt(userId));
        if (!user) return '';
        
        return `
            <div class="vip-customer-item">
                <div class="customer-info">
                    <h4>${user.name}</h4>
                    <p>${data.count} đơn hàng - ${formatPrice(data.total)}</p>
                </div>
                <div class="customer-orders">${data.count}</div>
            </div>
        `;
    }).join('');
}

// Form handlers
function setupAdminForms() {
    // Add Category Form
    const addCategoryForm = document.getElementById('addCategoryForm');
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', handleAddCategory);
    }
    
    // Add Product Form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    // Edit Order Form
    const editOrderForm = document.getElementById('editOrderForm');
    if (editOrderForm) {
        editOrderForm.addEventListener('submit', handleEditOrder);
    }
}

function handleAddCategory(e) {
    e.preventDefault();
    
    const name = document.getElementById('categoryName').value;
    const parentId = document.getElementById('parentCategory').value || null;
    
    const newCategory = {
        id: Math.max(...database.categories.map(c => c.id)) + 1,
        name: name,
        parent_id: parentId ? parseInt(parentId) : null
    };
    
    database.categories.push(newCategory);
    saveDatabase();
    
    closeModal('addCategoryModal');
    loadCategories();
    loadCategoriesForForms();
    showNotification('Đã thêm danh mục mới!', 'success');
    
    // Reset form
    document.getElementById('addCategoryForm').reset();
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const categoryId = parseInt(document.getElementById('productCategory').value);
    const detail = document.getElementById('productDetail').value;
    const image = document.getElementById('productImage').value;
    const variantName = document.getElementById('variantName').value;
    const price = parseInt(document.getElementById('variantPrice').value);
    const quantity = parseInt(document.getElementById('variantQuantity').value);
    
    // Add product
    const newProduct = {
        id: Math.max(...database.products.map(p => p.id)) + 1,
        name: name,
        cate_id: categoryId,
        detail: detail,
        image: image
    };
    
    database.products.push(newProduct);
    
    // Add product variant
    const newVariant = {
        id: Math.max(...database.product_variants.map(v => v.id)) + 1,
        product_id: newProduct.id,
        variant_name: variantName,
        price: price,
        quantity: quantity,
        image: image
    };
    
    database.product_variants.push(newVariant);
    saveDatabase();
    
    closeModal('addProductModal');
    loadProducts();
    showNotification('Đã thêm sản phẩm mới!', 'success');
    
    // Reset form
    document.getElementById('addProductForm').reset();
}

function handleEditOrder(e) {
    e.preventDefault();
    
    const orderId = parseInt(document.getElementById('editOrderId').value);
    const status = document.getElementById('orderStatus').value;
    
    const order = database.orders.find(o => o.id === orderId);
    if (order) {
        order.status = status;
        saveDatabase();
        
        closeModal('editOrderModal');
        loadOrders();
        showNotification('Đã cập nhật trạng thái đơn hàng!', 'success');
    }
}

// Action functions
function editCategory(categoryId) {
    const category = database.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    const newName = prompt('Nhập tên danh mục mới:', category.name);
    if (newName && newName !== category.name) {
        category.name = newName;
        saveDatabase();
        loadCategories();
        showNotification('Đã cập nhật danh mục!', 'success');
    }
}

function deleteCategory(categoryId) {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    
    // Check if category has products
    const hasProducts = database.products.some(p => p.cate_id === categoryId);
    if (hasProducts) {
        showNotification('Không thể xóa danh mục có sản phẩm!', 'error');
        return;
    }
    
    database.categories = database.categories.filter(c => c.id !== categoryId);
    saveDatabase();
    loadCategories();
    loadCategoriesForForms();
    showNotification('Đã xóa danh mục!', 'success');
}

function editProduct(productId) {
    showNotification('Chức năng sửa sản phẩm đang được phát triển!', 'info');
}

function deleteProduct(productId) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
    
    database.products = database.products.filter(p => p.id !== productId);
    database.product_variants = database.product_variants.filter(v => v.product_id !== productId);
    saveDatabase();
    loadProducts();
    showNotification('Đã xóa sản phẩm!', 'success');
}

function viewCustomerDetails(customerId) {
    const customer = database.users.find(u => u.id === customerId);
    const orders = database.orders.filter(o => o.user_id === customerId);
    
    if (!customer) return;
    
    const orderInfo = orders.map(o => `Đơn #${o.id}: ${formatPrice(o.total_amount)} (${getStatusText(o.status)})`).join('\n');
    
    alert(`Thông tin khách hàng:\n\nTên: ${customer.name}\nEmail: ${customer.email}\nSĐT: ${customer.phone}\nĐịa chỉ: ${customer.address}\n\nĐơn hàng:\n${orderInfo || 'Chưa có đơn hàng nào'}`);
}

function deleteCustomer(customerId) {
    if (!confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) return;
    
    database.users = database.users.filter(u => u.id !== customerId);
    saveDatabase();
    loadCustomers();
    showNotification('Đã xóa khách hàng!', 'success');
}

function viewOrderDetails(orderId) {
    const order = database.orders.find(o => o.id === orderId);
    const orderDetails = database.order_details.filter(od => od.order_id === orderId);
    const user = database.users.find(u => u.id === order.user_id);
    
    if (!order) return;
    
    let detailsText = orderDetails.map(detail => {
        const product = database.products.find(p => p.id === detail.product_id);
        const variant = database.product_variants.find(v => v.id === detail.variant_id);
        return `${product ? product.name : 'Sản phẩm không xác định'} (${variant ? variant.variant_name : 'N/A'}) x${detail.quantity} = ${formatPrice(detail.unit_price * detail.quantity)}`;
    }).join('\n');
    
    alert(`Chi tiết đơn hàng #${order.id}\n\nKhách hàng: ${user ? user.name : 'Không xác định'}\nNgày đặt: ${formatDate(order.created_date)}\nTrạng thái: ${getStatusText(order.status)}\n\nSản phẩm:\n${detailsText}\n\nTổng cộng: ${formatPrice(order.total_amount)}`);
}

function editOrderStatus(orderId) {
    const order = database.orders.find(o => o.id === orderId);
    if (!order) return;
    
    document.getElementById('editOrderId').value = orderId;
    document.getElementById('orderStatus').value = order.status;
    document.getElementById('editOrderModal').style.display = 'block';
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'Chờ xử lý',
        'processing': 'Đang xử lý',
        'shipping': 'Đang giao hàng',
        'completed': 'Hoàn thành',
        'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
}