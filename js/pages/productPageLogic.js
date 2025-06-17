// DOM cache for frequently accessed elements
const productPageCache = {};

// Make this a global function instead of exporting it
function initProductPage() {
  // Clear DOM cache for fresh start (important for navigation within SPA)
  Object.keys(productPageCache).forEach((key) => delete productPageCache[key]);

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    return showError(
      "No product ID specified in URL.",
      "No product selected. Please go back to the shop and choose a product."
    );
  }

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return showError("Product not found!", "Sorry, the product you are looking for could not be found.");
  }

  // Initialize page with product data
  initializeProductView(product);

  // Add related products
  loadRelatedProducts(product);
}

// Display related products in the related products section
function loadRelatedProducts(currentProduct) {
  const $bestSellerList = $("#best-seller-list");
  const $moreCardsRow = $("#more-cards-row");
  const $seeMoreContainer = $("#see-more-container");

  if (!$bestSellerList.length) {
    return;
  }

  // Clear containers
  $bestSellerList.empty();
  if ($moreCardsRow.length) {
    $moreCardsRow.empty();
  }

  // Find related products (same category but different from current)
  let relatedProducts = products
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 8); // Limit to 8 related products

  // If not enough products in same category, add some from other categories
  if (relatedProducts.length < 4) {
    const otherProducts = products
      .filter((p) => p.category !== currentProduct.category && p.id !== currentProduct.id)
      .slice(0, 4 - relatedProducts.length);

    relatedProducts = [...relatedProducts, ...otherProducts].slice(0, 8);
  }

  const initialVisibleCount = 4;

  // Populate the product containers
  relatedProducts.forEach((product, index) => {
    const cardHTML = generateProductCard(product);

    if (index < initialVisibleCount) {
      $bestSellerList.append(cardHTML);
    } else if ($moreCardsRow.length) {
      $moreCardsRow.append(cardHTML);
    }
  });

  // Update favorite states for the new product cards
  updateFavoriteStates();

  // Setup see more/less functionality
  if ($moreCardsRow.length && $seeMoreContainer.length) {
    if (relatedProducts.length > initialVisibleCount) {
      $seeMoreContainer.show();

      const $seeMoreButton = $("#see-more-button");
      if ($seeMoreButton.length) {
        $seeMoreButton.off("click.seeMore").on("click.seeMore", function (event) {
          event.preventDefault();
          if ($moreCardsRow.hasClass("is-hidden")) {
            $moreCardsRow.removeClass("is-hidden");
            $seeMoreButton.text("See less");
          } else {
            $moreCardsRow.addClass("is-hidden");
            $seeMoreButton.text("See more");
            $("html, body")
              .stop()
              .animate(
                {
                  scrollTop: $bestSellerList.offset().top - 100,
                },
                500
              );
          }
        });
      }
    } else {
      $seeMoreContainer.hide();
    }
  }
}

// Handle error display
function showError(logMessage, userMessage) {
  console.error(logMessage);
  const errorContainer = document.querySelector(".section.has-background-pink .container");
  if (errorContainer) {
    errorContainer.innerHTML = `<p class='has-text-danger title is-3'>${userMessage}</p>`;
  }
}

// Get or cache DOM element
function getElement(selector, parent = document) {
  if (!productPageCache[selector]) {
    productPageCache[selector] = parent.querySelector(selector);
  }
  return productPageCache[selector];
}

// Get or cache multiple DOM elements
function getElements(selector, parent = document) {
  const cacheKey = `multiple-${selector}`;
  if (!productPageCache[cacheKey]) {
    productPageCache[cacheKey] = parent.querySelectorAll(selector);
  }
  return productPageCache[cacheKey];
}

// Initialize the product view with all product details
function initializeProductView(product) {
  // Cache all needed DOM elements once
  cacheProductPageElements();

  // Update basic product info
  updateProductInfo(product);

  // Setup image gallery
  setupImageGallery(product);

  // Setup size selection
  setupSizeSelection();

  // Setup quantity controls
  setupQuantityControls();

  // Setup Add to Cart button
  setupAddToCartButton(product.id);

  // Initialize product tabs
  initProductTabs();

  // Initialize favorite button states
  updateFavoriteStates();
  initInteractions();
}

/**
 * Initializes the product page tabs functionality
 */
