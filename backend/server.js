const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Initial Data
const INITIAL_DATA = {
  tutors: [
    { id: 1, name: 'Siva Charan', subject: 'Java Architecture', rate: 55, bio: 'Expert Java Developer. Specializing in Low-Level Threading & Spring Boot Internals.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { id: 2, name: 'Varsith', subject: 'Python Data Science', rate: 45, bio: 'Machine Learning engineer. Expert in NumPy, Pandas, and Tensor Flow architectures.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  ],
  bookings: []
};

// Persistence Helpers
const readData = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
    return INITIAL_DATA;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Routes
app.get('/api/tutors', (req, res) => {
  const data = readData();
  res.json(data.tutors);
});

app.post('/api/tutors', (req, res) => {
  const data = readData();
  const newTutor = { 
    id: Date.now(), 
    ...req.body, 
    image: req.body.image || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' 
  };
  data.tutors.unshift(newTutor);
  writeData(data);
  res.status(201).json(newTutor);
});

app.get('/api/bookings', (req, res) => {
  const data = readData();
  res.json(data.bookings);
});

app.post('/api/bookings', (req, res) => {
  const data = readData();
  const newBooking = { id: Date.now(), ...req.body, status: 'PENDING' };
  data.bookings.push(newBooking);
  writeData(data);
  
  // Notify via WebSocket
  io.emit('new_booking', newBooking);
  
  res.status(201).json(newBooking);
});

app.get('/api/system/architecture', (req, res) => {
  res.json({
    engine: 'Node.js Express',
    version: '1.0.0',
    persistence: 'File-based JSON (Simulated H2)',
    realtime: 'Socket.io',
    uptime: process.uptime()
  });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`TutorLink Backend running on http://localhost:${PORT}`);
});
