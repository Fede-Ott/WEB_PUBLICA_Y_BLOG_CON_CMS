/**
 * FAQ Page Logic - handles the accordion functionality for the FAQ page
 */

// Cache DOM elements for better performance
const faqDOMCache = {};

/**
 * Initialize FAQ page functionality
 */
function initFaqPage() {
  initDOMCache();
  setupAccordion();
  // Animation is now handled centrally in animations.js
}

/**
 * Cache frequently used DOM elements
 */
function initDOMCache() {
  faqDOMCache.$accordionItems = document.querySelectorAll(".faq-item");
  faqDOMCache.$accordionQuestions = document.querySelectorAll(".faq-question");
}

/**
 * Set up the accordion functionality with event listeners
 */
function setupAccordion() {
  // Return early if no accordion items found
  if (!faqDOMCache.$accordionQuestions?.length) {
    console.warn("No FAQ accordion questions found on the page.");
    return;
  }

  // Add click event listeners to all question buttons
  faqDOMCache.$accordionQuestions.forEach(question => {
    question.addEventListener("click", toggleAccordionItem);
  });
}

/**
 * Toggle the accordion item's open/closed state
 * @param {Event} event - Click event
 */
function toggleAccordionItem(event) {
  // Prevent default button behavior
  event.preventDefault();
  
  const $question = event.currentTarget;
  const $item = $question.closest(".faq-item");
  const $answer = $item.querySelector(".faq-answer");
  
  // More robust icon selection that won't fail if icon structure changes
  const $iconContainer = $question.querySelector(".icon");
  
  // Check if this item is already active
  const isActive = $item.classList.contains("is-active");
  
  // Toggle the active class
  if (isActive) {
    // Close this item
    $item.classList.remove("is-active");
    
    // Update icon if it exists
    if ($iconContainer) {
      // Find any chevron-up and replace it with chevron-down
      const upIcon = $iconContainer.querySelector(".fa-chevron-up");
      if (upIcon) {
        upIcon.classList.remove("fa-chevron-up");
        upIcon.classList.add("fa-chevron-down");
      }
    }
    
    // Animate the answer closing
    slideUp($answer);
  } else {
    // Close all other items first if you want only one open at a time
    closeAllItems();
    
    // Open this item
    $item.classList.add("is-active");
    
    // Update icon if it exists
    if ($iconContainer) {
      // Find any chevron-down and replace it with chevron-up
      const downIcon = $iconContainer.querySelector(".fa-chevron-down");
      if (downIcon) {
        downIcon.classList.remove("fa-chevron-down");
        downIcon.classList.add("fa-chevron-up");
      }
    }
    
    // Animate the answer opening
    slideDown($answer);
  }
}

/**
 * Close all accordion items
 */
function closeAllItems() {
  faqDOMCache.$accordionItems.forEach(item => {
    const answer = item.querySelector(".faq-answer");
    
    // Use more robust icon handling
    const iconContainer = item.querySelector(".icon");
    
    item.classList.remove("is-active");
    
    // Update icon if it exists
    if (iconContainer) {
      const upIcon = iconContainer.querySelector(".fa-chevron-up");
      if (upIcon) {
        upIcon.classList.remove("fa-chevron-up");
        upIcon.classList.add("fa-chevron-down");
      }
    }
    
    // Hide the answer without animation
    if (answer) {
      answer.style.display = "none";
    }
  });
}

/**
 * Slide down animation for the answer
 * @param {HTMLElement} element - The element to animate
 */
function slideDown(element) {
  // Reset important properties
  element.style.display = "block";
  element.style.height = "auto";
  
  // Get the height of the element
  const height = element.clientHeight;
  
  // Set the height to 0
  element.style.height = "0px";
  element.style.overflow = "hidden";
  element.style.transition = "height 0.3s ease";
  element.style.paddingTop = "0px";
  element.style.paddingBottom = "0px";
  
  // Force repaint
  element.offsetHeight;
  
  // Set the height to the target height and restore padding
  element.style.height = height + "px";
  element.style.padding = "1.25rem";
  
  // Remove the height property after animation completes
  setTimeout(() => {
    element.style.height = "auto";
    element.style.overflow = "visible";
    element.style.transition = "";
  }, 300);
}

/**
 * Slide up animation for the answer
 * @param {HTMLElement} element - The element to animate
 */
function slideUp(element) {
  // Set the height to the current height
  const height = element.clientHeight;
  element.style.height = height + "px";
  element.style.overflow = "hidden";
  element.style.transition = "height 0.3s ease, padding 0.3s ease";
  
  // Force repaint
  element.offsetHeight;
  
  // Set the height to 0
  element.style.height = "0px";
  element.style.paddingTop = "0px";
  element.style.paddingBottom = "0px";
  
  // Hide the element after animation completes
  setTimeout(() => {
    element.style.display = "none";
    element.style.height = "";
    element.style.overflow = "";
    element.style.transition = "";
    element.style.padding = "";
  }, 300);
}