function initProductTabs() {
  // Check if we're on the product page and have tabs
  if (!document.querySelector('.product-tabs')) return;
  
  const tabs = document.querySelectorAll('.product-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hide all tab contents initially
  tabContents.forEach(content => {
    content.style.display = 'none';
  });
  
  // Set default active tab (Description)
  if (tabs.length > 0 && tabContents.length > 0) {
    tabs[0].classList.add('is-active');
    const firstTabContent = document.getElementById(tabs[0].getAttribute('data-tab'));
    
    // Make sure the first tab has the blue background
    const productSection = document.querySelector('section.section.product-info-section');
    productSection.classList.remove('has-background-green', 'has-background-red', 'has-background-pink', 'has-background-yellow');
    productSection.classList.add('has-background-blue');
    
    if (firstTabContent) {
      firstTabContent.style.display = 'block';
      firstTabContent.classList.add('is-active');
    }
  }
  
  // Add click event to each tab
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', function() {
      
      // Get the tab content ID from the data-tab attribute
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      
      // Remove active class from all tabs and hide all contents
      tabs.forEach(t => t.classList.remove('is-active'));
      tabContents.forEach(content => {
        content.classList.remove('is-active');
        content.style.display = 'none';
      });
      
      // Add active class to clicked tab and show corresponding content
      this.classList.add('is-active');
      
      // Change background color based on tab index
      const productSection = document.querySelector('section.section.product-info-section');
      
      // First remove all potential background classes
      productSection.classList.remove('has-background-blue', 'has-background-green', 'has-background-red', 'has-background-pink', 'has-background-yellow');
      
      // Add the appropriate background class based on tab index
      switch (index) {
        case 0:
          productSection.classList.add('has-background-blue');
          break;
        case 1:
          productSection.classList.add('has-background-green');
          break;
      }
      
      if (tabContent) {
        tabContent.style.display = 'block';
        tabContent.classList.add('is-active');
        
        // Scroll to top of tab content on mobile for better UX
        if (window.innerWidth < 768) {
          tabContent.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      }
    });
  });
}

// Cache all DOM elements used in the product page
function cacheProductPageElements() {
  // Basic product info elements
  productPageCache.breadcrumbProductName = getElement(".breadcrumb .is-active a");
  productPageCache.productName = getElement(".column.is-half.pl-6-desktop h1");
  productPageCache.productPrice = getElement(".column.is-half.pl-6-desktop .subtitle.is-4");
  productPageCache.heartIconLink = getElement(".column.is-half.pl-6-desktop .card-heart");

  // Images and thumbnails
  productPageCache.desktopMainImage = getElement(".columns.is-hidden-until-1260 .product-main-image img");
  productPageCache.mobileMainImage = getElement(".is-hidden-from-1261 .product-main-image img");
  productPageCache.desktopThumbnailContainer = getElement(".columns.is-hidden-until-1260 .column.is-one-quarter");
  productPageCache.mobileThumbnailContainer = getElement(".is-hidden-from-1261 .is-flex.is-flex-wrap-wrap");
  productPageCache.desktopDotsContainer = getElement(".columns.is-hidden-until-1260 .product-image-dots");
  productPageCache.mobileDotsContainer = getElement(".is-hidden-from-1261 .product-image-dots");

  // Controls
  productPageCache.sizeButtons = getElements(".size-buttons .button");
  productPageCache.quantityInput = getElement(".quantity-container input");
  productPageCache.minusButton = getElement(".quantity-container .fa-minus")?.closest("button");
  productPageCache.plusButton = getElement(".quantity-container .fa-plus")?.closest("button");
  productPageCache.addToCartButton = getElement(".add-to-cart-button");
}

// Update basic product information
function updateProductInfo(product) {
  // Update page title
  document.title = `${product.name} - Product Details - CalzeMania`;

  // Update text elements
  if (productPageCache.breadcrumbProductName) {
    productPageCache.breadcrumbProductName.textContent = product.name;
    productPageCache.breadcrumbProductName.href = `product.html?id=${product.id}`;
  }

  if (productPageCache.productName) productPageCache.productName.textContent = product.name;
  if (productPageCache.productPrice) productPageCache.productPrice.textContent = product.price;

  // Set product ID for heart icon
  if (productPageCache.heartIconLink) {
    productPageCache.heartIconLink.setAttribute("data-product-id", product.id);
  }
}

// Setup image gallery including thumbnails and dots
function setupImageGallery(product) {
  // Fix image paths and add size chart
  const baseProductImages = product.images || [];
  const sizeChartPath = "./assets/images/size-chart2_large.webp";
  const allDisplayImages = [...baseProductImages.map((src) => src.replace("../", "./")), sizeChartPath];

  // Set initial main image
  const mainImgSrc = allDisplayImages.length > 0 ? allDisplayImages[0] : "./assets/images/placeholder.webp";

  // Update main images
  updateMainImages(mainImgSrc, product.name);

  // Create thumbnails and dots
  createThumbnails(allDisplayImages, baseProductImages.length);
  createDots(allDisplayImages.length);

  // Add event listeners to thumbnails and dots
  setupImageSwitching(baseProductImages.length);
}

// Update main product images for both desktop and mobile
function updateMainImages(imgSrc, altText) {
  if (productPageCache.desktopMainImage) {
    productPageCache.desktopMainImage.src = imgSrc;
    productPageCache.desktopMainImage.alt = altText;
  }

  if (productPageCache.mobileMainImage) {
    productPageCache.mobileMainImage.src = imgSrc;
    productPageCache.mobileMainImage.alt = altText;
  }
}

