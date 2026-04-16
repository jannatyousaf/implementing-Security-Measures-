const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

global.users = global.users || [];
const users = global.users; // temporary database

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if data exists
    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email format');
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).send('Password must be at least 6 characters');
    }

    // Check duplicate email
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).send('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    users.push({ email, password: hashedPassword });

    res.status(201).send('User registered successfully');

  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).send('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Wrong password');

  const token = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });

  res.send({ token });
});
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, (req, res) => {
  res.send('Welcome to secure dashboard');
});
router.get('/users/count', (req, res) => {
  res.json({ count: users.length });
});
module.exports = router;