// Constants and cache
const FAVORITES_STORAGE_KEYS = {
  FAVORITES: "calzemania_favorites",
};

const favoritesCache = {};
const favoritesProductCache = new Map();
const $favoritesModalHtml = $("html");

/**
 * Get current favorites from localStorage
 * @returns {Array} Array of favorite product IDs
 */
function getFavorites() {
  const favorites = localStorage.getItem(FAVORITES_STORAGE_KEYS.FAVORITES);
  return favorites ? JSON.parse(favorites) : [];
}

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of product IDs
 */
function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

/**
 * Add a product to favorites
 * @param {string} productId - The product ID to add
 * @returns {boolean} True if added, false if already in favorites
 */
function addFavorite(productId) {
  const favorites = getFavorites();
  if (!favorites.includes(productId)) {
    favorites.push(productId);
    saveFavorites(favorites);
    return true;
  }
  return false;
}

// Alias of addFavorite for backward compatibility
const addToFavorites = addFavorite;

/**
 * Remove a product from favorites
 * @param {string} productId - The product ID to remove
 * @returns {boolean} True if removed, false if not in favorites
 */
function removeFavorite(productId) {
  let favorites = getFavorites();
  if (favorites.includes(productId)) {
    favorites = favorites.filter((id) => id !== productId);
    saveFavorites(favorites);
    return true;
  }
  return false;
}

/**
 * Check if a product is in favorites
 * @param {string} productId - The product ID to check
 * @returns {boolean} True if in favorites, false otherwise
 */
function isFavorite(productId) {
  return getFavorites().includes(productId);
}

/**
 * Initialize DOM cache
 */
function initDOMCache() {
  // Clear any previous cache
  Object.keys(favoritesCache).forEach((key) => delete favoritesCache[key]);

  favoritesCache.$body = $("body");
  favoritesCache.$favoritesModal = $("#favorites-modal");
  favoritesCache.$favoritesModalContent = $("#favorites-modal-content");
}

/**
 * Get product by ID with caching
 * @param {string} id - Product ID
 * @returns {Object|undefined} Product object or undefined if not found
 */
function getProduct(id) {
  if (!favoritesProductCache.has(id)) {
    const product = products.find((p) => p.id === id);
    if (product) {
      favoritesProductCache.set(id, product);
    }
  }
  return favoritesProductCache.get(id);
}

/**
 * Update favorite states in the UI
 */
function updateFavoriteStates() {
  const favorites = getFavorites();

  // Create a Set for O(1) lookups instead of array.includes() which is O(n)
  const favoriteSet = new Set(favorites);

  // Update product cards
  $(".product-card-column").each(function () {
    const $thisCard = $(this);
    const productId = $thisCard.data("product-id");
    const $heartPath = $thisCard.find(".card-heart .heart-path");

    if (productId && $heartPath.length) {
      $heartPath.toggleClass("liked", favoriteSet.has(productId));
    }
  });

  // Update heart on the product details page
  const $productPageHeart = $(".column.is-half.pl-6-desktop .card-heart");
  if ($productPageHeart.length) {
    const productId = $productPageHeart.data("product-id");
    const $heartPath = $productPageHeart.find(".heart-path");

    if (productId && $heartPath.length) {
      $heartPath.toggleClass("liked", favoriteSet.has(productId));
    }
  }
}

/**
 * Update the favorites icon badge with current count
 */
