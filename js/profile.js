// Profile page JavaScript
console.log('Profile.js loaded');

let isEditMode = false;
let originalFormData = {};

// Initialize profile page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Profile page DOM loaded');
    
    // Show loading state
    showLoadingState();
    
    // Wait for app.js to initialize
    let attempts = 0;
    const maxAttempts = 100; // Increase max attempts
    
    while (attempts < maxAttempts) {
        console.log(`Attempt ${attempts + 1}/${maxAttempts}: Checking user and database...`);
        
        // Try to ensure user is loaded
        if (typeof ensureUserLoaded === 'function') {
            ensureUserLoaded();
        } else {
            // Fallback if ensureUserLoaded is not available yet
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser && !currentUser) {
                try {
                    currentUser = JSON.parse(savedUser);
                    console.log('Loaded user from localStorage (fallback):', currentUser);
                } catch (e) {
                    console.error('Error parsing saved user:', e);
                }
            }
        }
        
        // Check if we have both user and database
        if (currentUser && database) {
            console.log('Both user and database are ready!');
            break;
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    // Hide loading state
    hideLoadingState();
    
    // Final check if user is logged in
    if (!currentUser) {
        console.log('No user found after waiting');
        showNotification('Vui lòng đăng nhập để xem thông tin cá nhân!', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
        return;
    }
    
    console.log('Profile page ready with user:', currentUser);
    
    // Initialize profile
    loadUserProfile();
    setupProfileForms();
    
    // Load default tab content
    showProfileTab('info');
    
    // Handle URL hash for direct tab access
    const hash = window.location.hash.replace('#', '');
    if (hash && ['info', 'orders', 'addresses', 'security'].includes(hash)) {
        showProfileTab(hash);
    }
});

