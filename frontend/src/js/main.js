/*
 * EventHub - Основной JavaScript файл
 * Автор: [Имя разработчика]
 * Дата: 2024
 * Версия: 2.0
 * 
 * Основные функции:
 * 1. Управление слайдером баннера
 * 2. Навигация между страницами
 * 3. Анимации при прокрутке
 * 4. Оптимизация производительности
 * 5. Обработка ошибок
 */

// ===== СЛАЙДЕР БАННЕРА =====
/*
 * Класс для управления слайдером на главной странице
 * Особенности:
 * - Автопрокрутка каждые 5 секунд
 * - Поддержка свайпов на мобильных
 * - Предзагрузка изображений
 * - Пауза при наведении
 */
class BannerSlider {
    constructor() {
        // Массив с путями к изображениям слайдов
        // ВНИМАНИЕ: В реальном проекте эти пути должны быть разными
        this.slides = [
            '../src/assets/images/content/BackBanner.png',
            '../src/assets/images/content/BackBanner.png', 
            '../src/assets/images/content/BackBanner.png',
            '../src/assets/images/content/BackBanner.png'
        ];
        
        // Текущий активный слайд (индекс в массиве)
        this.currentSlide = 0;
        
        // DOM элементы
        this.bannerImg = document.querySelector('.banner img');
        this.indicators = document.querySelectorAll('.indicator');
        this.leftArrow = document.querySelector('.left-arrow');
        this.rightArrow = document.querySelector('.right-arrow');
        
        // Интервал автопрокрутки
        this.autoSlideInterval = null;
        
        // Инициализация
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.startAutoSlide();
        this.preloadImages();
    }
    
    /*
     * Предзагрузка изображений:
     * Создаем скрытые Image объекты для всех слайдов
     * Это предотвращает мерцание при переключении
     */
    preloadImages() {
        this.slides.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
    
    /*
     * Настройка обработчиков событий:
     * - Клики по стрелкам
     * - Клики по индикаторам
     * - Пауза при наведении
     * - Свайпы на мобильных
     */
    setupEventListeners() {
        // Стрелки
        this.leftArrow.addEventListener('click', () => this.prevSlide());
        this.rightArrow.addEventListener('click', () => this.nextSlide());
        
        // Индикаторы
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Пауза автопрокрутки при наведении
        const banner = document.querySelector('.banner');
        banner.addEventListener('mouseenter', () => this.stopAutoSlide());
        banner.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Обработка свайпов для мобильных устройств
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
    
    /*
     * Обработка свайпов:
     * Определяем направление свайпа и переключаем слайд
     * Порог 50px для предотвращения случайных срабатываний
     */
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // Свайп влево -> следующий слайд
            } else {
                this.prevSlide(); // Свайп вправо -> предыдущий слайд
            }
        }
    }
    
    // Переключение на следующий слайд
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    // Переключение на предыдущий слайд
    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlider();
    }
    
    // Переход к конкретному слайду по индексу
    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }
    
    /*
     * Обновление слайдера:
     * - Плавное изменение прозрачности (fade эффект)
     * - Смена изображения
     * - Обновление активного индикатора
     */
    updateSlider() {
        // Плавное исчезновение текущего изображения
        this.bannerImg.style.opacity = '0';
        
        // После завершения анимации меняем src и показываем новое изображение
        setTimeout(() => {
            this.bannerImg.src = this.slides[this.currentSlide];
            this.bannerImg.style.opacity = '1';
            
            // Обновление индикаторов
            this.indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
        }, 300);
    }
    
    // Запуск автопрокрутки
    startAutoSlide() {
        this.stopAutoSlide(); // Сначала останавливаем предыдущий интервал
        this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
    }
    
    // Остановка автопрокрутки
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
}

// ===== МЕНЕДЖЕР НАВИГАЦИИ =====
/*
 * Управление навигацией между страницами:
 * - Обработка кликов по кнопкам навигации
 * - Показ уведомлений
 * - Эффекты наведения на кнопки
 */
class NavigationManager {
    constructor() {
        this.setupNavigation();
        this.setupButtonInteractions();
    }
    
    /*
     * Настройка навигации:
     * - Кнопки навигационного меню
     * - Кнопки регистрации и бронирования
     * - Логотипы (верхний и нижний)
     */
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
        
        // Логотип в хедере ведет на главную
        const logoContainer = document.querySelector('.logo-container');
        logoContainer.addEventListener('click', () => {
            this.navigateToPage('../public/index.html');
        });
        
        // Логотип в подвале скроллит наверх
        const footerLogo = document.querySelector('.logo-line-container');
        footerLogo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    /*
     * Навигация на другую страницу:
     * Проверяем, не находимся ли мы уже на этой странице
     */
    navigateToPage(pageName) {
        const currentPage = window.location.pathname.split('/').pop();
        if (pageName !== currentPage) {
            window.location.href = pageName;
        }
    }
    
