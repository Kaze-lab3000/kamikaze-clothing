// Main JavaScript for KAMIKAZE website

class KAMIKAZEWebsite {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.loadCart();
    }

    init() {
        // Initialize cart if not exists
        if (!localStorage.getItem('kamikazeCart')) {
            localStorage.setItem('kamikazeCart', JSON.stringify([]));
        }
        
        // Update cart count
        this.updateCartCount();
    }

    setupEventListeners() {
        // Mobile menu toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Quick view modal
        this.setupQuickView();
        
        // Newsletter form
        this.setupNewsletter();
        
        // Smooth scroll for anchor links
        this.setupSmoothScroll();
    }

    setupQuickView() {
        const quickViewButtons = document.querySelectorAll('.quick-view');
        const modal = document.getElementById('quickViewModal');
        const closeModal = document.querySelector('.close-modal');

        quickViewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.dataset.product;
                this.showQuickView(productId);
            });
        });

        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    showQuickView(productId) {
        const modal = document.getElementById('quickViewModal');
        const modalBody = document.querySelector('.modal-body');
        
        // In a real implementation, this would fetch product data
        const productData = this.getProductData(productId);
        
        modalBody.innerHTML = `
            <div class="product-modal">
                <div class="product-modal-images">
                    <img src="${productData.image}" alt="${productData.name}" class="modal-product-img">
                </div>
                <div class="product-modal-info">
                    <h2>${productData.name}</h2>
                    <p class="modal-price">$${productData.price}</p>
                    <p class="modal-description">${productData.description}</p>
                    <div class="size-selector">
                        <label>Size:</label>
                        <select class="size-select">
                            ${productData.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                        </select>
                    </div>
                    <button class="add-to-cart-modal" data-product="${productId}">ADD TO CART</button>
                </div>
            </div>
        `;

        // Add event listener to modal add to cart button
        const addToCartBtn = modalBody.querySelector('.add-to-cart-modal');
        addToCartBtn.addEventListener('click', () => {
            this.addToCart(productId);
            modal.style.display = 'none';
        });

        modal.style.display = 'block';
    }

    getProductData(productId) {
        // Mock product data - in real implementation, this would come from an API
        const products = {
            '1': {
                name: 'Typhoon Hoodie',
                price: 158,
                image: 'assets/images/hoodie-black.jpg',
                description: 'Premium heavyweight hoodie with embroidered KAMIKAZE kanji. Made from Japanese cotton blend. Features storm-inspired detailing.',
                sizes: ['S', 'M', 'L', 'XL']
            },
            '2': {
                name: 'Wind God Tee',
                price: 78,
                image: 'assets/images/tee-black.jpg',
                description: 'Oversized tee with minimalist KAMIKAZE branding. 100% organic cotton with divine wind graphic.',
                sizes: ['S', 'M', 'L', 'XL']
            }
        };
        
        return products[productId] || products['1'];
    }

    setupNewsletter() {
        const newsletterForm = document.querySelector('.newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = newsletterForm.querySelector('.newsletter-input').value;
                this.subscribeNewsletter(email);
            });
        }
    }

    subscribeNewsletter(email) {
        // In real implementation, this would send to a backend
        console.log('Subscribing email:', email);
        alert('Thank you for joining the KAMIKAZE storm. Welcome to the divine wind.');
        
        // Reset form
        const newsletterForm = document.querySelector('.newsletter-form');
        newsletterForm.reset();
    }

    setupSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    addToCart(productId, quantity = 1) {
        const cart = JSON.parse(localStorage.getItem('kamikazeCart'));
        const product = this.getProductData(productId);
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        localStorage.setItem('kamikazeCart', JSON.stringify(cart));
        this.updateCartCount();
        
        // Show add to cart animation
        this.showAddToCartAnimation();
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('kamikazeCart'));
        const cartCount = document.querySelector('.cart-count');
        
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    loadCart() {
        // Cart functionality for cart.html
        if (window.location.pathname.includes('cart.html')) {
            this.displayCartItems();
        }
    }

    displayCartItems() {
        const cartContainer = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.cart-total');
        const cartSubtotal = document.querySelector('.cart-subtotal');
        
        if (!cartContainer) return;
        
        const cart = JSON.parse(localStorage.getItem('kamikazeCart'));
        
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
            if (cartTotal) cartTotal.textContent = '$0';
            if (cartSubtotal) cartSubtotal.textContent = '$0';
            return;
        }
        
        let total = 0;
        cartContainer.innerHTML = cart.map(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    <div class="cart-item-total">$${itemTotal}</div>
                    <button class="remove-item" data-id="${item.id}">&times;</button>
                </div>
            `;
        }).join('');
        
        if (cartTotal) {
            cartTotal.textContent = `$${total}`;
        }
        if (cartSubtotal) {
            cartSubtotal.textContent = `$${total}`;
        }
        
        // Add event listeners for quantity buttons and remove buttons
        this.setupCartInteractions();
    }

    setupCartInteractions() {
        const quantityBtns = document.querySelectorAll('.quantity-btn');
        const removeBtns = document.querySelectorAll('.remove-item');
        
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                const action = e.target.dataset.action;
                this.updateCartQuantity(productId, action);
            });
        });
        
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.dataset.id;
                this.removeFromCart(productId);
            });
        });
    }

    updateCartQuantity(productId, action) {
        const cart = JSON.parse(localStorage.getItem('kamikazeCart'));
        const item = cart.find(item => item.id === productId);
        
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease' && item.quantity > 1) {
            item.quantity -= 1;
        }
        
        localStorage.setItem('kamikazeCart', JSON.stringify(cart));
        this.displayCartItems();
        this.updateCartCount();
    }

    removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('kamikazeCart'));
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('kamikazeCart', JSON.stringify(cart));
        this.displayCartItems();
        this.updateCartCount();
    }

    showAddToCartAnimation() {
        // Create and show add to cart animation
        const animation = document.createElement('div');
        animation.className = 'add-to-cart-animation';
        animation.textContent = 'Added to cart';
        animation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--deep-red);
            color: var(--off-white);
            padding: 1rem 2rem;
            border-radius: 2px;
            z-index: 3000;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.remove();
        }, 2000);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KAMIKAZEWebsite();
});
