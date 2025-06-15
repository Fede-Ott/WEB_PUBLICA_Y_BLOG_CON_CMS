// Using globally available variables instead of imports
// No import statements needed for local usage

// Storage keys
const CHECKOUT_STORAGE_KEYS = {
  BILLING: "checkout_billing_data",
  PAYMENT: "checkout_payment_data",
  CART: "calzemania_cart",
};

// DOM cache to minimize jQuery lookups
const checkoutDOMCache = {};

/**
 * Initialize the checkout page
 */
function initCheckoutPage() {
  // Clear any cached elements
  Object.keys(checkoutDOMCache).forEach((key) => delete checkoutDOMCache[key]);

  // Initialize page elements and cache important DOM nodes
  initializeDOMCache();

  // Setup checkout page functionality
  populateCountrySelect();
  initializeCheckoutSections();
  displayOrderSummary();
  setupEventListeners();

  // Add listener to clear billing data when leaving the checkout page
  window.addEventListener("beforeunload", clearCheckoutDataOnLeave);
}

/**
 * Cache frequently used DOM elements
 */
function initializeDOMCache() {
  // Forms and sections
  checkoutDOMCache.$billingForm = $("#billing-form");
  checkoutDOMCache.$billingSection = checkoutDOMCache.$billingForm.closest(".column");
  checkoutDOMCache.$progressSteps = $(".checkout-progress .step");
  checkoutDOMCache.$orderSummaryButton = $(".order-summary-box .button");
  checkoutDOMCache.$summaryItemsContainer = $("#order-summary-items");
  checkoutDOMCache.$totalCostElement = $("#total-cost");
  checkoutDOMCache.$shippingCostElement = $("#shipping-cost");

  // Country select
  checkoutDOMCache.$countrySelect = $("#country-region-select");
}

/**
 * Setup event listeners for various checkout interactions
 */
function setupEventListeners() {
  setupBillingFormSubmission();
  setupRemoveItemButton();

  // Handle payment form events
  $(document).on("click", "#back-to-payment-from-resume", handleBackToPayment);
  $(document).on("click", "#place-order-button-resume", handlePlaceOrder);

  // Listen for order summary button clicks
  checkoutDOMCache.$orderSummaryButton.on("click", handleOrderSummaryButtonClick);
}

/**
 * Initialize the three checkout sections
 */
function initializeCheckoutSections() {
  // Generate and add payment form section
  const paymentFormHTML = generatePaymentFormHTML();
  checkoutDOMCache.$billingSection.after(paymentFormHTML);
  checkoutDOMCache.$paymentSection = $("#payment-section");

  // Generate and add resume section (initially empty)
  const resumeHTML = generateResumeHTML({}, {});
  checkoutDOMCache.$paymentSection.after(resumeHTML);
  checkoutDOMCache.$resumeSection = $("#resume-section");

  // Hide non-active sections initially
  checkoutDOMCache.$paymentSection.hide();
  checkoutDOMCache.$resumeSection.hide();
}

/**
 * Populate the country dropdown with country data
 */
function populateCountrySelect() {
  const $select = checkoutDOMCache.$countrySelect;
  if (!$select?.length) return;

  // Create a document fragment to improve performance
  const fragment = document.createDocumentFragment();
  const placeholder = $select.find("option[disabled]")[0]?.cloneNode(true);

  // Create all options at once
  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country.code;
    option.textContent = country.name;
    fragment.appendChild(option);
  });

  // Clear and update select in a single DOM operation
  $select.empty();
  if (placeholder) fragment.insertBefore(placeholder, fragment.firstChild);
  $select[0].appendChild(fragment);
}

/**
 * Set up the billing form submission and validation
 */
function setupBillingFormSubmission() {
  // Bail if form doesn't exist
  if (!checkoutDOMCache.$billingForm?.length) return;

  // Add form submission handler
  checkoutDOMCache.$billingForm.on("submit", handleBillingFormSubmit);

  // Set up payment section event handlers
  setupPaymentSectionEvents();
}

/**
 * Handle billing form submission
 */