    /*
     * Показ модального окна регистрации:
     * Временная заглушка - показывает уведомление
     * В реальном проекте здесь будет вызов модального окна
     */
    showRegistrationModal() {
        this.showNotification('Функция регистрации будет доступна скоро!', 'info');
    }
    
    /*
     * Настройка эффектов взаимодействия:
     * - Эффект нажатия для всех интерактивных элементов
     * - Возврат к исходному состоянию при отпускании
     */
    setupButtonInteractions() {
        const interactiveElements = document.querySelectorAll('button, .project-card, .logo-container, .logo-line-container');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mousedown', () => {
                element.style.transform = 'scale(0.98)';
            });
            
            element.addEventListener('mouseup', () => {
                element.style.transform = '';
            });
            
            // На случай, если пользователь увед курсор с элемента не отпуская кнопку
            element.addEventListener('mouseleave', () => {
                element.style.transform = '';
            });
        });
    }
    
    /*
     * Показ временного уведомления:
     * Создает элемент уведомления с плавным появлением и исчезновением
     * Автоматически удаляется через 3 секунды
     */
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
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
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Остальной код main.js остается без изменений...

// ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
/*
 * Анимация элементов при их появлении в области видимости:
 * Использует Intersection Observer API
 * Более производительно, чем проверка scroll events
 */
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.setupScrollAnimations();
    }
    
    setupScrollAnimations() {
        // Настройки для Intersection Observer
        const observerOptions = {
            threshold: 0.1, // Срабатывает когда 10% элемента видно
            rootMargin: '0px 0px -50px 0px' // Смещение области наблюдения
        };
        
        // Создаем observer
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Когда элемент становится видимым
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    // Прекращаем наблюдение после первого срабатывания
                    this.observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Запускаем анимации при загрузке
        this.animateOnLoad();
    }
    
    /*
     * Начальная анимация элементов:
     * Наблюдаем за элементами, которые должны появляться при прокрутке
     */
    animateOnLoad() {
        const animatedElements = document.querySelectorAll('.project-card, .about-title, .about-description, .star, .projects-title');
        
        animatedElements.forEach(element => {
            // Устанавливаем начальное состояние (невидимое)
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // Начинаем наблюдение
            this.observer.observe(element);
        });
    }
}

// ===== ОПТИМИЗАТОР ПРОИЗВОДИТЕЛЬНОСТИ =====
/*
 * Различные оптимизации для улучшения производительности:
 * - Отложенная загрузка изображений
 * - Предотвращение множественных быстрых кликов
 * - Оптимизация анимаций через will-change
 */
class PerformanceOptimizer {
    constructor() {
        this.setupOptimizations();
    }
    
    setupOptimizations() {
        this.lazyLoadImages();
        this.preventMultipleClicks();
        this.optimizeAnimations();
    }
    
    /*
     * Отложенная загрузка изображений:
     * Для изображений с атрибутом data-src
     * Загружает только когда изображение появляется в области видимости
     */
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
    
    /*
     * Предотвращение множественных быстрых кликов:
     * Защита от случайных двойных кликов
     * Порог: 1000ms между кликами
     */
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
    
    /*
     * Оптимизация анимаций:
     * Добавляем will-change для элементов с анимациями
     * Подсказка браузеру для оптимизации рендеринга
     */
    optimizeAnimations() {
        const animatedElements = document.querySelectorAll('.project-card, .star, .nav-but, .arrow');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }
}

// ===== ОБРАБОТЧИК ОШИБОК =====
/*
 * Глобальная обработка ошибок:
 * - Ошибки загрузки изображений
 * - Глобальные JavaScript ошибки
 * - Fallback для битых изображений
 */
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
                
                // Показываем fallback элемент
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
        
        // Глобальный обработчик ошибок JavaScript
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ =====
/*
 * Основная точка входа:
 * Инициализируем все компоненты при загрузке DOM
 * Обернуто в try-catch для отлова ошибок инициализации
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Создаем экземпляры всех классов
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

// ===== ОЧИСТКА ПРИ ВЫГРУЗКЕ СТРАНИЦЫ =====
/*
 * Очищаем ресурсы при переходе на другую страницу
 * Особенно важно для интервалов и таймеров
 */
window.addEventListener('beforeunload', () => {
    // Очистка ресурсов
    const sliders = document.querySelectorAll('.banner-slider');
    sliders.forEach(slider => {
        if (slider.autoSlideInterval) {
            clearInterval(slider.autoSlideInterval);
        }
    });
});