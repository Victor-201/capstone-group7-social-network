-- Table: User_Infos
CREATE TABLE User_Infos (
    id CHAR(36) PRIMARY KEY,
    full_name VARCHAR(255),
    bio TEXT,
    gender VARCHAR(50),
    birth_date DATE,
    avatar CHAR(36) DEFAULT NULL,
    cover CHAR(36) DEFAULT NULL,
    isOnline BOOLEAN DEFAULT FALSE,
    interestedUser VARCHAR(256)
);

-- Table: User_Account
CREATE TABLE User_Account (
    id CHAR(36) PRIMARY KEY NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    otp_code VARCHAR(6),
    otp_expiry TIMESTAMP,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'suspended', 'deleted') DEFAULT 'active',
    status_update_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Refresh_Tokens
CREATE TABLE Refresh_Tokens (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User_Account(id) ON DELETE CASCADE
);

-- Table: User_Media
CREATE TABLE User_Media (
    media_id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    media_type ENUM ('image', 'video') NOT NULL,
    image_type ENUM ('cover', 'avatar'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

ALTER TABLE User_Infos
    ADD FOREIGN KEY (avatar) REFERENCES User_Media(media_id) ON DELETE SET NULL,
    ADD FOREIGN KEY (cover) REFERENCES User_Media(media_id) ON DELETE SET NULL;

-- Table: Profile_Details
CREATE TABLE Profile_Details (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    job VARCHAR(255),
    education VARCHAR(255),
    relationship_status ENUM('single','in_a_relationship','engaged','married') DEFAULT 'single',
    hometown VARCHAR(255),
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Profile_Visible
CREATE TABLE Profile_Visible (
    profile_detail_id CHAR(36) NOT NULL,
    field_name ENUM('job','education','relationship_status','hometown','location', 'created_at') NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (profile_detail_id, field_name),
    FOREIGN KEY (profile_detail_id) REFERENCES Profile_Details(id) ON DELETE CASCADE
);

-- Table: Posts
CREATE TABLE Posts (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    content VARCHAR(3000),
    access_modifier ENUM('public', 'private', 'friends'),
    like_count INT DEFAULT 0,
    shared_post_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE,
    FOREIGN KEY (shared_post_id) REFERENCES Posts(id) ON DELETE SET NULL
);

-- Table: Post_Media
CREATE TABLE Post_Media (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    media_url TEXT,
    media_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE
);

-- Table: Comments
CREATE TABLE Comments (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    content TEXT,
    like_count INT DEFAULT 0,
    parent_comment_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES Comments(id) ON DELETE CASCADE
);

-- Table: Likes
CREATE TABLE Likes (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Friends
CREATE TABLE Friends (
    user_id CHAR(36) NOT NULL,
    friend_id CHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Follows
CREATE TABLE Follows (
    follower_id CHAR(36) NOT NULL,
    following_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES User_Infos(id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Chats
CREATE TABLE Chats (
    id CHAR(36) PRIMARY KEY,
    is_group BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Chat_Participants
CREATE TABLE Chat_Participants (
    chat_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    PRIMARY KEY(chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES Chats(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Messages
CREATE TABLE Messages (
    id CHAR(36) PRIMARY KEY,
    chat_id CHAR(36) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chat_id) REFERENCES Chats(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Notifications
CREATE TABLE Notifications (
    id CHAR(36) PRIMARY KEY,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36) NOT NULL,
    action_type ENUM ('post', 'comment', 'like', 'friend_request', 'message', 'friend_respond', 'reply_comment') NOT NULL,
    action_id CHAR(36) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    content VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES User_Infos(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Table: Post_Tags
CREATE TABLE Post_Tags (
    id CHAR(36) PRIMARY KEY,
    post_id CHAR(36) NOT NULL,
    user_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES User_Infos(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_messages_chatID_sentAt ON Messages(chat_id, sent_at DESC);
CREATE INDEX idx_posts_userid_createdat ON Posts(user_id, created_at DESC);
CREATE INDEX idx_posts_likecount_createdat ON Posts(like_count DESC, created_at DESC);
CREATE INDEX idx_posts_accessmodifier ON Posts(access_modifier);
CREATE INDEX idx_posts_shared ON Posts(shared_post_id);
CREATE INDEX idx_comments_postid_likecount ON Comments(post_id, like_count DESC);
CREATE INDEX idx_comments_parent ON Comments(parent_comment_id);
CREATE INDEX idx_notifications_receiver ON Notifications(receiver_id, is_read, created_at DESC);

-- Envent Schedule
SET GLOBAL event_scheduler = ON;

-- Create an event to delete expired refresh tokens
CREATE EVENT delete_expired_tokens
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 HOUR
DO
  DELETE FROM refresh_tokens
  WHERE expires_at < NOW();

-- Create an event to delete otp codes and otp expiry
CREATE EVENT IF NOT EXISTS delete_expired_otp
ON SCHEDULE EVERY 5 MINUTE
DO
  UPDATE User_Account
  SET otp_code = NULL, otp_expiry = NULL
  WHERE otp_expiry < NOW();

-- Show all events
SHOW EVENTS;
