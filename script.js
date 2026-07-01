// --- المتغيرات الأساسية ---
let products = JSON.parse(localStorage.getItem('parfum_products')) || [
    // عطور افتراضية للعرض المبدئي
    { id: 1, name: 'خمرة قهوة', price: 155, category: 'مشترك', image: 'https://via.placeholder.com/150/8B4513/FFFFFF?text=Khamrah' },
    { id: 2, name: 'Ajuad', price: 135, category: 'نسائي', image: 'https://via.placeholder.com/150/FFD700/000000?text=Ajuad' }
];

let cart = JSON.parse(localStorage.getItem('parfum_cart')) || [];

// --- دوال واجهة المستخدم (الرئيسية) ---

// فتح وإغلاق القائمة الجانبية
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if(sidebar) {
        sidebar.classList.toggle('active');
        overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    }
}

// عرض المنتجات
function renderProducts(categoryFilter = 'الكل') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    const filtered = categoryFilter === 'الكل' ? products : products.filter(p => p.category === categoryFilter);
    
    filtered.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="product-price">${product.price} د.ل</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">أضف <i class="fa-solid fa-bag-shopping"></i></button>
            </div>
        `;
    });
}

// تصفية العطور حسب الفئة
function filterCategory(category) {
    renderProducts(category);
    toggleMenu(); // إغلاق القائمة الجانبية إذا كانت مفتوحة
}

// --- دوال سلة المشتريات ---

function toggleCart() {
    const modal = document.getElementById('cart-modal');
    if(modal) {
        modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
        renderCart();
    }
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('parfum_cart', JSON.stringify(cart));
    updateCartCount();
    alert('تمت الإضافة إلى السلة!');
}

function updateCartCount() {
    const countSpan = document.getElementById('cart-count');
    if(countSpan) countSpan.innerText = cart.length;
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutForm = document.getElementById('checkout-form');
    
    cartItems.innerHTML = '';
    let total = 0;

    if(cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; padding:20px;">سلتك فارغة حالياً.</p>';
        checkoutBtn.style.display = 'none';
        checkoutForm.style.display = 'none';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>${item.price} د.ل</span>
                    <i class="fa-solid fa-trash" style="color:red; cursor:pointer;" onclick="removeFromCart(${index})"></i>
                </div>
            `;
        });
        
        // تطبيق خصم 10%
        let discountedTotal = total - (total * 0.10);
        checkoutBtn.style.display = 'block';
    }
    
    totalPrice.innerText = total > 0 ? (total - (total * 0.10)).toFixed(2) : 0;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('parfum_cart', JSON.stringify(cart));
    updateCartCount();
    renderCart();
}

function showCheckoutForm() {
    document.getElementById('checkout-btn').style.display = 'none';
    document.getElementById('checkout-form').style.display = 'block';
}

function submitOrder() {
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    
    if(!name || !phone || !address) {
        alert('الرجاء تعبئة جميع الحقول الإلزامية');
        return;
    }

    // هنا يتم إرسال الطلب (يمكن ربطها لاحقاً بـ WhatsApp أو Email)
    alert(`شكراً لك ${name}! تم استلام طلبك بنجاح وسيتم التواصل معك قريباً.`);
    
    // تفريغ السلة
    cart = [];
    localStorage.setItem('parfum_cart', JSON.stringify(cart));
    updateCartCount();
    toggleCart();
    document.getElementById('checkout-form').style.display = 'none';
}


// --- دوال لوحة التحكم (Admin) ---

function checkPassword() {
    const pass = document.getElementById('admin-password').value;
    if (pass === '17782') {
        document.getElementById('admin-login').style.display = 'none';
        document.getElementById('admin-dashboard').style.display = 'block';
        renderAdminProducts();
    } else {
        alert('كلمة المرور خاطئة!');
    }
}

// دالة تحويل الصورة المرفوعة إلى نص Base64 ليتم حفظها في LocalStorage
function getBase64(file, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(file);
}

function addProduct() {
    const name = document.getElementById('prod-name').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const category = document.getElementById('prod-category').value;
    const imageFile = document.getElementById('prod-image').files[0];

    if (!name || !price || !imageFile) {
        alert('الرجاء تعبئة كافة البيانات واختيار صورة');
        return;
    }

    getBase64(imageFile, (base64Image) => {
        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            category: category,
            image: base64Image // الصورة الآن محفوظة كنص
        };
        
        products.push(newProduct);
        localStorage.setItem('parfum_products', JSON.stringify(products));
        alert('تمت إضافة العطر بنجاح!');
        
        // تفريغ الحقول
        document.getElementById('prod-name').value = '';
        document.getElementById('prod-price').value = '';
        document.getElementById('prod-image').value = '';
        
        renderAdminProducts();
    });
}

function renderAdminProducts() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;
    
    list.innerHTML = '';
    products.forEach(product => {
        list.innerHTML += `
            <div class="admin-product-item">
                <span>${product.name} - ${product.price} د.ل</span>
                <button class="delete-btn" onclick="deleteProduct(${product.id})">حذف</button>
            </div>
        `;
    });
}

function deleteProduct(id) {
    if(confirm('هل أنت متأكد من حذف هذا العطر؟')) {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('parfum_products', JSON.stringify(products));
        renderAdminProducts();
    }
}

// التهيئة عند تحميل الصفحة
window.onload = () => {
    updateCartCount();
    renderProducts();
};
