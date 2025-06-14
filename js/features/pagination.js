// Constants
const ITEMS_PER_PAGE = 16;

// DOM cache
const paginationCache = {};
// Variable to store the products passed to initPagination
let paginationProducts = [];

/**
 * Initialize pagination for products
 * @param {Array} products - Array of product objects
 */
function initPagination(products) {
  // Store products reference for pagination functions
  paginationProducts = products || [];
  
  // Clear previous cache
  Object.keys(paginationCache).forEach((key) => delete paginationCache[key]);

  // Cache DOM elements
  cacheElements();

  if (!validateElements()) {
    console.warn("Pagination container or product grid not found.");
    return;
  }

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Handle no products case
  if (totalItems === 0) {
    displayNoProductsMessage();
    return;
  }

  // Set up event handlers
  setupEventHandlers(totalPages);

  // Load initial page
  loadPageContent(1, true);
}

/**
 * Cache DOM elements for better performance
 */
function cacheElements() {
  paginationCache.$paginationContainer = $(".pagination-container");
  paginationCache.$productGrid = $("#product-grid");
  paginationCache.$paginationList = paginationCache.$paginationContainer?.find(".pagination-list");
  paginationCache.$paginationPrevious = paginationCache.$paginationContainer?.find(".pagination-previous");
  paginationCache.$paginationNext = paginationCache.$paginationContainer?.find(".pagination-next");
}

/**
 * Validate that required elements exist
 * @returns {boolean} True if elements exist
 */
function validateElements() {
  return paginationCache.$paginationContainer?.length > 0 && paginationCache.$productGrid?.length > 0;
}

/**
 * Display message when no products are found
 */
function displayNoProductsMessage() {
  paginationCache.$productGrid.html('<p class="has-text-centered">No products found.</p>');
  paginationCache.$paginationContainer.hide();
}

/**
 * Set up event handlers for pagination
 * @param {number} totalPages - Total number of pages
 */
function setupEventHandlers(totalPages) {
  // Previous button
  paginationCache.$paginationPrevious.off("click").on("click", function (event) {
    event.preventDefault();
    if ($(this).prop("disabled")) return;

    const currentPage = getCurrentPage();
    if (currentPage > 1) {
      loadPageContent(currentPage - 1, false);
    }
  });

  // Next button
  paginationCache.$paginationNext.off("click").on("click", function (event) {
    event.preventDefault();
    if ($(this).prop("disabled")) return;

    const currentPage = getCurrentPage();
    if (currentPage < totalPages) {
      loadPageContent(currentPage + 1, false);
    }
  });
}

/**
 * Generate pagination links for a specific page
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 */
function generatePaginationLinks(currentPage, totalPages) {
  const $list = paginationCache.$paginationList;

  if (!$list) return;

  $list.empty();

  // Hide pagination if only one page
  if (totalPages <= 1) {
    paginationCache.$paginationContainer.hide();
    return;
  } else {
    paginationCache.$paginationContainer.show();
  }

  // Create document fragment for better performance
  const fragment = document.createDocumentFragment();

  // Generate page links
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    const a = document.createElement("a");

    // Set attributes
    a.className = `pagination-link button is-rounded ${
      i === currentPage ? "has-background-white is-current" : "is-transparent"
    } has-text-black`;
    a.setAttribute("aria-label", `Goto page ${i}`);
    a.setAttribute("data-page", i);
    a.textContent = i;

    if (i === currentPage) {
      a.setAttribute("aria-current", "page");
    }

    // Add click handler directly to improve performance
    a.addEventListener("click", function (event) {
      event.preventDefault();

      if (parseInt(this.dataset.page) !== currentPage) {
        loadPageContent(parseInt(this.dataset.page), false);
      }
    });

    // Append to fragment
    li.appendChild(a);
    fragment.appendChild(li);
  }

  // Single DOM update
  $list[0].appendChild(fragment);

  // Update button states
  updateButtonStates(currentPage, totalPages);
}

/**
 * Update previous/next button states
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 */
function updateButtonStates(currentPage, totalPages) {
  const $prev = paginationCache.$paginationPrevious;
  const $next = paginationCache.$paginationNext;

  if (!$prev || !$next) return;

  // Update disabled state
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  $prev.prop("disabled", isFirstPage);
  $next.prop("disabled", isLastPage);

  // Update visual state
  $prev.toggleClass("is-disabled", isFirstPage);
  $next.toggleClass("is-disabled", isLastPage);
}

/**
 * Get current active page number
 * @returns {number} Current page number
 */
function getCurrentPage() {
  const $currentLink = paginationCache.$paginationContainer.find(".pagination-link.is-current");
  return parseInt($currentLink.data("page"), 10) || 1;
}

/**
 * Load content for a specific page
 * @param {number} pageNumber - Page number to load
 * @param {boolean} isInitialLoad - Whether this is the initial page load
 */
function loadPageContent(pageNumber, isInitialLoad = false) {
  const totalItems = paginationProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  // Calculate range
  const startIndex = (pageNumber - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const pageProducts = paginationProducts.slice(startIndex, endIndex);

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();

  // Create product elements
  pageProducts.forEach((product) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = generateProductCard(product);

    // Extract nodes
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
  });

  // Update DOM in one operation
  paginationCache.$productGrid.empty()[0].appendChild(fragment);

  // Update favorite states for new products
  updateFavoriteStates();

  // Update pagination
  generatePaginationLinks(pageNumber, totalPages);

  // Scroll to products (not on initial load)
  if (!isInitialLoad) {
    smoothScrollToProducts();
  }
}

/**
 * Smooth scroll to products grid
 */
function smoothScrollToProducts() {
  requestAnimationFrame(() => {
    $("html, body").animate(
      {
        scrollTop: paginationCache.$productGrid.offset().top - 150,
      },
      {
        duration: 500,
        easing: "swing",
      }
    );
  });
}
