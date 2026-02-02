// ==========================================
// Portfolio - محمد علي - مطور ويب
// JavaScript - Dark Neon Theme
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initMobileMenu();
    initThemeToggle();
    initLanguageToggle();
    initTypingEffect();
    initCounters();
    initSkillBars();
    initSkillTabs();
    initAppFilter();
    initServicesSlider();
    // initServicesArch();
    initProjectsCarousel();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initSmoothScroll();
    initPushNotifications();
});

// Preloader
function initPreloader() {
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            // Start hero animations after preloader finishes
            startHeroAnimations();
        }, 2500);
    });
}

// Start Hero Animations
function startHeroAnimations() {
    const heroElements = [
        '.hero-title .line',
        '.hero-title .name',
        '.hero-title .role',
        '.hero-description',
        '.hero-actions',
        '.hero-visual'
    ];

    heroElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('animate');
        }
    });
}

// Theme Toggle
function initNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    let ticking = false;

    // Scroll effect with throttling
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // Update active link
                let current = '';
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 150;
                    if (window.scrollY >= sectionTop) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${current}`) {
                        link.classList.add('active');
                    }
                });

                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    const overlay = document.getElementById('navOverlay');
    const links = menu.querySelectorAll('.nav-link');

    function openMenu() {
        toggle.classList.add('active');
        menu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate menu links
        links.forEach((link, index) => {
            link.style.animation = `none`;
            setTimeout(() => {
                link.style.animation = `slideInFromRight 0.4s ease ${index * 0.05}s both`;
            }, 10);
        });
    }

    function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking overlay
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Theme Toggle
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    document.documentElement.setAttribute('data-theme', savedTheme);

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// Typing Effect
function initTypingEffect() {
    const typed = document.getElementById('typed');

    if (!typed) return; // Exit if element doesn't exist

    const currentLang = localStorage.getItem('lang') || 'ar';

    // Set initial words based on language
    window.typingWords = currentLang === 'ar'
        ? ['بورتفوليو', 'صفحات هبوط', 'مواقع شركات']
        : ['Portfolio', 'Landing Pages', 'Company Sites'];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const words = window.typingWords;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typed.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typed.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// Animated Counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    function animateCounter(element, target) {
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const increment = target / 60;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = isDecimal ? target.toFixed(1) : target;
                clearInterval(timer);
            } else {
                element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            }
        }, 30);
    }
}

// Skill Bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Skill Tabs
function initSkillTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.skills-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === tab) {
                    panel.classList.add('active');
                    // Re-trigger skill bar animations
                    panel.querySelectorAll('.skill-progress').forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = progress + '%';
                        }, 100);
                    });
                }
            });
        });
    });
}

// Services Slider
function initServicesSlider() {
    if (typeof Swiper !== 'undefined' && document.querySelector('.services-slider')) {
        new Swiper('.services-slider', {
            spaceBetween: 30,
            effect: 'fade',
            loop: true,
            mousewheel: {
                invert: false,
            },
            pagination: {
                el: '.services-slider__pagination',
                clickable: true,
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
        });
    }
}

// Services Cards Scroll Animation with Fade Out Effect
function initServicesArch() {
    const cards = document.querySelectorAll('.service-card-scroll');
    if (!cards.length) return;

    // Get sticky top values for each card (matches CSS)
    const stickyTops = [100, 130, 160, 190, 220, 250];

    function handleScroll() {
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const stickyTop = stickyTops[index] || 100;

            // Check if card is at its sticky position
            const distanceFromSticky = rect.top - stickyTop;
            const cardHeight = rect.height;

            // When the next card pushes this one, start fading
            const nextCard = cards[index + 1];
            if (nextCard) {
                const nextRect = nextCard.getBoundingClientRect();
                const nextStickyTop = stickyTops[index + 1] || stickyTop + 20;

                // Calculate overlap
                const overlap = (stickyTop + cardHeight) - nextRect.top;

                if (overlap > 0 && rect.top <= stickyTop + 5) {
                    // Card is being pushed out by next card
                    const progress = Math.min(overlap / (cardHeight * 0.5), 1);
                    const opacity = 1 - progress;
                    const scale = 1 - (progress * 0.08);
                    const translateY = -progress * 30;

                    card.style.opacity = Math.max(0, opacity).toFixed(2);
                    card.style.transform = `translateY(${translateY}px) scale(${scale.toFixed(3)})`;
                } else if (rect.top <= stickyTop + 5) {
                    // Card is sticky but not being pushed yet
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                } else {
                    // Card hasn't reached sticky position yet
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }
            } else {
                // Last card - no fade out needed
                card.style.opacity = '1';
                card.style.transform = 'translateY(0) scale(1)';
            }
        });
    }

    // Throttle scroll for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    handleScroll();
}

// Project Filter
function initAppFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card, .app-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projects.forEach((project, index) => {
                const category = project.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'translateY(0)';
                    }, index * 100);
                } else {
                    project.style.opacity = '0';
                    project.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        project.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Projects Carousel
function initProjectsCarousel() {
    const websitesData = [
        {
            name: { ar: "Nova Studios", en: "Nova Studios" },
            type: { ar: "بورتفوليو مصور سينمائي", en: "Cinematographer Portfolio" },
            desc: { ar: "موقع شخصي بتصميم سينمائي داكن مع أنيميشن احترافية", en: "Personal website with dark cinematic design and professional animations" },
            link: "projects/01-portfolio1.html"
        },
        {
            name: { ar: "لينا المصممة", en: "Lina The Designer" },
            type: { ar: "بورتفوليو مصممة UX", en: "UX Designer Portfolio" },
            desc: { ar: "تصميم عصري وأنيق لمصممة تجارب رقمية", en: "Modern and elegant design for a digital experience designer" },
            link: "projects/02-portfolio2.html"
        },
        {
            name: { ar: "NexusAI", en: "NexusAI" },
            type: { ar: "منصة ذكاء اصطناعي", en: "AI Platform" },
            desc: { ar: "صفحة أسعار عصرية لمنصة ذكاء اصطناعي مع باقات متنوعة", en: "Modern pricing page for AI platform with diverse packages" },
            link: "projects/03-pricing1.html"
        },
        {
            name: { ar: "GrowthLab", en: "GrowthLab" },
            type: { ar: "استشارات نمو الأعمال", en: "Business Growth Consulting" },
            desc: { ar: "صفحة أسعار احترافية لشركة استشارات مع خطط مرنة", en: "Professional pricing page for consulting company with flexible plans" },
            link: "projects/04-pricing2.html"
        },
        {
            name: { ar: "Velocity", en: "Velocity" },
            type: { ar: "منصة إدارة مشاريع", en: "Project Management Platform" },
            desc: { ar: "صفحة هبوط عصرية لمنصة SaaS", en: "Modern landing page for a SaaS platform" },
            link: "projects/05-landing1.html"
        },
        {
            name: { ar: "Innovate", en: "Innovate" },
            type: { ar: "وكالة إبداعية", en: "Creative Agency" },
            desc: { ar: "موقع شركة متكامل بتصميم احترافي", en: "Complete company website with professional design" },
            link: "projects/06-company1.html"
        },
        {
            name: { ar: "مطعم الشرق", en: "Al Sharq Restaurant" },
            type: { ar: "مطعم فاخر", en: "Luxury Restaurant" },
            desc: { ar: "موقع مطعم راقي بتصميم ذهبي أنيق وقائمة طعام تفاعلية", en: "Upscale restaurant website with elegant golden design and interactive menu" },
            link: "projects/07-restaurant1.html"
        },
        {
            name: { ar: "عيادة ابتسامة", en: "Smile Clinic" },
            type: { ar: "عيادة أسنان تجميلية", en: "Cosmetic Dental Clinic" },
            desc: { ar: "موقع عيادة أسنان بتصميم عصري مع نظام حجز مواعيد", en: "Dental clinic website with modern design and appointment booking system" },
            link: "projects/08-dental1.html"
        },
        {
            name: { ar: "POWER GYM", en: "POWER GYM" },
            type: { ar: "صالة لياقة بدنية", en: "Fitness Center" },
            desc: { ar: "موقع جيم بتصميم قوي مع فيديو وتأثيرات نارية", en: "Gym website with powerful design, video and fire effects" },
            link: "projects/09-gym1.html"
        },
        {
            name: { ar: "د. احمد", en: "Dr. Ahmed" },
            type: { ar: "أخصائي تغذية علاجية", en: "Clinical Nutritionist" },
            desc: { ar: "موقع أخصائي تغذية بتصميم صحي ومنعش مع نموذج شات", en: "Nutritionist website with healthy, fresh design and chat form" },
            link: "projects/10-nutrition1.html"
        },
        {
            name: { ar: "دار الأصالة", en: "Dar Al Asala" },
            type: { ar: "وكالة عقارات فاخرة", en: "Luxury Real Estate Agency" },
            desc: { ar: "موقع عقاري فاخر بتصميم ذهبي مع سلايدر وفلترة عقارات", en: "Luxury real estate website with golden design, slider and property filtering" },
            link: "projects/11-realestate1.html"
        },
        {
            name: { ar: "ورشة المحرك", en: "Engine Workshop" },
            type: { ar: "ورشة صيانة سيارات", en: "Auto Repair Shop" },
            desc: { ar: "موقع ورشة سيارات بتصميم صناعي مع أنيميشن تروس وباقات صيانة", en: "Auto shop website with industrial design, gear animations and maintenance packages" },
            link: "projects/12-garage1.html"
        },
        {
            name: { ar: "معرض الفخامة", en: "Luxury Showroom" },
            type: { ar: "معرض سيارات فاخرة", en: "Luxury Car Showroom" },
            desc: { ar: "موقع معرض سيارات بتصميم ذهبي فاخر مع نافبار عائم وأقسام مميزة", en: "Car showroom website with luxurious golden design, floating navbar and featured sections" },
            link: "projects/13-cars1.html"
        },
        {
            name: { ar: "رحلات الأحلام", en: "Dream Trips" },
            type: { ar: "وكالة سفر وسياحة", en: "Travel & Tourism Agency" },
            desc: { ar: "موقع سياحي بتصميم سماوي مع نافبار جواز سفر وكروت وجهات متحركة", en: "Tourism website with sky design, passport navbar and animated destination cards" },
            link: "projects/14-travel1.html"
        },
        {
            name: { ar: "أحمد المترجم", en: "Ahmed The Translator" },
            type: { ar: "مترجم محترف معتمد", en: "Certified Professional Translator" },
            desc: { ar: "بورتفوليو مترجم بتصميم قاموس مع نافبار كتاب وكروت خدمات متحركة", en: "Translator portfolio with dictionary design, book navbar and animated service cards" },
            link: "projects/15-translator1.html"
        },
        {
            name: { ar: "Vision Studio", en: "Vision Studio" },
            type: { ar: "مونتير فيديو محترف", en: "Professional Video Editor" },
            desc: { ar: "بورتفوليو مونتير بتصميم برنامج مونتاج مع Timeline Navigation وشاشة سينما", en: "Editor portfolio with editing software design, timeline navigation and cinema screen" },
            link: "projects/16-editor1.html"
        },
        {
            name: { ar: "كابتن خالد", en: "Captain Khaled" },
            type: { ar: "مدرب لياقة شخصي", en: "Personal Fitness Trainer" },
            desc: { ar: "بورتفوليو مدرب بتصميم رياضي نيون مع Dumbbell Navigation وكروت تحولات", en: "Trainer portfolio with neon sports design, dumbbell navigation and transformation cards" },
            link: "projects/17-trainer1.html"
        },
        {
            name: { ar: "محمد نور", en: "Mohamed Nour" },
            type: { ar: "خطاط عربي معتمد", en: "Certified Arabic Calligrapher" },
            desc: { ar: "بورتفوليو خطاط بتصميم تراثي ذهبي مع Scroll Navigation ومعرض لوحات فاخر", en: "Calligrapher portfolio with golden heritage design, scroll navigation and luxury gallery" },
            link: "projects/18-calligrapher1.html"
        },
        {
            name: { ar: "ياسر المصور", en: "Yasser The Photographer" },
            type: { ar: "مصور فوتوغرافي محترف", en: "Professional Photographer" },
            desc: { ar: "بورتفوليو مصور بتصميم أبيض وأسود مع Aperture Navigation ومعرض Masonry", en: "Photographer portfolio with B&W design, aperture navigation and masonry gallery" },
            link: "projects/19-photographer1.html"
        }
    ];

    const systemsData = [
        {
            name: { ar: "نظام الصيدلية الذكي", en: "Smart Pharmacy System" },
            type: { ar: "نظام إدارة صيدلية", en: "Pharmacy Management System" },
            desc: { ar: "نظام متكامل لإدارة الصيدليات مع تتبع المخزون والمبيعات وإدارة الوصفات الطبية", en: "Complete pharmacy management system with inventory tracking, sales and prescription management" },
            link: "projects/01-portfolio1.html",
            gallery: [
                "img/pharmacy-system IMG/0.png",
                "img/pharmacy-system IMG/2.png",
                "img/pharmacy-system IMG/3.png",
                "img/pharmacy-system IMG/4.png",
                "img/pharmacy-system IMG/5.png",
                "img/pharmacy-system IMG/6.png",
                "img/pharmacy-system IMG/7.png"
            ],
            features: {
                ar: ["إدارة المخزون الذكي", "تتبع الوصفات الطبية", "نظام نقاط البيع", "تقارير مالية شاملة", "إدارة العملاء", "تنبيهات انتهاء الصلاحية"],
                en: ["Smart Inventory Management", "Prescription Tracking", "POS System", "Comprehensive Financial Reports", "Customer Management", "Expiry Date Alerts"]
            }
        },
        {
            name: { ar: "نظام إدارة المخزون", en: "Inventory Management System" },
            type: { ar: "نظام إدارة مخازن", en: "Warehouse Management System" },
            desc: { ar: "نظام متطور لإدارة المخازن مع تتبع المنتجات والكميات وإدارة الموردين والعملاء", en: "Advanced warehouse management system with product tracking, quantities and supplier/customer management" },
            link: "projects/05-landing1.html",
            gallery: [
                "img/inventory-system IMG/00.png",
                "img/inventory-system IMG/11.png",
                "img/inventory-system IMG/22.png",
                "img/inventory-system IMG/33.png",
                "img/inventory-system IMG/44.png",
                "img/inventory-system IMG/55.png",
                "img/inventory-system IMG/66.png",
                "img/inventory-system IMG/77.png",
                "img/inventory-system IMG/88.png",
                "img/inventory-system IMG/99.png",
                "img/inventory-system IMG/999.png"
            ],
            features: {
                ar: ["تتبع المنتجات بالباركود", "إدارة المخازن المتعددة", "تقارير المخزون التفصيلية", "إدارة الموردين والعملاء", "تنبيهات المخزون المنخفض", "نظام الفواتير المتكامل"],
                en: ["Barcode Product Tracking", "Multi-Warehouse Management", "Detailed Inventory Reports", "Supplier & Customer Management", "Low Stock Alerts", "Integrated Billing System"]
            }
        }
    ];

    let currentProjectsData = websitesData;
    let currentFilter = 'websites';

    const cards = document.querySelectorAll('.carousel-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const projectName = document.querySelector('.project-name');
    const projectType = document.querySelector('.project-type');
    const projectDesc = document.querySelector('.project-desc');
    const projectLink = document.querySelector('.project-link');
    const upArrows = document.querySelectorAll('.carousel-arrow.up, .carousel-nav-arrow.up');
    const downArrows = document.querySelectorAll('.carousel-arrow.down, .carousel-nav-arrow.down');

    if (!cards.length) return;

    let currentIndex = 0;
    let isAnimating = false;

    function updateCarousel(newIndex) {
        if (isAnimating) return;
        isAnimating = true;

        currentIndex = (newIndex + cards.length) % cards.length;

        cards.forEach((card, i) => {
            const offset = (i - currentIndex + cards.length) % cards.length;
            card.classList.remove('center', 'up-1', 'up-2', 'down-1', 'down-2', 'hidden');

            if (offset === 0) {
                card.classList.add('center');
            } else if (offset === 1) {
                card.classList.add('down-1');
            } else if (offset === 2) {
                card.classList.add('down-2');
            } else if (offset === cards.length - 1) {
                card.classList.add('up-1');
            } else if (offset === cards.length - 2) {
                card.classList.add('up-2');
            } else {
                card.classList.add('hidden');
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Update project info with animation
        if (projectName && projectType && projectDesc && currentFilter === 'websites') {
            projectName.style.opacity = '0';
            projectType.style.opacity = '0';
            projectDesc.style.opacity = '0';

            setTimeout(() => {
                const lang = localStorage.getItem('lang') || 'ar';
                const project = currentProjectsData[currentIndex];
                projectName.textContent = project.name[lang];
                projectType.textContent = project.type[lang];
                projectDesc.textContent = project.desc[lang];
                if (projectLink) {
                    projectLink.href = project.link;
                    projectLink.onclick = null;
                }
                projectName.style.opacity = '1';
                projectType.style.opacity = '1';
                projectDesc.style.opacity = '1';
            }, 300);
        }

        setTimeout(() => {
            isAnimating = false;
        }, 800);
    }

    // Arrow controls
    upArrows.forEach(arrow => {
        arrow.addEventListener('click', () => updateCarousel(currentIndex - 1));
    });

    downArrows.forEach(arrow => {
        arrow.addEventListener('click', () => updateCarousel(currentIndex + 1));
    });

    // Dot controls
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => updateCarousel(i));
    });

    // Card click
    cards.forEach((card, i) => {
        card.addEventListener('click', (e) => {
            if (!card.classList.contains('center')) {
                e.preventDefault();
                updateCarousel(i);
            }
        });
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        const projectsSection = document.getElementById('projects');
        const rect = projectsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowUp') {
                updateCarousel(currentIndex - 1);
            } else if (e.key === 'ArrowDown') {
                updateCarousel(currentIndex + 1);
            }
        }
    });

    // Touch/Swipe support
    let touchStartY = 0;
    const carouselContainer = document.querySelector('.carousel-container');

    if (carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        });

        carouselContainer.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].screenY;
            const diff = touchStartY - touchEndY;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    updateCarousel(currentIndex + 1);
                } else {
                    updateCarousel(currentIndex - 1);
                }
            }
        });
    }

    // Initialize
    updateCarousel(0);

    // Filter functionality
    const filterBtns = document.querySelectorAll('.projects-filter .filter-btn');
    const websitesCarousel = document.getElementById('websitesCarousel');
    const systemsCarousel = document.getElementById('systemsCarousel');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            if (filter === currentFilter) return;

            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update current filter and data
            currentFilter = filter;

            if (filter === 'websites') {
                currentProjectsData = websitesData;
                websitesCarousel.style.display = 'flex';
                systemsCarousel.style.display = 'none';
                // Reset to first project
                currentIndex = 0;
                updateCarousel(0);
            } else {
                currentProjectsData = systemsData;
                websitesCarousel.style.display = 'none';
                systemsCarousel.style.display = 'block';
                // Initialize systems cards
                initSystemsCards();
            }
        });
    });

    // Initialize systems cards
    function initSystemsCards() {
        const systemCards = document.querySelectorAll('.system-card');

        systemCards.forEach((card, index) => {
            const viewBtn = card.querySelector('.system-view-btn');

            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const systemIndex = parseInt(card.getAttribute('data-system'));
                const system = systemsData[systemIndex];
                openSystemGallery(system);
            });

            // Add click event to entire card
            card.addEventListener('click', () => {
                const systemIndex = parseInt(card.getAttribute('data-system'));
                const system = systemsData[systemIndex];
                openSystemGallery(system);
            });
        });
    }
}

// Scroll Animations
function initScrollAnimations() {
    // Service cards with enhanced stagger effect
    const serviceCards = document.querySelectorAll('.service-card-scroll');

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add visible class to card
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, 50);

                // Animate text elements inside the card with stagger
                const textElements = entry.target.querySelectorAll('.slide-right, .slide-left');
                textElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('visible');
                    }, 200 + (index * 150));
                });

                // Animate list items
                const listItems = entry.target.querySelectorAll('.card-features li');
                listItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 650 + (index * 150));
                });

                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    serviceCards.forEach(card => {
        cardObserver.observe(card);
    });

    // Projects section elements with simple slide animations
    const projectsElements = document.querySelectorAll(
        '.projects-filter, .carousel-section, .carousel-controls-section'
    );

    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                projectsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    projectsElements.forEach(el => {
        projectsObserver.observe(el);
    });

    // Other elements (excluding projects section)
    const elements = document.querySelectorAll(
        '.section-header, .about-image, .about-info, .service-card, ' +
        '.app-card, .skill-card, .info-card, .contact-form, ' +
        '.detail-item, .about-actions'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate', 'fade-in', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' });

    elements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Back to Top
function initBackToTop() {
    const btn = document.getElementById('backToTop');

    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Contact Form
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-submit');
        const originalContent = submitBtn.innerHTML;
        const formData = new FormData(form);
        const lang = document.documentElement.lang || 'ar';

        // Update button to loading state
        submitBtn.innerHTML = lang === 'ar'
            ? '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...'
            : '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    // Success state
                    submitBtn.innerHTML = lang === 'ar'
                        ? '<i class="fas fa-check"></i> تم الإرسال بنجاح!'
                        : '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                // Error state
                submitBtn.innerHTML = lang === 'ar'
                    ? '<i class="fas fa-exclamation-triangle"></i> حدث خطأ، حاول ثانية'
                    : '<i class="fas fa-exclamation-triangle"></i> Error, try again';
                submitBtn.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
            })
            .finally(() => {
                // Reset button state after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 5000);
            });
    });
}

// Smooth Scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerHeight = document.getElementById('header')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const menu = document.getElementById('navMenu');
                if (menu && menu.classList.contains('active')) {
                    const toggle = document.getElementById('navToggle');
                    const overlay = document.getElementById('navOverlay');
                    toggle.classList.remove('active');
                    menu.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });
}

// Parallax effect for background glows
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const glows = document.querySelectorAll('.bg-glow');

    glows.forEach((glow, index) => {
        const speed = 0.05 * (index + 1);
        glow.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// MacBook 3D hover effect
const macbook = document.querySelector('.macbook');
if (macbook) {
    const glow = macbook.querySelector('.macbook-glow');

    // Add screen glow effect on hover
    macbook.addEventListener('mouseenter', () => {
        if (glow) {
            glow.style.opacity = '1';
        }
    });

    macbook.addEventListener('mouseleave', () => {
        if (glow) {
            glow.style.opacity = '';
        }
    });
}

// Keyboard Interactive Effects
function initKeyboardEffects() {
    const keys = document.querySelectorAll('.macbook-keyboard .key');
    const capsKey = document.querySelector('.key.caps');

    if (!keys.length) return;

    // Random key press animation on hover
    let keyAnimationInterval;
    const keyboard = document.querySelector('.macbook-keyboard');

    if (keyboard) {
        keyboard.addEventListener('mouseenter', () => {
            // Start random key animations
            keyAnimationInterval = setInterval(() => {
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                if (randomKey && !randomKey.classList.contains('typing')) {
                    randomKey.classList.add('typing');
                    setTimeout(() => {
                        randomKey.classList.remove('typing');
                    }, 100);
                }
            }, 200);
        });

        keyboard.addEventListener('mouseleave', () => {
            clearInterval(keyAnimationInterval);
        });
    }

    // Caps Lock toggle
    if (capsKey) {
        capsKey.addEventListener('click', () => {
            capsKey.classList.toggle('active');
        });
    }

    // Key press effect on click
    keys.forEach(key => {
        key.addEventListener('mousedown', () => {
            key.classList.add('typing');
        });

        key.addEventListener('mouseup', () => {
            setTimeout(() => {
                key.classList.remove('typing');
            }, 50);
        });

        key.addEventListener('mouseleave', () => {
            key.classList.remove('typing');
        });
    });

    // Keyboard shortcut simulation
    document.addEventListener('keydown', (e) => {
        const keyMap = {
            'Escape': '.key.fn[data-key="esc"]',
            'Tab': '.key.tab',
            'CapsLock': '.key.caps',
            'Shift': '.key.shift-left, .key.shift-right',
            'Control': '.key.modifier',
            'Alt': '.key.modifier',
            'Meta': '.key.command',
            'Enter': '.key.enter',
            'Backspace': '.key.backspace',
            ' ': '.key.spacebar',
            'ArrowUp': '.key.arrow-group .arrow-up',
            'ArrowDown': '.key.arrow-group .arrow-down',
            'ArrowLeft': '.key.arrow:first-of-type',
            'ArrowRight': '.key.arrow:last-of-type'
        };

        // Check if MacBook is in viewport
        const macbookEl = document.querySelector('.macbook');
        if (!macbookEl) return;

        const rect = macbookEl.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (!isVisible) return;

        let selector = keyMap[e.key];

        // For letter and number keys
        if (!selector && e.key.length === 1) {
            const keyChar = e.key.toUpperCase();
            const allKeys = document.querySelectorAll('.macbook-keyboard .key');
            allKeys.forEach(k => {
                if (k.textContent.trim().toUpperCase() === keyChar) {
                    k.classList.add('typing');
                    setTimeout(() => k.classList.remove('typing'), 100);
                }
            });
            return;
        }

        if (selector) {
            const targetKeys = document.querySelectorAll(selector);
            targetKeys.forEach(k => {
                k.classList.add('typing');
                setTimeout(() => k.classList.remove('typing'), 100);
            });

            // Toggle caps lock
            if (e.key === 'CapsLock' && capsKey) {
                capsKey.classList.toggle('active');
            }
        }
    });
}

// Initialize keyboard effects
document.addEventListener('DOMContentLoaded', () => {
    initKeyboardEffects();
});


// ==========================================
// Language Toggle (AR/EN)
// ==========================================
function initLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    const langCurrent = langToggle?.querySelector('.lang-current');

    if (!langToggle) return;

    let currentLang = localStorage.getItem('lang') || 'ar';

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);

        // Update HTML direction
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update toggle button
        langCurrent.textContent = lang.toUpperCase();

        // Update all elements with data-ar and data-en attributes
        document.querySelectorAll('[data-ar][data-en]').forEach(el => {
            el.textContent = el.getAttribute(`data-${lang}`);
        });

        // Update placeholders
        document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]').forEach(el => {
            el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
        });

        // Update page title
        document.title = lang === 'ar' ? 'Web Flow | شركة تطوير المواقع' : 'Web Flow | Web Development Company';

        // Update typing effect words
        updateTypingWords(lang);

        // Update project info if carousel is active
        if (typeof currentProjectsData !== 'undefined' && typeof currentIndex !== 'undefined') {
            const projectName = document.querySelector('.project-name');
            const projectType = document.querySelector('.project-type');
            const projectDesc = document.querySelector('.project-desc');

            if (projectName && projectType && projectDesc && currentProjectsData[currentIndex]) {
                const project = currentProjectsData[currentIndex];
                projectName.textContent = project.name[lang];
                projectType.textContent = project.type[lang];
                projectDesc.textContent = project.desc[lang];
            }
        }
    }

    // Initialize
    updateLanguage(currentLang);

    // Toggle event
    langToggle.addEventListener('click', () => {
        const newLang = currentLang === 'ar' ? 'en' : 'ar';
        updateLanguage(newLang);
    });
}

// Update typing effect based on language
function updateTypingWords(lang) {
    window.typingWords = lang === 'ar'
        ? ['بورتفوليو', 'صفحات هبوط', 'مواقع شركات']
        : ['Portfolio', 'Landing Pages', 'Company Sites'];
}

// ==========================================
// Push Notifications
// ==========================================
function initPushNotifications() {
    const banner = document.getElementById('notificationBanner');
    const allowBtn = document.getElementById('allowNotifications');
    const dismissBtn = document.getElementById('dismissNotifications');

    if (!banner) return;

    // Check if already subscribed or dismissed
    const notifStatus = localStorage.getItem('notificationStatus');

    if (notifStatus === 'subscribed' || notifStatus === 'dismissed') {
        banner.classList.add('hidden');
        return;
    }

    // Show banner after 5 seconds
    setTimeout(() => {
        banner.classList.add('show');
    }, 5000);

    // Allow button
    allowBtn?.addEventListener('click', async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                localStorage.setItem('notificationStatus', 'subscribed');

                // Show success notification
                new Notification('مرحباً! 🎉', {
                    body: 'شكراً لاشتراكك! ستصلك عروضنا الحصرية.',
                    icon: 'img/logo.png'
                });

                // Update button
                allowBtn.innerHTML = '<i class="fas fa-check"></i> <span>تم الاشتراك!</span>';
                allowBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

                setTimeout(() => {
                    banner.classList.remove('show');
                    setTimeout(() => banner.classList.add('hidden'), 500);
                }, 2000);
            }
        } else {
            alert('متصفحك لا يدعم الإشعارات');
        }
    });

    // Dismiss button
    dismissBtn?.addEventListener('click', () => {
        localStorage.setItem('notificationStatus', 'dismissed');
        banner.classList.remove('show');
        setTimeout(() => banner.classList.add('hidden'), 500);
    });
}

// System Gallery Modal
function openSystemGallery(system) {
    const modal = document.getElementById('systemGalleryModal');
    const modalTitle = document.getElementById('modalTitle');
    const mainImage = document.getElementById('mainImage');
    const thumbnailsContainer = document.getElementById('galleryThumbnails');
    const featuresList = document.getElementById('featuresList');
    const currentImageSpan = document.querySelector('.current-image');
    const totalImagesSpan = document.querySelector('.total-images');

    if (!modal || !system.gallery) return;

    const lang = localStorage.getItem('lang') || 'ar';
    let currentImageIndex = 0;
    let isLoading = false;

    // Add loading state
    function showLoading() {
        if (!document.querySelector('.modal-loading')) {
            const loader = document.createElement('div');
            loader.className = 'modal-loading';
            document.querySelector('.main-image-container').appendChild(loader);
        }
        isLoading = true;
    }

    function hideLoading() {
        const loader = document.querySelector('.modal-loading');
        if (loader) {
            loader.remove();
        }
        isLoading = false;
    }

    // Set modal title with animation
    modalTitle.style.opacity = '0';
    modalTitle.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        modalTitle.textContent = system.name[lang];
        modalTitle.style.opacity = '1';
        modalTitle.style.transform = 'translateY(0)';
        modalTitle.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }, 200);

    // Set total images
    // totalImagesSpan.textContent = system.gallery.length;

    // Create thumbnails with stagger animation
    thumbnailsContainer.innerHTML = '';
    system.gallery.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="Screenshot ${index + 1}">`;
        thumbnail.style.opacity = '0';
        thumbnail.style.transform = 'translateY(30px)';
        thumbnail.addEventListener('click', () => showImage(index));
        thumbnailsContainer.appendChild(thumbnail);

        // Stagger animation
        setTimeout(() => {
            thumbnail.style.opacity = '1';
            thumbnail.style.transform = 'translateY(0)';
            thumbnail.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 300 + (index * 100));
    });

    // Populate features with animation
    featuresList.innerHTML = '';
    system.features[lang].forEach((feature, index) => {
        const li = document.createElement('li');
        li.textContent = feature;
        li.style.opacity = '0';
        li.style.transform = 'translateX(-30px)';
        featuresList.appendChild(li);

        setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'translateX(0)';
            li.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 500 + (index * 100));
    });

    // Enhanced show image function
    function showImage(index) {
        if (isLoading) return;

        currentImageIndex = index;
        showLoading();

        // Fade out current image
        mainImage.style.opacity = '0';
        mainImage.style.transform = 'scale(1.1)';

        setTimeout(() => {
            mainImage.src = system.gallery[index];
            // currentImageSpan.textContent = index + 1;

            // Update active thumbnail with smooth transition
            document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
                thumb.classList.remove('active');
                if (i === index) {
                    thumb.classList.add('active');
                    // Scroll thumbnail into view
                    thumb.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }
            });

            // Wait for image to load
            mainImage.onload = () => {
                hideLoading();
                mainImage.style.opacity = '1';
                mainImage.style.transform = 'scale(1)';
                mainImage.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            };

            mainImage.onerror = () => {
                hideLoading();
                mainImage.style.opacity = '1';
                mainImage.style.transform = 'scale(1)';
            };
        }, 300);
    }

    // Enhanced navigation functions
    function nextImage() {
        const nextIndex = (currentImageIndex + 1) % system.gallery.length;
        showImage(nextIndex);

        // Add visual feedback
        const nextBtn = document.getElementById('nextImage');
        nextBtn.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            nextBtn.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    }

    function prevImage() {
        const prevIndex = (currentImageIndex - 1 + system.gallery.length) % system.gallery.length;
        showImage(prevIndex);

        // Add visual feedback
        const prevBtn = document.getElementById('prevImage');
        prevBtn.style.transform = 'translateY(-50%) scale(0.9)';
        setTimeout(() => {
            prevBtn.style.transform = 'translateY(-50%) scale(1)';
        }, 150);
    }

    // Set up navigation with enhanced interactions
    const nextBtn = document.getElementById('nextImage');
    const prevBtn = document.getElementById('prevImage');

    nextBtn.onclick = nextImage;
    prevBtn.onclick = prevImage;

    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const imageContainer = document.querySelector('.main-image-container');

    imageContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    imageContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextImage(); // Swipe left - next image
            } else {
                prevImage(); // Swipe right - previous image
            }
        }
    }

    // Enhanced keyboard navigation
    function handleKeyboard(e) {
        switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                e.preventDefault();
                nextImage();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                e.preventDefault();
                prevImage();
                break;
            case 'Escape':
                e.preventDefault();
                closeModal();
                break;
            case ' ':
                e.preventDefault();
                nextImage();
                break;
        }
    }

    // Enhanced close modal function
    function closeModal() {
        // Add closing animation
        modal.style.transform = 'scale(0.95)';
        modal.style.opacity = '0.8';

        setTimeout(() => {
            modal.classList.remove('active');
            modal.style.transform = '';
            modal.style.opacity = '';
            document.removeEventListener('keydown', handleKeyboard);
            document.body.style.overflow = '';

            // Reset image
            mainImage.onload = null;
            mainImage.onerror = null;
        }, 200);
    }

    // Set up close buttons with enhanced feedback
    const closeBtn = document.getElementById('modalClose');
    const overlay = document.getElementById('modalOverlay');

    closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeBtn.style.transform = 'rotate(90deg) scale(0.9)';
        setTimeout(() => {
            closeBtn.style.transform = 'rotate(90deg) scale(1.1)';
            closeModal();
        }, 100);
    };

    overlay.onclick = closeModal;

    // Prevent modal content clicks from closing modal
    document.querySelector('.modal-container').onclick = (e) => {
        e.stopPropagation();
    };

    // Show first image
    showImage(0);

    // Show modal with enhanced entrance animation
    modal.classList.add('active');
    document.addEventListener('keydown', handleKeyboard);
    document.body.style.overflow = 'hidden';

    // Add entrance sound effect (optional)
    // You can add a subtle sound effect here if desired

    // Auto-play slideshow (optional - can be enabled)
    let autoPlayInterval;
    const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
            if (!isLoading && modal.classList.contains('active')) {
                nextImage();
            }
        }, 5000);
    };

    const stopAutoPlay = () => {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    };

    // Uncomment to enable auto-play
    // startAutoPlay();

    // Stop auto-play on user interaction
    modal.addEventListener('click', stopAutoPlay);
    modal.addEventListener('keydown', stopAutoPlay);
    modal.addEventListener('touchstart', stopAutoPlay);
}