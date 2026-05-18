# Hướng dẫn cài đặt và sử dụng ImageSnap trên điện thoại

Chào mừng bạn đến với ImageSnap PWA! Bằng cách cài đặt ứng dụng này lên điện thoại, bạn có thể nhanh chóng lưu lại hình ảnh sản phẩm từ bất kỳ ứng dụng nào khác (Gallery, Shopee, Alibaba, v.v.) chỉ với vài lần chạm.

## 1. Cách cài đặt ứng dụng (PWA)

### Trên iOS (iPhone/iPad)
1. Mở **Safari** và truy cập vào [www.imagesnap.cloud](https://www.imagesnap.cloud).
2. Nhấn vào biểu tượng **Chia sẻ** (hình vuông có mũi tên lên) ở thanh công cụ dưới cùng.
3. Cuộn xuống và chọn **Thêm vào màn hình chính** (Add to Home Screen).
4. Nhấn **Thêm** ở góc trên bên phải. Biểu tượng ImageSnap sẽ xuất hiện trên màn hình điện thoại của bạn.

### Trên Android (Samsung, Google Pixel, Xiaomi, v.v.)
1. Mở **Google Chrome** và truy cập vào [www.imagesnap.cloud](https://www.imagesnap.cloud).
2. Nhấn vào biểu tượng **3 chấm** ở góc trên bên phải.
3. Chọn **Cài đặt ứng dụng** (Install App) hoặc **Thêm vào màn hình chính**.
4. Xác nhận cài đặt. ImageSnap sẽ xuất hiện trong danh sách ứng dụng của bạn.

---

## 2. Cách chia sẻ hình ảnh từ các ứng dụng khác

Sau khi đã cài đặt ImageSnap lên màn hình chính, bạn có thể sử dụng tính năng "Share Target" để lưu ảnh cực nhanh:

1. Mở ứng dụng chứa hình ảnh (ví dụ: **Ảnh/Gallery**, **Google Photos**, hoặc trình duyệt).
2. Chọn một hoặc nhiều hình ảnh bạn muốn lưu.
3. Nhấn biểu tượng **Chia sẻ** của hệ điều hành.
4. Tìm và chọn biểu tượng **ImageSnap** trong danh sách các ứng dụng nhận chia sẻ.
5. ImageSnap sẽ tự động mở ra, tải hình ảnh lên và bạn chỉ cần điền thêm thông tin (nếu cần) rồi nhấn **Lưu**.

---

## 3. Một số lưu ý quan trọng

### ⚠️ Hạn chế trên iOS (iPhone/iPad)
Hiện tại, **Apple (iOS) chưa cho phép** các ứng dụng web (PWA) xuất hiện trong danh sách chia sẻ của hệ thống. 
- **Giải pháp cho iPhone**: Thay vì chia sẻ trực tiếp từ Ảnh, bạn hãy mở ứng dụng **ImageSnap** từ màn hình chính, sau đó nhấn vào nút **GALLERY** hoặc **APP CAMERA** để chọn ảnh.

### ✅ Hỗ trợ tốt trên Android
Tính năng chia sẻ trực tiếp hoạt động tốt trên các dòng máy Android (Samsung, Pixel, Oppo, v.v.) sử dụng trình duyệt Chrome.
- **Yêu cầu**: Bạn phải chọn "Cài đặt ứng dụng" hoặc "Thêm vào màn hình chính" để trình duyệt đăng ký app với hệ thống chia sẻ của điện thoại.

## 4. Các lưu ý khác
- **Đăng nhập**: Bạn cần đăng nhập bằng tài khoản Google trên trình duyệt (Safari/Chrome) trước khi cài đặt hoặc lần đầu mở app để đảm bảo dữ liệu được đồng bộ về Google Sheets của bạn.
- **Quyền truy cập**: Nếu hệ thống hỏi quyền truy cập ảnh hoặc thông báo, hãy chọn "Cho phép" để tính năng hoạt động ổn định nhất.
- **Offline**: ImageSnap hỗ trợ hoạt động ngoại tuyến cơ bản, nhưng bạn cần kết nối mạng để dữ liệu được lưu thành công lên Google Drive và Sheets.

---

## 5. Hướng dẫn xử lý các lỗi hay gặp (Troubleshooting Guide)

Kể từ phiên bản **`v1.10.125`**, ImageSnap đã được nâng cấp hệ thống debug toàn diện và tự động hóa xử lý sự cố. Dưới đây là các lỗi phổ biến và cách khắc phục trực tiếp trên điện thoại của bạn:

### ⚠️ Lỗi 1: Mất Token hoặc Yêu cầu Đăng nhập lại
*   **Triệu chứng:** Bị tự động đá ra màn hình Landing page hoặc không tải được danh sách Drive/Sheets.
*   **Nguyên nhân:** Phiên đăng nhập Google OAuth hết hạn (mặc định sau 1 giờ) hoặc trình duyệt di động tự động xóa/thu hồi Cookies để bảo mật.
*   **Cách khắc phục:** 
    *   Chỉ cần nhấn nút **Đăng nhập Google** một lần nữa để cấp lại quyền truy cập mới.
    *   Hệ thống mới đã tích hợp cơ chế tự động xác thực token trực tiếp với Google Userinfo API trước khi điều hướng, tránh tối đa việc kẹt token rác.

### ⚠️ Lỗi 2: Vòng lặp chuyển hướng vô tận (Endless Login Loop)
*   **Triệu chứng:** Bạn bấm Đăng nhập, trang web liên tục tự động chuyển hướng từ `/` sang `/dashboard` rồi ngược lại vô hạn, nhấp nháy màn hình.
*   **Nguyên nhân:** Cookies session cũ bị hỏng hoặc hết hạn nhưng trình duyệt di động vẫn lưu giữ cache, khiến Middleware Next.js từ chối quyền truy cập nhưng Client vẫn cố chuyển hướng.
*   **Cách khắc phục:**
    1.  Chạm vào nút nổi **`🐛 LOGS`** ở góc dưới bên trái màn hình.
    2.  Nhấn nút **`[UNREG SW]`** để xóa bộ nhớ đệm và hủy đăng ký Service Worker cũ, trang web sẽ tự động reload lại sạch sẽ.
    3.  Nhấn đăng nhập lại. Cơ chế tự dọn dẹp Session (`DELETE /api/auth/session`) trên `v1.10.125` sẽ tự động dọn sạch Cookies hỏng ngay khi phát hiện lỗi, giải quyết triệt để sự cố này.

### ⚠️ Lỗi 3: Không chia sẻ được ảnh (Kẹt màn hình Icon PWA hoặc Preview trống)
*   **Triệu chứng:** Chia sẻ ảnh từ Bộ sưu tập (Gallery) qua ImageSnap nhưng ứng dụng bị treo đứng vô hạn ở màn hình Icon (Splash Screen) của điện thoại, hoặc mở app lên nhưng ảnh preview không xuất hiện.
*   **Nguyên nhân:** Do trình duyệt di động (Chrome/Samsung Internet) đóng băng ứng dụng khi Service Worker xử lý dữ liệu ảnh nặng ở chế độ đồng bộ (sync), hoặc Database IndexedDB gặp xung đột phiên bản.
*   **Cách khắc phục:**
    *   Bản cập nhật mới đã chuyển sang **cơ chế Asynchronous (Xử lý ngầm)**. Màn hình logo điện thoại sẽ biến mất ngay lập tức (dưới 10ms), ứng dụng chuyển nhanh vào Dashboard.
    *   Nếu ảnh chưa nạp lên, mở bảng **`🐛 LOGS`** xem tiến độ xử lý ngầm của Service Worker (bản tin màu xanh dương có tiền tố `[SW]`).
    *   Nếu bị kẹt lâu hơn 5 giây, nhấn nút **`[UNREG SW]`** trên bảng logs để giải phóng tài nguyên hệ thống, sau đó thử chia sẻ lại.

### ⚠️ Lỗi 4: Lỗi im lặng và Không debug được trên điện thoại
*   **Triệu chứng:** Có lỗi xảy ra khiến ứng dụng không hoạt động đúng ý, nhưng màn hình không hiển thị bất kỳ thông báo lỗi nào để gửi cho lập trình viên chẩn đoán.
*   **Nguyên nhân:** Trình duyệt di động cô lập hoàn toàn tiến trình chạy ngầm của Service Worker, không cho phép hiển thị Console Logs thông thường trừ khi kết nối cáp USB với máy tính.
*   **Cách khắc phục cực trực quan:**
    1.  ImageSnap đã tích hợp **DOM-Injected Mobile Debug Console**. Luôn có một nút nổi **`🐛 LOGS`** màu đỏ ở góc dưới bên trái màn hình điện thoại của bạn.
    2.  Chạm vào nút này bất cứ lúc nào (kể cả khi app bị sập trắng trang) để mở bảng điều khiển **Live Mobile Diagnostics**. Bảng này in chi tiết mọi lỗi biên dịch, lỗi cú pháp, lỗi DB, và cả logs chạy ngầm của SW.
    3.  Chỉ cần chạm vào nút **`[COPY]`** ở góc trên bên phải bảng logs để sao chép toàn bộ nhật ký lỗi gửi cho đội kỹ thuật. Chúng tôi sẽ sửa được lỗi cho bạn chỉ trong vài phút!
