/**
 * Initialize contact form validation and submission
 */
function initContactForm() {
  const $form = homePageCache.$contactForm;
  
  if (!$form || !$form.length) {
    return;
  }

  // Remove any existing submit handlers to prevent duplicates
  $form.off("submit.contactForm");

  // Add submit handler with namespaced event
  $form.on("submit.contactForm", function(event) {
    event.preventDefault();
    
    // Get form fields
    const $name = $("#contact-name");
    const $email = $("#contact-email");
    const $message = $("#contact-message");
    const $object = $("#contact-object"); // This field is optional
    
    // Validate required fields
    let isValid = true;
    
    // Validate name
    if (!$name.val().trim()) {
      isValid = false;
      markFieldAsInvalid($name);
    } else {
      markFieldAsValid($name);
    }
    
    // Validate email with a simple pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!$email.val().trim() || !emailPattern.test($email.val().trim())) {
      isValid = false;
      markFieldAsInvalid($email);
    } else {
      markFieldAsValid($email);
    }
    
    // Validate message
    if (!$message.val().trim()) {
      isValid = false;
      markFieldAsInvalid($message);
    } else {
      markFieldAsValid($message);
    }
    
    if (isValid) {
      // Here you would typically send the form data to a server
      // For now, just show a success message and clear the form
      showToast("Thank you for your message! We'll get back to you soon.", "success");
      $form[0].reset();
      
      // Remove validation styles after successful submission
      $form.find("input, textarea").each(function() {
        $(this).removeClass("is-danger is-success");
      });
    } else {
      // Show error message
      showToast("Please fill in all required fields correctly.", "error");
    }
  });
}

/**
 * Mark a field as invalid with appropriate styling
 * @param {jQuery} $field - The field to mark as invalid
 */
function markFieldAsInvalid($field) {
  $field.removeClass("is-success").addClass("is-danger");
}

/**
 * Mark a field as valid by removing error styling
 * @param {jQuery} $field - The field to mark as valid
 */
function markFieldAsValid($field) {
  $field.removeClass("is-danger").addClass("is-success");
}

/**
 * Show a toast message
 * @param {string} message - The message to display
 * @param {string} type - The type of message ('success' or 'error')
 */
function showToast(message, type = "error") {
  // Remove any existing toast
  const oldToast = document.getElementById("toast-notification");
  if (oldToast) oldToast.remove();

  // Icon SVGs
  const icons = {
    error: `<svg class="svg-inline--fa fa-exclamation-triangle fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="exclamation-triangle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"></path></svg>`,
    success: `<svg class="svg-inline--fa fa-check-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-277.314 97.941l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.248-16.379-6.248-22.627 0L216 284.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.627 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>`
  };
  const icon = icons[type] || icons.error;
  const iconColor = type === "success" ? "has-text-success" : "has-text-warning";

  // Create toast element
  const toast = document.createElement("div");
  toast.id = "toast-notification";
  toast.className = "notification has-background-white has-text-black has-text-weight-bold button";
  toast.style.position = "fixed";
  toast.style.bottom = "-100px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.opacity = "0";
  toast.style.visibility = "hidden";
  toast.style.zIndex = "1000";
  toast.innerHTML = `
    <span class="toast-message">${message}</span>
    <span class="icon ml-2 ${iconColor}">${icon}</span>
  `;
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transition = "bottom 0.4s cubic-bezier(.4,1.3,.6,1), opacity 0.4s, visibility 0.4s";
    toast.style.bottom = "30px";
    toast.style.opacity = "1";
    toast.style.visibility = "visible";
  }, 50);

  // Animate out after 3s
  setTimeout(() => {
    toast.style.bottom = "-100px";
    toast.style.opacity = "0";
    toast.style.visibility = "hidden";
    setTimeout(() => toast.remove(), 400);
  }, 3050);
}

$(document).ready(function() {
  const $form = $('#contact-form');
  if (!$form.length) return;

  $form.off('submit.contactForm');
  $form.on('submit.contactForm', function(event) {
    event.preventDefault();
    const $name = $('#contact-name');
    const $email = $('#contact-email');
    const $message = $('#contact-message');
    const $object = $('#contact-object');
    let isValid = true;
    if (!$name.val().trim()) {
      $name.removeClass('is-success').addClass('is-danger');
      isValid = false;
    } else {
      $name.removeClass('is-danger').addClass('is-success');
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!$email.val().trim() || !emailPattern.test($email.val().trim())) {
      $email.removeClass('is-success').addClass('is-danger');
      isValid = false;
    } else {
      $email.removeClass('is-danger').addClass('is-success');
    }
    if (!$message.val().trim()) {
      $message.removeClass('is-success').addClass('is-danger');
      isValid = false;
    } else {
      $message.removeClass('is-danger').addClass('is-success');
    }
    if (isValid) {
      showToast("Thank you for your message! We'll get back to you soon.", "success");
      $form[0].reset();
      $form.find('input, textarea').removeClass('is-danger is-success');
    } else {
      showToast("Please fill in all required fields correctly.", "error");
    }
  });
});