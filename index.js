const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ContactMessage = require('./models/ContactMessage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URL;

mongoose.connect(MONGODB_URI)
.then(() => console.log('MongoDB connection established successfully'))
.catch((err) => console.log('MongoDB connection error: ', err));

// Routes
app.post('/api/contact', async (req, res) => {
  try {
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
    res.status(500).json({ error: 'Server error, please try again.' });
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Harsh Portfolio API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
