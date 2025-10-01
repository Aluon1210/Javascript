# Hướng dẫn Trang Hồ sơ & Giỏ hàng - Susan Shop

## 👤 Trang Thông tin Hồ sơ (`profile.html`)

### 🎯 Tính năng chính

#### 📋 **Thông tin cá nhân**
- ✅ Hiển thị đầy đủ thông tin: Tên, Email, SĐT, Địa chỉ
- ✅ Chế độ chỉnh sửa với nút "Chỉnh sửa"
- ✅ Validation form khi cập nhật
- ✅ Lưu thay đổi vào database và localStorage
- ✅ Ngày sinh, giới tính, ngày tham gia

#### 🛍️ **Đơn hàng của tôi**
- ✅ Hiển thị tất cả đơn hàng của user
- ✅ Lọc theo trạng thái đơn hàng
- ✅ Chi tiết sản phẩm trong từng đơn
- ✅ Trạng thái đơn hàng với màu sắc phân biệt
- ✅ Tổng tiền từng đơn hàng

#### 📍 **Địa chỉ giao hàng**
- ✅ Quản lý nhiều địa chỉ
- ✅ Đặt địa chỉ mặc định
- ✅ Thêm/sửa/xóa địa chỉ
- ✅ Hiển thị địa chỉ mặc định

#### 🔒 **Bảo mật**
- ✅ Đổi mật khẩu với validation
- ✅ Xác thực mật khẩu hiện tại
- ✅ Các tính năng bảo mật khác (đang phát triển)

### 🎨 **Giao diện**
- **Sidebar navigation**: Menu dọc với icons đẹp
- **Tab system**: Chuyển đổi giữa các phần
- **Edit mode**: Toggle giữa xem và chỉnh sửa
- **Responsive**: Tương thích mobile/tablet
- **Modern design**: Card layout với shadows

### 🚀 **Cách sử dụng**

#### 1. **Truy cập trang hồ sơ**
```
Cách 1: Click vào tên user → "Thông tin cá nhân"
Cách 2: Truy cập trực tiếp: profile.html
```

#### 2. **Chỉnh sửa thông tin**
1. Click nút "Chỉnh sửa"
2. Cập nhật thông tin cần thiết
3. Click "Lưu thay đổi"
4. Hoặc "Hủy" để không lưu

#### 3. **Xem đơn hàng**
1. Click tab "Đơn hàng của tôi"
2. Lọc theo trạng thái nếu cần
3. Xem chi tiết từng đơn hàng

#### 4. **Đổi mật khẩu**
1. Vào tab "Bảo mật"
2. Click "Đổi mật khẩu"
3. Nhập mật khẩu hiện tại và mật khẩu mới
4. Xác nhận thay đổi

---

## 🛒 Trang Giỏ hàng (`cart.html`)

### 🎯 **Tính năng chính**

#### 🛍️ **Quản lý giỏ hàng**
- ✅ Hiển thị tất cả sản phẩm trong giỏ
- ✅ Cập nhật số lượng (+/-)
- ✅ Xóa từng sản phẩm
- ✅ Xóa tất cả sản phẩm
- ✅ Tính tổng tiền tự động

#### 💰 **Tóm tắt đơn hàng**
- ✅ Tạm tính, phí vận chuyển, giảm giá
- ✅ Tổng cộng cuối cùng
- ✅ Miễn phí ship từ 500k
- ✅ Mã giảm giá demo

#### 🎁 **Sản phẩm gợi ý**
- ✅ Hiển thị sản phẩm liên quan
- ✅ Thêm nhanh vào giỏ hàng
- ✅ Xem chi tiết sản phẩm

#### 💳 **Thanh toán**
- ✅ Kiểm tra đăng nhập
- ✅ Tạo đơn hàng tự động
- ✅ Cập nhật tồn kho
- ✅ Trang cảm ơn sau thanh toán

### 🎨 **Giao diện**
- **Progress steps**: Hiển thị bước thanh toán
- **Grid layout**: Giỏ hàng + sidebar tóm tắt
- **Empty state**: Thông báo khi giỏ hàng trống
- **Product cards**: Hiển thị đẹp từng sản phẩm
- **Responsive**: Tối ưu cho mọi thiết bị

### 🚀 **Cách sử dụng**

#### 1. **Truy cập giỏ hàng**
```
Cách 1: Click nút "Giỏ hàng" trên header
Cách 2: Truy cập trực tiếp: cart.html
Cách 3: Sau khi thêm sản phẩm
```

#### 2. **Quản lý sản phẩm**
- **Tăng/giảm số lượng**: Dùng nút +/-
- **Xóa sản phẩm**: Click nút "Xóa"
- **Xóa tất cả**: Click "Xóa tất cả"

