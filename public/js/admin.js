/**
 * Rahu Milk Products - Admin Command Dashboard
 * Owner: Kogila Selvaganesh (Phone: 9894039804, Email: kogiselvarahu@gmail.com, Bharathi Nagar, Sivakasi)
 * Real-time order dispatch, audio alerts, analytics, customer messaging & secure owner authentication
 */

// Accepted Owner Security PINs & Passwords
const OWNER_CREDENTIALS = ['9804', 'rahu2026', '9894039804', 'admin9804'];

// Default Fallback Products if Server is connecting
const FALLBACK_PRODUCTS = [
  {
    id: "ghee-pure",
    name: "Pure Desi Ghee",
    tamil_name: "சுத்தமான நெய்",
    category: "ghee",
    badge: "100% Traditional Bilona",
    image: "/assets/images/ghee.jpg",
    inStock: true,
    variants: [
      { id: "ghee-500ml", label: "Half Litre (500 ml)", price: 400 },
      { id: "ghee-1000ml", label: "One Litre (1000 ml)", price: 800 }
    ]
  },
  {
    id: "paneer-malai",
    name: "Malai Paneer",
    tamil_name: "மலாய் பன்னீர்",
    category: "paneer",
    badge: "Super Soft & Creamy",
    image: "/assets/images/paneer-malai.jpg",
    inStock: true,
    variants: [
      { id: "paneer-malai-1kg", label: "1 kg Fresh Block", price: 460 },
      { id: "paneer-malai-500g", label: "500 g Fresh Block", price: 230 }
    ]
  },
  {
    id: "paneer-diet",
    name: "Diet Paneer",
    tamil_name: "டயட் பன்னீர்",
    category: "paneer",
    badge: "High Protein & Balanced",
    image: "/assets/images/paneer-diet.jpg",
    inStock: true,
    variants: [
      { id: "paneer-diet-1kg", label: "1 kg Fresh Block", price: 460 },
      { id: "paneer-diet-500g", label: "500 g Fresh Block", price: 230 }
    ]
  },
  {
    id: "paneer-nonfat",
    name: "Non-Fat Paneer",
    tamil_name: "கொழுப்பில்லாத பன்னீர்",
    category: "paneer",
    badge: "Zero Fat • Max Protein",
    image: "/assets/images/paneer-nonfat.jpg",
    inStock: true,
    variants: [
      { id: "paneer-nonfat-1kg", label: "1 kg Fresh Block", price: 400 },
      { id: "paneer-nonfat-500g", label: "500 g Fresh Block", price: 200 }
    ]
  },
  {
    id: "milk-gova",
    name: "Palgova (Pure Milk Gova / Khoya)",
    tamil_name: "சுவையான பால்கோவா",
    category: "gova",
    badge: "Slow Simmered • 100% Pure",
    image: "/assets/images/palgova.jpg",
    inStock: true,
    variants: [
      { id: "gova-500g", label: "Half kg (500 g)", price: 220 },
      { id: "gova-1kg", label: "1 kg Pack", price: 440 }
    ]
  }
];

// Default Fallback Orders
const FALLBACK_ORDERS = [
  {
    id: "RAHU-1001",
    createdAt: new Date().toISOString(),
    customer: {
      name: "Karthik Raja",
      phone: "+91 94431 23456",
      address: "Chairman A. Shanmugam Road, Sivakasi",
      landmark: "Near Sivakasi New Bus Stand"
    },
    deliverySlot: "Morning Slot (6:00 AM - 8:00 AM)",
    items: [
      { productName: "Pure Desi Ghee", variantLabel: "One Litre (1000 ml)", quantity: 1, price: 800 },
      { productName: "Malai Paneer", variantLabel: "1 kg Fresh Block", quantity: 1, price: 460 }
    ],
    itemCount: 2,
    totalAmount: 1260,
    paymentMethod: "COD",
    paymentStatus: "Pending on Delivery",
    customerNote: "Please deliver morning batch fresh paneer.",
    status: "confirmed"
  },
  {
    id: "RAHU-1002",
    createdAt: new Date().toISOString(),
    customer: {
      name: "Meenakshi Sundaram",
      phone: "+91 97890 54321",
      address: "Plot 12, Kamaraj Nagar, Sivakasi",
      landmark: "Opposite Lions School"
    },
    deliverySlot: "Instant Express (Within 60 Mins)",
    items: [
      { productName: "Palgova (Pure Milk Gova / Khoya)", variantLabel: "1 kg Pack", quantity: 2, price: 440 },
      { productName: "Diet Paneer", variantLabel: "1 kg Fresh Block", quantity: 1, price: 460 }
    ],
    itemCount: 3,
    totalAmount: 1340,
    paymentMethod: "UPI",
    paymentStatus: "Paid Online",
    customerNote: "Need fresh milk gova for festival sweets.",
    status: "out_for_delivery"
  }
];

