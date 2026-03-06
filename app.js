/* ============================================================
   RESTAURANTE CASERO - Lógica Principal
   ============================================================ */

// ============================================================
// 1. CONFIGURACIÓN EDITABLE
//    [Supuesto] Reemplazá estos valores con los datos reales
// ============================================================
const CONFIG = {
  whatsappNumber: '5493584010796',   // [Supuesto] Número sin + ni espacios
  cbu:            '0000003100012345678901', // [Supuesto] CBU del local
  localName:      'La Casona',
  currency:       '$',
};

// ============================================================
// 2. DATOS DEL MENÚ
//    emoji:       fallback visual si no hay imagen
//    precio:      [Supuesto] — editables
//    cal/prot/carb/grasas: valores nutricionales estimados por porción
// ============================================================
const MENU = {
  pastas: [
    { id:'p1', nombre:'Sorrentinos de Jamón y Queso', informacion:'Jamón cocido, ricota y queso muzzarella. Ultracongelado en caja por 16 unidades', emoji:'🥟', precio:1800, cal:480, prot:22, carb:58, grasas:16 },
    { id:'p2', nombre:'Panzottis de Espinaca y Muzzarella', informacion:'Espinaca y queso muzzarella. Ultracongelado en caja por 30 unidades', emoji:'🥟', precio:1700, cal:420, prot:18, carb:52, grasas:14 },
    { id:'p3', nombre:'Panzottis de Calabacín y Muzzarella', informacion:'Calabacín, queso tybo, choclo cremoso amarillo y zanahoria. Ultracongelado en caja por 30 unidades', emoji:'🥟', precio:1700, cal:390, prot:15, carb:50, grasas:12 },
    { id:'p4', nombre:'Panzottis de Espinaca y Carne', informacion:'Espinaca, ricota, queso muzzarella y carne molida especial. Ultracongelado en caja por 30 unidades', emoji:'🥟', precio:1900, cal:460, prot:26, carb:50, grasas:15 },
    { id:'p5', nombre:'Lasagna', informacion:'Carne molida, espinaca, zanahoria, jamón cocido, queso tybo y sardo, salsa roja y blanca. Ultracongelada en bandeja por unidad (500g)', emoji:'🍝', precio:1600, cal:520, prot:28, carb:55, grasas:20 },
    { id:'p6', nombre:'Canelones', informacion:'Carne molida especial, espinaca, salsa roja y blanca, y queso sardo. Ultracongelados en bandeja por 3 unidades', emoji:'🍝', precio:1600, cal:490, prot:24, carb:52, grasas:18 },
    { id:'p7', nombre:'Ñoquis', informacion:'Sémola de trigo, manteca, queso parmesano y huevo. Ultracongelado en bandeja por 600g (crudo)', emoji:'🥔', precio:1400, cal:380, prot:12, carb:62, grasas:8  },
  ],
  pizzas: [
    { id:'z1', nombre:'Muzzarella', informacion:'jamón cocido, masa casera y aceitunas verdes (8 u). Envasada al vacío por unidad', emoji:'🍕', precio:1500, cal:640, prot:30, carb:70, grasas:26 },
    { id:'z2', nombre:'Muzzarella', informacion:'masa casera y aceitunas verdes (8 u). Envasada al vacío por unidad', emoji:'🍕', precio:1300, cal:580, prot:24, carb:68, grasas:22 },
    { id:'z3', nombre:'Calabresa', informacion:'Muzzarella, cantimpalo, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', emoji:'🍕', precio:1400, cal:620, prot:26, carb:66, grasas:28 },
    { id:'z4', nombre:'Provolone', informacion:'Muzzarella, queso provolone, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', emoji:'🍕', precio:1450, cal:650, prot:28, carb:64, grasas:30 },
    { id:'z5', nombre:'4 Quesos', informacion:'Muzzarella, queso sardo, queso fontina, queso roquefort, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', emoji:'🍕', precio:1550, cal:710, prot:32, carb:65, grasas:35 },
    { id:'z6', nombre:'Roquefort', informacion:'Muzzarella, queso roquefort, masa casera y aceitunas negras (8 u). Envasada al vacío por unidad', emoji:'🍕', precio:1500, cal:680, prot:28, carb:64, grasas:33 },
  ],
  tartas: [
    { id:'t1', nombre:'Jamón y Queso', informacion:'Jamón, muzzarella, huevo, cebolla, masa de tarta y especias. Ultracongeladas por unidad', emoji:'🥧', precio:1200, cal:440, prot:20, carb:38, grasas:22 },
    { id:'t2', nombre:'Pollo', informacion:'Pollo, muzzarella, cebolla, zanahoria, huevo, masa de tarta y especias. Ultracongeladas por unidad', emoji:'🥧', precio:1300, cal:420, prot:24, carb:36, grasas:18 },
    { id:'t3', nombre:'Espinaca', informacion:'Espinaca, ricota, muzzarella, cebolla y masa de tarta. Ultracongeladas por unidad', emoji:'🥧', precio:1100, cal:360, prot:14, carb:35, grasas:17 },
    { id:'t4', nombre:'Calabacín', informacion:'Calabacín, muzzarella, pimiento, cebolla, choclo cremoso amarillo, especias y masa de tarta. Ultracongeladas por unidad', emoji:'🥧', precio:1100, cal:340, prot:12, carb:34, grasas:16 },
  ],
};

