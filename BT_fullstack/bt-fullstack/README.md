# Hệ Thống Quản Lý Học Sinh

Ứng dụng full-stack quản lý học sinh được xây dựng với React, Express và MongoDB.

## Công Nghệ Sử Dụng

### Backend
- **Express.js** - Framework web cho Node.js
- **MongoDB** - Cơ sở dữ liệu NoSQL
- **Mongoose** - ODM cho MongoDB

### Frontend
- **React** - Thư viện JavaScript cho giao diện người dùng
- **Axios** - HTTP client
- **CSS3** - Styling với responsive design

## Cài Đặt

### Yêu Cầu
- Node.js (v14 trở lên)
- MongoDB (đã cài đặt và chạy)
- npm hoặc yarn

### Bước 1: Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend` với nội dung:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_management
NODE_ENV=development
```

### Bước 2: Cài đặt Frontend

```bash
cd frontend
npm install
```

### Bước 3: Khởi động MongoDB

Đảm bảo MongoDB đang chạy trên máy của bạn:
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
# hoặc
mongod
```

## Chạy Ứng Dụng

### Chạy Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### Chạy Frontend

Mở terminal mới:
```bash
cd frontend
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Tính Năng

- ✅ Xem danh sách học sinh
- ✅ Thêm học sinh mới
- ✅ Sửa thông tin học sinh
- ✅ Xóa học sinh
- ✅ Validation form
- ✅ Responsive design
- ✅ Giao diện hiện đại, thân thiện

## Cấu Trúc Dự Án

```
bt-fullstack/
├── backend/
│   ├── models/
│   │   └── Student.js
│   ├── routes/
│   │   └── students.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── StudentList.js
│   │   │   ├── StudentList.css
│   │   │   ├── StudentForm.js
│   │   │   └── StudentForm.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## API Endpoints

### Students
- `GET /api/students` - Lấy tất cả học sinh
- `GET /api/students/:id` - Lấy học sinh theo ID
- `POST /api/students` - Tạo học sinh mới
- `PUT /api/students/:id` - Cập nhật học sinh
- `DELETE /api/students/:id` - Xóa học sinh

## Mô Hình Dữ Liệu

### Student Schema
```javascript
{
  studentId: String (unique, required),
  fullName: String (required),
  dateOfBirth: Date (required),
  gender: String (enum: ['Nam', 'Nữ', 'Khác']),
  class: String (required),
  address: String (required),
  phone: String (required),
  email: String (required),
  gpa: Number (0-10, default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

## Lưu Ý

- Đảm bảo MongoDB đang chạy trước khi khởi động backend
- Kiểm tra port 5000 và 3000 có đang được sử dụng không
- Nếu gặp lỗi CORS, kiểm tra cấu hình trong `backend/server.js`

## Tác Giả

Được tạo cho bài thực hành môn Web Development.

