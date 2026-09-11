/**
 * Portfolio Website Interactivity Script
 * Author: Kritika Perti
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all interactive components
  initThemeToggle();
  initMobileNavigation();
  initTypewriter();
  initActiveNav();
  initContactForm();
  initClipboard();
  initBackToTop();
  initScrollAnimations();
});

/* ==========================================================================
   1. DARK / LIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // Retrieve saved theme or check system preference
  const savedTheme = localStorage.getItem('kp_portfolio_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('kp_portfolio_theme', theme);

    if (themeToggleBtn) {
      const icon = themeToggleBtn.querySelector('i');
      if (icon) {
        if (theme === 'light') {
          icon.className = 'fa-solid fa-sun';
          themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        } else {
          icon.className = 'fa-solid fa-moon';
          themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        }
      }
    }
  }
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navbar) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close mobile navigation when a nav link is clicked
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('open')) {
        navbar.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Close when clicking outside of navbar
  document.addEventListener('click', (e) => {
    if (
      navbar.classList.contains('open') &&
      !navbar.contains(e.target) &&
      !menuToggle.contains(e.target)
    ) {
      navbar.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const typedTarget = document.getElementById('typed-text');
  if (!typedTarget) return;

  const roles = [
    'Software Engineer',
    'C++ & DSA Specialist',
    'Full Stack Developer',
    'Problem Solver',
    'Computer Science Student'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 45;
  const pauseBetweenWords = 1800;

  function typeEffect() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typedTarget.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTarget.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      nextDelay = pauseBetweenWords;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      nextDelay = 400;
    }

    setTimeout(typeEffect, nextDelay);
  }

  typeEffect();
}

/* ==========================================================================
   4. ACTIVE NAV LINK HIGHLIGHT (MULTI-PAGE SUPPORT)
   ========================================================================== */
function initActiveNav() {
  const currentPath = window.location.pathname.toLowerCase();
  let currentPage = currentPath.split('/').pop() || 'index.html';
  if (!currentPage || currentPage === '/') currentPage = 'index.html';

  const navLinks = document.querySelectorAll('.nav-link, .footer-nav a');

  navLinks.forEach((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    const linkPage = href.split('#')[0].split('?')[0] || 'index.html';

    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   5. PROJECT FILTERING
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Manage active state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ==========================================================================
   6. INTERACTIVE CONTACT FORM
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const feedbackBox = document.getElementById('form-feedback');

  if (!contactForm) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset error messages
    nameError.textContent = '';
    emailError.textContent = '';
    subjectError.textContent = '';
    messageError.textContent = '';

    // Validate Name
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      subjectError.textContent = 'Please provide a subject.';
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please write a message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Message must be at least 10 characters long.';
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending form message
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      feedbackBox.className = 'form-feedback success';
      feedbackBox.innerHTML = `
        <i class="fa-solid fa-circle-check"></i> Thank you, <strong>${nameInput.value.trim()}</strong>! Your message has been sent successfully. I'll get back to you soon.
      `;
      feedbackBox.style.display = 'block';

      showToast('Message sent successfully!');

      // Reset Form fields
      contactForm.reset();

      // Hide message after 6 seconds
      setTimeout(() => {
        feedbackBox.style.display = 'none';
      }, 6000);
    }, 1000);
  });
}

/* ==========================================================================
   7. COPY EMAIL TO CLIPBOARD
   ========================================================================== */
function initClipboard() {
  const copyBtn = document.getElementById('copy-email-btn');
  if (!copyBtn) return;

  const emailText = 'pertikritika11@gmail.com';

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(emailText);
      showToast('Email copied to clipboard!');
      copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #10b981;"></i>';
      setTimeout(() => {
        copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i>';
      }, 2000);
    } catch (err) {
      // Fallback
      const tempInput = document.createElement('input');
      tempInput.value = emailText;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('Email copied to clipboard!');
    }
  });
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0';
      backToTopBtn.style.pointerEvents = 'none';
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.about-card, .skill-category-card, .project-card, .timeline-card, .contact-info-card, .form-wrapper'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animatedElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATION HELPER
   ========================================================================== */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.innerHTML = `<i class="fa-solid fa-circle-info text-accent"></i> ${message}`;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
