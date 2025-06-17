/**
 * Generates the HTML for the footer
 * @returns {string} The footer HTML
 */
function generateFooterHTML() {
  return `
    <div class="container">
      <div class="columns">
        <!-- Footer Logo and Brand Name -->
        <div class="column is-one-quarter">
          <figure class="image is-64x64 mb-3">
            <img src="assets/logo.svg" alt="CalzeMania Logo" />
          </figure>
          <h1 class="title is-3 has-text-black">Calze<br />Mania</h1>
        </div>
        <!-- Footer Menu Links -->
        <div class="column">
          <h2 class="title has-text-poppins is-6 has-text-grey has-text-weight-bold mb-4">MENU</h2>
          <ul>
            <li><a href="shop.html" class="has-text-black has-text-weight-semibold">Shop</a></li>
            <li><a href="about.html" class="has-text-black has-text-weight-semibold">About</a></li>
            <li><a href="https://calzemania.cargo.site/" class="has-text-black has-text-weight-semibold" id="footer-wishlist">Blog</a></li>
            <li><a href="account.html" class="has-text-black has-text-weight-semibold">Account</a></li>
          </ul>
        </div>
        <!-- Footer Help Links -->
        <div class="column">
          <h2 class="title has-text-poppins is-6 has-text-grey has-text-weight-bold mb-4">HELP</h2>
          <ul>
            <li><a href="faq.html" class="has-text-black has-text-weight-semibold">FAQ</a></li>
            <li><a href="contact.html" class="has-text-black has-text-weight-semibold">Contact</a></li>
            <li><a href="terms.html" class="has-text-black has-text-weight-semibold">Terms and Conditions</a></li>
          </ul>
        </div>
        <!-- Newsletter Signup -->
        <div class="column">
          <h2 class="title has-text-poppins is-6 has-text-grey has-text-weight-bold mb-2">NEWSLETTER</h2>
          <p class="has-text-black has-text-weight-bold mb-3">Join our family</p>
          <div class="field has-addons">
            <div class="control is-expanded">
              <input class="input is-medium has-text-black" type="email" placeholder="Your e-mail" />
            </div>
            <div class="control is-flex is-align-items-flex-end ml-4">
              <button
                class="button is-text is-size-6 has-text-weight-bold has-text-black is-uppercase"
                id="newsletter-send-button"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- Footer Divider -->
      <hr class="footer-divider" />
      <!-- Copyright Information -->
      <div class="content has-text-left">
        <p class="is-size-7 has-text-grey">© 2025 CalzeManía. All rights reserved</p>
      </div>
    </div>
  `;
}

// Ensure external Blog link opens in a new tab and works as expected
document.addEventListener('DOMContentLoaded', function() {
  const blogLink = document.getElementById('footer-wishlist');
  if (blogLink) {
    blogLink.setAttribute('target', '_blank');
    blogLink.setAttribute('rel', 'noopener noreferrer');
    blogLink.addEventListener('click', function(e) {
      // Allow default behavior, but ensure it always opens in a new tab
      this.setAttribute('target', '_blank');
    });
  }
});