document.addEventListener('DOMContentLoaded', () => {
    
    /* ----------------------------
       1. MOBILE MENU TOGGLE
    ---------------------------- */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    });


    /* ----------------------------
       2. STICKY HEADER
    ---------------------------- */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ----------------------------
       3. ACTIVE LINK HIGHLIGHTER
    ---------------------------- */
    const sections = document.querySelectorAll('section[id]');

    function scrollActive() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset for header
            const sectionId = current.getAttribute('id');
            const link = document.querySelector('.nav-menu a[href*=' + sectionId + ']');

            if (link) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
    }
    window.addEventListener('scroll', scrollActive);


    /* ----------------------------
       4. SWIPER INITIALIZATION
    ---------------------------- */
    let swiper = new Swiper(".review-swiper", {
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 2, // Keeps cards large and readable
                spaceBetween: 40,
            },
        },
    });


    /* ----------------------------
       5. SCROLL ANIMATION (OBSERVER)
    ---------------------------- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-on-scroll');
    fadeElements.forEach(el => observer.observe(el));
});

/* ----------------------------
       6. HERO BUBBLES ANIMATION
    ---------------------------- */
    const initBubbles = () => {
        const container = document.getElementById('bubble-container');
        if (!container) return;

        // CONFIGURATION
        const bubbleCount = 8; // Keep it low for "Calm" vibe
        const bubbles = [];
        const baseSpeed = 0.5; // Slow movement for relaxation
        
        // Colors: Different opacities of the brand brown (#8C7060)
        const colors = [
            'rgba(140, 112, 96, 0.1)', 
            'rgba(140, 112, 96, 0.15)', 
            'rgba(140, 112, 96, 0.2)',
            'rgba(107, 84, 70, 0.12)'  // Darker accent
        ];

        class Bubble {
            constructor(id) {
                this.id = id;
                // Random Size between 80px and 200px
                this.radius = Math.random() * 60 + 40; 
                this.diameter = this.radius * 2;
                
                // Random Position
                this.x = Math.random() * (container.offsetWidth - this.diameter);
                this.y = Math.random() * (container.offsetHeight - this.diameter);
                
                // Random Velocity (Slow & Calm)
                this.vx = (Math.random() - 0.5) * baseSpeed;
                this.vy = (Math.random() - 0.5) * baseSpeed;
                
                // Mass matches size (larger bubbles are heavier)
                this.mass = this.radius;

                // Create DOM Element
                this.element = document.createElement('div');
                this.element.classList.add('bubble');
                this.element.style.width = `${this.diameter}px`;
                this.element.style.height = `${this.diameter}px`;
                this.element.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                
                container.appendChild(this.element);
            }

            update() {
                // Move
                this.x += this.vx;
                this.y += this.vy;

                // Wall Collision (Bounce)
                if (this.x <= 0) {
                    this.x = 0;
                    this.vx *= -1;
                } else if (this.x + this.diameter >= container.offsetWidth) {
                    this.x = container.offsetWidth - this.diameter;
                    this.vx *= -1;
                }

                if (this.y <= 0) {
                    this.y = 0;
                    this.vy *= -1;
                } else if (this.y + this.diameter >= container.offsetHeight) {
                    this.y = container.offsetHeight - this.diameter;
                    this.vy *= -1;
                }

                // Apply to DOM
                this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
            }
        }

        // Initialize Bubbles
        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push(new Bubble(i));
        }

        // Check Collision between two bubbles
        function checkCollision(b1, b2) {
            // Get center points
            let b1x = b1.x + b1.radius;
            let b1y = b1.y + b1.radius;
            let b2x = b2.x + b2.radius;
            let b2y = b2.y + b2.radius;

            // Calculate distance
            let dx = b2x - b1x;
            let dy = b2y - b1y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // If distance < sum of radii, they have collided
            if (distance < b1.radius + b2.radius) {
                resolveCollision(b1, b2, dx, dy, distance);
            }
        }

        // Resolve Elastic Collision
        function resolveCollision(b1, b2, dx, dy, distance) {
            // Normal vector
            const nx = dx / distance;
            const ny = dy / distance;

            // Tangent vector
            const tx = -ny;
            const ty = nx;

            // Dot Product Tangent
            const dpTan1 = b1.vx * tx + b1.vy * ty;
            const dpTan2 = b2.vx * tx + b2.vy * ty;

            // Dot Product Normal (The velocity component towards collision)
            const dpNorm1 = b1.vx * nx + b1.vy * ny;
            const dpNorm2 = b2.vx * nx + b2.vy * ny;

            // Conservation of momentum in 1D
            const m1 = b1.mass;
            const m2 = b2.mass;

            const mom1 = (dpNorm1 * (m1 - m2) + 2 * m2 * dpNorm2) / (m1 + m2);
            const mom2 = (dpNorm2 * (m2 - m1) + 2 * m1 * dpNorm1) / (m1 + m2);

            // Update velocities
            b1.vx = tx * dpTan1 + nx * mom1;
            b1.vy = ty * dpTan1 + ny * mom1;
            b2.vx = tx * dpTan2 + nx * mom2;
            b2.vy = ty * dpTan2 + ny * mom2;

            // Prevent sticking: Move them apart slightly so they don't overlap next frame
            const overlap = (b1.radius + b2.radius - distance) / 2;
            b1.x -= overlap * nx;
            b1.y -= overlap * ny;
            b2.x += overlap * nx;
            b2.y += overlap * ny;
        }

        // Animation Loop
        function animate() {
            // Update individual positions
            bubbles.forEach(b => b.update());

            // Check collisions (compare every pair)
            for (let i = 0; i < bubbles.length; i++) {
                for (let j = i + 1; j < bubbles.length; j++) {
                    checkCollision(bubbles[i], bubbles[j]);
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    };

    // Run the function
    initBubbles();