import express from 'express';
import router from './routes/app.routes.js';
import dotenv from 'dotenv';
import sequelize from './configs/database.config.js';
import http from 'http';
import { Server } from 'socket.io';
import { setupSocket } from './socket.js';
import jwt from 'jsonwebtoken';


dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

const server = http.createServer(app);  

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000/',
    methods: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication token missing'));
  }

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    return next(new Error('Invalid token'));
  }
});

setupSocket(io);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
  } catch (error) {
    console.error('Database error:', error);
  }
})();

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});