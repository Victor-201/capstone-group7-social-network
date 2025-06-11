import { io } from 'socket.io-client';
import dotenv from 'dotenv';
dotenv.config();

// Kết nối đến backend
const socket = io('http://localhost:8080', {
  transports: ['websocket'],
  auth: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJkNTVhNjdkLWFhNjMtNDkwZS05NDg5LTk1MTBiZDg3ZjcyMiIsInVzZXJOYW1lIjoieEhhc2kiLCJyb2xlIjoidXNlciIsImVtYWlsIjoieEhhc2lnQGdtYWlsLmNvbSIsImlhdCI6MTc0OTYyNjI3NSwiZXhwIjoxNzQ5NjI4MDc1fQ.3GPQT3KXM2ChmJEbko0IdEQf_sy-NqwJozbtocOuvTU'
  }
});

socket.on('connect', () => {
  console.log('Connected to server with id:', socket.id);
  socket.emit('joinNotification');
  socket.emit('sendNotification', {
    receiverId: 'bd55a67d-aa63-490e-9489-9510bd87f722',
    actionType: 'like',
    actionId: '12345',
    content: 'trung da like bai viet!'
  });
});

socket.on('receiveNotification', (message) => {
  console.log('New notification:', message);
});

socket.on('connect_error', (err) => {
  console.error('Connection failed:', err.message);
});
