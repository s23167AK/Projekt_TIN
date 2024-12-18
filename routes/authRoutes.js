const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', authController.showRegistrationForm);
router.post('/register', authController.registerUser);

module.exports = router;

