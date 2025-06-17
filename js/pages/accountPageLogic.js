/**
 * Initializes the event listeners and logic for the account page.
 */
function initAccountPage() {

  const $registerForm = $("#register-form");

  if ($registerForm.length) {
    $registerForm.on("submit", function (event) {
      event.preventDefault(); // Prevent default form submission

      // Basic validation (check if email field is filled)
      const $emailInput = $("#register-email");
      const email = $emailInput.val().trim();

      try {
        // Show the success toast
        showToast(
          "We have received your email, and we will contact you as soon as possible to complete your registration.",
          "fas fa-check-circle",
          "has-text-success"
        );
        
        // Clear the form
        $registerForm[0].reset();
        
        // Disable the submit button to prevent multiple submissions
        const $registerButton = $("#register-button");
        if ($registerButton.length) {
          $registerButton.prop('disabled', true);
        }
        
        // Redirect to logged.html after a short delay
        setTimeout(() => {
          window.location.href = "logged.html";
        }, 1500);
      } catch (error) {
        console.error("Error in registration process:", error);
      }
    });
  }

  // Add logic for login form, password toggle, etc. if needed
  const $passwordToggle = $(".password-toggle");
  if ($passwordToggle.length) {
    $passwordToggle.on("click", function () {
      const $passwordInput = $(this).prev("input");
      const type = $passwordInput.attr("type") === "password" ? "text" : "password";
      $passwordInput.attr("type", type);
      $(this).find("i").toggleClass("fa-eye fa-eye-slash");
    });
  }

  // Add other account page specific logic here (e.g., login form submission, forgot password)
  const $loginForm = $("#login-form");
  if ($loginForm.length) {
      $loginForm.on("submit", function(event) {
          event.preventDefault();
          
          // Basic validation
          const $usernameInput = $("#login-username");
          const $passwordInput = $("#login-password");
          
          if ($usernameInput.val().trim() === "" || $passwordInput.val().trim() === "") {
              showToast("Please enter both username/email and password.", "fas fa-exclamation-triangle", "has-text-warning");
              return;
          }
          
          // Show success toast
          showToast(
              "Login successful! Redirecting to your account...",
              "fas fa-check-circle",
              "has-text-success"
          );
          
          // Redirect to logged.html after a short delay
          setTimeout(() => {
              window.location.href = "logged.html";
          }, 1500);
      });
  }

  const $forgotPasswordLink = $("#forgot-password");
  if ($forgotPasswordLink.length) {
      $forgotPasswordLink.on("click", function(event) {
          event.preventDefault();
      });
  }

  // Handle logout button functionality
  const $logoutButton = $("#logout-button");
  if ($logoutButton.length) {
      $logoutButton.on("click", function(event) {
          event.preventDefault();
          
          // Show logout toast
          showToast(
              "You have been successfully logged out.",
              "fas fa-sign-out-alt",
              "has-text-info"
          );
          
          // Redirect to index.html after a short delay
          setTimeout(() => {
              window.location.href = "index.html";
          }, 1500);
      });
  }

  // Handle delete account button functionality
  const $deleteAccountButton = $("#delete-account-button");
  if ($deleteAccountButton.length) {
      $deleteAccountButton.on("click", function(event) {
          event.preventDefault();
          
          // Show confirmation toast
          showToast(
              "Your account has been successfully deleted.",
              "fas fa-user-slash",
              "has-text-danger"
          );
          
          // Redirect to index.html after a short delay
          setTimeout(() => {
              window.location.href = "index.html";
          }, 1500);
      });
  }

  // Handle account tabs functionality (in logged.html)
  initAccountTabs();
}

/**
 * Initializes the account tabs functionality
 */
function initAccountTabs() {
  // Check if we're on the logged page
  if (!document.querySelector('.account-tabs')) return;
  
  const tabs = document.querySelectorAll('.account-tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Hide all tab contents initially
  tabContents.forEach(content => {
    content.style.display = 'none';
  });
  
  // Set default active tab (Fidelity card)
  if (tabs.length > 0 && tabContents.length > 0) {
    tabs[0].classList.add('is-active');
    const firstTabContent = document.getElementById(tabs[0].getAttribute('data-tab'));
    
    // Make sure the first tab has the red background
    const accountSection = document.querySelector('section.section.has-background-red, section.section.has-background-green, section.section.has-background-blue, section.section.has-background-pink, section.section.has-background-yellow');
    accountSection.classList.remove('has-background-green', 'has-background-blue', 'has-background-pink', 'has-background-yellow');
    accountSection.classList.add('has-background-red');
    
    if (firstTabContent) {
      firstTabContent.style.display = 'block';
      firstTabContent.classList.add('is-active');
    }
  }
  
  // Add click event to each tab
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', function() {
      
      // Get the tab content ID from the data-tab attribute
      const tabId = this.getAttribute('data-tab');
      const tabContent = document.getElementById(tabId);
      
      // Remove active class from all tabs and hide all contents
      tabs.forEach(t => t.classList.remove('is-active'));
      tabContents.forEach(content => {
        content.classList.remove('is-active');
        content.style.display = 'none';
      });
      
      // Add active class to clicked tab and show corresponding content
      this.classList.add('is-active');
      
      // Change background color based on tab index
      const accountSection = document.querySelector('section.section.has-background-red, section.section.has-background-green, section.section.has-background-blue, section.section.has-background-pink, section.section.has-background-yellow');
      
      // First remove all potential background classes
      accountSection.classList.remove('has-background-red', 'has-background-green', 'has-background-blue', 'has-background-pink', 'has-background-yellow');
      
      // Add the appropriate background class based on tab index
      switch (index) {
        case 0:
          accountSection.classList.add('has-background-red');
          break;
        case 1:
          accountSection.classList.add('has-background-green');
          break;
        case 2:
          accountSection.classList.add('has-background-blue');
          break;
        case 3:
          accountSection.classList.add('has-background-pink');
          break;
        case 4:
          accountSection.classList.add('has-background-yellow');
          break;
      }
      
      if (tabContent) {
        tabContent.style.display = 'block';
        tabContent.classList.add('is-active');
        
        // Scroll to top of tab content on mobile for better UX
        if (window.innerWidth < 768) {
          tabContent.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
      }
    });
  });
}

// Initialize the page when DOM is ready
$(document).ready(function() {
  // Check if we're on the account page or logged page
  const isLoggedPage = window.location.pathname.includes("logged.html");
  const isAccountPage = window.location.pathname.includes("account.html") || 
                        document.querySelector("#register-form") !== null ||
                        document.querySelector("#login-form") !== null;
                        
  // Initialize the account page functionality
  initAccountPage();
});