// ==================== Navbar Scroll Effect ====================
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }

  // Parallax effect for hero image
  const heroImage = document.querySelector(".hero-main-image");
  if (heroImage) {
    const scrolled = window.pageYOffset;
    heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

// ==================== Smooth Hover Effects ====================
document
  .querySelectorAll(".btn-contact, .btn-hear-from-us")
  .forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-3px) scale(1.05)";
    });
    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0) scale(1)";
    });
  });

// ==================== Mobile Menu Enhancement ====================
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

if (navbarToggler && navbarCollapse) {
  navbarToggler.addEventListener("click", () => {
    setTimeout(() => {
      if (navbarCollapse.classList.contains("show")) {
        navbarCollapse.style.backdropFilter = "blur(20px)";
        navbarCollapse.style.background = "rgba(0, 0, 231, 0.95)";
      }
    }, 150);
  });
}

// ==================== Counter Animation ====================
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count");
  let started = false; // prevent multiple triggers

  function startCounter() {
    counters.forEach((counter) => {
      const targetStr = counter.getAttribute("data-count"); // string version
      const target = parseInt(targetStr, 10); // number for counting
      let count = 0;
      const step = target / 100;

      const updateCount = () => {
        if (count < target) {
          count += step;
          counter.innerText = String(Math.ceil(count)).padStart(targetStr.length, "0");
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = targetStr; // final with leading zero
        }
      };

      updateCount();
    });
  }


  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !started) {
        startCounter();
        started = true;
      }
    });
  }, { threshold: 0.3 }); // triggers when 30% of the section is visible

  observer.observe(document.querySelector(".stats-section"));
});

// ==================== Swiper (Testimonial) ====================
document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".testimonial-swiper", {
    slidesPerView: 5,
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: {
        slidesPerView: 1,
        centeredSlides: true,
      },
      768: {
        slidesPerView: 5,
        centeredSlides: true,
      },
    },
    on: {
      init() {
        setTimeout(() => setCardStacking(swiper), 50);
      },
      slideChangeTransitionEnd() {
        setCardStacking(swiper);
      },
    },
  });

  function setCardStacking(swiperInstance) {
    const slides = swiperInstance.slides;
    const activeIndex = swiperInstance.activeIndex;
    const total = slides.length;

    slides.forEach((slide) => {
      slide.classList.remove("middle", "near", "far", "more-far");
    });

    const getIndex = (i) => (i + total) % total;

    slides[getIndex(activeIndex)]?.classList.add("middle");
    slides[getIndex(activeIndex - 1)]?.classList.add("near");
    slides[getIndex(activeIndex + 1)]?.classList.add("near");
    slides[getIndex(activeIndex - 2)]?.classList.add("far");
    slides[getIndex(activeIndex + 2)]?.classList.add("far");
    slides[getIndex(activeIndex - 3)]?.classList.add("more-far");
    slides[getIndex(activeIndex + 3)]?.classList.add("more-far");
  }
});

// ==================== Scroll To Top ====================
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// ==================== Footer Link Glow Effect ====================
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".footer-links a");

  links.forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.textShadow = "0 0 20px rgba(255, 255, 0, 0.5)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.textShadow = "none";
    });
  });
});

// ==================== Language Slider Animation ====================
document.addEventListener("DOMContentLoaded", function () {
  const texts = document.querySelectorAll(".language-text");
  let index = 0;
  const delay = 1200;

  function clearAnimations() {
    texts.forEach((el) => {
      el.classList.remove("slide-in-up", "slide-out-up", "bounce-tr");
      el.style.zIndex = "1";
    });
  }

  function updateSlides(current, next) {
    clearAnimations();

    texts[current].classList.add("slide-out-up");

    if (next === 0) {
      // "TRING" bounce animation
      texts[next].classList.add("bounce-tr");
    } else {
      texts[next].classList.add("slide-in-up");
    }

    texts[next].style.zIndex = "2";
  }

  function startSlider() {
    const current = index;
    index = (index + 1) % texts.length;

    updateSlides(current, index);

    // Hold longer on "TRING"
    setTimeout(startSlider, index === 0 ? 2000 : delay);
  }

  // Initial state
  texts[0].classList.add("slide-in-up");
  texts[0].style.zIndex = "2";

  setTimeout(startSlider, delay);
});


