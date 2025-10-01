# Hướng dẫn sử dụng Trang Quản trị Susan Shop

## 🔐 Đăng nhập Admin

**Tài khoản Admin:**
- Email: `admin@susanshop.com`
- Password: `admin123`

## 📊 Dashboard

Dashboard hiển thị tổng quan về:
- Tổng số sản phẩm
- Số lượng khách hàng
- Số đơn hàng
- Tổng doanh thu
- Đơn hàng gần đây

## 🏷️ Quản lý Danh mục

### Thêm danh mục mới
1. Vào mục "Quản lý danh mục"
2. Nhấn nút "Thêm danh mục"
3. Nhập tên danh mục
4. Chọn danh mục cha (nếu có)
5. Nhấn "Thêm danh mục"

### Sửa/Xóa danh mục
- **Sửa**: Nhấn nút "Sửa" → Nhập tên mới
- **Xóa**: Nhấn nút "Xóa" → Xác nhận (chỉ xóa được danh mục không có sản phẩm)

## 📦 Quản lý Sản phẩm

### Thêm sản phẩm mới
1. Vào mục "Quản lý sản phẩm"
2. Nhấn nút "Thêm sản phẩm"
3. Điền thông tin:
   - **Tên sản phẩm**: Tên hiển thị của sản phẩm
   - **Danh mục**: Chọn danh mục phù hợp
   - **Mô tả**: Mô tả chi tiết sản phẩm
   - **URL hình ảnh**: Link ảnh sản phẩm
   - **Thông tin phiên bản**:
     - Tên phiên bản (VD: Size M - Màu đỏ)
     - Giá (VND)
     - Số lượng tồn kho
     - URL hình ảnh phiên bản (tùy chọn)
4. Nhấn "Thêm sản phẩm"

### Sửa sản phẩm
1. Nhấn nút "Sửa" tại sản phẩm cần chỉnh sửa
2. Cập nhật thông tin cần thiết
3. Nhấn "Cập nhật sản phẩm"

### Quản lý phiên bản sản phẩm
1. Nhấn nút "Danh sách" (icon list) tại sản phẩm
2. Xem tất cả phiên bản của sản phẩm
3. **Thêm phiên bản mới**: Nhấn "Thêm phiên bản"
4. **Sửa phiên bản**: Nhấn icon "Sửa" → Nhập thông tin mới
5. **Xóa phiên bản**: Nhấn icon "Xóa" → Xác nhận

### Xóa sản phẩm
1. Nhấn nút "Xóa" tại sản phẩm cần xóa
2. Xác nhận xóa (sẽ xóa cả tất cả phiên bản)

## 👥 Quản lý Khách hàng

### Xem danh sách khách hàng
- Hiển thị thông tin: Tên, email, số điện thoại, địa chỉ
- Số đơn hàng và tổng chi tiêu của từng khách hàng

### Sửa thông tin khách hàng
1. Nhấn nút "Sửa" tại khách hàng cần chỉnh sửa
2. Cập nhật thông tin:
   - Họ tên
   - Email
   - Số điện thoại
   - Vai trò (User/Admin)
   - Địa chỉ
   - Mật khẩu mới (tùy chọn)
3. Nhấn "Cập nhật"

### Xem chi tiết khách hàng
- Nhấn nút "Xem" để xem thông tin chi tiết và lịch sử đơn hàng

### Xóa khách hàng
- Nhấn nút "Xóa" → Xác nhận (cẩn thận khi xóa)

## 🛒 Quản lý Đơn hàng

### Xem danh sách đơn hàng
- Hiển thị: ID đơn hàng, khách hàng, ngày đặt, tổng tiền, trạng thái

### Cập nhật trạng thái đơn hàng
1. Nhấn nút "Sửa" tại đơn hàng
2. Chọn trạng thái mới:
   - **Chờ xử lý**: Đơn hàng mới
   - **Đang xử lý**: Đang chuẩn bị hàng
   - **Đang giao hàng**: Đã giao cho shipper
   - **Hoàn thành**: Đã giao thành công
   - **Đã hủy**: Đơn hàng bị hủy
3. Nhấn "Cập nhật"

### Xem chi tiết đơn hàng
- Nhấn nút "Xem" để xem chi tiết sản phẩm trong đơn hàng

## 📈 Thống kê

### Thống kê theo tháng
- Hiển thị số đơn hàng và doanh thu theo từng tháng
- 6 tháng gần nhất

### Sản phẩm bán chạy
- Top 5 sản phẩm có số lượng bán nhiều nhất
- Hiển thị hình ảnh và số lượng đã bán

### Khách hàng VIP
- Top 5 khách hàng chi tiêu nhiều nhất
- Hiển thị tổng số đơn hàng và tổng chi tiêu

## 💡 Mẹo sử dụng

### 1. Quản lý hình ảnh
- Sử dụng URL hình ảnh từ các dịch vụ như:
  - Placeholder: `https://via.placeholder.com/300x300`
  - Unsplash: `https://source.unsplash.com/300x300/?fashion`
  - Hoặc upload lên cloud storage

### 2. Tối ưu hiệu suất
- Thường xuyên kiểm tra và cập nhật tồn kho
- Xóa các sản phẩm không còn bán
- Theo dõi thống kê để đưa ra quyết định kinh doanh

### 3. Bảo mật
- Thay đổi mật khẩu admin định kỳ
- Không chia sẻ thông tin đăng nhập
- Kiểm tra log hoạt động thường xuyên

### 4. Backup dữ liệu
- Dữ liệu được lưu trong localStorage
- Xuất dữ liệu định kỳ để backup
- Kiểm tra tính toàn vẹn dữ liệu

## 🚨 Lưu ý quan trọng

### Xóa dữ liệu
- **Xóa danh mục**: Chỉ xóa được khi không có sản phẩm nào
- **Xóa sản phẩm**: Sẽ xóa tất cả phiên bản của sản phẩm
- **Xóa khách hàng**: Cẩn thận, có thể ảnh hưởng đến đơn hàng

### Validation
- Tất cả trường bắt buộc phải điền đầy đủ
- Email phải đúng định dạng
- Giá và số lượng phải là số dương
- URL hình ảnh phải hợp lệ

### Hiệu suất
- Trang sẽ tự động refresh sau mỗi thao tác
- Dữ liệu được lưu ngay lập tức
- Sử dụng notification để thông báo kết quả

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **Không thể đăng nhập**
   - Kiểm tra email/password
   - Xóa cache trình duyệt
   - Kiểm tra database có tải được không

2. **Không hiển thị dữ liệu**
   - Refresh trang
   - Kiểm tra Console (F12) xem có lỗi không
   - Kiểm tra kết nối mạng

3. **Lỗi khi thêm/sửa**
   - Kiểm tra tất cả trường bắt buộc
   - Kiểm tra định dạng dữ liệu
   - Thử refresh và làm lại

### Liên hệ hỗ trợ
- Email: admin@susanshop.com
- Hotline: 0123 456 789

---

**Chúc bạn quản lý cửa hàng hiệu quả! 🎉**