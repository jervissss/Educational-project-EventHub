/*
 * EventHub Community Page - JavaScript файл
 * Автор: [Имя разработчика]
 * Дата: 2024
 * Версия: 1.0
 * 
 * Основные функции:
 * 1. Анимация счетчиков
 * 2. Управление вкладками
 * 3. Система сообщений
 * 4. Навигация между страницами
 * 5. Взаимодействие с пользователями
 */

// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И НАСТРОЙКИ =====
/*
 * Проверяем предпочтения пользователя по анимациям
 * Для людей с чувствительностью к движению
 */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// ===== НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ =====
/*
 * Обработка навигации по сайту
 * Аналогично функционалу на главной странице
 */
function setupNavigation() {
    console.log('Setting up navigation...');
    
    const navButtons = document.querySelectorAll('.nav-but');
    const regButton = document.querySelector('.reg-button');
    
    // Обработка кликов по кнопкам навигации
    navButtons.forEach(button => {
        // Если это текущая страница, пропускаем
        if (button.classList.contains('curr')) {
            button.style.cursor = 'default';
            return;
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = button.getAttribute('data-page');
            
            if (targetPage) {
                // Визуальная обратная связь
                button.style.transform = 'scale(0.95)';
                button.style.opacity = '0.8';
                
                // Плавный переход через 150мс
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 150);
            }
        });
    });
    
    // Обработка кнопки регистрации
    if (regButton) {
        regButton.addEventListener('click', () => {
            showNotification('Функция регистрации будет доступна скоро!', 'info');
        });
    }
    
    // Логотип в хедере ведет на главную
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('click', () => {
            window.location.href = '../public/index.html';
        });
        
        // Поддержка клавиатуры
        logoContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = '../public/index.html';
            }
        });
    }
    
    // Логотип в подвале скроллит наверх
    const footerLogo = document.querySelector('.logo-line-container');
    if (footerLogo) {
        footerLogo.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        footerLogo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
    
    console.log('Navigation setup complete');
}

// ===== АНИМАЦИЯ СЧЕТЧИКОВ =====
/*
 * Анимация цифр в статистике сообщества
 * Плавный счет от 0 до целевого значения
 */
function animateCounters() {
    console.log('Initializing counter animations...');
    
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
    
    console.log('Counter animations initialized');
}

// ===== ДОСТУПНЫЕ ВКЛАДКИ =====
/*
 * Реализация доступных вкладок с поддержкой клавиатуры
 * Соответствует WAI-ARIA стандартам
 */
function setupAccessibleTabs() {
    console.log('Setting up accessible tabs...');
    
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabPanels = document.querySelectorAll('[role="tabpanel"]');
    
    if (tabs.length === 0) {
        console.log('No tabs found, skipping tab setup');
        return;
    }
    
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
    
    console.log('Accessible tabs setup complete');
}

// ===== ФИЛЬТРЫ ИНТЕРЕСОВ =====
/*
 * Управление фильтрами для поиска единомышленников
 * Динамическая фильтрация карточек людей
 */