// ============================================================
// 3. ESTADO DEL CARRITO
// ============================================================
let cart = [];   // [{...producto, qty}]
let selectedPayment = null;

// ============================================================
// 4. NAVEGACIÓN (SPA single-file multi-page)
// ============================================================
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  // Actualizar links activos
  document.querySelectorAll('.navbar__link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });
  closeCart();

  // Renderizar según página
  if (pageId === 'pastas')  renderProducts('pastas');
  if (pageId === 'pizzas')  renderProducts('pizzas');
  if (pageId === 'tartas')  renderProducts('tartas');
  if (pageId === 'checkout') renderCheckout();
  if (pageId === 'confirm')  renderConfirm();
}

// ============================================================
// 5. RENDERIZADO DE PRODUCTOS
// ============================================================
async function renderProducts(category) {
  const container = document.getElementById('grid-' + category);
  if (!container) return;
  container.innerHTML = 'Cargando...';

  try {
    const res = await fetch('http://localhost:3000/productos');
    const productos = await res.json();
    const filtered = productos.filter(p => p.categoria === category && p.stock > 0);

    container.innerHTML = '';
    filtered.forEach(item => {
      const inCart = cart.find(c => c.id === item._id);
      const card = document.createElement('article');
      card.className = 'product-card';
      card.id = 'card-' + item._id;
      card.innerHTML = `
        <div class="product-card__img-wrap">
          <div class="product-card__emoji-fallback">🍕</div>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${item.nombre}${item.informacion ? '<br><small>' + item.informacion + '</small>' : ''}</h3>
          <p class="product-card__price">${CONFIG.currency}${item.precio.toLocaleString('es-AR')}</p>
          <button class="nutrition-toggle" onclick="toggleNutrition('${item._id}')">
            🥗 Info nutricional ▾
          </button>
          <div class="nutrition-panel" id="nutri-${item._id}">
            <div class="nutrition-item">
              <span class="nutrition-item__label">Calorías</span>
              <span class="nutrition-item__val">${item.infoNutricional.cal} kcal</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-item__label">Proteínas</span>
              <span class="nutrition-item__val">${item.infoNutricional.prot} g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-item__label">Carbohidratos</span>
              <span class="nutrition-item__val">${item.infoNutricional.carb} g</span>
            </div>
            <div class="nutrition-item">
              <span class="nutrition-item__label">Grasas</span>
              <span class="nutrition-item__val">${item.infoNutricional.grasas} g</span>
            </div>
          </div>
          <button class="product-card__add-btn ${inCart ? 'added' : ''}" id="btn-${item._id}"
            onclick="addToCart('${item._id}', '${category}', ${item.precio}, '${item.nombre}')">
            ${inCart ? '✓ Agregado' : '＋ Agregar al carrito'}
          </button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = 'Error cargando productos';
  }
}

// ============================================================
// 6. NUTRICIÓN TOGGLE
// ============================================================
function toggleNutrition(id) {
  const panel = document.getElementById('nutri-' + id);
  if (panel) panel.classList.toggle('open');
}

// ============================================================
// 7. CARRITO — agregar / modificar / eliminar
// ============================================================
function addToCart(itemId, category, precio, nombre) {
  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: itemId, nombre, precio, qty: 1 });
  }

  updateCartBadge();
  renderCartItems();
  openCart();

  // Feedback visual en botón
  const btn = document.getElementById('btn-' + itemId);
  if (btn) { btn.classList.add('added'); btn.textContent = '✓ Agregado'; }
  showToast('¡' + nombre + ' agregado! 🛒');
}

function changeQty(itemId, delta) {
  const idx = cart.findIndex(c => c.id === itemId);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartBadge();
  renderCartItems();
  // Refrescar botón si la página está activa
  refreshAddBtn(itemId);
}

function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  updateCartBadge();
  renderCartItems();
  refreshAddBtn(itemId);
}

function refreshAddBtn(itemId) {
  const btn = document.getElementById('btn-' + itemId);
  if (!btn) return;
  const inCart = cart.find(c => c.id === itemId);
  btn.classList.toggle('added', !!inCart);
  btn.textContent = inCart ? '✓ Agregado' : '＋ Agregar al carrito';
}

function cartTotal() {
  return cart.reduce((sum, i) => sum + i.precio * i.qty, 0);
}

// ============================================================
// 8. RENDER PANEL CARRITO
// ============================================================
function renderCartItems() {
  const body = document.getElementById('cart-body');
  const totalEl = document.getElementById('cart-total-val');
  if (!body) return;

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Tu carrito está vacío.<br>¡Explorá el menú y agregá tus favoritos!</p>
      </div>`;
  } else {
    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item__emoji">${item.emoji}</div>
        <div class="cart-item__info">
          <div class="cart-item__name">${item.nombre}</div>
          <div class="cart-item__price">${CONFIG.currency}${(item.precio * item.qty).toLocaleString('es-AR')}</div>
          <div class="cart-item__controls">
            <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
            <button class="cart-item__remove" onclick="removeFromCart('${item.id}')">✕ Quitar</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (totalEl) totalEl.textContent = CONFIG.currency + cartTotal().toLocaleString('es-AR');
}

function updateCartBadge() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  badge.textContent = totalItems;
  badge.classList.toggle('hidden', totalItems === 0);
}

function openCart()  {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-panel').classList.add('open');
}
function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-panel').classList.remove('open');
}

// ============================================================
// 9. CHECKOUT
// ============================================================
function renderCheckout() {
  // Resumen del pedido
  const summaryEl = document.getElementById('checkout-summary');
  if (summaryEl) {
    if (cart.length === 0) {
      summaryEl.innerHTML = '<p style="color:var(--gray-mid)">No hay productos en el carrito.</p>';
    } else {
      summaryEl.innerHTML = `
        <div class="order-summary-list">
          ${cart.map(i => `
            <div class="order-summary-item">
              <span>${i.nombre} × ${i.qty}</span>
              <span>${CONFIG.currency}${(i.precio * i.qty).toLocaleString('es-AR')}</span>
            </div>
          `).join('')}
        </div>
        <div class="order-summary-total">
          <span>Total</span>
          <span>${CONFIG.currency}${cartTotal().toLocaleString('es-AR')}</span>
        </div>
      `;
    }
  }
  // Mostrar CBU editable
  const cbuEl = document.getElementById('cbu-value');
  if (cbuEl) cbuEl.textContent = CONFIG.cbu;
}

function selectPayment(method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option').forEach(o => {
    o.classList.toggle('selected', o.dataset.method === method);
  });
  // Mostrar/ocultar info CBU
  const cbuBlock = document.getElementById('cbu-block');
  if (cbuBlock) cbuBlock.style.display = method === 'transferencia' ? 'block' : 'none';
}

