var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
const fs = require('fs'); // Moduł do odczytu plików
const mysql = require('mysql2');

// Tworzenie aplikacji Express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Utwórz połączenie z bazą danych
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
});

// Połącz się z bazą danych
db.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL!');

  // Wczytaj i wykonaj plik SQL
  const setupSQL = fs.readFileSync(path.join(__dirname, 'database', 'create_database.sql'), 'utf8');
  db.query(setupSQL, (err, result) => {
    if (err) {
      console.error('Błąd podczas wykonywania pliku SQL:', err);
    } else {
      console.log('Baza danych i tabele zostały poprawnie skonfigurowane.');
    }
  });
});

// Trasa główna
app.get('/', (req, res) => {
  res.render('index');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Eksport aplikacji
module.exports = app;
app.listen(4000, () => {
  console.log('Serwer działa na http://localhost:4000');
});