const AdminState = {
  orders: [],
  products: [],
  messages: [],
  stats: {},
  activeFilter: 'all',
  selectedChatCustomer: null,
  audioAlertsEnabled: true,
  sseSource: null,
  token: localStorage.getItem('rahu_owner_token') || '',
  owner: {
    name: 'Kogila Selvaganesh',
    phone: '9894039804',
    email: 'kogiselvarahu@gmail.com',
    location: 'Bharathi Nagar, Sivakasi'
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  setupAudioToggle();
  checkOwnerAuth();
});

// Check Owner Authentication
function checkOwnerAuth() {
  const overlay = document.getElementById('owner-login-overlay');
  const dashboard = document.getElementById('admin-dashboard-container');

  if (AdminState.token) {
    if (overlay) overlay.style.display = 'none';
    if (dashboard) dashboard.style.display = 'flex';
    initializeAuthenticatedAdmin();
  } else {
    if (overlay) overlay.style.display = 'flex';
    if (dashboard) dashboard.style.display = 'none';
  }
}

// Handle Owner PIN / Password Submission
async function handleOwnerLogin(e) {
  if (e) e.preventDefault();

  const pinInput = document.getElementById('owner-pin-input');
  const errorMsg = document.getElementById('login-error-msg');
  const unlockBtn = document.getElementById('unlock-btn');

  if (!pinInput || !pinInput.value.trim()) return;

  const pin = pinInput.value.trim();
  if (errorMsg) errorMsg.style.display = 'none';
  if (unlockBtn) {
    unlockBtn.disabled = true;
    unlockBtn.textContent = 'Verifying...';
  }

  // 1. First, check direct offline/local credentials
  const isValidOwner = OWNER_CREDENTIALS.includes(pin);

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });

    const data = await res.json();
    if (data.success && data.token) {
      grantOwnerAccess(data.token);
      return;
    } else {
      showLoginError(data.error || 'Access Denied: Invalid Owner PIN');
      return;
    }
  } catch (err) {
    console.warn('Backend server not reachable, checking owner credentials directly...');
    // If backend is down or opened via file://, use direct verified check
    if (isValidOwner) {
      const offlineToken = 'rahu_owner_session_' + Date.now();
      grantOwnerAccess(offlineToken);
      showAdminToast('Unlocked as Kogila Selvaganesh! 👑');
    } else {
      showLoginError('Invalid Owner PIN. (Use 9804 or rahu2026)');
    }
  } finally {
    if (unlockBtn) {
      unlockBtn.disabled = false;
      unlockBtn.textContent = 'Unlock Dashboard 🔓';
    }
  }
}

function grantOwnerAccess(token) {
  AdminState.token = token;
  localStorage.setItem('rahu_owner_token', token);

  window.soundFX?.playOrderSuccess();

  const overlay = document.getElementById('owner-login-overlay');
  const dashboard = document.getElementById('admin-dashboard-container');
  if (overlay) overlay.style.display = 'none';
  if (dashboard) dashboard.style.display = 'flex';

  initializeAuthenticatedAdmin();
}

