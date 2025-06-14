// Define functions in global scope instead of exporting
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Setup product card hover animations
  setupProductCardHoverEffects();
  
  // Detect current page and run page-specific animations
  const currentPath = window.location.pathname;
  const filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  if (!filename || filename === '' || filename === 'index.html') {
    animateHomePage();
  } else if (filename === 'shop.html') {
    animateShopPage();
  } else if (filename === 'product.html') {
    animateProductPage();
  } else if (filename === 'faq.html') {
    animateFaqPage();
  }

  // Common animations for page sections that might appear on any page
  animateCommonElements();
}

// Common animations for elements that might be on any page
function animateCommonElements() {
  // Animate any mood image columns that exist on the page
  gsap.utils.toArray(".mood-image-col").forEach((col, i) => {
    let xPercent = 0;
    let yPercent = 0;
    switch (i) {
      case 0:
        xPercent = -100;
        break;
      case 1:
        xPercent = 100;
        break;
      case 2:
        yPercent = 100;
        break;
      case 3:
        yPercent = -100;
        break;
    }

    gsap.from(col, {
      xPercent: xPercent,
      yPercent: yPercent,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: col,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  // Benefits/Features Section animations (blue background section)
  // Make selectors more specific to avoid matching other blue sections like breadcrumbs
  const benefitsSection = document.querySelector(".has-background-blue .columns"); // Assume benefits section uses columns
  if (benefitsSection) {
    gsap.from(benefitsSection.querySelectorAll(".title"), {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: benefitsSection.closest(".has-background-blue"), // Trigger based on the parent blue section
        start: "top 75%",
      },
    });
    
    gsap.from(benefitsSection.querySelectorAll("p"), {
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.2,
      delay: 0.3,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: benefitsSection.closest(".has-background-blue"),
        start: "top 75%",
      },
    });
    
    // Only animate icons if they exist within the columns
    const icons = benefitsSection.querySelectorAll(".icon");
    if (icons.length > 0) {
      gsap.from(icons, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.2,
        delay: 0.1,
        ease: "back.out(1.7)",
        clearProps: "all",
        scrollTrigger: {
          trigger: benefitsSection.closest(".has-background-blue"),
          start: "top 75%",
        },
      });
    }
  }
}

// Home page animations
function animateHomePage() {
  // Hero section animation for the main title "Calzemania"
  gsap.from(".hero-content h1", {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  // Paragraph below the title
  gsap.from(".hero-content p.block", {
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 0.3,
    ease: "power2.out",
  });

  // Buy now button
  gsap.from(".hero-content .button", {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    delay: 0.6,
    ease: "back.out(1.7)",
  });
  
  // Large product image on the right
  gsap.from(".hero-content .column.is-6:nth-child(2) figure", {
    scale: 0.95,
    opacity: 0,
    x: 40,
    duration: 0.8,
    delay: 0.4,
    ease: "power2.out",
  });

  // The three small product images with staggered effect
  gsap.from(".hero-content .columns.is-mobile .column figure", {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    delay: 0.8,
    ease: "power2.out",
  });

  // Best seller section
  gsap.from(".has-background-green .title", {
    y: -30,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-green",
      start: "top 70%",
    },
  });

  gsap.from(".has-background-green .subtitle", {
    y: -20,
    opacity: 0,
    duration: 0.7,
    delay: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-green", 
      start: "top 70%",
    },
  });

  // Create a MutationObserver to watch for when best-seller-list gets populated
  if (document.getElementById("best-seller-list")) {
    const bestSellerList = document.getElementById("best-seller-list");
    
    // Only set up the observer if there are no columns yet
    if (bestSellerList.querySelectorAll(".column").length === 0) {
      const observer = new MutationObserver((mutations) => {
        // Once we detect changes and columns exist, animate them and disconnect
        if (bestSellerList.querySelectorAll(".column").length > 0) {
          gsap.from("#best-seller-list .column", {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: "#best-seller-list",
              start: "top 70%",
            },
          });
          
          // Disconnect observer once we've animated
          observer.disconnect();
        }
      });
      
      // Start observing for changes in child elements
      observer.observe(bestSellerList, { childList: true });
    } else {
      // If columns already exist, animate them immediately
      gsap.from("#best-seller-list .column", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#best-seller-list",
          start: "top 70%",
        },
      });
    }
  }

  // See more button - use MutationObserver for this too
  if (document.getElementById("see-more-container")) {

    const seeMoreButton = document.getElementById("see-more-button");
    
    if (seeMoreButton && !seeMoreButton.hasAttribute("data-animated")) {
      gsap.from("#see-more-button", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: "#see-more-container",
          start: "top 90%",
        },
        onComplete: () => {
          // Mark as animated to prevent double animation
          seeMoreButton.setAttribute("data-animated", "true");
        }
      });
    }
  }

  // "Don't know what to do?" section animations
  gsap.from(".has-background-red .title", {
    scale: 0.9,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-red",
      start: "top 75%",
    },
  });
  
  // First promo box (left side)
  gsap.from(".has-background-red .columns .column:first-child", {
    x: -50,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-red .columns",
      start: "top 70%",
    },
  });
  
  // Second promo box (right side)
  gsap.from(".has-background-red .columns .column:last-child", {
    x: 50,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-red .columns",
      start: "top 70%",
    },
  });
  
  // Specifically target and animate the h3 titles in the promo boxes
  gsap.from(".has-background-red .promo-box-title", {
    y: 30,
    opacity: 0,
    duration: 0.7,
    delay: 0.6,
    stagger: 0.2,
    ease: "power3.out",
    clearProps: "all", // Clear all inline styles after animation to prevent conflicts
    scrollTrigger: {
      trigger: ".has-background-red .columns",
      start: "top 70%",
    },
  });
  
  // Animate the buttons in the promo boxes
  gsap.from(".has-background-red .button", {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    stagger: 0.2,
    delay: 0.8,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".has-background-red .columns",
      start: "top 70%",
    },
  });
  
  // Animate the promo images
  gsap.from(".has-background-red .promo-image", {
    scale: 0.9,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    delay: 0.4,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-red .columns",
      start: "top 70%",
    },
  });

  // Mood Collection Section animations
  gsap.from(".mood-section .title", {
    x: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".mood-section",
      start: "top 70%",
    },
  });
  
  // "See all collections" button animation
  gsap.from(".mood-section .button", {
    x: 30,
    opacity: 0,
    duration: 0.6,
    delay: 0.4,
    ease: "power2.out",
    clearProps: "all",
    scrollTrigger: {
      trigger: ".mood-section",
      start: "center 70%",
    },
  });
  
  // Contact Us Section animations
  gsap.from(".contact-section .title", {
    x: -40,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 75%",
    },
  });
  
  // Animate contact info blocks (address, phone, hours) with staggered effect
  gsap.from(".contact-info > div", {
    x: -50,
    opacity: 0,
    duration: 0.7,
    stagger: 0.2,
    delay: 0.3,
    ease: "power2.out",
    clearProps: "all",
    scrollTrigger: {
      trigger: ".contact-info",
      start: "top 75%",
    },
  });
  
  // Animate the contact form fields
  gsap.from(".contact-form .field", {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.15,
    delay: 0.5,
    ease: "power3.out",
    clearProps: "all",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 75%",
    },
  });
  
  // Animate the send button separately with a pop effect
  gsap.from(".contact-form .button", {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    delay: 1.2,
    ease: "back.out(1.7)",
    clearProps: "all",
    scrollTrigger: {
      trigger: ".contact-form",
      start: "top 75%",
    },
  });
}

