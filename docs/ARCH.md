# ARCH.md — ARCHITECTURE DOCUMENT

## ARCH-1. System Overview
Hệ thống ImageSnap được xây dựng theo mô hình Modular Feature-based, kết hợp giữa Browser Extension và Web Application (PWA).

- **Frontend**: React + Vite (nằm trong `src/web/`).
- **Backend**: Express + Node.js (File `server.ts`).
- **Storage**: Google Sheets API & Google Drive API [→ BR-1.1].
- **Deployment**: [www.imagesnap.cloud](https://www.imagesnap.cloud) (Railway).

## ARCH-2. Module Structure

### ARCH-2.1 Server Side (`server.ts`)
- **Proxy API**: `/api/proxy-image` giải quyết vấn đề CORS [→ BR-1.1].
- **Centralized Storage Proxy**: `/api/proxy/save-product` cho phép Staff lưu dữ liệu về Drive của Admin mà không cần tài khoản Google riêng [→ BR-1.3].
- **Staff Auth**: `/api/auth/staff-login` hệ thống đăng nhập bằng Username/Password cho nhân viên [→ BR-2.3].
- **Quota Management**: API `/api/increment-usage` và `/api/user-status` [→ BR-2.1].

### ARCH-2.2 Extension (`src/extension/`)
- **Content Script**: Chịu trách nhiệm scraping metadata và phân loại ảnh (MAIN, OTHERS, ICONS) [→ BR-3.1].
- **Image Quality Upgrading**: Logic hàm `upgrade()` tự động gỡ bỏ các tham số resize của Shopee/Alibaba để lấy ảnh độ phân giải cao [→ BR-1.2].
- **Programmatic Injection**: Sử dụng `chrome.scripting` thay vì khai báo permission rộng [→ BR-3.1.2].

### ARCH-2.3 Services & Libs (`src/shared/services/`, `src/shared/lib/`)
- **Product Service**: Điều phối dữ liệu giữa Sheets và Drive [→ BR-1.1].
- **Sheets/Drive Libs**: Abstraction cho Google APIs [→ BR-1.1.1, BR-1.1.2].
- **Thumbnail Handling**: Logic xử lý Drive thumbnail URL [→ BR-1.2.1].
- **Bulk Import Logic**: Xử lý nhận data qua URL parameters [→ BR-3.3].

### ARCH-2.4 UI Components (`src/web/components/`)
- **Capture Tab**: Interface chính để chụp ảnh và trigger extension snap [→ BR-3.2, BR-3.1].
- **Data Tab**: Hiển thị danh sách và chi tiết sản phẩm [→ BR-4.1.2, BR-4.2].
- **Wizard & Landing**: Hỗ trợ onboarding và giới thiệu tính năng.

## ARCH-3. Technology Decisions
- **Vite**: Làm build tool cho cả Web và Extension để đồng nhất workflow.
- **Lemon Squeezy**: Lựa chọn cho payment vì tính đơn giản trong setup global tax/billing [→ BR-2.2.1].
- **ActiveTab Permission**: Lựa chọn tối ưu để pass Chrome Store review nhanh hơn [→ BR-3.1.2].

## ARCH-4. Dependencies
- `@google/genai`: Hỗ trợ các tính năng AI trong tương lai.
- `@lemonsqueezy/lemonsqueezy.js`: SDK chính thức cho thanh toán.
- `sharp`: Xử lý hình ảnh server-side (nếu cần).

## ARCH-5. Technical Debt
- Mock DB trong `server.ts` cần được thay thế bằng Persistent DB nếu lượng user tăng cao.
- Logic sync giữa Extension và Web có thể tối ưu hơn qua BroadcastChannel hoặc Storage Sync.
