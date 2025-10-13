// Modern Profile JavaScript - Clean, Simple, and Beautiful
console.log('Profile Modern JS loaded');

// Global variables
let isEditMode = false;
let originalFormData = {};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Modern Profile...');
    
    // Check if user is logged in
    if (!checkUserLogin()) {
        redirectToLogin();
        return;
    }
    
    // Load user data
    loadUserData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load default tab
    showTab('info');
    
    console.log('✅ Profile initialized successfully');
});

// Check if user is logged in
function checkUserLogin() {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        console.log('❌ No user found');
        return false;
    }
    
    try {
        currentUser = JSON.parse(savedUser);
        console.log('✅ User loaded:', currentUser.name);
        return true;
    } catch (error) {
        console.error('❌ Error parsing user data:', error);
        return false;
    }
}

// Redirect to login page
function redirectToLogin() {
    showNotification('Vui lòng đăng nhập để xem thông tin cá nhân!', 'error');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Load user data
async function loadUserData() {
    console.log('📊 Loading user data...');
    
    try {
        // Load database
        await loadDatabase();
        
        // Update UI
        updateUserInterface();
        
        // Load profile data
        loadProfileData();
        
        console.log('✅ User data loaded successfully');
    } catch (error) {
        console.error('❌ Error loading user data:', error);
        showNotification('Lỗi tải dữ liệu! Vui lòng thử lại.', 'error');
    }
}

// Load database
async function loadDatabase() {
    // Try localStorage first
    const savedDatabase = localStorage.getItem('database');
    if (savedDatabase) {
        try {
            database = JSON.parse(savedDatabase);
            console.log('✅ Database loaded from localStorage');
            return;
        } catch (error) {
            console.error('❌ Error parsing localStorage database:', error);
        }
    }
    
    // Try JSON file
    try {
        const response = await fetch('data/database.json');
        if (response.ok) {
            database = await response.json();
            localStorage.setItem('database', JSON.stringify(database));
            console.log('✅ Database loaded from JSON file');
        } else {
            throw new Error('Failed to load database from JSON');
        }
    } catch (error) {
        console.error('❌ Error loading database:', error);
        throw error;
    }
}

// Update user interface
function updateUserInterface() {
    // Update sidebar
    const profileNameEl = document.getElementById('profileName');
    const profileRoleEl = document.getElementById('profileRole');
    
    if (profileNameEl) {
        profileNameEl.textContent = currentUser.name || 'Người dùng';
    }
    
    if (profileRoleEl) {
        profileRoleEl.textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
    }
    
    // Update header username
    const userNameEl = document.getElementById('userName');
    if (userNameEl) {
        userNameEl.textContent = currentUser.name || 'Người dùng';
    }
}

// Load profile data
function loadProfileData() {
    console.log('👤 Loading profile data...');
    
    const fields = {
        'fullName': currentUser.name || '',
        'email': currentUser.email || '',
        'phone': currentUser.phone || '',
        'address': currentUser.address || '',
        'birthDate': currentUser.birthDate || '',
        'gender': currentUser.gender || ''
    };
    
    // Update form fields
    Object.entries(fields).forEach(([fieldId, value]) => {
        const element = document.getElementById(fieldId);
        if (element) {
            element.value = value;
        }
    });
    
    // Set join date
    const joinDateEl = document.getElementById('joinDate');
    if (joinDateEl) {
        const joinDate = currentUser.created_at ? 
            new Date(currentUser.created_at).toLocaleDateString('vi-VN') : 
            'Không xác định';
        joinDateEl.value = joinDate;
    }
    
    // Store original data
    originalFormData = { ...fields };
    
    console.log('✅ Profile data loaded');
}

// Setup event listeners
function setupEventListeners() {
    console.log('🎧 Setting up event listeners...');
    
    // Navigation tabs
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });
    
    // Edit button
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.addEventListener('click', toggleEditMode);
    }
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }
    
    console.log('✅ Event listeners setup completed');
}

// Show tab
function showTab(tabName) {
    console.log('📑 Showing tab:', tabName);
    
    // Hide all tabs
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to nav item
    const navItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Load tab content
    switch (tabName) {
        case 'orders':
            loadOrders();
            break;
        case 'addresses':
            loadAddresses();
            break;
    }
}

