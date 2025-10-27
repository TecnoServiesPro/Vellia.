document.addEventListener('DOMContentLoaded', () => {
    const productsData = [
        { id: 1, name: 'عدسة هاتف', price: 3, category: 'electronics', img: 'pro-1.jpg', desc: 'عدسة هاتف', reviews: [{ rating: 5, comment: 'Great!' }, { rating: 4, comment: 'Comfortable.' }] },
        { id: 2, name: 'ضوء قمر', price: 5, category: 'electronics', img: 'pro-1-1.jpg', desc: 'ضوء قمر', reviews: [{ rating: 5, comment: 'Amazing!' }] },
        { id: 3, name: 'سنسال', price: 5, category: 'clothing', img: 'pro-3.jpeg', desc: 'سنسال', reviews: [{ rating: 3, comment: 'Okay quality.' }] },
        { id: 4, name: 'شمع معطر', price: 4, category: 'home', img: 'pro-2.jpeg', desc: 'شمع معطر', reviews: [{ rating: 4, comment: 'Works well.' }] },
         { id: 5, name: 'مبخرة', price: 5, category: 'home', img: 'pro-4.jpeg', desc: 'مبخرة', reviews: [{ rating: 4, comment: 'Works well.' }] },
        // Add more products as needed
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const productsContainer = document.getElementById('products');
    const paginationContainer = document.getElementById('pagination');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistCount = document.getElementById('wishlist-count');
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const modal = document.getElementById('product-modal');
    const modalDetails = document.getElementById('modal-details');
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout');

    let currentPage = 1;
    const itemsPerPage = 4;
    let filteredProducts = [...productsData];

    // Render products
    function renderProducts(products, page = 1) {
        productsContainer.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageProducts = products.slice(start, end);
        
        pageProducts.forEach(product => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
                <img src="${product.img}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                <button class="add-to-wishlist" data-id="${product.id}">Add to Wishlist</button>
            `;
            div.addEventListener('click', () => showProductDetails(product));
            productsContainer.appendChild(div);
        });
        renderPagination(products.length);
    }

    // Pagination
    function renderPagination(totalItems) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderProducts(filteredProducts, currentPage);
            });
            paginationContainer.appendChild(btn);
        }
    }

    // Show product details in modal
    function showProductDetails(product) {
        modalDetails.innerHTML = `
            <img src="${product.img}" alt="${product.name}" style="max-width:100%;">
            <h2>${product.name}</h2>
            <p>${product.desc}</p>
            <p>Price: $${product.price}</p>
            <h3>Reviews</h3>
            ${product.reviews.map(r => `<p class="stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}: ${r.comment}</p>`).join('')}
        `;
        modal.style.display = 'block';
    }

    // Close modals
    document.querySelectorAll('.close').forEach(close => {
        close.addEventListener('click', () => {
            modal.style.display = 'none';
            loginModal.style.display = 'none';
        });
    });

    // Add to cart
    productsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = e.target.dataset.id;
            const product = productsData.find(p => p.id == id);
            const existing = cart.find(item => item.id == id);
            if (existing) existing.quantity++;
            else cart.push({ ...product, quantity: 1 });
            updateCart();
        }
        if (e.target.classList.contains('add-to-wishlist')) {
            const id = e.target.dataset.id;
            const product = productsData.find(p => p.id == id);
            if (!wishlist.find(item => item.id == id)) wishlist.push(product);
            updateWishlist();
        }
    });

    // Update cart
    function updateCart() {
        cartItems.innerHTML = '';
        let total = 0, count = 0;
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.name} - $${item.price} x <input type="number" value="${item.quantity}" min="1" data-id="${item.id}"> <button data-id="${item.id}">Remove</button>`;
            cartItems.appendChild(li);
            total += item.price * item.quantity;
            count += item.quantity;
        });
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = count;
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Update wishlist
    function updateWishlist() {
        wishlistItems.innerHTML = '';
        wishlist.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `${item.name} - $${item.price} <button data-id="${item.id}">Remove</button>`;
            wishlistItems.appendChild(li);
        });
        wishlistCount.textContent = wishlist.length;
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // Cart interactions
    cartItems.addEventListener('change', (e) => {
        if (e.target.type === 'number') {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id == id);
            item.quantity = parseInt(e.target.value);
            updateCart();
        }
    });
    cartItems.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id != id);
            updateCart();
        }
    });
    wishlistItems.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const id = e.target.dataset.id;
            wishlist = wishlist.filter(item => item.id != id);
            updateWishlist();
        }
    });

    // Filters and sort
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        filteredProducts = productsData.filter(p => 
            p.name.toLowerCase().includes(searchTerm) && (category === 'all' || p.category === category)
        );
        if (sortFilter.value === 'name-asc') filteredProducts.sort((a,b) => a.name.localeCompare(b.name));
        else if (sortFilter.value === 'price-asc') filteredProducts.sort((a,b) => a.price - b.price);
        else if (sortFilter.value === 'price-desc') filteredProducts.sort((a,b) => b.price - a.price);
        currentPage = 1;
        renderProducts(filteredProducts, currentPage);
    }

    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);

    // Login modal
    loginBtn.addEventListener('click', () => loginModal.style.display = 'block');
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Logged in (demo)!');
        loginModal.style.display = 'none';
    });

    // Clear cart and checkout
    clearCartBtn.addEventListener('click', () => {
        cart = [];
        updateCart();
    });
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) alert('Cart is empty!');
        else alert(`Checkout total: $${cartTotal.textContent}. (Integrate Stripe for real payments.)`);
    });

    // Initial render
    renderProducts(filteredProducts);
    updateCart();
    updateWishlist();
});
