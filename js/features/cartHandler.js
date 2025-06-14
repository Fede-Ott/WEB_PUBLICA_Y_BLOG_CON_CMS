// Constants and cache
const STORAGE_KEYS = {
  CART: "calzemania_cart",
};

const $html = $("html");
// Initialize domCache as an empty object to prevent undefined errors
const domCache = {
  $cartModal: null,
  $cartItemsContainer: null,
  $cartSubtotal: null,
  $cartEmptyMessage: null,
  cartModalInitialized: false
};
const productCache = new Map();

/**
 * Get the current cart from localStorage
 * @returns {Array} Array of cart items with productId, size, and quantity
 */
function getCart() {
  const cart = localStorage.getItem(STORAGE_KEYS.CART);
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 * @param {Array} cart - The cart array to save
 */
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

/**
 * Find the index of an item in the cart by productId and size
 * @param {string} productId - The product ID
 * @param {string} size - The product size
 * @returns {number} The index of the item or -1 if not found
 */
function findCartItemIndex(productId, size) {
  const cart = getCart();
  return cart.findIndex((item) => item.productId === productId && item.size === size);
}

/**
 * Get a product by ID using caching for better performance
 * @param {string} productId - The product ID
 * @returns {Object|null} The product or null if not found
 */
function getProduct(productId) {
  if (!productCache.has(productId)) {
    const product = products.find((p) => p.id === productId);
    if (product) {
      productCache.set(productId, product);
    } else {
      return null;
    }
  }
  return productCache.get(productId);
}

/**
 * Parse price string to number
 * @param {string|number} price - Price as string (€10,99) or number
 * @returns {number} Parsed price
 */
function parsePrice(price) {
  if (typeof price === "number") return price;
  return parseFloat(String(price).replace("€", "").replace(",", "."));
}

/**
 * Format price for display
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
  return `${price.toFixed(2).replace(".", ",")}€`;
}

/**
 * Add a product to the cart
 * @param {string} productId - The product ID
 * @param {string} size - The product size
 * @param {number} quantity - The quantity to add
 * @returns {boolean} Success or failure
 */
function addToCart(productId, size, quantity) {
  // Validate inputs
  if (!size) {
    showToast("Please select a size first.", "fas fa-exclamation-triangle", "has-text-warning");
    return false;
  }
  if (quantity <= 0) {
    showToast("Please select a quantity greater than zero.", "fas fa-exclamation-triangle", "has-text-warning");
    return false;
  }

  // Get product
  const product = getProduct(productId);
  if (!product) {
    console.error("Product not found for adding to cart:", productId);
    showToast("Error adding product to cart.", "fas fa-times-circle", "has-text-danger");
    return false;
  }

  // Update cart
  const cart = getCart();
  const existingItemIndex = findCartItemIndex(productId, size);

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
    cart.push({ productId, size, quantity });
  }

  // Save and update UI
  saveCart(cart);
  showToast(`${product.name} (Size: ${size}) added to cart!`, "fas fa-check-circle", "has-text-success");
  updateCartIconBadge();
  return true;
}

/**
 * Remove an item from the cart
 * @param {string} productId - The product ID
 * @param {string} size - The product size
 * @returns {boolean} Success or failure
 */
function removeFromCart(productId, size) {
  let cart = getCart();
  const itemIndex = findCartItemIndex(productId, size);

  if (itemIndex === -1) return false;

  const removedItem = cart.splice(itemIndex, 1)[0];
  saveCart(cart);

  const product = getProduct(removedItem.productId);
  if (product) {
    showToast(`${product.name} (Size: ${removedItem.size}) removed from cart.`, "fas fa-trash", "has-text-black");
  }

  updateCartIconBadge();
  return true;
}

/**
 * Calculate the total cart value
 * @returns {number} The total cart value
 */
function calculateCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    const product = getProduct(item.productId);
    if (!product) return total;

    const price = parsePrice(product.price);
    if (isNaN(price)) return total;

    return total + price * item.quantity;
  }, 0);
}

