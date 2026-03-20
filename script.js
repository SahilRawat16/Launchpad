/* ═══════════════════════════════════════════════
   DukaanSetu  ·  script.js
   Shared across all 3 pages
   ═══════════════════════════════════════════════ */

/* ─── DATA ────────────────────────────────────── */

const IMAGES = {
  dairy:      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&q=80&fit=crop",
  vegetables: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80&fit=crop",
  grains:     "https://images.unsplash.com/photo-1536304993881-ff86e0c9e54a?w=600&q=80&fit=crop",
  spices:     "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&q=80&fit=crop",
};

const localProducts = [
  { id: 1, name: "Desi Ghee",         category: "dairy",      price: 480, store: "Sharma Dairy, Sector 7",   tag: "Bestseller" },
  { id: 2, name: "Basmati Rice",       category: "grains",     price: 210, store: "Garg Kirana, Model Town",  tag: "Fresh Stock" },
  { id: 3, name: "Fresh Spinach",      category: "vegetables", price:  30, store: "Raju's Farm, Sector 4",    tag: "Farm Fresh" },
  { id: 4, name: "Whole Milk",         category: "dairy",      price:  60, store: "Verma Dairy, Sector 12",   tag: "Daily Fresh" },
  { id: 5, name: "Kashmiri Chilli",    category: "spices",     price:  90, store: "Devi Spices, Old Bazaar",  tag: "Local Mill" },
  { id: 6, name: "Toor Dal",           category: "grains",     price: 130, store: "Agarwal Kirana, Block B",  tag: "Premium" },
];

const allRecoPool = [
  { id: 101, name: "Organic Honey",    category: "spices",     price: 350, why: "Trending in your area"       },
  { id: 102, name: "Bottle Gourd",     category: "vegetables", price:  25, why: "Today's fresh pick"          },
  { id: 103, name: "Wheat Flour",      category: "grains",     price: 180, why: "Best seller this week"       },
  { id: 104, name: "Lemon Pickle",     category: "spices",     price:  80, why: "Neighbours are loving it"    },
  { id: 105, name: "Buffalo Milk",     category: "dairy",      price:  60, why: "Morning fresh delivery"      },
  { id: 106, name: "Brown Rice",       category: "grains",     price: 190, why: "Popular in your pincode"     },
  { id: 107, name: "Jaggery",          category: "spices",     price: 100, why: "Healthy sugar alternative"   },
  { id: 108, name: "Mustard Oil",      category: "dairy",      price: 220, why: "Cold-pressed, local mill"    },
  { id: 109, name: "Homemade Curd",    category: "dairy",      price:  40, why: "Made fresh every morning"   },
];

let vendorProducts    = [];
let activeFilter      = "all";
let currentRecoIdx    = [0, 1, 2];

/* ─── TOAST ───────────────────────────────────── */
function showToast(msg) {
  const toast   = document.getElementById("toast");
  const toastMsg = document.getElementById("toastMsg");
  if (!toast) return;
  toastMsg.textContent = msg;
  toast.classList.add("show");
  // Re-init icon inside toast
  if (window.lucide) lucide.createIcons();
  setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ─── PRODUCTS PAGE ───────────────────────────── */

function buildProductCard(p, delay = 0) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.animationDelay = `${delay}s`;
  card.innerHTML = `
    <div class="product-card-img-wrap">
      <img class="product-card-img"
        src="${IMAGES[p.category]}"
        alt="${p.name}"
        loading="lazy"
      />
      ${p.tag ? `<span class="product-badge">${p.tag}</span>` : ""}
    </div>
    <div class="product-card-body">
      <p class="product-name">${p.name}</p>
      <p class="product-meta">
        <i data-lucide="map-pin" class="icon-xs"></i>
        ${p.store}
      </p>
      <div class="product-footer">
        <span class="product-price">&#8377;${p.price}</span>
        <button class="order-btn" data-id="${p.id}">
          <i data-lucide="shopping-cart" class="icon-xs"></i>
          Order
        </button>
      </div>
    </div>
  `;
  return card;
}

