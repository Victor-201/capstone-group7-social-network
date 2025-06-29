-- Test Database Data for Social Network
-- This file contains test data for development and testing purposes

-- Clear existing data (in correct order to avoid foreign key constraints)
SET SQL_SAFE_UPDATES = 0;
SET FOREIGN_KEY_CHECKS = 0;

-- Delete all data safely
TRUNCATE TABLE Notifications;
TRUNCATE TABLE Messages;
TRUNCATE TABLE Chat_Participants;
TRUNCATE TABLE Chats;
TRUNCATE TABLE Post_Tags;
TRUNCATE TABLE Likes;
TRUNCATE TABLE Comments;
TRUNCATE TABLE Post_Media;
TRUNCATE TABLE Posts;
TRUNCATE TABLE Friends;
TRUNCATE TABLE Follows;
TRUNCATE TABLE Profile_Visible;
TRUNCATE TABLE Profile_Details;
TRUNCATE TABLE User_Media;
TRUNCATE TABLE Refresh_Tokens;
TRUNCATE TABLE User_Account;
TRUNCATE TABLE User_Infos;

SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- Insert User_Infos (without avatar and cover first)
INSERT INTO User_Infos (id, full_name, bio, gender, birth_date, avatar, cover, isOnline, interestedUser) VALUES
('user-001', 'Admin User', 'Quản trị viên hệ thống mạng xã hội. Luôn sẵn sàng hỗ trợ người dùng!', 'male', '1990-01-01', NULL, NULL, TRUE, NULL),
('user-002', 'Nguyễn Văn An', 'Lập trình viên Full-stack, yêu thích công nghệ và du lịch. Đam mê tạo ra những sản phẩm hữu ích cho cộng đồng.', 'male', '1995-03-15', NULL, NULL, TRUE, NULL),
('user-003', 'Trần Thị Bình', 'Designer UI/UX với 5 năm kinh nghiệm. Thích thiết kế giao diện đẹp và thân thiện với người dùng.', 'female', '1993-07-22', NULL, NULL, FALSE, NULL),
('user-004', 'Lê Hoàng Cường', 'Sinh viên năm cuối ngành CNTT tại ĐH Bách Khoa. Đam mê AI và Machine Learning.', 'male', '2001-11-08', NULL, NULL, TRUE, NULL),
('user-005', 'Phạm Thị Dung', 'Marketing Manager tại công ty công nghệ. Yêu thích photography và travel blogging.', 'female', '1992-05-30', NULL, NULL, FALSE, NULL),
('user-006', 'Hoàng Văn Em', 'Game Developer độc lập. Đã phát hành 3 game mobile thành công trên App Store.', 'male', '1994-09-12', NULL, NULL, TRUE, NULL),
('user-007', 'Vũ Thị Phương', 'Content Creator và Influencer. Chuyên về lifestyle và beauty tips.', 'female', '1996-12-03', NULL, NULL, TRUE, NULL),
('user-008', 'Đặng Minh Giang', 'Data Scientist tại startup fintech. Thích phân tích dữ liệu và machine learning.', 'male', '1991-08-17', NULL, NULL, FALSE, NULL),
('user-009', 'Ngô Thị Hoa', 'Teacher và blogger giáo dục. Chia sẻ kinh nghiệm học tập và phương pháp giảng dạy hiệu quả.', 'female', '1988-04-25', NULL, NULL, TRUE, NULL),
('user-010', 'Bùi Văn Khoa', 'Freelance Web Developer. Chuyên về React và Node.js. Thích làm việc remote.', 'male', '1997-10-14', NULL, NULL, FALSE, NULL);

-- Insert User_Account
INSERT INTO User_Account (id, phone_number, user_name, email, password, role, status, created_at) VALUES
('user-001', '+84901234567', 'admin', 'admin@socialnetwork.com', '$2b$10$9u.LO/S4W6N80LmvoPeKFuCAq0ygkpO2EKAXBzMB1s3FfbbXUBGTG', 'admin', 'active', '2024-01-01 00:00:00'),
('user-002', '+84901234568', 'nguyenvanan', 'an.nguyen@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-02 08:30:00'),
('user-003', '+84901234569', 'tranthibinh', 'binh.tran@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-03 09:15:00'),
('user-004', '+84901234570', 'lehoangcuong', 'cuong.le@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-04 10:45:00'),
('user-005', '+84901234571', 'phamthidung', 'dung.pham@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-05 11:20:00'),
('user-006', '+84901234572', 'hoangvanem', 'em.hoang@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-06 14:30:00'),
('user-007', '+84901234573', 'vuthiphuong', 'phuong.vu@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-07 16:45:00'),
('user-008', '+84901234574', 'dangminhgiang', 'giang.dang@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-08 18:00:00'),
('user-009', '+84901234575', 'ngothihoa', 'hoa.ngo@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-09 19:30:00'),
('user-010', '+84901234576', 'buivankhoa', 'khoa.bui@email.com', '$2b$10$fT2YMLe8EDo0dvzurOWGduSIRdObuZ8XFMIs/0AulZosSreuJ7MSW', 'user', 'active', '2024-01-10 20:15:00');

