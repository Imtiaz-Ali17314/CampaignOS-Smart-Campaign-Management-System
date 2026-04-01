const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const alertEngine = require('./alertEngine');

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"]
  }
});

// Authentication middleware for Socket.io
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication error'));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.user = decoded;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.email} (${socket.id})`);

  // Join a room for a specific campaign if requested
  socket.on('join_campaign', (campaignId) => {
    socket.join(campaignId);
    console.log(`User ${socket.id} joined campaign room: ${campaignId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.NOTIFICATION_PORT || 4000;
server.listen(PORT, () => {
  console.log(`WebSocket Server running on port ${PORT}`);
  // Start the alert evaluation engine
  alertEngine.start(io);
});