function showLoginError(msg) {
  const errorMsg = document.getElementById('login-error-msg');
  const pinInput = document.getElementById('owner-pin-input');
  if (errorMsg) {
    errorMsg.textContent = msg;
    errorMsg.style.display = 'block';
  }
  if (pinInput) {
    pinInput.value = '';
    pinInput.focus();
  }
}

// Owner Logout
async function ownerLogout() {
  if (confirm('Are you sure you want to lock the Owner Portal?')) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${AdminState.token}` }
      });
    } catch (e) {}

    localStorage.removeItem('rahu_owner_token');
    AdminState.token = '';
    window.location.reload();
  }
}

// Initialize Authenticated Dashboard
async function initializeAuthenticatedAdmin() {
  await loadDashboardData();
  setupRealtimeSSE();
  setupFilterTabs();
}

// Load all initial data (with resilient fallback if server is offline)
async function loadDashboardData() {
  try {
    const headers = { 'Authorization': `Bearer ${AdminState.token}` };
    const [ordersRes, productsRes, messagesRes, statsRes] = await Promise.all([
      fetch('/api/orders', { headers }).catch(() => null),
      fetch('/api/products', { headers }).catch(() => null),
      fetch('/api/messages', { headers }).catch(() => null),
      fetch('/api/stats', { headers }).catch(() => null)
    ]);

    AdminState.orders = ordersRes && ordersRes.ok ? await ordersRes.json() : FALLBACK_ORDERS;
    AdminState.products = productsRes && productsRes.ok ? await productsRes.json() : FALLBACK_PRODUCTS;
    AdminState.messages = messagesRes && messagesRes.ok ? await messagesRes.json() : [];
    AdminState.stats = statsRes && statsRes.ok ? await statsRes.json() : {};

    renderStats();
    renderOrders();
    renderProductsTable();
    renderChatCenter();
  } catch (err) {
    console.warn('Using local fallback data:', err);
    AdminState.orders = FALLBACK_ORDERS;
    AdminState.products = FALLBACK_PRODUCTS;
    renderStats();
    renderOrders();
    renderProductsTable();
  }
}

// Setup Real-Time SSE Stream
function setupRealtimeSSE() {
  if (AdminState.sseSource) AdminState.sseSource.close();

  try {
    const sse = new EventSource('/api/events');
    AdminState.sseSource = sse;

    sse.addEventListener('order_placed', (e) => {
      const newOrder = JSON.parse(e.data);
      AdminState.orders.unshift(newOrder);

      if (AdminState.audioAlertsEnabled) {
        window.soundFX?.playAdminBell();
      }

      renderStats();
      renderOrders();
      showAdminToast(`🔔 New Order #${newOrder.id} received from ${newOrder.customer.name}!`);
    });

    sse.addEventListener('order_status_updated', (e) => {
      const updated = JSON.parse(e.data);
      const idx = AdminState.orders.findIndex(o => o.id === updated.id);
      if (idx !== -1) {
        AdminState.orders[idx] = updated;
        renderOrders();
        renderStats();
      }
    });

    sse.addEventListener('new_message', (e) => {
      const msg = JSON.parse(e.data);
      AdminState.messages.push(msg);
      renderChatCenter();

      if (msg.sender === 'customer') {
        if (AdminState.audioAlertsEnabled) {
          window.soundFX?.playMessagePing();
        }
        showAdminToast(`💬 New Message from ${msg.customerName}: "${msg.text}"`);
      }
    });

    sse.addEventListener('product_updated', (e) => {
      const updatedProd = JSON.parse(e.data);
      const idx = AdminState.products.findIndex(p => p.id === updatedProd.id);
      if (idx !== -1) {
        AdminState.products[idx] = updatedProd;
        renderProductsTable();
      }
    });
  } catch (e) {
    console.warn('Real-time SSE not active (offline mode)');
  }
}

