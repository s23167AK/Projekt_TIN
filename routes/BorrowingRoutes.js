const express = require('express');
const router = express.Router();
const BorrowingController = require('../controllers/BorrowingController');

router.get('/', BorrowingController.getAllBorrowings);
router.get('/details/:id', BorrowingController.showBorrowingDetails);
// router.get('/add', BorrowingController.showCreateForm);
// router.post('/add', BorrowingController.createBorrowing);
// router.get('/edit/:id', BorrowingController.showEditForm);
// router.post('/edit/:id', BorrowingController.updateBorrowing);
// router.post('/delete/:id', BorrowingController.deleteBorrowing);

module.exports = router;

