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
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-count");
    let count = 0;
    const step = target / 100;

    const updateCount = () => {
      if (count < target) {
        count += step;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
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