-- Insert User_Media (Avatar and Cover photos)
INSERT INTO User_Media (media_id, user_id, media_type, image_type, created_at) VALUES
-- Avatar images
('avatar-001', 'user-001', 'image', 'avatar', '2024-01-01 00:00:00'),
('avatar-002', 'user-002', 'image', 'avatar', '2024-01-02 08:30:00'),
('avatar-003', 'user-003', 'image', 'avatar', '2024-01-03 09:15:00'),
('avatar-004', 'user-004', 'image', 'avatar', '2024-01-04 10:45:00'),
('avatar-005', 'user-005', 'image', 'avatar', '2024-01-05 11:20:00'),
('avatar-006', 'user-006', 'image', 'avatar', '2024-01-06 14:30:00'),
('avatar-007', 'user-007', 'image', 'avatar', '2024-01-07 16:45:00'),
('avatar-008', 'user-008', 'image', 'avatar', '2024-01-08 18:00:00'),
('avatar-009', 'user-009', 'image', 'avatar', '2024-01-09 19:30:00'),
('avatar-010', 'user-010', 'image', 'avatar', '2024-01-10 20:15:00'),
-- Cover images
('cover-001', 'user-001', 'image', 'cover', '2024-01-01 00:00:00'),
('cover-002', 'user-002', 'image', 'cover', '2024-01-02 08:30:00'),
('cover-003', 'user-003', 'image', 'cover', '2024-01-03 09:15:00'),
('cover-004', 'user-004', 'image', 'cover', '2024-01-04 10:45:00'),
('cover-005', 'user-005', 'image', 'cover', '2024-01-05 11:20:00'),
('cover-006', 'user-006', 'image', 'cover', '2024-01-06 14:30:00'),
('cover-007', 'user-007', 'image', 'cover', '2024-01-07 16:45:00'),
('cover-008', 'user-008', 'image', 'cover', '2024-01-08 18:00:00'),
('cover-009', 'user-009', 'image', 'cover', '2024-01-09 19:30:00'),
('cover-010', 'user-010', 'image', 'cover', '2024-01-10 20:15:00');

-- Update User_Infos with avatar and cover references
UPDATE User_Infos SET avatar = 'avatar-001', cover = 'cover-001' WHERE id = 'user-001';
UPDATE User_Infos SET avatar = 'avatar-002', cover = 'cover-002' WHERE id = 'user-002';
UPDATE User_Infos SET avatar = 'avatar-003', cover = 'cover-003' WHERE id = 'user-003';
UPDATE User_Infos SET avatar = 'avatar-004', cover = 'cover-004' WHERE id = 'user-004';
UPDATE User_Infos SET avatar = 'avatar-005', cover = 'cover-005' WHERE id = 'user-005';
UPDATE User_Infos SET avatar = 'avatar-006', cover = 'cover-006' WHERE id = 'user-006';
UPDATE User_Infos SET avatar = 'avatar-007', cover = 'cover-007' WHERE id = 'user-007';
UPDATE User_Infos SET avatar = 'avatar-008', cover = 'cover-008' WHERE id = 'user-008';
UPDATE User_Infos SET avatar = 'avatar-009', cover = 'cover-009' WHERE id = 'user-009';
UPDATE User_Infos SET avatar = 'avatar-010', cover = 'cover-010' WHERE id = 'user-010';

-- Insert Profile_Details
INSERT INTO Profile_Details (id, user_id, job, education, relationship_status, hometown, location, created_at) VALUES
('profile-001', 'user-001', 'System Administrator', 'Đại học Bách Khoa Hà Nội', 'married', 'Hà Nội', 'Hà Nội, Việt Nam', '2024-01-01 00:00:00'),
('profile-002', 'user-002', 'Full-stack Developer', 'Đại học Công nghệ - ĐHQGHN', 'single', 'Hải Phòng', 'Hà Nội, Việt Nam', '2024-01-02 08:30:00'),
('profile-003', 'user-003', 'UI/UX Designer', 'Đại học Mỹ thuật Công nghiệp', 'in_a_relationship', 'TP.HCM', 'TP.HCM, Việt Nam', '2024-01-03 09:15:00'),
('profile-004', 'user-004', 'Student', 'Đại học Bách Khoa TP.HCM', 'single', 'Đà Nẵng', 'TP.HCM, Việt Nam', '2024-01-04 10:45:00'),
('profile-005', 'user-005', 'Marketing Manager', 'Đại học Kinh tế Quốc dân', 'engaged', 'Hà Nội', 'Hà Nội, Việt Nam', '2024-01-05 11:20:00'),
('profile-006', 'user-006', 'Game Developer', 'Đại học FPT', 'single', 'Cần Thơ', 'TP.HCM, Việt Nam', '2024-01-06 14:30:00'),
('profile-007', 'user-007', 'Content Creator', 'Đại học Sân khấu Điện ảnh', 'single', 'TP.HCM', 'TP.HCM, Việt Nam', '2024-01-07 16:45:00'),
('profile-008', 'user-008', 'Data Scientist', 'Đại học Khoa học Tự nhiên', 'married', 'Hà Nội', 'Hà Nội, Việt Nam', '2024-01-08 18:00:00'),
('profile-009', 'user-009', 'Teacher', 'Đại học Sư phạm Hà Nội', 'married', 'Nam Định', 'Hà Nội, Việt Nam', '2024-01-09 19:30:00'),
('profile-010', 'user-010', 'Freelance Developer', 'Đại học Công nghệ Thông tin', 'single', 'Huế', 'Đà Nẵng, Việt Nam', '2024-01-10 20:15:00');

