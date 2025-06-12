// Using global variables instead of imports
// No import statements needed for local usage

// Cache for DOM elements to avoid repeated jQuery lookups
const homePageCache = {};

/**
 * Initialize best sellers section on the home page
 */
function initBestSellers() {
  // Clear any previous cache when initializing
  Object.keys(homePageCache).forEach((key) => delete homePageCache[key]);

  // Get elements once and cache them
  cacheElements();
  
  // Initialize contact form validation
  initContactForm();

  // Early return if required elements don't exist
  if (!elementsExist()) {
    hideControls();
    return;
  }

  // Load and display best seller products
  loadBestSellerProducts();

  // Setup the see more/less interaction
  setupSeeMoreButton();
}

/**
 * Cache DOM elements to avoid repeated lookups
 */
function cacheElements() {
  homePageCache.$bestSellerList = $("#best-seller-list");
  homePageCache.$moreCardsRow = $("#more-cards-row");
  homePageCache.$seeMoreContainer = $("#see-more-container");
  homePageCache.$seeMoreButton = $("#see-more-button");
  homePageCache.$contactForm = $("#home-contact-form");
}

/**
 * Check if all required elements exist
 */
function elementsExist() {
  return homePageCache.$bestSellerList.length && homePageCache.$moreCardsRow.length;
}

/**
 * Hide control elements when best sellers can't be displayed
 */
function hideControls() {
  if (homePageCache.$seeMoreContainer?.length) {
    homePageCache.$seeMoreContainer.hide();
  }
}

/**
 * Load best seller products and distribute them between initial and more sections
 */
function loadBestSellerProducts() {
  const initialVisibleCount = 4;
  const totalBestSellers = 8;

  // Get a slice of products to display as best sellers
  const bestSellerProducts = products.slice(0, totalBestSellers);

  // Clear existing content
  homePageCache.$bestSellerList.empty();
  homePageCache.$moreCardsRow.empty();

  // Use document fragments for better performance
  const initialFragment = document.createDocumentFragment();
  const moreFragment = document.createDocumentFragment();

  // Sort products into appropriate containers
  bestSellerProducts.forEach((product, index) => {
    const cardHTML = generateProductCard(product);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = cardHTML;

    // Extract all nodes from tempDiv
    const fragment = document.createDocumentFragment();
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    // Add to appropriate container
    if (index < initialVisibleCount) {
      initialFragment.appendChild(fragment);
    } else {
      moreFragment.appendChild(fragment);
    }
  });

  // Single DOM update for each container (more efficient)
  homePageCache.$bestSellerList[0].appendChild(initialFragment);
  homePageCache.$moreCardsRow[0].appendChild(moreFragment);

  // Update favorite states for the newly added products
  updateFavoriteStates();

  // Show/hide see more container based on product count
  if (bestSellerProducts.length > initialVisibleCount && homePageCache.$seeMoreContainer.length) {
    homePageCache.$seeMoreContainer.show();
  } else if (homePageCache.$seeMoreContainer.length) {
    homePageCache.$seeMoreContainer.hide();
  }
}

/**
 * Setup event handler for the see more/less button
 */
function setupSeeMoreButton() {
  const $button = homePageCache.$seeMoreButton;
  const $moreCards = homePageCache.$moreCardsRow;
  const $initialCards = homePageCache.$bestSellerList;

  if (!$button?.length || !$moreCards?.length) {
    return;
  }

  // Remove any existing click handlers to prevent duplicates
  $button.off("click.seeMore");

  // Add click handler with namespaced event
  $button.on("click.seeMore", function (event) {
    event.preventDefault();

    const isHidden = $moreCards.hasClass("is-hidden");

    // Toggle visibility of more cards
    if (isHidden) {
      $moreCards.removeClass("is-hidden");
      $button.text("See less");
    } else {
      $moreCards.addClass("is-hidden");
      $button.text("See more");

      // Smooth scroll back to the initial cards
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $initialCards.offset().top - 100,
          },
          500
        );
    }
  });
}

/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
  const $form = homePageCache.$contactForm;
  
  if (!$form || !$form.length) {
    return;
  }

  // Remove any existing submit handlers to prevent duplicates
  $form.off("submit.contactForm");

  // Add submit handler with namespaced event
  $form.on("submit.contactForm", function(event) {
    event.preventDefault();
    
    // Get form fields
    const $name = $("#contact-name");
    const $email = $("#contact-email");
    const $message = $("#contact-message");
    const $object = $("#contact-object"); // This field is optional
    
    // Validate required fields
    let isValid = true;
    
    // Validate name
    if (!$name.val().trim()) {
      isValid = false;
      markFieldAsInvalid($name);
    } else {
      markFieldAsValid($name);
    }
    
    // Validate email with a simple pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!$email.val().trim() || !emailPattern.test($email.val().trim())) {
      isValid = false;
      markFieldAsInvalid($email);
    } else {
      markFieldAsValid($email);
    }
    
    // Validate message
    if (!$message.val().trim()) {
      isValid = false;
      markFieldAsInvalid($message);
    } else {
      markFieldAsValid($message);
    }
    
    if (isValid) {
      // Here you would typically send the form data to a server
      // For now, just show a success message and clear the form
      showToast("Thank you for your message! We'll get back to you soon.", "fas fa-check-circle", "has-text-success");
      $form[0].reset();
      
      // Remove validation styles after successful submission
      $form.find("input, textarea").each(function() {
        $(this).removeClass("is-danger is-success");
      });
    } else {
      // Show error message
      showToast("Please fill in all required fields correctly.", "fas fa-exclamation-triangle", "has-text-warning");
    }
  });
}

/**
 * Mark a field as invalid with appropriate styling
 * @param {jQuery} $field - The field to mark as invalid
 */
function markFieldAsInvalid($field) {
  $field.removeClass("is-success").addClass("is-danger");
}

/**
 * Mark a field as valid by removing error styling
 * @param {jQuery} $field - The field to mark as valid
 */
function markFieldAsValid($field) {
  $field.removeClass("is-danger").addClass("is-success");
}
