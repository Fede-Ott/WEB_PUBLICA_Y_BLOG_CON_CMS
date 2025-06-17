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
      showToast("Thank you for your message! We'll get back to you soon.", "fas fa-check-circle", "has-text-success");
      $form[0].reset();
      
      // Remove validation styles after successful submission
      $form.find("input, textarea").each(function() {
        $(this).removeClass("is-danger is-success");
      });
    } else {
      // Show error message
      showToast("Please fill in all required fields correctly.", "fas fa-exclamation-triangle", "has-text-warning");
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
 * @param {string} iconClass - The icon class for the toast
 * @param {string} textClass - The text class for the toast
 */
function showToast(message, iconClass, textClass) {
  // Cerca se esiste già un toast e lo rimuove
  $('.custom-toast').remove();
  const toast = $(
    `<div class="custom-toast ${textClass}" style="position: fixed; top: 30px; right: 30px; z-index: 9999; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); padding: 1rem 2rem; display: flex; align-items: center; gap: 1rem;">
      <i class="${iconClass}"></i>
      <span>${message}</span>
    </div>`
  );
  $('body').append(toast);
  setTimeout(() => {
    toast.fadeOut(400, function() { $(this).remove(); });
  }, 3000);
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
      showToast("Thank you for your message! We'll get back to you soon.", "fas fa-check-circle", "has-text-success");
      $form[0].reset();
      $form.find('input, textarea').removeClass('is-danger is-success');
    } else {
      showToast("Please fill in all required fields correctly.", "fas fa-exclamation-triangle", "has-text-warning");
    }
  });
});