// Render Stats
function renderStats() {
  const totalRevEl = document.getElementById('stat-total-revenue');
  const totalOrdersEl = document.getElementById('stat-total-orders');
  const pendingEl = document.getElementById('stat-pending-orders');
  const deliveredEl = document.getElementById('stat-delivered-orders');

  const totalRev = AdminState.orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + (o.totalAmount || 0) : sum, 0);
  const pendingCount = AdminState.orders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
  const deliveredCount = AdminState.orders.filter(o => o.status === 'delivered').length;

  if (totalRevEl) totalRevEl.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
  if (totalOrdersEl) totalOrdersEl.textContent = AdminState.orders.length;
  if (pendingEl) pendingEl.textContent = pendingCount;
  if (deliveredEl) deliveredEl.textContent = deliveredCount;

  const pendingBadge = document.getElementById('sidebar-pending-badge');
  if (pendingBadge) {
    pendingBadge.textContent = pendingCount;
    pendingBadge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
  }
}

// Render Orders List
function renderOrders() {
  const container = document.getElementById('admin-orders-list');
  if (!container) return;

  const filtered = AdminState.activeFilter === 'all'
    ? AdminState.orders
    : AdminState.orders.filter(o => o.status === AdminState.activeFilter);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background: white; border-radius: 16px; padding: 40px; text-align: center; color: #64748B;">
        No orders found in this category.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(order => {
    const isNew = order.status === 'placed';
    return `
      <div class="order-box ${isNew ? 'highlight' : ''}" id="order-box-${order.id}">
        <div class="order-box-header">
          <div class="order-id-badge">
            <span class="order-id-text">Order #${order.id}</span>
            <span class="order-time">${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ${new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <span class="status-pill ${order.status}">${formatStatusLabel(order.status)}</span>
        </div>

        <div class="order-details-grid">
          <div class="detail-column">
            <h4>Customer Info</h4>
            <div class="customer-name">${order.customer.name}</div>
            <div class="customer-phone">📞 ${order.customer.phone}</div>
            <div class="delivery-slot-badge" style="background:#ECFDF5; color:#047857; border: 1px solid #A7F3D0; font-weight:700;">🏭 Delivery within 1 Day</div>
          </div>

          <div class="detail-column">
            <h4>Delivery Address (Sivakasi)</h4>
            <div class="customer-address">${order.customer.address || 'Address provided at delivery'}</div>
            ${order.customer.landmark ? `<div style="font-size: 11px; color: #B45309; margin-top: 4px;">📌 Landmark: ${order.customer.landmark}</div>` : ''}
            ${order.customerNote ? `<div style="font-size: 11px; color: #047857; margin-top: 4px;">💬 Note: "${order.customerNote}"</div>` : ''}
          </div>

          <div class="detail-column">
            <h4>Items Ordered (${order.itemCount})</h4>
            <div class="order-items-list">
              ${order.items.map(item => `
                <div class="item-line">
                  <span>${item.productName} <small style="color:#64748B;">(${item.variantLabel || ''})</small></span>
                  <span class="item-line-qty">x${item.quantity}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="order-box-footer">
          <div>
            <span class="order-payment-method">Payment: <strong>${order.paymentMethod}</strong> (${order.paymentStatus || 'Pending'}) • Total:</span>
            <span class="order-total-price">₹${order.totalAmount}</span>
          </div>

          <div class="status-actions-group">
            ${order.status === 'placed' ? `
              <button class="action-btn accept" onclick="updateOrderStatus('${order.id}', 'confirmed', 'Kogila Selvaganesh accepted the order')">
                ✓ Accept Order
              </button>
            ` : ''}

            ${order.status === 'confirmed' ? `
              <button class="action-btn prepare" onclick="updateOrderStatus('${order.id}', 'preparing', 'Freshly packed at Bharathi Nagar unit')">
                🥣 Start Packing
              </button>
            ` : ''}

            ${order.status === 'preparing' ? `
              <button class="action-btn dispatch" onclick="updateOrderStatus('${order.id}', 'out_for_delivery', 'Rider is out for delivery in Sivakasi')">
                🛵 Out for Delivery
              </button>
            ` : ''}

            ${order.status === 'out_for_delivery' ? `
              <button class="action-btn deliver" onclick="updateOrderStatus('${order.id}', 'delivered', 'Handed over to customer')">
                🎉 Mark Delivered
              </button>
            ` : ''}

            <a 
              href="https://wa.me/${formatPhoneForWhatsApp(order.customer.phone)}?text=${encodeURIComponent(`Vanakkam ${order.customer.name}! This is Kogila Selvaganesh from Rahu Milk Products, Bharathi Nagar, Sivakasi regarding your order #${order.id}. Current status: ${formatStatusLabel(order.status)}.`)}" 
              target="_blank" 
              class="action-btn whatsapp"
            >
              💬 WhatsApp Customer
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Update Order Status
async function updateOrderStatus(orderId, nextStatus, note) {
  try {
    const res = await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AdminState.token}`
      },
      body: JSON.stringify({ status: nextStatus, note })
    });

    if (res.ok) {
      window.soundFX?.playStatusUpdate();
      showAdminToast(`Updated #${orderId} to "${formatStatusLabel(nextStatus)}"`);
    } else {
      // Local state update fallback
      const order = AdminState.orders.find(o => o.id === orderId);
      if (order) {
        order.status = nextStatus;
        renderOrders();
        renderStats();
        showAdminToast(`Updated #${orderId} status`);
      }
    }
  } catch (err) {
    // Local fallback
    const order = AdminState.orders.find(o => o.id === orderId);
    if (order) {
      order.status = nextStatus;
      renderOrders();
      renderStats();
      showAdminToast(`Updated #${orderId} status`);
    }
  }
}

// Render Products & Pricing Table
function renderProductsTable() {
  const container = document.getElementById('admin-products-table-body');
  if (!container) return;

  container.innerHTML = AdminState.products.map(prod => `
    <tr>
      <td>
        <div class="product-cell">
          <img 
            src="${prod.image}" 
            class="product-thumb" 
            alt="${prod.name}" 
            onerror="this.src='/assets/images/${prod.category === 'ghee' ? 'ghee.svg' : prod.category === 'gova' ? 'milk-gova.svg' : 'paneer-malai.svg'}';"
          />
          <div>
            <strong>${prod.name}</strong>
            <div style="font-size: 11px; color: #64748B;">${prod.tamil_name ? `${prod.tamil_name} • ` : ''}${prod.badge}</div>
          </div>
        </div>
      </td>
      <td>
        <span style="text-transform: capitalize; font-weight: 600; color: #475569;">${prod.category}</span>
      </td>
      <td>
        ${prod.variants.map(v => `
          <div style="margin-bottom: 4px;">
            <span style="font-size: 12px; color: #64748B;">${v.label}:</span>
            <strong style="color: #B45309;">₹${v.price}</strong>
          </div>
        `).join('')}
      </td>
      <td>
        <label class="toggle-switch">
          <input 
            type="checkbox" 
            ${prod.inStock ? 'checked' : ''} 
            onchange="toggleProductStock('${prod.id}', this.checked)"
          />
          <span class="slider"></span>
        </label>
      </td>
    </tr>
  `).join('');
}

async function toggleProductStock(productId, inStock) {
  try {
    await fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AdminState.token}`
      },
      body: JSON.stringify({ inStock })
    });
    showAdminToast(`Inventory updated for ${productId}`);
  } catch (err) {
    showAdminToast(`Stock toggled for ${productId}`);
  }
}

// Render Real-time Chat Center
function renderChatCenter() {
  const customerList = document.getElementById('chat-customer-list');
  const threadBody = document.getElementById('chat-thread-body');
  const threadTitle = document.getElementById('chat-thread-title');
  if (!customerList || !threadBody) return;

  const customerMap = {};
  AdminState.messages.forEach(m => {
    const key = m.customerPhone || m.customerName || 'Guest';
    if (!customerMap[key]) {
      customerMap[key] = {
        name: m.customerName,
        phone: m.customerPhone,
        messages: []
      };
    }
    customerMap[key].messages.push(m);
  });

  const customerKeys = Object.keys(customerMap);
  if (customerKeys.length === 0) {
    customerList.innerHTML = `<div style="padding: 20px; color: #64748B; font-size: 12px;">No customer chats yet.</div>`;
    return;
  }

  if (!AdminState.selectedChatCustomer || !customerMap[AdminState.selectedChatCustomer]) {
    AdminState.selectedChatCustomer = customerKeys[0];
  }

  customerList.innerHTML = customerKeys.map(key => {
    const cust = customerMap[key];
    const lastMsg = cust.messages[cust.messages.length - 1];
    const isSelected = key === AdminState.selectedChatCustomer;

    return `
      <div 
        class="customer-chat-item ${isSelected ? 'active' : ''}" 
        onclick="selectChatCustomer('${key}')"
      >
        <div class="chat-item-name">${cust.name}</div>
        <div style="font-size: 11px; color: #B45309;">${cust.phone}</div>
        <div class="chat-item-preview">${lastMsg.sender === 'admin' ? 'You: ' : ''}${lastMsg.text}</div>
      </div>
    `;
  }).join('');

  const activeChat = customerMap[AdminState.selectedChatCustomer];
  if (activeChat) {
    if (threadTitle) threadTitle.textContent = `${activeChat.name} (${activeChat.phone})`;
    threadBody.innerHTML = activeChat.messages.map(m => `
      <div class="admin-msg-bubble ${m.sender === 'customer' ? 'from-customer' : 'from-admin'}">
        <div>${m.text}</div>
        <div style="font-size: 9px; opacity: 0.7; margin-top: 4px; text-align: right;">
          ${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    `).join('');
    threadBody.scrollTop = threadBody.scrollHeight;
  }
}

function selectChatCustomer(key) {
  AdminState.selectedChatCustomer = key;
  renderChatCenter();
}

async function sendAdminReply() {
  const input = document.getElementById('admin-reply-input');
  if (!input || !input.value.trim() || !AdminState.selectedChatCustomer) return;

  const text = input.value.trim();
  input.value = '';

  const payload = {
    customerName: AdminState.selectedChatCustomer,
    customerPhone: AdminState.selectedChatCustomer,
    sender: 'admin',
    text
  };

  try {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AdminState.token}`
      },
      body: JSON.stringify(payload)
    });
    window.soundFX?.playPop();
  } catch (err) {
    showAdminToast('Sent message locally');
  }
}

