# Hướng dẫn Test Website Susan Shop

## 🔧 Cách chạy website

### Phương pháp 1: Sử dụng Live Server (Khuyến nghị)
1. Cài đặt extension "Live Server" trong VS Code
2. Right-click vào file `index.html` 
3. Chọn "Open with Live Server"

### Phương pháp 2: Python HTTP Server
```bash
cd /workspace
python3 -m http.server 8000
```
Sau đó mở trình duyệt và truy cập: `http://localhost:8000`

### Phương pháp 3: Mở trực tiếp file
- Mở file `index.html` bằng trình duyệt
- **Lưu ý**: Một số tính năng có thể không hoạt động do CORS policy

## 🧪 Test Page

Mở file `test.html` để kiểm tra các chức năng cơ bản:
- Test load database
- Test đăng nhập
- Test hiển thị sản phẩm

## 👤 Tài khoản test

### Admin
- **Email**: admin@susanshop.com
- **Password**: admin123

### User thường
- **Email**: user@test.com
- **Password**: user123

## 🐛 Debug

1. Mở Developer Tools (F12)
2. Kiểm tra Console tab để xem log
3. Kiểm tra Network tab để xem request

## ✅ Checklist Test

### Trang chủ (index.html)
- [ ] Hiển thị danh mục sản phẩm
- [ ] Hiển thị sản phẩm nổi bật
- [ ] Modal đăng nhập hoạt động
- [ ] Modal đăng ký hoạt động
- [ ] Tìm kiếm hoạt động

### Trang sản phẩm (products.html)
- [ ] Hiển thị danh sách sản phẩm
- [ ] Filter theo danh mục
- [ ] Filter theo giá
- [ ] Pagination hoạt động
- [ ] Thêm vào giỏ hàng

### Trang admin (admin.html)
- [ ] Đăng nhập admin thành công
- [ ] Dashboard hiển thị thống kê
- [ ] Quản lý danh mục
- [ ] Quản lý sản phẩm
- [ ] Quản lý đơn hàng

## 🔍 Các lỗi thường gặp

### 1. Database không load
- **Nguyên nhân**: CORS policy hoặc đường dẫn file sai
- **Giải pháp**: Sử dụng HTTP server thay vì mở file trực tiếp

### 2. Không đăng nhập được
- **Nguyên nhân**: Database chưa load xong
- **Giải pháp**: Đợi một chút rồi thử lại, hoặc refresh trang

### 3. Sản phẩm không hiển thị
- **Nguyên nhân**: JavaScript error hoặc database lỗi
- **Giải pháp**: Kiểm tra Console để xem lỗi cụ thể

## 📱 Test Responsive

Test trên các kích thước màn hình:
- Desktop: > 1024px
- Tablet: 768px - 1024px  
- Mobile: < 768px

## 🚀 Performance

Website được tối ưu cho:
- Fast loading
- Smooth animations
- Responsive design
- Cross-browser compatibility