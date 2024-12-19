const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

router.get('/', BookController.getAllBooks);
router.get('/details/:id', BookController.showBookDetails);
router.get('/add', BookController.showCreateForm);
router.post('/add', BookController.createBook);
router.get('/edit/:id', BookController.showEditForm);
router.post('/edit/:id', BookController.updateBook);
router.post('/delete/:id', BookController.deleteBook);

module.exports = router;


