function generateCartModalHTML() {
  return `
    <div id="cart-modal" class="modal cart-modal">
      <div class="modal-background"></div>
      <div class="modal-content">
        <div class="box has-background-white p-5">
          <header class="is-flex is-justify-content-space-between is-align-items-center mb-5">
            <p class="title is-4 has-text-black mb-0">Shopping Cart</p>
            <button class="delete cart-close-button" aria-label="close"></button>
          </header>
           <hr class="cart-divider">
          <div class="cart-items-container mb-5">
            <!-- Cart items will be populated here -->
            <p class="has-text-centered cart-empty-message">Your cart is empty.</p>
          </div>
            <hr class="cart-divider">
          <div class="is-flex is-justify-content-space-between is-align-items-center mb-5">
            <p class="has-text-weight-bold has-text-black">Subtotal</p>
            <p class="has-text-weight-bold has-text-black" id="cart-subtotal">0.00€</p>
          </div>
          <button class="button has-background-white has-text-black is-fullwidth is-rounded is-large checkout-button">Checkout</button>
        </div>
      </div>
    </div>
  `;
}
