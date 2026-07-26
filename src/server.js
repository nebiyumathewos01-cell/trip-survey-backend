const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/student', require('./routes/students'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/statistics', require('./routes/statistics'));
app.use('/api/public', require('./routes/public'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Trip Survey API is running', status: 'ok' });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    // Seed destinations and admin on first run
    await require('./seeders/seed')();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
