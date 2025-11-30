// about.js

// ===== УПРАВЛЕНИЕ СТРАНИЦЕЙ "О НАС" =====
class AboutPage {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFormHandling();
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupInteractiveElements();
        console.log('About page initialized');
    }

    // ===== НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ =====
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-but');
        
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = button.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });

        // Логотип ведет на главную
        const logoContainer = document.querySelector('.logo-container');
        logoContainer.addEventListener('click', () => {
            this.navigateToPage('../public/index.html');
        });

        // Логотип в подвале
        const footerLogo = document.querySelector('.logo-line-container');
        footerLogo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Кнопка регистрации
        const regButton = document.querySelector('.reg-button');
        regButton.addEventListener('click', () => {
            this.showRegistrationModal();
        });
    }

    navigateToPage(pageName) {
        if (pageName !== window.location.pathname.split('/').pop()) {
            window.location.href = pageName;
        }
    }

    showRegistrationModal() {
        this.showNotification('Функция регистрации будет доступна скоро!', 'info');
    }

    // ===== ОБРАБОТКА ФОРМЫ ОБРАТНОЙ СВЯЗИ =====
    setupFormHandling() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });

        // Добавляем валидацию в реальном времени
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        
        if (field.hasAttribute('required') && !value) {
            this.showFieldError(field, 'Это поле обязательно для заполнения');
            return false;
        }
        
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'Введите корректный email адрес');
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#ff6b6b';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b6b;
            font-size: 14px;
            margin-top: 5px;
            font-family: Montserrat;
        `;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleFormSubmit(form) {
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;

        // Валидация всех полей
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Пожалуйста, заполните все обязательные поля правильно', 'error');
            return;
        }

        // Показываем состояние загрузки
        submitButton.textContent = 'Отправка...';
        submitButton.disabled = true;

        try {
            // Имитация отправки формы
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Показываем успешное сообщение
            this.showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            form.reset();
        } catch (error) {
            this.showNotification('Произошла ошибка при отправке. Попробуйте еще раз.', 'error');
        } finally {
            // Восстанавливаем кнопку
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    // ===== АНИМАЦИЯ СЧЕТЧИКОВ =====
    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 секунды
        const step = target / (duration / 16); // 60 FPS
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Форматирование чисел с разделителями
            counter.textContent = this.formatNumber(Math.floor(current));
        }, 16);
    }

    formatNumber(num) {
        if (num >= 1000) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        }
        return num.toString();
    }

    // ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами с анимацией
        const animatedElements = document.querySelectorAll('.mission-content, .feature, .value-card, .team-member, .timeline-item, .partner-logo, .contact-item, .social-button');
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }

    // ===== ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ =====
    setupInteractiveElements() {
        // Добавляем эффект нажатия для интерактивных элементов
        const interactiveElements = document.querySelectorAll('.stat-item, .value-card, .team-member, .partner-logo, .social-button, .social-link');
        
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

        // Параллакс эффект для баннера
        this.setupParallaxEffect();
    }

    setupParallaxEffect() {
        const banner = document.querySelector('.banner');
        if (!banner) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            banner.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        });
    }

    // ===== УВЕДОМЛЕНИЯ =====
    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Автоматическое скрытие
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    try {
        new AboutPage();
        console.log('About page initialized successfully');
    } catch (error) {
        console.error('About page initialization error:', error);
    }
});

// Обработка события beforeunload для очистки
window.addEventListener('beforeunload', () => {
    // Очистка ресурсов, если необходимо
});