function renderProducts() {
  const grid    = document.getElementById("productGrid");
  const countEl = document.getElementById("resultCount");
  if (!grid) return;

  const filtered = activeFilter === "all"
    ? localProducts
    : localProducts.filter(p => p.category === activeFilter);

  grid.innerHTML = "";
  filtered.forEach((p, i) => grid.appendChild(buildProductCard(p, i * 0.06)));

  if (countEl) {
    countEl.textContent = activeFilter === "all"
      ? `Showing all ${filtered.length} products`
      : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} in "${activeFilter}"`;
  }

  // Bind order buttons
  grid.querySelectorAll(".order-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const prod = localProducts.find(p => p.id === parseInt(btn.getAttribute("data-id")));
      if (prod) showToast(`Order placed for ${prod.name} — arriving in ~30 min`);
    });
  });

  // Re-render Lucide icons inside new cards
  if (window.lucide) lucide.createIcons();
}

function renderRecommendations() {
  const grid = document.getElementById("recoGrid");
  if (!grid) return;
  grid.innerHTML = "";

  currentRecoIdx.forEach((idx, i) => {
    const item = allRecoPool[idx];
    const card = document.createElement("div");
    card.className = "reco-card";
    card.style.animationDelay = `${i * 0.08}s`;
    card.setAttribute("data-pool-index", idx);
    card.innerHTML = `
      <img class="reco-card-img"
        src="${IMAGES[item.category]}"
        alt="${item.name}"
        loading="lazy"
      />
      <div class="reco-card-body">
        <p class="reco-name">${item.name}</p>
        <p class="reco-why">${item.why}</p>
        <p class="reco-price">&#8377;${item.price}</p>
      </div>
    `;
    card.addEventListener("click", () => handleRecoClick(idx));
    grid.appendChild(card);
  });
}

function handleRecoClick(clickedIdx) {
  document.querySelector(`.reco-card[data-pool-index="${clickedIdx}"]`)?.classList.add("selected");
  setTimeout(() => {
    const available = allRecoPool
      .map((_, i) => i)
      .filter(i => !currentRecoIdx.includes(i));
    available.sort(() => Math.random() - 0.5);
    const kept   = currentRecoIdx.filter(i => i !== clickedIdx);
    const needed = 3 - kept.length;
    currentRecoIdx = [...kept, ...available.slice(0, needed)];
    renderRecommendations();
  }, 280);
}

function initFilters() {
  const filterBar = document.getElementById("filterBar");
  if (!filterBar) return;
  filterBar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.getAttribute("data-filter");
      renderProducts();
    });
  });
}

/* ─── VENDOR PAGE ─────────────────────────────── */

function updateKPIs() {
  const numEl = document.getElementById("kpiProducts");
  const valEl = document.getElementById("kpiValue");
  const cntEl = document.getElementById("productCount");
  if (numEl) numEl.textContent = vendorProducts.length;
  if (cntEl) cntEl.textContent = `${vendorProducts.length} item${vendorProducts.length !== 1 ? "s" : ""}`;
  if (valEl) {
    const total = vendorProducts.reduce((s, p) => s + p.price, 0);
    valEl.textContent = `\u20B9${total.toLocaleString("en-IN")}`;
  }
}

function renderVendorList(filterQuery = "") {
  const list    = document.getElementById("vendorProductList");
  const emptyEl = document.getElementById("vendorEmpty");
  if (!list) return;

  list.innerHTML = "";
  updateKPIs();

  const filtered = vendorProducts.filter(p =>
    p.name.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    if (emptyEl) emptyEl.style.display = "block";
    return;
  }
  if (emptyEl) emptyEl.style.display = "none";

  filtered.forEach((p, i) => {
    // find real index for delete
    const realIndex = vendorProducts.findIndex(vp => vp === p);
    const el = document.createElement("div");
    el.className = "vendor-item";
    el.innerHTML = `
      <img class="vendor-item-img"
        src="${IMAGES[p.category] || IMAGES.grains}"
        alt="${p.name}"
      />
      <div class="vendor-item-info">
        <p class="vendor-item-name">${p.name}</p>
        <p class="vendor-item-meta">
          <i data-lucide="tag" class="icon-xs"></i>
          ${p.category} &nbsp;·&nbsp;
          <i data-lucide="map-pin" class="icon-xs"></i>
          ${p.store}
        </p>
      </div>
      <span class="vendor-item-price">&#8377;${p.price}</span>
      <button class="delete-btn" data-index="${realIndex}">
        <i data-lucide="trash-2" class="icon-xs"></i>
        Remove
      </button>
    `;
    list.appendChild(el);
  });

  list.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx  = parseInt(btn.getAttribute("data-index"));
      const name = vendorProducts[idx]?.name || "product";
      if (confirm(`Remove "${name}" from your listing?`)) {
        vendorProducts.splice(idx, 1);
        renderVendorList(document.getElementById("vendorSearch")?.value || "");
        showToast(`"${name}" removed from your store`);
      }
    });
  });

  if (window.lucide) lucide.createIcons();
}

function initVendorForm() {
  const addBtn  = document.getElementById("addProductBtn");
  const errorEl = document.getElementById("formError");
  if (!addBtn) return;

  function doAdd() {
    const name     = document.getElementById("prodName").value.trim();
    const price    = parseFloat(document.getElementById("prodPrice").value);
    const category = document.getElementById("prodCategory").value;
    const store    = document.getElementById("prodStore").value.trim();
    const stock    = parseInt(document.getElementById("prodStock")?.value) || 0;

    if (!name)          { errorEl.textContent = "Product name is required."; return; }
    if (!price || price <= 0) { errorEl.textContent = "Please enter a valid price."; return; }

    errorEl.textContent = "";

    vendorProducts.push({
      name, price, category,
      store: store || "Your Store",
      stock,
    });

    // Clear form
    ["prodName","prodPrice","prodStore","prodStock"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

    renderVendorList();
    showToast(`"${name}" added to your store`);
  }

  addBtn.addEventListener("click", doAdd);
  document.getElementById("prodStore")?.addEventListener("keydown", e => {
    if (e.key === "Enter") doAdd();
  });

  // Live search
  document.getElementById("vendorSearch")?.addEventListener("input", e => {
    renderVendorList(e.target.value);
  });
}

/* ─── NAVBAR ──────────────────────────────────── */

function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");
  if (!hamburger) return;

  hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks?.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });

  // Scroll shadow
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 10);
  });
}

/* ─── INIT ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Init Lucide icons
  if (window.lucide) lucide.createIcons();

  // Init AOS
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }

  initNavbar();

  // Products page
  if (document.getElementById("productGrid")) {
    renderProducts();
    initFilters();
    renderRecommendations();
  }

  // Vendor page
  if (document.getElementById("vendorProductList")) {
    renderVendorList();
    initVendorForm();
  }
});