class Cart {
    constructor() {
        this.items = this.loadCartFromStorage();
        this.updateCartDisplay();
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return;
        }

        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartDisplay();
        }
    }

    getTotalCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clear() {
        this.items = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cartCount');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');

        cartCount.textContent = this.getTotalCount();

        cartItems.innerHTML = '';
        
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Корзина пуста</p>';
        } else {
            this.items.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} руб.</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="cart-item-quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        <button class="remove-item" data-id="${item.id}">Удалить</button>
                    </div>
                `;
                cartItems.appendChild(cartItemElement);
            });
        }

        cartTotal.textContent = this.getTotalPrice();
    }
}
