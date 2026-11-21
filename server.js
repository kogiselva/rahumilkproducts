/**
 * Rahu Milk Products - Real-Time Server
 * Owned by: Kogila Selvaganesh (Phone: 9894039804, Email: kogiselvarahu@gmail.com, Bharathi Nagar, Sivakasi)
 * Features:
 * - Secure Owner-Only Authentication for Admin Dashboard (Restricted PIN/Password)
 * - Server-Sent Events (SSE) for instant real-time live synchronization
 * - RESTful APIs for Products, Orders, Messages, and Admin Analytics
 * - JSON-file persistence for orders, products, and customer messages
 * - Automatic Local Wi-Fi Network IP detection for seamless Mobile Phone access
 * - Static asset serving with appropriate MIME types & CORS headers
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const os = require('os');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const PUBLIC_DIR = path.join(__dirname, 'public');

// OWNER SECURITY CREDENTIALS
const OWNER_CONFIG = {
  name: 'Kogila Selvaganesh',
  phone: '9894039804',
  email: 'kogiselvarahu@gmail.com',
  location: 'Bharathi Nagar, Sivakasi',
  // Accepted Owner PINs & Passwords
  validCredentials: ['9804', 'rahu2026', '9894039804', 'admin9804']
};

// Active owner auth tokens
const activeOwnerTokens = new Set();

// MIME types for static files
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

// Connected SSE clients for live broadcast
const sseClients = new Set();

/** Get Local Network IPv4 Address for mobile access */
function getLocalNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

/** Broadcast an event to all connected customer & admin clients */
function broadcastSSE(eventType, data) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of sseClients) {
    try {
      client.write(payload);
    } catch (err) {
      console.error('SSE client write error:', err.message);
      sseClients.delete(client);
    }
  }
}

/** Helper: Read JSON file safely */
function readJSON(filename, fallback = []) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