function handleBillingFormSubmit(event) {
  event.preventDefault();

  const formData = validateAndCollectFormData(checkoutDOMCache.$billingForm, "input[required], select[required]");

  if (formData.isValid) {
    // Save data and proceed to payment
    localStorage.setItem(CHECKOUT_STORAGE_KEYS.BILLING, JSON.stringify(formData.data));
    checkoutDOMCache.$billingSection.hide();
    checkoutDOMCache.$paymentSection.show();
    updateProgressIndicator(2);
    checkoutDOMCache.$orderSummaryButton.prop("disabled", true).addClass("has-text-grey-light");
  } else {
    // Show error
    showToast("Please fill in all required fields.", "fas fa-exclamation-triangle", "has-text-warning");
  }
}

/**
 * Validate form fields and collect valid data
 */
function validateAndCollectFormData($form, selector) {
  let isValid = true;
  const data = {};

  $form.find(selector).each(function () {
    const $field = $(this);
    const fieldName = getFieldName($field);
    const value = $field.val();

    if (!value) {
      isValid = false;
      markFieldAsInvalid($field);
    } else {
      markFieldAsValid($field);
      if (fieldName) {
        data[fieldName] = value;
      }
    }
  });

  return { isValid, data };
}

/**
 * Get normalized field name from form field
 */
function getFieldName($field) {
  return (
    $field.attr("id") ||
    $field.attr("name") ||
    $field
      .closest(".field")
      .find("label")
      .text()
      .trim()
      .replace("*", "")
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/\//g, "-")
  );
}

/**
 * Mark a field as invalid with appropriate styling
 */
function markFieldAsInvalid($field) {
  $field.addClass("is-danger");
  if ($field.is("select")) {
    $field.closest(".select").addClass("is-danger-select");
  }
}

/**
 * Mark a field as valid by removing error styling
 */
function markFieldAsValid($field) {
  $field.removeClass("is-danger");
  if ($field.is("select")) {
    $field.closest(".select").removeClass("is-danger-select");
  }
}

/**
 * Setup all event handlers in the payment section
 */
function setupPaymentSectionEvents() {
  // Setup credit card input formatting
  checkoutDOMCache.$paymentSection.on("input", "#card-number", formatCardNumber);
  checkoutDOMCache.$paymentSection.on("input", "#expiry-date", formatExpiryDate);
  checkoutDOMCache.$paymentSection.on("input", "#cvc-code", formatCVC);

  // Payment method selection
  checkoutDOMCache.$paymentSection.on("click", ".payment-method-button", handlePaymentMethodSelection);

  // Back button functionality
  checkoutDOMCache.$paymentSection.on("click", "#back-to-billing", handleBackToBilling);

  // Form submission
  checkoutDOMCache.$paymentSection.find("#payment-form").on("submit", handlePaymentFormSubmit);
}

/**
 * Format credit card number with spaces
 */
function formatCardNumber() {
  let input = $(this).val();
  let originalLength = input.length;
  let cursorPos = this.selectionStart;

  // Remove non-digits and existing spaces
  let digits = input.replace(/\D/g, "").substring(0, 16);

  // Add spaces every 4 digits
  let formatted = digits.replace(/(\d{4})(?=\d)/g, "$1 ");

  // Update value and adjust cursor position if needed
  if (input !== formatted) {
    $(this).val(formatted);

    // Cursor position adjustment
    let newLength = formatted.length;
    let diff = newLength - originalLength;
    let spacesBeforeCursorOriginal = (input.substring(0, cursorPos).match(/ /g) || []).length;
    let spacesBeforeCursorNew = (formatted.substring(0, cursorPos + diff).match(/ /g) || []).length;
    let cursorAdjust = spacesBeforeCursorNew - spacesBeforeCursorOriginal;
    this.setSelectionRange(cursorPos + diff + cursorAdjust, cursorPos + diff + cursorAdjust);
  }
}

/**
 * Format expiry date as MM/YY
 */
