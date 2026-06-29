function displayProducts(productsToRender) {
    const menContainer = document.getElementById('products-men-container');
    const womenContainer = document.getElementById('products-women-container');
    
    if (!menContainer || !womenContainer) return;
    
    menContainer.innerHTML = '';
    womenContainer.innerHTML = '';

    productsToRender.forEach(product => {
        const isOutOfStock = product.stock === 0 || product.stock === "نَفَدَ المَخْزُون";
        
        const cardHtml = `
            <div class="product-card">
                <span class="stock-status ${isOutOfStock ? 'out' : 'available'}">
                    ${isOutOfStock ? 'نفد المخزون' : `متوفر (${product.stock})`}
                </span>
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://images.unsplash.com/photo-1541643600914-78b084683601?w=300'">
                <div class="product-brand">${product.brand || ''}</div>
                <h3>${product.title}</h3>
                <div class="price">${product.price} د.ل</div>
                <button class="add-to-cart-btn ${isOutOfStock ? 'disabled' : ''}" 
                        onclick="addToCart(${product.id})" 
                        ${isOutOfStock ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${isOutOfStock ? 'نفد المخزون' : 'إضافة للسلة'}
                </button>
            </div>
        `;

        // توزيع المنتجات حسب القسم تلقائياً كالصورة
        if (product.category === 'men') {
            menContainer.innerHTML += cardHtml;
        } else if (product.category === 'women') {
            womenContainer.innerHTML += cardHtml;
        } else {
            // المنتجات المشتركة تظهر في القسمين
            menContainer.innerHTML += cardHtml;
            womenContainer.innerHTML += cardHtml;
        }
    });
}