/**
 * Initialize DOM cache for cart modal elements
 */
function initDOMCache() {
  // Find cart modal in DOM
  domCache.$cartModal = $("#cart-modal");
  
  // Get child elements if modal exists
  if (domCache.$cartModal && domCache.$cartModal.length > 0) {
    domCache.$cartItemsContainer = $("#cart-modal .cart-items-container");
    domCache.$cartSubtotal = $("#cart-modal #cart-subtotal");
    domCache.$cartEmptyMessage = $("#cart-modal .cart-empty-message");
  }
}

/**
 * Ensure the cart modal exists in the DOM
 */
function ensureCartModalExists() {
  // Return early if already initialized
  if (domCache.cartModalInitialized) return true;

  try {
    // Initialize DOM cache to get any existing elements
    initDOMCache();
    
    // Add modal if it doesn't exist
    if (!domCache.$cartModal || domCache.$cartModal.length === 0) {
      
      // Generate HTML and add to body
      const modalHTML = generateCartModalHTML();
      $("body").append(modalHTML);
      
      // Re-select the modal
      domCache.$cartModal = $("#cart-modal");
      
      // Re-initialize cache to get the new elements
      if (domCache.$cartModal.length > 0) {
        domCache.$cartItemsContainer = $("#cart-modal .cart-items-container");
        domCache.$cartSubtotal = $("#cart-modal #cart-subtotal");
        domCache.$cartEmptyMessage = $("#cart-modal .cart-empty-message");
      }
    }
    
    // If we don't have required elements, create them
    const needToCreateElements = !domCache.$cartItemsContainer || 
                               !domCache.$cartSubtotal || 
                               domCache.$cartItemsContainer.length === 0 ||
                               domCache.$cartSubtotal.length === 0;
                               
    if (domCache.$cartModal && domCache.$cartModal.length > 0 && needToCreateElements) {
      
      const $boxElement = domCache.$cartModal.find(".box");
      
      // Create items container if needed
      if (!domCache.$cartItemsContainer || domCache.$cartItemsContainer.length === 0) {
        const $container = $('<div class="cart-items-container mb-5"></div>');
        const $emptyMsg = $('<p class="has-text-centered cart-empty-message">Your cart is empty.</p>');
        $container.append($emptyMsg);
        
        // Add it to the modal
        if ($boxElement.length > 0) {
          // Try to find a good insertion point
          const $header = $boxElement.find("header");
          if ($header.length > 0) {
            $header.after($container);
          } else {
            $boxElement.prepend($container);
          }
        } else {
          // Fallback
          domCache.$cartModal.find(".modal-content").append($container);
        }
        
        // Update reference
        domCache.$cartItemsContainer = $("#cart-modal .cart-items-container");
        domCache.$cartEmptyMessage = $("#cart-modal .cart-empty-message");
      }
      
      // Create subtotal if needed
      if (!domCache.$cartSubtotal || domCache.$cartSubtotal.length === 0) {
        const $subtotalDiv = $('<div class="is-flex is-justify-content-space-between is-align-items-center mb-5"><p class="has-text-weight-bold has-text-black">Subtotal</p><p class="has-text-weight-bold has-text-black" id="cart-subtotal">0.00€</p></div>');
        
        if ($boxElement.length > 0) {
          $boxElement.append($subtotalDiv);
        } else {
          domCache.$cartModal.find(".modal-content").append($subtotalDiv);
        }
        
        // Update reference
        domCache.$cartSubtotal = $("#cart-modal #cart-subtotal");
      }
    }
    
    // Final verification
    const allElementsExist = domCache.$cartModal && 
                          domCache.$cartItemsContainer && 
                          domCache.$cartSubtotal &&
                          domCache.$cartModal.length > 0 && 
                          domCache.$cartItemsContainer.length > 0 && 
                          domCache.$cartSubtotal.length > 0;
    
    if (allElementsExist) {
      // Set up events
      setupCartModalEvents();
      domCache.cartModalInitialized = true;
      return true;
    } else {
      console.error("Cart modal elements still missing after creation attempts:", {
        modal: domCache.$cartModal?.length > 0,
        container: domCache.$cartItemsContainer?.length > 0,
        subtotal: domCache.$cartSubtotal?.length > 0
      });
      return false;
    }
  } catch (error) {
    console.error("Error creating cart modal:", error);
    return false;
  }
}