function formatExpiryDate() {
  let input = $(this).val();
  let originalLength = input.length;
  let cursorPos = this.selectionStart;

  // Remove invalid characters
  let digits = input.replace(/[^0-9\/]/g, "");

  // Handle slash formatting
  digits = digits.replace(/\/+/g, "/").replace(/^\//, "");
  let parts = digits.split("/");
  let month = parts[0]?.substring(0, 2) || "";
  let year = parts[1]?.substring(0, 2) || "";

  // Build formatted string
  let formatted = month;
  if (month.length === 2 && originalLength >= 2 && input.charAt(originalLength - 1) !== "/") {
    formatted += year.length > 0 ? "/" + year : "/";
  } else if (month.length === 2 && year.length > 0) {
    formatted += "/" + year;
  } else if (parts.length > 1) {
    formatted = month + "/" + year;
  }

  // Limit length
  formatted = formatted.substring(0, 5);

  // Update if needed
  if (input !== formatted) {
    $(this).val(formatted);

    // Adjust cursor
    let diff = formatted.length - originalLength;
    this.setSelectionRange(cursorPos + diff, cursorPos + diff);
  }
}

/**
 * Format CVC code (3 digits)
 */
function formatCVC() {
  let input = $(this).val();
  let digits = input.replace(/\D/g, "").substring(0, 3);

  if (input !== digits) {
    $(this).val(digits);
  }
}

/**
 * Handle payment method selection
 */
function handlePaymentMethodSelection() {
  const $button = $(this);
  if ($button.hasClass("is-disabled")) return;

  // Update active state
  $(".payment-method-button").removeClass("is-active");
  $button.addClass("is-active");

  // Show appropriate fields based on selection
  const method = $button.data("method");
  if (method === "credit-card") {
    $("#credit-card-fields").show();
    $("#other-payment-fields").hide();
  } else {
    $("#credit-card-fields").hide();
    $("#other-payment-fields").show();
    showToast(
      "PayPal/Apple Pay integration is not implemented yet.",
      "fas fa-exclamation-triangle",
      "has-text-warning"
    );
  }
}

/**
 * Handle back to billing button
 */
function handleBackToBilling() {
  checkoutDOMCache.$paymentSection.hide();
  checkoutDOMCache.$billingSection.show();
  updateProgressIndicator(1);
  checkoutDOMCache.$orderSummaryButton.prop("disabled", true).addClass("has-text-grey-light");
}

/**
 * Handle payment form submission
 */
function handlePaymentFormSubmit(event) {
  event.preventDefault();

  // Get payment method
  const selectedMethod = $(".payment-method-button.is-active").data("method");
  const paymentData = { "payment-method": selectedMethod };

  // Validate required fields
  let isPaymentValid = true;

  // Credit card validation
  if (selectedMethod === "credit-card") {
    const $requiredFields = $("#credit-card-fields input[required]");
    $requiredFields.each(function () {
      const $field = $(this);
      const fieldName = $field.attr("id");
      const value = $field.val();

      if (!value) {
        isPaymentValid = false;
        $field.addClass("is-danger");
      } else {
        $field.removeClass("is-danger");
        if (fieldName) paymentData[fieldName] = value;
      }
    });
  }

  // Terms validation
  const $termsCheckbox = $("#terms-agree");
  if (!$termsCheckbox.is(":checked")) {
    isPaymentValid = false;
    $termsCheckbox.closest(".checkbox").addClass("has-text-danger");
    showToast("Please agree to the terms and conditions.", "fas fa-exclamation-triangle", "has-text-warning");
  } else {
    $termsCheckbox.closest(".checkbox").removeClass("has-text-danger");
    paymentData["terms-agreed"] = true;
  }

  // Save payment preference
  paymentData["save-payment"] = $("#save-payment").is(":checked");

  if (isPaymentValid) {
    proceedToResumeStep(paymentData);
  } else if ($termsCheckbox.is(":checked")) {
    showToast("Please fill in all required payment fields.", "fas fa-exclamation-triangle", "has-text-warning");
  }
}

/**
 * Proceed to the resume step with payment data
 */
function proceedToResumeStep(paymentData) {
  // Save payment data
  localStorage.setItem(CHECKOUT_STORAGE_KEYS.PAYMENT, JSON.stringify(paymentData));

  // Get all saved data
  const savedBillingData = JSON.parse(localStorage.getItem(CHECKOUT_STORAGE_KEYS.BILLING) || "{}");
  const savedPaymentData = JSON.parse(localStorage.getItem(CHECKOUT_STORAGE_KEYS.PAYMENT) || "{}");

  // Update resume section
  const updatedResumeHTML = generateResumeHTML(savedBillingData, savedPaymentData);
  checkoutDOMCache.$resumeSection.replaceWith(updatedResumeHTML);
  checkoutDOMCache.$resumeSection = $("#resume-section");

  // Show resume section
  checkoutDOMCache.$paymentSection.hide();
  checkoutDOMCache.$resumeSection.show();

  // Update progress
  updateProgressIndicator(3);
  checkoutDOMCache.$orderSummaryButton.prop("disabled", false).removeClass("has-text-grey-light");
}

/**
 * Handle back to payment from resume
 */
function handleBackToPayment() {
  checkoutDOMCache.$resumeSection.hide();
  checkoutDOMCache.$paymentSection.show();
  updateProgressIndicator(2);
  checkoutDOMCache.$orderSummaryButton.prop("disabled", true).addClass("has-text-grey-light");
}

/**
 * Handle place order button click
 */
function handlePlaceOrder() {
  // Disable buttons
  $("#place-order-button-resume").prop("disabled", true).addClass("is-loading");
  checkoutDOMCache.$orderSummaryButton.prop("disabled", true).addClass("is-loading");

  // Show loader
  const processingLoader = createProcessingLoader();
  processingLoader.show();

  // Clear cart
  clearCartData();

  // Process order with animation delay
  setTimeout(() => {
    processingLoader.hide();
    showToast("Order placed successfully!", "fas fa-check-circle", "has-text-success");
    window.location.href = "confirmation.html";
  }, 3000);
}

/**
 * Handle order summary button click
 */
function handleOrderSummaryButtonClick() {
  if (!$(this).prop("disabled")) {
    handlePlaceOrder();
  }
}

/**
 * Update progress indicator
 */
function updateProgressIndicator(activeStep) {
  checkoutDOMCache.$progressSteps.each(function () {
    const stepNumber = parseInt($(this).data("step"));
    $(this).removeClass("is-active is-completed");

    if (stepNumber < activeStep) {
      $(this).addClass("is-completed");
    } else if (stepNumber === activeStep) {
      $(this).addClass("is-active");
    }
  });
}

/**
 * Clear checkout data when leaving page
 */
function clearCheckoutDataOnLeave() {
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.BILLING);
  localStorage.removeItem(CHECKOUT_STORAGE_KEYS.PAYMENT);
}

