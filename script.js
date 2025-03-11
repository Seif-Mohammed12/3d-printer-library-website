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
    // Menu toggle functionality
    const toggleButton = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
  
    toggleButton.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
  
    // Close menu when a link is clicked (on mobile)
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });

    // Carousel initialization
    initializeCarousel();
});

async function initializeCarousel() {
    try {
        const response = await fetch('data/printers.json');
        const data = await response.json();
        
        const carouselInner = document.querySelector('.carousel-inner');
        const indicators = document.querySelector('.carousel-indicators');
        
        // Clear existing content
        carouselInner.innerHTML = '';
        indicators.innerHTML = '';
        
        // Group printers into pairs for desktop view
        const itemsPerSlide = window.innerWidth <= 768 ? 1 : 2;
        const groups = [];
        
        for (let i = 0; i < data.printers.length; i += itemsPerSlide) {
            groups.push(data.printers.slice(i, i + itemsPerSlide));
        }
        
        // Create carousel items and indicators
        groups.forEach((group, index) => {
            const item = document.createElement('div');
            item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            const row = document.createElement('div');
            row.className = 'row g-4 justify-content-center';
            
            group.forEach(printer => {
                const col = document.createElement('div');
                col.className = 'col-12 col-md-6';
                col.innerHTML = `
                    <div class="printer-card">
                        <img src="${printer.image}" alt="${printer.name}" class="card-img-top">
                        <div class="card-body">
                            <h3 class="card-title">${printer.name}</h3>
                            <p class="card-text">${printer.description}</p>
                            <button class="btn btn-primary view-button">View Details</button>
                        </div>
                    </div>
                `;
                row.appendChild(col);
            });
            
            item.appendChild(row);
            carouselInner.appendChild(item);
            
            // Create indicator
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#printerCarousel');
            indicator.setAttribute('data-bs-slide-to', index.toString());
            if (index === 0) {
                indicator.classList.add('active');
            }
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            indicators.appendChild(indicator);
        });
        
        // Initialize Bootstrap carousel
        const carousel = new bootstrap.Carousel(document.getElementById('printerCarousel'), {
            interval: 5000,
            touch: true,
            ride: 'carousel'
        });
        
    } catch (error) {
        console.error('Error loading printers:', error);
    }
}
