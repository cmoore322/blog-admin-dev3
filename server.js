const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const PostsRouter = require('./routes/posts');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static front-end
app.use(express.static(path.join(__dirname)));

// API routes
app.use('/api/posts', PostsRouter);

// Health
app.get('/_health', (req, res) => res.json({ok: true, time: new Date().toISOString()}));

// Connect to MongoDB and start server
async function start() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog-admin-dev3';
  try {
    await mongoose.connect(mongoUri, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
}

start();
