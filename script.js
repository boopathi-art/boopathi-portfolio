/**
 * ==============================================================================
 * BOOPATHI U — CLOUD & DEVOPS DEVELOPER PORTFOLIO JAVASCRIPT
 * Modern, Vanilla JS handling animations, filters, theme, and interactive UI
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. Ambient Mouse Glow Tracking (High Performance requestAnimationFrame)
       -------------------------------------------------------------------------- */
    const ambientGlow = document.getElementById('ambientGlow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });

    function animateGlow() {
        if (ambientGlow) {
            // Smooth linear interpolation (lerp)
            currentX += (mouseX - currentX) * 0.12;
            currentY += (mouseY - currentY) * 0.12;
            ambientGlow.style.left = `${currentX}px`;
            ambientGlow.style.top = `${currentY}px`;
        }
        requestAnimationFrame(animateGlow);
    }
    animateGlow();


    /* --------------------------------------------------------------------------
       2. Dark / Light Theme Toggle with LocalStorage Persistence
       -------------------------------------------------------------------------- */
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

    // Set initial theme
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }


    /* --------------------------------------------------------------------------
       3. Navbar Scroll Elevation & Mobile Menu Toggle
       -------------------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('open');
            navMenu.classList.toggle('open');
            mobileToggle.classList.toggle('active');
            mobileToggle.setAttribute('aria-expanded', !isOpen);
        });

        // Close mobile menu when clicking outside or clicking any nav link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /* --------------------------------------------------------------------------
       4. ScrollSpy: Highlight Active Nav Link
       -------------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 160;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();


    /* --------------------------------------------------------------------------
       5. Animated Number Counters for Hero Metrics
       -------------------------------------------------------------------------- */
    const counters = document.querySelectorAll('.counter');
    let hasAnimatedCounters = false;

    function runCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1200; // ms
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.ceil(current);
                }
            }, stepTime);
        });
    }

    const heroSection = document.getElementById('hero');
    if (heroSection && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimatedCounters) {
                    hasAnimatedCounters = true;
                    runCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        counterObserver.observe(heroSection);
    }


    /* --------------------------------------------------------------------------
       6. Skill Bar Fill Animation on Scroll
       -------------------------------------------------------------------------- */
    const skillBars = document.querySelectorAll('.meter-fill');
    const skillsSection = document.getElementById('skills');

    if (skillsSection && skillBars.length > 0) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillBars.forEach(bar => {
                        const targetWidth = bar.style.getPropertyValue('--level');
                        bar.style.width = targetWidth || '80%';
                    });
                }
            });
        }, { threshold: 0.2 });

        skillsObserver.observe(skillsSection);
    }


    /* --------------------------------------------------------------------------
       7. Interactive Project Filtering (ALL, CLOUD, DEVOPS, BACKEND, IDEAS)
       -------------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filterValue = btn.getAttribute('data-filter');

            // Filter project cards
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                const categoryList = categories.split(' ');

                if (filterValue === 'all' || categoryList.includes(filterValue)) {
                    card.style.display = 'flex';
                    // Trigger fade/scale in
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });


    /* --------------------------------------------------------------------------
       8. PROXIMA / LA-EWS Concept Modal Dialog Logic
       -------------------------------------------------------------------------- */
    const openProximaBtn = document.getElementById('openProximaModalBtn');
    const proximaModal = document.getElementById('proximaModal');
    const closeProximaBtn = document.getElementById('closeProximaModalBtn');
    const modalDismissBtn = document.getElementById('modalDismissBtn');

    function openModal() {
        if (proximaModal) {
            proximaModal.classList.add('active');
            proximaModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    function closeModal() {
        if (proximaModal) {
            proximaModal.classList.remove('active');
            proximaModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (openProximaBtn) {
        openProximaBtn.addEventListener('click', openModal);
    }
    if (closeProximaBtn) {
        closeProximaBtn.addEventListener('click', closeModal);
    }
    if (modalDismissBtn) {
        modalDismissBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    if (proximaModal) {
        proximaModal.addEventListener('click', (e) => {
            if (e.target === proximaModal) {
                closeModal();
            }
        });
    }

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && proximaModal && proximaModal.classList.contains('active')) {
            closeModal();
        }
    });


    /* --------------------------------------------------------------------------
       9. Copy Email to Clipboard with Toast Notification
       -------------------------------------------------------------------------- */
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailText = document.getElementById('emailText');
    const toast = document.getElementById('toastNotification');

    if (copyEmailBtn && emailText) {
        copyEmailBtn.addEventListener('click', async () => {
            const email = emailText.textContent.trim();
            try {
                await navigator.clipboard.writeText(email);
                showToast('Email address copied to clipboard!');
            } catch (err) {
                // Fallback for older browsers
                const tempInput = document.createElement('input');
                tempInput.value = email;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast('Email address copied to clipboard!');
            }
        });
    }

    function showToast(message) {
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }


    /* --------------------------------------------------------------------------
       10. Back to Top Smooth Scroll
       -------------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Developer Console Badge
    console.log(
        "%c⚡ BOOPATHI U — CLOUD & DEVOPS PORTFOLIO LOADED",
        "color: #00F5D4; background: #0B1120; padding: 6px 12px; font-size: 13px; font-weight: bold; border-radius: 4px;"
    );
    console.log(
        "%cAWS • Docker • Jenkins • Terraform • Kubernetes • C/C++/Python",
        "color: #38BDF8; font-size: 11px;"
    );
});