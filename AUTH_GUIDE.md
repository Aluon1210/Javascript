# Hướng dẫn Đăng nhập/Đăng ký - Susan Shop

## 🔐 Hệ thống xác thực mới

Website Susan Shop đã được cập nhật với hệ thống đăng nhập/đăng ký riêng biệt, tách biệt hoàn toàn giữa người dùng thường và admin.

## 📄 Các trang mới

### 1. Trang đăng nhập (`login.html`)
- Giao diện hiện đại với gradient background
- Form đăng nhập với validation
- Tài khoản demo có sẵn
- Chuyển hướng tự động theo role

### 2. Trang đăng ký (`register.html`)
- Form đăng ký đầy đủ thông tin
- Validation mạnh mẽ
- Xác nhận mật khẩu
- Đồng ý điều khoản

## 👤 Tài khoản Demo

### Admin
- **Email**: `admin@susanshop.com`
- **Password**: `admin123`
- **Chuyển hướng**: Tự động đến `admin.html`

### User thường
- **Email**: `user@test.com`
- **Password**: `user123`
- **Chuyển hướng**: Tự động đến `index.html`

## 🚀 Tính năng mới

### Đăng nhập
- ✅ Validation email và password
- ✅ Hiển thị loading spinner
- ✅ Thông báo lỗi chi tiết
- ✅ Ghi nhớ đăng nhập
- ✅ Tài khoản demo nhanh
- ✅ Chuyển hướng theo role

### Đăng ký
- ✅ Form đầy đủ thông tin
- ✅ Validation tất cả fields
- ✅ Kiểm tra email trùng lặp
- ✅ Xác nhận mật khẩu
- ✅ Đồng ý điều khoản
- ✅ Tự động chuyển đến login

### User Menu
- ✅ Dropdown menu đẹp
- ✅ Hiển thị thông tin user
- ✅ Link đến admin (nếu là admin)
- ✅ Đăng xuất

## 🔧 Cách sử dụng

### 1. Đăng nhập
1. Truy cập `login.html`
2. Nhập email và password
3. Hoặc click "Điền tự động" cho demo
4. Click "Đăng nhập"
5. Tự động chuyển hướng theo role

### 2. Đăng ký
1. Truy cập `register.html`
2. Điền đầy đủ thông tin
3. Xác nhận mật khẩu
4. Đồng ý điều khoản
5. Click "Đăng ký"
6. Tự động chuyển đến login

### 3. Quản lý session
- Thông tin user lưu trong localStorage
- Tự động check login khi load trang
- Dropdown menu khi đã đăng nhập
- Đăng xuất xóa session

## 🎨 Giao diện

### Design mới
- **Modern UI**: Gradient background đẹp mắt
- **Card layout**: Form trong card bo tròn
- **Icons**: Font Awesome icons
- **Animation**: Smooth transitions
- **Responsive**: Tương thích mobile

### Colors
- **Primary**: `#667eea` → `#764ba2`
- **Success**: `#28a745`
- **Error**: `#dc3545`
- **Warning**: `#ffc107`
- **Info**: `#17a2b8`

## 🔒 Bảo mật

### Validation
- Email format check
- Phone number format
- Password minimum 6 chars
- Required fields check
- Confirm password match

### Session Management
- localStorage for persistence
- Auto logout on invalid session
- Role-based access control
- Secure password handling

## 🚨 Xử lý lỗi

### Lỗi thường gặp
1. **Email không hợp lệ**
   - Kiểm tra format email
   - Phải có @ và domain

2. **Mật khẩu không khớp**
   - Kiểm tra confirm password
   - Phải giống nhau

3. **Email đã tồn tại**
   - Thử email khác
   - Hoặc đăng nhập

4. **Thiếu thông tin**
   - Điền đầy đủ các trường bắt buộc
   - Đánh dấu * là required

## 📱 Responsive Design

### Mobile
- Form stack vertically
- Touch-friendly buttons
- Readable font sizes
- Proper spacing

### Tablet
- Balanced layout
- Demo accounts sidebar
- Good proportions

### Desktop
- Side-by-side layout
- Demo accounts panel
- Full features

## 🔄 Flow người dùng

### User thường
1. `index.html` → Click "Đăng nhập"
2. `login.html` → Đăng nhập thành công
3. `index.html` → Mua sắm bình thường
4. User menu → Xem profile, đơn hàng, đăng xuất

### Admin
1. `login.html` → Đăng nhập admin
2. `admin.html` → Quản trị hệ thống
3. User menu → Quay về trang chủ hoặc đăng xuất

## 💡 Tips sử dụng

### 1. Demo nhanh
- Sử dụng nút "Điền tự động"
- Không cần nhập thủ công
- Test nhanh các tính năng

### 2. Ghi nhớ đăng nhập
- Check "Ghi nhớ đăng nhập"
- Không cần đăng nhập lại
- Tự động restore session

### 3. Chuyển đổi role
- Admin có thể về trang user
- User không thể vào admin
- Rõ ràng phân quyền

## 🛠️ Technical Details

### Files mới
- `login.html` - Trang đăng nhập
- `register.html` - Trang đăng ký  
- `css/auth.css` - Styles cho auth
- `js/auth.js` - Logic xác thực
- `AUTH_GUIDE.md` - Hướng dẫn này

### Dependencies
- Font Awesome 6.0.0
- Vanilla JavaScript
- CSS3 animations
- LocalStorage API

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🐛 Troubleshooting

### Không đăng nhập được
1. Kiểm tra email/password
2. Xem Console (F12) có lỗi không
3. Clear localStorage và thử lại
4. Refresh trang

### Không chuyển hướng
1. Kiểm tra JavaScript enabled
2. Xem Network tab có load được không
3. Thử hard refresh (Ctrl+F5)

### Giao diện bị lỗi
1. Kiểm tra CSS load được không
2. Clear cache trình duyệt
3. Thử trình duyệt khác

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra Console errors
2. Thử các bước troubleshooting
3. Liên hệ support

---

**Chúc bạn sử dụng hệ thống mới hiệu quả! 🎉**