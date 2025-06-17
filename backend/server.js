import express from 'express';
import router from './routes/app.routes.js';
import sequelize from './configs/database.config.js';
import http from 'http';
import { Server } from 'socket.io';
import {
  messageHandler,
  notificationHandler
} from './socket.js';

const app = express();
const PORT = process.env.PORT || 3000;

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

app.use((req, res, next) => {
  console.log(`[ROUTE] ${req.method} ${req.originalUrl}`);
  next();
});
app.use('/api', router);


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
if (process.env.NODE_ENV !== 'test') {
  server.listen(8080, () => {
    console.log("Server is running on port 8080");
  });
}

export { server, app };