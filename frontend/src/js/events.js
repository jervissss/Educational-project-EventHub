// ===== УПРАВЛЕНИЕ СТРАНИЦЕЙ МЕРОПРИЯТИЙ =====
class EventsPage {
    constructor() {
        this.filters = document.querySelectorAll('.filter-tag');
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        this.loadMoreButton = document.querySelector('.load-more-button');
        this.eventsGrid = document.querySelector('#eventsGrid');
        this.eventCards = document.querySelectorAll('.event-card');
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.isLoading = false;
        this.currentPage = 1;
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupFilters();
        this.setupSearch();
        this.setupLoadMore();
        this.setupCardInteractions();
        this.setupScrollAnimations();
        this.setupPerformanceOptimizations();
        
        console.log('Events page initialized');
    }
    
    // ===== НАВИГАЦИЯ =====
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

    // Остальной код events.js остается без изменений...
    
    // ===== ФИЛЬТРАЦИЯ =====
    setupFilters() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Снимаем активный класс со всех фильтров
                this.filters.forEach(f => f.classList.remove('active'));
                
                // Добавляем активный класс к выбранному фильтру
                filter.classList.add('active');
                
                // Получаем категорию для фильтрации
                this.currentFilter = filter.getAttribute('data-category');
                
                // Применяем фильтрацию
                this.applyFilters();
            });
        });
    }
    
    applyFilters() {
        let visibleCount = 0;
        
        this.eventCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.event-title').textContent.toLowerCase();
            const cardDescription = card.querySelector('.event-description').textContent.toLowerCase();
            
            // Проверяем соответствие фильтру и поисковому запросу
            const matchesFilter = this.currentFilter === 'all' || cardCategory === this.currentFilter;
            const matchesSearch = !this.currentSearch || 
                                cardTitle.includes(this.currentSearch) || 
                                cardDescription.includes(this.currentSearch);
            
            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
                
                // Анимация появления
                card.style.animation = 'fadeInUp 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Показываем сообщение, если ничего не найдено
        this.showNoResultsMessage(visibleCount === 0);
    }
    
    showNoResultsMessage(show) {
        let message = document.querySelector('.no-results-message');
        
        if (show && !message) {
            message = document.createElement('div');
            message.className = 'no-results-message';
            message.innerHTML = `
                <div class="no-results-content">
                    <h3>Мероприятия не найдены</h3>
                    <p>Попробуйте изменить параметры поиска или фильтрации</p>
                    <button class="reset-filters-button">Сбросить фильтры</button>
                </div>
            `;
            
            // Стили для сообщения
            message.style.cssText = `
                grid-column: 1 / -1;
                text-align: center;
                padding: 60px 20px;
                animation: fadeInUp 0.6s ease;
            `;
            
            const content = message.querySelector('.no-results-content');
            content.style.cssText = `
                max-width: 400px;
                margin: 0 auto;
            `;
            
            content.querySelector('h3').style.cssText = `
                font-size: 24px;
                margin-bottom: 15px;
                color: white;
            `;
            
            content.querySelector('p').style.cssText = `
                color: rgba(255,255,255,0.7);
                margin-bottom: 25px;
            `;
            
            const resetButton = content.querySelector('.reset-filters-button');
            resetButton.style.cssText = `
                background: #4EE3C6;
                color: #1D1D1D;
                border: none;
                border-radius: 25px;
                padding: 12px 25px;
                font-family: Montserrat;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            `;
            
            resetButton.addEventListener('mouseenter', () => {
                resetButton.style.transform = 'translateY(-2px)';
                resetButton.style.background = '#3bc9ad';
            });
            
            resetButton.addEventListener('mouseleave', () => {
                resetButton.style.transform = '';
                resetButton.style.background = '#4EE3C6';
            });
            
            resetButton.addEventListener('click', () => {
                this.resetFilters();
            });
            
            this.eventsGrid.appendChild(message);
        } else if (!show && message) {
            message.remove();
        }
    }
    
    resetFilters() {
        // Сбрасываем фильтры
        this.filters.forEach(f => f.classList.remove('active'));
        this.filters[0].classList.add('active'); // "Все"
        this.currentFilter = 'all';
        
        // Сбрасываем поиск
        this.searchInput.value = '';
        this.currentSearch = '';
        
        // Показываем все карточки
        this.applyFilters();
    }
    
    // ===== ПОИСК =====
    setupSearch() {
        // Поиск при вводе текста
        this.searchInput.addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase().trim();
            this.applyFilters();
        });
        
        // Поиск при нажатии кнопки
        this.searchButton.addEventListener('click', () => {
            this.currentSearch = this.searchInput.value.toLowerCase().trim();
            this.applyFilters();
        });
        
        // Поиск при нажатии Enter
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.currentSearch = this.searchInput.value.toLowerCase().trim();
                this.applyFilters();
            }
        });
    }
    
    // ===== ЗАГРУЗКА ДОПОЛНИТЕЛЬНЫХ МЕРОПРИЯТИЙ =====
    setupLoadMore() {
        this.loadMoreButton.addEventListener('click', async () => {
            if (this.isLoading) return;
            
            await this.loadMoreEvents();
        });
    }
    
    async loadMoreEvents() {
        this.isLoading = true;
        this.showLoadingState();
        
        try {
            // Имитация загрузки данных с сервера
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // В реальном приложении здесь был бы запрос к API
            const newEvents = this.generateMockEvents();
            
            // Добавляем новые карточки в сетку
            newEvents.forEach(event => {
                const eventCard = this.createEventCard(event);
                this.eventsGrid.appendChild(eventCard);
            });
            
            // Обновляем список карточек
            this.eventCards = document.querySelectorAll('.event-card');
            
            // Применяем текущие фильтры к новым карточкам
            this.applyFilters();
            
            this.showNotification('Дополнительные мероприятия загружены!', 'success');
            
        } catch (error) {
            console.error('Ошибка загрузки мероприятий:', error);
            this.showNotification('Ошибка загрузки. Попробуйте еще раз.', 'error');
        } finally {
            this.hideLoadingState();
            this.isLoading = false;
        }
    }
    
    showLoadingState() {
        this.loadMoreButton.classList.add('loading');
        this.loadMoreButton.disabled = true;
    }
    
    hideLoadingState() {
        this.loadMoreButton.classList.remove('loading');
        this.loadMoreButton.disabled = false;
    }
    
    generateMockEvents() {
        // Генерируем mock данные для демонстрации
        return [
            {
                id: 7,
                title: 'Джазовый вечер',
                category: 'concert',
                date: '22 Янв',
                time: '20:00',
                location: 'Джаз-клуб',
                price: '1200 ₽',
                description: 'Уютный вечер с живой джазовой музыкой в исполнении местных коллективов.'
            },
            {
                id: 8,
                title: 'Фотовыставка "Городские пейзажи"',
                category: 'exhibition',
                date: '18-28 Янв',
                time: '11:00-19:00',
                location: 'Арт-пространство',
                price: '300 ₽',
                description: 'Выставка фотографий, запечатлевших красоту городской архитектуры и жизни.'
            },
            {
                id: 9,
                title: 'Йога в парке',
                category: 'sport',
                date: '12 Янв',
                time: '09:00',
                location: 'Центральный парк',
                price: 'Бесплатно',
                description: 'Групповое занятие йогой на свежем воздухе для всех уровней подготовки.'
            }
        ];
    }
    
    createEventCard(eventData) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.setAttribute('data-category', eventData.category);
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        card.innerHTML = `
            <div class="event-image">
                <img src="../src/assets/images/content/BackBanner.png" alt="${eventData.title}">
                <div class="event-date">
                    <span class="date-day">${eventData.date.split(' ')[0]}</span>
                    <span class="date-month">${eventData.date.split(' ')[1]}</span>
                </div>
            </div>
            <div class="event-content">
                <h3 class="event-title">${eventData.title}</h3>
                <div class="event-info">
                    <div class="info-item">
                        <img src="../src/assets/icons/calendar.png" alt="Дата" width="16" height="16">
                        <span>${eventData.date}, ${eventData.time}</span>
                    </div>
                    <div class="info-item">
                        <img src="../src/assets/icons/location.png" alt="Место" width="16" height="16">
                        <span>${eventData.location}</span>
                    </div>
                    <div class="info-item">
                        <img src="../src/assets/icons/price.png" alt="Цена" width="16" height="16">
                        <span>${eventData.price}</span>
                    </div>
                </div>
                <p class="event-description">${eventData.description}</p>
                <div class="event-actions">
                    <button class="book-event-button">Забронировать</button>
                    <button class="more-info-button">Подробнее</button>
                </div>
            </div>
        `;
        
        // Анимируем появление
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.animation = 'fadeInUp 0.6s ease';
        }, 100);
        
        // Добавляем обработчики для новых кнопок
        this.setupCardButtonInteractions(card);
        
        return card;
    }
    
    // ===== ВЗАИМОДЕЙСТВИЕ С КАРТОЧКАМИ =====
    setupCardInteractions() {
        this.eventCards.forEach(card => {
            this.setupCardButtonInteractions(card);
        });
    }
    
    setupCardButtonInteractions(card) {
        const bookButton = card.querySelector('.book-event-button');
        const infoButton = card.querySelector('.more-info-button');
        
        bookButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.handleBooking(card);
        });
        
        infoButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showEventDetails(card);
        });
        
        // Клик по карточке (кроме кнопок)
        card.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.showEventDetails(card);
            }
        });
    }
    
    handleBooking(card) {
        const eventTitle = card.querySelector('.event-title').textContent;
        this.showNotification(`Бронирование мероприятия "${eventTitle}"`, 'success');
        
        // Здесь можно добавить логику открытия модального окна бронирования
    }
    
    showEventDetails(card) {
        const eventTitle = card.querySelector('.event-title').textContent;
        this.showNotification(`Подробная информация о "${eventTitle}"`, 'info');
        
        // Здесь можно добавить логику открытия страницы с деталями мероприятия
    }
    
    // ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Наблюдаем за карточками мероприятий
        this.eventCards.forEach(card => {
            observer.observe(card);
        });
    }
    
    // ===== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ =====
    setupPerformanceOptimizations() {
        // Ленивая загрузка изображений
        this.setupLazyLoading();
        
        // Оптимизация анимаций
        this.optimizeAnimations();
        
        // Обработка ошибок
        this.setupErrorHandling();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('.event-image img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // В реальном приложении здесь можно загружать изображения с низким качеством сначала
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeAnimations() {
        const animatedElements = document.querySelectorAll('.event-card, .filter-tag, .nav-but');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform, opacity';
        });
    }
    
    setupErrorHandling() {
        // Обработка ошибок загрузки изображений
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                console.warn('Ошибка загрузки изображения:', e.target.src);
                // Можно показать placeholder
            }
        }, true);
    }
    
    // ===== УВЕДОМЛЕНИЯ =====
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
            background: ${type === 'error' ? '#ff6b6b' : '#4EE3C6'};
            color: ${type === 'error' ? 'white' : '#1D1D1D'};
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
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    showRegistrationModal() {
        this.showNotification('Функция регистрации будет доступна скоро!', 'info');
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    try {
        new EventsPage();
    } catch (error) {
        console.error('Ошибка инициализации страницы мероприятий:', error);
    }
});