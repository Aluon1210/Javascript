// Enhanced User Menu functionality
class UserMenu {
    constructor() {
        this.dropdown = null;
        this.isOpen = false;
        this.closeHandlers = [];
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen || !currentUser) return;

        // Close any existing dropdown
        this.close();

        // Create dropdown element
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'user-dropdown';
        this.dropdown.innerHTML = this.getDropdownHTML();
        
        // Apply styles
        this.applyStyles();
        
        // Position dropdown
        const userProfile = document.getElementById('userProfile');
        if (!userProfile) return;
        
        userProfile.style.position = 'relative';
        userProfile.appendChild(this.dropdown);
        
        // Setup event listeners
        this.setupEventListeners();
        
        this.isOpen = true;
        
        // Add CSS animation
        requestAnimationFrame(() => {
            this.dropdown.style.opacity = '1';
            this.dropdown.style.transform = 'translateY(0)';
        });
    }

    close() {
        if (!this.isOpen || !this.dropdown) return;

        // Remove event listeners
        this.removeEventListeners();
        
        // Animate out
        this.dropdown.style.opacity = '0';
        this.dropdown.style.transform = 'translateY(-10px)';
        
        // Remove element after animation
        setTimeout(() => {
            if (this.dropdown && this.dropdown.parentNode) {
                this.dropdown.parentNode.removeChild(this.dropdown);
            }
            this.dropdown = null;
            this.isOpen = false;
        }, 200);
    }

    getDropdownHTML() {
        return `
            <div class="user-dropdown-content">
                <div class="user-info">
                    <i class="fas fa-user-circle"></i>
                    <div>
                        <strong>${currentUser.name}</strong>
                        <small>${currentUser.email}</small>
                    </div>
                </div>
                <hr>
                <a href="#" data-action="profile">
                    <i class="fas fa-user"></i> Thông tin cá nhân
                </a>
                <a href="#" data-action="orders">
                    <i class="fas fa-shopping-bag"></i> Đơn hàng của tôi
                </a>
                ${currentUser.role === 'admin' ? '<a href="admin.html"><i class="fas fa-cog"></i> Quản trị</a>' : ''}
                <hr>
                <a href="#" data-action="logout" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i> Đăng xuất
                </a>
            </div>
        `;
    }

    applyStyles() {
        if (!this.dropdown) return;

        this.dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 1000;
            min-width: 250px;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.2s ease;
        `;

        // Add CSS if not exists
        if (!document.getElementById('user-dropdown-styles')) {
            const style = document.createElement('style');
            style.id = 'user-dropdown-styles';
            style.textContent = `
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
                    cursor: pointer;
                    border-radius: 5px;
                }
                .user-dropdown a:hover {
                    color: #667eea;
                    background: rgba(102, 126, 234, 0.1);
                    padding-left: 0.5rem;
                }
                .user-dropdown .logout-btn:hover {
                    color: #dc3545;
                    background: rgba(220, 53, 69, 0.1);
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupEventListeners() {
        if (!this.dropdown) return;

        // Prevent dropdown from closing when clicking inside
        const clickInsideHandler = (e) => {
            e.stopPropagation();
        };
        this.dropdown.addEventListener('click', clickInsideHandler);
        this.closeHandlers.push(() => {
            this.dropdown.removeEventListener('click', clickInsideHandler);
        });

        // Handle menu item clicks
        const menuClickHandler = (e) => {
            const action = e.target.closest('a')?.dataset.action;
            if (action) {
                e.preventDefault();
                this.handleAction(action);
            }
        };
        this.dropdown.addEventListener('click', menuClickHandler);
        this.closeHandlers.push(() => {
            this.dropdown.removeEventListener('click', menuClickHandler);
        });

        // Close on outside click
        const outsideClickHandler = (e) => {
            const userProfile = document.getElementById('userProfile');
            if (userProfile && !userProfile.contains(e.target)) {
                this.close();
            }
        };
        
        // Delay to prevent immediate closing
        setTimeout(() => {
            document.addEventListener('click', outsideClickHandler);
            document.addEventListener('touchstart', outsideClickHandler);
            this.closeHandlers.push(() => {
                document.removeEventListener('click', outsideClickHandler);
                document.removeEventListener('touchstart', outsideClickHandler);
            });
        }, 150);

        // Close on ESC key
        const escKeyHandler = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
        document.addEventListener('keydown', escKeyHandler);
        this.closeHandlers.push(() => {
            document.removeEventListener('keydown', escKeyHandler);
        });
    }

    removeEventListeners() {
        this.closeHandlers.forEach(handler => handler());
        this.closeHandlers = [];
    }

    handleAction(action) {
        switch (action) {
            case 'profile':
                this.close();
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 100);
                break;
            case 'orders':
                this.close();
                setTimeout(() => {
                    window.location.href = 'profile.html#orders';
                }, 100);
                break;
            case 'logout':
                this.close();
                setTimeout(() => {
                    if (typeof logout === 'function') {
                        logout();
                    }
                }, 100);
                break;
        }
    }
}

// Create global instance
const userMenu = new UserMenu();

// Override the global showUserMenu function
window.showUserMenu = function() {
    userMenu.toggle();
};