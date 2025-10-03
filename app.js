// Dynamic JavaScript for all pages
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize page-specific functionality
    initializePageFeatures();
    
    // Common functionality for all pages
    initializeCommonFeatures();
    
    function initializePageFeatures() {
        const currentPage = getCurrentPage();
        
        switch(currentPage) {
            case 'index':
                initializeHomePage();
                break;
            case 'product':
                initializeProductPage();
                break;
            case 'product-detail':
                initializeProductDetailPage();
                break;
            case 'room':
                initializeRoomPage();
                break;
            case 'aboutus':
                initializeAboutPage();
                break;
            case 'contactus':
                initializeContactPage();
                break;
        }
    }
    
    function getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().split('.')[0];
        return filename || 'index';
    }
    
    function initializeCommonFeatures() {
        // Mobile menu toggle
        initializeMobileMenu();
        
        // Smooth scrolling for anchor links
        initializeSmoothScrolling();
        
        // Form validation
        initializeFormValidation();
        
        // Newsletter subscription
        initializeNewsletterForm();
        
        // Lazy loading for images
        initializeLazyLoading();
    }
    
    function initializeMobileMenu() {
        const mobileMenuBtn = document.querySelector('[data-bs-toggle="offcanvas"]');
        const offcanvasMenu = document.getElementById('offcanvasNavbar');
        
        if (mobileMenuBtn && offcanvasMenu) {
            // Close menu when clicking on nav links
            const navLinks = offcanvasMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasMenu);
                    if (bsOffcanvas) {
                        bsOffcanvas.hide();
                    }
                });
            });
        }
    }
    
    function initializeSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    function initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                }
                form.classList.add('was-validated');
            });
        });
    }
    
    function initializeNewsletterForm() {
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]').value;
                if (email) {
                    showNotification('Thank you for subscribing to our newsletter!');
                    form.reset();
                }
            });
        });
    }
    
    function initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Page-specific initializations
    function initializeHomePage() {
        // Hero slider or animations
        console.log('Home page initialized');
    }
    
    function initializeProductPage() {
        // Product filtering, sorting
        console.log('Product page initialized');
    }
    
    function initializeProductDetailPage() {
        // Product image gallery, quantity selector
        console.log('Product detail page initialized');
    }
    
    function initializeRoomPage() {
        // Room category filtering
        console.log('Room page initialized');
    }
    
    function initializeAboutPage() {
        // Counter animations
        initializeCounterAnimation();
    }
    
    function initializeContactPage() {
        // Contact form specific validation
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you for your message! We will get back to you soon.');
                this.reset();
            });
        }
    }
    
    function initializeCounterAnimation() {
        const counters = document.querySelectorAll('.counter');
        if (counters.length === 0) return;
        
        let animated = false;
        
        function animateCounters() {
            if (animated) return;
            animated = true;
            
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target === 1000 ? '1000+' : target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current);
                    }
                }, 20);
            });
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                }
            });
        });
        
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    // Utility functions
    function showNotification(message) {
        const notification = document.getElementById('add-to-cart-notification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        } else {
            // Fallback to alert if notification element doesn't exist
            alert(message);
        }
    }
    
    // Responsive utilities
    function handleResize() {
        const width = window.innerWidth;
        
        // Adjust map height on mobile
        const mapContainer = document.querySelector('.map-container iframe');
        if (mapContainer && width < 768) {
            mapContainer.style.height = '300px';
        } else if (mapContainer) {
            mapContainer.style.height = '600px';
        }
        
        // Adjust contact form padding on mobile
        const contactFormContainer = document.querySelector('.contact-form .w-100');
        if (contactFormContainer && width < 768) {
            contactFormContainer.style.padding = '30px 20px';
        } else if (contactFormContainer) {
            contactFormContainer.style.padding = '60px 50px';
        }
    }
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial resize check
    handleResize();
    
    // Expose utilities globally
    window.appUtils = {
        showNotification: showNotification,
        getCurrentPage: getCurrentPage
    };
});