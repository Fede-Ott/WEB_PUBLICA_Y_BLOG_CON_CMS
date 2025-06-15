function generatePaymentFormHTML() {
  return `
    <div class="column is-two-thirds" id="payment-section" style="display: none;">
      <h2 class="title is-3 mb-5">Payment method</h2>
      <form id="payment-form">
        <!-- Payment Method Selection -->
        <div class="payment-method-options field">
          <button type="button" class="payment-method-button is-active" data-method="credit-card">Credit Card</button>
          <button type="button" class="payment-method-button is-disabled" data-method="paypal">PayPal / Apple Pay</button> <!-- Disabled for now -->
        </div>

        <!-- Credit Card Fields (Initially Visible) -->
        <div id="credit-card-fields">
          <div class="field">
            <label class="label has-text-black">Card Number*</label>
            <div class="control">
              <input class="input custom-input is-large" type="text" placeholder="" required id="card-number" />
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label has-text-black">Expiry Date*</label>
                <div class="control">
                  <input class="input custom-input is-large" type="text" placeholder="MM/YY" required id="expiry-date" />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label has-text-black">Card Code (CVC)*</label>
                <div class="control">
                  <input class="input custom-input is-large" type="text" placeholder="" required id="cvc-code" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- PayPal/Other Fields (Initially Hidden) -->
        <div id="other-payment-fields" style="display: none;">
          <p>PayPal/Apple Pay integration goes here.</p>
        </div>

        <!-- Checkboxes -->
        <div class="field">
          <label class="checkbox has-text-black">
            <input type="checkbox" id="save-payment">
            Save payment information to my account for future purchases.
          </label>
        </div>
        <div class="field">
          <label class="checkbox has-text-black">
            <input type="checkbox" required id="terms-agree">
            I have read and agree to the website&nbsp;<a href="#" target="_blank" class="terms-link">terms and conditions</a>*
          </label>
        </div>

        <!-- Navigation Buttons -->
        <div class="field is-grouped payment-nav-buttons">
          <div class="control">
            <button type="button" class="button has-background-white has-text-black is-rounded is-medium" id="back-to-billing">
              Turn back
            </button>
          </div>
          <div class="control">
            <button type="submit" class="button has-background-white has-text-black is-rounded is-medium" id="proceed-to-confirmation">
              Next step
            </button>
          </div>
        </div>
      </form>
    </div>
  `;
}