// Shop page animations
function animateShopPage() {
  // Hero section animation
  gsap.from(".shop-hero .title", {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".shop-hero .breadcrumb", {
    y: -15,
    opacity: 0,
    duration: 0.7,
    delay: 0.2,
    ease: "power2.out",
  });

  // Shop controls animation
  gsap.from(".shop-controls .dropdown", {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.out",
    delay: 0.4,
  });

  // Use MutationObserver to wait for product grid to be populated
  if (document.getElementById("product-grid")) {
    const productGrid = document.getElementById("product-grid");
    
    // Only set up the observer if there are no products yet
    if (productGrid.querySelectorAll(".column").length === 0) {
      const observer = new MutationObserver((mutations) => {
        // Once we detect changes and products exist, animate them and disconnect
        if (productGrid.querySelectorAll(".column").length > 0) {
          gsap.from("#product-grid .column", {
            y: 40,
            opacity: 0,
            duration: 0.7,
            stagger: {
              each: 0.1,
              grid: "auto",
              from: "start",
            },
            ease: "power2.out",
            clearProps: "all",
          });
          
          // Disconnect observer once we've animated
          observer.disconnect();
        }
      });
      
      // Start observing for changes in child elements
      observer.observe(productGrid, { childList: true });
    } else {
      // If products already exist, animate them immediately
      gsap.from("#product-grid .column", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: {
          each: 0.1,
          grid: "auto",
          from: "start",
        },
        ease: "power2.out",
        clearProps: "all",
      });
    }
  }

  // Only animate pagination if it exists
  if (document.querySelector(".pagination-container")) {
    gsap.from(".pagination-container", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.9,
      clearProps: "all",
    });
  }
}

