const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const chatRoutes = require('./routes/chat');

const app = express();

const path = require('path');

const xss = require('xss-clean');
const hpp = require('hpp');

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allowed for React/Vite development
      styleSrc: ["'self'", "'unsafe-inline'"], // Allowed for React inline styles
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com"]
    }
  }
}));

// Strict CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || '*' : 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(xss()); // Sanitize data against XSS
app.use(hpp()); // Protect against HTTP Parameter Pollution

// Rate Limiting to prevent DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: "Too many requests from this IP, please try again later." }
});

app.use('/api/', apiLimiter);

// API Routes
app.use('/api/chat', chatRoutes);

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;

// Export app for testing, or listen if starting directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ElectionGuide AI server running securely on port ${PORT}`);
  });
}

module.exports = app;
