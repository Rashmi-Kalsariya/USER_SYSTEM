const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.get('/', (req, res) => {
  res.render('index', { title: 'Welcome' });
});

router.get('/dashboard', protect, (req, res) => {
  res.render('dashboard', { title: 'Dashboard' });
});

module.exports = router;