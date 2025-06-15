// Using globally available variables and functions instead of imports
// No import statements needed for local usage

// Price parsing utility - memoized for better performance
const priceCache = new Map();
const parseShopPrice = (priceStr) => {
  if (priceCache.has(priceStr)) {
    return priceCache.get(priceStr);
  }
  const price = parseFloat(priceStr.replace("€", "").replace(",", "."));
  priceCache.set(priceStr, price);
  return price;
};

// Pre-process products once on module load
const originalProducts = products.map((p) => ({
  ...p,
  numericPrice: parseShopPrice(p.price),
}));

// State management
const state = {
  products: [...originalProducts],
  sort: "default",
  filter: "all",
  activePage: 1,
  itemsPerPage: 12,
};

// Render products with efficient DOM updates
function renderProducts() {
  const $productGrid = $("#product-grid");
  if (!$productGrid.length) return;

  // Clear existing content
  $productGrid.empty();

  // Get paginated subset of products
  const startIndex = (state.activePage - 1) * state.itemsPerPage;
  const endIndex = startIndex + state.itemsPerPage;
  const paginatedProducts = state.products.slice(startIndex, endIndex);

  // Create document fragment for better performance
  const fragment = document.createDocumentFragment();

  // Append all product cards at once
  paginatedProducts.forEach((product) => {
    const cardHTML = generateProductCard(product);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cardHTML;

    // Extract the element and append to fragment
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }
  });

  // Single DOM update
  $productGrid[0].appendChild(fragment);

  // Update favorites state and initialize pagination
  updateFavoriteStates();
  initPagination(state.products, {
    itemsPerPage: state.itemsPerPage,
    currentPage: state.activePage,
    onPageChange: (page) => {
      state.activePage = page;
      renderProducts();
      // Scroll to top of product grid with smooth animation
      $("html, body").animate(
        {
          scrollTop: $productGrid.offset().top - 100,
        },
        200
      );
    },
  });

  // Show empty state message if no products
  if (state.products.length === 0) {
    $productGrid.html(
      '<div class="column is-full has-text-centered py-6"><p class="is-size-4">No products found. Try adjusting your filters.</p></div>'
    );
  }
}

// Apply filters and sort in a single operation
function applyFiltersAndSort() {
  // Start with all products
  let filteredProducts = [...originalProducts];

  // Apply category filter
  if (state.filter !== "all") {
    filteredProducts = filteredProducts.filter((p) => p.category === state.filter);
  }

  // Apply sort
  switch (state.sort) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.numericPrice - b.numericPrice);
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => b.numericPrice - a.numericPrice);
      break;
    case "name-asc":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    // Default sort can be by popularity or featured
    case "default":
    default:
      // Original order from data
      break;
  }

  // Reset to first page when filters change
  state.activePage = 1;

  // Update state and render
  state.products = filteredProducts;
  renderProducts();
}

// Reset all filters to default values
function resetFilters() {
  state.filter = "all";
  state.sort = "default";
  state.activePage = 1;

  // Update UI to reflect reset filters
  $(".dropdown-item").removeClass("is-active");
  $("#dropdown-menu-sort .dropdown-item[data-sort='default']").addClass("is-active");
  $("#dropdown-menu-filter .dropdown-item[data-filter='all']").addClass("is-active");
  $("#sort-button span").first().text("Sort By");
  $("#filter-button span").first().text("Filters");

  applyFiltersAndSort();
  showToast("Filters reset to default.", "info");
}

function handleSortChange(sortBy) {
  state.sort = sortBy;
  applyFiltersAndSort();
}

function handleFilterChange(filterBy) {
  state.filter = filterBy;
  applyFiltersAndSort();
}

// Main initialization function - make it globally available
function initShopLogic() {
  const $productGrid = $("#product-grid");
  if (!$productGrid.length) {
    return;
  }

  // Initialize UI
  setupSortDropdown();
  setupFilterDropdown();
  setupResetButton();

  // Initial render
  applyFiltersAndSort();
}

function setupSortDropdown() {
  const $sortItems = $("#dropdown-menu-sort .dropdown-item");

  $sortItems.on("click", function (e) {
    e.preventDefault();
    const $currentItem = $(this);
    const sortBy = $currentItem.data("sort");

    $sortItems.removeClass("is-active");
    $currentItem.addClass("is-active");

    handleSortChange(sortBy);

    const $sortDropdownTrigger = $currentItem.closest(".dropdown").find(".dropdown-trigger .button span").first();
    if ($sortDropdownTrigger.length) {
      $sortDropdownTrigger.text($currentItem.text());
    }

    $currentItem.closest(".dropdown").removeClass("is-active");
  });
}

function setupFilterDropdown() {
  const $filterItems = $("#dropdown-menu-filter .dropdown-item");

  $filterItems.on("click", function (e) {
    e.preventDefault();
    const $currentItem = $(this);
    const filterBy = $currentItem.data("filter");

    // Don't trigger for the reset button
    if ($currentItem.attr("id") === "reset-filters") {
      return;
    }

    $filterItems.removeClass("is-active");
    $currentItem.addClass("is-active");

    handleFilterChange(filterBy);

    const $filterDropdownTrigger = $("#filter-button span").first();
    if ($filterDropdownTrigger.length) {
      const currentText = $currentItem.text().trim();
      $filterDropdownTrigger.text(currentText === "All" ? "Filters" : currentText);
    }

    $currentItem.closest(".dropdown").removeClass("is-active");
  });

  // Global dropdown handling
  $(".dropdown").on("click", function (event) {
    if (!$(event.target).hasClass("dropdown-item")) {
      $(this).toggleClass("is-active");
      $(".dropdown").not(this).removeClass("is-active");
    }
    event.stopPropagation();
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".dropdown").length) {
      $(".dropdown").removeClass("is-active");
    }
  });
}

function setupResetButton() {
  $("#reset-filters").on("click", function (e) {
    e.preventDefault();
    resetFilters();
    $(this).closest(".dropdown").removeClass("is-active");
  });
}
