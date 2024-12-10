const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/BorrowingController');

router.get('/', BorrowingController.getAllBorrowings);
router.get('/:id', BorrowingController.getBorrowingById);
router.post('/', BorrowingController.createBorrowing);
router.put('/:id', BorrowingController.updateBorrowing);
router.delete('/:id', BorrowingController.deleteBorrowing);

module.exports = router;
