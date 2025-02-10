const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { initializeSocket } = require('./utils/socketManager');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

require('dotenv').config();

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: '*', // Add your client URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Apply CORS to Express
app.use(cors(corsOptions));

// Initialize socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
});

// Initialize socket manager
initializeSocket(io);

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.log(err);
});

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
