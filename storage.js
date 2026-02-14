// Работа с localStorage
const Storage = {
    // Сохранение пользователя
    saveUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    },

    // Загрузка пользователя
    loadUser() {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Сохранение книг
    saveBooks(books) {
        localStorage.setItem('userBooks', JSON.stringify(books));
    },

    // Загрузка книг
    loadBooks() {
        const booksStr = localStorage.getItem('userBooks');
        return booksStr ? JSON.parse(booksStr) : [];
    },

    // Сохранение настроек
    saveSettings(settings) {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    },

    // Загрузка настроек
    loadSettings() {
        const settingsStr = localStorage.getItem('appSettings');
        return settingsStr ? JSON.parse(settingsStr) : { theme: 'light' };
    },

    // Удаление пользователя
    clearUser() {
        localStorage.removeItem('currentUser');
    },

    // Очистка всех данных
    clearAll() {
        localStorage.clear();
    }
};

export default Storage;