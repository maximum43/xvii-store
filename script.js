// مصفوفة المنتجات بصيغة كائنات (JSON Structure)
const products = [
    { id: 1, name: "عطر مضاوي الخاص", price: 150, image: "https://via.placeholder.com/220" },
    { id: 2, name: "بلو شانيل الفاخر", price: 280, image: "https://via.placeholder.com/220" },
    { id: 3, name: "سوفاج ديور النقي", price: 260, image: "https://via.placeholder.com/220" }
];

let cart = [];

// توليد وعرض المنتجات ديناميكياً داخل الصفحة
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

// تبديل حالة السلة (فتح / إغلاق)
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

// إضافة المنتجات إلى السلة مع زيادة الكمية تلقائياً
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

// إزالة منتج بالكامل من السلة
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// تحديث العدادات والإجمالي في واجهة المستخدم
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
                    <small style="color: #a0a0a5;">${item.price} د.ل × ${item.quantity}</small>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">إزالة</button>
            </div>
        `;
    }).join('');

    cartCount.innerText = count;
    cartTotal.innerText = total;
}

// تجهيز الطلب وإرساله للواتساب بالتفاصيل والإجمالي
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("سلة التسوق فارغة حالياً!");
        return;
    }

    const phoneNumber = "218900000000"; // استبدله برقم هاتفك الدولي (بدون مفتاح + أو أصفار إضافية)
    let message = "مرحباً، أود طلب العطور التالية من المتجر:\n\n";
    
    cart.forEach(item => {
        message += `• *${item.name}* (الكمية: ${item.quantity}) - السعر: ${item.price * item.quantity} د.ل\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*الإجمالي الكلي:* ${total} د.ل`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// تشغيل جلب المنتجات فور تحميل الصفحة بالكامل
window.onload = displayProducts;
