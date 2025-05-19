document.addEventListener('DOMContentLoaded', () => {
    // LIGHT SWITCH
    const switchButton = document.querySelector('.switch');
    switchButton?.addEventListener('click', () => {
        document.body.classList.toggle('on');
    });

    // CLOCK
    const clockEl = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString('en-IN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
    updateClock();
    setInterval(updateClock, 1000);

    // TIMER
    let timerInterval = null;
    let totalSeconds = 0;
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');

    function updateTimerDisplay() {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(totalSeconds % 60).padStart(2, '0');
        timerDisplay.textContent = `${hours}:${mins}:${secs}`;
    }

    startBtn.addEventListener('click', () => {
        if (timerInterval) return;
        timerInterval = setInterval(() => {
            totalSeconds++;
            updateTimerDisplay();
        }, 1000);
    });

    pauseBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        timerInterval = null;
        totalSeconds = 0;
        updateTimerDisplay();
    });

    updateTimerDisplay();

    // TO-DO LIST
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    let tasks = [];

    // Load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
        tasks.forEach(task => {
            taskList.appendChild(createTaskElement(task.text, task.done));
        });
    }

    // Add task via button (called inline in HTML)
    window.addTask = function () {
        const text = taskInput.value.trim();
        if (!text) return;

        const task = { text, done: false };
        tasks.push(task);
        taskList.appendChild(createTaskElement(text, false));
        updateLocalStorage();
        taskInput.value = '';
    };

    function createTaskElement(text, done) {
        const li = document.createElement('li');
        li.className = 'todo';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = done;

        const span = document.createElement('span');
        span.className = 'task';
        span.textContent = text;
        span.contentEditable = true;
        span.style.textDecoration = done ? 'line-through' : 'none';
        span.style.cursor = 'text';

        checkbox.addEventListener('change', () => {
            span.style.textDecoration = checkbox.checked ? 'line-through' : 'none';
            syncTasksFromDOM();
        });

        span.addEventListener('blur', syncTasksFromDOM);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.title = 'Delete task';
        deleteBtn.addEventListener('click', () => {
            li.remove();
            syncTasksFromDOM();
        });

        li.append(checkbox, span, deleteBtn);
        return li;
    }

    function syncTasksFromDOM() {
        const items = document.querySelectorAll('#task-list .todo');
        tasks = Array.from(items).map(item => {
            const checkbox = item.querySelector('input[type="checkbox"]');
            const taskSpan = item.querySelector('.task');
            return {
                text: taskSpan?.textContent.trim() || '',
                done: checkbox?.checked || false
            };
        });
        updateLocalStorage();
    }

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