#### 3. **Áp dụng mã giảm giá**
```
Mã demo có sẵn:
- WELCOME10: Giảm 10% (đơn từ 200k)
- SAVE50K: Giảm 50k (đơn từ 500k)  
- FREESHIP: Miễn phí ship
```

#### 4. **Thanh toán**
1. Kiểm tra thông tin đơn hàng
2. Click "Tiến hành thanh toán"
3. Hệ thống tự động tạo đơn hàng
4. Hiển thị trang cảm ơn

---

## 🔗 **Tích hợp với hệ thống**

### 📱 **Navigation**
- Header buttons chuyển đến trang riêng
- User dropdown menu có link đến profile
- Breadcrumb navigation rõ ràng

### 💾 **Data Management**
- Đồng bộ với localStorage
- Cập nhật database real-time
- Session management

### 🔄 **User Flow**
```
1. User đăng nhập
2. Thêm sản phẩm vào giỏ → cart.html
3. Xem thông tin cá nhân → profile.html
4. Quản lý đơn hàng trong profile
5. Thanh toán → Trang cảm ơn
```

---

## 🎨 **Design System**

### 🎨 **Colors**
- **Primary**: `#667eea` → `#764ba2`
- **Success**: `#28a745`
- **Danger**: `#dc3545`
- **Warning**: `#ffc107`
- **Info**: `#17a2b8`

### 📐 **Layout**
- **Profile**: Sidebar + Main content
- **Cart**: Main content + Sidebar summary
- **Responsive breakpoints**: 768px, 480px

### 🎭 **Components**
- **Cards**: Border-radius 15px, box-shadow
- **Buttons**: Gradient, hover effects
- **Forms**: Floating labels, validation
- **Modals**: Backdrop blur, animations

---

## 📱 **Responsive Design**

### 💻 **Desktop (>768px)**
- Full sidebar navigation
- Grid layout với 2 cột
- Hover effects đầy đủ

### 📱 **Tablet (768px)**
- Sidebar collapse thành tabs
- Single column layout
- Touch-friendly buttons

### 📱 **Mobile (<480px)**
- Stack layout
- Full-width components
- Optimized for thumb navigation

---

## 🔧 **Technical Details**

### 📁 **Files Structure**
```
profile.html          # Trang hồ sơ cá nhân
cart.html             # Trang giỏ hàng
css/profile.css       # Styles cho profile
css/cart.css          # Styles cho cart
js/profile.js         # Logic cho profile
js/cart.js            # Logic cho cart
```

### 🔌 **Dependencies**
- Font Awesome 6.0.0 (icons)
- Vanilla JavaScript (no frameworks)
- CSS Grid & Flexbox
- LocalStorage API

### 🌐 **Browser Support**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

## 🐛 **Troubleshooting**

### ❌ **Lỗi thường gặp**

#### 1. **Không hiển thị thông tin**
- Kiểm tra đã đăng nhập chưa
- Clear localStorage và đăng nhập lại
- Refresh trang

#### 2. **Không cập nhật được thông tin**
- Kiểm tra validation form
- Xem Console có lỗi JavaScript không
- Thử disable extensions

#### 3. **Giỏ hàng trống**
- Kiểm tra localStorage có data không
- Thử thêm sản phẩm lại
- Clear cache trình duyệt

#### 4. **Không thanh toán được**
- Đảm bảo đã đăng nhập
- Kiểm tra giỏ hàng có sản phẩm không
- Xem Network tab có lỗi API không

### 🔍 **Debug Steps**
1. Mở Developer Tools (F12)
2. Kiểm tra Console tab
3. Xem localStorage data
4. Check Network requests
5. Validate form inputs

---

## 💡 **Tips & Best Practices**

### 👤 **Profile Page**
- Cập nhật thông tin đầy đủ để dễ giao hàng
- Đổi mật khẩu định kỳ
- Kiểm tra đơn hàng thường xuyên

### 🛒 **Cart Page**
- Kiểm tra kỹ sản phẩm trước khi thanh toán
- Sử dụng mã giảm giá khi có
- Mua từ 500k để được free ship

### 🔒 **Security**
- Không chia sẻ thông tin đăng nhập
- Đăng xuất sau khi sử dụng
- Cập nhật thông tin khi thay đổi

---

## 🚀 **Future Enhancements**

### 📋 **Profile**
- [ ] Upload avatar
- [ ] Wishlist management
- [ ] Order tracking
- [ ] Review & rating history

### 🛒 **Cart**
- [ ] Save for later
- [ ] Multiple payment methods
- [ ] Shipping calculator
- [ ] Product comparison

### 🔧 **Technical**
- [ ] Real-time notifications
- [ ] Offline support
- [ ] Performance optimization
- [ ] A/B testing

---

**Chúc bạn sử dụng hiệu quả! 🎉**