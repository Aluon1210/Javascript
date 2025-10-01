# Susan Shop - Website Bán Hàng

Đây là một website bán hàng hoàn chỉnh được xây dựng bằng HTML, CSS, JavaScript và JSON database theo yêu cầu assignment.

## 🚀 Tính năng chính

### Phần Member (Khách hàng)
- ✅ Xem danh sách sản phẩm
- ✅ Xem sản phẩm theo danh mục  
- ✅ Đăng ký tài khoản
- ✅ Đăng nhập
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Lọc sản phẩm theo khoảng giá, theo danh mục
- ✅ Thanh toán giỏ hàng
- ✅ Hiển thị màn hình cảm ơn sau khi thanh toán thành công

### Trang Quản Trị (Admin)
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý sản phẩm
- ✅ Quản lý khách hàng
- ✅ Quản lý đơn hàng
- ✅ Thống kê doanh thu, sản phẩm bán chạy, khách hàng VIP

## 📁 Cấu trúc thư mục

```
/workspace/
├── index.html              # Trang chủ
├── products.html           # Trang danh sách sản phẩm
├── categories.html         # Trang danh mục
├── contact.html           # Trang liên hệ
├── admin.html             # Trang quản trị
├── css/
│   ├── style.css          # CSS chính
│   └── admin.css          # CSS cho trang admin
├── js/
│   ├── app.js             # JavaScript chính
│   ├── products.js        # JavaScript cho trang sản phẩm
│   └── admin.js           # JavaScript cho trang admin
├── data/
│   └── database.json      # Cơ sở dữ liệu JSON
└── README.md              # File hướng dẫn
```

## 🗄️ Cấu trúc Database (JSON)

### Categories (Danh mục)
```json
{
  "id": 1,
  "name": "Thời trang nữ",
  "parent_id": null
}
```

### Products (Sản phẩm)
```json
{
  "id": 1,
  "name": "Áo sơ mi trắng công sở",
  "cate_id": 4,
  "detail": "Mô tả sản phẩm...",
  "image": "URL_hình_ảnh"
}
```

### Product Variants (Phiên bản sản phẩm)
```json
{
  "id": 1,
  "product_id": 1,
  "variant_name": "Size S - Trắng",
  "price": 299000,
  "quantity": 50,
  "image": "URL_hình_ảnh"
}
```

### Users (Người dùng)
```json
{
  "id": 1,
  "name": "Nguyễn Văn A",
  "email": "user@example.com",
  "phone": "0123456789",
  "address": "Địa chỉ...",
  "password": "password",
  "role": "user" // hoặc "admin"
}
```

### Orders (Đơn hàng)
```json
{
  "id": 1,
  "user_id": 2,
  "created_date": "2025-01-01T10:30:00Z",
  "status": "completed",
  "total_amount": 748000
}
```

### Order Details (Chi tiết đơn hàng)
```json
{
  "id": 1,
  "order_id": 1,
  "product_id": 1,
  "variant_id": 1,
  "quantity": 1,
  "unit_price": 299000
}
```

## 🚀 Cách chạy website

1. **Tải về hoặc clone project**
2. **Mở file `index.html` bằng trình duyệt web**
3. **Hoặc sử dụng Live Server trong VS Code**

## 👤 Tài khoản mẫu

### Admin
- **Email**: admin@susanshop.com
- **Password**: admin123

### User
- **Email**: lan@gmail.com  
- **Password**: user123

## 🎨 Tính năng nổi bật

### Giao diện
- ✨ Thiết kế hiện đại, responsive
- 🎨 Gradient màu sắc đẹp mắt
- 📱 Tương thích mobile, tablet
- 🔄 Animations mượt mà

### Chức năng
- 🔍 Tìm kiếm sản phẩm
- 🏷️ Lọc theo danh mục và giá
- 🛒 Giỏ hàng với localStorage
- 📊 Dashboard admin với thống kê
- 💳 Quy trình thanh toán hoàn chỉnh

### Công nghệ
- 📄 HTML5 semantic
- 🎨 CSS3 với Flexbox/Grid
- ⚡ Vanilla JavaScript (ES6+)
- 📊 JSON database
- 💾 LocalStorage cho session

## 📱 Responsive Design

Website được thiết kế responsive hoàn toàn:
- **Desktop**: Hiển thị đầy đủ tính năng
- **Tablet**: Layout tối ưu cho màn hình vừa
- **Mobile**: Giao diện thân thiện với điện thoại

## 🔧 Tùy chỉnh

### Thêm sản phẩm mới
1. Truy cập trang admin
2. Vào mục "Quản lý sản phẩm"
3. Nhấn "Thêm sản phẩm"

### Thay đổi giao diện
- Chỉnh sửa file `css/style.css`
- Thay đổi màu sắc trong CSS variables
- Tùy chỉnh layout trong HTML

### Mở rộng database
- Chỉnh sửa file `data/database.json`
- Thêm fields mới vào các bảng
- Cập nhật JavaScript để xử lý dữ liệu mới

## 🐛 Xử lý lỗi

### Lỗi thường gặp
1. **Database không load**: Kiểm tra đường dẫn file JSON
2. **LocalStorage bị xóa**: Dữ liệu giỏ hàng sẽ mất
3. **CORS error**: Chạy qua HTTP server thay vì file://

### Debug
- Mở Developer Tools (F12)
- Kiểm tra Console tab để xem lỗi
- Kiểm tra Network tab để xem request

## 📈 Tối ưu hóa

### Performance
- Lazy loading cho hình ảnh
- Minify CSS/JS cho production
- Optimize hình ảnh

### SEO
- Thêm meta tags
- Structured data
- Sitemap.xml

## 🤝 Đóng góp

Để đóng góp vào project:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

Dự án này được tạo cho mục đích học tập và assignment.

## 📞 Liên hệ

Nếu có thắc mắc về project, vui lòng liên hệ qua:
- Email: support@susanshop.com
- Phone: 0123 456 789

---

**Susan Shop** - Cửa hàng thời trang trực tuyến hiện đại 🛍️