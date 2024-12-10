const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

router.get('/', BookController.getAllBooks); // Lista książek
router.get('/details/:id', BookController.showBookDetails);
router.get('/add', BookController.showCreateForm);
router.post('/add', BookController.createBook); // Dodanie książki
router.get('/edit/:id', BookController.showEditForm); // Formularz edycji książki
router.post('/edit/:id', BookController.updateBook); // Aktualizacja książki
router.post('/delete/:id', BookController.deleteBook); // Usunięcie książki

module.exports = router;


