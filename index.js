const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://i201757:razzi0984@cluster0.vuen418.mongodb.net/', {
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Middleware for parsing JSON requests
app.use(express.json());


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