function confirmOrder() {
  if (cart.length === 0) {
    showToast('⚠️ El carrito está vacío');
    return;
  }
  if (!selectedPayment) {
    showToast('⚠️ Elegí un método de pago');
    return;
  }
  navigate('confirm');
}

// ============================================================
// 10. CONFIRMACIÓN + WHATSAPP
// ============================================================
function renderConfirm() {
  const summaryEl = document.getElementById('confirm-summary-list');
  if (summaryEl) {
    summaryEl.innerHTML = cart.map(i =>
      `<div class="order-summary-item">
         <span>${i.emoji} ${i.nombre} × ${i.qty}</span>
         <span>${CONFIG.currency}${(i.precio * i.qty).toLocaleString('es-AR')}</span>
       </div>`
    ).join('') +
    `<div class="order-summary-total">
       <span>Total</span>
       <span>${CONFIG.currency}${cartTotal().toLocaleString('es-AR')}</span>
     </div>`;
  }
  const payEl = document.getElementById('confirm-payment');
  const labels = {
    transferencia: '💳 Transferencia bancaria',
    tarjeta:       '💳 Tarjeta',
    efectivo:      '💵 Efectivo al retirar/entregar',
  };
  if (payEl) payEl.textContent = labels[selectedPayment] || '';
}