-- Insert Profile_Visible (all fields visible by default)
INSERT INTO Profile_Visible (profile_detail_id, field_name, is_visible) VALUES
('profile-001', 'job', TRUE), ('profile-001', 'education', TRUE), ('profile-001', 'relationship_status', TRUE), ('profile-001', 'hometown', TRUE), ('profile-001', 'location', TRUE),
('profile-002', 'job', TRUE), ('profile-002', 'education', TRUE), ('profile-002', 'relationship_status', TRUE), ('profile-002', 'hometown', TRUE), ('profile-002', 'location', TRUE),
('profile-003', 'job', TRUE), ('profile-003', 'education', TRUE), ('profile-003', 'relationship_status', TRUE), ('profile-003', 'hometown', TRUE), ('profile-003', 'location', TRUE),
('profile-004', 'job', TRUE), ('profile-004', 'education', TRUE), ('profile-004', 'relationship_status', TRUE), ('profile-004', 'hometown', TRUE), ('profile-004', 'location', TRUE),
('profile-005', 'job', TRUE), ('profile-005', 'education', TRUE), ('profile-005', 'relationship_status', FALSE), ('profile-005', 'hometown', TRUE), ('profile-005', 'location', TRUE),
('profile-006', 'job', TRUE), ('profile-006', 'education', TRUE), ('profile-006', 'relationship_status', TRUE), ('profile-006', 'hometown', TRUE), ('profile-006', 'location', TRUE),
('profile-007', 'job', TRUE), ('profile-007', 'education', TRUE), ('profile-007', 'relationship_status', TRUE), ('profile-007', 'hometown', TRUE), ('profile-007', 'location', TRUE),
('profile-008', 'job', TRUE), ('profile-008', 'education', TRUE), ('profile-008', 'relationship_status', TRUE), ('profile-008', 'hometown', TRUE), ('profile-008', 'location', TRUE),
('profile-009', 'job', TRUE), ('profile-009', 'education', TRUE), ('profile-009', 'relationship_status', TRUE), ('profile-009', 'hometown', TRUE), ('profile-009', 'location', TRUE),
('profile-010', 'job', TRUE), ('profile-010', 'education', TRUE), ('profile-010', 'relationship_status', TRUE), ('profile-010', 'hometown', TRUE), ('profile-010', 'location', TRUE);

-- Insert Friends relationships
INSERT INTO Friends (user_id, friend_id, status, created_at) VALUES
-- Admin is friends with everyone
('user-001', 'user-002', 'accepted', '2024-01-15 10:00:00'),
('user-001', 'user-003', 'accepted', '2024-01-16 11:00:00'),
('user-001', 'user-004', 'accepted', '2024-01-17 12:00:00'),
('user-001', 'user-005', 'accepted', '2024-01-18 13:00:00'),
-- Cross friendships
('user-002', 'user-003', 'accepted', '2024-01-20 14:00:00'),
('user-002', 'user-004', 'accepted', '2024-01-21 15:00:00'),
('user-002', 'user-006', 'accepted', '2024-01-22 16:00:00'),
('user-003', 'user-005', 'accepted', '2024-01-23 17:00:00'),
('user-003', 'user-007', 'accepted', '2024-01-24 18:00:00'),
('user-004', 'user-006', 'accepted', '2024-01-25 19:00:00'),
('user-004', 'user-010', 'accepted', '2024-01-26 20:00:00'),
('user-005', 'user-008', 'accepted', '2024-01-27 21:00:00'),
('user-006', 'user-007', 'accepted', '2024-01-28 22:00:00'),
('user-007', 'user-009', 'accepted', '2024-01-29 23:00:00'),
('user-008', 'user-009', 'accepted', '2024-01-30 10:00:00'),
('user-009', 'user-010', 'accepted', '2024-01-31 11:00:00'),
-- Pending friend requests
('user-005', 'user-006', 'pending', '2024-02-01 12:00:00'),
('user-007', 'user-008', 'pending', '2024-02-02 13:00:00'),
('user-008', 'user-010', 'pending', '2024-02-03 14:00:00');