function updateFavoritesIconBadge() {
  const favorites = getFavorites();
  const totalItems = favorites.length;
  const $favoriteIcons = $(".navbar .fa-heart").closest("a");

  $favoriteIcons.each(function () {
    const $iconLink = $(this);
    $iconLink.find(".badge-count").remove();

    if (totalItems > 0) {
      const $badge = $(`<span class="tag is-danger is-rounded badge-count">${totalItems}</span>`);
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
 * Ensure favorites modal exists in the DOM
 */
function ensureFavoritesModalExists() {
  if (favoritesCache.modalInitialized) return;

  // Initialize DOM cache
  initDOMCache();

  // Make sure body is available before proceeding
  if (!favoritesCache.$body || !favoritesCache.$body.length) {
    favoritesCache.$body = $("body");
    
    // If still not available, show an error and abort
    if (!favoritesCache.$body.length) {
      console.error("Body element not found in ensureFavoritesModalExists");
      return;
    }
  }

  // Create modal if it doesn't exist
  if (!favoritesCache.$favoritesModal?.length) {
    const modalHTML = generateFavoritesModalHTML();

    // Use DocumentFragment for better performance
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = modalHTML;
    favoritesCache.$body[0].appendChild(tempDiv.firstElementChild);

    // Re-select the added element
    favoritesCache.$favoritesModal = $("#favorites-modal");
    favoritesCache.$favoritesModalContent = $("#favorites-modal-content");
  }

  // Set up event handlers
  setupModalEvents();

  favoritesCache.modalInitialized = true;
}

/**
 * Set up event handlers for the favorites modal
 */
function setupModalEvents() {
  // Close button events
  favoritesCache.$favoritesModal.find(".modal-background, .delete").on("click", function (event) {
    event.preventDefault();
    closeFavoritesModal();
  });

  // Remove item button (using event delegation)
  favoritesCache.$favoritesModalContent.on("click", ".remove-favorite-button", function (event) {
    event.preventDefault();

    const $itemBox = $(this).closest(".box");
    const productId = $itemBox.data("product-id");

    if (!productId) return;

    if (removeFavorite(productId)) {
      // Fade out and remove
      $itemBox.fadeOut(300, function () {
        $(this).remove();

        // Check if modal is now empty
        if (favoritesCache.$favoritesModalContent.children().length === 0) {
          closeFavoritesModal();
          showToast("Your wishlist is now empty.", "fas fa-info-circle", "has-text-info");
        }
      });

      // Update all hearts with this product ID (including product page)
      updateHeartStates(productId, false);
      // Update favorites badge count
      updateFavoritesIconBadge();

      showToast("Product removed from wishlist.", "fas fa-heart-broken", "has-text-black");
    }
  });
}

/**
 * Update heart states for a specific product ID
 * @param {string} productId - The product ID to update
 * @param {boolean} isLiked - Whether the product should be marked as liked
 */
function updateHeartStates(productId, isLiked) {
  // Update product cards on shop and home page
  $(`.card-heart[data-product-id="${productId}"] .heart-path`).toggleClass("liked", isLiked);

  // Update product details page heart
  const $productPageHeart = $(".column.is-half.pl-6-desktop .card-heart");
  if ($productPageHeart.length && $productPageHeart.data("product-id") === productId) {
    $productPageHeart.find(".heart-path").toggleClass("liked", isLiked);
  }
}

/**
 * Populate the favorites modal with items
 */
function populateFavoritesModal() {
  ensureFavoritesModalExists();

  const favoriteIds = getFavorites();
  favoritesCache.$favoritesModalContent.empty();

  // Create document fragment for batch DOM updates
  const fragment = document.createDocumentFragment();

  // Get and sort favorite products
  const favoriteProducts = favoriteIds.map((id) => getProduct(id)).filter(Boolean); // Filter out undefined products

  favoriteProducts.forEach((product) => {
    const itemHTML = generateFavoriteProductItemHTML(product);

    // Add to document fragment
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = itemHTML;
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
  });

  // Single DOM update
  favoritesCache.$favoritesModalContent[0].appendChild(fragment);
}

/**
 * Open the favorites modal
 */
function openFavoritesModal() {
  ensureFavoritesModalExists();

  const favoriteIds = getFavorites();

  if (favoriteIds.length === 0) {
    showToast("Your wishlist is empty.", "fas fa-info-circle", "has-text-info");
    return;
  }

  populateFavoritesModal();

  if (favoritesCache.$favoritesModal?.length) {
    favoritesCache.$favoritesModal.addClass("is-active");
    $favoritesModalHtml.addClass("is-clipped");
  }
}

/**
 * Close the favorites modal
 */
function closeFavoritesModal() {
  if (favoritesCache.$favoritesModal?.length) {
    favoritesCache.$favoritesModal.removeClass("is-active");
    $favoritesModalHtml.removeClass("is-clipped");
  }
}

/**
 * Initialize global interactions (navbar buttons)
 */
function initGlobalInteractions() {
  const $navbarHeartLink = $(".navbar .navbar-end .navbar-item .fa-heart").closest("a");

  if ($navbarHeartLink.length) {
    $navbarHeartLink.on("click", function (event) {
      event.preventDefault();
      openFavoritesModal();
    });
  }

  ensureFavoritesModalExists();
  updateFavoritesIconBadge(); // Initialize badge count on page load
}

/**
 * Initialize product interactions (heart buttons, arrows)
 */
function initInteractions() {
  const $body = $("body");

  // Heart click handler
  $body.off("click.cardHeart").on("click.cardHeart", ".card-heart", handleHeartClick);

  // Arrow click handler for image carousel
  $body.off("click.cardArrow").on("click.cardArrow", ".card-arrow", handleArrowClick);
}

/**
 * Handle heart icon click
 * @param {Event} event - The click event
 */
function handleHeartClick(event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  const $heartIcon = $(this);
  let productId = $heartIcon.data("product-id");

  // Try to find product ID from parent
  if (!productId) {
    const $cardColumn = $heartIcon.closest(".product-card-column");
    productId = $cardColumn.data("product-id");
  }

  if (!productId) {
    console.error("Product ID not found.");
    return;
  }

  // Prevent multiple rapid clicks
  if ($heartIcon.data("processing")) return;
  $heartIcon.data("processing", true);

  const $heartPath = $heartIcon.find("svg .heart-path");

  if ($heartPath.length === 0) {
    console.error("Heart path SVG element not found.");
    $heartIcon.data("processing", false);
    return;
  }

  // Toggle favorite state
  if (!$heartPath.hasClass("liked")) {
    // Add to favorites with animation
    animateHeartAdd($heartPath, productId, $heartIcon);
  } else {
    // Remove from favorites
    if (removeFavorite(productId)) {
      // Update all hearts with this product ID
      updateHeartStates(productId, false);
      // Update favorites badge count
      updateFavoritesIconBadge();

      showToast(
        "You have succesfully removed the product from your wishlist.",
        "fas fa-heart-broken",
        "has-text-black"
      );
    }
    $heartIcon.data("processing", false);
  }
}

/**
 * Animate heart when adding to favorites
 * @param {jQuery} $heartPath - Heart path element
 * @param {string} productId - Product ID
 * @param {jQuery} $heartIcon - Heart icon element
 */
function animateHeartAdd($heartPath, productId, $heartIcon) {
  gsap.to($heartPath[0], {
    scale: 1.3,
    duration: 0.2,
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut",
    transformOrigin: "center center",
    onComplete: () => {
      if (addFavorite(productId)) {
        // Update all hearts with this product ID
        updateHeartStates(productId, true);
        // Update favorites badge count
        updateFavoritesIconBadge();

        gsap.set($heartPath[0], { scale: 1 }); // Reset scale
        showToast("You have successfully added a product to your wishlist!", "fas fa-heart", "has-text-red");
      }
      $heartIcon.data("processing", false);
    },
    onInterrupt: () => {
      $heartIcon.data("processing", false);
    },
  });
}

/**
 * Handle image carousel arrow click
 * @param {Event} event - The click event
 */
function handleArrowClick(event) {
  event.preventDefault();
  event.stopPropagation();

  const $arrow = $(this);
  const $cardImageDiv = $arrow.closest(".card-image");
  const images = $cardImageDiv.data("images");
  const $imgElement = $cardImageDiv.find("figure img");

  // Validate data
  if (!images || !Array.isArray(images) || images.length === 0 || !$imgElement.length) {
    return;
  }

  // Get current index with fallback
  let currentIndex = parseInt($cardImageDiv.data("current-index"), 10);
  if (isNaN(currentIndex)) currentIndex = 0;

  // Calculate new index
  const isRightArrow = $arrow.hasClass("arrow-right");
  const newIndex = isRightArrow
    ? (currentIndex + 1) % images.length
    : (currentIndex - 1 + images.length) % images.length;

  // Update image
  const imagePath = images[newIndex].startsWith("../") ? images[newIndex].replace("../", "./") : images[newIndex];

  $imgElement.attr("src", imagePath);
  $cardImageDiv.data("current-index", newIndex);
}