function sendWhatsApp() {
  if (cart.length === 0) return;

  // Obtenemos los elementos de forma segura
  const nameEl = document.getElementById('checkout-name');
  const phoneEl = document.getElementById('checkout-phone');
  const addressEl = document.getElementById('checkout-address');

  const pedido = {
    cliente: {
      nombre: nameEl ? nameEl.value : "Cliente",
      telefono: phoneEl ? phoneEl.value : "No provisto",
      direccion: addressEl ? addressEl.value : "Retiro en local"
    },
    productos: cart.map(i => ({ id: i.id, nombre: i.nombre, precio: i.precio, qty: i.qty })),
    total: cartTotal(),
    pago: selectedPayment
  };

  fetch('http://localhost:3000/pedido', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  }).then(res => {
    if (res.ok) {
      // Proceder con WhatsApp
      const payLabels = {
        transferencia: 'Transferencia bancaria',
        tarjeta:       'Tarjeta',
        efectivo:      'Efectivo al retirar/entregar',
      };
      const lineas = cart.map(i =>
        `• ${i.nombre} × ${i.qty} — ${CONFIG.currency}${(i.precio * i.qty).toLocaleString('es-AR')}`
      ).join('\n');
      const msg = [
        `🍽️ *Pedido - ${CONFIG.localName}*`,
        '',
        lineas,
        '',
        `*Total:* ${CONFIG.currency}${cartTotal().toLocaleString('es-AR')}`,
        `*Pago:* ${payLabels[selectedPayment] || selectedPayment}`,
      ].join('\n');

      const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank');

      // Limpiar carrito después de enviar
      setTimeout(() => {
        cart = [];
        selectedPayment = null;
        updateCartBadge();
        renderCartItems();
      }, 1500);
    } else {
      showToast('Error al enviar pedido');
    }
  }).catch(err => {
    showToast('Error de conexión');
  });
}

// ============================================================
// 11. WHATSAPP FLOTANTE
// ============================================================
function openWhatsApp() {
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent('¡Hola! Quisiera hacer una consulta 😊')}`, '_blank');
}

// ============================================================
// 12. TOAST NOTIFICATION
// ============================================================
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timeout);
  t._timeout = setTimeout(() => t.classList.remove('show'), 2600);
}

// ============================================================
// 13. HAMBURGER MENU
// ============================================================
function toggleMobileMenu() {
  const nav   = document.getElementById('navbar-nav');
  const btn   = document.getElementById('hamburger');
  nav.classList.toggle('open');
  btn.classList.toggle('open');
}

// ============================================================
// 14. INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  navigate('inicio');
  updateCartBadge();
  renderCartItems();
});
