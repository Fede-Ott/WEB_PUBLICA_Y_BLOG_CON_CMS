function generateCartItemHTML(item, product) {
  // Use the first image from the product data, adjust path relative to root
  const imagePath =
    product.images && product.images.length > 0
      ? product.images[0].replace("../", "./")
      : "./assets/images/placeholder.png";

  // Calculate item total price
  const pricePerItem = parseFloat(product.price.replace("€", "").replace(",", "."));
  const itemTotalPrice = (pricePerItem * item.quantity).toFixed(2).replace(".", ",");

  return `
    <div class="cart-item mb-4" data-product-id="${item.productId}" data-size="${item.size}">
      <article class="media is-align-items-center">
        <div class="media-left">
          <figure class="image is-64x64">
            <img src="${imagePath}" alt="${product.name}">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p class="has-text-black mb-1">
              <strong class="has-text-black">${product.name}</strong>
            </p>
            <p class="has-text-grey is-size-7 mb-2">
              Size: ${item.size}
            </p>
            <p class="has-text-black is-size-7">
              ${item.quantity} x <span class="has-text-red has-text-weight-medium">${product.price}</span>
            </p>
          </div>
        </div>
        <div class="media-right">
          <button class="delete is-medium remove-cart-item-button" aria-label="Remove item"></button>
        </div>
      </article>
    </div>
  `;
}
