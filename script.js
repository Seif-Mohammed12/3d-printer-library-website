// Add this before your DOM content loaded event
async function loadRandomPrinters(count = 6) {
  try {
    const response = await fetch('data/printers.json');
    const data = await response.json();
    
    // Shuffle array and get first 'count' items
    const randomPrinters = data.printers
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    // Update carousel content
    const track = document.querySelector('.carousel-track');
    track.innerHTML = randomPrinters.map(printer => `
      <div class="printer-card">
        <img src="${printer.image}" alt="${printer.name}">
        <h3>${printer.name}</h3>
        <p>${printer.description}</p>
        <button class="view-button">View Details</button>
      </div>
    `).join('');

    // Reinitialize carousel
    init();
  } catch (error) {
    console.error('Error loading printers:', error);
  }
}

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

    // Load random printers
    loadRandomPrinters();
  });

  
  document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('data/printers.json');
        const data = await response.json();
        
        // Get random printers
        const randomPrinters = data.printers
            .sort(() => Math.random() - 0.5)
            .slice(0, 4); // Show 4 random printers

        // Update carousel content
        const track = document.querySelector('.carousel-track');
        track.innerHTML = randomPrinters.map(printer => `
            <div class="printer-card">
                <img src="${printer.image}" alt="${printer.name}">
                <h3>${printer.name}</h3>
                <p>${printer.description}</p>
                <a href="#" class="view-button">View Details</a>
            </div>
        `).join('');

        // Initialize carousel
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
    } catch (error) {
        console.error('Error loading printers:', error);
    }
  });
