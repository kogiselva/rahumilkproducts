/**
 * Rahu Milk Products - Customer Mobile App Engine
 * Owned by: Kogila Selvaganesh (Phone: 9894039804, Email: kogiselvarahu@gmail.com, Bharathi Nagar, Sivakasi)
 * Real-time event sync, reactive cart, live order tracking & direct WhatsApp communication
 */

// Fallback products with real commercial photographs
const FALLBACK_PRODUCTS = [
  {
    id: "ghee-pure",
    name: "Pure Desi Ghee",
    kannada_name: "ಶುದ್ಧ ತುಪ್ಪ",
    tamil_name: "சுத்தமான நெய்",
    hindi_name: "शुद्ध देसी घी",
    category: "ghee",
    badge: "100% Traditional Bilona",
    rating: 4.9,
    reviewCount: 164,
    description: "Slow-cooked golden aromatic ghee made from pure cultured butter. Danedar (granular) texture with heavenly traditional aroma, rich in natural vitamins A, D, E & K.",
    highlights: ["A2 Pure Dairy", "Zero Preservatives", "Granular Texture", "Hand Churned"],
    image: "/assets/images/ghee.jpg",
    variants: [
      { id: "ghee-500ml", label: "Half Litre (500 ml)", volume: "500 ml", price: 400, originalPrice: 450, discount: "11% OFF" },
      { id: "ghee-1000ml", label: "One Litre (1000 ml)", volume: "1000 ml", price: 800, originalPrice: 900, discount: "₹100 Savings" }
    ],
    defaultVariantIndex: 0
  },
  {
    id: "paneer-malai",
    name: "Malai Paneer",
    kannada_name: "ಮಲೈ ಪನೀರ್",
    tamil_name: "மலாய் பன்னீர்",
    hindi_name: "मलाई पनीर",
    category: "paneer",
    badge: "Super Soft & Creamy",
    rating: 4.9,
    reviewCount: 128,
    description: "Ultra-soft, melt-in-the-mouth cottage cheese crafted from rich whole buffalo milk. High natural fat content, perfect for gravies, Shahi Paneer, and sizzling tikkas.",
    highlights: ["Full Cream Milk", "Melt in Mouth", "No Starch", "Made Fresh Daily"],
    image: "/assets/images/paneer-malai.jpg",
    variants: [
      { id: "paneer-malai-1kg", label: "1 kg Fresh Block", volume: "1 kg", price: 460, originalPrice: 500, discount: "Best Quality" },
      { id: "paneer-malai-500g", label: "500 g Fresh Block", volume: "500 g", price: 230, originalPrice: 250, discount: "Family Pack" }
    ],
    defaultVariantIndex: 0
  },
  {
    id: "paneer-diet",
    name: "Diet Paneer",
    kannada_name: "ಡಯಟ್ ಪನೀರ್",
    tamil_name: "டயட் பன்னீர்",
    hindi_name: "डाइट पनीर",
    category: "paneer",
    badge: "High Protein & Balanced",
    rating: 4.8,
    reviewCount: 94,
    description: "Specially formulated for health-conscious food lovers and fitness goals. Optimum balance of protein and moderate fat to keep you energetic and lean without sacrificing taste.",
    highlights: ["Fitness Friendly", "20g Protein / 100g", "Firm & Fresh", "Low Sodium"],
    image: "/assets/images/paneer-diet.jpg",
    variants: [
      { id: "paneer-diet-1kg", label: "1 kg Fresh Block", volume: "1 kg", price: 460, originalPrice: 490, discount: "Fitness Choice" },
      { id: "paneer-diet-500g", label: "500 g Fresh Block", volume: "500 g", price: 230, originalPrice: 245, discount: "Gym Pack" }
    ],
    defaultVariantIndex: 0
  },
  {
    id: "paneer-nonfat",
    name: "Non-Fat Paneer",
    kannada_name: "ನಾನ್-ಫ್ಯಾಟ್ ಪನೀರ್",
    tamil_name: "கொழுப்பில்லாத பன்னீர்",
    hindi_name: "नॉन-फैट पनीर",
    category: "paneer",
    badge: "Zero Fat • Max Protein",
    rating: 4.7,
    reviewCount: 82,
    description: "Crafted exclusively from pure skimmed dairy milk with zero added fats. High biological value protein (25g+ protein per 100g), the ideal choice for bodybuilding and weight loss diets.",
    highlights: ["0% Saturated Fat", "25g+ Protein", "Pure Skim Milk", "Keto & Weight Loss"],
    image: "/assets/images/paneer-nonfat.jpg",
    variants: [
      { id: "paneer-nonfat-1kg", label: "1 kg Fresh Block", volume: "1 kg", price: 400, originalPrice: 440, discount: "Value Price" },
      { id: "paneer-nonfat-500g", label: "500 g Fresh Block", volume: "500 g", price: 200, originalPrice: 220, discount: "Starter Pack" }
    ],
    defaultVariantIndex: 0
  },
  {
    id: "milk-gova",
    name: "Palgova (Pure Milk Gova / Khoya)",
    kannada_name: "ಹಾಲು ಕೋವ",
    tamil_name: "சுவையான பால்கோவா (தூய மாவா)",
    hindi_name: "शुद्ध खोया / मावा (पालगोवा)",
    category: "gova",
    badge: "Slow Simmered • 100% Pure",
    rating: 4.9,
    reviewCount: 147,
    description: "Authentic traditional South Indian Srivilliputtur & Sivakasi style Palgova / Khoya prepared by slow-simmering whole farm-fresh milk in heavy iron kadhais in Bharathi Nagar. Pure, rich, caramelized texture, perfect for festivals and sweets.",
    highlights: ["Pure Whole Milk", "No Added Starch", "Traditional Kadai Cooked", "Rich Aroma"],
    image: "/assets/images/palgova.jpg",
    variants: [
      { id: "gova-500g", label: "Half kg (500 g)", volume: "500 g", price: 220, originalPrice: 250, discount: "Standard Pack" },
      { id: "gova-1kg", label: "1 kg Pack", volume: "1 kg", price: 440, originalPrice: 490, discount: "Best Value" }
    ],
    defaultVariantIndex: 0
  }
];

