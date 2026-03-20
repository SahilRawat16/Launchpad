/**
 * E-Enable Professional Logic
 * Vanilla JS logic for Hyperlocal Marketplace & Vendor Portal
 */

const products = [
    { id: 1, name: "Premium Fresh Mangoes (1kg)", price: 180, icon: "🥭", category: "Grocery" },
    { id: 2, name: "Aashirvaad Shudh Chakki Atta (5kg)", price: 345, icon: "🌾", category: "Grocery" },
    { id: 3, name: "Dabur Pure Honey (500g)", price: 220, icon: "🍯", category: "Wellness" },
    { id: 4, name: "Handmade Saffron Soap (Pack of 3)", price: 350, icon: "🧼", category: "Skincare" },
    { id: 5, name: "Organic Darjeeling Tea Bags", price: 410, icon: "🍵", category: "Wellness" },
    { id: 6, name: "Fresh Baguette (Artesian)", price: 85, icon: "🍞", category: "Bakery" }
];

let vendorProducts = [];

/* DOM Element Selectors */
const productGrid = document.getElementById('product-grid');
const recommendationGrid = document.getElementById('recommendation-grid');
const addProductForm = document.getElementById('add-product-form');
const vendorProductList = document.getElementById('vendor-product-list');

/* Initial Lifecycle */
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    renderMainGrid();
    renderRecs();
    setupEventListeners();
}

/**
 * Creates a generic professional product card
 * @param {Object} item Product data
 * @returns {HTMLElement} Card element
 */
function createCardElement(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div class="product-img">${item.icon || '🛍️'}</div>
        <h5>${item.name}</h5>
        <span class="price">₹${item.price.toLocaleString()}</span>
        <button class="btn-primary" style="width: 100%; border: none; font-size: 0.85rem;" onclick="processOrder('${item.name}')">Place Order</button>
    `;

    // Interaction for smart recommendations
    card.addEventListener('click', (e) => {
        if (!e.target.matches('button')) {
            shuffleRecs(item.id);
        }
    });

    return card;
}

/* Logic: Order Processing */
function processOrder(name) {
    // Professional alert message
    alert(`Confirmation: Your order for "${name}" has been placed at a verified store near you.`);
}

/* Logic: Main Product Grid */
function renderMainGrid() {
    if (!productGrid) return;
    productGrid.innerHTML = '';
    products.forEach(p => productGrid.appendChild(createCardElement(p)));
}

/* Logic: Vendor Operations */
function setupEventListeners() {
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
}

function handleAddProduct(e) {
    e.preventDefault();
    const nameEl = document.getElementById('p-name');
    const priceEl = document.getElementById('p-price');

    const newEntry = {
        id: Date.now(),
        name: nameEl.value,
        price: parseFloat(priceEl.value),
        icon: "📦"
    };

    vendorProducts.push(newEntry);
    updateInventoryUI();
    
    // Clear & Feedback
    nameEl.value = '';
    priceEl.value = '';
    
    // Smooth reset experience
    nameEl.focus();
}

function updateInventoryUI() {
    if (!vendorProductList) return;
    
    if (vendorProducts.length === 0) {
        vendorProductList.innerHTML = '<li class="empty-msg">No inventory items listed yet.</li>';
        return;
    }

    vendorProductList.innerHTML = '';
    vendorProducts.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div style="flex: 1;">
                <span style="font-weight: 500; font-size: 0.95rem;">${item.name}</span>
                <p style="color: var(--text-muted); font-size: 0.8rem;">₹${item.price.toLocaleString()}</p>
            </div>
            <button class="btn-delete" onclick="removeItem(${item.id})">Remove</button>
        `;
        vendorProductList.appendChild(li);
    });
}

function removeItem(id) {
    vendorProducts = vendorProducts.filter(p => p.id !== id);
    updateInventoryUI();
}

/* Logic: Smart Recommendations */
function renderRecs() {
    if (!recommendationGrid) return;
    recommendationGrid.innerHTML = '';
    // Show top 3 by default
    products.slice(0, 3).forEach(p => recommendationGrid.appendChild(createCardElement(p)));
}

function shuffleRecs(currentId) {
    // Filter out current and get 3 random
    const pool = products.filter(p => p.id !== currentId);
    const selection = pool.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Subtle Fade effect
    recommendationGrid.style.opacity = '0.3';
    setTimeout(() => {
        recommendationGrid.innerHTML = '';
        selection.forEach(p => recommendationGrid.appendChild(createCardElement(p)));
        recommendationGrid.style.opacity = '1';
    }, 200);
}
