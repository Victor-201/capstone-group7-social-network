const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const { sequelize, testConnection, initModels } = require("./config/database");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const groupsRoutes = require("./routes/groups.routes");
const friendshipRoutes = require("./routes/friendship.routes");
const followerRoutes = require("./routes/follower.routes");
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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware hiển thị thông tin request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(bodyParser.json());

// Khai báo routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupsRoutes);
app.use('/api/friends', friendshipRoutes);
app.use('/api/follow', followerRoutes);

// Import all models
const Post = models.Post;
const User = models.User;
const Comment = models.Comment;
const Like = models.Like;
const Media = models.Media;
const Hashtag = models.Hashtag;

// GET all posts
app.get("/api/posts", async (req, res) => {
  try {
    console.log("Attempting to fetch posts from database");
    
    // Lấy ID người dùng từ token nếu có
    let userId = null;
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      if (token) {
        const authMiddleware = require('./middleware/auth.middleware');
        const decoded = authMiddleware.decodeToken(token);
        userId = decoded?.id;
      }
    }
    
    console.log("Current user ID:", userId);
    
    // Nếu có userId, chỉ lấy bài viết của người dùng đó
    const whereClause = userId ? { userId: userId } : {};
    
    // Fetch posts from database
    const posts = await Post.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'avatar']
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'fullName', 'avatar']
            }
          ]
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['id', 'userId', 'postId'],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id']
            }
          ]
        },
        {
          model: Media,
          as: 'media'
        }
      ],
      order: [['created_at', 'DESC']]
    });

    console.log(`Found ${posts.length} posts`);

    // Transform posts to match expected frontend format
    const formattedPosts = posts.map(post => {
      const postObj = post.toJSON();
      
      // Format comments
      const formattedComments = postObj.comments ? postObj.comments.map(comment => ({
        id: comment.id,
        author: comment.author?.fullName || comment.author?.username || 'Unknown User',
        authorId: comment.author?.id,
        authorAvatar: comment.author?.avatar || null,
        content: comment.content,
        createdAt: comment.created_at
      })) : [];
      
      // Get post image from media if available - Thử các trường khác nhau
      const postImage = postObj.media && postObj.media.length > 0 
        ? postObj.media.find(m => m.type === 'image')?.mediaUrl || null
        : null;
      
      // Check if current user liked the post
      const isLiked = userId ? 
        postObj.likes.some(like => like.user?.id === userId) : false;
      
      return {
        id: postObj.id,
        author: postObj.author?.fullName || postObj.author?.username || 'Unknown User',
        authorId: postObj.author?.id,
        authorAvatar: postObj.author?.avatar || null,
        content: postObj.content,
        image: postImage,
        createdAt: postObj.created_at,
        likes: postObj.likes ? postObj.likes.length : 0,
        comments: formattedComments,
        isLiked: isLiked
      };
    });

    res.json(formattedPosts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET single post by ID
app.get("/api/posts/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Transform post to match expected frontend format
    const postObj = post.toJSON();
    const formattedPost = {
      id: postObj.id,
      author: postObj.author?.fullName || postObj.author?.username || 'Unknown User',
      authorId: postObj.author?.id,
      authorAvatar: postObj.author?.avatar || null,
      content: postObj.content,
      createdAt: postObj.createdAt,
      likes: 0, // Will implement likes count later
      comments: [], // Will implement comments later
      isLiked: false // Will implement later
    };
    
    res.json(formattedPost);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST create a new post
app.post("/api/posts", require('./middleware/auth.middleware').verifyToken, async (req, res) => {
  try {
    const { content, image } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    
    // Create post in database
    const newPost = await Post.create({
      userId: req.user.id,
      content: content,
      privacy: 'public'
    });
    
    // Return the newly created post with user info
    const createdPost = await Post.findByPk(newPost.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ]
    });
    
    if (!createdPost) {
      return res.status(500).json({ message: "Error retrieving created post" });
    }
    
    // Format the response
    const postObj = createdPost.toJSON();
    const formattedPost = {
      id: postObj.id,
      author: postObj.author?.fullName || postObj.author?.username || 'Unknown User',
      authorId: postObj.author?.id,
      authorAvatar: postObj.author?.avatar || null,
      content: postObj.content,
      createdAt: postObj.createdAt,
      likes: 0,
      comments: [],
      isLiked: false
    };
    
    res.status(201).json(formattedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST like/unlike a post
app.post("/api/posts/:id/like", require('./middleware/auth.middleware').verifyToken, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Check if user already liked the post
    const existingLike = await Like.findOne({
      where: {
        postId: postId,
        userId: userId
      }
    });
    
    // Toggle like/unlike
    if (existingLike) {
      // User already liked the post, so unlike it
      await existingLike.destroy();
      
      // Count likes for this post
      const likeCount = await Like.count({ where: { postId: postId } });
      
      res.json({ 
        likes: likeCount, 
        isLiked: false 
      });
    } else {
      // User hasn't liked the post, so add a like
      await Like.create({
        postId: postId,
        userId: userId
      });
      
      // Count likes for this post
      const likeCount = await Like.count({ where: { postId: postId } });
      
      res.json({ 
        likes: likeCount, 
        isLiked: true 
      });
    }
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST add a comment to a post
app.post("/api/posts/:id/comments", require('./middleware/auth.middleware').verifyToken, async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Create the comment in the database
    const newComment = await Comment.create({
      userId: userId,
      postId: postId,
      content: content
    });
    
    // Fetch the created comment with user info
    const comment = await Comment.findByPk(newComment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'fullName', 'avatar']
        }
      ]
    });
    
    if (!comment) {
      return res.status(500).json({ message: "Error retrieving created comment" });
    }
    
    // Format the response
    const commentObj = comment.toJSON();
    const formattedComment = {
      id: commentObj.id,
      author: commentObj.author?.fullName || commentObj.author?.username || 'Unknown User',
      authorId: commentObj.author?.id,
      authorAvatar: commentObj.author?.avatar || null,
      content: commentObj.content,
      createdAt: commentObj.created_at
    };
    
    res.status(201).json(formattedComment);
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Test endpoint
app.get("/test", (req, res) => {
  res.json({ message: "Kết nối thành công đến backend!", status: "OK" });
});

// File diagnostic endpoint
app.get("/api/file-check", (req, res) => {
  try {
    const filePath = req.query.path;
    const uploadsDir = path.join(__dirname, 'uploads');
    const avatarsDir = path.join(uploadsDir, 'avatars');
    
    // Check if uploads directory exists
    const uploadsExists = fs.existsSync(uploadsDir);
    
    // Check if avatars directory exists
    const avatarsExists = fs.existsSync(avatarsDir);
    
    // Create directories if they don't exist
    if (!uploadsExists) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    if (!avatarsExists) {
      fs.mkdirSync(avatarsDir, { recursive: true });
    }
    
    // List files in avatars directory
    const avatarFiles = fs.existsSync(avatarsDir) 
      ? fs.readdirSync(avatarsDir) 
      : [];
    
    // Check specific file if path parameter is provided
    let fileExists = false;
    let fullFilePath = '';
    
    if (filePath) {
      // Handle both relative and absolute paths
      if (filePath.startsWith('/')) {
        // Remove leading slash
        const relativePath = filePath.substring(1);
        fullFilePath = path.join(__dirname, relativePath);
      } else {
        fullFilePath = path.join(__dirname, filePath);
      }
      
      fileExists = fs.existsSync(fullFilePath);
    }
    
    res.json({
      uploadsDirectoryExists: uploadsExists,
      avatarsDirectoryExists: avatarsExists,
      avatarFiles: avatarFiles,
      fileCheckRequested: !!filePath,
      requestedFilePath: filePath || '',
      fullFilePath: fullFilePath || '',
      fileExists: fileExists,
      serverDirectory: __dirname,
      uploadsPath: uploadsDir,
      avatarsPath: avatarsDir
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message, 
      stack: error.stack 
    });
  }
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