function setupInterestFilters() {
    console.log('Setting up interest filters...');
    
    const filterButtons = document.querySelectorAll('.interest-tag');
    const peopleCards = document.querySelectorAll('.person-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Снимаем активность со всех кнопок
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            
            // Активируем текущую кнопку
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            const filter = this.textContent.toLowerCase();
            
            // Фильтрация карточек
            peopleCards.forEach(card => {
                if (filter === 'все') {
                    card.style.display = 'flex';
                } else {
                    const tags = Array.from(card.querySelectorAll('.person-tag'))
                        .map(tag => tag.textContent.toLowerCase());
                    
                    if (tags.includes(filter)) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Анимация обновления
            if (!prefersReducedMotion.matches) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
        
        // Поддержка клавиатуры
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
    
    console.log('Interest filters setup complete');
}

// ===== ВРЕМЕННАЯ ШКАЛА =====
/*
 * Интерактивная временная шкала интересов
 * Показывает эволюцию интересов пользователя
 */
function setupTimeline() {
    console.log('Setting up timeline...');
    
    const timelineNodes = document.querySelectorAll('.timeline-node');
    const prevBtn = document.querySelector('.timeline-nav-btn.prev');
    const nextBtn = document.querySelector('.timeline-nav-btn.next');
    const periodElement = document.querySelector('.timeline-period');
    
    let currentYear = 2024;
    
    // Обработка кликов по узлам временной шкалы
    timelineNodes.forEach(node => {
        node.addEventListener('click', function() {
            // Снимаем активность со всех узлов
            timelineNodes.forEach(n => n.classList.remove('active'));
            
            // Активируем текущий узел
            this.classList.add('active');
            
            // Получаем данные о месяце
            const month = this.getAttribute('data-month');
            const category = this.querySelector('h4').textContent;
            
            // Показываем уведомление (в реальном проекте здесь будет загрузка данных)
            showNotification(`Показаны мероприятия за ${month} в категории "${category}"`, 'info');
        });
    });
    
    // Кнопка "Назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentYear--;
            updateTimelinePeriod();
        });
    }
    
    // Кнопка "Вперед"
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentYear++;
            updateTimelinePeriod();
        });
    }
    
    // Обновление отображаемого периода
    function updateTimelinePeriod() {
        if (periodElement) {
            periodElement.textContent = currentYear;
            
            // Анимация обновления
            if (!prefersReducedMotion.matches) {
                periodElement.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    periodElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }
    
    console.log('Timeline setup complete');
}

// ===== КЛАВИАТУРНАЯ НАВИГАЦИЯ ПО ВРЕМЕННОЙ ШКАЛЕ =====
/*
 * Добавление поддержки клавиатуры для временной шкалы
 * Соответствует стандартам доступности
 */
function setupTimelineKeyboardNavigation() {
    console.log('Setting up timeline keyboard navigation...');
    
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
    
    console.log('Timeline keyboard navigation setup complete');
}

// ===== СИСТЕМА СООБЩЕНИЙ =====
/*
 * Отправка и управление сообщениями в лентах мероприятий
 * Валидация и ограничения
 */
function setupMessageSending() {
    console.log('Setting up message sending system...');
    
    const sendButtons = document.querySelectorAll('.send-message-btn');
    const messageInputs = document.querySelectorAll('.new-message-box textarea');
    
    if (sendButtons.length === 0) {
        console.log('No message send buttons found, skipping message setup');
        return;
    }
    
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
    
    console.log('Message sending system setup complete');
}

// ===== ОТПРАВКА СООБЩЕНИЯ (ЗАГЛУШКА) =====
/*
 * Имитация отправки сообщения
 * В реальном проекте здесь будет API запрос
 */
function sendMessage(message, feedIndex) {
    console.log(`Sending message to feed ${feedIndex}: ${message.substring(0, 50)}...`);
    
    // Имитация задержки сети
    setTimeout(() => {
        // В реальном проекте здесь будет добавление сообщения в ленту
        console.log('Message sent successfully');
    }, 500);
}

// ===== КНОПКИ "НАПИСАТЬ СООБЩЕНИЕ" =====
/*
 * Обработка кнопок связи с другими пользователями
 * Имитация начала диалога
 */
function setupConnectButtons() {
    console.log('Setting up connect buttons...');
    
    const connectButtons = document.querySelectorAll('.connect-btn');
    
    connectButtons.forEach(button => {
        button.addEventListener('click', function() {
            const personName = this.closest('.person-info').querySelector('h3').textContent;
            
            // Визуальная обратная связь
            const originalText = this.textContent;
            this.textContent = 'Отправка...';
            this.disabled = true;
            
            // Имитация отправки запроса
            setTimeout(() => {
                this.textContent = 'Сообщение отправлено';
                this.style.backgroundColor = '#3bc9ad';
                
                showNotification(`Сообщение отправлено ${personName}!`, 'success');
                
                // Возвращаем исходное состояние через 2 секунды
                setTimeout(() => {
                    this.textContent = originalText;
                    this.disabled = false;
                    this.style.backgroundColor = '';
                }, 2000);
            }, 1000);
        });
    });
    
    console.log('Connect buttons setup complete');
}

// ===== КНОПКИ "ВСТУПИТЬ" =====
/*
 * Обработка вступления в сообщества
 * Имитация подписки на комьюнити
 */
function setupJoinButtons() {
    console.log('Setting up join buttons...');
    
    const joinButtons = document.querySelectorAll('.join-community-btn');
    
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            const communityName = this.closest('.community-card').querySelector('h3').textContent;
            
            // Визуальная обратная связь
            const originalText = this.textContent;
            this.textContent = 'Вступление...';
            this.disabled = true;
            
            // Имитация процесса вступления
            setTimeout(() => {
                this.textContent = 'Вы в сообществе!';
                this.style.backgroundColor = '#3bc9ad';
                this.style.borderColor = '#3bc9ad';
                
                showNotification(`Вы успешно вступили в сообщество "${communityName}"!`, 'success');
                
                // Обновляем счетчик участников
                const memberCount = this.closest('.community-card').querySelector('.member-count');
                if (memberCount) {
                    const currentCount = parseInt(memberCount.textContent);
                    if (!isNaN(currentCount)) {
                        memberCount.textContent = `${currentCount + 1} участников`;
                    }
                }
                
                // Через 2 секунды меняем текст на "Выйти"
                setTimeout(() => {
                    this.textContent = 'Выйти';
                    this.disabled = false;
                    this.style.backgroundColor = '';
                    this.style.borderColor = '';
                    
                    // Меняем обработчик для выхода
                    this.onclick = function() {
                        leaveCommunity(this, communityName);
                    };
                }, 2000);
            }, 1000);
        });
    });
    
    console.log('Join buttons setup complete');
}