// Product detail page animations
function animateProductPage() {
  // Breadcrumb animation
  gsap.from(".breadcrumb", {
    y: -20,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  });

  // Main product image animation
  gsap.from(".product-main-image", {
    scale: 0.95,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power2.out",
  });

  // Thumbnails animation
  gsap.from(".product-thumbnail", {
    y: 15,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.2)",
    delay: 0.3,
  });

  // Product details animation
  gsap.from(".column.is-half.pl-6-desktop h1", {
    x: 40,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    delay: 0.4,
  });

  gsap.from(".column.is-half.pl-6-desktop .subtitle", {
    x: 40,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    delay: 0.5,
  });

  // Select the description paragraph more reliably (removed .is-size-6)
  gsap.from(".column.is-half.pl-6-desktop p:not(.subtitle)", { 
    x: 40,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    delay: 0.6,
  });

  // Size buttons with stagger
  gsap.from(".size-buttons .button", {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "back.out(1.5)",
    delay: 0.7,
  });

  // Action buttons
  gsap.from(".product-actions-container .button, .product-actions-container .card-heart", {
    y: 20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: "power2.out",
    delay: 0.9,
  });

  // Related products section title/subtitle
  gsap.from(".product-info-section .title, .product-info-section .subtitle", {
    y: -20,
    opacity: 0,
    duration: 0.6,
    stagger: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".product-info-section",
      start: "top 70%",
    },
  });

  // Related products section title/subtitle (assuming this is the .has-background-red section)
  gsap.from(".has-background-red .title", {
    y: -30,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-red",
      start: "top 75%",
    },
  });

  gsap.from(".has-background-red .subtitle", {
    y: -20,
    opacity: 0,
    duration: 0.7,
    delay: 0.2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-red",
      start: "top 75%",
    },
  });

  // Use MutationObserver to wait for related products to be loaded
  if (document.getElementById("best-seller-list")) {
    const relatedProductsList = document.getElementById("best-seller-list");
    
    const animateRelatedProducts = () => {
        const columns = relatedProductsList.querySelectorAll(".column");
        if (columns.length > 0) {
            gsap.from(columns, {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all",
                scrollTrigger: {
                    trigger: relatedProductsList,
                    start: "top 80%",
                },
            });
            return true; // Indicate animation was applied
        }
        return false; // Indicate no columns found yet
    };

    // Try animating immediately in case content is already there
    if (!animateRelatedProducts()) {
        // If not animated, set up the observer
        const observer = new MutationObserver((mutations) => {
            if (animateRelatedProducts()) {
                observer.disconnect(); // Disconnect once animated
            }
        });
        observer.observe(relatedProductsList, { childList: true });
    }
  }

  // Animate the "See more" button if it exists
  if (document.getElementById("see-more-button") && 
      document.getElementById("see-more-container")) {
    gsap.from("#see-more-button", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: "#see-more-container",
        start: "top 90%",
      },
    });
  }
}

