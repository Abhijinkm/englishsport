/**
 * ENGLISH LEARNING INSTITUTE - Main JavaScript
 * Interactive Features, Responsive Navigation, WhatsApp Integration, Form Validation
 */

// Configuration: Change this to the institute's official WhatsApp number
const INSTITUTE_WHATSAPP_NUMBER = "919876543210"; // Default international format without '+'

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initEnquiryForm();
  initFaqAccordion();
  initSmoothScroll();
  initScrollAnimations();
});

/**
 * Navigation Bar Behaviors
 */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const mobileToggle = document.getElementById("mobileToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Sticky header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    highlightCurrentSection();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", isOpen);
      
      // Update hamburger icon
      mobileToggle.innerHTML = isOpen 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) {
          navMenu.classList.remove("open");
          mobileToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        }
      });
    });
  }

  // Active section spy
  function highlightCurrentSection() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }
}

/**
 * Enquiry Form & WhatsApp Handler
 * Strictly adheres to two inputs: Name and Mobile Number
 * Validates mobile number format and builds the pre-filled message
 */
function initEnquiryForm() {
  const form = document.getElementById("whatsappEnquiryForm");
  const nameInput = document.getElementById("enquiryName");
  const mobileInput = document.getElementById("enquiryMobile");
  const nameError = document.getElementById("nameError");
  const mobileError = document.getElementById("mobileError");
  const previewText = document.getElementById("messagePreviewText");

  if (!form || !nameInput || !mobileInput) return;

  // Real-time message preview update
  function updatePreview() {
    const nameVal = nameInput.value.trim() || "[Your Name]";
    const mobileVal = mobileInput.value.trim() || "[Your Mobile Number]";
    
    const formattedMessage = 
`New Enquiry – ENGLISH LEARNING INSTITUTE
Name: ${nameVal}
Mobile: ${mobileVal}
I am interested in joining the English learning course.`;

    if (previewText) {
      previewText.textContent = formattedMessage;
    }
  }

  nameInput.addEventListener("input", () => {
    validateName(false);
    updatePreview();
  });

  mobileInput.addEventListener("input", (e) => {
    // Strip non-digit characters except leading +
    let val = e.target.value.replace(/[^\d+ ]/g, "");
    e.target.value = val;
    validateMobile(false);
    updatePreview();
  });

  // Mobile validation rule: Checks if cleaned number has 10 digits
  function isValidMobile(mobile) {
    const cleaned = mobile.replace(/\D/g, "");
    // Standard 10-digit mobile number check (e.g. 9876543210) or with country code (10-12 digits)
    if (cleaned.length === 10) {
      return /^[6-9]\d{9}$/.test(cleaned); // Standard Indian mobile starts with 6,7,8,9
    }
    // Also accept international numbers with 10 to 14 digits
    return cleaned.length >= 10 && cleaned.length <= 14;
  }

  function validateName(showVisual = true) {
    const val = nameInput.value.trim();
    if (!val || val.length < 2) {
      if (showVisual) {
        nameInput.classList.add("input-error");
        nameError.classList.add("show");
      }
      return false;
    } else {
      nameInput.classList.remove("input-error");
      nameError.classList.remove("show");
      return true;
    }
  }

  function validateMobile(showVisual = true) {
    const val = mobileInput.value.trim();
    if (!val || !isValidMobile(val)) {
      if (showVisual) {
        mobileInput.classList.add("input-error");
        mobileError.classList.add("show");
      }
      return false;
    } else {
      mobileInput.classList.remove("input-error");
      mobileError.classList.remove("show");
      return true;
    }
  }

  // Handle Form Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isNameValid = validateName(true);
    const isMobileValid = validateMobile(true);

    if (!isNameValid) {
      nameInput.focus();
      return;
    }

    if (!isMobileValid) {
      mobileInput.focus();
      return;
    }

    const customerName = nameInput.value.trim();
    const customerMobile = mobileInput.value.trim();

    // Construct the requested pre-filled message format:
    // "New Enquiry – ENGLISH LEARNING INSTITUTE, Name:, Mobile:, ‘I am interested in joining the English learning course.’"
    const message = `New Enquiry – ENGLISH LEARNING INSTITUTE\nName: ${customerName}\nMobile: ${customerMobile}\nI am interested in joining the English learning course.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${INSTITUTE_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    showToast("Opening WhatsApp with your enquiry...");

    // Open WhatsApp in a new tab
    setTimeout(() => {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }, 400);
  });
}

/**
 * Connect Course Card "Enquire" buttons to smooth scroll and focus
 */
function initSmoothScroll() {
  const courseButtons = document.querySelectorAll(".course-enquire-btn");
  const enquiryNameInput = document.getElementById("enquiryName");

  courseButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const enquirySection = document.getElementById("enquiry");
      if (enquirySection) {
        enquirySection.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          if (enquiryNameInput) {
            enquiryNameInput.focus();
          }
        }, 600);
      }
    });
  });
}

/**
 * FAQ Accordion Interaction
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (questionBtn && answer) {
      questionBtn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherAnswer = otherItem.querySelector(".faq-answer");
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isActive) {
          item.classList.remove("active");
          answer.style.maxHeight = null;
        } else {
          item.classList.add("active");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    }
  });
}

/**
 * Scroll Reveal Animations (Intersection Observer)
 */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".course-card, .feature-box, .step-item, .testimonial-card"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });
  }
}

/**
 * Lightweight Toast Notification
 */
function showToast(message) {
  let toast = document.getElementById("toastNotice");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toastNotice";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}
