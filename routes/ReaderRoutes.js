const express = require('express');
const router = express.Router();
const ReaderController = require('../controllers/ReaderController');

router.get('/', ReaderController.getAllReaders);
router.get('/details/:id', ReaderController.showReaderDetails);
// router.get('/add', ReaderController.showCreateForm);
// router.post('/add', ReaderController.createReader);
// router.get('/edit/:id', ReaderController.showEditForm);
// router.post('/edit/:id', ReaderController.updateReader);
// router.post('/delete/:id', ReaderController.deleteReader);

module.exports = router;