-- Insert Follows relationships
INSERT INTO Follows (follower_id, following_id, created_at) VALUES
('user-002', 'user-001', '2024-01-15 10:00:00'),
('user-003', 'user-001', '2024-01-16 11:00:00'),
('user-004', 'user-001', '2024-01-17 12:00:00'),
('user-005', 'user-001', '2024-01-18 13:00:00'),
('user-006', 'user-001', '2024-01-19 14:00:00'),
('user-007', 'user-001', '2024-01-20 15:00:00'),
('user-008', 'user-001', '2024-01-21 16:00:00'),
('user-009', 'user-001', '2024-01-22 17:00:00'),
('user-010', 'user-001', '2024-01-23 18:00:00'),
-- Cross follows
('user-002', 'user-007', '2024-01-24 19:00:00'),
('user-003', 'user-007', '2024-01-25 20:00:00'),
('user-004', 'user-002', '2024-01-26 21:00:00'),
('user-005', 'user-003', '2024-01-27 22:00:00'),
('user-006', 'user-004', '2024-01-28 23:00:00'),
('user-007', 'user-005', '2024-01-29 10:00:00'),
('user-008', 'user-006', '2024-01-30 11:00:00'),
('user-009', 'user-007', '2024-01-31 12:00:00'),
('user-010', 'user-008', '2024-02-01 13:00:00');

-- Insert Posts with diverse content
INSERT INTO Posts (id, user_id, content, access_modifier, like_count, created_at) VALUES
('post-001', 'user-001', 'Chào mừng tất cả mọi người đến với mạng xã hội mới! 🎉 Hãy kết nối và chia sẻ những khoảnh khắc đẹp nhất của bạn. #Welcome #SocialNetwork', 'public', 15, '2024-02-01 08:00:00'),
('post-002', 'user-002', 'Vừa hoàn thành dự án web app mới sử dụng React và Node.js! Cảm giác thành tựu tuyệt vời 💻✨ #WebDevelopment #React #NodeJS #Programming', 'public', 12, '2024-02-01 09:30:00'),
('post-003', 'user-003', 'Chia sẻ một số tips thiết kế UI/UX cho người mới bắt đầu:\n1. Luôn đặt người dùng làm trung tâm\n2. Đơn giản hóa giao diện\n3. Sử dụng màu sắc hợp lý\n4. Test với người dùng thật\n#UIUX #Design #Tips', 'public', 8, '2024-02-01 10:15:00'),
('post-004', 'user-004', 'Hôm nay học về Machine Learning, thật sự rất thú vị! 🤖 AI sẽ thay đổi thế giới trong tương lai gần. #MachineLearning #AI #Study #Technology', 'friends', 6, '2024-02-01 11:45:00'),
('post-005', 'user-005', 'Chiến dịch marketing mới của công ty đạt 200% target! 🚀 Team work makes the dream work 💪 #Marketing #Success #Teamwork', 'public', 20, '2024-02-01 13:20:00'),
('post-006', 'user-006', 'Game indie mới của mình sắp ra mắt rồi! 🎮 Cảm ơn tất cả mọi người đã ủng hộ trong suốt quá trình phát triển. #GameDev #IndieGame #Unity', 'public', 25, '2024-02-01 14:30:00'),
('post-007', 'user-007', 'OOTD hôm nay! ✨ Phong cách minimalist luôn là lựa chọn an toàn và thanh lịch 👗 #OOTD #Fashion #Minimalist #Style', 'public', 18, '2024-02-01 15:45:00'),
('post-008', 'user-008', 'Phân tích dữ liệu khách hàng cho thấy xu hướng mua sắm online tăng 300% so với năm ngoái 📊 #DataScience #Analytics #Ecommerce #Trends', 'public', 10, '2024-02-01 16:30:00'),
('post-009', 'user-009', 'Chia sẻ phương pháp học tập hiệu quả cho học sinh:\n- Lập kế hoạch học tập rõ ràng\n- Nghỉ ngơi đầy đủ\n- Thực hành thường xuyên\n- Hỏi khi không hiểu\n#Education #StudyTips #Learning', 'public', 14, '2024-02-01 17:15:00'),
('post-010', 'user-010', 'Remote work life balance 🏠💻 Làm việc từ xa giúp mình có thời gian cho gia đình và sở thích cá nhân. #RemoteWork #WorkLifeBalance #Freelance', 'friends', 7, '2024-02-01 18:00:00'),
('post-011', 'user-002', 'Cà phê sáng và code 🌅☕ Không có gì tuyệt vời hơn việc bắt đầu ngày mới với passion! #MorningCode #Coffee #Developer #Motivation', 'public', 9, '2024-02-02 07:30:00'),
('post-012', 'user-003', 'Dự án thiết kế logo cho startup mới hoàn thành! Logo đơn giản nhưng ấn tượng 🎨 #LogoDesign #Branding #Startup #Creative', 'public', 11, '2024-02-02 10:20:00'),
('post-013', 'user-005', 'Weekend getaway tại Đà Lạt 🌸 Thành phố ngàn hoa luôn mang lại cảm giác bình yên và thư giãn #DaLat #Travel #Weekend #Nature', 'public', 22, '2024-02-02 19:45:00'),
('post-014', 'user-007', 'Skincare routine buổi tối của mình 🌙✨ Chăm sóc da đều đặn là bí quyết để có làn da khỏe mạnh! #Skincare #Beauty #SelfCare #NightRoutine', 'public', 16, '2024-02-02 21:30:00'),
('post-015', 'user-001', 'Cảm ơn cộng đồng đã ủng hộ! Chúng ta đã có 1000+ thành viên rồi! 🎊 #Milestone #Community #ThankYou #Growth', 'public', 30, '2024-02-03 12:00:00');

