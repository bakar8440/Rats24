/** @format */

// Rats24 - Advanced Construction Website JavaScript

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeWebsite();
});

// Main initialization function
function initializeWebsite() {
  setupNavigation();
  setupScrollAnimations();
  setupCounters();
  setupFormHandling();
  setupProjectModals();
  setupMobileMenu();
  setupParallaxEffects();
  setupSmoothScrolling();
  setupLoadingAnimations();
  setupNotifications();
  setupProgressBars();
  setupTooltips();
  setupNewsletterForm();
  setupContactForm();
  setupServiceCards();
  setupProjectCards();
  setupHeroAnimations();
  setupNavbarScrollEffect();
  setupImageLazyLoading();
  setupPerformanceOptimizations();
}

// Navigation functionality
function setupNavigation() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileMenuButton = document.querySelector(".mobile-menu-button");
  const mobileMenu = document.querySelector(".mobile-menu");

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("navbar-scrolled");
    } else {
      navbar.classList.remove("navbar-scrolled");
    }
  });

  // Active navigation link - only for same page navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // If it's a same-page anchor link (starts with #), handle smooth scrolling
      if (href.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(href);

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: "smooth" });
        }

        // Update active link
        navLinks.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
      // If it's a different page, let the browser handle navigation normally
    });
  });

  // Mobile menu toggle
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenuButton.classList.toggle("active");
    });
  }
}

// Scroll animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, observerOptions);

  // Observe elements for scroll animations
  const animatedElements = document.querySelectorAll(
    ".service-card, .project-card, .stat-card"
  );
  animatedElements.forEach((el) => {
    el.classList.add("fade-in-section");
    observer.observe(el);
  });
}

// Counter animations
function setupCounters() {
  const counters = document.querySelectorAll(".stat-card .text-3xl");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.textContent.replace(/\D/g, ""));
          animateCounter(counter, 0, target, 2000);
          counterObserver.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  const suffix = element.textContent.replace(/\d/g, "");

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const current = Math.floor(start + (end - start) * easeOutQuart(progress));
    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

// Form handling
function setupFormHandling() {
  const contactForm = document.querySelector(".contact-form");
  const newsletterForm = document.querySelector(".newsletter-form");

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm);
  }

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterForm);
  }
}

function handleContactForm(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<div class="loading-spinner"></div>';
  submitBtn.disabled = true;

  fetch('http://localhost:3001/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        showNotification("Message sent successfully! We'll get back to you soon.", "success");
        e.target.reset();
      } else {
        showNotification("Failed to send message. Please try again later.", "error");
      }
    })
    .catch(() => {
      showNotification("Failed to send message. Please try again later.", "error");
    })
    .finally(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
}

function handleNewsletterForm(e) {
  e.preventDefault();

  const email = e.target.querySelector('input[type="email"]').value;

  if (email) {
    showNotification("Thank you for subscribing to our newsletter!", "success");
    e.target.reset();
  }
}

// Project modals
function setupProjectModals() {
  const projectButtons = document.querySelectorAll(".btn-view-project");

  projectButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const projectCard = button.closest(".project-card");
      const projectTitle = projectCard.querySelector("h3").textContent;
      const projectDescription = projectCard.querySelector("p").textContent;

      showProjectModal(projectTitle, projectDescription);
    });
  });
}

function showProjectModal(title, description) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-construction-grey">${title}</h3>
                <button class="modal-close text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-accent-grey mb-6">${description}</p>
            <div class="flex justify-end space-x-4">
                <button class="btn-secondary modal-close">Close</button>
                <button class="btn-primary">Request Quote</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Show modal
  setTimeout(() => modal.classList.add("active"), 10);

  // Close modal functionality
  const closeButtons = modal.querySelectorAll(".modal-close");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 300);
    });
  });

  // Close on backdrop click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      setTimeout(() => modal.remove(), 300);
    }
  });
}

// Mobile menu
function setupMobileMenu() {
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileMenuButtons = document.querySelectorAll(".mobile-menu-button"); // Both hamburger and close
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");

  if (mobileMenu && mobileMenuButtons.length > 0) {
    // Remove any previous event listeners by cloning
    mobileMenuButtons.forEach((btn) => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });
    // Re-select after cloning
    const updatedButtons = document.querySelectorAll(".mobile-menu-button");
    updatedButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
      });
    });

    // Overlay click closes menu
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    }

    // Close mobile menu when clicking on links
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
      });
    });
  }
}

