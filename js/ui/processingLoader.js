/**
 * Processing Order Loader
 * Creates a fullscreen loader with wave text animation
 */
function createProcessingLoader() {
  // Create the loader HTML structure if it doesn't exist
  if (!document.querySelector(".processing-loader")) {
    const loaderHTML = `
      <div class="processing-loader">
        <div class="processing-loader-text">
          ${splitTextIntoSpans("We are processing your order...")}
        </div>
        <div class="processing-loader-icon">
          <i class="fas fa-shopping-bag"></i>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", loaderHTML);
  }

  return {
    show: () => showLoader(),
    hide: () => hideLoader(),
  };
}

// Show loader with wave animation
function showLoader() {
  const loader = document.querySelector(".processing-loader");
  const textSpans = loader.querySelectorAll(".processing-loader-text span");

  // Show the loader container
  loader.classList.add("is-active");

  // Prevent page scrolling
  document.body.classList.add("no-scroll");

  // Create the wave animation for the text
  const animation = animateProcessingLoader(textSpans);
  animation.eventCallback("onComplete", function () {
    // Create a looping wave effect after the initial animation
    createLoopingWave(textSpans);
  });
}

// Hide the loader
function hideLoader() {
  const loader = document.querySelector(".processing-loader");

  // Kill any active animations
  gsap.killTweensOf(loader.querySelectorAll(".processing-loader-text span"));

  // Hide the loader
  loader.classList.remove("is-active");

  // Re-enable page scrolling
  document.body.classList.remove("no-scroll");
}
