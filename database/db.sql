-- Create Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT '/images/default-avatar.png',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create Posts Table
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Comments Table
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Likes Table
CREATE TABLE likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    comment_id INT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL),
    UNIQUE (post_id, user_id),
    UNIQUE (comment_id, user_id)
);

-- Create Friendships Table
CREATE TABLE friendships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id_1 INT NOT NULL,
    user_id_2 INT NOT NULL,
    status ENUM('pending', 'accepted', 'declined', 'blocked') NOT NULL DEFAULT 'pending',
    action_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_1) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id_2) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (action_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (user_id_1 < user_id_2), -- Ensures uniqueness and prevents duplicates
    UNIQUE (user_id_1, user_id_2)
);

-- Create Stories Table
CREATE TABLE stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    type ENUM('image', 'video') NOT NULL DEFAULT 'image',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL, -- stories expire after 24 hours
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create Story Views Table
CREATE TABLE story_views (
    id INT AUTO_INCREMENT PRIMARY KEY,
    story_id INT NOT NULL,
    user_id INT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (story_id, user_id)
);

-- Sample Data for Users
INSERT INTO users (username, email, password, full_name, bio) VALUES
('jane_doe', 'jane@example.com', 'hashed_password_here', 'Jane Doe', 'Web developer and designer.'),
('john_smith', 'john@example.com', 'hashed_password_here', 'John Smith', 'Nature enthusiast and photographer.'),
('alice_johnson', 'alice@example.com', 'hashed_password_here', 'Alice Johnson', 'React developer.'),
('current_user', 'me@example.com', 'hashed_password_here', 'Current User', 'This is you!');

-- Sample Data for Posts
INSERT INTO posts (user_id, content, image_url) VALUES
(1, 'Just finished my latest project! 🚀 #coding #webdev', 'https://via.placeholder.com/600x400'),
(2, 'Beautiful day for a hike! 🏞️ #nature #outdoors', 'https://via.placeholder.com/600x400'),
(3, 'Just learned about React hooks. They\'re game changers! #reactjs #javascript', NULL);

-- Sample Data for Comments
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Amazing work!'),
(1, 3, 'Congrats!'),
(3, 1, 'They really are! Changed how I build components.');

-- Sample Data for Likes
INSERT INTO likes (post_id, user_id) VALUES
(1, 2),
(1, 3),
(1, 4),
(2, 1),
(2, 3),
(3, 2);