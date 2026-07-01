// مصفوفة المنتجات (JSON المدمج)
const products = [
    { id: 1, name: "عطر مضاوي الخاص", price: 150, image: "https://via.placeholder.com/220" },
    { id: 2, name: "بلو شانيل الفاخر", price: 280, image: "https://via.placeholder.com/220" },
    { id: 3, name: "سوفاج ديور النقي", price: 260, image: "https://via.placeholder.com/220" }
];

let cart = [];

// عرض المنتجات ديناميكياً عند الفتح
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <div class="price">${product.price} د.ل</div>
            <button class="add-btn" onclick="addToCart(${product.id})">إضافة للسلة</button>
        </div>
    `).join('');
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    let count = 0;
    let total = 0;

    cartItemsContainer.innerHTML = cart.map(item => {
        count += item.quantity;
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <small>${item.price} د.ل × ${item.quantity}</small>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">إزالة</button>
            </div>
        `;
    }).join('');

    cartCount.innerText = count;
    cartTotal.innerText = total;
}

// دالة الربط مع الواتساب وإرسال تفاصيل الزبون والطلب
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("السلة فارغة! أضف عطوراً أولاً.");
        return;
    }

    // جلب بيانات نموذج الزبون
    const name = document.getElementById('customerName').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const address = document.getElementById('customerAddress').value.trim();

    // التحقق من تعبئة البيانات الأساسية
    if (!name || !phone || !address) {
        alert("الرجاء تعبئة كافة بيانات التوصيل أولاً.");
        return;
    }

    const myWhatsAppNumber = "218900000000"; // ضع رقم هاتفك هنا بصيغته الدولية
    
    // صياغة رسالة الطلب وتضمين بيانات الزبون
    let message = `*طلب جديد من المتجر*\n\n`;
    message += `👤 *بيانات الزبون:*\n`;
    message += `• الاسم: ${name}\n`;
    message += `• الهاتف: ${phone}\n`;
    message += `• العنوان: ${address}\n\n`;
    
    message += `🛍️ *المنتجات المطلوبة:*\n`;
    cart.forEach(item => {
        message += `• ${item.name} (العدد: ${item.quantity}) -> ${item.price * item.quantity} د.ل\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n💰 *الإجمالي الكلي:* ${total} د.ل`;

    // فتح رابط الواتساب بالرسالة المنسقة
    const url = `https://wa.me/${myWhatsAppNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

window.onload = displayProducts;
