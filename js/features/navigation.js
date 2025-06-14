/**
 * DOM cache for frequently accessed elements
 */
const navigationCache = {};

/**
 * Initialize navigation functionality
 */
function initNavigation() {
  // Clear any previous cache to prevent memory leaks
  Object.keys(navigationCache).forEach((key) => delete navigationCache[key]);

  // Initialize separate components
  initSmoothScrolling();
  initMobileNavigation();
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  // Use event delegation for better performance
  $(document).on("click", "a[href^='#']", handleSmoothScroll);
}

/**
 * Handle smooth scrolling
 * @param {Event} event - The click event
 */
function handleSmoothScroll(event) {
  const href = this.getAttribute("href");

  // Skip empty anchors
  if (href === "#") return;

  try {
    const $target = $(href);

    if ($target.length) {
      event.preventDefault();

      // Cache the animation properties for reuse
      const animationProperties = {
        scrollTop: $target.offset().top - 20, // Add small offset for better visibility
        duration: 800, // Slightly faster animation
        easing: "easeInOutQuad", // Smoother animation
      };

      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        $("html, body").stop().animate(animationProperties);
      });
    }
  } catch (error) {
    console.error("Error handling smooth scroll:", error);
  }
}

/**
 * Initialize mobile navigation toggle
 */
function initMobileNavigation() {
  // Get burger elements more efficiently with modern selectors
  const burgers = document.querySelectorAll(".navbar-burger");

  if (!burgers.length) return;

  // Add event listeners to all burgers
  burgers.forEach((burger) => {
    burger.addEventListener("click", () => toggleMobileMenu(burger));
  });
}

/**
 * Toggle mobile menu
 * @param {Element} burger - The burger element that was clicked
 */
function toggleMobileMenu(burger) {
  // Get target ID
  const targetId = burger.dataset.target;

  if (!targetId) {
    console.warn("Navbar burger is missing data-target attribute.");
    return;
  }

  // Find target element
  const target = document.getElementById(targetId);

  if (!target) {
    console.warn(`Target menu with ID '${targetId}' not found.`);
    return;
  }

  // Toggle active state
  burger.classList.toggle("is-active");
  target.classList.toggle("is-active");

  // Optional: Add body class to prevent scrolling when menu is open
  document.body.classList.toggle("has-mobile-menu-open");
}

/**
 * Close mobile menu (can be called from other modules)
 */
function closeMobileMenu() {
  const activeBurger = document.querySelector(".navbar-burger.is-active");

  if (activeBurger) {
    toggleMobileMenu(activeBurger);
  }
}
