# Hướng dẫn thiết lập Frontend

## Yêu cầu

- Node.js (v14.0.0 trở lên)
- npm hoặc yarn

## Cài đặt

### Bước 1: Cài đặt các phụ thuộc

Mở terminal và chạy lệnh sau:

```bash
npm install
```

Hoặc nếu bạn sử dụng yarn:

```bash
yarn install
```

### Bước 2: Cấu hình kết nối với Backend

Đảm bảo rằng API URL trong file cấu hình trỏ đến địa chỉ đúng của backend.

Nếu backend không chạy trên cổng mặc định (8080), bạn cần điều chỉnh trong file `.env`:

```
REACT_APP_API_URL=http://localhost:8080/api
```

### Bước 3: Chạy ứng dụng

#### Chế độ phát triển

```bash
npm start
```

Hoặc:

```bash
yarn start
```

Ứng dụng sẽ chạy ở chế độ phát triển tại [http://localhost:3000](http://localhost:3000)

#### Build cho production

```bash
npm run build
```

Hoặc:

```bash
yarn build
```

Kết quả build sẽ được lưu trong thư mục `build/`.

## Cấu trúc thư mục

```
frontend/
├── public/              # Assets tĩnh
│   ├── favicon.ico
│   ├── index.html       # Template HTML gốc
│   └── ...
├── src/                 # Mã nguồn React
│   ├── components/      # Các component tái sử dụng
│   ├── contexts/        # React Context
│   ├── pages/           # Các trang của ứng dụng
│   │   └── users/       # Các trang liên quan đến người dùng
│   ├── styles/          # SCSS styles
│   ├── utils/           # Các tiện ích
│   ├── index.js         # Điểm khởi đầu ứng dụng
│   └── router.js        # Cấu hình routing
├── package.json         # Danh sách phụ thuộc và scripts
└── README.md            # Tài liệu
```

## Tính năng chính

- **Đăng nhập/Đăng ký**: Trang đăng nhập và đăng ký tài khoản
- **Trang chủ**: Hiển thị bảng tin với các bài viết từ bạn bè và người theo dõi
- **Trang cá nhân**: Hiển thị thông tin và bài viết của người dùng
- **Trang bạn bè**: Quản lý kết bạn và theo dõi
- **Trang nhóm**: Tham gia và tương tác trong các nhóm
- **Trang marketplace**: Mua bán sản phẩm
- **Trang watch**: Xem video

## Gỡ lỗi phổ biến

### Lỗi kết nối API
Nếu gặp lỗi kết nối đến API, hãy đảm bảo:
1. Backend đang chạy
2. URL API trong cấu hình frontend đúng
3. Không có vấn đề về CORS

### Lỗi "Module not found"
Nếu gặp lỗi không tìm thấy module:
1. Chạy lại `npm install` để cài đặt các phụ thuộc
2. Kiểm tra tên module trong import có đúng không (phân biệt chữ hoa/thường)

## Liên hệ hỗ trợ

Nếu bạn gặp khó khăn khi thiết lập, vui lòng liên hệ:
- Email: support@group7.example.com
