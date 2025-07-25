// Navbar scroll effect
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("navbar-scrolled");
  } else {
    navbar.classList.remove("navbar-scrolled");
  }
});

// Enhanced floating animation for decorative elements
// (Removed since decorative elements are removed)

// Smooth hover effects
document
  .querySelectorAll(".btn-contact, .btn-hear-from-us")
  .forEach((button) => {
    button.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px) scale(1.05)";
    });

    button.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });

// Mobile menu enhancement
const navbarToggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");

navbarToggler.addEventListener("click", function () {
  setTimeout(() => {
    if (navbarCollapse.classList.contains("show")) {
      navbarCollapse.style.backdropFilter = "blur(20px)";
      navbarCollapse.style.background = "rgba(0, 0, 231, 0.95)";
    }
  }, 150);
});

// Parallax effect for hero image
window.addEventListener("scroll", function () {
  const scrolled = window.pageYOffset;
  const heroImage = document.querySelector(".hero-main-image");
  if (heroImage) {
    heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".count");
  counters.forEach((counter) => {
    let target = +counter.getAttribute("data-count");
    let count = 0;
    let step = target / 100;

    function updateCount() {
      if (count < target) {
        count += step;
        counter.innerText = Math.ceil(count);
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    }

    updateCount();
  });
});
