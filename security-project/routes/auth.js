const express = require('express');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../logger');
const apiKeyAuth = require('../middleware/apiKey');
const router = express.Router();
const { loginMonitor, recordFailedAttempt } = require('../middleware/loginMonitor');

global.users = global.users || [];
const users = global.users; // temporary database

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info('Register attempt');
    // Check if data exists
    if (!email || !password) {
      logger.warn('Register failed: Missing email or password');
      return res.status(400).send('Email and password are required');
    }

    // Validate email
    if (!validator.isEmail(email)) {
      logger.warn('Register failed: Invalid email format');
      return res.status(400).send('Invalid email format');
    }

    // Password length check
    if (password.length < 6) {
      logger.warn('Register failed: Weak password');
      return res.status(400).send('Password must be at least 6 characters');
    }

    // Check duplicate email
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      logger.warn('Register failed: Email already exists');
      return res.status(400).send('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    users.push({ email, password: hashedPassword });
    logger.info('User registered successfully');
    res.status(201).send('User registered successfully');

  } catch (error) {
    logger.error('Register error occurred');
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login',loginMonitor, async (req, res) => {
  const { email, password } = req.body;
  logger.info('Login attempt');
  const user = users.find(u => u.email === email);
  if (!user) {
    recordFailedAttempt(req.ip);
    logger.warn('Login failed: User not found');
    return res.status(400).send('User not found');
  }
    
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    recordFailedAttempt(req.ip);
    logger.warn('Login failed: Wrong password');
    return res.status(400).send('Wrong password');
  }

  const token = jwt.sign({ email }, 'secretkey', { expiresIn: '1h' });
  logger.info('Login successful');
  res.send({ token });
});
const verifyToken = require('../middleware/authMiddleware');

router.get('/dashboard', verifyToken, (req, res) => {
  logger.info('Dashboard accessed');
  res.send('Welcome to secure dashboard');
});
router.get('/users/count', apiKeyAuth, (req, res) => {
  res.json({ count: users.length });
});
module.exports = router;