const AppState = {
  products: FALLBACK_PRODUCTS,
  cart: {},
  activeCategory: 'all',
  selectedVariants: {},
  activeTab: 'home',
  customerPhone: localStorage.getItem('rahu_customer_phone') || '',
  customerName: localStorage.getItem('rahu_customer_name') || '',
  customerAddress: localStorage.getItem('rahu_customer_address') || '',
  customerLandmark: localStorage.getItem('rahu_customer_landmark') || '',
  selectedSlot: 'Delivery within 1 Day (Factory Direct)',
  selectedPayment: 'COD',
  activeOrder: null,
  chatMessages: [],
  sseSource: null,
  owner: {
    name: 'Kogila Selvaganesh',
    phone: '9894039804',
    whatsapp: '919894039804',
    email: 'kogiselvarahu@gmail.com',
    address: 'Bharathi Nagar, Sivakasi - 626123, Tamil Nadu'
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  loadSavedCart();
  await fetchProducts();
  setupRealtimeSSE();
  renderProducts();
  updateCartUI();
  setupEventListeners();

  const savedOrderId = localStorage.getItem('rahu_last_order_id');
  if (savedOrderId) {
    pollOrFetchOrder(savedOrderId);
  }
});

function loadSavedCart() {
  try {
    const saved = localStorage.getItem('rahu_milk_cart');
    if (saved) {
      AppState.cart = JSON.parse(saved);
    }
  } catch (e) {
    AppState.cart = {};
  }
}

function saveCart() {
  localStorage.setItem('rahu_milk_cart', JSON.stringify(AppState.cart));
}

// Fetch Products from API with fallback
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      AppState.products = await res.json();
    }
  } catch (err) {
    console.warn('Using local fallback products');
    AppState.products = FALLBACK_PRODUCTS;
  }
  AppState.products.forEach(p => {
    AppState.selectedVariants[p.id] = p.defaultVariantIndex || 0;
  });
}

