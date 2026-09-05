---
name: extension-google-auth-parity-arch
description: Quyết định kiến trúc cho F-004 — extension OAuth code flow + chrome.cookies thay vì SameSite=none hoặc bearer token riêng
metadata:
  type: project
---

Feature: F-004 (extension-google-auth-parity)
ADR-003 (amends ADR-001): Extension đổi response_type=token → code, tái dùng
exchange-code/refresh-token endpoint của PWA. Vấn đề cookie cross-origin
(SameSite=Lax không gửi kèm cross-site fetch từ chrome-extension://) giải quyết
bằng chrome.cookies API (đọc cookie httpOnly, gắn header X-Imagesnap-Session) —
KHÔNG nới SameSite (tránh ảnh hưởng bảo mật web/PWA), KHÔNG tạo bearer token
riêng (tránh trùng lặp logic session).
Root cause phụ: src/web/main.tsx/App.tsx/AppDashboard.tsx/hooks/useAuthFlow.ts
bị xóa nhầm ở 7d8b7d7 khi dọn dead code Vite SPA cho PWA — build:ext đã fail
từ 2026-08-24, cần phục hồi trước khi làm auth mới.
