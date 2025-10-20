// Loader animation
const loader = document.querySelector("#loader");
window.addEventListener('load', () => {
  setTimeout(() => { loader.style.top = "-100%"; }, 4000);
});

// Locomotive scroll
function initializeLocomotiveScroll() {
  try {
    const scroll = new LocomotiveScroll({
      el: document.querySelector('#main'),
      smooth: true
    });
  } catch (error) {
    console.error("Locomotive Scroll Error:", error);
  }
}
window.addEventListener('load', initializeLocomotiveScroll);

// Swiper setup
function initializeSwiper() {
  try {
    new Swiper(".mySwiper", {
      slidesPerView: 'auto',
      spaceBetween: 30,
      freeMode: true,
      pagination: { el: ".swiper-pagination", clickable: true },
      breakpoints: {
        600: { slidesPerView: 1.5, spaceBetween: 20 },
        1000: { slidesPerView: 4, spaceBetween: 30 }
      }
    });
  } catch (error) {
    console.error("Swiper Error:", error);
  }
}
document.addEventListener('DOMContentLoaded', initializeSwiper);

// Fixed image hover
const elemContainer = document.querySelector("#elem-container");
const fixedImage = document.querySelector("#fixed-image");
if (elemContainer && fixedImage) {
  elemContainer.addEventListener("mouseenter", () => {
    if (window.innerWidth > 600) fixedImage.style.display = "block";
  });
  elemContainer.addEventListener("mouseleave", () => fixedImage.style.display = "none");
  document.querySelectorAll(".elem").forEach(elem => {
    elem.addEventListener("mouseenter", () => {
      const imagePath = elem.getAttribute("data-image");
      fixedImage.style.backgroundImage = `url(${imagePath})`;
    });
  });
}

// Fullscreen menu toggle
const menuButton = document.querySelector('nav h3');
const fullScreenMenu = document.querySelector('#full-scr');
let isMenuOpen = false;
if (menuButton && fullScreenMenu) {
  menuButton.addEventListener('click', () => {
    fullScreenMenu.style.top = isMenuOpen ? "-100%" : "0";
    isMenuOpen = !isMenuOpen;
  });
}

// Video mute toggle
const video = document.getElementById("heroVideo");
if (video) {
  video.addEventListener("click", () => { video.muted = !video.muted; });
}