-- Insert Post_Media (images for posts)
INSERT INTO Post_Media (id, post_id, media_url, media_type, created_at) VALUES
('media-001', 'post-002', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'image', '2024-02-01 09:30:00'),
('media-002', 'post-003', 'https://res.cloudinary.com/demo/image/upload/sample2.jpg', 'image', '2024-02-01 10:15:00'),
('media-003', 'post-005', 'https://res.cloudinary.com/demo/image/upload/sample3.jpg', 'image', '2024-02-01 13:20:00'),
('media-004', 'post-006', 'https://res.cloudinary.com/demo/image/upload/sample4.jpg', 'image', '2024-02-01 14:30:00'),
('media-005', 'post-007', 'https://res.cloudinary.com/demo/image/upload/sample5.jpg', 'image', '2024-02-01 15:45:00'),
('media-006', 'post-007', 'https://res.cloudinary.com/demo/image/upload/sample6.jpg', 'image', '2024-02-01 15:45:00'),
('media-007', 'post-008', 'https://res.cloudinary.com/demo/image/upload/sample7.jpg', 'image', '2024-02-01 16:30:00'),
('media-008', 'post-012', 'https://res.cloudinary.com/demo/image/upload/sample8.jpg', 'image', '2024-02-02 10:20:00'),
('media-009', 'post-013', 'https://res.cloudinary.com/demo/image/upload/sample9.jpg', 'image', '2024-02-02 19:45:00'),
('media-010', 'post-013', 'https://res.cloudinary.com/demo/image/upload/sample10.jpg', 'image', '2024-02-02 19:45:00'),
('media-011', 'post-013', 'https://res.cloudinary.com/demo/image/upload/sample11.jpg', 'image', '2024-02-02 19:45:00'),
('media-012', 'post-014', 'https://res.cloudinary.com/demo/image/upload/sample12.jpg', 'image', '2024-02-02 21:30:00');

-- Insert Likes
INSERT INTO Likes (id, post_id, user_id, created_at) VALUES
-- Post 1 likes
('like-001', 'post-001', 'user-002', '2024-02-01 08:05:00'),
('like-002', 'post-001', 'user-003', '2024-02-01 08:10:00'),
('like-003', 'post-001', 'user-004', '2024-02-01 08:15:00'),
('like-004', 'post-001', 'user-005', '2024-02-01 08:20:00'),
('like-005', 'post-001', 'user-006', '2024-02-01 08:25:00'),
-- Post 2 likes
('like-006', 'post-002', 'user-001', '2024-02-01 09:35:00'),
('like-007', 'post-002', 'user-003', '2024-02-01 09:40:00'),
('like-008', 'post-002', 'user-004', '2024-02-01 09:45:00'),
('like-009', 'post-002', 'user-006', '2024-02-01 09:50:00'),
-- Post 5 likes (most popular)
('like-010', 'post-005', 'user-001', '2024-02-01 13:25:00'),
('like-011', 'post-005', 'user-002', '2024-02-01 13:30:00'),
('like-012', 'post-005', 'user-003', '2024-02-01 13:35:00'),
('like-013', 'post-005', 'user-004', '2024-02-01 13:40:00'),
('like-014', 'post-005', 'user-006', '2024-02-01 13:45:00'),
('like-015', 'post-005', 'user-007', '2024-02-01 13:50:00'),
('like-016', 'post-005', 'user-008', '2024-02-01 13:55:00'),
-- Post 6 likes (game post)
('like-017', 'post-006', 'user-001', '2024-02-01 14:35:00'),
('like-018', 'post-006', 'user-002', '2024-02-01 14:40:00'),
('like-019', 'post-006', 'user-004', '2024-02-01 14:45:00'),
('like-020', 'post-006', 'user-007', '2024-02-01 14:50:00'),
('like-021', 'post-006', 'user-010', '2024-02-01 14:55:00'),
-- More likes for other posts
('like-022', 'post-007', 'user-003', '2024-02-01 15:50:00'),
('like-023', 'post-007', 'user-005', '2024-02-01 15:55:00'),
('like-024', 'post-008', 'user-005', '2024-02-01 16:35:00'),
('like-025', 'post-009', 'user-004', '2024-02-01 17:20:00'),
('like-026', 'post-013', 'user-002', '2024-02-02 19:50:00'),
('like-027', 'post-013', 'user-007', '2024-02-02 19:55:00'),
('like-028', 'post-015', 'user-002', '2024-02-03 12:05:00'),
('like-029', 'post-015', 'user-003', '2024-02-03 12:10:00'),
('like-030', 'post-015', 'user-004', '2024-02-03 12:15:00');

