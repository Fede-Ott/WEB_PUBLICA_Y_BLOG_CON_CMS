function generateProductCard(product) {
  // Check if product.images exists and has at least one image
  const imagePath =
    product.images && product.images.length > 0
      ? // Use the first image and adjust the path relative to the root
        product.images[0].replace("../", "./")
      : // Fallback to a placeholder if no images are available
        "./assets/images/placeholder.webp";

  return `
    <div class="column is-full-mobile is-one-quarter-tablet product-card-column" data-product-id="${product.id}">
      <div class="card p-3 has-background-white product-card-container">
        <!-- Heart icon positioned outside the main link -->
        <a class="card-heart" data-product-id="${product.id}">
          <svg class="heart-svg" viewBox="0 0 24 24" width="24" height="24">
            <path
              class="heart-path"
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </a>
        
        <!-- Main product link -->
        <a href="product.html?id=${product.id}" class="product-link">
          <div class="card-image p-5">
            <figure class="image is-3by4">
              <img src="${imagePath}" alt="${product.name}" />
            </figure>
          </div>
          <footer class="card-footer p-4">
            <div class="is-flex is-flex-direction-row is-justify-content-space-between" style="width: 100%">
              <p class="has-text-black has-text-weight-bold">${product.name}</p>
              <p class="has-text-black">${product.price}</p>
            </div>
          </footer>
        </a>
      </div>
    </div>
  `;
}