// Setup Real-Time Server-Sent Events (SSE)
function setupRealtimeSSE() {
  if (AppState.sseSource) {
    AppState.sseSource.close();
  }

  try {
    const sse = new EventSource('/api/events');
    AppState.sseSource = sse;

    sse.addEventListener('connected', (e) => {
      console.log('⚡ Connected to Rahu Milk Real-Time Hub (Sivakasi)');
    });

    sse.addEventListener('order_status_updated', (e) => {
      const updatedOrder = JSON.parse(e.data);
      if (AppState.activeOrder && AppState.activeOrder.id === updatedOrder.id) {
        AppState.activeOrder = updatedOrder;
        renderActiveOrderTracker();
        window.soundFX?.playStatusUpdate();
        showToast(`Order Status Updated: ${formatStatusName(updatedOrder.status)}! 🚀`);
      }
    });

    sse.addEventListener('new_message', (e) => {
      const msg = JSON.parse(e.data);
      AppState.chatMessages.push(msg);
      renderChatMessages();

      if (msg.sender === 'admin') {
        window.soundFX?.playMessagePing();
        showToast(`Kogila Selvaganesh: ${msg.text.substring(0, 40)}...`);
        updateChatBadge(1);
      }
    });

    sse.addEventListener('product_updated', (e) => {
      const updatedProd = JSON.parse(e.data);
      const idx = AppState.products.findIndex(p => p.id === updatedProd.id);
      if (idx !== -1) {
        AppState.products[idx] = updatedProd;
        renderProducts();
      }
    });
  } catch (e) {
    console.warn('Real-time SSE not active');
  }
}

