(function runApp() {
  const state = {
    token: null,
    user: null
  };

  const messageEl = document.getElementById('message');

  const setMessage = (text, type = '') => {
    if (!messageEl) return;
    messageEl.textContent = text || '';
    messageEl.className = `message ${type}`.trim();
  };

  const getApiError = async (response) => {
    let payload = {};
    try {
      payload = await response.json();
    } catch (error) {
      return 'Unexpected error occurred';
    }

    return payload.message || 'Request failed';
  };

  const setAuthForNextPage = (token, user) => {
    window.name = JSON.stringify({ token, user });
  };

  const consumeAuthFromWindowName = () => {
    if (!window.name) return null;

    try {
      const payload = JSON.parse(window.name);
      window.name = '';
      return payload;
    } catch (error) {
      window.name = '';
      return null;
    }
  };

  const renderAuthPage = () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showLoginBtn = document.getElementById('show-login');
    const showRegisterBtn = document.getElementById('show-register');

    if (!loginForm || !registerForm || !showLoginBtn || !showRegisterBtn) {
      return;
    }

    const toggleForm = (mode) => {
      const isLogin = mode === 'login';
      loginForm.classList.toggle('hidden', !isLogin);
      registerForm.classList.toggle('hidden', isLogin);
      showLoginBtn.classList.toggle('active', isLogin);
      showRegisterBtn.classList.toggle('active', !isLogin);
      setMessage('');
    };

    showLoginBtn.addEventListener('click', () => toggleForm('login'));
    showRegisterBtn.addEventListener('click', () => toggleForm('register'));

    const loginWithEndpoint = async (payload, endpoint = '/api/v1/auth/login') => {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setMessage(await getApiError(response), 'error');
        return;
      }

      const body = await response.json();
      const { token, user } = body.data;
      setAuthForNextPage(token, user);
      window.location.href = '/dashboard';
    };

    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);

      const payload = {
        email: String(formData.get('email') || '').trim(),
        password: String(formData.get('password') || '')
      };

      try {
        const response = await fetch('/api/v1/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          setMessage(await getApiError(response), 'error');
          return;
        }

        setMessage('Registration successful. Please login.', 'success');
        registerForm.reset();
        toggleForm('login');
      } catch (error) {
        setMessage('Network error while registering', 'error');
      }
    });

    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);

      const payload = {
        email: String(formData.get('email') || '').trim(),
        password: String(formData.get('password') || '')
      };

      try {
        await loginWithEndpoint(payload, '/api/v1/auth/login');
      } catch (error) {
        setMessage('Network error while logging in', 'error');
      }
    });
  };

  const renderDashboardPage = () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const userInfo = document.getElementById('user-info');
    const logoutBtn = document.getElementById('logout');
    const refreshBtn = document.getElementById('refresh-tasks');

    if (!taskForm || !taskList || !userInfo || !logoutBtn || !refreshBtn) {
      return;
    }

    const auth = consumeAuthFromWindowName();

    if (!auth || !auth.token) {
      window.location.href = '/';
      return;
    }

    state.token = auth.token;
    state.user = auth.user;

    userInfo.textContent = `Logged in as ${state.user.email} (${state.user.role})`;

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${state.token}`
    };

    const renderTasks = (tasks) => {
      if (!tasks.length) {
        taskList.innerHTML = '<li class="task-item">No tasks yet.</li>';
        return;
      }

      taskList.innerHTML = tasks
        .map(
          (task) => `
            <li class="task-item">
              <h3 class="task-title">${escapeHtml(task.title)}</h3>
              <p class="task-meta">${escapeHtml(task.description || 'No description')}</p>
              <p class="task-meta">Status: ${task.completed ? 'Completed' : 'Pending'}</p>
              <div class="task-actions">
                <button type="button" data-action="toggle" data-id="${task._id}" data-completed="${task.completed}">
                  Mark ${task.completed ? 'Pending' : 'Completed'}
                </button>
                <button type="button" data-action="edit" data-id="${task._id}">Edit</button>
                <button type="button" class="danger" data-action="delete" data-id="${task._id}">Delete</button>
              </div>
            </li>
          `
        )
        .join('');
    };

    const loadTasks = async () => {
      try {
        const response = await fetch('/api/v1/tasks', {
          method: 'GET',
          headers: authHeaders
        });

        if (!response.ok) {
          setMessage(await getApiError(response), 'error');
          return;
        }

        const body = await response.json();
        renderTasks(body.data.tasks || []);
      } catch (error) {
        setMessage('Network error while fetching tasks', 'error');
      }
    };

    taskForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(taskForm);

      const payload = {
        title: String(formData.get('title') || '').trim(),
        description: String(formData.get('description') || '').trim()
      };

      try {
        const response = await fetch('/api/v1/tasks', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          setMessage(await getApiError(response), 'error');
          return;
        }

        setMessage('Task created successfully', 'success');
        taskForm.reset();
        await loadTasks();
      } catch (error) {
        setMessage('Network error while creating task', 'error');
      }
    });

    taskList.addEventListener('click', async (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) {
        return;
      }

      const taskId = target.getAttribute('data-id');
      const action = target.getAttribute('data-action');

      if (!taskId || !action) {
        return;
      }

      try {
        if (action === 'delete') {
          const shouldDelete = window.confirm('Delete this task?');
          if (!shouldDelete) return;

          const response = await fetch(`/api/v1/tasks/${taskId}`, {
            method: 'DELETE',
            headers: authHeaders
          });

          if (!response.ok) {
            setMessage(await getApiError(response), 'error');
            return;
          }

          setMessage('Task deleted', 'success');
          await loadTasks();
          return;
        }

        if (action === 'toggle') {
          const completed = target.getAttribute('data-completed') === 'true';

          const response = await fetch(`/api/v1/tasks/${taskId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify({ completed: !completed })
          });

          if (!response.ok) {
            setMessage(await getApiError(response), 'error');
            return;
          }

          setMessage('Task updated', 'success');
          await loadTasks();
          return;
        }

        if (action === 'edit') {
          const nextTitle = window.prompt('Enter new task title (leave blank to keep unchanged):');
          const nextDescription = window.prompt('Enter new description (leave blank to keep unchanged):');

          const updates = {};
          if (nextTitle !== null && nextTitle.trim()) {
            updates.title = nextTitle.trim();
          }
          if (nextDescription !== null && nextDescription.trim()) {
            updates.description = nextDescription.trim();
          }

          if (!Object.keys(updates).length) {
            setMessage('No updates provided', 'error');
            return;
          }

          const response = await fetch(`/api/v1/tasks/${taskId}`, {
            method: 'PUT',
            headers: authHeaders,
            body: JSON.stringify(updates)
          });

          if (!response.ok) {
            setMessage(await getApiError(response), 'error');
            return;
          }

          setMessage('Task updated', 'success');
          await loadTasks();
        }
      } catch (error) {
        setMessage('Network error while updating task', 'error');
      }
    });

    refreshBtn.addEventListener('click', () => {
      loadTasks();
    });

    logoutBtn.addEventListener('click', () => {
      state.token = null;
      state.user = null;
      window.name = '';
      window.location.href = '/';
    });

    loadTasks();
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');

  renderAuthPage();
  renderDashboardPage();
})();