// ===== ВЫХОД ИЗ СООБЩЕСТВА =====
/*
 * Обработка выхода из сообщества
 */
function leaveCommunity(button, communityName) {
    button.textContent = 'Выход...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = 'Вступить';
        button.disabled = false;
        
        // Возвращаем оригинальный обработчик
        button.onclick = function() {
            const communityName = this.closest('.community-card').querySelector('h3').textContent;
            
            this.textContent = 'Вступление...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = 'Вы в сообществе!';
                this.style.backgroundColor = '#3bc9ad';
                this.style.borderColor = '#3bc9ad';
                
                showNotification(`Вы успешно вступили в сообщество "${communityName}"!`, 'success');
                
                setTimeout(() => {
                    this.textContent = 'Выйти';
                    this.disabled = false;
                    this.style.backgroundColor = '';
                    this.style.borderColor = '';
                    
                    this.onclick = function() {
                        leaveCommunity(this, communityName);
                    };
                }, 2000);
            }, 1000);
        };
        
        showNotification(`Вы вышли из сообщества "${communityName}"`, 'info');
    }, 1000);
}

// ===== ДЕЙСТВИЯ С СООБЩЕНИЯМИ =====
/*
 * Обработка лайков и ответов на сообщения
 */
function setupMessageActions(messageElement) {
    const likeButton = messageElement.querySelector('.message-action.like');
    const replyButton = messageElement.querySelector('.message-action.reply');
    
    if (likeButton) {
        likeButton.addEventListener('click', function() {
            const likeCountElement = this.querySelector('.like-count');
            let likeCount = parseInt(likeCountElement.textContent);
            
            // Переключение состояния лайка
            if (this.classList.contains('liked')) {
                likeCount--;
                this.classList.remove('liked');
                this.style.color = '';
            } else {
                likeCount++;
                this.classList.add('liked');
                this.style.color = '#4EE3C6';
            }
            
            likeCountElement.textContent = likeCount;
            
            // Анимация
            if (!prefersReducedMotion.matches) {
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            }
        });
    }
    
    if (replyButton) {
        replyButton.addEventListener('click', function() {
            const messageAuthor = messageElement.querySelector('.message-author').textContent;
            const textarea = messageElement.closest('.feed-content').querySelector('textarea');
            
            if (textarea) {
                textarea.value = `@${messageAuthor} `;
                textarea.focus();
                textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                
                showNotification(`Начинаете ответ ${messageAuthor}`, 'info');
            }
        });
    }
}

