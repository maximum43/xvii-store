let allProducts = [];
let cart = [];

// جلب المنتجات الفعليّة من ملف الـ JSON
document.addEventListener("DOMContentLoaded", () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(allProducts);
        })
        .catch(err => console.error("خطأ في جلب ملف المنتجات:", err));
});

// عرض المنتجات بالهيكل الجديد المتناسق مع الهاتف
function displayProducts(products) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        
        // وسم "الأكثر مبيعاً" الافتراضي كالموجود بالصورة لعطر ديور كمثال
        const bestSellerBadge = product.bestSeller ? `<div class="badge-best">الأكثر مبيعاً</div>` : '';

        card.innerHTML = `
            ${bestSellerBadge}
            <div class="img-container">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <span class="brand-name">${product.brand}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} د.ل</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    + أضف للسلة
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// التحكم بالأزرار الدائرية (Tabs) وفلترة الأقسام
function filterCategory(category, buttonElement) {
    // تبديل الفئة النشطة بصرياً بين الأزرار
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    buttonElement.classList.add('active');

    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filtered = allProducts.filter(p => p.category === category);
        displayProducts(filtered);
    }
}

// فتح وإغلاق السلة
function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("open");
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById("cart-items-container");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartCount.innerText = cart.reduce((acc, item) => acc + item.qty, 0);

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-msg">سلة مشترياتك فارغة</p>';
        cartTotal.innerText = "0";
        return;
    }

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty;
        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price} د.ل × ${item.qty}</p>
            </div>
            <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
        `;
        cartContainer.appendChild(itemEl);
    });

    cartTotal.innerText = total;
}

// إرسال البيانات المنسقة مباشرة للواتساب
function sendToWhatsApp() {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const notes = document.getElementById("customer-notes").value.trim();

    if (!name || !phone || !address) {
        alert("الرجاء ملء حقول الاسم، الهاتف، والعنوان أولاً!");
        return;
    }

    if (cart.length === 0) {
        alert("سلتك فارغة تماماً!");
        return;
    }

    let message = `*طلب جديد من متجر XVII PERFUMES* 🛍️\n\n`;
    message += `👤 *الاسم بالكامل :* ${name}\n`;
    message += `📞 *رقم الهاتف :* ${phone}\n`;
    message += `📍 *العنوان :* ${address}\n`;
    if(notes) message += `📝 *ملاحظات أخرى :* ${notes}\n`;
    message += `\n*المنتجات المطلوبة:*\n`;

    let total = 0;
    cart.forEach(item => {
        message += `- ${item.name} (العدد: ${item.qty}) -> ${item.price * item.qty} د.ل\n`;
        total += item.price * item.qty;
    });

    message += `\n💰 *المجموع الكلي:* ${total} د.ل`;

    // استبدل هذا الرقم الافتراضي برقم هاتفك الحقيقي (مع رمز الدولة بدون أصفار في البداية)
    const myWhatsAppNumber = "218900000000"; 
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${myWhatsAppNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}