// ==================== Mobile Menu Smooth Scroll ====================
document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("mobileMenu");
  const offcanvas = bootstrap.Offcanvas.getOrCreateInstance(menu);

  menu.querySelectorAll(".nav-link[href^='#']").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const id = link.getAttribute("href");
      offcanvas.hide();
      menu.addEventListener("hidden.bs.offcanvas", () =>
        document.querySelector(id)?.scrollIntoView({ behavior: "smooth" }),
        { once: true });
    });
  });
});

// ==================== Service Slider Animation ====================
document.querySelectorAll('.service-slider-wrapper').forEach(wrapper => {
  const cardOne = wrapper.querySelector('.card-one');
  const cardTwo = wrapper.querySelector('.card-two');

  let showingCard = 1;
  let lastDirection = 'right';

  function resetClasses(element) {
    element.classList.remove(
      'slide-in-left',
      'slide-in-right',
      'slide-out-left',
      'slide-out-right',
      'active'
    );
  }

  function showCardOne() {
    resetClasses(cardTwo);
    resetClasses(cardOne);

    cardTwo.classList.add(lastDirection === 'right' ? 'slide-out-left' : 'slide-out-right');
    cardOne.classList.add('active', lastDirection === 'right' ? 'slide-in-right' : 'slide-in-left');

    showingCard = 1;
    lastDirection = lastDirection === 'right' ? 'left' : 'right';
  }

  function showCardTwo() {
    resetClasses(cardOne);
    resetClasses(cardTwo);

    cardOne.classList.add(lastDirection === 'right' ? 'slide-out-left' : 'slide-out-right');
    cardTwo.classList.add('active', lastDirection === 'right' ? 'slide-in-right' : 'slide-in-left');

    showingCard = 2;
    lastDirection = lastDirection === 'right' ? 'left' : 'right';
  }

  cardOne.addEventListener('click', () => {
    if (showingCard === 1) showCardTwo();
  });

  cardTwo.addEventListener('click', () => {
    if (showingCard === 2) showCardOne();
  });
});


// ==================== Cookie Consent Management ====================
function checkConsentStatus() {
  return window.cookieConsentChoice || null;
}

function storeConsent(choice) {
  window.cookieConsentChoice = choice;
}

function showStatusMessage(message, type = 'success') {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = `status-message ${type} show`;

  setTimeout(() => {
    statusEl.classList.remove('show');
  }, 3000);
}

function showConsentBanner() {
  const banner = document.getElementById('cookieConsent');
  const overlay = document.getElementById('consentOverlay');
  const body = document.body;

  console.log('🍪 Showing consent banner');

  overlay.classList.add('show');
  body.classList.add('no-scroll');

  setTimeout(() => {
    banner.classList.add('show');
  }, 100);
}

function hideConsentBanner() {
  const banner = document.getElementById('cookieConsent');
  const overlay = document.getElementById('consentOverlay');
  const body = document.body;

  console.log('🍪 Hiding consent banner');

  banner.classList.remove('show');

  setTimeout(() => {
    overlay.classList.remove('show');
    body.classList.remove('no-scroll');
  }, 400);
}

function handleConsent(choice) {
  console.log(`🍪 User selected: ${choice}`);

  storeConsent(choice);

  hideConsentBanner();

  switch (choice) {
    case 'accept':
      showStatusMessage('✅ All cookies accepted!', 'success');
      loadAllCookies();
      break;
    case 'reject':
      showStatusMessage('❌ Non-essential cookies rejected. Only essential cookies loaded.', 'error');
      loadEssentialCookies();
      break;
  }
}

function loadAllCookies() {
  console.log('📊 Loading all cookies: Analytics, Marketing, Social Media, etc.');
}

function loadEssentialCookies() {
  console.log('🔒 Loading only essential cookies for basic site functionality');
}

function resetConsent() {
  window.cookieConsentChoice = null;
  showStatusMessage('🔄 Consent reset! Banner will show again.', 'success');
  setTimeout(() => {
    showConsentBanner();
  }, 1000);
}

window.addEventListener('load', function () {
  const existingConsent = checkConsentStatus();

  console.log('🍪 Checking consent status:', existingConsent);

  if (!existingConsent) {
    setTimeout(function () {
      showConsentBanner();
    }, 1500);
  } else {
    console.log('🍪 User has already given consent:', existingConsent);
    if (existingConsent === 'accept') {
      loadAllCookies();
    } else {
      loadEssentialCookies();
    }
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const banner = document.getElementById('cookieConsent');
    if (banner.classList.contains('show')) {
      handleConsent('reject');
    }
  }
});