-- Insert Comments
INSERT INTO Comments (id, post_id, user_id, content, like_count, parent_comment_id, created_at) VALUES
('comment-001', 'post-001', 'user-002', 'Chào mừng admin! Rất vui được tham gia cộng đồng này 😊', 3, NULL, '2024-02-01 08:30:00'),
('comment-002', 'post-001', 'user-003', 'Giao diện rất đẹp và dễ sử dụng!', 2, NULL, '2024-02-01 08:45:00'),
('comment-003', 'post-001', 'user-001', 'Cảm ơn mọi người! Chúng ta sẽ cùng xây dựng cộng đồng tuyệt vời', 5, 'comment-001', '2024-02-01 09:00:00'),
('comment-004', 'post-002', 'user-003', 'Code của bạn có trên GitHub không? Mình muốn tham khảo', 1, NULL, '2024-02-01 10:00:00'),
('comment-005', 'post-002', 'user-002', 'Có nhé! Link: github.com/nguyenvanan/webapp-demo', 2, 'comment-004', '2024-02-01 10:15:00'),
('comment-006', 'post-003', 'user-004', 'Tips rất hữu ích! Mình đang học UI/UX', 1, NULL, '2024-02-01 11:00:00'),
('comment-007', 'post-005', 'user-006', 'Chúc mừng team! Thành công xứng đáng 🎉', 4, NULL, '2024-02-01 14:00:00'),
('comment-008', 'post-006', 'user-004', 'Game gì vậy bạn? Mình rất thích indie games', 2, NULL, '2024-02-01 15:00:00'),
('comment-009', 'post-006', 'user-006', 'Là game puzzle platformer nhé! Sắp có trailer', 3, 'comment-008', '2024-02-01 15:30:00'),
('comment-010', 'post-007', 'user-005', 'Outfit rất đẹp! Bạn mua ở đâu vậy?', 1, NULL, '2024-02-01 16:15:00'),
('comment-011', 'post-013', 'user-003', 'Đà Lạt lúc nào cũng đẹp! Mình cũng muốn đi', 2, NULL, '2024-02-02 20:00:00'),
('comment-012', 'post-014', 'user-009', 'Routine skincare rất chi tiết! Cảm ơn bạn đã chia sẻ', 1, NULL, '2024-02-02 22:00:00'),
('comment-013', 'post-015', 'user-002', 'Milestone tuyệt vời! Chúc mừng cộng đồng', 2, NULL, '2024-02-03 12:30:00');

-- Insert Chats
INSERT INTO Chats (id, is_group, created_at) VALUES
('chat-001', FALSE, '2024-02-01 20:00:00'),
('chat-002', FALSE, '2024-02-01 20:30:00'),
('chat-003', FALSE, '2024-02-01 21:00:00'),
('chat-004', FALSE, '2024-02-02 09:00:00'),
('chat-005', FALSE, '2024-02-02 10:00:00'),
('chat-006', TRUE, '2024-02-02 15:00:00'),
('chat-007', FALSE, '2024-02-02 16:00:00'),
('chat-008', FALSE, '2024-02-02 17:00:00');

-- Insert Chat_Participants
INSERT INTO Chat_Participants (chat_id, user_id) VALUES
-- Private chats
('chat-001', 'user-001'), ('chat-001', 'user-002'),
('chat-002', 'user-002'), ('chat-002', 'user-003'),
('chat-003', 'user-003'), ('chat-003', 'user-005'),
('chat-004', 'user-004'), ('chat-004', 'user-006'),
('chat-005', 'user-005'), ('chat-005', 'user-008'),
('chat-007', 'user-007'), ('chat-007', 'user-009'),
('chat-008', 'user-008'), ('chat-008', 'user-010'),
-- Group chat
('chat-006', 'user-001'), ('chat-006', 'user-002'), ('chat-006', 'user-003'), ('chat-006', 'user-004'), ('chat-006', 'user-005');

-- Insert Messages
INSERT INTO Messages (id, chat_id, sender_id, is_read, content, sent_at) VALUES
-- Chat between admin and user-002
('msg-001', 'chat-001', 'user-001', TRUE, 'Chào bạn! Cảm ơn bạn đã tham gia cộng đồng', '2024-02-01 20:05:00'),
('msg-002', 'chat-001', 'user-002', TRUE, 'Chào admin! Mình rất thích platform này', '2024-02-01 20:10:00'),
('msg-003', 'chat-001', 'user-001', TRUE, 'Có gì cần hỗ trợ cứ nhắn tin nhé!', '2024-02-01 20:15:00'),
('msg-004', 'chat-001', 'user-002', FALSE, 'Dạ, cảm ơn admin!', '2024-02-01 20:20:00'),

