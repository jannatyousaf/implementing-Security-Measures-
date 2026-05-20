const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const rateLimit = require('express-rate-limit');
const app = express();
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

// Rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: []
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
);
app.use(cors({
  origin: 'http://localhost:5000',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.static('public'));
const csrfProtection = csurf({ cookie: true });

app.use(csrfProtection);

const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);
app.get('/', (req, res) => {
  res.send('Server is running 🚀');
});
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
  logger.info('Application started');
});