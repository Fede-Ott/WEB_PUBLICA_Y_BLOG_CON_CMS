function generateFavoritesModalHTML() {
  return `
    <div id="favorites-modal" class="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head has-background-white">
          <p class="modal-card-title has-background-white has-text-black has-text-weight-bold">Your Favorites</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <section class="modal-card-body has-background-white" id="favorites-modal-content">
          <!-- Content will be populated here -->
        </section>
      </div>
    </div>
  `;
}
