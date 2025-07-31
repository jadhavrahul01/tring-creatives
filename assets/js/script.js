// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
});

// Smooth hover effects for buttons
document.querySelectorAll(".btn-contact, .btn-hear-from-us").forEach((button) => {
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-3px) scale(1.05)";
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0) scale(1)";
  });
});

// Mobile menu enhancement
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

// Parallax effect for hero image
window.addEventListener("scroll", () => {
  const heroImage = document.querySelector(".hero-main-image");
  if (heroImage) {
    const scrolled = window.pageYOffset;
    heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

// Counter animation on load
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

// Swiper initialization with card stacking effect
document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".testimonial-swiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    loop: true,
    spaceBetween: 10,
    grabCursor: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      init() {
        setTimeout(() => setCardStacking(this), 50);
      },
      slideChangeTransitionEnd() {
        setCardStacking(this);
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
