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
    let autoplayInterval;
    let touchStartX = 0;
    let touchEndX = 0;
  
    const isMobile = () => window.innerWidth <= 768;
    const cardsToShow = () => (isMobile() ? 1 : 2);
  
    function updateCarousel() {
      const cardWidth = cards[0].offsetWidth + 20;
      const newTransform = -currentIndex * cardWidth;
      track.style.transition = "transform 0.5s ease-in-out";
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
  
    track.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });
  
    track.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  
    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) moveNext();
      else if (touchEndX > touchStartX + swipeThreshold) movePrev();
    }
  
    function startAutoplay() {
      stopAutoplay(); // Clear existing first
      if (isMobile()) {
        autoplayInterval = setInterval(() => {
          moveNext();
        }, 3000); // change slide time interval
      }
    }
  
    function stopAutoplay() {
      clearInterval(autoplayInterval);
    }
  
    window.addEventListener("resize", () => {
      currentIndex = 0;
      showButtons();
      updateCarousel();
      startAutoplay();
    });
  
    // Initialize
    showButtons();
    updateCarousel();
    startAutoplay();
  });
  