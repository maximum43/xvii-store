let allProducts = [];
let cart = [];

// جلب المنتجات من ملف JSON عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            allProducts = data;
            displayProducts(allProducts);
        })
        .catch(err => console.error("خطأ في تحميل العطور:", err));
});

// عرض المنتجات في الصفحة
function displayProducts(products) {
    const container = document.getElementById("products-container");
    container.innerHTML = "";

    products.forEach(product => {
        const isOutOfStock = product.stock === 0;
        const stockText = isOutOfStock ? '<p class="out-of-stock-tag">نفد المخزون</p>' : `<p class="stock-tag">متوفر (${product.stock})</p>`;
        
        const card = document.createElement("div");
        card.className = "product-card";
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${product.price} د.ل</p>
            ${stockText}
            <button class="add-to-cart-btn" ${isOutOfStock ? 'disabled' : ''} onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-basket"></i> إضافة للسلة
            </button>
        `;
        container.appendChild(card);
    });
}

// تصفية المنتجات (رجالي / نسائي)
function filterCategory(category) {
    const filtered = allProducts.filter(p => p.category === category);
    displayProducts(filtered);
}

// فتح وإغلاق السلة
function toggleCart() {
    document.getElementById("cartSidebar").classList.toggle("open");
}

// إضافة منتج للسلة
function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        if (cartItem.qty < product.stock) {
            cartItem.qty++;
        } else {
            alert("عذراً، لقد تجاوزت الكمية المتاحة في المخزون!");
            return;
        }
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
}

// حذف عنصر من السلة
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
}

// تحديث واجهة السلة والعداد والمجموع
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

// إرسال الطلب عبر الواتساب
function sendToWhatsApp() {
    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();
    const notes = document.getElementById("customer-notes").value.trim();

    if (!name || !phone || !address) {
        alert("الرجاء ملء حقول الاسم، الهاتف، والعنوان لإتمام الطلب.");
        return;
    }

    if (cart.length === 0) {
        alert("سلتك فارغة! أضف بعض العطور أولاً.");
        return;
    }

    // تجهيز نص الرسالة للواتساب
    let message = `*طلب جديد من متجر XVII PERFUMES* 🛍️\n\n`;
    message += `👤 *الاسم:* ${name}\n`;
    message += `📞 *الهاتف:* ${phone}\n`;
    message += `📍 *الموقع:* ${address}\n`;
    if(notes) message += `📝 *ملاحظات:* ${notes}\n`;
    message += `\n*المنتجات المطلوبة:*\n`;

    let total = 0;
    cart.forEach(item => {
        message += `- ${item.name} (العدد: ${item.qty}) -> ${item.price * item.qty} د.ل\n`;
        total += item.price * item.qty;
    });

    message += `\n💰 *المجموع الكلي:* ${total} د.ل`;

    // رقم هاتف متجرك بالصيغة الدولية (مثال لرقم ليبي: 218xxxxxxxx)
    const myWhatsAppNumber = "2189112775"; 
    
    // فتح رابط الواتساب
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${myWhatsAppNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