/**
 * Clear all cart and checkout data
 */
function clearCartData() {
  Object.values(CHECKOUT_STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  updateCartIconBadge();
}

/**
 * Display order summary with all cart items
 */
function displayOrderSummary() {
  const cart = getCart();
  const $container = checkoutDOMCache.$summaryItemsContainer;
  const $totalElement = checkoutDOMCache.$totalCostElement;
  const $shippingElement = checkoutDOMCache.$shippingCostElement;
  const $orderButton = checkoutDOMCache.$orderSummaryButton;

  if (!$container?.length) return;

  $container.empty();

  // Handle empty cart
  if (cart.length === 0) {
    $container.append("<p>Your cart is empty.</p>");
    $totalElement.text("€0.00");
    $shippingElement.text("€0.00");
    $orderButton.prop("disabled", true).addClass("has-text-grey-light");
    return;
  }

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  let subtotal = 0;

  // Create item elements and calculate subtotal
  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      console.warn(`Product not found: ${item.productId}`);
      return;
    }

    const itemHTML = generateOrderSummaryItemHTML(item, product);
    if (!itemHTML) return;

    // Add to DOM fragment
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = itemHTML;
    while (tempDiv.firstChild) {
      fragment.appendChild(tempDiv.firstChild);
    }

    // Add to subtotal
    const price = parseFloat(String(product.price).replace("€", "").replace(",", "."));
    if (!isNaN(price)) {
      subtotal += item.quantity * price;
    }
  });

  // Add all items at once
  $container[0].appendChild(fragment);

  // Update totals
  const shippingCost = 4.99;
  const totalCost = subtotal + shippingCost;

  $shippingElement.text(`€${shippingCost.toFixed(2)}`);
  $totalElement.text(`€${totalCost.toFixed(2)}`);

  // Disable button initially (will be enabled at step 3)
  $orderButton.prop("disabled", true).addClass("has-text-grey-light");
}

/**
 * Setup remove item button functionality
 */
function setupRemoveItemButton() {
  $("#order-summary-items").on("click", ".remove-cart-item-button", function (event) {
    event.preventDefault();

    const $item = $(this).closest(".order-summary-item");
    const productId = $item.data("product-id");
    const size = $item.data("size");

    if (productId && size && removeFromCart(productId, size)) {
      displayOrderSummary();
      updateCartIconBadge();
    }
  });
}
