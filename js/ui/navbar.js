/**
 * Generates the HTML for the navbar
 * @param {string} backgroundColor - Bulma background color class (e.g., 'has-background-yellow', 'has-background-blue')
 * @returns {string} The navbar HTML
 */
function generateNavbarHTML(backgroundColor = "has-background-yellow") {
  return `
    <nav class="navbar mt-5 ${backgroundColor}" role="navigation" aria-label="main navigation">
      <!-- Mobile Navbar: Logo, Cart, Burger Menu -->
      <div class="is-flex is-justify-content-space-between is-align-items-center is-hidden-desktop">
        <a class="navbar-item" href="index.html">
          <img src="./assets/logo.svg" alt="CalzeMania Logo" />
        </a>
        <div class="is-flex is-align-items-center">
          <a class="navbar-burger has-text-black" role="button" aria-label="menu" aria-expanded="false">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>
      </div>
      <!-- Desktop Navbar Menu -->
      <div class="navbar-menu">
        <!-- Left side links -->
        <div class="navbar-start">
          <a class="navbar-item mr-5 is-uppercase" href="shop.html">Shop</a>
          <a class="navbar-item mr-5 is-uppercase" href="about.html">About</a>
          <a class="navbar-item is-uppercase" href="contact.html">Contact</a>
        </div>
        <!-- Centered Logo (Desktop) -->
        <div class="navbar-item navbar-center desktop-logo">
          <a href="index.html">
          <figure class="image is-48x48">
            <img src="./assets/logo.svg" alt="CalzeMania Logo" />
          </figure>
          </a>
        </div>
        <!-- Right side icons -->
        <div class="navbar-end">
          <a class="navbar-item has-text-black" href="blog.html">
            <span class="icon is-medium">
              <i class="fas fa-newspaper"></i>
            </span>
          </a>
          <a class="navbar-item has-text-black" id="navbar-user" href="account.html">
            <span class="icon is-medium">
              <i class="fas fa-user"></i>
            </span>
          </a>
          <a class="navbar-item has-text-black" id="navbar-favorites">
            <span class="icon is-medium">
              <i class="fas fa-heart"></i>
            </span>
              <span class="badge-count tag is-danger is-rounded is-hidden">0</span>
          </a>
          <a class="navbar-item has-text-black" id="navbar-cart-desktop">
            <span class="icon is-medium">
              <i class="fas fa-shopping-cart"></i>
            </span>
            <span class="cart-count tag is-danger is-rounded is-hidden">0</span>
          </a>
        </div>
      </div>
    </nav>
  `;
}
