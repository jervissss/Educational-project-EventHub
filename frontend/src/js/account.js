// ===== УПРАВЛЕНИЕ ЛИЧНЫМ КАБИНЕТОМ =====
class AccountPage {
    constructor() {
        this.currentTab = 'profile';
        this.eventTabs = document.querySelectorAll('.event-tab');
        this.ticketFilters = document.querySelectorAll('.filter-btn');
        this.ticketTypesContainer = document.getElementById('ticketTypes');
        this.createEventForm = document.getElementById('createEventForm');
        this.addTicketTypeBtn = document.getElementById('addTicketType');
        this.settingsSwitches = document.querySelectorAll('.switch input');
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupTabSwitching();
        this.setupEventTabs();
        this.setupTicketFilters();
        this.setupCreateEventForm();
        this.setupSettings();
        this.setupInteractiveElements();
        this.setupAnimations();
        
        console.log('Account page initialized');
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
        
        // Меню пользователя
        const userMenu = document.querySelector('.user-menu');
        userMenu.addEventListener('click', () => {
            this.showUserMenu();
        });
    }
    
    navigateToPage(pageName) {
        if (pageName !== window.location.pathname.split('/').pop()) {
            window.location.href = pageName;
        }
    }
    
    showUserMenu() {
        this.showNotification('Меню пользователя', 'info');
        // Здесь можно добавить выпадающее меню с настройками профиля
    }
    
