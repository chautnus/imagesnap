# ARCH.md — ARCHITECTURE DOCUMENT (BACKUP v1.10.124)

## ARCH-1. System Overview
Hệ thống ImageSnap được xây dựng theo mô hình Modular Feature-based, kết hợp giữa Browser Extension và Web Application (PWA).

- **Frontend**: Next.js App Router (React 19).
- **Backend**: Next.js API Routes + Integrated Node.js Server.
- **Storage**: Google Sheets API & Google Drive API [→ BR-1.1].
- **Database**: PostgreSQL (Railway) for user metadata and persistence.
- **Deployment**: [www.imagesnap.cloud](https://www.imagesnap.cloud) (Railway).

## ARCH-2. Module Structure

### ARCH-2.1 Next.js App Router (`app/`)
- **Pages**: Landing, Dashboard, Pricing, Blog (Dynamic), Compare (Dynamic), Use Cases (Dynamic).
- **API Routes**: `/api/proxy-image`, `/api/proxy/save-product`, `/api/user-status`, v.v.
- **Middleware/Layout**: Quản lý Auth (GIS) và SEO metadata toàn hệ thống.

### 4. Xác thực & Phục hồi (Marvin Core Edition - v1.5.1)
Hệ thống sử dụng triết lý **Deterministic Termination**:
- **Script Loading**: Hard timeout 10s.
- **User Info API**: Hard timeout 5s (AbortController).
- **UI Sync**: Dashboard recovery timer 18s (đảm bảo bao phủ tổng độ trễ tầng Service).
- **Fail-fast**: Xóa session và redirect ngay khi có lỗi `reject` từ Auth Queue.

### ARCH-2.2 PWA & Service Worker (`public/`)
- **Service Worker (`sw.js`)**: 
    - Xử lý Web Share Target (POST `/share`).
    - Lưu trữ dữ liệu chia sẻ tạm thời vào IndexedDB (`ImageSnapSharing`).
    - Phát tín hiệu qua `BroadcastChannel` và Redirect người dùng về `/dashboard`.
- **Manifest (`manifest.json`)**: Định nghĩa icon, theme và `share_target` configuration.

### ARCH-2.3 Extension (`src/extension/`)
... (giữ nguyên) ...

### ARCH-2.4 Core Services (`src/shared/`)
... (giữ nguyên) ...

## ARCH-3. Technology Decisions
- **Next.js**: Thay thế Vite cho Web để hỗ trợ SSR/SSG tối ưu SEO [→ BR-4.3].
- **IndexedDB**: Sử dụng cho việc lưu trữ tạm thời dữ liệu chia sẻ vì tính ổn định hơn Cache API đối với blobs lớn.
- **Lemon Squeezy**: Lựa chọn cho payment [→ BR-2.2.1].
- **Broad Host Permission (`*://*/*`)**: Đã khôi phục quyền truy cập rộng để đảm bảo tính năng Scraping hoạt động ổn định trên mọi tab mà không cần click icon liên tục (khắc phục giới hạn của activeTab) [→ BR-3.1].

## ARCH-4. Dependencies
- `@google/genai`: Hỗ trợ các tính năng AI trong tương lai.
- `@lemonsqueezy/lemonsqueezy.js`: SDK chính thức cho thanh toán.
- `sharp`: Xử lý hình ảnh server-side (nếu cần).
- `pg`: Client kết nối PostgreSQL.

## ARCH-5. Technical Debt
- Logic sync giữa Extension và Web có thể tối ưu hơn qua BroadcastChannel hoặc Storage Sync.
