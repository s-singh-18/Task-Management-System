document.addEventListener('DOMContentLoaded', function () {
    const API_BASE_URL = 'http://localhost:5000/api';

    // Check if the user is already logged in
    if (localStorage.getItem('token')) {
        showTaskManager();
        fetchTasks(); // Fetch tasks if logged in
    } else {
        showLoginForm();
    }

    // Navigation between forms
    document.getElementById('switch-to-register').addEventListener('click', function (event) {
        event.preventDefault();
        showRegisterForm();
    });

    document.getElementById('switch-to-login').addEventListener('click', function (event) {
        event.preventDefault();
        showLoginForm();
    });

    function showTaskManager() {
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('task-section').style.display = 'block';
    }

    function showRegisterForm() {
        document.getElementById('register-section').style.display = 'block';
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('task-section').style.display = 'none';
    }

    function showLoginForm() {
        document.getElementById('register-section').style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('task-section').style.display = 'none';
    }

    // Register User
    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                showTaskManager();
                fetchTasks(); // Fetch tasks immediately after registration
            } else {
                console.error(data.message); // Log the error message
            }
        } catch (error) {
            console.error('Registration failed:', error); // Log the error
        }
    });

    // Login User
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (data.token) {
                localStorage.setItem('token', data.token);
                showTaskManager();
                fetchTasks(); // Fetch tasks immediately after login
            } else {
                console.error(data.message); // Log the error message
            }
        } catch (error) {
            console.error('Login failed:', error); // Log the error
        }
    });

    // Logout function
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('token');
        showLoginForm();
    });

    // Fetch Tasks
    async function fetchTasks() {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const tasks = await response.json();
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = ''; // Clear the current task list
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.classList.add('task');
                taskElement.innerHTML = `
                    <h4>${task.title}</h4>
                    <p>${task.description}</p>
                    <button class="delete-btn" data-id="${task._id}">Delete</button>
                `;
                taskList.appendChild(taskElement);
            });
            document.getElementById('task-count').innerText = `Total Tasks: ${tasks.length}`; // Update task count
        } catch (error) {
            console.error('Failed to fetch tasks:', error); // Log the error
        }
    }

    // Create Task
    document.getElementById('task-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description })
            });

            const data = await response.json();
            if (data.task) {
                // Clear input fields after adding the task
                document.getElementById('task-title').value = '';
                document.getElementById('task-description').value = '';

                // Immediately add the new task to the list
                addTaskToDisplay(data.task);
            } else {
                console.error('Task creation failed:', data.message);
            }
        } catch (error) {
            console.error('Failed to add task:', error); // Log the error
        }
    });

    // Function to add task to display
    function addTaskToDisplay(task) {
        const taskList = document.getElementById('task-list');
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <h4>${task.title}</h4>
            <p>${task.description}</p>
            <button class="delete-btn" data-id="${task._id}">Delete</button>
        `;
        taskList.appendChild(taskElement);

        // Update task count
        const taskCount = document.getElementById('task-count');
        const currentCount = parseInt(taskCount.innerText.split(': ')[1]) || 0;
        taskCount.innerText = `Total Tasks: ${currentCount + 1}`;
    }

    // Delete Task Function (Defined Globally)
    async function deleteTask(taskId) {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.message) {
                fetchTasks(); // Refresh task list after deletion
            }
        } catch (error) {
            console.error('Failed to delete task:', error); // Log the error
        }
    }

    // Event Delegation for Deleting Tasks
    document.getElementById('task-list').addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const taskId = event.target.getAttribute('data-id');
            deleteTask(taskId);
        }
    });
});