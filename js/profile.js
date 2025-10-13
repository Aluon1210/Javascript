// Profile page JavaScript
console.log('Profile.js loaded');

let isEditMode = false;
let originalFormData = {};

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
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

// Make showNotification available globally
window.showNotification = showNotification;

// Utility function to format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Make formatPrice available globally
window.formatPrice = formatPrice;

// Utility function to save database
function saveDatabase() {
    if (database) {
        localStorage.setItem('database', JSON.stringify(database));
        console.log('Database saved to localStorage');
    }
}

// Make saveDatabase available globally
window.saveDatabase = saveDatabase;

// Utility function to close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Make closeModal available globally
window.closeModal = closeModal;

// Initialize profile page
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Profile page DOM loaded');
    
    // Show loading state
    showLoadingState();
    
    try {
        // Wait for app.js to initialize with a more robust approach
        let attempts = 0;
        const maxAttempts = 50; // Reduce max attempts but increase timeout
        
        while (attempts < maxAttempts) {
            console.log(`Attempt ${attempts + 1}/${maxAttempts}: Checking user and database...`);
            
            // Try to load user from localStorage first
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser && !currentUser) {
                try {
                    currentUser = JSON.parse(savedUser);
                    console.log('Loaded user from localStorage:', currentUser);
                } catch (e) {
                    console.error('Error parsing saved user:', e);
                    localStorage.removeItem('currentUser');
                }
            }
            
            // Try to load database from localStorage
            const savedDatabase = localStorage.getItem('database');
            if (savedDatabase && !database) {
                try {
                    database = JSON.parse(savedDatabase);
                    console.log('Loaded database from localStorage');
                } catch (e) {
                    console.error('Error parsing saved database:', e);
                    localStorage.removeItem('database');
                }
            }
            
            // If database is not loaded, try to load from JSON file
            if (!database) {
                try {
                    const response = await fetch('data/database.json');
                    if (response.ok) {
                        database = await response.json();
                        console.log('Loaded database from JSON file');
                        // Save to localStorage for future use
                        localStorage.setItem('database', JSON.stringify(database));
                    }
                } catch (e) {
                    console.error('Error loading database from JSON:', e);
                }
            }
            
            // Check if we have both user and database
            if (currentUser && database) {
                console.log('Both user and database are ready!');
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
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
        
        if (!database) {
            console.log('Database not loaded, using fallback profile');
            showNotification('Sử dụng chế độ hiển thị cơ bản', 'info');
            createFallbackProfile();
            return;
        }
        
        console.log('Profile page ready with user:', currentUser);
        
        // Initialize profile
        try {
            loadUserProfile();
            setupProfileForms();
            
            // Load default tab content
            showProfileTab('info');
            
            // Handle URL hash for direct tab access
            const hash = window.location.hash.replace('#', '');
            if (hash && ['info', 'orders', 'addresses', 'security'].includes(hash)) {
                showProfileTab(hash);
            }
        } catch (error) {
            console.error('Error initializing profile:', error);
            createFallbackProfile();
        }
        
    } catch (error) {
        console.error('Error initializing profile page:', error);
        hideLoadingState();
        showNotification('Lỗi tải trang! Vui lòng thử lại.', 'error');
    }
});

function showLoadingState() {
    const profileContent = document.querySelector('.profile-content');
    if (profileContent) {
        profileContent.innerHTML = `
            <div class="loading" style="padding: 4rem; text-align: center;">
                <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #667eea; margin-bottom: 1rem;"></i>
                <h3>Đang tải thông tin...</h3>
                <p>Vui lòng đợi trong giây lát</p>
            </div>
        `;
    }
}