    // ===== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК =====
    setupTabSwitching() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const tabId = item.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }
    
    switchTab(tabId) {
        // Скрываем все вкладки
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Убираем активный класс у всех пунктов меню
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Показываем выбранную вкладку
        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add('active');
            
            // Активируем соответствующий пункт меню
            const activeNavItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }
            
            this.currentTab = tabId;
            this.showNotification(`Переключено на вкладку: ${this.getTabName(tabId)}`, 'success');
        }
    }
    
    getTabName(tabId) {
        const tabNames = {
            'profile': 'Профиль',
            'events': 'Мои мероприятия',
            'tickets': 'Мои билеты',
            'settings': 'Настройки',
            'create': 'Создание мероприятия'
        };
        return tabNames[tabId] || tabId;
    }
    
    // ===== ВКЛАДКА "МОИ МЕРОПРИЯТИЯ" =====
    setupEventTabs() {
        this.eventTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Убираем активный класс у всех вкладок
                this.eventTabs.forEach(t => t.classList.remove('active'));
                
                // Добавляем активный класс к выбранной вкладке
                tab.classList.add('active');
                
                // Фильтруем мероприятия
                const eventType = tab.getAttribute('data-event-type');
                this.filterEvents(eventType);
            });
        });
    }
    
    filterEvents(eventType) {
        const eventItems = document.querySelectorAll('.event-item');
        
        eventItems.forEach(item => {
            if (eventType === 'upcoming') {
                item.style.display = item.getAttribute('data-event-type') === 'upcoming' ? 'block' : 'none';
            } else if (eventType === 'past') {
                item.style.display = item.getAttribute('data-event-type') === 'past' ? 'block' : 'none';
            } else if (eventType === 'drafts') {
                item.style.display = item.getAttribute('data-event-type') === 'drafts' ? 'block' : 'none';
            } else {
                item.style.display = 'block';
            }
        });
        
        // Анимация появления
        setTimeout(() => {
            document.querySelectorAll('.event-item[style="display: block"]').forEach(item => {
                item.style.animation = 'fadeInUp 0.6s ease';
            });
        }, 50);
    }
    
    // ===== ВКЛАДКА "МОИ БИЛЕТЫ" =====
    setupTicketFilters() {
        this.ticketFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                // Убираем активный класс у всех фильтров
                this.ticketFilters.forEach(b => b.classList.remove('active'));
                
                // Добавляем активный класс к выбранному фильтру
                btn.classList.add('active');
                
                // Фильтруем билеты
                const filterType = btn.getAttribute('data-ticket-filter');
                this.filterTickets(filterType);
            });
        });
    }
    
    filterTickets(filterType) {
        const ticketCards = document.querySelectorAll('.ticket-card');
        
        ticketCards.forEach(card => {
            if (filterType === 'all') {
                card.style.display = 'block';
            } else {
                const ticketStatus = card.getAttribute('data-ticket-status');
                card.style.display = ticketStatus === filterType ? 'block' : 'none';
            }
        });
        
        // Анимация появления
        setTimeout(() => {
            document.querySelectorAll('.ticket-card[style="display: block"]').forEach(card => {
                card.style.animation = 'fadeInUp 0.6s ease';
            });
        }, 50);
    }
    
    // ===== ВКЛАДКА "СОЗДАНИЕ МЕРОПРИЯТИЯ" =====
    setupCreateEventForm() {
        // Добавление типа билета
        this.addTicketTypeBtn.addEventListener('click', () => {
            this.addTicketType();
        });
        
        // Обработка отправки формы
        this.createEventForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEventCreation();
        });
        
        // Кнопка сохранения черновика
        const saveDraftBtn = document.querySelector('.save-draft-btn');
        saveDraftBtn.addEventListener('click', () => {
            this.saveEventDraft();
        });
    }
    
    addTicketType() {
        const ticketTypeCount = this.ticketTypesContainer.children.length + 1;
        const newTicketType = document.createElement('div');
        newTicketType.className = 'ticket-type';
        newTicketType.innerHTML = `
            <div class="ticket-type-header">
                <h4>Тип билета ${ticketTypeCount}</h4>
                <button type="button" class="remove-ticket">×</button>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Название *</label>
                    <input type="text" class="ticket-name" placeholder="VIP, Стандарт и т.д." required>
                </div>
                <div class="form-group">
                    <label>Цена (₽) *</label>
                    <input type="number" class="ticket-price" placeholder="1000" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Количество *</label>
                    <input type="number" class="ticket-quantity" placeholder="100" required>
                </div>
                <div class="form-group">
                    <label>Описание</label>
                    <input type="text" class="ticket-description" placeholder="Описание билета">
                </div>
            </div>
        `;
        
        this.ticketTypesContainer.appendChild(newTicketType);
        
        // Добавляем обработчик для кнопки удаления
        const removeBtn = newTicketType.querySelector('.remove-ticket');
        removeBtn.addEventListener('click', () => {
            this.removeTicketType(newTicketType);
        });
        
        this.showNotification('Добавлен новый тип билета', 'success');
    }
    
    removeTicketType(ticketTypeElement) {
        if (this.ticketTypesContainer.children.length > 1) {
            ticketTypeElement.remove();
            this.showNotification('Тип билета удален', 'info');
        } else {
            this.showNotification('Нельзя удалить единственный тип билета', 'error');
        }
    }
    
    handleEventCreation() {
        // Валидация формы
        if (!this.validateEventForm()) {
            return;
        }
        
        // Сбор данных формы
        const formData = this.collectFormData();
        
        // Имитация отправки на сервер
        this.showLoadingState();
        
        setTimeout(() => {
            this.hideLoadingState();
            this.showNotification('Мероприятие успешно создано!', 'success');
            this.createEventForm.reset();
            
            // Переход на вкладку мероприятий
            this.switchTab('events');
        }, 2000);
    }
    
    validateEventForm() {
        const requiredFields = this.createEventForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                isValid = false;
            } else {
                field.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            this.showNotification('Заполните все обязательные поля', 'error');
        }
        
        return isValid;
    }
    
    collectFormData() {
        const formData = {
            title: document.getElementById('event-title').value,
            category: document.getElementById('event-category').value,
            description: document.getElementById('event-description').value,
            date: document.getElementById('event-date').value,
            time: document.getElementById('event-time').value,
            city: document.getElementById('event-city').value,
            location: document.getElementById('event-location').value,
            tickets: []
        };
        
        // Сбор данных о билетах
        const ticketTypes = this.ticketTypesContainer.querySelectorAll('.ticket-type');
        ticketTypes.forEach((ticket, index) => {
            const ticketData = {
                name: ticket.querySelector('.ticket-name')?.value || `Билет ${index + 1}`,
                price: ticket.querySelector('.ticket-price').value,
                quantity: ticket.querySelector('.ticket-quantity').value,
                description: ticket.querySelector('.ticket-description')?.value || ''
            };
            formData.tickets.push(ticketData);
        });
        
        return formData;
    }
    
    saveEventDraft() {
        this.showNotification('Черновик мероприятия сохранен', 'success');
        // Здесь можно добавить логику сохранения в localStorage или отправки на сервер
    }
    
    showLoadingState() {
        const submitBtn = this.createEventForm.querySelector('.publish-event-btn');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Создание...';
        submitBtn.disabled = true;
        
        // Сохраняем оригинальный текст для восстановления
        submitBtn.setAttribute('data-original-text', originalText);
    }
    
    hideLoadingState() {
        const submitBtn = this.createEventForm.querySelector('.publish-event-btn');
        const originalText = submitBtn.getAttribute('data-original-text');
        
        if (originalText) {
            submitBtn.textContent = originalText;
        }
        submitBtn.disabled = false;
    }
    
    // ===== ВКЛАДКА "НАСТРОЙКИ" =====
    setupSettings() {
        // Обработка переключателей
        this.settingsSwitches.forEach(switchEl => {
            switchEl.addEventListener('change', (e) => {
                const settingId = e.target.id;
                const isEnabled = e.target.checked;
                this.handleSettingChange(settingId, isEnabled);
            });
        });
        
        // Кнопки настроек
        const changePasswordBtn = document.querySelector('.change-password');
        const enable2faBtn = document.querySelector('.enable-2fa');
        
        changePasswordBtn.addEventListener('click', () => {
            this.showChangePasswordModal();
        });
        
        enable2faBtn.addEventListener('click', () => {
            this.enableTwoFactorAuth();
        });
    }
    
    handleSettingChange(settingId, isEnabled) {
        const settingMessages = {
            'email-notifications': `Email уведомления ${isEnabled ? 'включены' : 'выключены'}`,
            'sms-notifications': `SMS уведомления ${isEnabled ? 'включены' : 'выключены'}`,
            'public-profile': `Публичный профиль ${isEnabled ? 'включен' : 'выключен'}`,
            'event-history': `История мероприятий ${isEnabled ? 'отображается' : 'скрыта'}`
        };
        
        const message = settingMessages[settingId];
        if (message) {
            this.showNotification(message, 'success');
        }
    }
    
    showChangePasswordModal() {
        this.showNotification('Функция смены пароля будет доступна скоро', 'info');
        // Здесь можно добавить модальное окно смены пароля
    }
    
    enableTwoFactorAuth() {
        this.showNotification('Двухфакторная аутентификация будет настроена скоро', 'info');
        // Здесь можно добавить настройку 2FA
    }
    
    // ===== ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ =====
    setupInteractiveElements() {
        // Редактирование профиля
        const editProfileBtn = document.querySelector('.edit-profile-btn');
        editProfileBtn.addEventListener('click', () => {
            this.editProfile();
        });
        
        // Создание мероприятия из вкладки мероприятий
        const createEventFromEventsBtn = document.querySelector('.create-event-btn');
        createEventFromEventsBtn.addEventListener('click', () => {
            this.switchTab('create');
        });
        
        // Скачивание всех билетов
        const downloadAllBtn = document.querySelector('.download-all-btn');
        downloadAllBtn.addEventListener('click', () => {
            this.downloadAllTickets();
        });
        
        // Действия с мероприятиями и билетами
        this.setupActionButtons();
    }
    
    editProfile() {
        this.showNotification('Редактирование профиля будет доступно скоро', 'info');
        // Здесь можно добавить форму редактирования профиля
    }
    
    downloadAllTickets() {
        this.showNotification('Все билеты подготовлены для скачивания', 'success');
        // Здесь можно добавить логику скачивания билетов
    }
    
    setupActionButtons() {
        // Обработка кнопок действий
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('action-btn')) {
                this.handleActionButton(e.target);
            }
            
            if (e.target.classList.contains('ticket-btn')) {
                this.handleTicketButton(e.target);
            }
        });
    }
    
    handleActionButton(button) {
        const action = button.textContent.trim().toLowerCase();
        const eventItem = button.closest('.event-item');
        const eventTitle = eventItem.querySelector('h3').textContent;
        
        const actions = {
            'редактировать': () => this.editEvent(eventTitle),
            'статистика': () => this.showEventStats(eventTitle),
            'продвигать': () => this.promoteEvent(eventTitle),
            'просмотреть': () => this.viewEvent(eventTitle),
            'аналитика': () => this.showEventAnalytics(eventTitle),
            'дублировать': () => this.duplicateEvent(eventTitle)
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    handleTicketButton(button) {
        const action = button.textContent.trim().toLowerCase();
        const ticketCard = button.closest('.ticket-card');
        const eventTitle = ticketCard.querySelector('h3').textContent;
        
        const actions = {
            'скачать билет': () => this.downloadTicket(eventTitle),
            'передать': () => this.transferTicket(eventTitle),
            'отменить': () => this.cancelTicket(eventTitle),
            'чек': () => this.showReceipt(eventTitle),
            'оставить отзыв': () => this.leaveReview(eventTitle)
        };
        
        if (actions[action]) {
            actions[action]();
        }
    }
    
    editEvent(title) {
        this.showNotification(`Редактирование мероприятия: ${title}`, 'info');
    }
    
    showEventStats(title) {
        this.showNotification(`Статистика мероприятия: ${title}`, 'info');
    }
    
    promoteEvent(title) {
        this.showNotification(`Продвижение мероприятия: ${title}`, 'info');
    }
    
    viewEvent(title) {
        this.showNotification(`Просмотр мероприятия: ${title}`, 'info');
    }
    
    showEventAnalytics(title) {
        this.showNotification(`Аналитика мероприятия: ${title}`, 'info');
    }
    
    duplicateEvent(title) {
        this.showNotification(`Дублирование мероприятия: ${title}`, 'info');
    }
    
    downloadTicket(title) {
        this.showNotification(`Скачивание билета: ${title}`, 'success');
    }
    
    transferTicket(title) {
        this.showNotification(`Передача билета: ${title}`, 'info');
    }
    
    cancelTicket(title) {
        this.showNotification(`Отмена билета: ${title}`, 'info');
    }
    
    showReceipt(title) {
        this.showNotification(`Просмотр чека: ${title}`, 'info');
    }
    
    leaveReview(title) {
        this.showNotification(`Оставить отзыв: ${title}`, 'info');
    }
    
    // ===== АНИМАЦИИ =====
    setupAnimations() {
        // Анимация появления элементов при загрузке
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        // Наблюдаем за карточками и элементами
        const animatedElements = document.querySelectorAll('.event-item, .ticket-card, .detail-card, .settings-section, .form-section');
        animatedElements.forEach(el => {
            observer.observe(el);
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
        }, 3000);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    try {
        new AccountPage();
    } catch (error) {
        console.error('Ошибка инициализации личного кабинета:', error);
    }
});