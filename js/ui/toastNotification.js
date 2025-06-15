function generateToastHTML() {
  return `
    <div id="toast-notification" class="notification has-background-white has-text-black has-text-weight-bold button" style="position: fixed; bottom: -100px; left: 50%; transform: translateX(-50%); opacity: 0; visibility: hidden; z-index: 1000;">
      <span class="toast-message"></span>
      <span class="icon has-text-red ml-2"> <!-- Default icon color -->
        <i class="fas fa-heart"></i> <!-- Default icon -->
      </span>
    </div>
  `;
}

// --- Toast Notifications ---
let $toast = null;

function showToast(message, iconClass = "fas fa-heart", iconColorClass = "has-text-red") {
  // Remove any existing toast to prevent DOM conflicts
  $("#toast-notification").remove();
  
  // Create a fresh toast element
  const toastHTML = generateToastHTML();
  $("body").append(toastHTML);
  $toast = $("#toast-notification");
  
  // Set the message and icon
  $toast.find(".toast-message").text(message);

  const $iconContainer = $toast.find(".icon");
  const $iconElement = $iconContainer.find("i");
  $iconContainer.removeClass("has-text-red has-text-black has-text-success has-text-warning has-text-info");
  $iconElement.removeClass(
    "fas fa-heart fas fa-heart-broken fa-check-circle fa-exclamation-triangle fa-info-circle fa-times-circle fa-trash"
  ); // Add all used icons

  $iconContainer.addClass(iconColorClass);
  $iconElement.addClass(iconClass);

  // Use the centralized animation function
  animateToast($toast);
}
