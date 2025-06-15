function generateResumeHTML(billingData, paymentData) {
  // Helper function to safely get data or return 'N/A'
  const getData = (data, key, defaultValue = "N/A") => data?.[key] || defaultValue;

  // Helper function to mask card number (show last 4 digits)
  const maskCardNumber = (cardNumber) => {
    if (!cardNumber || typeof cardNumber !== "string") return "XXXX XXXX XXXX XXXX";
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length <= 4) return `XXXX XXXX XXXX ${digits}`;
    const lastFour = digits.slice(-4);
    // Adjust masking based on total length
    const maskedPart = "XXXX ".repeat(Math.max(0, Math.floor((digits.length - 5) / 4) + 1));
    return `${maskedPart}${lastFour}`.trim();
  };

  // Helper function to format country name (find from countries array if needed, assuming 'countries' is available or passed)
  const formatCountry = (countryCodeOrName) => countryCodeOrName || "N/A";

  // Determine payment method display name
  let paymentMethodDisplay = "N/A";
  if (paymentData?.["payment-method"] === "credit-card") {
    paymentMethodDisplay = "Credit Card";
  } else if (paymentData?.["payment-method"] === "paypal") {
    paymentMethodDisplay = "PayPal / Apple Pay";
  }

  return `
    <div class="column is-two-thirds" id="resume-section" style="display: none;">
      <h2 class="title is-3 mb-4">Resume</h2>
      <p class="subtitle is-5 mb-5 has-text-black">Are your details correct?</p>

      <div class="columns">
        <!-- Billing Details Column -->
        <div class="column resume-details">
          <h3 class="mb-4">Billing details</h3>
          <p><strong class="has-text-black">Name:</strong> ${getData(billingData, "first-name")} ${getData(
    billingData,
    "last-name"
  )}</p>
          <p><strong class="has-text-black">Country / Region:</strong> ${formatCountry(
            getData(billingData, "country-region-select")
          )}</p>
          <p><strong class="has-text-black">Street Address:</strong> ${getData(billingData, "street-address")}</p>
          <p><strong class="has-text-black">Town / City:</strong> ${getData(billingData, "town-city")}</p>
          <p><strong class="has-text-black">Province:</strong> ${getData(billingData, "province")}</p>
          <p><strong class="has-text-black">ZIP Code:</strong> ${getData(billingData, "zip-code")}</p>
          <p><strong class="has-text-black">Phone:</strong> ${getData(billingData, "phone")}</p>
          <p><strong class="has-text-black">Email:</strong> ${getData(billingData, "email")}</p>
        </div>

        <!-- Payment Method Column -->
        <div class="column resume-details">
          <h3 class="mb-4">Payment method</h3>
          <p class="has-text-weight-bold">${paymentMethodDisplay}</p>
          ${
            paymentData?.["payment-method"] === "credit-card"
              ? `
            <p><strong class="has-text-black">Card Number:</strong> <span class="masked-card-number">${maskCardNumber(
              getData(paymentData, "card-number")
            )}</span></p>
            <p><strong class="has-text-black">Expiry Date:</strong> ${getData(paymentData, "expiry-date")}</p>
          `
              : ""
          }
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="field is-grouped resume-nav-buttons">
        <div class="control">
          <button type="button" class="button has-background-white has-text-black is-rounded is-medium" id="back-to-payment-from-resume">
            Turn back
          </button>
        </div>
      </div>
    </div>
  `;
}
