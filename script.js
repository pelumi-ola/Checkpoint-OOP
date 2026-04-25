/* ══════════════════════════════════════════
   OOP SHOPPING CART — Object-Oriented JS
══════════════════════════════════════════ */

/* ── 1. Product class ── */
class Product {
  constructor(id, name, price, emoji) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.emoji = emoji; // extra for UI
  }
}

/* ── 2. ShoppingCartItem class ── */
class ShoppingCartItem {
  constructor(product, quantity = 1) {
    this.product = product;
    this.quantity = quantity;
  }

  /* ── 3. Calculate total price of this line item ── */
  getTotalPrice() {
    return this.product.price * this.quantity;
  }
}

/* ── 4. ShoppingCart class ── */
class ShoppingCart {
  constructor() {
    this.items = []; // array of ShoppingCartItem instances
  }

  /* ── 5a. Get total number of unique items ── */
  getTotalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /* ── 5b. Get grand total price ── */
  getGrandTotal() {
    return this.items.reduce((sum, item) => sum + item.getTotalPrice(), 0);
  }

  /* ── 5c. Add item (or increment qty if already present) ── */
  addItem(product, quantity = 1) {
    const existing = this.items.find((i) => i.product.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      clog(`Qty updated → ${product.name} ×${existing.quantity}`, "info");
    } else {
      this.items.push(new ShoppingCartItem(product, quantity));
      clog(`Added to cart → ${product.name}`, "success");
    }
  }

  /* ── 5d. Remove one unit (or remove item when qty hits 0) ── */
  removeItem(productId, qty = 1) {
    const index = this.items.findIndex((i) => i.product.id === productId);
    if (index === -1) {
      clog(`Item not found (id: ${productId})`, "error");
      return;
    }
    const item = this.items[index];
    item.quantity -= qty;
    if (item.quantity <= 0) {
      this.items.splice(index, 1);
      clog(`Removed → ${item.product.name}`, "warn");
    } else {
      clog(`Qty reduced → ${item.product.name} ×${item.quantity}`, "info");
    }
  }

  /* ── 5e. Clear cart ── */
  clearCart() {
    this.items = [];
    clog("Cart cleared", "warn");
  }

  /* ── 5f. Display cart items to console log ── */
  displayCart() {
    if (this.items.length === 0) {
      clog("Cart is empty.", "warn");
      return;
    }
    clog("── Cart Contents ──────────────────────", "info");
    this.items.forEach((item) => {
      clog(
        `  ${item.product.emoji} ${item.product.name.padEnd(20)} ×${item.quantity}  $${item.getTotalPrice().toFixed(2)}`,
        "info",
      );
    });
    clog(`  ${"Total items:".padEnd(24)} ${this.getTotalItems()}`, "success");
    clog(
      `  ${"Grand total:".padEnd(24)} $${this.getGrandTotal().toFixed(2)}`,
      "success",
    );
    clog("───────────────────────────────────────", "info");
  }
}

/* ══════════════════════════════════════════
   INITIALISATION — Test all requirements
══════════════════════════════════════════ */

/* ── 6a. Create products ── */
const catalogue = [
  new Product("p1", "Wireless Headphones", 89.99, "🎧"),
  new Product("p2", "Mechanical Keyboard", 64.95, "⌨️"),
  new Product("p3", "USB-C Hub", 35.0, "🔌"),
  new Product("p4", "Webcam HD", 49.5, "📷"),
  new Product("p5", "LED Desk Lamp", 27.99, "💡"),
  new Product("p6", "Mouse Pad XL", 18.0, "🖱️"),
];

/* ── 6b. Create a shopping cart ── */
const cart = new ShoppingCart();

clog("OOP Shopping Cart initialised ✓", "success");
clog("Products loaded: " + catalogue.length, "info");

/* ── 6c-e. Demo: add items and display (runs once on load) ── */
setTimeout(() => {
  cart.addItem(catalogue[0]); // headphones ×1
  cart.addItem(catalogue[1]); // keyboard ×1
  cart.addItem(catalogue[0]); // headphones → ×2
  cart.addItem(catalogue[2], 2); // USB-C hub ×2
  cart.displayCart();
  renderAll();
}, 200);

/* ══════════════════════════════════════════
   UI RENDERING
══════════════════════════════════════════ */

function renderProducts() {
  const grid = document.getElementById("products-grid");
  grid.innerHTML = catalogue
    .map(
      (p) => `
    <div class="product-card">
      <div class="product-icon">${p.emoji}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-price">$${p.price.toFixed(2)}</div>
      <div class="product-id">ID: ${p.id}</div>
      <button class="btn-add" onclick="addToCart('${p.id}')">+ Add to cart</button>
    </div>
  `,
    )
    .join("");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("total-items");
  const grandEl = document.getElementById("grand-total");
  const badge = document.getElementById("badge-count");
  const checkout = document.getElementById("checkout-btn");

  badge.textContent = cart.getTotalItems();
  totalEl.textContent = cart.getTotalItems();
  grandEl.textContent = "$" + cart.getGrandTotal().toFixed(2);
  checkout.disabled = cart.items.length === 0;

  if (cart.items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🛍️</span>
        <p>Your cart is empty.<br>Add something!</p>
      </div>`;
    return;
  }

  container.innerHTML = cart.items
    .map(
      (item) => `
    <div class="cart-item">
      <span class="item-emoji">${item.product.emoji}</span>
      <div class="item-info">
        <div class="item-name">${item.product.name}</div>
        <div class="item-sub">$${item.product.price.toFixed(2)} each</div>
      </div>
      <div class="item-qty">
        <button class="qty-btn minus" onclick="decreaseQty('${item.product.id}')">−</button>
        <span class="qty-num">${item.quantity}</span>
        <button class="qty-btn" onclick="increaseQty('${item.product.id}')">+</button>
      </div>
      <span class="item-total">$${item.getTotalPrice().toFixed(2)}</span>
      <button class="btn-remove" title="Remove" onclick="removeFromCart('${item.product.id}')">✕</button>
    </div>
  `,
    )
    .join("");
}

function renderAll() {
  renderProducts();
  renderCart();
}

/* ══════════════════════════════════════════
   UI EVENT HANDLERS
══════════════════════════════════════════ */

function addToCart(productId) {
  const product = catalogue.find((p) => p.id === productId);
  if (product) {
    cart.addItem(product);
    renderCart();
  }
}

function removeFromCart(productId) {
  const item = cart.items.find((i) => i.product.id === productId);
  if (item) cart.removeItem(productId, item.quantity);
  renderCart();
}

function increaseQty(productId) {
  const product = catalogue.find((p) => p.id === productId);
  if (product) {
    cart.addItem(product, 1);
    renderCart();
  }
}

function decreaseQty(productId) {
  cart.removeItem(productId, 1);
  renderCart();
}

function clearCart() {
  cart.clearCart();
  renderCart();
}

function checkout() {
  cart.displayCart();
  clog("Proceeding to checkout…", "success");
  alert(
    `Order placed! Total: $${cart.getGrandTotal().toFixed(2)} (${cart.getTotalItems()} items)`,
  );
}

/* ══════════════════════════════════════════
   CONSOLE LOG UTILITY
══════════════════════════════════════════ */

function clog(msg, type = "info") {
  const box = document.getElementById("console-log");
  if (!box) return;
  const now = new Date().toLocaleTimeString("en-GB", { hour12: false });
  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `<span class="log-time">[${now}]</span><span class="log-msg ${type}">${msg}</span>`;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
  console.log(`[${type.toUpperCase()}] ${msg}`);
}

/* Kick off the product grid render immediately */
renderProducts();
