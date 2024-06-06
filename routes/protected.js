
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/auth');

// Route protégée 1
router.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route' });
});

// Route protégée 2
router.get('/protected2', authenticateJWT, (req, res) => {
  res.json({ message: 'This is the second protected route' });
});

module.exports = router;
