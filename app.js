const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

const sequelize = require('./config/sequelize');
const initModels = require('./config/init');

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

sequelize.authenticate()
    .then(() => console.log('Połączono z bazą danych Sequelize!'))
    .catch((err) => console.error('Błąd połączenia z bazą danych:', err));

// Rejestracja tras
app.use('/', indexRouter);
app.use('/books', BookRoutes);
app.use('/readers', ReaderRoutes);
app.use('/borrowings', BorrowingRoutes);
app.use('/', AuthRoutes);

// Obsługa błędów 404
app.use((req, res, next) => {
  next(createError(404));
});

initModels()
    .then(() => {
      console.log('Relacje i modele zostały poprawnie zainicjalizowane.');
    })
    .catch(err => {
      console.error('Błąd podczas inicjalizacji modeli:', err);
    });

// Obsługa innych błędów
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
