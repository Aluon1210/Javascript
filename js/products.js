// Products page specific functionality
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('products.html')) {
        initializeProductsPage();
    }
});

async function initializeProductsPage() {
    // Wait for database to load
    while (!database) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    loadCategoryFilter();
    loadProductsFromURL();
}

function loadCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter || !database) return;
    
    // Add all categories to filter
    database.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

function loadProductsFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const searchQuery = urlParams.get('search');
    
    if (categoryId) {
        loadProductsByCategory(parseInt(categoryId));
        updatePageTitle(`Danh mục: ${getCategoryName(parseInt(categoryId))}`);
        document.getElementById('categoryFilter').value = categoryId;
    } else if (searchQuery) {
        loadProductsBySearch(searchQuery);
        updatePageTitle(`Kết quả tìm kiếm: "${searchQuery}"`);
        document.getElementById('searchInput').value = searchQuery;
    } else {
        loadAllProducts();
        updatePageTitle('Tất cả sản phẩm');
    }
}

function loadAllProducts() {
    allProducts = [...database.products];
    filteredProducts = [...allProducts];
    displayProducts();
}

function loadProductsByCategory(categoryId) {
    allProducts = database.products.filter(p => p.cate_id === categoryId);
    filteredProducts = [...allProducts];
    displayProducts();
}

function loadProductsBySearch(query) {
    const searchTerm = query.toLowerCase();
    allProducts = database.products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.detail.toLowerCase().includes(searchTerm)
    );
    filteredProducts = [...allProducts];
    displayProducts();
}

function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    
    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (categoryFilter && product.cate_id !== parseInt(categoryFilter)) {
            return false;
        }
        
        // Price filter
        const variant = database.product_variants.find(v => v.product_id === product.id);
        if (variant) {
            const price = variant.price;
            if (price < minPrice || price > maxPrice) {
                return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1;
    displayProducts();
}

function sortProducts() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredProducts.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'price':
                const priceA = getProductPrice(a.id);
                const priceB = getProductPrice(b.id);
                return priceA - priceB;
            case 'price-desc':
                const priceA2 = getProductPrice(a.id);
                const priceB2 = getProductPrice(b.id);
                return priceB2 - priceA2;
            default:
                return 0;
        }
    });
    
    displayProducts();
}

function clearFilters() {
    document.getElementById('categoryFilter').value = '';
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortBy').value = 'name';
    
    filteredProducts = [...allProducts];
    currentPage = 1;
    displayProducts();
}

function displayProducts() {
    const productsContainer = document.getElementById('productsContainer');
    const productsCount = document.getElementById('productsCount');
    const noProducts = document.getElementById('noProducts');
    
    if (!productsContainer) return;
    
    // Update products count
    if (productsCount) {
        productsCount.textContent = filteredProducts.length;
    }
    
    // Show/hide no products message
    if (filteredProducts.length === 0) {
        productsContainer.style.display = 'none';
        noProducts.classList.remove('hidden');
        return;
    } else {
        productsContainer.style.display = 'grid';
        noProducts.classList.add('hidden');
    }
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Display products
    productsContainer.innerHTML = productsToShow.map(product => {
        const variant = database.product_variants.find(v => v.product_id === product.id);
        const price = variant ? formatPrice(variant.price) : 'Liên hệ';
        const stock = variant ? variant.quantity : 0;
        
        return `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onclick="viewProductDetail(${product.id})">
                    ${stock === 0 ? '<div class="out-of-stock">Hết hàng</div>' : ''}
                </div>
                <div class="product-info">
                    <h3 onclick="viewProductDetail(${product.id})">${product.name}</h3>
                    <p>${product.detail.substring(0, 100)}...</p>
                    <div class="product-price">${price}</div>
                    <div class="product-stock">Còn lại: ${stock} sản phẩm</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-cart-plus"></i> ${stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Display pagination
    displayPagination(totalPages);
}

function displayPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination || totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})" class="pagination-btn">
            <i class="fas fa-chevron-left"></i> Trước
        </button>`;
    }
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)" class="pagination-btn">1</button>`;
        if (startPage > 2) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<button onclick="changePage(${i})" class="pagination-btn ${i === currentPage ? 'active' : ''}">${i}</button>`;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<span class="pagination-dots">...</span>`;
        }
        paginationHTML += `<button onclick="changePage(${totalPages})" class="pagination-btn">${totalPages}</button>`;
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})" class="pagination-btn">
            Sau <i class="fas fa-chevron-right"></i>
        </button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

function changePage(page) {
    currentPage = page;
    displayProducts();
    
    // Scroll to top of products section
    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
}

function viewProductDetail(productId) {
    // For now, just show an alert with product details
    // In a real application, this would navigate to a product detail page
    const product = database.products.find(p => p.id === productId);
    const variants = database.product_variants.filter(v => v.product_id === productId);
    
    if (!product) return;
    
    let variantInfo = variants.map(v => `${v.variant_name}: ${formatPrice(v.price)} (Còn ${v.quantity})`).join('\n');
    
    alert(`Tên sản phẩm: ${product.name}\n\nMô tả: ${product.detail}\n\nCác phiên bản:\n${variantInfo}`);
}

function updatePageTitle(title) {
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = title;
    }
    document.title = `${title} - Susan Shop`;
}

function getCategoryName(categoryId) {
    const category = database.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Không xác định';
}

function getProductPrice(productId) {
    const variant = database.product_variants.find(v => v.product_id === productId);
    return variant ? variant.price : 0;
}

// Override search function for products page
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query) {
        loadProductsBySearch(query);
        updatePageTitle(`Kết quả tìm kiếm: "${query}"`);
        
        // Update URL without page reload
        const newUrl = `${window.location.pathname}?search=${encodeURIComponent(query)}`;
        window.history.pushState({}, '', newUrl);
    } else {
        loadAllProducts();
        updatePageTitle('Tất cả sản phẩm');
        
        // Clear URL parameters
        window.history.pushState({}, '', window.location.pathname);
    }
}