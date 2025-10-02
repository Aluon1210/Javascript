// Database utility functions for persistence
console.log('Database utils loaded');

// Export database to downloadable JSON file
function exportDatabase() {
    if (!database) {
        showNotification('Không có database để export!', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(database, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `susan-shop-database-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Database đã được export!', 'success');
}

// Import database from file
function importDatabase(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate structure
            if (!importedData.users || !importedData.products || !importedData.categories) {
                throw new Error('Invalid database structure');
            }
            
            // Update database
            database = importedData;
            window.database = database;
            
            // Save to localStorage
            localStorage.setItem('database', JSON.stringify(database));
            localStorage.setItem('users_backup', JSON.stringify(database.users));
            
            showNotification('Database đã được import thành công!', 'success');
            
            // Refresh current page
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (error) {
            showNotification('Lỗi import database: ' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

// Backup current database state
function backupDatabase() {
    if (!database) {
        showNotification('Không có database để backup!', 'error');
        return;
    }
    
    // Save to multiple localStorage keys for redundancy
    const timestamp = new Date().toISOString();
    
    localStorage.setItem('database', JSON.stringify(database));
    localStorage.setItem('database_backup', JSON.stringify(database));
    localStorage.setItem('users_backup', JSON.stringify(database.users));
    localStorage.setItem('last_backup', timestamp);
    
    console.log('Database backed up at:', timestamp);
    showNotification('Database đã được backup!', 'success');
}

// Restore database from backup
function restoreDatabase() {
    const backupDb = localStorage.getItem('database_backup');
    const usersBackup = localStorage.getItem('users_backup');
    
    if (backupDb) {
        try {
            database = JSON.parse(backupDb);
            window.database = database;
            localStorage.setItem('database', JSON.stringify(database));
            
            showNotification('Database đã được restore từ backup!', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
            
        } catch (e) {
            console.error('Error restoring from backup:', e);
            showNotification('Lỗi restore database!', 'error');
        }
    } else if (usersBackup) {
        // Try to restore just users
        try {
            const users = JSON.parse(usersBackup);
            if (database && database.users) {
                database.users = users;
                localStorage.setItem('database', JSON.stringify(database));
                showNotification('Users đã được restore từ backup!', 'success');
            }
        } catch (e) {
            console.error('Error restoring users:', e);
        }
    } else {
        showNotification('Không tìm thấy backup!', 'error');
    }
}

// Clear all database data
function clearAllData() {
    if (confirm('Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác!')) {
        localStorage.removeItem('database');
        localStorage.removeItem('database_backup');
        localStorage.removeItem('users_backup');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('cart');
        localStorage.removeItem('last_backup');
        
        showNotification('Tất cả dữ liệu đã được xóa!', 'warning');
        
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    }
}

// Get database statistics
function getDatabaseStats() {
    if (!database) return null;
    
    return {
        users: database.users?.length || 0,
        products: database.products?.length || 0,
        categories: database.categories?.length || 0,
        orders: database.orders?.length || 0,
        order_details: database.order_details?.length || 0,
        product_variants: database.product_variants?.length || 0,
        lastBackup: localStorage.getItem('last_backup'),
        localStorageSize: JSON.stringify(database).length
    };
}

// Sync database across tabs
function syncDatabase() {
    // Listen for storage changes from other tabs
    window.addEventListener('storage', function(e) {
        if (e.key === 'database' && e.newValue) {
            try {
                const newDatabase = JSON.parse(e.newValue);
                database = newDatabase;
                window.database = database;
                console.log('Database synced from another tab');
                
                // Refresh current page content if needed
                if (typeof loadHomePage === 'function' && window.location.pathname.includes('index.html')) {
                    loadHomePage();
                }
            } catch (error) {
                console.error('Error syncing database:', error);
            }
        }
        
        if (e.key === 'currentUser' && e.newValue) {
            try {
                const newUser = JSON.parse(e.newValue);
                currentUser = newUser;
                window.currentUser = currentUser;
                console.log('User synced from another tab');
                
                // Update UI
                if (typeof updateUserInterface === 'function') {
                    updateUserInterface();
                }
            } catch (error) {
                console.error('Error syncing user:', error);
            }
        }
    });
}

// Initialize database utils
document.addEventListener('DOMContentLoaded', function() {
    // Auto-backup every 5 minutes
    setInterval(backupDatabase, 5 * 60 * 1000);
    
    // Setup cross-tab sync
    syncDatabase();
    
    console.log('Database utils initialized');
});

// Make functions globally available
window.exportDatabase = exportDatabase;
window.importDatabase = importDatabase;
window.backupDatabase = backupDatabase;
window.restoreDatabase = restoreDatabase;
window.clearAllData = clearAllData;
window.getDatabaseStats = getDatabaseStats;