// FAQ page animations
function animateFaqPage() {
  // Hero section animation
  gsap.from(".hero .title", {
    y: -30,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });

  gsap.from(".hero .breadcrumb", {
    y: -15,
    opacity: 0,
    duration: 0.7,
    delay: 0.2,
    ease: "power2.out",
  });

  // FAQ title animation
  gsap.from(".has-background-red .title", {
    y: -30,
    opacity: 0,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".has-background-red",
      start: "top 75%",
    },
  });

  // Animate accordion items
  animateAccordionItems();
}

// Animate FAQ accordion items with staggered effect
function animateAccordionItems() {
  // Check if gsap is available and FAQ items exist
  if (typeof gsap !== 'undefined' && document.querySelector(".faq-item")) {
    gsap.from(".faq-item", {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
      clearProps: "all",
      scrollTrigger: {
        trigger: ".faq-accordion",
        start: "top 75%",
      }
    });
  } else if (document.querySelector(".faq-item")) {
    // Fallback to simpler CSS animation if GSAP is not available
    document.querySelectorAll(".faq-item").forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(20px)";
      item.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      
      setTimeout(() => {
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, 100 + (index * 100));
    });
  }
}

// Helper function to split text for character-by-character animation
function splitTextIntoSpans(text) {
  return [...text]
    .map((char) => {
      if (char === " ") {
        return "<span>&nbsp;</span>";
      }
      return `<span>${char}</span>`;
    })
    .join("");
}

// Processing loader animations
function animateProcessingLoader(textSpans) {
  // Reset any previous animations
  gsap.set(textSpans, { opacity: 0, y: "1em" });

  // Create the wave animation for the text
  return gsap.to(textSpans, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    stagger: 0.03, // Controls wave speed
    ease: "back.out(1.7)",
  });
}

// Create a continuous subtle wave effect after initial animation
function createLoopingWave(spans) {
  // Kill any existing timelines on these elements
  gsap.killTweensOf(spans);

  // Create a timeline for the looping wave effect
  const waveTl = gsap.timeline({
    repeat: -1, // Infinite loop
    yoyo: true,
  });

  waveTl.to(spans, {
    y: "-0.1em",
    duration: 0.6,
    stagger: {
      each: 0.05,
      from: "start",
      repeat: 1,
      yoyo: true,
    },
    ease: "sine.inOut",
  });

  return waveTl;
}

// Toast notification animations
function animateToast($toast, showDuration = 0.5, hideDuration = 0.5, visibleTime = 3) {
  try {
    // Kill any existing animations on the toast
    gsap.killTweensOf($toast[0]);

    // Show toast animation
    return gsap.to($toast[0], {
      bottom: 20,
      opacity: 1,
      visibility: "visible",
      duration: showDuration,
      ease: "power2.out",
      onComplete: () => {
        gsap.to($toast[0], {
          delay: visibleTime,
          bottom: -100,
          opacity: 0,
          duration: hideDuration,
          ease: "power2.in",
          onComplete: () => {
            gsap.set($toast[0], { visibility: "hidden" });
          },
        });
      },
    });
  } catch (error) {
    console.error("Error animating toast:", error);
  }
}

// Product card hover animations
function setupProductCardHoverEffects() {
  // Track cards that have hover handlers to avoid duplicates
  const cardsWithHandlers = new Set();
  
  // Initial setup for all product cards on the page
  setupCardHovers();
  
  // Setup function that can be called when new cards are added
  function setupCardHovers() {
    // Find all product cards that don't have handlers yet
    document.querySelectorAll('.product-card-column:not(.hover-initialized)').forEach(card => {
      // Mark this card as initialized
      card.classList.add('hover-initialized');
      cardsWithHandlers.add(card);
      
      // Direct event handlers on each card rather than delegation
      card.addEventListener('mouseenter', function() {
        if (!this._hoverAnimating) {
          this._hoverAnimating = true;
          gsap.to(this, {
            y: -10,
            scale: 1.03,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
      
      card.addEventListener('mouseleave', function() {
        if (this._hoverAnimating) {
          this._hoverAnimating = false;
          gsap.to(this, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    });
  }

  // Check for new cards periodically (for dynamically added cards)
  const observer = new MutationObserver(setupCardHovers);
  observer.observe(document.body, { childList: true, subtree: true });
}
