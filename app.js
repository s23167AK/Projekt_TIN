const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const mysql = require('mysql2');

const indexRouter = require('./routes/index');
const BookRoutes = require('./routes/BookRoutes');
const ReaderRoutes = require('./routes/ReaderRoutes');
const BorrowingRoutes = require('./routes/BorrowingRoutes');
const AuthRoutes = require('./routes/AuthRoutes');

const app = express();

// Konfiguracja silnika widoków (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Konfiguracja puli połączeń
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
    req.db = connection.promise(); // Dodaj `db` jako część obiektu `req`
    next();
});

// // Rejestracja tras
app.use('/', indexRouter);
app.use('/books', BookRoutes);
app.use('/readers', ReaderRoutes);
app.use('/borrowings', BorrowingRoutes);
// app.use('/', AuthRoutes);

// Obsługa błędów 404
app.use((req, res, next) => {
    next(createError(404));
});

// Obsługa innych błędów
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// // Zamknięcie połączenia przy wyłączaniu serwera
// process.on('SIGINT', () => {
//     connection.end((err) => {
//         if (err) {
//             console.error('Błąd podczas zamykania połączenia z bazą:', err.stack);
//         }
//         console.log('Połączenie z bazą danych MySQL zostało zamknięte.');
//         process.exit();
//     });
// });

module.exports = app;

