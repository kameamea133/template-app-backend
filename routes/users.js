const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');

router.post('/signup', async (req, res) => {
    
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide username and password' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'User already exists' });
  }
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});


module.exports = router;