// Render Products Grid
function renderProducts() {
  const container = document.getElementById('products-container');
  if (!container) return;

  const filtered = AppState.activeCategory === 'all' 
    ? AppState.products 
    : AppState.products.filter(p => p.category === AppState.activeCategory);

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px 20px; color: #888;">No dairy items in this category.</div>`;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const currentVariantIdx = AppState.selectedVariants[product.id] || 0;
    const currentVariant = product.variants[currentVariantIdx] || product.variants[0];
    const cartItem = AppState.cart[currentVariant.id];
    const qty = cartItem ? cartItem.quantity : 0;

    return `
      <div class="product-card" id="card-${product.id}">
        <div class="product-media-container">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            class="product-img"
            loading="lazy"
            onerror="this.src='/assets/images/${product.category === 'ghee' ? 'ghee.svg' : product.category === 'gova' ? 'milk-gova.svg' : 'paneer-malai.svg'}';"
          />

          <div class="product-badge-overlay">
            ✨ ${product.badge}
          </div>

          <div class="product-rating">
            ⭐ ${product.rating || 4.9} <span style="opacity: 0.7;">(${product.reviewCount || 100})</span>
          </div>
        </div>

        <div class="product-body">
          <div class="product-title-row">
            <div>
              <h3 class="product-name">${product.name}</h3>
              <div class="product-regional">${product.tamil_name ? `${product.tamil_name} • ` : ''}${product.hindi_name || ''}</div>
            </div>
          </div>

          <p class="product-desc">${product.description}</p>

          <div class="product-highlights">
            ${(product.highlights || []).map(h => `<span class="highlight-chip">✓ ${h}</span>`).join('')}
          </div>

          <div class="variant-selector-label">Choose Size / Variant:</div>
          <div class="variant-options">
            ${product.variants.map((v, idx) => `
              <div 
                class="variant-pill ${idx === currentVariantIdx ? 'selected' : ''}"
                onclick="selectProductVariant('${product.id}', ${idx})"
              >
                <div class="variant-pill-top">
                  <span>${v.label}</span>
                  ${v.discount ? `<span class="variant-discount-tag">${v.discount}</span>` : ''}
                </div>
                <div>
                  <span class="variant-pill-price">₹${v.price}</span>
                  ${v.originalPrice ? `<span class="variant-pill-original">₹${v.originalPrice}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="card-footer">
            <div class="footer-price-block">
              <span class="footer-price-sub">${currentVariant.label}</span>
              <span class="footer-price-main">₹${currentVariant.price}</span>
            </div>

            <div id="action-btn-${product.id}">
              ${qty > 0 ? `
                <div class="qty-stepper">
                  <button class="stepper-btn" onclick="updateItemQuantity('${currentVariant.id}', ${qty - 1})">−</button>
                  <span class="stepper-val">${qty}</span>
                  <button class="stepper-btn" onclick="updateItemQuantity('${currentVariant.id}', ${qty + 1})">+</button>
                </div>
              ` : `
                <button class="add-btn" onclick="addToCart('${product.id}', ${currentVariantIdx})">
                  <span>+</span> Add to Bag
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectProductVariant(productId, variantIndex) {
  AppState.selectedVariants[productId] = variantIndex;
  renderProducts();
}

function addToCart(productId, variantIndex) {
  const product = AppState.products.find(p => p.id === productId);
  if (!product) return;

  const variant = product.variants[variantIndex];
  if (!variant) return;

  if (!AppState.cart[variant.id]) {
    AppState.cart[variant.id] = {
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        image: product.image
      },
      variant: variant,
      quantity: 1
    };
  } else {
    AppState.cart[variant.id].quantity += 1;
  }

  saveCart();
  updateCartUI();
  renderProducts();
  window.soundFX?.playPop();
  showToast(`Added ${product.name} (${variant.label}) to bag! 🧈`);
}

function updateItemQuantity(variantId, newQty) {
  if (newQty <= 0) {
    delete AppState.cart[variantId];
  } else if (AppState.cart[variantId]) {
    AppState.cart[variantId].quantity = newQty;
  }

  saveCart();
  updateCartUI();
  renderProducts();
  renderCartSheet();
  window.soundFX?.playPop();
}

function getCartTotals() {
  let count = 0;
  let subtotal = 0;

  Object.values(AppState.cart).forEach(item => {
    count += item.quantity;
    subtotal += (item.variant.price * item.quantity);
  });

  const deliveryFee = subtotal > 500 || count === 0 ? 0 : 30;
  const grandTotal = subtotal + deliveryFee;

  return { count, subtotal, deliveryFee, grandTotal };
}

function updateCartUI() {
  const { count, subtotal, grandTotal } = getCartTotals();
  const floatingBar = document.getElementById('floating-cart-bar');
  const cartBadge = document.getElementById('nav-cart-badge');
  const cartSummaryCount = document.getElementById('cart-items-summary');
  const cartSummaryTotal = document.getElementById('cart-total-summary');

  if (cartBadge) {
    cartBadge.textContent = count;
    cartBadge.style.display = count > 0 ? 'flex' : 'none';
  }

  if (floatingBar) {
    if (count > 0 && AppState.activeTab === 'home') {
      floatingBar.classList.add('visible');
      if (cartSummaryCount) cartSummaryCount.textContent = `${count} ${count === 1 ? 'item' : 'items'} in Bag`;
      if (cartSummaryTotal) cartSummaryTotal.textContent = `₹${grandTotal}`;
    } else {
      floatingBar.classList.remove('visible');
    }
  }
}

function openCartSheet() {
  renderCartSheet();
  const modal = document.getElementById('cart-modal');
  if (modal) modal.classList.add('active');
}

function closeCartSheet() {
  const modal = document.getElementById('cart-modal');
  if (modal) modal.classList.remove('active');
}

function openStoreInfoModal() {
  const modal = document.getElementById('store-info-modal');
  if (modal) modal.classList.add('active');
}

function closeStoreInfoModal() {
  const modal = document.getElementById('store-info-modal');
  if (modal) modal.classList.remove('active');
}

function renderCartSheet() {
  const container = document.getElementById('cart-sheet-body');
  const footerContainer = document.getElementById('cart-sheet-footer');
  if (!container) return;

  const items = Object.values(AppState.cart);
  const { count, subtotal, deliveryFee, grandTotal } = getCartTotals();

  if (items.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 10px;">
        <div style="font-size: 48px; margin-bottom: 12px;">🥛</div>
        <h3 style="font-size: 16px; font-weight: 800; color: #292524;">Your Bag is Empty</h3>
        <p style="font-size: 12px; color: #78716C; margin-top: 4px;">Explore our pure desi ghee, fresh paneer, and milk gova crafted fresh in Sivakasi!</p>
      </div>
    `;
    if (footerContainer) footerContainer.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="cart-items-list">
      ${items.map(item => `
        <div class="cart-item-row">
          <div>
            <div class="cart-item-name">${item.product.name}</div>
            <div class="cart-item-sub">${item.variant.label} • ₹${item.variant.price}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="qty-stepper" style="transform: scale(0.85);">
              <button class="stepper-btn" onclick="updateItemQuantity('${item.variant.id}', ${item.quantity - 1})">−</button>
              <span class="stepper-val">${item.quantity}</span>
              <button class="stepper-btn" onclick="updateItemQuantity('${item.variant.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="cart-item-price">₹${item.variant.price * item.quantity}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Factory Product Dispatch Guarantee (No timing slots) -->
    <div style="background: #F0FDF4; border: 1.5px solid #86EFAC; border-radius: 14px; padding: 12px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
      <span style="font-size: 28px;">🏭</span>
      <div>
        <div style="font-size: 13px; font-weight: 800; color: #166534;">Factory Direct Product</div>
        <div style="font-size: 11px; color: #15803D; margin-top: 2px;">
          Order 24 Hours Anytime • Fresh factory batch delivered within 1 Day.
        </div>
      </div>
    </div>

    <div class="form-section-title">📍 Delivery Details</div>
    <div class="form-input-group">
      <label class="form-label">Customer Name *</label>
      <input type="text" id="cust-name" class="form-input" placeholder="e.g. Karthik Raja" value="${AppState.customerName}" />
    </div>

    <div class="form-input-group">
      <label class="form-label">Phone Number *</label>
      <input type="tel" id="cust-phone" class="form-input" placeholder="e.g. 98765 43210" value="${AppState.customerPhone}" />
    </div>

    <div class="form-input-group">
      <label class="form-label">Delivery Address in Sivakasi *</label>
      <input type="text" id="cust-address" class="form-input" placeholder="Door No, Street Name, Sivakasi" value="${AppState.customerAddress}" />
    </div>

    <div class="form-input-group">
      <label class="form-label">Landmark / Notes to Kogila Selvaganesh</label>
      <input type="text" id="cust-landmark" class="form-input" placeholder="Near Temple / Ring Bell" value="${AppState.customerLandmark}" />
    </div>

    <div class="form-section-title">💳 Payment Method</div>
    <div class="payment-grid">
      <div 
        class="payment-option ${AppState.selectedPayment === 'COD' ? 'selected' : ''}"
        onclick="setPaymentMode('COD')"
      >
        <span>💵</span>
        <div>
          <div class="payment-title">Cash on Delivery</div>
          <div class="payment-sub">Pay after receiving</div>
        </div>
      </div>
      <div 
        class="payment-option ${AppState.selectedPayment === 'UPI' ? 'selected' : ''}"
        onclick="setPaymentMode('UPI')"
      >
        <span>⚡</span>
        <div>
          <div class="payment-title">UPI / GPay / PhonePe</div>
          <div class="payment-sub">Scan QR on delivery</div>
        </div>
      </div>
    </div>

    <div class="bill-summary">
      <div class="bill-row">
        <span>Subtotal</span>
        <span>₹${subtotal}</span>
      </div>
      <div class="bill-row">
        <span>Delivery Fee</span>
        <span>${deliveryFee === 0 ? '<span style="color:#059669; font-weight:700;">FREE (Orders above ₹500)</span>' : '₹' + deliveryFee}</span>
      </div>
      <div class="bill-row total">
        <span>To Pay</span>
        <span class="price-val">₹${grandTotal}</span>
      </div>
    </div>
  `;

  if (footerContainer) {
    footerContainer.innerHTML = `
      <button class="checkout-btn" onclick="submitOrder()">
        <span>✓</span> Confirm & Place Order • ₹${grandTotal}
      </button>
      <button class="whatsapp-direct-btn" onclick="orderViaWhatsApp()">
        <span>💬</span> Order via WhatsApp to Kogila Selvaganesh
      </button>
    `;
  }
}

function setDeliverySlot(slot) {
  AppState.selectedSlot = slot;
  renderCartSheet();
}

function setPaymentMode(mode) {
  AppState.selectedPayment = mode;
  renderCartSheet();
}

// Submit Order
async function submitOrder() {
  const nameInput = document.getElementById('cust-name');
  const phoneInput = document.getElementById('cust-phone');
  const addressInput = document.getElementById('cust-address');
  const landmarkInput = document.getElementById('cust-landmark');

  const name = nameInput ? nameInput.value.trim() : AppState.customerName;
  const phone = phoneInput ? phoneInput.value.trim() : AppState.customerPhone;
  const address = addressInput ? addressInput.value.trim() : AppState.customerAddress;
  const landmark = landmarkInput ? landmarkInput.value.trim() : AppState.customerLandmark;

  if (!name || !phone) {
    showToast('⚠️ Please provide your Name and Phone Number');
    return;
  }

  AppState.customerName = name;
  AppState.customerPhone = phone;
  AppState.customerAddress = address;
  AppState.customerLandmark = landmark;
  localStorage.setItem('rahu_customer_name', name);
  localStorage.setItem('rahu_customer_phone', phone);
  localStorage.setItem('rahu_customer_address', address);
  localStorage.setItem('rahu_customer_landmark', landmark);

  const items = Object.values(AppState.cart).map(i => ({
    productId: i.product.id,
    productName: i.product.name,
    variantId: i.variant.id,
    variantLabel: i.variant.label,
    price: i.variant.price,
    quantity: i.quantity,
    subtotal: i.variant.price * i.quantity
  }));

  const { grandTotal } = getCartTotals();

  const orderPayload = {
    customer: { name, phone, address, landmark },
    deliverySlot: AppState.selectedSlot,
    paymentMethod: AppState.selectedPayment,
    customerNote: landmark,
    items,
    totalAmount: grandTotal
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (data.success && data.order) {
      completeOrderPlacement(data.order);
      return;
    }
  } catch (err) {
    console.warn('Server offline, saving order locally & prompting WhatsApp...');
  }

  // Local fallback order
  const localOrder = {
    id: 'RAHU-' + Math.floor(1000 + Math.random() * 9000),
    createdAt: new Date().toISOString(),
    customer: { name, phone, address, landmark },
    deliverySlot: AppState.selectedSlot,
    paymentMethod: AppState.selectedPayment,
    customerNote: landmark,
    items,
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    totalAmount: grandTotal,
    status: 'placed'
  };
  completeOrderPlacement(localOrder);
}

function completeOrderPlacement(order) {
  AppState.activeOrder = order;
  localStorage.setItem('rahu_last_order_id', order.id);

  AppState.cart = {};
  saveCart();
  updateCartUI();
  closeCartSheet();

  window.soundFX?.playOrderSuccess();
  switchTab('tracking');
  renderActiveOrderTracker();

  showToast(`🎉 Order #${order.id} confirmed!`);
}

function orderViaWhatsApp() {
  const { count, grandTotal } = getCartTotals();
  const name = document.getElementById('cust-name')?.value || AppState.customerName || 'Customer';
  const phone = document.getElementById('cust-phone')?.value || AppState.customerPhone || '';
  const address = document.getElementById('cust-address')?.value || AppState.customerAddress || 'Bharathi Nagar, Sivakasi';

  const itemsSummary = Object.values(AppState.cart).map(i => 
    `• ${i.product.name} (${i.variant.label}) x ${i.quantity} = ₹${i.variant.price * i.quantity}`
  ).join('%0A');

  const text = `*New Factory Order - Rahu Milk Products*%0A*To:* Kogila Selvaganesh, Bharathi Nagar, Sivakasi%0A%0A*Customer:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Address:* ${encodeURIComponent(address)}%0A*Delivery:* Within 1 Day (Factory Fresh Dispatch)%0A*Payment:* ${AppState.selectedPayment}%0A%0A*Items:*%0A${itemsSummary}%0A%0A*Total Amount:* ₹${grandTotal}%0A%0APlease confirm factory dispatch! 🥛`;
  
  window.open(`https://wa.me/${AppState.owner.whatsapp}?text=${text}`, '_blank');
}

function renderActiveOrderTracker() {
  const container = document.getElementById('tracking-content');
  if (!container) return;

  if (!AppState.activeOrder) {
    container.innerHTML = `
      <div style="text-align: center; padding: 50px 20px;">
        <div style="font-size: 54px; margin-bottom: 12px;">📦</div>
        <h3 style="font-size: 16px; font-weight: 800; color: #292524;">No Active Orders</h3>
        <p style="font-size: 12px; color: #78716C; margin-top: 4px;">Orders placed with Rahu Milk Products will appear here with live progress.</p>
        <button class="add-btn" style="margin: 20px auto 0;" onclick="switchTab('home')">Browse Products</button>
      </div>
    `;
    return;
  }

  const order = AppState.activeOrder;
  const statusLevels = { 'placed': 1, 'confirmed': 2, 'preparing': 3, 'out_for_delivery': 4, 'delivered': 5 };
  const currentLevel = statusLevels[order.status] || 1;
  const progressPercent = ((currentLevel - 1) / 4) * 100;

  container.innerHTML = `
    <div class="order-tracking-card">
      <div class="tracking-header">
        <div>
          <div class="tracking-id">Order #${order.id}</div>
          <div style="font-size: 11px; color: #78716C;">Placed on ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div class="live-pill">
          <div class="live-beacon"></div>
          ${formatStatusName(order.status)}
        </div>
      </div>

      <div class="tracking-stepper">
        <div class="stepper-line">
          <div class="stepper-progress" style="width: ${progressPercent}%;"></div>
        </div>

        <div class="step-node ${currentLevel >= 1 ? (currentLevel > 1 ? 'completed' : 'active') : ''}">
          <div class="step-circle">${currentLevel > 1 ? '✓' : '1'}</div>
          <span class="step-label">Placed</span>
        </div>

        <div class="step-node ${currentLevel >= 2 ? (currentLevel > 2 ? 'completed' : 'active') : ''}">
          <div class="step-circle">${currentLevel > 2 ? '✓' : '2'}</div>
          <span class="step-label">Accepted</span>
        </div>

        <div class="step-node ${currentLevel >= 3 ? (currentLevel > 3 ? 'completed' : 'active') : ''}">
          <div class="step-circle">${currentLevel > 3 ? '✓' : '3'}</div>
          <span class="step-label">Packing</span>
        </div>

        <div class="step-node ${currentLevel >= 4 ? (currentLevel > 4 ? 'completed' : 'active') : ''}">
          <div class="step-circle">${currentLevel > 4 ? '✓' : '4'}</div>
          <span class="step-label">Out</span>
        </div>

        <div class="step-node ${currentLevel >= 5 ? 'completed' : ''}">
          <div class="step-circle">${currentLevel >= 5 ? '✓' : '5'}</div>
          <span class="step-label">Delivered</span>
        </div>
      </div>

      <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 12px; padding: 12px; margin-top: 18px; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 24px;">🛵</span>
        <div>
          <div style="font-size: 12px; font-weight: 800; color: #92400E;">
            ${order.status === 'delivered' ? 'Order Successfully Delivered!' : 'Delivery in Progress (Sivakasi)'}
          </div>
          <div style="font-size: 11px; color: #B45309;">
            🏭 Delivery within 1 Day (Factory Direct) • Mode: ${order.paymentMethod}
          </div>
        </div>
      </div>

      <div style="margin-top: 16px;">
        <div style="font-size: 12px; font-weight: 800; color: #1C1917; margin-bottom: 8px;">Items Ordered (${order.itemCount})</div>
        <div class="cart-items-list" style="margin-bottom: 8px;">
          ${order.items.map(i => `
            <div class="cart-item-row" style="padding: 8px 12px;">
              <div>
                <span style="font-weight: 700; font-size: 12px;">${i.productName}</span>
                <span style="font-size: 11px; color: #78716C;">(${i.variantLabel}) x ${i.quantity}</span>
              </div>
              <div style="font-weight: 800; font-size: 12px; color: #B45309;">₹${i.subtotal}</div>
            </div>
          `).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: 900; font-size: 14px; padding-top: 6px;">
          <span>Total:</span>
          <span style="color: #D97706;">₹${order.totalAmount}</span>
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 18px;">
        <button class="checkout-btn" style="padding: 10px; flex: 1;" onclick="switchTab('chat')">
          💬 Message Store
        </button>
        <a 
          href="https://wa.me/${AppState.owner.whatsapp}?text=${encodeURIComponent(`Hello Kogila Selvaganesh, inquiry regarding order #${order.id}.`)}"
          target="_blank"
          class="whatsapp-direct-btn"
          style="padding: 10px 14px; text-decoration: none;"
        >
          WhatsApp
        </a>
      </div>
    </div>
  `;
}

async function pollOrFetchOrder(orderId) {
  try {
    const res = await fetch(`/api/orders/${orderId}`);
    if (res.ok) {
      AppState.activeOrder = await res.json();
      if (AppState.activeTab === 'tracking') {
        renderActiveOrderTracker();
      }
    }
  } catch (err) {}
}

async function fetchChatMessages() {
  try {
    const res = await fetch('/api/messages');
    if (res.ok) {
      AppState.chatMessages = await res.json();
      renderChatMessages();
    }
  } catch (err) {}
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages-box');
  if (!container) return;

  container.innerHTML = AppState.chatMessages.map(m => `
    <div class="chat-bubble ${m.sender === 'customer' ? 'customer' : 'admin'}">
      <div>${m.text}</div>
      <div class="chat-meta">
        <span>${m.sender === 'customer' ? 'You' : 'Kogila Selvaganesh (Owner)'}</span>
        <span>${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById('chat-text-input');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  const payload = {
    orderId: AppState.activeOrder ? AppState.activeOrder.id : null,
    customerName: AppState.customerName || 'Customer',
    customerPhone: AppState.customerPhone || '',
    sender: 'customer',
    text
  };

  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    window.soundFX?.playPop();
  } catch (err) {
    // Append locally
    AppState.chatMessages.push({
      ...payload,
      id: 'LOCAL-' + Date.now(),
      timestamp: new Date().toISOString()
    });
    renderChatMessages();
    window.soundFX?.playPop();
  }
}

function switchTab(tabId) {
  AppState.activeTab = tabId;

  document.querySelectorAll('.tab-view').forEach(view => {
    view.style.display = 'none';
  });
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
  });

  const targetView = document.getElementById(`view-${tabId}`);
  const targetNav = document.getElementById(`nav-${tabId}`);

  if (targetView) targetView.style.display = 'block';
  if (targetNav) targetNav.classList.add('active');

  if (tabId === 'tracking') {
    renderActiveOrderTracker();
  } else if (tabId === 'chat') {
    fetchChatMessages();
    updateChatBadge(0);
  }

  updateCartUI();
}

function updateChatBadge(count) {
  const badge = document.getElementById('nav-chat-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notice');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function formatStatusName(status) {
  const map = {
    'placed': 'Order Placed',
    'confirmed': 'Accepted by Dairy',
    'preparing': 'Freshly Packing',
    'out_for_delivery': 'Out for Delivery 🛵',
    'delivered': 'Delivered ✓',
    'cancelled': 'Cancelled'
  };
  return map[status] || status;
}

function setCategory(cat) {
  AppState.activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === cat);
  });
  renderProducts();
}

function setupEventListeners() {
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category);
    });
  });

  const chatInput = document.getElementById('chat-text-input');
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  const deviceToggleBtn = document.getElementById('device-toggle-btn');
  if (deviceToggleBtn) {
    deviceToggleBtn.addEventListener('click', () => {
      document.querySelector('.app-container')?.classList.toggle('fullscreen-mode');
    });
  }
}
