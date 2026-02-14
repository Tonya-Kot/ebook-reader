import Storage from './storage.js';

class BookReaderApp {
    constructor() {
        this.currentUser = null;
        this.books = [];
        this.init();
    }

    init() {
        // Загружаем пользователя и книги
        this.currentUser = Storage.loadUser();
        this.books = Storage.loadBooks();

        // Применяем настройки темы
        const settings = Storage.loadSettings();
        if (settings.theme === 'dark') {
            document.body.classList.add('dark-theme');
        }

        this.setupEventListeners();
        this.renderInitialScreen();
    }

    setupEventListeners() {
        // Кнопки навигации
        document.getElementById('register-link').addEventListener('click', () => this.showScreen('register-screen'));
        document.getElementById('login-link').addEventListener('click', () => this.showScreen('login-screen'));
        document.getElementById('menu-toggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('profile-menu').addEventListener('click', () => this.showProfile());
        document.getElementById('settings-menu').addEventListener('click', () => this.showSettings());
        document.getElementById('logout-menu').addEventListener('click', () => this.logout());
        document.getElementById('delete-account-menu').addEventListener('click', () => this.showDeleteConfirm());
        document.getElementById('back-to-library').addEventListener('click', () => this.showLibrary());
        document.getElementById('back-to-library-settings').addEventListener('click', () => this.showLibrary());

        // Формы
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('profile-form').addEventListener('submit', (e) => this.handleProfileUpdate(e));
        document.getElementById('add-book-btn').addEventListener('click', () => document.getElementById('file-input').click());
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileUpload(e));

        // Настройки темы
        document.querySelectorAll('input[name="theme"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const theme = e.target.value;
                document.body.classList.toggle('dark-theme', theme === 'dark');
                Storage.saveSettings({ theme });
            });
        });

        // Подтверждение удаления
        document.getElementById('confirm-delete').addEventListener('click', () => this.deleteAccount());
        document.getElementById('cancel-delete').addEventListener('click', () => this.hideDeleteConfirm());

        // Пользовательское соглашение
        document.getElementById('terms-link').addEventListener('click', () => this.showTerms());
        document.getElementById('close-terms').addEventListener('click', () => this.hideTerms());
    }

    renderInitialScreen() {
        if (this.currentUser) {
            this.showLibrary();
        } else {
            this.showScreen('welcome-screen');
        }
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar-menu');
        sidebar.classList.toggle('open');
    }

    showProfile() {
        const profileForm = document.getElementById('profile-form');
        profileForm.reset();
        document.getElementById('profile-name').value = this.currentUser.name;
        document.getElementById('profile-email').value = this.currentUser.email;
        this.showScreen('profile-screen');
    }

    showSettings() {
        this.showScreen('settings-screen');
    }

    logout() {
        Storage.clearUser();
        this.currentUser = null;
        this.showScreen('welcome-screen');
    }

    showDeleteConfirm() {
        document.getElementById('delete-confirm').classList.add('active');
    }

    hideDeleteConfirm() {
        document.getElementById('delete-confirm').classList.remove('active');
    }

    deleteAccount() {
        Storage.clearAll();
        this.currentUser = null;
        this.books = [];
        this.hideDeleteConfirm();
        this.showScreen('welcome-screen');
    }

    showTerms() {
        document.getElementById('terms-modal').classList.add('active');
    }

    hideTerms() {
        document.getElementById('terms-modal').classList.remove('active');
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        const user = {
            id: Date.now(),
            name,
            email,
            password // В реальном приложении пароль нужно хэшировать!
        };

        this.currentUser = user;
        Storage.saveUser(user);

        if (rememberMe) {
            // В реальном приложении сохраняем в cookie или localStorage
        }

        alert('Регистрация успешна! Добро пожаловать в библиотеку.');
        this.showLibrary();
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const rememberLogin = document.getElementById('remember-login').checked;

        // В реальном приложении здесь была бы проверка с сервером
        if (email && password) {
            // Имитируем успешный вход
            this.currentUser = { id: Date.now(), name: 'Пользователь', email };
            Storage.saveUser(this.currentUser);

            if (rememberLogin) {
                // Сохраняем данные для автоматического входа
            }

            this.showLibrary();
        } else {
            alert('Неверный email или пароль');
        }
    }

    handleProfileUpdate(e) {
        e.preventDefault();
        const newName = document.getElementById('profile-name').value;
        const newEmail = document.getElementById('profile-email').value;
        const newPassword = document.getElementById('new-password').value;

        this.currentUser.name = newName;
        this.currentUser.email = newEmail;

        if (newPassword) {
            this.currentUser.password = newPassword; // В реальном приложении — хэшируем
        }

        Storage.saveUser(this.currentUser);
        alert('Данные обновлены!');
        this.showLibrary();
    }

    handleFileUpload(e) {
        const files = e.target.files;
        if (!files.length) return;

        Array.from(files).forEach(file => {
            const book = {
                id: Date.now() + Math.random(),
                title: file.name,
                file: URL.createObjectURL(file),
                type: file.name.split('.').pop().toLowerCase(),
                cover: this.generateCover(file.name) // Простая заглушка для обложки
            };
            this.books.push(book);
        });

        Storage.saveBooks(this.books);
        this.renderBooks();
    }

    generateCover(fileName) {
        // Простая заглушка для обложки книги
        return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='80'><rect width='60' height='80' fill='#${Math.floor(Math.random()*16777215).toString(16)}'/></svg>`;
    }

    renderBooks() {
        const container = document.getElementById('books-container');
        const emptyMessage = container.querySelector('.empty-message');

        if (this.books.length > 0) {
            if (emptyMessage) emptyMessage.style.display = 'none';

            let booksHTML = '';
                        this.books.forEach(book => {
                booksHTML += `
                    <div class="book-item">
                <div class="book-cover" style="background-image: url('${book.cover}');"></div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
            <div class="book-type">${book.type.toUpperCase()}</div>
        </div>
        <div class="more-options" onclick="app.showBookOptions(${book.id})">⋮</div>
    </div>`;
            });

            container.innerHTML = booksHTML + '<button id="add-book-btn" class="add-button">+ Добавьте файл</button>';
            // Переподключаем обработчик для кнопки добавления
            document.getElementById('add-book-btn').addEventListener('click', () => document.getElementById('file-input').click());
        } else {
            if (emptyMessage) emptyMessage.style.display = 'block';
        }
    }

    showBookOptions(bookId) {
        const confirmDelete = confirm('Удалить файл?');
        if (confirmDelete) {
            this.deleteBook(bookId);
        }
    }

    deleteBook(bookId) {
        this.books = this.books.filter(book => book.id !== bookId);
        Storage.saveBooks(this.books);
        this.renderBooks();
        alert('Книга удалена');
    }

    showLibrary() {
        this.renderBooks();
        this.showScreen('library-screen');
    }
}

// Глобальная переменная для доступа к приложению
window.app = new BookReaderApp();

// Функция для переключения видимости пароля
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    if (field.type === 'password') {
        field.type = 'text';
    } else {
        field.type = 'password';
    }
}
