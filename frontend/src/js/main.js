// ===== СЛАЙДЕР БАННЕРА =====
class BannerSlider {
    constructor() {
        this.slides = [
            '../src/assets/images/content/BackBanner.png',
            '../src/assets/images/content/BackBanner.png', 
            '../src/assets/images/content/BackBanner.png',
            '../src/assets/images/content/BackBanner.png'
        ];
        this.currentSlide = 0;
        this.bannerImg = document.querySelector('.banner img');
        this.indicators = document.querySelectorAll('.indicator');
        this.leftArrow = document.querySelector('.left-arrow');
        this.rightArrow = document.querySelector('.right-arrow');
        this.autoSlideInterval = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAutoSlide();
        this.preloadImages();
    }
    
    preloadImages() {
        this.slides.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    setupEventListeners() {
        this.leftArrow.addEventListener('click', () => this.prevSlide());
        this.rightArrow.addEventListener('click', () => this.nextSlide());
        
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Пауза автопрокрутки при наведении
        const banner = document.querySelector('.banner');
        banner.addEventListener('mouseenter', () => this.stopAutoSlide());
        banner.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Обработка касаний для мобильных устройств
        let touchStartX = 0;
        let touchEndX = 0;
        
        banner.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        banner.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }
    
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    updateSlider() {
        // Плавное изменение прозрачности
        this.bannerImg.style.opacity = '0';
        
        setTimeout(() => {
            this.bannerImg.src = this.slides[this.currentSlide];
            this.bannerImg.style.opacity = '1';
            
            // Обновление индикаторов
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
        }, 300);
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// ===== НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ =====
class NavigationManager {
    constructor() {
        this.setupNavigation();
        this.setupButtonInteractions();
    }
    
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-but');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = button.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });
        
        // Обработка кнопок регистрации и бронирования
        const regButtons = document.querySelectorAll('.reg-button, .book-button');
        regButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.showRegistrationModal();
            });
        });
        
        // Логотип тоже ведет на главную
        const logoContainer = document.querySelector('.logo-container');
        logoContainer.addEventListener('click', () => {
            this.navigateToPage('index.html');
        });
        
        // Логотип в подвале
        const footerLogo = document.querySelector('.logo-line-container');
        footerLogo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    navigateToPage(pageName) {
        if (pageName !== window.location.pathname.split('/').pop()) {
            window.location.href = pageName;
        }
    }
    
    showRegistrationModal() {
        // Здесь можно добавить модальное окно регистрации
        this.showNotification('Функция регистрации будет доступна скоро!', 'info');
    }
    
    setupButtonInteractions() {
        // Добавляем эффект нажатия для всех интерактивных элементов
        const interactiveElements = document.querySelectorAll('button, .project-card, .logo-container, .logo-line-container');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mousedown', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('mouseup', () => {
                element.style.transform = '';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
    
    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'info' ? '#4EE3C6' : '#ff6b6b'};
            color: #1D1D1D;
            padding: 15px 25px;
            border-radius: 10px;
            font-family: Montserrat;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.setupScrollAnimations();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Анимируем элементы при загрузке
        this.animateOnLoad();
    }
    
    animateOnLoad() {
        const animatedElements = document.querySelectorAll('.project-card, .about-title, .about-description, .star, .projects-title');
        
        animatedElements.forEach(element => {
            this.observer.observe(element);
        });
    }
}

// ===== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ =====
class PerformanceOptimizer {
    constructor() {
        this.setupOptimizations();
    }
    
    setupOptimizations() {
        // Отложенная загрузка изображений
        this.lazyLoadImages();
        
        // Предотвращение множественных быстрых кликов
        this.preventMultipleClicks();
        
        // Оптимизация анимаций
        this.optimizeAnimations();
    }
    
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    preventMultipleClicks() {
        let lastClickTime = 0;
        document.addEventListener('click', (e) => {
            const currentTime = new Date().getTime();
            if (currentTime - lastClickTime < 1000) {
                e.preventDefault();
                e.stopPropagation();
            }
            lastClickTime = currentTime;
        }, true);
    }
    
    optimizeAnimations() {
        // Добавляем will-change для элементов с анимациями
        const animatedElements = document.querySelectorAll('.project-card, .star, .nav-but, .arrow');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }
}

// ===== ОБРАБОТКА ОШИБОК =====
class ErrorHandler {
    constructor() {
        this.setupErrorHandling();
    }
    
    setupErrorHandling() {
        // Обработка ошибок загрузки изображений
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('Ошибка загрузки изображения:', e.target.src);
                e.target.style.display = 'none';
                
                // Показываем fallback
                const parent = e.target.parentElement;
                if (parent && !parent.querySelector('.image-fallback')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'image-fallback';
                    fallback.textContent = '📷';
                    fallback.style.cssText = `
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #333232;
                        color: white;
                        font-size: 2em;
                    `;
                    parent.appendChild(fallback);
                }
            }
        }, true);
        
        // Глобальный обработчик ошибок
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    try {
        new BannerSlider();
        new NavigationManager();
        new ScrollAnimations();
        new PerformanceOptimizer();
        new ErrorHandler();
        
        console.log('EventHub initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Обработка события beforeunload для очистки
window.addEventListener('beforeunload', () => {
    // Очистка ресурсов
    const sliders = document.querySelectorAll('.banner-slider');
    sliders.forEach(slider => {
        if (slider.autoSlideInterval) {
            clearInterval(slider.autoSlideInterval);
        }
    });
});