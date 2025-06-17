function generateOrderSummaryItemHTML(item, product) {
  const price =
    typeof product.price === "string" ? parseFloat(product.price.replace("€", "").replace(",", ".")) : product.price;

  const imagePath =
    product.images && product.images.length > 0
      ? product.images[0].replace(/^\.\.\//, "./")
      : "../assets/images/placeholder.webp";

  if (isNaN(price)) {
    console.warn(`Invalid price for product ID ${item.productId}:`, product.price);
    return "";
  }

  return `
    <div class="media order-summary-item mb-3" data-product-id="${item.productId}" data-size="${item.size}">
        <div>
            <figure class="image is-64x64 mr-5">
                <img src="${imagePath}" alt="${product.name}">
            </figure>
        </div>
        <div class="media-content">
            <p class="is-size-6 has-text-weight-bold has-text-black">${product.name}</p>
            ${item.size ? `<p class="is-size-7 has-text-black">Size: ${item.size}</p>` : ""}
            <p class="is-size-7 has-text-black">${item.quantity} x €${price.toFixed(2)}</p>
        </div>
        <div class="media-right">
            <button class="delete is-medium remove-cart-item-button" aria-label="Remove item"></button>
        </div>
    </div>
  `;
}
