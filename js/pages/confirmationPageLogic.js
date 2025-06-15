// Add billing and payment keys to the existing STORAGE_KEYS from cartHandler.js
// We use the existing STORAGE_KEYS instead of redeclaring it
if (STORAGE_KEYS) {
  STORAGE_KEYS.BILLING = "checkout_billing_data";
  STORAGE_KEYS.PAYMENT = "checkout_payment_data";
}

// DOM cache for this page specifically
// Use a different name to avoid conflicts with other modules
const confirmationDomCache = {};

// Number of recommended products to show
const NUM_RECOMMENDED_PRODUCTS = 4;

/**
 * Initialize the confirmation page
 */
function initConfirmationPage() {
  // Clear cache on initialization
  Object.keys(confirmationDomCache).forEach((key) => delete confirmationDomCache[key]);

  // Cache DOM elements
  cacheElements();

  // Perform initialization tasks
  clearOrderData();
  updateCartIconBadge();
  generateRandomRecommendedProducts();
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
  confirmationDomCache.$recommendedProductsContainer = $(".columns.is-multiline.is-mobile.is-centered.mt-6");
}

/**
 * Clear all order-related data from localStorage
 */
function clearOrderData() {
  // Use a single function to clear all related data
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
}

/**
 * Generate random recommended products from the products array
 */
function generateRandomRecommendedProducts() {
  // Get a container for the products
  const $container = confirmationDomCache.$recommendedProductsContainer;

  if (!$container || !$container.length) {
    console.warn("Recommended products container not found");
    return;
  }

  // Clear existing product cards
  $container.empty();

  // Get random products from the products array
  const randomProducts = getRandomProducts(NUM_RECOMMENDED_PRODUCTS);

  // Create product cards - don't wrap in another div, use the HTML directly
  randomProducts.forEach((product) => {
    // The generateProductCard function already includes the column div,
    // so we can append its result directly
    $container.append(generateProductCard(product));
  });

  // Update favorite states for the new cards
  updateFavoriteStates();
}

/**
 * Get a specified number of random products from the products array
 * @param {number} count - Number of random products to get
 * @returns {Array} Array of random product objects
 */
function getRandomProducts(count) {
  // Create a copy of products array to avoid modifying the original
  const productsCopy = [...products];

  // Shuffle the array using Fisher-Yates algorithm
  for (let i = productsCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
  }

  // Return the first 'count' products or all if less than count
  return productsCopy.slice(0, Math.min(count, productsCopy.length));
}