// Toggle edit mode
function toggleEditMode() {
    console.log('✏️ Toggle edit mode, current:', isEditMode);
    
    isEditMode = !isEditMode;
    
    const editBtn = document.getElementById('editBtn');
    const formActions = document.getElementById('formActions');
    const formInputs = document.querySelectorAll('#profileForm input:not([type="email"]), #profileForm textarea, #profileForm select');
    
    if (isEditMode) {
        // Enable edit mode
        if (editBtn) {
            editBtn.innerHTML = '<i class="fas fa-times"></i> Hủy';
            editBtn.className = 'edit-btn';
        }
        
        if (formActions) {
            formActions.classList.remove('hidden');
        }
        
        // Enable form inputs
        formInputs.forEach(input => {
            if (input.id !== 'email' && input.id !== 'joinDate') {
                input.removeAttribute('readonly');
                input.removeAttribute('disabled');
            }
        });
        
        console.log('✅ Edit mode enabled');
    } else {
        // Disable edit mode
        cancelEdit();
    }
}

// Cancel edit
function cancelEdit() {
    console.log('❌ Cancel edit');
    
    isEditMode = false;
    
    const editBtn = document.getElementById('editBtn');
    const formActions = document.getElementById('formActions');
    const formInputs = document.querySelectorAll('#profileForm input:not([type="email"]), #profileForm textarea, #profileForm select');
    
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
        editBtn.className = 'edit-btn';
    }
    
    if (formActions) {
        formActions.classList.add('hidden');
    }
    
    // Disable form inputs
    formInputs.forEach(input => {
        if (input.id !== 'email' && input.id !== 'joinDate') {
            input.setAttribute('readonly', '');
            input.setAttribute('disabled', '');
        }
    });
    
    // Restore original data
    restoreOriginalData();
    
    console.log('✅ Edit mode cancelled');
}

// Restore original data
function restoreOriginalData() {
    if (originalFormData) {
        const fields = ['fullName', 'phone', 'address', 'birthDate', 'gender'];
        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = originalFormData[fieldId] || '';
            }
        });
    }
}

// Handle profile update
function handleProfileUpdate(e) {
    e.preventDefault();
    console.log('💾 Profile update submitted');
    
    try {
        const formData = new FormData(e.target);
        const updatedData = {
            name: formData.get('fullName')?.trim() || '',
            phone: formData.get('phone')?.trim() || '',
            address: formData.get('address')?.trim() || '',
            birthDate: formData.get('birthDate') || '',
            gender: formData.get('gender') || ''
        };
        
        console.log('📝 Updated data:', updatedData);
        
        // Validation
        if (!updatedData.name) {
            showNotification('Vui lòng nhập họ tên!', 'error');
            return;
        }
        
        if (updatedData.phone && !isValidPhone(updatedData.phone)) {
            showNotification('Số điện thoại không hợp lệ!', 'error');
            return;
        }
        
        // Update user data
        currentUser.name = updatedData.name;
        currentUser.phone = updatedData.phone;
        currentUser.address = updatedData.address;
        currentUser.birthDate = updatedData.birthDate;
        currentUser.gender = updatedData.gender;
        
        // Update database
        if (database && database.users) {
            const userIndex = database.users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                database.users[userIndex] = { ...database.users[userIndex], ...currentUser };
                localStorage.setItem('database', JSON.stringify(database));
                console.log('✅ Database updated');
            }
        }
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('✅ localStorage updated');
        
        // Update UI
        updateUserInterface();
        
        // Store new original data
        originalFormData = { ...updatedData };
        
        // Exit edit mode
        cancelEdit();
        
        showNotification('Cập nhật thông tin thành công!', 'success');
        console.log('✅ Profile update completed successfully');
        
    } catch (error) {
        console.error('❌ Error updating profile:', error);
        showNotification('Lỗi cập nhật thông tin! Vui lòng thử lại.', 'error');
    }
}