// Helpers
function setupFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AdminState.activeFilter = tab.dataset.filter;
      renderOrders();
    });
  });

  const replyInput = document.getElementById('admin-reply-input');
  if (replyInput) {
    replyInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendAdminReply();
    });
  }
}

function setupAudioToggle() {
  const btn = document.getElementById('audio-toggle-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      AdminState.audioAlertsEnabled = !AdminState.audioAlertsEnabled;
      btn.classList.toggle('active', AdminState.audioAlertsEnabled);
      btn.innerHTML = AdminState.audioAlertsEnabled 
        ? `<span>🔔</span> Audio Alerts: ON` 
        : `<span>🔕</span> Audio Alerts: OFF`;
      if (AdminState.audioAlertsEnabled) {
        window.soundFX?.playPop();
      }
    });
  }
}

function toggleMobileModal() {
  const modal = document.getElementById('admin-mobile-modal');
  if (!modal) return;
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function formatStatusLabel(status) {
  const map = {
    'placed': 'New Order Placed',
    'confirmed': 'Accepted by Dairy',
    'preparing': 'Packing at Bharathi Nagar',
    'out_for_delivery': 'Out for Delivery (Sivakasi)',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return map[status] || status;
}

function formatPhoneForWhatsApp(phone) {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) clean = '91' + clean;
  return clean;
}

function showAdminToast(msg) {
  const toast = document.getElementById('admin-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 4000);
}
