-- Table: UserInfos
CREATE TABLE UserInfos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    full_name VARCHAR(255),
    bio TEXT,
    birthdate DATE,
    gender VARCHAR(50),
    favourite VARCHAR(300),
    interestedUser VARCHAR(256)
);

-- Table: UsersAccount
CREATE TABLE UsersAccount (
    user_id CHAR(36) PRIMARY KEY REFERENCES UserInfos(id),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'deleting', 'prohibited') DEFAULT 'active',
    status_update_at TIMESTAMP
);

-- Table: UserMedia
CREATE TABLE UserMedia (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) REFERENCES UserInfos(id),
    media_url TEXT NOT NULL,
    media_type VARCHAR(50), -- avatar, cover, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Posts
CREATE TABLE Posts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) REFERENCES UserInfos(id),
    content VARCHAR(3000),
    access_modifier ENUM('public', 'private', 'friends'),
    like_count INT DEFAULT 0,
    shared_post_id CHAR(36) REFERENCES Posts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: PostMedia
CREATE TABLE PostMedia (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id CHAR(36) REFERENCES Posts(id),
    media_url TEXT,
    media_type VARCHAR(50), -- image, video, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Comments
CREATE TABLE Comments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id CHAR(36) REFERENCES Posts(id),
    user_id CHAR(36) REFERENCES UserInfos(id),
    content TEXT,
    like_count INT,
    parent_comment_id CHAR(36) REFERENCES Comments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Likes
CREATE TABLE Likes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id CHAR(36) REFERENCES Posts(id),
    user_id CHAR(36) REFERENCES UserInfos(id)
);

-- Table: Friends
CREATE TABLE Friends (
    user_id CHAR(36) REFERENCES UserInfos(id),
    friend_id CHAR(36) REFERENCES UserInfos(id),
    status ENUM('pending', 'accepted', 'rejected') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, friend_id)
);

-- Table: Follows
CREATE TABLE Follows (
    follower_id CHAR(36) REFERENCES UserInfos(id),
    following_id CHAR(36) REFERENCES UserInfos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(follower_id, following_id)
);

-- Table: Chats
CREATE TABLE Chats (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    is_group BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: ChatParticipants
CREATE TABLE ChatParticipants (
    chat_id CHAR(36) REFERENCES Chats(id),
    user_id CHAR(36) REFERENCES UserInfos(id),
    PRIMARY KEY(chat_id, user_id)
);

-- Table: Messages
CREATE TABLE Messages (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    chat_id CHAR(36) REFERENCES Chats(id),
    sender_id CHAR(36) REFERENCES UserInfos(id),
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: Notifications
CREATE TABLE Notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    sender_id CHAR(36) REFERENCES UserInfos(id),
    receiver_id CHAR(36) REFERENCES UserInfos(id),
    action_type VARCHAR(50) NOT NULL,
    action_id VARCHAR(36),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: PostTags
CREATE TABLE PostTags (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    post_id CHAR(36) REFERENCES Posts(id),
    user_id CHAR(36) REFERENCES UserInfos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_messages_chatID_sentAt ON Messages(chat_id, sent_at DESC);
CREATE INDEX idx_posts_userid_createdat ON Posts(user_id, created_at DESC);
CREATE INDEX idx_posts_likecount_createdat ON Posts(like_count DESC, created_at DESC);
CREATE INDEX idx_posts_accessmodifier ON Posts(access_modifier);
CREATE INDEX idx_posts_shared ON Posts(shared_post_id);
CREATE INDEX idx_comments_postid_likecount ON Comments(post_id, like_count DESC);
CREATE INDEX idx_notifications_receiver ON Notifications(receiver_id, is_read, created_at DESC);
