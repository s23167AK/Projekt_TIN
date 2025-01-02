const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { navLocation: 'main' });
});

const LangController = require('../controllers/LangController');
router.get('/changeLang/:lang', LangController.changeLang);

module.exports = router;

