let currentDay = 0;

        // Chart navigation
        function previousDay() {
            if (currentDay > 0) {
                selectDay(currentDay - 1);
            }
        }

        function nextDay() {
            if (currentDay < 6) {
                selectDay(currentDay + 1);
            }
        }

        function selectDay(day) {
    // Remove selected class from all forecast days
    document.querySelectorAll('.forecast-day').forEach(d => {
        d.classList.remove('selected');
    });
    
    // Add selected class to the clicked day
    const selectedDayElement = document.querySelector(`.forecast-day[data-day="${day}"]`);
    if (selectedDayElement) {
        selectedDayElement.classList.add('selected');
    }
    
    // Update current day and refresh chart
    currentDay = day;
    updateChart();
    
    // Debug output to console
    console.log(`Selected day ${day}, updated element:`, selectedDayElement);
}

        // Update hourly production chart
        function updateChart() {
            const chartContent = document.getElementById('chartContent');
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            
            // Generate data based on selected day
            const weatherPatterns = [
                [0,0,0,0,0,0.5,1.5,2.5,3.5,4.2,4.5,4.8,4.5,4.2,3.5,2.5,1.5,0.5,0,0,0,0,0,0], // Sunny
                [0,0,0,0,0,0.3,1.0,1.8,2.5,3.0,3.2,3.5,3.2,3.0,2.5,1.8,1.0,0.3,0,0,0,0,0,0], // Partly cloudy
                [0,0,0,0,0,0.2,0.5,0.8,1.2,1.5,1.8,2.0,1.8,1.5,1.2,0.8,0.5,0.2,0,0,0,0,0,0], // Cloudy
                [0,0,0,0,0,0.1,0.2,0.3,0.5,0.6,0.7,0.8,0.7,0.6,0.5,0.3,0.2,0.1,0,0,0,0,0,0], // Rainy
            ];
            
            const patterns = [0, 1, 2, 3, 1, 0, 0]; // Weather pattern for each day
            const data = weatherPatterns[patterns[currentDay]];
            
            // Clear previous chart
            chartContent.innerHTML = '';
            
            // Update prediction notice
            const notice = document.querySelector('.prediction-notice');
            if (currentDay === 0) {
                notice.innerHTML = `
                    
                    <span class="historical-indicator"></span>
                    <span>Dane historyczne </span>
                    <span class="prediction-indicator"></span>
                    <span> Predykcja na pozostałe godziny</span>
                `;
            } else {
                notice.innerHTML = `
                    
                    <span class="prediction-indicator"></span>
                    <span> Predykcja produkcji energii</span>
                `;
            }
            
            // Draw chart based on current day
            if (currentDay === 0) {
                // Today: show historical + prediction
                drawTodayChart(data, currentHour, currentMinute);
            } else {
                // Future days: show all as prediction
                drawFutureDayChart(data);
            }
        }

        function drawTodayChart(data, currentHour, currentMinute) {
            const chartContent = document.getElementById('chartContent');
            const breakPoint = currentHour + (currentMinute / 60);
            
            // History path
            let historyPath = 'M 20 180 ';
            for (let i = 0; i <= currentHour; i++) {
                const x = 20 + (i / 23) * 260;
                const y = 180 - (data[i] / 5) * 144;
                historyPath += `L ${x} ${y} `;
            }
            
            // Add point for current minute
            const currentX = 20 + (breakPoint / 23) * 260;
            const currentY = 180 - (data[currentHour] / 5) * 144;
            historyPath += `L ${currentX} ${currentY} `;
            
            // Area under history line
            const historyArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            historyArea.setAttribute('d', historyPath + `L ${currentX} 180 L 20 180 Z`);
            historyArea.setAttribute('class', 'chart-area-history');
            chartContent.appendChild(historyArea);
            
            // History line
            const historyLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            historyLine.setAttribute('d', historyPath);
            historyLine.setAttribute('class', 'chart-line-history');
            chartContent.appendChild(historyLine);
            
            // Prediction path
            let predictionPath = `M ${currentX} ${currentY} `;
            for (let i = currentHour + 1; i < 24; i++) {
                const x = 20 + (i / 23) * 260;
                const y = 180 - (data[i] / 5) * 144;
                predictionPath += `L ${x} ${y} `;
            }
            
            // Area under prediction line
            const predictionArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            predictionArea.setAttribute('d', predictionPath + `L 280 180 L ${currentX} 180 Z`);
            predictionArea.setAttribute('class', 'chart-area-prediction');
            chartContent.appendChild(predictionArea);
            
            // Prediction line
            const predictionLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            predictionLine.setAttribute('d', predictionPath);
            predictionLine.setAttribute('class', 'chart-line-prediction');
            chartContent.appendChild(predictionLine);
        }

        function drawFutureDayChart(data) {
            const chartContent = document.getElementById('chartContent');
            
            // For future days, show all as prediction
            let path = 'M 20 180 ';
            for (let i = 0; i < 24; i++) {
                const x = 20 + (i / 23) * 260;
                const y = 180 - (data[i] / 5) * 144;
                path += `L ${x} ${y} `;
            }
            
            // Area
            const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            area.setAttribute('d', path + 'L 280 180 L 20 180 Z');
            area.setAttribute('class', 'chart-area-prediction');
            chartContent.appendChild(area);
            
            // Line
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            line.setAttribute('d', path);
            line.setAttribute('class', 'chart-line-prediction');
            chartContent.appendChild(line);
        }

        // Initialize chart on load
        window.addEventListener('load', updateChart);
        
        // Task management
        function editTask(taskCard, deviceType) {
            // Store reference to the current task being edited
            currentTask = taskCard;
            
            // Show the modal
            document.getElementById('taskModal').classList.add('active');
            
            // Set default values based on device type
            const deviceNames = {
                'pralka': 'Pralka',
                'samochod': 'Ładowanie samochodu',
                'zmywarka': 'Zmywarka'
            };
            document.getElementById('deviceName').value = deviceNames[deviceType] || 'Nowe urządzenie';
            
            // Set today's date
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('taskDate').value = today;
            
            // Set duration based on device type
            selectedDuration = deviceDurations[deviceType] || 2;
            document.querySelectorAll('.duration-option').forEach(opt => {
                opt.classList.remove('selected');
                if (parseInt(opt.getAttribute('data-hours')) === selectedDuration) {
                    opt.classList.add('selected');
                }
            });
            
            // Get existing time if available
            if (taskCard) {
                const scheduleText = taskCard.querySelector('.schedule-text').textContent;
                const timeMatch = scheduleText.match(/(\d{1,2}):00 - (\d{1,2}):00/);
                if (timeMatch) {
                    selectedStartTime = timeMatch[1] + ':00';
                    // Select the correct time slot
                    document.querySelectorAll('.time-slot').forEach(slot => {
                        slot.classList.remove('selected');
                        if (slot.textContent === selectedStartTime) {
                            slot.classList.add('selected');
                        }
                    });
                }
            }
            
            // Update end time display
            updateEndTime();
        }
        
        function addTaskManual() {
            // Reset current task since we're adding a new one
            currentTask = null;
            
            // Show the modal
            document.getElementById('taskModal').classList.add('active');
            document.getElementById('deviceName').value = 'Nowe urządzenie';
            
            // Set today's date
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('taskDate').value = today;
            
            // Reset to default selection
            selectedStartTime = '13:00';
            selectedDuration = 2;
            
            // Update UI to match defaults
            document.querySelectorAll('.time-slot').forEach(slot => {
                slot.classList.remove('selected');
                if (slot.textContent === selectedStartTime) {
                    slot.classList.add('selected');
                }
            });
            
            document.querySelectorAll('.duration-option').forEach(opt => {
                opt.classList.remove('selected');
                if (parseInt(opt.getAttribute('data-hours')) === selectedDuration) {
                    opt.classList.add('selected');
                }
            });
            
            // Update end time display
            updateEndTime();
        }
        
        function addTaskAI() {
            // Simulate AI planning
            const chatMessages = document.querySelector('.chat-messages');
            switchTab('chat');
            
            const aiMessage = document.createElement('div');
            aiMessage.className = 'chat-message';
            aiMessage.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    Analizuję Twój harmonogram i prognozę pogody na najbliższy tydzień...
                    
                    Oto moje rekomendacje:
                    📍 Pralka - jutro 12:00-14:00 (słonecznie, 4.2 kW produkcji)
                    📍 Zmywarka - środa 13:00-15:00 (częściowe zachmurzenie, 3.5 kW)
                    📍 Ładowanie auta - czwartek 11:00-15:00 (pełne słońce, 4.8 kW)
                    
                    Czy chcesz, żebym dodał te zadania do harmonogramu?
                </div>
            `;
            chatMessages.appendChild(aiMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function updateEndTime() {
    // Calculate end time based on start time and duration
    const startHour = parseInt(selectedStartTime.split(':')[0]);
    const endHour = startHour + selectedDuration;
    const endTime = `${endHour}:00`;
    
    // Update the display
    document.getElementById('timeDisplay').innerHTML = `Godzina zakończenia: <strong>${endTime}</strong>`;
}
        
        function selectTime(slot) {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
        }
        
        function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
    currentTask = null;
}
        
        function saveTask() {
    // Get form values
    const deviceName = document.getElementById('deviceName').value;
    const taskDate = document.getElementById('taskDate').value;
    const startTime = selectedStartTime;
    const endTime = (parseInt(startTime) + selectedDuration) + ':00';
    
    // Format date for display
    const date = new Date(taskDate);
    const dayNames = ['Dziś', 'Jutro', 'Pojutrze', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
    let displayDate = dayNames[0]; // Default to "Today"
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
        displayDate = dayNames[0]; // Today
    } else if (date.toDateString() === tomorrow.toDateString()) {
        displayDate = dayNames[1]; // Tomorrow
    } else {
        // Use day name for other dates
        const dayIndex = date.getDay() + 3; // Adjust index for our array
        displayDate = dayNames[dayIndex > 7 ? dayIndex - 7 : dayIndex];
    }
    
    // Create task HTML structure
    let taskHTML = '';
    let deviceType = 'default';
    
    // Determine device type from name
    if (deviceName.toLowerCase().includes('pralk')) deviceType = 'pralka';
    else if (deviceName.toLowerCase().includes('samochód') || deviceName.toLowerCase().includes('samochod') || 
             deviceName.toLowerCase().includes('aut') || deviceName.toLowerCase().includes('ładowan')) deviceType = 'samochod';
    else if (deviceName.toLowerCase().includes('zmywar') || deviceName.toLowerCase().includes('naczyn')) deviceType = 'zmywarka';
    
    // Determine icon based on device type
    let icon = '📱'; // Default icon
    if (deviceType === 'pralka') icon = '🌊';
    else if (deviceType === 'samochod') icon = '🚗';
    else if (deviceType === 'zmywarka') icon = '🍽️';
    
    // Determine if the time slot is optimal
    const isOptimal = parseInt(startTime) >= 11 && parseInt(startTime) <= 14;
    
    // Determine power consumption based on device type
    let powerConsumption = '1.0 kW';
    if (deviceType === 'pralka') powerConsumption = '1.2 kW';
    else if (deviceType === 'samochod') powerConsumption = '3.6 kW';
    else if (deviceType === 'zmywarka') powerConsumption = '1.5 kW';
    
    // Create the task HTML
    taskHTML = `
        <div class="task-card" onclick="editTask(this, '${deviceType}')">
            <div class="task-header">
                <div class="task-icon">${icon}</div>
                <div class="task-info">
                    <div class="task-name">${deviceName}</div>
                    <div class="task-power">Zużycie: ${powerConsumption}</div>
                </div>
                ${isOptimal ? '<div class="optimal-badge">Optymalne</div>' : ''}
                <div class="task-edit" onclick="event.stopPropagation(); editTask(this.parentElement.parentElement, '${deviceType}')">✏️</div>
            </div>
            <div class="task-schedule">
                <span class="schedule-icon">🕐</span>
                <span class="schedule-text">${displayDate}, ${startTime} - ${endTime}</span>
            </div>
        </div>
    `;
    
    // Add or update task
    if (currentTask) {
        // Update existing task
        currentTask.outerHTML = taskHTML;
    } else {
        // Add new task
        document.getElementById('tasksList').insertAdjacentHTML('afterbegin', taskHTML);
    }
    
    // Close the modal
    closeModal();
}
        
        // Simulate real-time energy flow updates
        function updateEnergyFlow() {
            const production = (Math.random() * 2 + 2.5).toFixed(2);
            const consumption = (Math.random() * 1 + 0.8).toFixed(2);
            const toGrid = (production - consumption).toFixed(2);
            
            // Update values with animation
            const productionElement = document.querySelector('.energy-node:first-child .energy-value');
            const consumptionElement = document.querySelector('.energy-node:last-child .energy-value');
            
            if (productionElement) {
                productionElement.textContent = production + ' kW';
            }
            
            if (consumptionElement) {
                consumptionElement.textContent = consumption + ' kW';
            }
            
            // Update grid stat
            const gridStat = document.querySelector('.stat-card:nth-child(2) .stat-value');
            if (gridStat) {
                gridStat.textContent = toGrid + ' kW';
            }
        }
        

        function selectStartTime(slot) {
            // Update selected time slot
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            slot.classList.add('selected');
            selectedStartTime = slot.textContent;
            
            // Update end time display
            updateEndTime();
        }

        function selectDuration(option) {
            // Update selected duration
            document.querySelectorAll('.duration-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedDuration = parseInt(option.getAttribute('data-hours'));
            
            // Update end time display
            updateEndTime();
        }

        // Update energy flow every 5 seconds
        setInterval(updateEnergyFlow, 5000);
        
        // Handle quick actions in chat
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', function() {
                const chatMessages = document.querySelector('.chat-messages');
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user-message';
                userMessage.innerHTML = `
                    <div class="message-content">${this.textContent}</div>
                    <div class="message-avatar">👤</div>
                `;
                chatMessages.appendChild(userMessage);
                
                // Simulate bot response
                setTimeout(() => {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'chat-message';
                    let responseText = '';
                    
                    switch(this.textContent) {
                        case '💡 Porady oszczędnościowe':
                            responseText = `Oto kilka sposobów na maksymalizację oszczędności:
                                
                                1. 🕐 Przesuń pranie i zmywanie na godziny 11:00-15:00
                                2. 🔋 Wykorzystuj baterię domową w godzinach wieczornych
                                3. 🚗 Ładuj samochód elektryczny w weekendy (większa produkcja)
                                4. 💡 Wymień żarówki na LED - zmniejszysz zużycie o 80%
                                
                                Przy obecnym profilu możesz zaoszczędzić dodatkowo 120 zł miesięcznie!`;
                            break;
                        case '📊 Analiza zużycia':
                            responseText = `Twoje zużycie w tym miesiącu:
                                
                                📈 Całkowite: 385 kWh (-12% vs poprzedni miesiąc)
                                🏠 Dom: 220 kWh
                                🚗 Samochód: 165 kWh
                                
                                Największe zużycie: godz. 18:00-21:00
                                Sugestia: Przesuń gotowanie na godziny dzienne gdy masz nadwyżkę produkcji`;
                            break;
                        case '🔋 Stan systemu':
                            responseText = `System działa optymalnie:
                                
                                ☀️ Panele: 100% sprawności
                                🔋 Bateria: 100% naładowana (10.5 kWh)
                                🔌 Inverter: Temperatura 32°C (norma)
                                📊 Dzienna produkcja: 18.3 kWh
                                
                                Ostatni przegląd: 2 tygodnie temu
                                Następny przegląd: za 2.5 miesiąca`;
                            break;
                        case '☀️ Prognoza produkcji':
                            responseText = `Prognoza na najbliższe dni:
                                
                                Jutro: ☀️ 28.5 kWh (słonecznie)
                                Wtorek: ⛅ 22.3 kWh (częściowe zachmurzenie)
                                Środa: ☁️ 15.8 kWh (zachmurzenie)
                                Czwartek: 🌧️ 8.2 kWh (deszcz)
                                Piątek: ⛅ 24.1 kWh
                                
                                Najlepsze dni na energochłonne zadania: poniedziałek i piątek!`;
                            break;
                        case '🏠 Optymalizacja domu':
                            responseText = `Rekomendacje dla Twojego domu:
                                
                                1. 🌡️ Obniż temperaturę bojlera o 5°C - oszczędność 50 kWh/miesiąc
                                2. 🪟 Zainstaluj rolety automatyczne - lepsza izolacja
                                3. 💨 Wymień filtry w klimatyzacji - poprawa wydajności o 15%
                                4. 🔌 Dodaj smart gniazdka do kontroli urządzeń w standby
                                
                                ROI tych zmian: 14 miesięcy
                                Roczna oszczędność: 1,850 zł`;
                            break;
                    }
                    
                    botMessage.innerHTML = `
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">${responseText}</div>
                    `;
                    chatMessages.appendChild(botMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 800);
            });
        });
        
        // Handle chat input
        const chatInput = document.querySelector('.chat-input');
        const chatSend = document.querySelector('.chat-send');
        
        if (chatSend) {
            chatSend.addEventListener('click', sendMessage);
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        function sendMessage() {
            const input = document.querySelector('.chat-input');
            const message = input.value.trim();
            
            if (message) {
                const chatMessages = document.querySelector('.chat-messages');
                const userMessage = document.createElement('div');
                userMessage.className = 'chat-message user-message';
                userMessage.innerHTML = `
                    <div class="message-content">${message}</div>
                    <div class="message-avatar">👤</div>
                `;
                chatMessages.appendChild(userMessage);
                
                input.value = '';
                
                // Simulate intelligent response
                setTimeout(() => {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'chat-message';
                    
                    // Generate contextual response based on message content
                    let responseText = '';
                    const lowerMessage = message.toLowerCase();
                    
                    if (lowerMessage.includes('pralk') || lowerMessage.includes('pran')) {
                        responseText = 'Sprawdzam optymalne godziny na pranie... Najbliższe okno to jutro 12:00-14:00. Produkcja wyniesie wtedy 4.2 kW, co w pełni pokryje zapotrzebowanie pralki. Czy mam zarezerwować ten termin?';
                    } else if (lowerMessage.includes('samoch') || lowerMessage.includes('aut')) {
                        responseText = 'Dla ładowania samochodu elektrycznego polecam czwartek 10:00-16:00. Będzie pełne słońce, a produkcja osiągnie szczyt 4.8 kW. Naładujesz baterię do 80% używając tylko energii słonecznej!';
                    } else if (lowerMessage.includes('oszczędz') || lowerMessage.includes('zaoszczędz')) {
                        responseText = 'Analizując Twoje zużycie, możesz zaoszczędzić około 150 zł miesięcznie przesuwając główne zadania na godziny 11:00-15:00. Dodatkowo, obniżenie temperatury bojlera o 5°C da kolejne 20 zł oszczędności.';
                    } else if (lowerMessage.includes('pogod') || lowerMessage.includes('prognoz')) {
                        responseText = 'Najbliższe 3 dni będą słoneczne z produkcją 25-30 kWh dziennie. Od czwartku nadchodzi front z opadami - produkcja spadnie do 8-12 kWh. Polecam zaplanować energochłonne zadania na początek tygodnia.';
                    } else {
                        responseText = 'Rozumiem Twoje pytanie. Analizuję dane i przygotowuję najlepszą odpowiedź bazując na aktualnej produkcji energii, prognozie pogody i Twoim profilu zużycia...';
                    }
                    
                    botMessage.innerHTML = `
                        <div class="message-avatar">🤖</div>
                        <div class="message-content">${responseText}</div>
                    `;
                    chatMessages.appendChild(botMessage);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                }, 800);
            }
        }
        function switchTab(tabName) {
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-view').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Add active class to selected tab and button
        document.getElementById(tabName + 'Tab').classList.add('active');
        event.currentTarget.classList.add('active');
        
        // Update chart when weather tab is selected
        if (tabName === 'weather') {
            updateChart();
        }
    }
        
        // Initialize chart on load
        window.addEventListener('load', function() {
            updateChart();
            
            // Animate stats on home page
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.opacity = '0';
                    stat.style.transform = 'translateY(10px)';
                    stat.style.transition = 'all 0.5s ease';
                    
                    setTimeout(() => {
                        stat.style.opacity = '1';
                        stat.style.transform = 'translateY(0)';
                    }, 50);
                }, index * 100);
            });
        });
        function updateClock() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = String(now.getMinutes()).padStart(2, '0'); // Add leading zero
    
    // Find the span element and update its content
    document.getElementById('timeDisplay').textContent = `${currentHour}:${currentMinute}`;
}

// Update immediately
updateClock();

// Update every minute (optional)
setInterval(updateClock, 60000);
let isRecording = false;

function toggleMic() {
    const micButton = document.getElementById('micButton');
    
    if (!isRecording) {
        // Start recording
        isRecording = true;
        micButton.classList.add('recording');
        micButton.innerHTML = '🔴';
        
        // Add message to chat
        const chatMessages = document.querySelector('.chat-messages');
        const statusMessage = document.createElement('div');
        statusMessage.className = 'chat-message';
        statusMessage.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">Słucham... (naciśnij ponownie aby zatrzymać nagrywanie)</div>
        `;
        chatMessages.appendChild(statusMessage);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
    } else {
        // Stop recording
        isRecording = false;
        micButton.classList.remove('recording');
        micButton.innerHTML = '🎤';
        
        // Simulate processing voice input
        setTimeout(() => {
            const chatMessages = document.querySelector('.chat-messages');
            const userMessage = document.createElement('div');
            userMessage.className = 'chat-message user-message';
            userMessage.innerHTML = `
                <div class="message-content">Kiedy najlepiej włączyć pralkę?</div>
                <div class="message-avatar">👤</div>
            `;
            chatMessages.appendChild(userMessage);
            
            // Bot response
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'chat-message';
                botMessage.innerHTML = `
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">Na podstawie prognozy produkcji energii, najlepszy czas na pranie to jutro między 12:00-14:00. Produkcja słoneczna wyniesie wtedy 4.2 kW, co w pełni pokryje zapotrzebowanie pralki.</div>
                `;
                chatMessages.appendChild(botMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }
}