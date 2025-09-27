# 📚 StudyFlow

Ứng dụng demo quản lý bài tập (MERN Stack).

## 🚀 Tính năng

- Thêm, sửa, xóa, xem danh sách bài tập
- Lọc theo môn học, phân trang
- Cập nhật trạng thái (pending/done)
- Thống kê số lượng & % hoàn thành theo môn
- Giao diện React hiện đại, kết nối MongoDB Atlas

## 🗂️ Cấu trúc thư mục
```
studyflow/
│
├── server/ # Backend (Node.js + Express + MongoDB)
│ ├── server.js
│ ├── models/
│ │ └── Assignment.js
│ ├── controllers/
│ │ └── assignmentController.js
│ └── routes/
│ └── assignmentRoutes.js
│
├── client/ # Frontend (React + Vite)
│ ├── src/
│ │ ├── App.jsx
│ │ ├── api.js
│ │ ├── components/
│ │ │ ├── AssignmentForm.jsx
│ │ │ ├── AssignmentList.jsx
│ │ │ └── StatsChart.jsx
│ │ └── styles/
│ │ ├── App.css
│ │ ├── AssignmentForm.css
│ │ ├── AssignmentList.css
│ │ └── StatsChart.css
│
└── README.md
```

## ⚙️ Cài đặt & chạy

### 1. Backend (server)

cd server
npm install
Tạo file .env trong thư mục server:


MONGO_URI=mongodb+srv://<user>:<pass>@cluster/dbname
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
Chạy server:

npm start
Server mặc định chạy tại: http://localhost:5000

### 2. Frontend (client)

cd client
npm install
npm run dev
Frontend mặc định chạy tại: http://localhost:5173

### 📡 API chính
Method	Endpoint	Mô tả
GET	/api/assignments	Lấy danh sách (lọc, phân trang)
GET	/api/assignments/:id	Lấy chi tiết 1 bài tập
POST	/api/assignments	Thêm bài tập
PUT	/api/assignments/:id	Cập nhật bài tập
DELETE	/api/assignments/:id	Xóa bài tập
GET	/api/assignments/stats	Lấy thống kê theo môn

### 🖼️ Giao diện
Form thêm bài tập

Danh sách bài tập có sửa/xóa

Thống kê theo môn học

### 📌 Ghi chú
Cần cài Node.js >= 18

MongoDB: có thể dùng MongoDB Atlas hoặc local

Deploy:

BE có thể lên Render hoặc Railway

FE có thể lên Vercel

### 👨‍💻 Tác giả
https://github.com/vuthanhdat041
