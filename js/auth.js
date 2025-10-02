// Authentication JavaScript
console.log('Auth.js loaded');

// Wait for DOM and database to be ready
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Auth page DOM loaded');
    
    // Wait for database to load
    while (!database) {
        console.log('Waiting for database...');
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('Database ready, setting up auth forms');
    setupAuthForms();
});

function setupAuthForms() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Setting up login form');
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log('Setting up register form');
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Social login buttons (demo only)
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Tính năng đăng nhập mạng xã hội đang được phát triển!', 'info');
        });
    });
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    console.log('Login attempt:', { email, remember });
    
    // Validation
    if (!email || !password) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ!', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Find user in database
        console.log('Searching in database users:', database.users);
        const user = database.users.find(u => u.email === email && u.password === password);
        console.log('User found:', user);
        
        if (user) {
            // Login successful
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            if (remember) {
                localStorage.setItem('rememberLogin', 'true');
            }
            
            // Update global database reference
            window.database = database;
            window.currentUser = currentUser;
            
            showAuthNotification('Đăng nhập thành công!', 'success');
            
            // Redirect based on role
            setTimeout(() => {
                if (user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 1500);
            
        } else {
            showAuthNotification('Email hoặc mật khẩu không đúng!', 'error');
            console.log('Available users:', database.users.map(u => ({ email: u.email, role: u.role })));
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    console.log('Register form submitted');
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const newsletter = document.getElementById('newsletter')?.checked || false;
    
    console.log('Register data:', { firstName, lastName, email, phone, agreeTerms });
    
    // Validation
    if (!firstName || !lastName || !email || !phone || !address || !password || !confirmPassword) {
        showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Email không hợp lệ!', 'error');
        return;
    }
    
    if (!isValidPhone(phone)) {
        showNotification('Số điện thoại không hợp lệ!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Mật khẩu phải có ít nhất 6 ký tự!', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Mật khẩu xác nhận không khớp!', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Bạn phải đồng ý với điều khoản sử dụng!', 'error');
        return;
    }
    
    // Show loading
    showLoading(true);
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Check if email already exists
        const existingUser = database.users.find(u => u.email === email);
        if (existingUser) {
            showAuthNotification('Email đã được sử dụng!', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Math.max(...database.users.map(u => u.id), 0) + 1,
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            address: address,
            password: password,
            role: 'user',
            created_at: new Date().toISOString(),
            newsletter: newsletter
        };
        
        // Add to database
        database.users.push(newUser);
        console.log('User added to database array');
        
        // Update global database reference
        window.database = database;
        
        // Save to localStorage with multiple methods for reliability
        try {
            localStorage.setItem('database', JSON.stringify(database));
            console.log('Database saved to localStorage successfully');
            
            // Also save just the users array as backup
            localStorage.setItem('users_backup', JSON.stringify(database.users));
            console.log('Users backup saved to localStorage');
            
            // Verify the save worked
            const verifyDb = localStorage.getItem('database');
            if (verifyDb) {
                const parsedDb = JSON.parse(verifyDb);
                const userExists = parsedDb.users.find(u => u.email === newUser.email);
                if (userExists) {
                    console.log('✅ Verification successful: New user found in saved database');
                } else {
                    console.error('❌ Verification failed: New user NOT found in saved database');
                }
            }
            
        } catch (saveError) {
            console.error('Error saving to localStorage:', saveError);
            showAuthNotification('Lỗi lưu dữ liệu! Vui lòng thử lại.', 'error');
            return;
        }
        
        console.log('New user created:', newUser);
        console.log('Updated database users count:', database.users.length);
        console.log('All users in database:', database.users.map(u => ({ id: u.id, name: u.name, email: u.email })));
        
        showAuthNotification('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        
    } catch (error) {
        console.error('Register error:', error);
        showNotification('Có lỗi xảy ra, vui lòng thử lại!', 'error');
    } finally {
        showLoading(false);
    }
}

// Demo account functions
function fillDemo(type) {
    if (type === 'admin') {
        document.getElementById('email').value = 'admin@susanshop.com';
        document.getElementById('password').value = 'admin123';
    } else if (type === 'user') {
        document.getElementById('email').value = 'user@test.com';
        document.getElementById('password').value = 'user123';
    }
    
    showNotification('Đã điền thông tin demo!', 'info');
}

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }
}

// Enhanced notification function for auth pages
function showAuthNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.auth-notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    
    const iconMap = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${iconMap[type] || 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" class="close-btn">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .close-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
            opacity: 0.7;
            transition: opacity 0.3s;
        }
        .close-btn:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Use the auth notification function for auth pages
window.showNotification = showAuthNotification;

// Check if user is already logged in
function checkAuthRedirect() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'index.html';
        }
    }
}

// Run auth redirect check on auth pages
if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
    // Don't redirect immediately, let user choose
    console.log('On auth page, not redirecting automatically');
}