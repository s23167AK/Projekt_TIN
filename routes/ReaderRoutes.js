const express = require('express');
const router = express.Router();
const ReaderController = require('../controllers/ReaderController');

router.get('/', ReaderController.getAllReaders);
router.get('/:id', ReaderController.getReaderById);
router.post('/', ReaderController.createReader);
router.put('/:id', ReaderController.updateReader);
router.delete('/:id', ReaderController.deleteReader);

module.exports = router;
