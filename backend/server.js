const dns     = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
require('dotenv').config();

const connectDB    = require('./config/db');
const logger       = require('./utils/logger');
const { apiLimiter } = require('./middleware/rateLimiter');

const path = require('path');
const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to Database ──────────────────────────────────────────────────────
connectDB();

// ─── Security Headers (helmet) ────────────────────────────────────────────────
// Adjusted helmet for SPA compatibility (allows local scripts/styles)
app.use(helmet({
  contentSecurityPolicy: false, 
}));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://gymrat-marketplace.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      
      const isAllowed = allowedOrigins.includes(origin) || 
                        origin.startsWith('http://localhost:') || 
                        origin.startsWith('http://127.0.0.1:') ||
                        /https?:\/\/([a-zA-Z0-9-]+--)?gymratmarketplace\.netlify\.app/.test(origin) ||
                        /https?:\/\/([a-zA-Z0-9-]+--)?marketplacegymrat1\.netlify\.app/.test(origin);
                        
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

// ─── Request Logger & API Routes ──────────────────────────────────────────────
app.use(logger.httpLogger);
app.use('/api/', apiLimiter);

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders',   require('./routes/orders'));
app.use('/api/supplier', require('./routes/supplier'));
app.use('/api/admin',    require('./routes/admin'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ─── Static Uploads (avatar fallback when no Cloudinary) ─────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('GymRat Marketplace API is running. Please access the frontend via Netlify.');
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  logger.error(`Unhandled exception: ${err.message}`);
  res.status(500).json({ message: 'An internal server error occurred.' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  logger.info(`GymRat Unified Suite running on port ${PORT}`);
});
