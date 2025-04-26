# Mạng xã hội - Dự án Capstone Nhóm 7

![Logo](./frontend/public/logo192.png)

## Giới thiệu

Dự án xây dựng mạng xã hội kết nối người dùng, chia sẻ thông tin, hình ảnh và tương tác. Dự án được phát triển bởi Nhóm 7 như một phần của khóa học Capstone.

## Tính năng chính

- Đăng ký và đăng nhập tài khoản
- Tạo và chỉnh sửa hồ sơ cá nhân
- Đăng bài viết (văn bản, hình ảnh)
- Tương tác với bài viết (thích, bình luận)
- Kết bạn và theo dõi người dùng khác
- Tham gia nhóm và tương tác trong nhóm
- Tìm kiếm người dùng, bài viết và nhóm

## Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication

### Frontend
- React.js
- Redux
- SCSS
- Material UI

## Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js (v14.0.0 trở lên)
- MySQL (v5.7 trở lên)
- npm hoặc yarn

### Bước 1: Clone dự án
```bash
git clone https://github.com/yourusername/capstone-group7-social-network.git
cd capstone-group7-social-network
```

### Bước 2: Cài đặt các phụ thuộc cho Backend
```bash
cd backend
npm install
```

### Bước 3: Thiết lập cơ sở dữ liệu

Có hai cách để thiết lập cơ sở dữ liệu:

#### Cách 1: Sử dụng script tự động (Khuyến nghị)
```bash
node setup-database-universal.js
```
Script này sẽ:
- Kiểm tra và cài đặt các gói cần thiết
- Tạo file .env nếu chưa tồn tại
- Hướng dẫn bạn nhập thông tin kết nối MySQL
- Tạo và thiết lập cơ sở dữ liệu

#### Cách 2: Thiết lập thủ công
1. Tạo file `.env` trong thư mục backend với nội dung:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=social_network
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
PORT=8080
NODE_ENV=development
```

2. Chạy script setup database:
```bash
node setup-database.js
```

### Bước 4: Cài đặt các phụ thuộc cho Frontend
```bash
cd ../frontend
npm install
```

### Bước 5: Chạy dự án

#### Chạy Backend
```bash
cd backend
npm start
```
Backend sẽ chạy tại http://localhost:8080

#### Chạy Frontend
```bash
cd frontend
npm start
```
Frontend sẽ chạy tại http://localhost:3000

## Cấu trúc thư mục

```
capstone-group7-social-network/
├── backend/                 # Mã nguồn phía server
│   ├── config/              # Cấu hình ứng dụng
│   ├── controllers/         # Xử lý logic nghiệp vụ
│   ├── middleware/          # Middleware
│   ├── models/              # Models định nghĩa cấu trúc dữ liệu
│   ├── routes/              # Định nghĩa API endpoints
│   └── uploads/             # Thư mục lưu trữ file tải lên
├── database/                # Scripts SQL cho cơ sở dữ liệu
├── frontend/                # Mã nguồn phía client
│   ├── public/              # Assets tĩnh
│   └── src/                 # Mã nguồn React
│       ├── components/      # Các component tái sử dụng
│       ├── contexts/        # Context API
│       ├── pages/           # Các trang của ứng dụng
│       ├── styles/          # SCSS styles
│       └── utils/           # Các tiện ích
└── README.md                # Tài liệu dự án
```

## Phát triển dự án

### Reset database
Nếu bạn muốn reset lại toàn bộ cơ sở dữ liệu:
```bash
cd backend
node reset-database.js
```

### Cập nhật database
Nếu có thay đổi trong cấu trúc database:
```bash
cd backend
node update-database.js
```

## Đóng góp

Nếu bạn muốn đóng góp cho dự án, vui lòng:
1. Fork dự án
2. Tạo nhánh feature mới (`git checkout -b feature/amazing-feature`)
3. Commit thay đổi của bạn (`git commit -m 'Add some amazing feature'`)
4. Push lên nhánh (`git push origin feature/amazing-feature`)
5. Mở Pull Request

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT. Xem thêm tại `LICENSE` để biết thêm thông tin.

## Liên hệ

Nhóm 7 - Capstone Project - Email: group7@example.com