/**
 * Set up event handlers for cart modal
 */
function setupCartModalEvents() {
  // Close button events
  domCache.$cartModal.find(".modal-background, .cart-close-button").on("click", function (event) {
    event.preventDefault();
    closeCartModal();
  });

  // Remove item button (using event delegation)
  domCache.$cartItemsContainer.on("click", ".remove-cart-item-button", function (event) {
    event.preventDefault();
    const $itemElement = $(this).closest(".cart-item");
    const productId = $itemElement.data("product-id");
    const size = $itemElement.data("size");

    if (productId && size && removeFromCart(productId, size)) {
      populateCartModal();
    }
  });

  // Checkout button
  domCache.$cartModal.find(".checkout-button").on("click", function (event) {
    event.preventDefault();
    window.location.href = "checkout.html";
  });
}

/**
 * Populate the cart modal with items
 */
function populateCartModal() {
  ensureCartModalExists();

  const cart = getCart();
  domCache.$cartItemsContainer.find(".cart-item").remove();

  // Handle empty cart
  if (cart.length === 0) {
    domCache.$cartEmptyMessage.show();
    domCache.$cartSubtotal.text(formatPrice(0));
    return;
  }

  // Show items
  domCache.$cartEmptyMessage.hide();
  let subtotal = 0;

  // Use DocumentFragment for better performance
  const fragment = document.createDocumentFragment();

  cart.forEach((item) => {
    const product = getProduct(item.productId);
    if (!product) {
      console.warn(`Product with ID ${item.productId} not found for cart item.`);
      return;
    }

    // Create cart item element
    const itemHTML = generateCartItemHTML(item, product);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = itemHTML;

    // Add to fragment
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    // Add to subtotal
    const price = parsePrice(product.price);
    subtotal += price * item.quantity;
  });

  // Single DOM update for better performance
  domCache.$cartItemsContainer[0].appendChild(fragment);
  domCache.$cartSubtotal.text(formatPrice(subtotal));
}

/**
 * Open the cart modal
 */
function openCartModal() {
  ensureCartModalExists();
  populateCartModal();

  if (domCache.$cartModal?.length) {
    domCache.$cartModal.addClass("is-active");
    $html.addClass("is-clipped");
  }
}

/**
 * Close the cart modal
 */
function closeCartModal() {
  if (domCache.$cartModal?.length) {
    domCache.$cartModal.removeClass("is-active");
    $html.removeClass("is-clipped");
  }
}

/**
 * Update the cart icon badge with current quantity
 */
function updateCartIconBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const $cartIcons = $(".navbar .fa-shopping-cart").closest("a");

  $cartIcons.each(function () {
    const $iconLink = $(this);
    $iconLink.find(".cart-badge").remove();

    if (totalItems > 0) {
      const $badge = $(`<span class="tag is-danger is-rounded cart-badge">${totalItems}</span>`);
      $badge.css({
        position: "absolute",
        top: "-5px",
        right: "-5px",
        fontSize: "0.7rem",
        height: "1.2em",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
        lineHeight: "1.2em",
      });
      $iconLink.css("position", "relative");
      $iconLink.append($badge);
    }
  });
}

/**
 * Initialize cart interactions
 */
function initCartInteractions() {
  // Add event listener using event delegation
  $(".navbar").on("click", "a:has(.fa-shopping-cart)", function (event) {
    event.preventDefault();
    openCartModal();
  });

  // Ensure cart modal exists and update badge
  ensureCartModalExists();
  updateCartIconBadge();
}
