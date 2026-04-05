const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ContactMessage = require('./models/ContactMessage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'https://portfolio-frontend-mocha-phi.vercel.app', 'https://portfolio-frontend-mocha-phi.vercel.app/'],
  optionsSuccessStatus: 200,
  credentials: true
};


app.use(cors(corsOptions));
app.use(express.json());

// Serverless friendly MongoDB Connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }
    const MONGODB_URI = process.env.MONGODB_URL;
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URL missing in environment variables!");
    }
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connection established successfully');
  } catch (err) {
    console.log('MongoDB connection error: ', err);
    throw err;
  }
};

// Routes
app.post('/api/contact', async (req, res) => {
  try {
    await connectDB(); // ensure connected

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Please provide name, email and message.' });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      message
    });

    await newMessage.save();

    res.status(201).json({ success: 'Message sent successfully' });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: error.message || 'Server error, please try again.' });
  }
});

// Basic route
app.get('/', async (req, res) => {
  res.send('Harsh Portfolio API is running...');
});

// Only listen locally, Vercel will export it
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

module.exports = app;