// Create thumbnail images for product gallery
function createThumbnails(images, baseImagesCount) {
  // Create desktop thumbnails
  if (productPageCache.desktopThumbnailContainer) {
    productPageCache.desktopThumbnailContainer.innerHTML = "";
    const desktopFragment = document.createDocumentFragment();

    images.forEach((imgSrc, index) => {
      const isSizeChart = index === baseImagesCount;
      const figure = createThumbnailElement(imgSrc, index, isSizeChart, true);
      desktopFragment.appendChild(figure);
    });

    productPageCache.desktopThumbnailContainer.appendChild(desktopFragment);
  }

  // Create mobile thumbnails
  if (productPageCache.mobileThumbnailContainer) {
    productPageCache.mobileThumbnailContainer.innerHTML = "";
    const mobileFragment = document.createDocumentFragment();

    images.forEach((imgSrc, index) => {
      const isSizeChart = index === baseImagesCount;
      const figure = createThumbnailElement(imgSrc, index, isSizeChart, false);
      mobileFragment.appendChild(figure);
    });

    productPageCache.mobileThumbnailContainer.appendChild(mobileFragment);
  }
}

// Create a single thumbnail element
function createThumbnailElement(imgSrc, index, isSizeChart, isDesktop) {
  const figure = document.createElement("figure");
  const sizeClass = isDesktop ? "is-128x128" : "is-96x96";
  figure.className = `image ${sizeClass} ${isDesktop ? "mb-3" : ""} product-thumbnail ${
    index === 0 ? "is-active" : ""
  } ${isSizeChart ? "size-guide-thumb" : ""}`;

  const altText = isSizeChart ? "Size Guide" : `Thumbnail ${index + 1}`;
  figure.innerHTML = `<img src="${imgSrc}" alt="${altText}" data-index="${index}">`;

  return figure;
}

// Create navigation dots for image gallery
function createDots(count) {
  // Create desktop dots
  if (productPageCache.desktopDotsContainer) {
    productPageCache.desktopDotsContainer.innerHTML = "";
    const desktopFragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = `dot ${i === 0 ? "is-active" : ""}`;
      dot.setAttribute("data-index", i);
      desktopFragment.appendChild(dot);
    }

    productPageCache.desktopDotsContainer.appendChild(desktopFragment);
  }

  // Create mobile dots
  if (productPageCache.mobileDotsContainer) {
    productPageCache.mobileDotsContainer.innerHTML = "";
    const mobileFragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.className = `dot ${i === 0 ? "is-active" : ""}`;
      dot.setAttribute("data-index", i);
      mobileFragment.appendChild(dot);
    }

    productPageCache.mobileDotsContainer.appendChild(mobileFragment);
  }
}

// Setup image switching functionality with event listeners
function setupImageSwitching(baseImagesCount) {
  const thumbnails = document.querySelectorAll(".product-thumbnail img[data-index]");
  const dots = document.querySelectorAll(".dot");

  // Image switching function
  const setActiveImage = (index) => {
    if (!thumbnails || thumbnails.length === 0 || index < 0 || index >= thumbnails.length) {
      console.error("Invalid index or thumbnails for setActiveImage:", index, thumbnails);
      return;
    }

    const isSizeChart = index === baseImagesCount;
    const imgSrc = thumbnails[index].src;
    const altText = isSizeChart ? "Size Guide" : `Product Image ${index + 1}`;

    // Update main images
    updateMainImages(imgSrc, altText);

    // Update active states
    thumbnails.forEach((thumb, i) => {
      const thumbParent = thumb.closest(".product-thumbnail");
      if (thumbParent) {
        thumbParent.classList.toggle("is-active", i === index);
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  };

  // Add event listeners
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"), 10);
      setActiveImage(index);
    });
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"), 10);
      setActiveImage(index);
    });
  });
}

// Setup size selection functionality
function setupSizeSelection() {
  let selectedSize = null;

  if (!productPageCache.sizeButtons || productPageCache.sizeButtons.length === 0) return;

  productPageCache.sizeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      productPageCache.sizeButtons.forEach((btn) => btn.classList.remove("is-black"));
      button.classList.add("is-black");
      selectedSize = button.textContent;
    });
  });

  // Store the selected size in the DOM cache for later use
  productPageCache.getSelectedSize = () => selectedSize;
}

// Setup quantity controls
function setupQuantityControls() {
  if (productPageCache.quantityInput) {
    productPageCache.quantityInput.value = "1";
  }

  if (productPageCache.minusButton) {
    productPageCache.minusButton.addEventListener("click", () => {
      if (!productPageCache.quantityInput) return;

      let currentValue = parseInt(productPageCache.quantityInput.value, 10) || 1;
      productPageCache.quantityInput.value = Math.max(1, currentValue - 1);
    });
  }

  if (productPageCache.plusButton) {
    productPageCache.plusButton.addEventListener("click", () => {
      if (!productPageCache.quantityInput) return;

      let currentValue = parseInt(productPageCache.quantityInput.value, 10) || 1;
      productPageCache.quantityInput.value = currentValue + 1;
    });
  }
}

// Setup Add to Cart button functionality
function setupAddToCartButton(productId) {
  if (!productPageCache.addToCartButton) return;

  productPageCache.addToCartButton.addEventListener("click", () => {
    const quantity = parseInt(productPageCache.quantityInput?.value, 10) || 1;
    const selectedSize = productPageCache.getSelectedSize?.() || null;

    addToCart(productId, selectedSize, quantity);
  });
}