// Load orders
function loadOrders() {
    console.log('📦 Loading orders...');
    
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (!database || !database.orders) {
        ordersList.innerHTML = '<p>Không có dữ liệu đơn hàng</p>';
        return;
    }
    
    const userOrders = database.orders
        .filter(order => order.user_id === currentUser.id)
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                <a href="products.html" class="btn btn-primary">Mua sắm ngay</a>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = userOrders.map(order => {
        const orderDetails = database.order_details ? 
            database.order_details.filter(detail => detail.order_id === order.id) : [];
        
        const orderProducts = orderDetails.map(detail => {
            const product = database.products ? 
                database.products.find(p => p.id === detail.product_id) : null;
            const variant = database.product_variants ? 
                database.product_variants.find(v => v.id === detail.variant_id) : null;
            
            return {
                ...detail,
                product: product,
                variant: variant
            };
        });
        
        return `
            <div class="order-item">
                <div class="order-header">
                    <div class="order-info">
                        <h4>Đơn hàng #${order.id}</h4>
                        <p>Ngày đặt: ${formatDate(order.created_date)}</p>
                    </div>
                    <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
                </div>
                
                <div class="order-products">
                    ${orderProducts.map(item => `
                        <div class="order-product">
                            <img src="${getSafeImageUrl(item.product?.image, item.product?.name)}" 
                                 alt="${item.product?.name || 'Sản phẩm'}"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAxNUMzNy4xODQgMTUgNDMgMjAuODE2IDQzIDI4QzQzIDM1LjE4NCAzNy4xODQgNDEgMzAgNDFDMTAuODE2IDQxIDE3IDM1LjE4NCAxNyAyOEMxNyAyMC44MTYgMjIuODE2IDE1IDMwIDE1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMzAgMjVDMzIuNzYxIDI1IDM1IDI3LjIzOSAzNSAzMEMzNSAzMi43NjEgMzIuNzYxIDM1IDMwIDM1QzI3LjIzOSAzNSAyNSAzMi43NjEgMjUgMzBDMjUgMjcuMjM5IDI3LjIzOSAyNSAzMCAyNVoiIGZpbGw9IiM5OTk5OTkiLz4KPHN0eWxlPgo8IVtDREFUQVsKdGV4dCB7IGZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiA4cHg7IGZpbGw6ICM5OTk5OTk7IHRleHQtYW5jaG9yOiBtaWRkbGU7IH0KXV0+Cjwvc3R5bGU+Cjx0ZXh0IHg9IjMwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='">
                            <div class="order-product-info">
                                <h5>${item.product?.name || 'Sản phẩm không xác định'}</h5>
                                <p>${item.variant?.variant_name || 'Phiên bản mặc định'} x ${item.quantity}</p>
                            </div>
                            <div class="order-product-price">${formatPrice(item.unit_price)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-total">
                    <h4>Tổng cộng: ${formatPrice(order.total_amount)}</h4>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Orders loaded:', userOrders.length);
}

// Load addresses
function loadAddresses() {
    console.log('📍 Loading addresses...');
    
    const addressesList = document.getElementById('addressesList');
    if (!addressesList) return;
    
    // Sample address
    const sampleAddresses = [
        {
            id: 1,
            name: 'Địa chỉ nhà riêng',
            fullName: currentUser.name,
            phone: currentUser.phone || '0123456789',
            address: currentUser.address || '123 Đường ABC, Quận 1, TP.HCM',
            isDefault: true
        }
    ];
    
    if (sampleAddresses.length === 0) {
        addressesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Chưa có địa chỉ giao hàng</h3>
                <p>Thêm địa chỉ để thuận tiện cho việc giao hàng</p>
                <button class="btn btn-primary" onclick="showAddAddressModal()">Thêm địa chỉ</button>
            </div>
        `;
        return;
    }
    
    addressesList.innerHTML = sampleAddresses.map(address => `
        <div class="address-item ${address.isDefault ? 'default' : ''}">
            ${address.isDefault ? '<div class="address-default-badge">Mặc định</div>' : ''}
            <div class="address-info">
                <h4>${address.name}</h4>
                <p><strong>${address.fullName}</strong></p>
                <p><i class="fas fa-phone"></i> ${address.phone}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${address.address}</p>
            </div>
            <div class="address-actions">
                <button class="btn btn-secondary" onclick="editAddress(${address.id})">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                ${!address.isDefault ? `<button class="btn btn-danger" onclick="deleteAddress(${address.id})">
                    <i class="fas fa-trash"></i> Xóa
                </button>` : ''}
                ${!address.isDefault ? `<button class="btn btn-primary" onclick="setDefaultAddress(${address.id})">
                    Đặt làm mặc định
                </button>` : ''}
            </div>
        </div>
    `).join('');
    
    console.log('✅ Addresses loaded');
}

// Filter orders
function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter');
    if (!statusFilter) return;
    
    const status = statusFilter.value;
    const orderItems = document.querySelectorAll('.order-item');
    
    orderItems.forEach(item => {
        const statusElement = item.querySelector('.order-status');
        const itemStatus = statusElement ? statusElement.className.split(' ')[1] : '';
        
        if (!status || itemStatus === status) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Address management functions
function showAddAddressModal() {
    showNotification('Tính năng thêm địa chỉ đang được phát triển!', 'info');
}

function editAddress(addressId) {
    showNotification('Tính năng sửa địa chỉ đang được phát triển!', 'info');
}

function deleteAddress(addressId) {
    showNotification('Tính năng xóa địa chỉ đang được phát triển!', 'info');
}

function setDefaultAddress(addressId) {
    showNotification('Tính năng đặt địa chỉ mặc định đang được phát triển!', 'info');
}

// Change password functions
function showChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function handleChangePassword(e) {
    e.preventDefault();
    console.log('🔐 Change password submitted');
    
    const currentPassword = document.getElementById('currentPassword')?.value || '';
    const newPassword = document.getElementById('newPassword')?.value || '';
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value || '';
    
    // Validation
    if (currentPassword !== currentUser.password) {
        showNotification('Mật khẩu hiện tại không đúng!', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showNotification('Xác nhận mật khẩu mới không khớp!', 'error');
        return;
    }
    
    if (newPassword === currentPassword) {
        showNotification('Mật khẩu mới phải khác mật khẩu hiện tại!', 'error');
        return;
    }
    
    // Update password
    currentUser.password = newPassword;
    
    // Update database
    if (database && database.users) {
        const userIndex = database.users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            database.users[userIndex].password = newPassword;
            localStorage.setItem('database', JSON.stringify(database));
        }
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Close modal and reset form
    closeModal('changePasswordModal');
    const form = document.getElementById('changePasswordForm');
    if (form) form.reset();
    
    showNotification('Đổi mật khẩu thành công!', 'success');
}

// Utility functions
function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
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

function getSafeImageUrl(url, name) {
    if (!url || url === '') {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAxNUMzNy4xODQgMTUgNDMgMjAuODE2IDQzIDI4QzQzIDM1LjE4NCAzNy4xODQgNDEgMzAgNDFDMTAuODE2IDQxIDE3IDM1LjE4NCAxNyAyOEMxNyAyMC44MTYgMjIuODE2IDE1IDMwIDE1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMzAgMjVDMzIuNzYxIDI1IDM1IDI3LjIzOSAzNSAzMEMzNSAzMi43NjEgMzIuNzYxIDM1IDMwIDM1QzI3LjIzOSAzNSAyNSAzMi43NjEgMjUgMzBDMjUgMjcuMjM5IDI3LjIzOSAyNSAzMCAyNVoiIGZpbGw9IiM5OTk5OTkiLz4KPHN0eWxlPgo8IVtDREFUQVsKdGV4dCB7IGZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiA4cHg7IGZpbGw6ICM5OTk5OTk7IHRleHQtYW5jaG9yOiBtaWRkbGU7IH0KXV0+Cjwvc3R5bGU+Cjx0ZXh0IHg9IjMwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo=';
    }
    return url;
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not exists
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }
            .notification-success { background: #28a745; }
            .notification-error { background: #dc3545; }
            .notification-info { background: #17a2b8; }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Make functions available globally
window.showTab = showTab;
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;
window.filterOrders = filterOrders;
window.showAddAddressModal = showAddAddressModal;
window.editAddress = editAddress;
window.deleteAddress = deleteAddress;
window.setDefaultAddress = setDefaultAddress;
window.showChangePasswordModal = showChangePasswordModal;
window.closeModal = closeModal;
window.showNotification = showNotification;

console.log('🎉 Profile Modern JS setup completed');