# BR.md — BUSINESS REQUIREMENTS
> NGUỒN SỰ THẬT (Source of Truth) — Cấp độ ưu tiên cao nhất
> Chỉ Product Owner / Tech Lead được sửa file này.
> Mọi thay đổi phải ghi vào CHANGELOG ở cuối file.

---

## BR-1. Core Platform & Storage
### BR-1.1 Data Storage (Google Ecosystem)
**BR-1.1.1** System phải sử dụng Google Sheets làm cơ sở dữ liệu chính cho metadata sản phẩm.
**BR-1.1.2** System phải sử dụng Google Drive làm nơi lưu trữ hình ảnh.
**BR-1.1.3** Hình ảnh trong Drive phải được đặt tên theo format `[Key]-xxx.jpg`.

### BR-1.2 Performance & Optimization
**BR-1.2.1** System phải sử dụng Drive thumbnail API (`sz=w600`) để tăng tốc độ load ảnh trong Data tab.

---

## BR-2. Usage Quota & Monetization
### BR-2.1 Subscription Tiers
**BR-2.1.1** Free Tier: Giới hạn 30 snaps mỗi tháng.
**BR-2.1.2** PRO Tier: Không giới hạn snaps, lifetime access.

### BR-2.2 Payment Integration
**BR-2.2.1** System phải tích hợp Lemon Squeezy (hoặc Stripe) để xử lý thanh toán và nâng cấp tài khoản.
**BR-2.2.2** Trạng thái user (FREE/PRO) và hạn ngạch sử dụng phải được hiển thị realtime trên UI.
**BR-2.3** Admin phải có quyền quản lý danh sách User và phân quyền truy cập Category cho từng User.

---

## BR-3. Image Capture & Scraping
### BR-3.1 Browser Extension (Collector)
**BR-3.1.1** Extension phải có khả năng trích xuất hình ảnh và metadata từ các trang thương mại điện tử.
**BR-3.1.2** Extension phải sử dụng `chrome.scripting` (activeTab) để bảo vệ quyền riêng tư và tối ưu quyền truy cập.

### BR-3.2 Integrated Camera
**BR-3.2.1** Ứng dụng web phải tích hợp camera để chụp ảnh sản phẩm trực tiếp.
**BR-3.2.2** Phải có tính năng review image strip sau khi chụp.

### BR-3.3 Bulk Import
**BR-3.3.1** Hỗ trợ import hàng loạt qua URL hoặc tham số `?import=`.

---

## BR-4. User Experience & Search
### BR-4.1 UI Standards
**BR-4.1.1** Font size tối thiểu 16px cho inputs và 14px cho text phụ để đảm bảo legibility.
**BR-4.1.2** Phải có Data Detail View để xem chi tiết mọi field và gallery ảnh. Click vào thumbnail phải mở link ảnh gốc trên Google Drive.

### BR-4.2 Search & Filtering
**BR-4.2.1** Hỗ trợ search và filter theo Date, Category, Tags, và Author.
**BR-4.2.2** Phải có tính năng filtering realtime theo tên sản phẩm.
 
## BR-4.3 Marketing Variants
**BR-4.3.1** Hỗ trợ 3 biến thể Landing Page truy cập qua `/1`, `/2`, `/3`.
**BR-4.3.2** Nội dung tùy biến (Hero Image/Text) dựa trên variant: Ecommerce, Organization, và Cloud Storage.

---

## BR-5. Compliance & Distribution
### BR-5.1 Chrome Web Store Compliance
**BR-5.1.1** System KHÔNG ĐƯỢC sử dụng remotely hosted code (scripts từ URL bên ngoài). Mọi logic phải được đóng gói cục bộ.
**BR-5.1.2** System phải tuân thủ nguyên tắc "Minimal Permissions", chỉ yêu cầu những quyền thực sự cần thiết (gỡ bỏ `storage` nếu không dùng).

---

## BR-6. Progressive Web App (PWA)
**BR-6.1 Installation**: Ứng dụng phải hỗ trợ cài đặt PWA trên iOS và Android (Add to Home Screen).
**BR-6.2 Web Share Target**: Ứng dụng phải có khả năng nhận hình ảnh chia sẻ từ các ứng dụng khác thông qua Web Share Target API.
    - Lưu trữ dữ liệu chia sẻ tạm thời vào IndexedDB (`ImageSnapSharing`).
    - Gửi tín hiệu realtime qua `BroadcastChannel` sau khi commit dữ liệu.
    - Redirect người dùng về `/dashboard` (Clean URL).
**BR-6.3 Offline Access**: Hỗ trợ Service Worker để đảm bảo tính ổn định của ứng dụng và xử lý dữ liệu chia sẻ.

---

## CHANGELOG
> Mọi thay đổi BR đều ghi ở đây để trace nguyên nhân.

| Date | ID | Loại thay đổi | Nội dung | Author | Impact |
|------|----|---------------|----------|--------|--------|
| 2026-04-27 | BR-1 -> BR-4 | INITIAL | Khởi tạo từ PROJECT_REQUIREMENTS.md | Antigravity | N/A |
| 2026-04-28 | BR-3, BR-5 | UPDATE | Thêm yêu cầu về Burst Mode, Native Camera và tuân thủ Chrome Store | Antigravity | High |
| 2026-05-13 | BR-6 | NEW | Thêm yêu cầu về PWA và Web Share Target cho di động | Antigravity | Medium |
| 2026-05-13 | ARCH-Update | UPDATE | Chuyển đổi toàn bộ kiến trúc sang Next.js App Router (v1.4.x) | Antigravity | High |
| 2026-05-14 | v1.5.1-Fix | HOTFIX | Triển khai Marvin Core Auth (Deterministic Flow) & Latency Sync 18s | Antigravity | Medium |
| 2026-05-14 | v1.5.1-Vercel | UPDATE | Chuyển đổi nền tảng sang Vercel & tối ưu hóa kiến trúc Serverless | Antigravity | High |
| 2026-05-14 | v1.5.6 | UPDATE | Triển khai Intercept-and-Redirect 303 & Chuẩn hóa Versioning | Antigravity | High |
| 2026-05-14 | v1.6.0 | RELEASE | Kiến trúc Đánh chặn Tuyệt đối & UX Guardrails (Offline/Size Check) | Antigravity | High |
| 2026-05-14 | v1.6.1 | RELEASE | Secure Migration (Nuclear Clean) & Deterministic Halt | Antigravity | Critical |
