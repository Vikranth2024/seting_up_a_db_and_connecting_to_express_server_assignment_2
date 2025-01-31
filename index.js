const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { resolve } = require('path');
require('dotenv').config();

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to database'))
  .catch((error) => console.error('Error connecting to database', error));

const User = require('./schema.js');

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Validation error: All fields are required' });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation error: ${error.message}` });
    }
    console.error('Error creating user', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
