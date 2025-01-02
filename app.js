const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const mysql = require('mysql2');
const i18n = require('i18n');

const indexRouter = require('./routes/index');
const BookRoutes = require('./routes/BookRoutes');
const ReaderRoutes = require('./routes/ReaderRoutes');
const BorrowingRoutes = require('./routes/BorrowingRoutes');

const app = express();

//  Konfiguracja i18n
i18n.configure({
    locales: ['pl', 'en'], // dostępne języki
    directory: path.join(__dirname, 'locales'), // ścieżka do katalogu ze słownikami
    defaultLocale: 'pl', // domyślny język
    objectNotation: true, // umożliwia korzystanie z notacji obiektowej
    cookie: 'app-lang', // ciasteczko przechowujące język
    autoReload: true, // automatyczne przeładowanie przy zmianie plików tłumaczeń
    syncFiles: true, // synchronizuje pliki tłumaczeń
});
// Middleware i18n
app.use(cookieParser());
app.use(i18n.init);

// Middleware do ustawiania języka na podstawie ciasteczka lub parametru URL
app.use((req, res, next) => {
    let lang = req.query.lang || req.cookies['app-lang'] || 'pl';
    res.cookie('app-lang', lang, { maxAge: 900000, httpOnly: true });
    req.setLocale(lang);
    res.locals.__ = res.__; // Funkcja tłumaczenia dostępna w widokach
    res.locals.currentLanguage = lang; // Przekazanie aktualnego języka do widoków
    next();
});

// ✅ Konfiguracja silnika widoków (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// ✅ Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Konfiguracja puli połączeń
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Twoje hasło
    database: 'library',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Testowe zapytanie podczas uruchamiania aplikacji
connection.query('SELECT * FROM book', (err, results) => {
    if (err) {
        console.error('Błąd podczas wykonywania zapytania:', err.stack);
    } else {
        console.log('Przykładowe dane z tabeli books:', results);
    }
});

// Middleware do udostępniania połączenia w `req`
app.use((req, res, next) => {
    req.db = connection.promise();
    next();
});

// ✅ Rejestracja tras
app.use('/', indexRouter);
app.use('/books', BookRoutes);
app.use('/readers', ReaderRoutes);
app.use('/borrowings', BorrowingRoutes);

// ✅ Obsługa błędów 404
app.use((req, res, next) => {
    next(createError(404));
});

// ✅ Obsługa innych błędów
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

