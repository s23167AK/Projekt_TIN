const express = require('express'); // Importuj Express
const app = express(); // Utwórz aplikację Express

// Ustawienia
const PORT = 3000; // Ustal port, na którym aplikacja będzie działać

// Obsługa głównej trasy
app.get('/', (req, res) => {
    res.send('Witaj w mojej aplikacji Express.js!');
});

// Uruchom serwer
app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
