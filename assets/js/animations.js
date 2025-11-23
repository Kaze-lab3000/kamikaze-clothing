// Advanced animations for KAMIKAZE website

class KAMIKAZEAnimations {
    constructor() {
        this.initAnimations();
        this.setupScrollAnimations();
        this.setupCursor();
    }

    initAnimations() {
        // GSAP animations initialization
        if (typeof gsap !== 'undefined') {
            this.setupGSAPAnimations();
        } else {
            this.setupFallbackAnimations();
        }
    }

    setupGSAPAnimations() {
        // Hero section animations
        gsap.from('.hero-title', {
            duration: 1.5,
            y: 100,
            opacity: 0,
            ease: 'power3.out',
            delay: 0.5
        });

        gsap.from('.hero-subtitle', {
            duration: 1.5,
            y: 50,
            opacity: 0,
            ease: 'power3.out',
            delay: 1
        });

        gsap.from('.cta-button', {
            duration: 1,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)',
            delay: 1.5
        });

        // Section reveal animations
        this.setupScrollReveal();
    }

    setupFallbackAnimations() {
        // Fallback animations using vanilla JS
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections for fade-up animation
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    setupScrollReveal() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Mission section
            gsap.from('.mission-content', {
                scrollTrigger: {
                    trigger: '.mission',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });

            // Product cards
            gsap.from('.product-card', {
                scrollTrigger: {
                    trigger: '.featured',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: 'power3.out'
            });

            // Newsletter
            gsap.from('.newsletter-content', {
                scrollTrigger: {
                    trigger: '.newsletter',
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }
    }

    setupScrollAnimations() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(11, 11, 11, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(11, 11, 11, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }

    setupCursor() {
        const cursor = document.querySelector('.cursor');
        const follower = document.querySelector('.cursor-follower');
        
        if (!cursor || !follower) return;

        let posX = 0, posY = 0;
        let mouseX = 0, mouseY = 0;

        // Hide cursor on touch devices
        if ('ontouchstart' in window) {
            cursor.style.display = 'none';
            follower.style.display = 'none';
            document.body.classList.add('no-cursor');
            return;
        }

        gsap.to({}, {
            duration: 0.016,
            repeat: -1,
            onRepeat: () => {
                posX += (mouseX - posX) / 9;
                posY += (mouseY - posY) / 9;

                gsap.set(cursor, {
                    css: {
                        left: mouseX,
                        top: mouseY
                    }
                });

                gsap.set(follower, {
                    css: {
                        left: posX - 20,
                        top: posY - 20
                    }
                });
            }
        });

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Cursor hover effects
        const hoverElements = document.querySelectorAll('a, button, .product-card, .nav-link');
        
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                follower.style.transform = 'scale(1.2)';
                follower.style.background = 'rgba(166, 0, 0, 0.1)';
            });

            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                follower.style.transform = 'scale(1)';
                follower.style.background = 'transparent';
            });
        });

        // Cursor click effect
        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'scale(0.8)';
            follower.style.transform = 'scale(0.8)';
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
        });
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new KAMIKAZEAnimations();
});
