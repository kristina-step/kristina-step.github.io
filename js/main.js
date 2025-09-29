document.addEventListener('DOMContentLoaded', function() {
    const cart = new Cart();
    initializeProducts();
    initializeEventListeners(cart);
});

function initializeProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">${product.price} руб.</div>
            <button class="add-to-cart" data-id="${product.id}">
                Добавить в корзину
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

function initializeEventListeners(cart) {
    const cartButton = document.getElementById('cartButton');
    const closeCart = document.getElementById('closeCart');
    const cartSidebar = document.getElementById('cartSidebar');
    const checkoutButton = document.getElementById('checkoutButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
    const orderForm = document.getElementById('orderForm');
    const successMessage = document.getElementById('successMessage');

    cartButton.addEventListener('click', () => {
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.addItem(product);
                cartSidebar.classList.add('active');
            }
        }
    });

    document.addEventListener('click', (e) => {
        const cartItems = document.getElementById('cartItems');
        
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const item = cart.items.find(item => item.id === productId);
            
            if (item) {
                let newQuantity = item.quantity;
                
                if (e.target.classList.contains('plus')) {
                    newQuantity += 1;
                } else if (e.target.classList.contains('minus')) {
                    newQuantity -= 1;
                }
                
                cart.updateQuantity(productId, newQuantity);
            }
        }
        
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            cart.removeItem(productId);
        }
    });

    checkoutButton.addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        cartSidebar.classList.remove('active');
        modalOverlay.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        modalOverlay.classList.remove('active');
    });

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(orderForm);
        const firstName = formData.get('firstName');
        const lastName = formData.get('lastName');
        const address = formData.get('address');
        const phone = formData.get('phone');
        
        if (!firstName || !lastName || !address || !phone) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }
        
        modalOverlay.classList.remove('active');
        successMessage.classList.add('active');
        
        setTimeout(() => {
            cart.clear();
            orderForm.reset();
            successMessage.classList.remove('active');
        }, 3000);
    });

    document.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartButton.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
}
