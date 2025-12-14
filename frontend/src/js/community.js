// В начало файла добавить:
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Заменить функцию animateCounters:
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        
        // Если пользователь предпочитает уменьшенную анимацию
        if (prefersReducedMotion.matches) {
            counter.textContent = target >= 1000 ? target.toLocaleString() : target;
            return;
        }
        
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target >= 1000 ? target.toLocaleString() : target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.5,
            rootMargin: '100px' // Запускать анимацию раньше
        });
        
        observer.observe(counter);
    });
}

// Добавить функцию для доступности вкладок:
function setupAccessibleTabs() {
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Получаем ID панели, которой управляет эта вкладка
            const controls = this.getAttribute('aria-controls');
            const tabPanel = document.getElementById(controls);
            
            // Скрываем все панели
            tabPanels.forEach(panel => {
                panel.hidden = true;
                panel.setAttribute('aria-hidden', 'true');
            });
            
            // Убираем выделение со всех вкладок
            tabs.forEach(t => {
                t.setAttribute('aria-selected', 'false');
                t.classList.remove('active');
            });
            
            // Показываем нужную панель
            if (tabPanel) {
                tabPanel.hidden = false;
                tabPanel.setAttribute('aria-hidden', 'false');
            }
            
            // Выделяем текущую вкладку
            this.setAttribute('aria-selected', 'true');
            this.classList.add('active');
            
            // Фокус на панель для скринридеров
            if (tabPanel) {
                setTimeout(() => tabPanel.focus(), 100);
            }
        });
        
        // Поддержка клавиатуры
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            
            // Навигация стрелками
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const currentIndex = Array.from(tabs).indexOf(this);
                let nextIndex;
                
                if (e.key === 'ArrowRight') {
                    nextIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
                } else {
                    nextIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
                }
                
                tabs[nextIndex].focus();
                tabs[nextIndex].click();
            }
        });
    });
}

// Обновить функцию setupMessageSending:
function setupMessageSending() {
    const sendButtons = document.querySelectorAll('.send-message-btn');
    const messageInputs = document.querySelectorAll('.new-message-box textarea');
    
    sendButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const messageInput = messageInputs[index];
            const message = messageInput.value.trim();
            
            if (message) {
                if (message.length > 500) {
                    showNotification('Сообщение слишком длинное (максимум 500 символов)', 'error');
                    return;
                }
                
                sendMessage(message, index);
                messageInput.value = '';
                showNotification('Сообщение отправлено!', 'success');
            } else {
                messageInput.setAttribute('aria-invalid', 'true');
                showNotification('Введите текст сообщения', 'error');
            }
        });
    });
    
    // Сброс состояния ошибки при вводе
    messageInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.setAttribute('aria-invalid', 'false');
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                const button = this.closest('.new-message-box').querySelector('.send-message-btn');
                if (button) button.click();
            }
            
            // Подсчет символов
            const maxLength = 500;
            const currentLength = this.value.length;
            
            if (currentLength >= maxLength - 50) {
                // Создаем или обновляем счетчик символов
                let counter = this.nextElementSibling;
                if (!counter || !counter.classList.contains('char-counter')) {
                    counter = document.createElement('div');
                    counter.className = 'char-counter';
                    counter.style.cssText = `
                        font-size: 12px;
                        color: rgba(255, 255, 255, 0.6);
                        margin-top: 5px;
                        text-align: right;
                    `;
                    this.parentNode.insertBefore(counter, this.nextSibling);
                }
                
                counter.textContent = `${currentLength}/${maxLength}`;
                
                if (currentLength > maxLength) {
                    counter.style.color = '#ff6b6b';
                } else if (currentLength > maxLength - 10) {
                    counter.style.color = '#ffa726';
                } else {
                    counter.style.color = 'rgba(255, 255, 255, 0.6)';
                }
            }
        });
    });
}

// Обновить функцию init:
function init() {
    console.log('Initializing Community page...');
    
    // Запускаем анимацию счетчиков
    animateCounters();
    
    // Настраиваем фильтры интересов
    setupInterestFilters();
    
    // Настраиваем доступные вкладки
    setupAccessibleTabs();
    
    // Настраиваем временную шкалу
    setupTimeline();
    
    // Настраиваем отправку сообщений
    setupMessageSending();
    
    // Настраиваем кнопки "Написать сообщение"
    setupConnectButtons();
    
    // Настраиваем кнопки "Вступить"
    setupJoinButtons();
    
    // Обновляем статистику совпадений при загрузке
    setTimeout(updateMatchingStats, 1000);
    
    // Обновляем рекомендации при загрузке
    setTimeout(updateRecommendations, 1500);
    
    // Настраиваем обработчики лайков для существующих сообщений
    document.querySelectorAll('.feed-message').forEach(setupMessageActions);
    
    // Инициализация клавиатурной навигации для временной шкалы
    setupTimelineKeyboardNavigation();
    
    console.log('Community page initialized successfully');
}

// Новая функция для клавиатурной навигации по временной шкале:
function setupTimelineKeyboardNavigation() {
    const timelineNodes = document.querySelectorAll('.timeline-node[role="button"]');
    
    timelineNodes.forEach(node => {
        node.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
            
            // Навигация стрелками
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const currentIndex = Array.from(timelineNodes).indexOf(this);
                let nextIndex;
                
                if (e.key === 'ArrowRight') {
                    nextIndex = currentIndex === timelineNodes.length - 1 ? 0 : currentIndex + 1;
                } else {
                    nextIndex = currentIndex === 0 ? timelineNodes.length - 1 : currentIndex - 1;
                }
                
                timelineNodes[nextIndex].focus();
                timelineNodes[nextIndex].click();
            }
        });
    });
}