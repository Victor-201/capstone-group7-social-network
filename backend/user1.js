import { io } from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config();

// Kết nối đến backend
const socket = io('http://localhost:8080', {
  transports: ['websocket'],
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY5ODA0MjZhLThkZTktNDU5Ni1iOWI0LWEzMGNhMmYxYmFjMyIsInVzZXJOYW1lIjoiYmVkaXZlIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6Im5ndWVubmdvY3RydW5nYUBnbWFpbC5jb20iLCJpYXQiOjE3NDk2MjU4MzksImV4cCI6MTc0OTYyNzYzOX0.PiTW3WuvjczdLkl9ASMroz2s_blZvDVEO0QGXVOOj9I'
  }
});

socket.on('connect', () => {
  console.log('Connected to server with id:', socket.id);
  socket.emit('joinNotification');
  socket.emit('sendNotification', {
    receiverId: 'bd55a67d-aa63-490e-9489-9510bd87f722',
    actionType: 'like',
    actionId: '12345',
    content: 'Hello Hai day!'
  });
});

socket.on('receiveNotification', (message) => {
  console.log('New notification:', message);
});

socket.on('connect_error', (err) => {
  console.error('Connection failed:', err.message);
});
