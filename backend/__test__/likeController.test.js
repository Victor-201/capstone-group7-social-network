// test/likeController.test.js
import { describe, test, beforeAll, afterAll, expect } from 'vitest';
import { io as Client } from 'socket.io-client';
import request from 'supertest';
import { server, app } from '../server.js';
import models from '../models/index.js';

process.env.NODE_ENV = 'test';

let clientSocket;
let postOwnerId;
const post_id = '19ee73cf-f006-40c5-951c-1682cbf7341c';
const token = '...'; // bạn giữ nguyên token cũ

describe('✅ Like Post - Real-time Notification', () => {
  beforeAll(async () => {
    const post = await models.Post.findByPk(post_id);
    if (!post) throw new Error('❌ Post not found');
    postOwnerId = post.user_id;

    // Connect client socket
    clientSocket = Client('http://localhost:8080', {
      query: { user_id: postOwnerId },
      transports: ['websocket'],
    });

    await new Promise((resolve, reject) => {
      clientSocket.on('connect', () => {
        console.log('✅ Socket client connected');
        clientSocket.emit('joinNotification', postOwnerId);
        resolve();
      });

      setTimeout(() => reject(new Error('❌ Socket connection timeout')), 5000);
    });
  }, 10000);

  afterAll(async () => {
    clientSocket.disconnect();
    await models.Like.destroy({ where: { post_id } });
    server.close();
  });

  test(
    '📡 emits real-time notification when post is liked',
    async () => {
      // Lắng nghe trước khi gửi like
      const socketNotiPromise = new Promise((resolve, reject) => {
        clientSocket.on('newNotification', (notif) => {
          console.log('📨 Got notification:', notif);
          resolve(notif);
        });

        setTimeout(() => reject(new Error('❌ No notification received')), 8000);
      });

      const res = await request(app)
        .post(`/api/user/posts/${post_id}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      // Cho phép message tự do
      expect(typeof res.body.message).toBe('string');

      const notif = await socketNotiPromise;

      expect(notif).toMatchObject({
        action_type: 'like',
        receiver_id: postOwnerId,
        action_id: post_id,
      });
    },
    15000
  );
});
