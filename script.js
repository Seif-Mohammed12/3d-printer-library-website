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
    let currentTranslate = 0;
    let prevTranslate = 0;
  
    const isMobile = () => window.innerWidth <= 768;
    const cardsToShow = () => (isMobile() ? 1 : 2);
  
    function updateCarousel(transition = true) {
      const cardWidth = cards[0].offsetWidth + 20;
      currentTranslate = -currentIndex * cardWidth;
      
      track.style.transition = transition ? "transform 0.4s ease-in-out" : "none";
      track.style.transform = `translateX(${currentTranslate}px)`;
      updateDots();
    }
  
    function updateDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const totalPages = isMobile() ? cards.length : Math.ceil(cards.length / 2);
      
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === Math.floor(currentIndex / cardsToShow())) {
          dot.classList.add("active");
        }
        dot.addEventListener('click', () => {
          currentIndex = i * cardsToShow();
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }
  
    // Touch Events with improved handling
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
      prevTranslate = currentTranslate;
      track.style.transition = "none";
    }, { passive: true });
  
    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      currentTranslate = prevTranslate - diff;
      
      requestAnimationFrame(() => {
        track.style.transform = `translateX(${currentTranslate}px)`;
      });
    }, { passive: false });
  
    track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      
      const cardWidth = cards[0].offsetWidth + 20;
      const diff = startX - e.changedTouches[0].clientX;
      const threshold = cardWidth * 0.2; // 20% of card width
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < cards.length - cardsToShow()) {
          currentIndex += 1; // Move one card at a time
        } else if (diff < 0 && currentIndex > 0) {
          currentIndex -= 1; // Move one card at a time
        }
      }
      
      isDragging = false;
      track.style.transition = "transform 0.4s ease-in-out";
      updateCarousel();
    });

    // Add touch cancel handler
    track.addEventListener("touchcancel", () => {
      isDragging = false;
      track.style.transition = "transform 0.4s ease-in-out";
      updateCarousel();
    });

    // Initialization
    function init() {
      showButtons();
      updateCarousel();
      dotsContainer.style.display = 'flex';
    }

    function showButtons() {
      const visible = !isMobile();
      btnLeft.style.display = visible ? "block" : "none";
      btnRight.style.display = visible ? "block" : "none";
    }

    btnLeft.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex -= cardsToShow();
        updateCarousel();
      }
    });

    btnRight.addEventListener("click", () => {
      if (currentIndex < cards.length - cardsToShow()) {
        currentIndex += cardsToShow();
        updateCarousel();
      }
    });

    window.addEventListener("resize", () => {
      init();
    });

    init();
  });
