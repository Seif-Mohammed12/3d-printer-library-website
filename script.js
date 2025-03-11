// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
  
    toggleButton.addEventListener('click', () => {
      navbar.classList.toggle('active');
    });
  
    // Optional: close menu when a link is clicked (on mobile)
    document.querySelectorAll('.navbar a').forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('active');
      });
    });
  });

  
  document.addEventListener("DOMContentLoaded", () => {
    const track = document.querySelector(".carousel-track");
    const cards = document.querySelectorAll(".printer-card");
    const btnLeft = document.querySelector(".carousel-btn.left");
    const btnRight = document.querySelector(".carousel-btn.right");
    const dotsContainer = document.querySelector(".carousel-dots");
  
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let animationFrameId;
  
    const isMobile = () => window.innerWidth <= 768;
    const cardsToShow = () => (isMobile() ? 1 : 2);
  
    function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 20;
      const newTransform = -currentIndex * cardWidth;
      track.style.transition = "transform 0.4s ease-in-out";
      track.style.transform = `translateX(${newTransform}px)`;
  
      if (isMobile()) updateDots();
    }
  
    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const totalPages = cards.length;
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === currentIndex) dot.classList.add("active");
        dotsContainer.appendChild(dot);
      }
    }
  
    function showButtons() {
      const visible = !isMobile();
      btnLeft.style.display = visible ? "block" : "none";
      btnRight.style.display = visible ? "block" : "none";
      dotsContainer.style.display = visible ? "none" : "flex";
    }
  
    function moveNext() {
      if (isMobile()) {
        currentIndex = (currentIndex + 1) % cards.length;
      } else {
        const maxIndex = cards.length - cardsToShow();
        if (currentIndex < maxIndex) currentIndex++;
      }
      updateCarousel();
    }
  
    function movePrev() {
      if (isMobile()) {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      } else {
        if (currentIndex > 0) currentIndex--;
      }
      updateCarousel();
    }
  
    btnLeft.addEventListener("click", movePrev);
    btnRight.addEventListener("click", moveNext);
  
    // ✅ TOUCH EVENTS
    track.addEventListener("touchstart", (e) => {
      e.preventDefault();
      startX = e.touches[0].clientX;
      isDragging = true;
      track.style.transition = "none";
    });
  
    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const moveX = e.touches[0].clientX;
      const diff = startX - moveX;
  
      const currentTransform = -currentIndex * (cards[0].offsetWidth + 20);
      track.style.transform = `translateX(${currentTransform - diff}px)`;
    });
  
    track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      const threshold = 50;
  
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < cards.length - 1) {
          moveNext();
        } else if (diff < 0 && currentIndex > 0) {
          movePrev();
        } else {
          updateCarousel(); // Reset if at the end or beginning
        }
      } else {
        updateCarousel(); // Reset if swipe wasn't strong enough
      }
  
      isDragging = false;
      track.style.transition = "transform 0.4s ease-in-out";
    });
  
    window.addEventListener("resize", () => {
      showButtons();
      updateCarousel();
    });
  
    // INIT
    showButtons();
    updateCarousel();
  });
