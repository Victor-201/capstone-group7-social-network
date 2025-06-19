import express from 'express';
import router from './routes/app.routes.js';
import sequelize from './configs/database.config.js';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import {
  messageHandler,
  notificationHandler
} from './socket.js';
import { PORT } from "./configs/env.config.js";
import { socketVerifyToken } from './middleware/authorization.middleware.js';



const app = express();

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

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use('/api', router);

io.use(socketVerifyToken);

io.on('connection', (socket) => {
  console.log('A user connected');

  notificationHandler(io, socket);
  messageHandler(io, socket);

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

export { server, app };