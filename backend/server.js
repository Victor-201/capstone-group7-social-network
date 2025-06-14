import express from 'express';
import router from './routes/app.routes.js';
import dotenv from 'dotenv';
import sequelize from './configs/database.config.js';
import http from 'http';
import { Server } from 'socket.io';
import {
  notificationHandler
} from './socket.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});


app.use((req, res, next) => {
  req.io = io;
  next();
});


app.use('/api', router);


io.on('connection', (socket) => {
  console.log('A user connected');

  notificationHandler(io, socket);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database error:', error);
  }
})();

// Lắng nghe port
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