function showLoadingState() {
    const profileContent = document.querySelector('.profile-content');
    if (profileContent) {
        profileContent.innerHTML = `
            <div class="loading" style="padding: 4rem; text-align: center;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #007BFF; margin-bottom: 1rem;"></i>
                <h3>Đang tải thông tin...</h3>
                <p>Vui lòng đợi trong giây lát</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // The loading state will be replaced when profile content loads
    console.log('Loading state will be replaced by profile content');
}

function loadUserProfile() {
    if (!currentUser) return;
    
    // Update sidebar info
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileRole').textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
    
    // Update form fields
    document.getElementById('fullName').value = currentUser.name || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('address').value = currentUser.address || '';
    document.getElementById('birthDate').value = currentUser.birthDate || '';
    document.getElementById('gender').value = currentUser.gender || '';
    
    // Set join date
    const joinDate = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString('vi-VN') : 'Không xác định';
    document.getElementById('joinDate').value = joinDate;
    
    // Store original data
    originalFormData = {
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        birthDate: currentUser.birthDate || '',
        gender: currentUser.gender || ''
    };
}

function setupProfileForms() {
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
}

function showProfileTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.profile-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.profile-nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Add active class to nav item
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Load tab-specific content
    switch (tabName) {
        case 'orders':
            loadUserOrders();
            break;
        case 'addresses':
            loadUserAddresses();
            break;
    }
}

function toggleEditMode() {
    isEditMode = !isEditMode;
    
    const editBtn = document.getElementById('editBtn');
    const formActions = document.getElementById('formActions');
    const formInputs = document.querySelectorAll('#profileForm input:not([type="email"]), #profileForm textarea, #profileForm select');
    
    if (isEditMode) {
        // Enable edit mode
        editBtn.innerHTML = '<i class="fas fa-times"></i> Hủy';
        editBtn.className = 'btn btn-secondary';
        formActions.classList.remove('hidden');
        
        formInputs.forEach(input => {
            if (input.id !== 'email' && input.id !== 'joinDate') {
                input.removeAttribute('readonly');
                input.removeAttribute('disabled');
            }
        });
    } else {
        // Disable edit mode
        cancelEdit();
    }
}

function cancelEdit() {
    isEditMode = false;
    
    const editBtn = document.getElementById('editBtn');
    const formActions = document.getElementById('formActions');
    const formInputs = document.querySelectorAll('#profileForm input:not([type="email"]), #profileForm textarea, #profileForm select');
    
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
    editBtn.className = 'btn btn-primary';
    formActions.classList.add('hidden');
    
    formInputs.forEach(input => {
        input.setAttribute('readonly', '');
        input.setAttribute('disabled', '');
    });
    
    // Restore original data
    document.getElementById('fullName').value = originalFormData.name;
    document.getElementById('phone').value = originalFormData.phone;
    document.getElementById('address').value = originalFormData.address;
    document.getElementById('birthDate').value = originalFormData.birthDate;
    document.getElementById('gender').value = originalFormData.gender;
}

function handleProfileUpdate(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updatedData = {
        name: formData.get('fullName'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        birthDate: formData.get('birthDate'),
        gender: formData.get('gender')
    };
    
    // Validation
    if (!updatedData.name.trim()) {
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
    
    // Update in database
    const userIndex = database.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        database.users[userIndex] = { ...database.users[userIndex], ...currentUser };
        saveDatabase();
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('userName').textContent = currentUser.name;
    
    // Store new original data
    originalFormData = { ...updatedData };
    
    // Exit edit mode
    toggleEditMode();
    
    showNotification('Cập nhật thông tin thành công!', 'success');
}

function loadUserOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    const userOrders = database.orders.filter(order => order.user_id === currentUser.id)
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
    if (userOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!</p>
                <a href="products.html" class="btn btn-primary">Mua sắm ngay</a>
            </div>
        `;
        return;
    }
    
    ordersList.innerHTML = userOrders.map(order => {
        const orderDetails = database.order_details.filter(detail => detail.order_id === order.id);
        const orderProducts = orderDetails.map(detail => {
            const product = database.products.find(p => p.id === detail.product_id);
            const variant = database.product_variants.find(v => v.id === detail.variant_id);
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
                            <img src="${item.product?.image || 'https://via.placeholder.com/60x60'}" alt="${item.product?.name || 'Sản phẩm'}">
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
}

function filterOrders() {
    const statusFilter = document.getElementById('orderStatusFilter').value;
    const orderItems = document.querySelectorAll('.order-item');
    
    orderItems.forEach(item => {
        const statusElement = item.querySelector('.order-status');
        const status = statusElement.className.split(' ')[1]; // Get status class
        
        if (!statusFilter || status === statusFilter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function loadUserAddresses() {
    const addressesList = document.getElementById('addressesList');
    if (!addressesList) return;
    
    // For demo, create some sample addresses
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
                <i class="fas fa-map-marker-alt" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3>Chưa có địa chỉ giao hàng</h3>
                <p>Thêm địa chỉ để thuận tiện cho việc giao hàng</p>
                <button onclick="showAddAddressModal()" class="btn btn-primary">Thêm địa chỉ</button>
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
                <button onclick="editAddress(${address.id})" class="btn btn-sm btn-secondary">
                    <i class="fas fa-edit"></i> Sửa
                </button>
                ${!address.isDefault ? `<button onclick="deleteAddress(${address.id})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i> Xóa
                </button>` : ''}
                ${!address.isDefault ? `<button onclick="setDefaultAddress(${address.id})" class="btn btn-sm btn-primary">
                    Đặt làm mặc định
                </button>` : ''}
            </div>
        </div>
    `).join('');
}

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

function showChangePasswordModal() {
    document.getElementById('changePasswordModal').style.display = 'block';
}

function handleChangePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
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
    
    // Update in database
    const userIndex = database.users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        database.users[userIndex].password = newPassword;
        saveDatabase();
    }
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Close modal and reset form
    closeModal('changePasswordModal');
    document.getElementById('changePasswordForm').reset();
    
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

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Override the viewProfile function from app.js
window.viewProfile = function() {
    window.location.href = 'profile.html';
};