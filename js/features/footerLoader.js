/**
 * Load the footer into a specified element
 * @param {string} targetSelector - CSS selector for the element where the footer should be loaded
 * @returns {Promise<void>}
 */
function loadFooter(targetSelector = "#footer-placeholder") {
  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    console.error(`Footer target element with selector "${targetSelector}" not found.`);
    return;
  }

  try {
    // Insert the footer HTML into the target element
    targetElement.innerHTML = generateFooterHTML();

    // Set up event listeners for footer elements
    setupFooterEvents();
  } catch (error) {
    console.error("Error loading footer:", error);
  }
}

/**
 * Set up event listeners for footer elements
 */
function setupFooterEvents() {
  // Blog link: open in new tab and go to external site
  const blogLink = document.querySelector('#footer-wishlist');
  if (blogLink) {
    blogLink.setAttribute('target', '_blank');
    blogLink.setAttribute('rel', 'noopener noreferrer');
    blogLink.addEventListener('click', function(e) {
      // Remove any previous preventDefault (from wishlist modal)
      e.stopImmediatePropagation();
      // Let the browser handle the external link in a new tab
    });
  }

  // Wishlist button in footer
  const footerWishlist = document.querySelector("#footer-wishlist");
  if (footerWishlist) {
    footerWishlist.addEventListener("click", (e) => {
      e.preventDefault();
      // Similar to navbar favorites functionality
      if (typeof showFavoritesModal === "function") {
        showFavoritesModal();
      }
    });
  }

  // Newsletter subscription
  const newsletterButton = document.querySelector("#newsletter-send-button");
  if (newsletterButton) {
    newsletterButton.addEventListener("click", handleNewsletterSubmit);
  }
}

/**
 * Handle newsletter form submission
 * @param {Event} e - The click event
 */
function handleNewsletterSubmit(e) {
  e.preventDefault();
  const emailInput = e.target.closest(".field").querySelector("input[type='email']");
  
  if (!emailInput || !emailInput.value.trim()) {
    return;
  }

  emailInput.value = "";
  
  if (typeof showToast === "function") {
    showToast("Thank you for subscribing to our newsletter!", "success");
  } else {
    alert("Thank you for subscribing to our newsletter!");
  }
}