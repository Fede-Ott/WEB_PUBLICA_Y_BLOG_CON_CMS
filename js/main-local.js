/* main-local.js - Non-module version that works without a server */
document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM fully loaded and parsed. Loading JavaScript...");
  
  try {
    // The functions below will be declared in their respective script files
    // that we'll load directly via script tags

    // Load navbar and footer
    if (typeof loadNavbar === 'function') await loadNavbar();
    if (typeof loadFooter === 'function') await loadFooter();
    
    // Initialize common features
    if (typeof initNavigation === 'function') initNavigation();
    if (typeof initGlobalInteractions === 'function') initGlobalInteractions();
    if (typeof initInteractions === 'function') initInteractions();
    if (typeof initCartInteractions === 'function') initCartInteractions();
    if (typeof updateFavoriteStates === 'function') updateFavoriteStates();
    if (typeof initAnimations === 'function') initAnimations();
    
    // Detect current page
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf("/") + 1);
    let currentPage = 'unknown';
    
    if (!filename || filename === "" || filename === "index.html") {
      currentPage = "home";
      if (typeof initBestSellers === 'function') initBestSellers();
    } else if (filename === "shop.html") {
      currentPage = "shop";
      if (typeof initShopLogic === 'function') initShopLogic();
    } else if (filename === "product.html") {
      currentPage = "product";
      if (typeof initProductPage === 'function') initProductPage();
    } else if (filename === "checkout.html") {
      currentPage = "checkout";
      if (typeof initCheckoutPage === 'function') initCheckoutPage();
    } else if (filename === "confirmation.html") {
      currentPage = "confirmation";
      if (typeof initConfirmationPage === 'function') initConfirmationPage();
    } else if (filename === "account.html" || filename === "logged.html") {
      currentPage = "account";
      if (typeof initAccountPage === 'function') initAccountPage();
    } else if (filename === "faq.html") {
      currentPage = "faq";
      if (typeof initFaqPage === 'function') initFaqPage();
    }

    console.log(`Current page detected as: ${currentPage}`);
    
    // Always scroll to top for product pages
    if (currentPage === "product") {
      window.scrollTo(0, 0);
      sessionStorage.removeItem("scrollPosition");
    }
    // Restore scroll position after page has fully loaded
    else {
      setTimeout(() => {
        const savedPosition = sessionStorage.getItem("scrollPosition");
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition));
          // Clear the saved position after restoring it
          sessionStorage.removeItem("scrollPosition");
        }
      }, 100);
    }
  } catch (error) {
    console.error("Error during initialization:", error);
  }
});

// Store scroll position before page refresh
window.addEventListener("beforeunload", () => {
  const savedScrollPosition = window.scrollY;
  sessionStorage.setItem("scrollPosition", savedScrollPosition);
});