// Parallax effects
function setupParallaxEffects() {
  const parallaxElements = document.querySelectorAll(".parallax");

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;

    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Smooth scrolling
function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// Loading animations
function setupLoadingAnimations() {
  // Add loading animation to images
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    img.addEventListener("load", () => {
      img.classList.add("loaded");
    });

    img.addEventListener("error", () => {
      img.classList.add("error");
    });
  });
}

// Notifications
function setupNotifications() {
  // Global notification function
  window.showNotification = function (message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${
                  type === "success" ? "check-circle" : "info-circle"
                } text-${type === "success" ? "green" : "blue"}-500 mr-3"></i>
                <span>${message}</span>
                <button class="ml-auto text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100);

    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 5000);

    // Close button functionality
    const closeBtn = notification.querySelector("button");
    closeBtn.addEventListener("click", () => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    });
  };
}

// Progress bars
function setupProgressBars() {
  const progressBars = document.querySelectorAll(".progress-bar");

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressFill = entry.target.querySelector(".progress-fill");
          const percentage = entry.target.dataset.progress || 100;

          progressFill.style.width = percentage + "%";
          progressObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  progressBars.forEach((bar) => progressObserver.observe(bar));
}

// Tooltips
function setupTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip);
    element.addEventListener("mouseleave", hideTooltip);
  });
}

function showTooltip(e) {
  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-popup";
  tooltip.textContent = e.target.dataset.tooltip;

  document.body.appendChild(tooltip);

  const rect = e.target.getBoundingClientRect();
  tooltip.style.left =
    rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + "px";

  setTimeout(() => tooltip.classList.add("show"), 10);
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip-popup");
  if (tooltip) {
    tooltip.remove();
  }
}

// Newsletter form
function setupNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");

  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;

      if (email) {
        showNotification("Thank you for subscribing!", "success");
        newsletterForm.reset();
      }
    });
  }
}

// Contact form
function setupContactForm() {
  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    // Form validation
    const inputs = contactForm.querySelectorAll("input, textarea, select");

    inputs.forEach((input) => {
      input.addEventListener("blur", validateField);
      input.addEventListener("input", clearError);
    });
  }
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();

  // Remove existing error
  clearError(e);

  // Validation rules
  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "This field is required");
  } else if (field.type === "email" && value && !isValidEmail(value)) {
    showFieldError(field, "Please enter a valid email address");
  } else if (field.type === "tel" && value && !isValidPhone(value)) {
    showFieldError(field, "Please enter a valid phone number");
  }
}

function showFieldError(field, message) {
  field.classList.add("border-red-500");

  const errorDiv = document.createElement("div");
  errorDiv.className = "text-red-500 text-sm mt-1";
  errorDiv.textContent = message;

  field.parentNode.appendChild(errorDiv);
}

function clearError(e) {
  const field = e.target;
  field.classList.remove("border-red-500");

  const errorDiv = field.parentNode.querySelector(".text-red-500");
  if (errorDiv) {
    errorDiv.remove();
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Service cards
function setupServiceCards() {
  const serviceCards = document.querySelectorAll(".service-card");

  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Project cards
function setupProjectCards() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const image = card.querySelector("img");

    if (image) {
      image.addEventListener("load", () => {
        image.style.opacity = "1";
      });
    }
  });
}

// Hero animations
function setupHeroAnimations() {
  const heroSection = document.querySelector(".hero-section");

  if (heroSection) {
    // Parallax effect for hero background
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroSection.style.transform = `translateY(${rate}px)`;
    });
  }
}

// Navbar scroll effect
function setupNavbarScrollEffect() {
  const navbar = document.getElementById("navbar");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      navbar.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });
}

// Image lazy loading
function setupImageLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Performance optimizations
function setupPerformanceOptimizations() {
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
      // Handle scroll events
    }, 16); // ~60fps
  });

  // Preload critical images
  const criticalImages = [
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
}

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Call Now function
function callNow() {
  window.location.href = "tel:+971567216575";
}

// Export functions for global access
window.Rats24 = {
  showNotification,
  animateCounter,
  showProjectModal,
  debounce,
  throttle,
  callNow,
};