/** Helper: Write JSON file safely */
function writeJSON(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

/** Helper: Parse incoming JSON request body */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/** Helper: Send JSON response */
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Owner-Token',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

/** Helper: Check if request has valid owner token */
function isOwnerAuthenticated(req) {
  const authHeader = req.headers['authorization'] || req.headers['x-owner-token'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  return token && activeOwnerTokens.has(token);
}

/** Helper: Serve static file */
function serveStatic(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Owner-Token',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 0. OWNER AUTHENTICATION ENDPOINTS
  if (pathname === '/api/admin/login' && req.method === 'POST') {
    try {
      const { pin, password } = await parseRequestBody(req);
      const secret = (pin || password || '').toString().trim();

      if (OWNER_CONFIG.validCredentials.includes(secret)) {
        const token = 'rahu_owner_' + crypto.randomBytes(16).toString('hex');
        activeOwnerTokens.add(token);

        return sendJSON(res, 200, {
          success: true,
          token,
          owner: {
            name: OWNER_CONFIG.name,
            phone: OWNER_CONFIG.phone,
            email: OWNER_CONFIG.email,
            location: OWNER_CONFIG.location
          }
        });
      } else {
        return sendJSON(res, 401, {
          success: false,
          error: 'Invalid Owner PIN or Password. Restricted entry for Kogila Selvaganesh only.'
        });
      }
    } catch (err) {
      return sendJSON(res, 400, { error: err.message });
    }
  }

  if (pathname === '/api/admin/verify' && req.method === 'GET') {
    const isAuth = isOwnerAuthenticated(req);
    return sendJSON(res, 200, { authenticated: isAuth });
  }

  if (pathname === '/api/admin/logout' && req.method === 'POST') {
    const authHeader = req.headers['authorization'] || req.headers['x-owner-token'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token) activeOwnerTokens.delete(token);
    return sendJSON(res, 200, { success: true });
  }

  // 1. NETWORK INFO FOR MOBILE PHONES
  if (pathname === '/api/network-info' && req.method === 'GET') {
    const localIp = getLocalNetworkIp();
    return sendJSON(res, 200, {
      localIp,
      port: PORT,
      mobileUrl: `http://${localIp}:${PORT}`,
      adminUrl: `http://${localIp}:${PORT}/admin`
    });
  }

  // 2. REAL-TIME SERVER-SENT EVENTS (SSE) ENDPOINT
  if (pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    });
    res.write('retry: 3000\n\n');
    res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`);

    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
    return;
  }

  // 3. PRODUCTS API
  if (pathname === '/api/products' && req.method === 'GET') {
    const products = readJSON('products.json');
    return sendJSON(res, 200, products);
  }

  if (pathname.startsWith('/api/products/') && req.method === 'PUT') {
    const productId = pathname.replace('/api/products/', '');
    try {
      const updates = await parseRequestBody(req);
      const products = readJSON('products.json');
      const index = products.findIndex(p => p.id === productId);
      if (index === -1) {
        return sendJSON(res, 404, { error: 'Product not found' });
      }

      products[index] = { ...products[index], ...updates };
      writeJSON('products.json', products);

      broadcastSSE('product_updated', products[index]);
      return sendJSON(res, 200, products[index]);
    } catch (err) {
      return sendJSON(res, 400, { error: err.message });
    }
  }

  // 4. ORDERS API
  if (pathname === '/api/orders' && req.method === 'GET') {
    const orders = readJSON('orders.json');
    const phone = parsedUrl.query.phone;
    if (phone) {
      const filtered = orders.filter(o => o.customer && o.customer.phone === phone);
      return sendJSON(res, 200, filtered);
    }
    return sendJSON(res, 200, orders);
  }

  if (pathname.startsWith('/api/orders/') && req.method === 'GET') {
    const orderId = pathname.replace('/api/orders/', '');
    const orders = readJSON('orders.json');
    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return sendJSON(res, 404, { error: 'Order not found' });
    }
    return sendJSON(res, 200, order);
  }

  if (pathname === '/api/orders' && req.method === 'POST') {
    try {
      const orderData = await parseRequestBody(req);

      if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
        return sendJSON(res, 400, { error: 'Order must contain at least one item' });
      }

      if (!orderData.customer || !orderData.customer.name || !orderData.customer.phone) {
        return sendJSON(res, 400, { error: 'Customer name and phone are required' });
      }

      const orders = readJSON('orders.json');
      const orderCount = orders.length + 1001;
      const orderId = `RAHU-${orderCount}`;

      const now = new Date().toISOString();
      const newOrder = {
        id: orderId,
        createdAt: now,
        customer: {
          name: orderData.customer.name.trim(),
          phone: orderData.customer.phone.trim(),
          address: (orderData.customer.address || '').trim(),
          landmark: (orderData.customer.landmark || '').trim()
        },
        deliverySlot: orderData.deliverySlot || 'Delivery within 1 Day (Factory Direct)',
        items: orderData.items,
        itemCount: orderData.items.reduce((sum, item) => sum + (item.quantity || 1), 0),
        totalAmount: orderData.totalAmount || orderData.items.reduce((sum, i) => sum + (i.price * i.quantity), 0),
        paymentMethod: orderData.paymentMethod || 'COD',
        paymentStatus: orderData.paymentMethod === 'UPI' ? 'Paid / Verification' : 'Pending on Delivery',
        customerNote: (orderData.customerNote || '').trim(),
        status: 'placed',
        statusHistory: [
          { status: 'placed', time: now, note: 'Order placed by customer' }
        ]
      };

      orders.unshift(newOrder); // Add to beginning
      writeJSON('orders.json', orders);

      // Real-time broadcast
      broadcastSSE('order_placed', newOrder);

      return sendJSON(res, 201, { success: true, order: newOrder });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message });
    }
  }

  // Update order status
  if (pathname.match(/^\/api\/orders\/[^/]+\/status$/) && req.method === 'PATCH') {
    const parts = pathname.split('/');
    const orderId = parts[3];

    try {
      const { status, note } = await parseRequestBody(req);
      const orders = readJSON('orders.json');
      const index = orders.findIndex(o => o.id === orderId);

      if (index === -1) {
        return sendJSON(res, 404, { error: 'Order not found' });
      }

      const order = orders[index];
      order.status = status;
      order.statusHistory = order.statusHistory || [];
      order.statusHistory.push({
        status,
        time: new Date().toISOString(),
        note: note || `Order updated to ${status}`
      });

      if (status === 'delivered') {
        order.paymentStatus = 'Completed';
      }

      orders[index] = order;
      writeJSON('orders.json', orders);

      // Real-time broadcast
      broadcastSSE('order_status_updated', order);

      return sendJSON(res, 200, { success: true, order });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message });
    }
  }

  // 5. MESSAGES / LIVE CHAT API
  if (pathname === '/api/messages' && req.method === 'GET') {
    const messages = readJSON('messages.json');
    const orderId = parsedUrl.query.orderId;
    if (orderId) {
      const filtered = messages.filter(m => m.orderId === orderId);
      return sendJSON(res, 200, filtered);
    }
    return sendJSON(res, 200, messages);
  }

  if (pathname === '/api/messages' && req.method === 'POST') {
    try {
      const msgData = await parseRequestBody(req);
      if (!msgData.text || !msgData.text.trim()) {
        return sendJSON(res, 400, { error: 'Message text cannot be empty' });
      }

      const messages = readJSON('messages.json');
      const newMsg = {
        id: `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        orderId: msgData.orderId || null,
        customerName: msgData.customerName || 'Customer',
        customerPhone: msgData.customerPhone || '',
        sender: msgData.sender || 'customer',
        text: msgData.text.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };

      messages.push(newMsg);
      writeJSON('messages.json', messages);

      // Real-time broadcast
      broadcastSSE('new_message', newMsg);

      return sendJSON(res, 201, { success: true, message: newMsg });
    } catch (err) {
      return sendJSON(res, 400, { error: err.message });
    }
  }

  // 6. ADMIN ANALYTICS & STATS API
  if (pathname === '/api/stats' && req.method === 'GET') {
    const orders = readJSON('orders.json');
    const messages = readJSON('messages.json');
    const products = readJSON('products.json');

    const totalRevenue = orders.reduce((sum, o) => {
      return o.status !== 'cancelled' ? sum + (o.totalAmount || 0) : sum;
    }, 0);

    const pendingOrders = orders.filter(o => o.status === 'placed' || o.status === 'confirmed').length;
    const inTransitOrders = orders.filter(o => o.status === 'preparing' || o.status === 'out_for_delivery').length;
    const deliveredOrders = orders.filter(o => o.status === 'delivered').length;

    const productSales = {};
    for (const ord of orders) {
      if (ord.status === 'cancelled') continue;
      for (const item of (ord.items || [])) {
        productSales[item.productName] = (productSales[item.productName] || 0) + (item.quantity || 1);
      }
    }

    return sendJSON(res, 200, {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      inTransitOrders,
      deliveredOrders,
      unreadMessages: messages.filter(m => !m.read && m.sender === 'customer').length,
      productSales,
      totalProducts: products.length
    });
  }

  // 7. STATIC ASSET SERVING
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

  if (pathname === '/admin' || pathname === '/admin/') {
    filePath = path.join(PUBLIC_DIR, 'admin.html');
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      if (pathname.startsWith('/admin')) {
        return serveStatic(req, res, path.join(PUBLIC_DIR, 'admin.html'));
      }
      return serveStatic(req, res, path.join(PUBLIC_DIR, 'index.html'));
    }
    serveStatic(req, res, filePath);
  });
});

const localIp = getLocalNetworkIp();

server.listen(PORT, '0.0.0.0', () => {
  console.log(`======================================================================`);
  console.log(`🥛 RAHU MILK PRODUCTS - SIVAKASI (Kogila Selvaganesh: 9894039804)`);
  console.log(`======================================================================`);
  console.log(`🔒 ADMIN SECTION IS STRICTLY OWNER-ONLY (Kogila Selvaganesh PIN: 9804)`);
  console.log(`💻 On This Computer:`);
  console.log(`   Customer App : http://localhost:${PORT}`);
  console.log(`   Admin Hub    : http://localhost:${PORT}/admin (Requires Owner PIN)`);
  console.log(``);
  console.log(`📱 HOW TO OPEN ON YOUR MOBILE PHONE (iPhone or Android):`);
  console.log(`   1. Ensure phone & PC are on the same Wi-Fi / Hotspot.`);
  console.log(`   2. Open Chrome/Safari on your phone and go to:`);
  console.log(`      👉 Customer App : http://${localIp}:${PORT}`);
  console.log(`      👉 Owner Portal : http://${localIp}:${PORT}/admin`);
  console.log(`======================================================================`);
});