// ===== ОБНОВЛЕНИЕ СТАТИСТИКИ СОВПАДЕНИЙ =====
/*
 * Динамическое обновление статистики совпадений интересов
 * Имитация расчета в реальном времени
 */
function updateMatchingStats() {
    console.log('Updating matching stats...');
    
    const matchPercentage = document.querySelector('.match-percentage');
    const matchInfo = document.querySelector('.match-info p');
    
    if (matchPercentage && matchInfo) {
        // Имитация пересчета
        setTimeout(() => {
            const newPercentage = Math.min(95, Math.floor(Math.random() * 10) + 85);
            matchPercentage.textContent = `${newPercentage}%`;
            
            const newMatches = Math.floor(Math.random() * 10) + 20;
            matchInfo.textContent = `На основе ваших 12 посещенных мероприятий мы нашли ${newMatches} человек с похожими интересами`;
            
            // Анимация обновления
            if (!prefersReducedMotion.matches) {
                matchPercentage.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    matchPercentage.style.transform = '';
                }, 300);
            }
        }, 800);
    }
}

// ===== ОБНОВЛЕНИЕ РЕКОМЕНДАЦИЙ =====
/*
 * Динамическое обновление рекомендаций мероприятий
 * Имитация персонализированных рекомендаций
 */
function updateRecommendations() {
    console.log('Updating recommendations...');
    
    const recommendationsList = document.querySelector('.recommendations-list');
    
    if (recommendationsList) {
        // Имитация загрузки новых рекомендаций
        setTimeout(() => {
            // Пример новых рекомендаций (в реальном проекте с API)
            const newRecommendations = [
                { category: 'Фотография', event: 'Мастер-класс по портретной съемке' },
                { category: 'Дизайн', event: 'Выставка современного дизайна' },
                { category: 'Технологии', event: 'Встреча IT-сообщества' }
            ];
            
            // Очищаем текущие рекомендации
            recommendationsList.innerHTML = '';
            
            // Добавляем новые рекомендации
            newRecommendations.forEach(rec => {
                const recommendation = document.createElement('div');
                recommendation.className = 'recommendation';
                recommendation.setAttribute('role', 'article');
                
                recommendation.innerHTML = `
                    <span class="rec-category" aria-label="Категория: ${rec.category}">${rec.category}</span>
                    <span class="rec-event">${rec.event}</span>
                `;
                
                recommendationsList.appendChild(recommendation);
            });
            
            // Анимация появления
            if (!prefersReducedMotion.matches) {
                recommendationsList.style.opacity = '0';
                setTimeout(() => {
                    recommendationsList.style.transition = 'opacity 0.5s ease';
                    recommendationsList.style.opacity = '1';
                }, 50);
            }
            
            showNotification('Рекомендации обновлены на основе вашей активности!', 'info');
        }, 1200);
    }
}

// ===== СИСТЕМА УВЕДОМЛЕНИЙ =====
/*
 * Показ временных уведомлений пользователю
 * Поддержка разных типов сообщений
 */
function showNotification(message, type = 'info') {
    console.log(`Showing notification: ${message} (type: ${type})`);
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'info' ? '#4EE3C6' : type === 'success' ? '#66bb6a' : '#ff6b6b'};
        color: #1D1D1D;
        padding: 15px 25px;
        border-radius: 10px;
        font-family: Montserrat, sans-serif;
        font-weight: 600;
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        max-width: 350px;
        word-wrap: break-word;
        pointer-events: auto;
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Автоматическое скрытие через 4 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
    
    // Закрытие по клику
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    });
}

// ===== ОБРАБОТКА ОШИБОК =====
/*
 * Глобальная обработка ошибок JavaScript
 * Логирование и уведомления пользователя
 */