function hideLoadingState() {
    // The loading state will be replaced when profile content loads
    console.log('Loading state will be replaced by profile content');
    
    // Ensure the profile content is properly restored
    const profileContent = document.querySelector('.profile-content');
    if (profileContent && profileContent.innerHTML.includes('loading')) {
        // If still showing loading, restore the original content
        profileContent.innerHTML = `
            <!-- Personal Info Tab -->
            <div id="info-tab" class="profile-tab active">
                <div class="tab-header">
                    <h2>Thông tin cá nhân</h2>
                    <button class="btn btn-primary" id="editBtn">
                        <i class="fas fa-edit"></i> Chỉnh sửa
                    </button>
                </div>

                <div class="profile-form">
                    <form id="profileForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="fullName">
                                    <i class="fas fa-user"></i>
                                    Họ và tên
                                </label>
                                <input type="text" id="fullName" name="fullName" readonly>
                            </div>
                            <div class="form-group">
                                <label for="email">
                                    <i class="fas fa-envelope"></i>
                                    Email
                                </label>
                                <input type="email" id="email" name="email" readonly>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="phone">
                                    <i class="fas fa-phone"></i>
                                    Số điện thoại
                                </label>
                                <input type="tel" id="phone" name="phone" readonly>
                            </div>
                            <div class="form-group">
                                <label for="birthDate">
                                    <i class="fas fa-birthday-cake"></i>
                                    Ngày sinh
                                </label>
                                <input type="date" id="birthDate" name="birthDate" readonly>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="address">
                                <i class="fas fa-map-marker-alt"></i>
                                Địa chỉ
                            </label>
                            <textarea id="address" name="address" rows="3" readonly></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="gender">
                                    <i class="fas fa-venus-mars"></i>
                                    Giới tính
                                </label>
                                <select id="gender" name="gender" disabled>
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="joinDate">
                                    <i class="fas fa-calendar-alt"></i>
                                    Ngày tham gia
                                </label>
                                <input type="text" id="joinDate" name="joinDate" readonly>
                            </div>
                        </div>

                        <div class="form-actions hidden" id="formActions">
                            <button type="button" class="btn btn-secondary" id="cancelBtn">
                                <i class="fas fa-times"></i> Hủy
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Lưu thay đổi
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Orders Tab -->
            <div id="orders-tab" class="profile-tab">
                <div class="tab-header">
                    <h2>Đơn hàng của tôi</h2>
                    <div class="order-filters">
                        <select id="orderStatusFilter" onchange="filterOrders()">
                            <option value="">Tất cả đơn hàng</option>
                            <option value="pending">Chờ xử lý</option>
                            <option value="processing">Đang xử lý</option>
                            <option value="shipping">Đang giao hàng</option>
                            <option value="completed">Hoàn thành</option>
                            <option value="cancelled">Đã hủy</option>
                        </select>
                    </div>
                </div>

                <div class="orders-list" id="ordersList">
                    <!-- Orders will be loaded here -->
                </div>
            </div>

            <!-- Addresses Tab -->
            <div id="addresses-tab" class="profile-tab">
                <div class="tab-header">
                    <h2>Địa chỉ giao hàng</h2>
                    <button onclick="showAddAddressModal()" class="btn btn-primary">
                        <i class="fas fa-plus"></i> Thêm địa chỉ
                    </button>
                </div>

                <div class="addresses-list" id="addressesList">
                    <!-- Addresses will be loaded here -->
                </div>
            </div>

            <!-- Security Tab -->
            <div id="security-tab" class="profile-tab">
                <div class="tab-header">
                    <h2>Bảo mật tài khoản</h2>
                </div>

                <div class="security-content">
                    <div class="security-item">
                        <div class="security-info">
                            <h3>Đổi mật khẩu</h3>
                            <p>Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                        </div>
                        <button onclick="showChangePasswordModal()" class="btn btn-primary">
                            <i class="fas fa-key"></i> Đổi mật khẩu
                        </button>
                    </div>

                    <div class="security-item">
                        <div class="security-info">
                            <h3>Xác thực 2 bước</h3>
                            <p>Tăng cường bảo mật với xác thực 2 bước</p>
                        </div>
                        <button class="btn btn-secondary" disabled>
                            <i class="fas fa-shield-alt"></i> Đang phát triển
                        </button>
                    </div>

                    <div class="security-item">
                        <div class="security-info">
                            <h3>Lịch sử đăng nhập</h3>
                            <p>Xem các lần đăng nhập gần đây</p>
                        </div>
                        <button class="btn btn-secondary" disabled>
                            <i class="fas fa-history"></i> Đang phát triển
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Setup forms after restoring content
        setTimeout(() => {
            setupProfileForms();
        }, 100);
    }
}

function loadUserProfile() {
    if (!currentUser) {
        console.error('No currentUser available for loadUserProfile');
        return;
    }
    
    console.log('Loading user profile for:', currentUser);
    
    try {
        // Update sidebar info
        const profileNameEl = document.getElementById('profileName');
        const profileRoleEl = document.getElementById('profileRole');
        
        if (profileNameEl) {
            profileNameEl.textContent = currentUser.name || 'Người dùng';
        }
        if (profileRoleEl) {
            profileRoleEl.textContent = currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
        }
        
        // Update form fields with error handling
        const formFields = {
            'fullName': currentUser.name || '',
            'email': currentUser.email || '',
            'phone': currentUser.phone || '',
            'address': currentUser.address || '',
            'birthDate': currentUser.birthDate || '',
            'gender': currentUser.gender || ''
        };
        
        Object.entries(formFields).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
            } else {
                console.warn(`Element with id '${fieldId}' not found`);
            }
        });
        
        // Set join date
        const joinDateEl = document.getElementById('joinDate');
        if (joinDateEl) {
            const joinDate = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString('vi-VN') : 'Không xác định';
            joinDateEl.value = joinDate;
        }
        
        // Store original data
        originalFormData = {
            name: currentUser.name || '',
            phone: currentUser.phone || '',
            address: currentUser.address || '',
            birthDate: currentUser.birthDate || '',
            gender: currentUser.gender || ''
        };
        
        console.log('User profile loaded successfully');
        
    } catch (error) {
        console.error('Error loading user profile:', error);
        showNotification('Lỗi tải thông tin cá nhân!', 'error');
    }
}

function setupProfileForms() {
    console.log('Setting up profile forms...');
    
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        // Remove existing listeners to avoid duplicates
        profileForm.removeEventListener('submit', handleProfileUpdate);
        profileForm.addEventListener('submit', handleProfileUpdate);
        console.log('Profile form event listener added');
    } else {
        console.error('Profile form not found');
    }
    
    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        // Remove existing listeners to avoid duplicates
        changePasswordForm.removeEventListener('submit', handleChangePassword);
        changePasswordForm.addEventListener('submit', handleChangePassword);
        console.log('Change password form event listener added');
    } else {
        console.warn('Change password form not found');
    }
    
    // Setup edit button
    const editBtn = document.getElementById('editBtn');
    if (editBtn) {
        editBtn.onclick = function() { toggleEditMode(); };
        console.log('Edit button setup completed');
    } else {
        console.error('Edit button not found');
    }
    
    // Setup cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.onclick = function() { cancelEdit(); };
        console.log('Cancel button setup completed');
    } else {
        console.warn('Cancel button not found');
    }
    
    console.log('Profile forms setup completed');
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
    console.log('toggleEditMode called, current isEditMode:', isEditMode);
    
    const editBtn = document.getElementById('editBtn');
    const formActions = document.getElementById('formActions');
    const formInputs = document.querySelectorAll('#profileForm input:not([type="email"]), #profileForm textarea, #profileForm select');
    
    if (!editBtn) {
        console.error('Edit button not found');
        return;
    }
    
    if (!formActions) {
        console.error('Form actions not found');
        return;
    }
    
    isEditMode = !isEditMode;
    console.log('New isEditMode:', isEditMode);
    
    if (isEditMode) {
        // Enable edit mode
        editBtn.innerHTML = '<i class="fas fa-times"></i> Hủy';
        editBtn.className = 'btn btn-secondary';
        editBtn.onclick = function() { cancelEdit(); };
        
        if (formActions) {
            formActions.classList.remove('hidden');
        }
        
        formInputs.forEach(input => {
            if (input.id !== 'email' && input.id !== 'joinDate') {
                input.removeAttribute('readonly');
                input.removeAttribute('disabled');
            }
        });
        
        console.log('Edit mode enabled');
    } else {
        // Disable edit mode
        cancelEdit();
    }
}

function cancelEdit() {
    console.log('cancelEdit called');
    isEditMode = false;
    
    const editBtn = document.getElementById('editBtn');
    const formActions = document.getElementById('formActions');
    const formInputs = document.querySelectorAll('#profileForm input:not([type="email"]), #profileForm textarea, #profileForm select');
    
    if (editBtn) {
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Chỉnh sửa';
        editBtn.className = 'btn btn-primary';
        editBtn.onclick = function() { toggleEditMode(); };
    }
    
    if (formActions) {
        formActions.classList.add('hidden');
    }
    
    formInputs.forEach(input => {
        if (input.id !== 'email' && input.id !== 'joinDate') {
            input.setAttribute('readonly', '');
            input.setAttribute('disabled', '');
        }
    });
    
    // Restore original data
    if (originalFormData) {
        const fullNameEl = document.getElementById('fullName');
        const phoneEl = document.getElementById('phone');
        const addressEl = document.getElementById('address');
        const birthDateEl = document.getElementById('birthDate');
        const genderEl = document.getElementById('gender');
        
        if (fullNameEl) fullNameEl.value = originalFormData.name || '';
        if (phoneEl) phoneEl.value = originalFormData.phone || '';
        if (addressEl) addressEl.value = originalFormData.address || '';
        if (birthDateEl) birthDateEl.value = originalFormData.birthDate || '';
        if (genderEl) genderEl.value = originalFormData.gender || '';
    }
    
    console.log('Edit mode cancelled');
}

function handleProfileUpdate(e) {
    e.preventDefault();
    console.log('handleProfileUpdate called');
    
    try {
        const formData = new FormData(e.target);
        const updatedData = {
            name: formData.get('fullName'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            birthDate: formData.get('birthDate'),
            gender: formData.get('gender')
        };
        
        console.log('Updated data:', updatedData);
        
        // Validation
        if (!updatedData.name || !updatedData.name.trim()) {
            showNotification('Vui lòng nhập họ tên!', 'error');
            return;
        }
        
        if (updatedData.phone && !isValidPhone(updatedData.phone)) {
            showNotification('Số điện thoại không hợp lệ!', 'error');
            return;
        }
        
        // Update user data
        if (currentUser) {
            currentUser.name = updatedData.name.trim();
            currentUser.phone = updatedData.phone ? updatedData.phone.trim() : '';
            currentUser.address = updatedData.address ? updatedData.address.trim() : '';
            currentUser.birthDate = updatedData.birthDate || '';
            currentUser.gender = updatedData.gender || '';
            
            console.log('Updated currentUser:', currentUser);
        }
        
        // Update in database
        if (database && database.users) {
            const userIndex = database.users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                database.users[userIndex] = { ...database.users[userIndex], ...currentUser };
                saveDatabase();
                console.log('Database updated');
            }
        }
        
        // Update localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        console.log('localStorage updated');
        
        // Update UI
        const profileNameEl = document.getElementById('profileName');
        const userNameEl = document.getElementById('userName');
        
        if (profileNameEl) {
            profileNameEl.textContent = currentUser.name;
        }
        if (userNameEl) {
            userNameEl.textContent = currentUser.name;
        }
        
        // Store new original data
        originalFormData = { ...updatedData };
        
        // Exit edit mode
        cancelEdit();
        
        showNotification('Cập nhật thông tin thành công!', 'success');
        console.log('Profile update completed successfully');
        
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Lỗi cập nhật thông tin! Vui lòng thử lại.', 'error');
    }
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
                            <img src="${window.getSafeImageUrl ? window.getSafeImageUrl(item.product?.image, item.product?.name) : (item.product?.image || 'https://via.placeholder.com/60x60')}" 
                                 alt="${item.product?.name || 'Sản phẩm'}"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAxNUMzNy4xODQgMTUgNDMgMjAuODE2IDQzIDI4QzQzIDM1LjE4NCAzNy4xODQgNDEgMzAgNDFDMjIuODE2IDQxIDE3IDM1LjE4NCAxNyAyOEMxNyAyMC44MTYgMjIuODE2IDE1IDMwIDE1WiIgZmlsbD0iI0NDQ0NDQyIvPgo8cGF0aCBkPSJNMzAgMjVDMzIuNzYxIDI1IDM1IDI3LjIzOSAzNSAzMEMzNSAzMi43NjEgMzIuNzYxIDM1IDMwIDM1QzI3LjIzOSAzNSAyNSAzMi43NjEgMjUgMzBDMjUgMjcuMjM5IDI3LjIzOSAyNSAzMCAyNVoiIGZpbGw9IiM5OTk5OTkiLz4KPHN0eWxlPgo8IVtDREFUQVsKdGV4dCB7IGZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiA4cHg7IGZpbGw6ICM5OTk5OTk7IHRleHQtYW5jaG9yOiBtaWRkbGU7IH0KXV0+Cjwvc3R5bGU+Cjx0ZXh0IHg9IjMwIiB5PSI1MCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPgo='">
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

// Fallback function to create a simple profile display
function createFallbackProfile() {
    console.log('Creating fallback profile display');
    
    const profileContent = document.querySelector('.profile-content');
    if (!profileContent) return;
    
    profileContent.innerHTML = `
        <div class="profile-tab active">
            <div class="tab-header">
                <h2>Thông tin cá nhân</h2>
            </div>
            
            <div class="profile-form">
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Họ và tên</label>
                    <input type="text" value="${currentUser?.name || 'Chưa có thông tin'}" readonly>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-envelope"></i> Email</label>
                    <input type="email" value="${currentUser?.email || 'Chưa có thông tin'}" readonly>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-phone"></i> Số điện thoại</label>
                    <input type="tel" value="${currentUser?.phone || 'Chưa có thông tin'}" readonly>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-map-marker-alt"></i> Địa chỉ</label>
                    <textarea readonly>${currentUser?.address || 'Chưa có thông tin'}</textarea>
                </div>
                
                <div class="form-group">
                    <label><i class="fas fa-calendar-alt"></i> Ngày tham gia</label>
                    <input type="text" value="${currentUser?.created_at ? new Date(currentUser.created_at).toLocaleDateString('vi-VN') : 'Không xác định'}" readonly>
                </div>
                
                <div class="form-actions">
                    <button onclick="window.location.href='index.html'" class="btn btn-primary">
                        <i class="fas fa-home"></i> Về trang chủ
                    </button>
                    <button onclick="window.location.reload()" class="btn btn-secondary">
                        <i class="fas fa-refresh"></i> Tải lại
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Override the viewProfile function from app.js
window.viewProfile = function() {
    window.location.href = 'profile.html';
};