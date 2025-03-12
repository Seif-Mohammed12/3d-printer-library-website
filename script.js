document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('#mainNav');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', function() {
            console.log('Menu button clicked'); // Debug line
            navbar.classList.toggle('active');
            const isExpanded = navbar.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && !menuToggle.contains(e.target)) {
                navbar.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Initialize carousel
    initializeCarousel();
});

async function initializeCarousel() {
    try {
        const response = await fetch('data/printers.json');
        const data = await response.json();
        
        const carouselInner = document.querySelector('.carousel-inner');
        const indicators = document.querySelector('.carousel-indicators');
        const isMobile = window.innerWidth <= 768;
        
        // Clear existing content
        carouselInner.innerHTML = '';
        indicators.innerHTML = '';
        
        // Group printers (1 per slide on mobile, 2 on desktop)
        const groupSize = isMobile ? 1 : 2;
        const groups = [];
        for (let i = 0; i < data.printers.length; i += groupSize) {
            groups.push(data.printers.slice(i, Math.min(i + groupSize, data.printers.length)));
        }
        
        // Create carousel items
        groups.forEach((group, index) => {
            const item = document.createElement('div');
            item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
            
            const container = document.createElement('div');
            container.className = 'd-flex justify-content-center gap-4';
            
            group.forEach(printer => {
                const card = document.createElement('div');
                card.className = 'printer-card';
                card.style.width = '600px'; // Reduced from 800px to 600px
                card.innerHTML = `
                    <div class="card-inner">
                        <img src="${printer.image}" alt="${printer.name}">
                        <div class="card-body">
                            <h3 class="card-title">${printer.name}</h3>
                            <p class="card-text">${printer.description}</p>
                            <button class="btn btn-primary view-button">View Details</button>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
            
            item.appendChild(container);
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
        
        // Initialize Bootstrap carousel with mobile-optimized options
        new bootstrap.Carousel(document.getElementById('printerCarousel'), {
            interval: 5000,
            touch: true,
            ride: false, // Disable auto start
            pause: false, // Disable pause on hover
            keyboard: true,
            wrap: true,
            swipe: true,
            transition: isMobile ? 300 : 400 // Faster transition on mobile
        });

        // Force immediate transition and handle resize
        const handleTransition = () => {
            const activeItem = document.querySelector('.carousel-item.active');
            if (activeItem) {
                activeItem.style.transition = `transform ${window.innerWidth <= 768 ? 0.3 : 0.4}s ease-in-out`;
            }
        };

        setTimeout(handleTransition, 100);
        window.addEventListener('resize', handleTransition);
        
    } catch (error) {
        console.error('Error loading printers:', error);
    }
}

// Add resize handler to update grouping when switching between mobile and desktop
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    if ((width <= 768 && !isMobile) || (width > 768 && isMobile)) {
        isMobile = width <= 768;
        initializeCarousel();
    }
});
