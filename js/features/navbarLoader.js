/**
 * Determines the current page based on URL or document title
 * @returns {string} The current page name
 */
function detectCurrentPage() {
  const path = window.location.pathname;
  const filename = path.substring(path.lastIndexOf("/") + 1).toLowerCase();

  if (!filename || filename === "" || filename === "index.html") {
    return "home";
  } else if (filename.includes("shop")) {
    return "shop";
  } else if (filename.includes("product")) {
    return "product";
  } else if (filename.includes("checkout")) {
    return "checkout";
  } else if (filename.includes("confirmation")) {
    return "confirmation";
  } else if (filename.includes("account")) {
    return "account";
  } else if (filename.includes("logged")) {
    return "logged";
  } else if (filename.includes("contact")) {
    return "contact";
  } else if (filename.includes("about")) {
    return "about";
  } else if (filename.includes("terms")) {
    return "terms";
  } else if (filename.includes("faq")) {
    return "faq";
  }

  return "unknown";
}

/**
 * Returns the appropriate background color class based on the page
 * @param {string} page - The current page name
 * @returns {string} The background color class
 */
function getNavbarBackgroundColor(page) {
  switch (page) {
    case "home":
      return "has-background-yellow";
    case "shop":
      return "has-background-yellow";
    case "product":
      return "has-background-pink";
    case "checkout":
      return "has-background-yellow";
    case "confirmation":
      return "has-background-green-2";
    case "account":
      return "has-background-blue";
    case "logged":
      return "has-background-red";
    case "contact":
      return "has-background-pink";
    case "about":
      return "has-background-blue";
    case "terms":
      return "has-background-blue";
    case "faq":
      return "has-background-red";
    default:
      return "has-background-yellow"; // Default color
  }
}

/**
 * Load the navbar into a specified element
 * @param {string} targetSelector - CSS selector for the element where the navbar should be loaded
 * @returns {Promise<void>}
 */
function loadNavbar(targetSelector = "#navbar-placeholder") {
  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    console.error(`Target element with selector "${targetSelector}" not found.`);
    return;
  }

  try {
    // Detect current page and get appropriate background color
    const currentPage = detectCurrentPage();
    const backgroundColor = getNavbarBackgroundColor(currentPage);

    // Insert the navbar HTML into the target element with the appropriate background color
    targetElement.innerHTML = generateNavbarHTML(backgroundColor);

    // After inserting the navbar, set up any event listeners or dynamic behavior
    setupNavbarEvents();

    // Initialize any dynamic content like cart counts
    updateCartIconBadge();
  } catch (error) {
    console.error("Error loading navbar:", error);
  }
}

/**
 * Set up event listeners and interactive behavior for navbar elements
 */
function setupNavbarEvents() {
  // Handle mobile burger menu
  const burgers = document.querySelectorAll(".navbar-burger");

  burgers.forEach((burger) => {
    burger.addEventListener("click", () => {
      // Get the target from the "data-target" attribute or find the navbar-menu
      const target = document.querySelector(".navbar-menu");

      // Toggle the "is-active" class on both the target and the burger
      burger.classList.toggle("is-active");
      target.classList.toggle("is-active");
    });
  });
  
  // Improve mobile menu navigation by preventing the divider from showing during navigation
  const mobileMenuItems = document.querySelectorAll('.navbar-menu .navbar-item[href]');
  mobileMenuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // For items with href attributes, immediately redirect without animation
      const href = this.getAttribute('href');
      if (href && !href.startsWith('#') && !this.id.includes('navbar-favorites') && !this.id.includes('navbar-cart')) {
        e.preventDefault();
        
        // Add navigating class to prevent divider transitions
        document.body.classList.add('navigating');
        
        // Immediate redirect without waiting for animations
        window.location.href = href;
      }
    });
  });

  // User icon click (account page)
  const userIcon = document.querySelector("#navbar-user");
  if (userIcon) {
    userIcon.addEventListener("click", () => {
      window.location.href = "account.html";
    });
  }

  // Favorites icon click
  const favoritesIcon = document.querySelector("#navbar-favorites");
  if (favoritesIcon) {
    favoritesIcon.addEventListener("click", () => {
      // Trigger favorites modal (assuming you have a function for this)
      if (typeof showFavoritesModal === "function") {
        showFavoritesModal();
      }
    });
  }

  // Cart icons click
  const cartIcons = document.querySelectorAll("#navbar-cart-desktop, #navbar-cart-mobile");
  cartIcons.forEach((icon) => {
    if (icon) {
      icon.addEventListener("click", () => {
        // Trigger cart modal (assuming you have a function for this)
        if (typeof showCartModal === "function") {
          showCartModal();
        }
      });
    }
  });
}

/**
 * Update the cart count badge in the navbar
 */
function updateCartIconBadge() {
  const cartCountBadges = document.querySelectorAll(".cart-count");

  // Try to get cart items from localStorage
  try {
    const cartItems = JSON.parse(localStorage.getItem("cart-items") || "[]");
    const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

    cartCountBadges.forEach((badge) => {
      if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.classList.remove("is-hidden");
      } else {
        badge.classList.add("is-hidden");
      }
    });
  } catch (error) {
    console.error("Error updating cart badge:", error);
  }
}

// Make updateCartIconBadge accessible globally for cart updates
window.updateCartIconBadge = updateCartIconBadge;