-- Chat between user-002 and user-003
('msg-005', 'chat-002', 'user-002', TRUE, 'Bình ơi, dự án UI/UX của bạn đẹp quá!', '2024-02-01 20:35:00'),
('msg-006', 'chat-002', 'user-003', TRUE, 'Cảm ơn An! Mình mới học thôi 😊', '2024-02-01 20:40:00'),
('msg-007', 'chat-002', 'user-002', TRUE, 'Có thể share một số resources không?', '2024-02-01 20:45:00'),
('msg-008', 'chat-002', 'user-003', FALSE, 'Được chứ! Mình gửi link Figma cho bạn', '2024-02-01 20:50:00'),

-- Chat between user-003 and user-005
('msg-009', 'chat-003', 'user-003', TRUE, 'Dung ơi, campaign marketing của bạn thành công quá!', '2024-02-01 21:05:00'),
('msg-010', 'chat-003', 'user-005', TRUE, 'Hihi, may mắn thôi! Team mình làm việc rất chăm chỉ', '2024-02-01 21:10:00'),
('msg-011', 'chat-003', 'user-003', FALSE, 'Có tips gì cho người mới không?', '2024-02-01 21:15:00'),

-- Group chat messages
('msg-012', 'chat-006', 'user-001', TRUE, 'Chào mọi người! Đây là group chat đầu tiên', '2024-02-02 15:05:00'),
('msg-013', 'chat-006', 'user-002', TRUE, 'Chào admin và mọi người!', '2024-02-02 15:10:00'),
('msg-014', 'chat-006', 'user-003', TRUE, 'Hello everyone! 👋', '2024-02-02 15:15:00'),
('msg-015', 'chat-006', 'user-004', TRUE, 'Chào các anh chị!', '2024-02-02 15:20:00'),
('msg-016', 'chat-006', 'user-005', FALSE, 'Rất vui được gặp mọi người', '2024-02-02 15:25:00'),

-- More private messages
('msg-017', 'chat-004', 'user-004', TRUE, 'Anh Em ơi, game của anh sắp release rồi à?', '2024-02-02 09:05:00'),
('msg-018', 'chat-004', 'user-006', TRUE, 'Ừ, đang trong giai đoạn cuối! Cảm ơn em quan tâm', '2024-02-02 09:10:00'),
('msg-019', 'chat-004', 'user-004', FALSE, 'Em có thể beta test không ạ?', '2024-02-02 09:15:00'),

('msg-020', 'chat-007', 'user-007', TRUE, 'Chị Hoa ơi, em thấy bài viết về education của chị hay quá!', '2024-02-02 16:05:00'),
('msg-021', 'chat-007', 'user-009', TRUE, 'Cảm ơn em! Chị chia sẻ kinh nghiệm thôi', '2024-02-02 16:10:00'),
('msg-022', 'chat-007', 'user-007', FALSE, 'Em có thể xin lời khuyên về việc học không ạ?', '2024-02-02 16:15:00');

-- Insert Notifications
INSERT INTO Notifications (id, sender_id, receiver_id, action_type, action_id, is_read, content, created_at) VALUES
-- Friend request notifications
('notif-001', 'user-002', 'user-001', 'friend_request', 'user-002', TRUE, 'nguyenvanan sent you a friend request', '2024-01-15 09:30:00'),
('notif-002', 'user-003', 'user-001', 'friend_request', 'user-003', TRUE, 'tranthibinh sent you a friend request', '2024-01-16 10:30:00'),
('notif-003', 'user-005', 'user-006', 'friend_request', 'user-005', FALSE, 'phamthidung sent you a friend request', '2024-02-01 12:00:00'),

-- Like notifications
('notif-004', 'user-002', 'user-001', 'like', 'like-001', TRUE, 'nguyenvanan liked your post', '2024-02-01 08:05:00'),
('notif-005', 'user-003', 'user-001', 'like', 'like-002', TRUE, 'tranthibinh liked your post', '2024-02-01 08:10:00'),
('notif-006', 'user-001', 'user-002', 'like', 'like-006', TRUE, 'admin liked your post', '2024-02-01 09:35:00'),

-- Comment notifications
('notif-007', 'user-002', 'user-001', 'comment', 'comment-001', TRUE, 'nguyenvanan commented on your post', '2024-02-01 08:30:00'),
('notif-008', 'user-003', 'user-002', 'comment', 'comment-004', TRUE, 'tranthibinh commented on your post', '2024-02-01 10:00:00'),
('notif-009', 'user-006', 'user-005', 'comment', 'comment-007', FALSE, 'hoangvanem commented on your post', '2024-02-01 14:00:00'),

-- Message notifications
('notif-010', 'user-001', 'user-002', 'message', 'msg-001', TRUE, 'admin sent you a message', '2024-02-01 20:05:00'),
('notif-011', 'user-002', 'user-003', 'message', 'msg-005', TRUE, 'nguyenvanan sent you a message', '2024-02-01 20:35:00'),
('notif-012', 'user-007', 'user-009', 'message', 'msg-020', FALSE, 'vuthiphuong sent you a message', '2024-02-02 16:05:00');

