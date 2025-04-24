const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { sequelize, testConnection, initModels } = require("./config/database");
const authRoutes = require("./routes/auth.routes");
// Sử dụng initModels() thay vì import trực tiếp
const models = initModels();

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Cấu hình CORS để cho phép tất cả các nguồn
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true
}));

// Middleware để xử lý preflight requests
app.options('*', cors());

// Middleware hiển thị thông tin request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(bodyParser.json());

// Khai báo routes
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/user.routes'));

// In-memory data storage (tạm thời giữ lại cho đến khi tạo Post model)
let posts = [
  {
    id: 1,
    author: "Jane Doe",
    authorId: "jane-doe",
    authorAvatar: "/images/default-avatar.png",
    content: "Just finished my latest project! 🚀 #coding #webdev",
    image: "https://via.placeholder.com/600x400",
    createdAt: new Date("2025-04-23T14:30:00Z").toISOString(),
    likes: 42,
    comments: [
      { id: 101, author: "John Smith", content: "Amazing work!", createdAt: new Date("2025-04-23T15:00:00Z").toISOString() },
      { id: 102, author: "Alice Johnson", content: "Congrats!", createdAt: new Date("2025-04-23T15:30:00Z").toISOString() }
    ],
    isLiked: false
  },
  {
    id: 2,
    author: "John Smith",
    authorId: "john-smith",
    authorAvatar: "/images/default-avatar.png",
    content: "Beautiful day for a hike! 🏞️ #nature #outdoors",
    image: "https://via.placeholder.com/600x400",
    createdAt: new Date("2025-04-23T10:15:00Z").toISOString(),
    likes: 28,
    comments: [],
    isLiked: false
  },
  {
    id: 3,
    author: "Alice Johnson",
    authorId: "alice-johnson",
    authorAvatar: "/images/default-avatar.png",
    content: "Just learned about React hooks. They're game changers! #reactjs #javascript",
    createdAt: new Date("2025-04-22T16:45:00Z").toISOString(),
    likes: 17,
    comments: [
      { id: 103, author: "Jane Doe", content: "They really are! Changed how I build components.", createdAt: new Date("2025-04-22T17:30:00Z").toISOString() }
    ],
    isLiked: false
  }
];

// Routes for API
// GET all posts
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

// GET single post by ID
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// POST create a new post
app.post("/api/posts", require('./middleware/auth.middleware').verifyToken, (req, res) => {
  const { content, image } = req.body;
  
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }
  
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    author: req.user.fullName || req.user.username, // Sử dụng tên thật hoặc username của người dùng
    authorId: req.user.id,
    authorAvatar: req.user.avatar || "/images/default-avatar.png", // Sử dụng avatar đã cấu hình
    content,
    image: image || null,
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: [],
    isLiked: false
  };
  
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// POST like/unlike a post
app.post("/api/posts/:id/like", (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  
  post.isLiked = !post.isLiked;
  post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
  
  res.json({ likes: post.likes, isLiked: post.isLiked });
});

// POST add a comment to a post
app.post("/api/posts/:id/comments", require('./middleware/auth.middleware').verifyToken, (req, res) => {
  const { content } = req.body;
  const post = posts.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  
  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }
  
  const newComment = {
    id: post.comments.length > 0 ? Math.max(...post.comments.map(c => c.id)) + 1 : 1,
    author: req.user.fullName || req.user.username, // Sử dụng tên thật hoặc username của người dùng
    authorId: req.user.id,
    authorAvatar: req.user.avatar || "/images/default-avatar.png", // Sử dụng avatar đã cấu hình
    content,
    createdAt: new Date().toISOString()
  };
  
  post.comments.push(newComment);
  res.status(201).json(newComment);
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Kết nối thành công đến backend!", status: "OK" });
});

// Khởi động server sau khi đã đồng bộ với cơ sở dữ liệu
const startServer = async () => {
  try {
    // Kiểm tra kết nối tới MySQL
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('Error: Could not connect to MySQL database');
      process.exit(1);
    }
    
    // Đồng bộ các model với cơ sở dữ liệu - sử dụng force: false và alter: false để tránh lỗi
    await sequelize.sync({ force: false, alter: false });
    console.log('All models synchronized with database');
    
    // Khởi động server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();
