function generateFavoriteProductItemHTML(product) {
  // Use the first image from the images array, adjust path relative to root
  const imagePath =
    product.images && product.images.length > 0
      ? product.images[0].replace("../", "./")
      : "./assets/images/placeholder.webp";

  return `
    <div class="box has-background-white mb-4" data-product-id="${product.id}">
      <article class="media is-align-items-center">
        <div class="media-left">
          <figure class="image is-64x64">
            <img src="${imagePath}" alt="${product.name}">
          </figure>
        </div>
        <div class="media-content">
          <div class="content">
            <p class="has-text-black">
              <strong class="has-text-black">${product.name}</strong>
              <br>
              ${product.price}
            </p>
          </div>
        </div>
        <div class="media-right">
          <button class="button is-danger is-small remove-favorite-button" aria-label="Remove from favorites">
            <span class="icon is-small">
              <i class="fas fa-trash"></i>
            </span>
            <span>Delete</span>
          </button>
        </div>
      </article>
    </div>
  `;
}