-- Success message
SELECT 'Test data inserted successfully!' as Result;

-- Insert Post_Media (images for posts)
INSERT INTO Post_Media (id, post_id, media_url, media_type, created_at) VALUES
('media-001', 'post-002', 'https://res.cloudinary.com/demo/image/upload/sample.jpg', 'image', '2024-02-01 09:30:00'),
('media-002', 'post-003', 'https://res.cloudinary.com/demo/image/upload/sample2.jpg', 'image', '2024-02-01 10:15:00'),
('media-003', 'post-005', 'https://res.cloudinary.com/demo/image/upload/sample3.jpg', 'image', '2024-02-01 13:20:00'),
('media-004', 'post-006', 'https://res.cloudinary.com/demo/image/upload/sample4.jpg', 'image', '2024-02-01 14:30:00'),
('media-005', 'post-007', 'https://res.cloudinary.com/demo/image/upload/sample5.jpg', 'image', '2024-02-01 15:45:00'),
('media-006', 'post-007', 'https://res.cloudinary.com/demo/image/upload/sample6.jpg', 'image', '2024-02-01 15:45:00'),
('media-007', 'post-008', 'https://res.cloudinary.com/demo/image/upload/sample7.jpg', 'image', '2024-02-01 16:30:00'),
('media-008', 'post-012', 'https://res.cloudinary.com/demo/image/upload/sample8.jpg', 'image', '2024-02-02 10:20:00'),
('media-009', 'post-013', 'https://res.cloudinary.com/demo/image/upload/sample9.jpg', 'image', '2024-02-02 19:45:00'),
('media-010', 'post-013', 'https://res.cloudinary.com/demo/image/upload/sample10.jpg', 'image', '2024-02-02 19:45:00'),
('media-011', 'post-013', 'https://res.cloudinary.com/demo/image/upload/sample11.jpg', 'image', '2024-02-02 19:45:00'),
('media-012', 'post-014', 'https://res.cloudinary.com/demo/image/upload/sample12.jpg', 'image', '2024-02-02 21:30:00');

-- Insert Likes
INSERT INTO Likes (id, post_id, user_id, created_at) VALUES
-- Post 1 likes
('like-001', 'post-001', 'user-002', '2024-02-01 08:05:00'),
('like-002', 'post-001', 'user-003', '2024-02-01 08:10:00'),
('like-003', 'post-001', 'user-004', '2024-02-01 08:15:00'),
('like-004', 'post-001', 'user-005', '2024-02-01 08:20:00'),
('like-005', 'post-001', 'user-006', '2024-02-01 08:25:00'),
-- Post 2 likes
('like-006', 'post-002', 'user-001', '2024-02-01 09:35:00'),
('like-007', 'post-002', 'user-003', '2024-02-01 09:40:00'),
('like-008', 'post-002', 'user-004', '2024-02-01 09:45:00'),
('like-009', 'post-002', 'user-006', '2024-02-01 09:50:00'),
-- Post 5 likes (most popular)
('like-010', 'post-005', 'user-001', '2024-02-01 13:25:00'),
('like-011', 'post-005', 'user-002', '2024-02-01 13:30:00'),
('like-012', 'post-005', 'user-003', '2024-02-01 13:35:00'),
('like-013', 'post-005', 'user-004', '2024-02-01 13:40:00'),
('like-014', 'post-005', 'user-006', '2024-02-01 13:45:00'),
('like-015', 'post-005', 'user-007', '2024-02-01 13:50:00'),
('like-016', 'post-005', 'user-008', '2024-02-01 13:55:00'),
-- Post 6 likes (game post)
('like-017', 'post-006', 'user-001', '2024-02-01 14:35:00'),
('like-018', 'post-006', 'user-002', '2024-02-01 14:40:00'),
('like-019', 'post-006', 'user-004', '2024-02-01 14:45:00'),
('like-020', 'post-006', 'user-007', '2024-02-01 14:50:00'),
('like-021', 'post-006', 'user-010', '2024-02-01 14:55:00'),
-- More likes for other posts
('like-022', 'post-007', 'user-003', '2024-02-01 15:50:00'),
('like-023', 'post-007', 'user-005', '2024-02-01 15:55:00'),
('like-024', 'post-008', 'user-005', '2024-02-01 16:35:00'),
('like-025', 'post-009', 'user-004', '2024-02-01 17:20:00'),
('like-026', 'post-013', 'user-002', '2024-02-02 19:50:00'),
('like-027', 'post-013', 'user-007', '2024-02-02 19:55:00'),
('like-028', 'post-015', 'user-002', '2024-02-03 12:05:00'),
('like-029', 'post-015', 'user-003', '2024-02-03 12:10:00'),
('like-030', 'post-015', 'user-004', '2024-02-03 12:15:00');