function setupErrorHandling() {
    console.log('Setting up error handling...');
    
    // Обработка ошибок загрузки изображений
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            console.warn('Ошибка загрузки изображения:', e.target.src);
            e.target.style.opacity = '0.5';
            
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
                    font-size: 1.5em;
                    position: absolute;
                    top: 0;
                    left: 0;
                    border-radius: inherit;
                `;
                parent.style.position = 'relative';
                parent.appendChild(fallback);
            }
        }
    }, true);
    
    // Глобальный обработчик ошибок JavaScript
    window.addEventListener('error', (e) => {
        console.error('Global JavaScript error:', e.error);
        
        // Показываем пользователю понятное сообщение
        showNotification('Произошла непредвиденная ошибка. Пожалуйста, обновите страницу.', 'error');
    });
    
    // Обработка необработанных промисов
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        showNotification('Произошла ошибка при выполнении операции', 'error');
    });
    
    console.log('Error handling setup complete');
}

// ===== ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ =====
/*
 * Различные оптимизации для улучшения производительности
 */
function setupPerformanceOptimizations() {
    console.log('Setting up performance optimizations...');
    
    // Добавляем will-change для элементов с анимациями
    const animatedElements = document.querySelectorAll('.feature-card, .person-card, .community-card, .event-feed');
    animatedElements.forEach(el => {
        el.style.willChange = 'transform, opacity';
    });
    
    // Предотвращение множественных быстрых кликов
    let lastClickTime = 0;
    document.addEventListener('click', (e) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 500) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Fast click prevented');
        }
        lastClickTime = currentTime;
    }, true);
    
    console.log('Performance optimizations setup complete');
}

// ===== ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ =====
/*
 * Основная точка входа
 * Инициализация всех компонентов
 */
function init() {
    console.log('Initializing EventHub Community page...');
    
    try {
        // Настраиваем навигацию между страницами
        setupNavigation();
        
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
        
        // Инициализация клавиатурной навигации для временной шкалы
        setupTimelineKeyboardNavigation();
        
        // Настраиваем обработку ошибок
        setupErrorHandling();
        
        // Настраиваем оптимизации производительности
        setupPerformanceOptimizations();
        
        // Настраиваем обработчики лайков для существующих сообщений
        document.querySelectorAll('.feed-message').forEach(setupMessageActions);
        
        // Обновляем статистику совпадений при загрузке
        setTimeout(updateMatchingStats, 1000);
        
        // Обновляем рекомендации при загрузке
        setTimeout(updateRecommendations, 1500);
        
        console.log('EventHub Community page initialized successfully');
        
        // Отправляем аналитику об успешной загрузке
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Community',
                page_location: window.location.href
            });
        }
        
    } catch (error) {
        console.error('Error initializing Community page:', error);
        showNotification('Ошибка при загрузке страницы. Пожалуйста, обновите страницу.', 'error');
    }
}

// ===== ОЧИСТКА ПРИ ВЫГРУЗКЕ =====
/*
 * Очистка ресурсов при переходе на другую страницу
 */
window.addEventListener('beforeunload', () => {
    console.log('Cleaning up resources before page unload...');
    
    // Очищаем все активные таймеры
    const maxTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < maxTimeoutId; i++) {
        clearTimeout(i);
    }
    
    // Снимаем обработчики событий
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const newElement = element.cloneNode(false);
        element.parentNode.replaceChild(newElement, element);
    });
});

// ===== ЗАПУСК ПРИ ПОЛНОЙ ЗАГРУЗКЕ ДОКУМЕНТА =====
/*
 * Ждем полной загрузки DOM перед инициализацией
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, starting initialization...');
    
    // Небольшая задержка для гарантии полной загрузки стилей
    setTimeout(init, 100);
});

// ===== ОБРАБОТКА СОСТОЯНИЯ СТРАНИЦЫ =====
/*
 * Улучшение UX при скрытии/показа страницы
 */
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('Page became visible, updating content...');
        
        // Обновляем данные при возвращении на страницу
        setTimeout(updateMatchingStats, 500);
        setTimeout(updateRecommendations, 800);
    }
});

// ===== РЕСАЙЗ ОКНА =====
/*
 * Оптимизация обработки ресайза окна
 */
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        console.log('Window resized, checking layout...');
        
        // Проверяем и корректируем layout при необходимости
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid && window.innerWidth < 768) {
            // Адаптивные корректировки для мобильных
            featuresGrid.style.gap = '20px';
        }
    }, 250);
});