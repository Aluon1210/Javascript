// Image Handler for Product Images
// Handles image loading, fallbacks, and error states

class ImageHandler {
    constructor() {
        this.fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNTAgMTAwQzE2NS40NjQgMTAwIDE3Ny41IDEyMi4wOTQgMTc3LjUgMTUwQzE3Ny41IDE3Ny45MDYgMTY1LjQ2NCAyMDAgMTUwIDIwMEMxMzQuNTM2IDIwMCAxMjIuNSAxNzcuOTA2IDEyMi41IDE1MEMxMjIuNSAxMjIuMDk0IDEzNC41MzYgMTAwIDE1MCAxMDBaIiBmaWxsPSIjQ0NDQ0NDIi8+CjxwYXRoIGQ9Ik0xNTAgMTIwQzE1OC4yODQgMTIwIDE2NSAxMzYuNzE2IDE2NSAxNTBDMTY1IDE2My4yODQgMTU4LjI4NCAxNzAgMTUwIDE3MEMxNDEuNzE2IDE3MCAxMzUgMTYzLjI4NCAxMzUgMTUwQzEzNSAxMzYuNzE2IDE0MS43MTYgMTIwIDE1MCAxMjBaIiBmaWxsPSIjOTk5OTk5Ii8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
        this.loadingImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY1Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iMjAiIGZpbGw9IiM2NjdFRUEiPgo8YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiB2YWx1ZXM9IjE7MC41OzEiIGR1cj0iMS41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KPC9jaXJjbGU+Cjx0ZXh0IHg9IjE1MCIgeT0iMjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5OTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPkxvYWRpbmcuLi48L3RleHQ+Cjwvc3ZnPgo=';
    }

    // Create an image element with error handling
    createImageElement(src, alt = 'Product Image', className = '', onLoad = null, onError = null) {
        const img = document.createElement('img');
        img.alt = alt;
        img.className = className;
        img.src = this.loadingImage; // Show loading state first
        
        // Set up error handling
        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            img.src = this.fallbackImage;
            if (onError) onError(img);
        };
        
        // Set up load handling
        img.onload = () => {
            if (onLoad) onLoad(img);
        };
        
        // Load the actual image
        img.src = src;
        
        return img;
    }

    // Get a safe image URL with fallback
    getSafeImageUrl(originalUrl, productName = '') {
        if (!originalUrl || originalUrl === '') {
            return this.fallbackImage;
        }
        
        // If it's already a data URL or local path, use it
        if (originalUrl.startsWith('data:') || originalUrl.startsWith('/') || originalUrl.startsWith('./')) {
            return originalUrl;
        }
        
        // If it's a placeholder URL, create a better one
        if (originalUrl.includes('via.placeholder.com')) {
            const encodedName = encodeURIComponent(productName || 'Product');
            return `https://via.placeholder.com/300x300/667eea/ffffff?text=${encodedName}`;
        }
        
        return originalUrl;
    }

    // Create product image with proper error handling
    createProductImage(product, size = '300x300', className = 'product-image') {
        const safeUrl = this.getSafeImageUrl(product.image, product.name);
        return this.createImageElement(
            safeUrl,
            product.name,
            className,
            (img) => {
                console.log(`Image loaded successfully: ${product.name}`);
            },
            (img) => {
                console.warn(`Image failed to load for product: ${product.name}`);
            }
        );
    }

    // Create cart item image
    createCartImage(item, size = '80x80', className = 'cart-item-image') {
        const safeUrl = this.getSafeImageUrl(item.image, item.productName);
        return this.createImageElement(
            safeUrl,
            item.productName,
            className
        );
    }

    // Create order item image
    createOrderImage(item, size = '60x60', className = 'order-product-image') {
        const safeUrl = this.getSafeImageUrl(item.product?.image, item.product?.name);
        return this.createImageElement(
            safeUrl,
            item.product?.name || 'Product',
            className
        );
    }

    // Preload images for better performance
    preloadImages(imageUrls) {
        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // Generate placeholder image URL
    generatePlaceholder(text, width = 300, height = 300, bgColor = '667eea', textColor = 'ffffff') {
        const encodedText = encodeURIComponent(text);
        return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
    }
}

// Create global instance
window.imageHandler = new ImageHandler();

// Utility functions for backward compatibility
window.createProductImage = (product, size, className) => {
    return window.imageHandler.createProductImage(product, size, className);
};

window.createCartImage = (item, size, className) => {
    return window.imageHandler.createCartImage(item, size, className);
};

window.createOrderImage = (item, size, className) => {
    return window.imageHandler.createOrderImage(item, size, className);
};

window.getSafeImageUrl = (url, name) => {
    return window.imageHandler.getSafeImageUrl(url, name);
};

console.log('Image Handler loaded successfully');