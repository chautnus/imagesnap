---
id: proj_vercel_env_audit_20260807
type: project
title: "Vercel env audit — LEMON_SQUEEZY_STORE_ID missing, APP_URL vs NEXT_PUBLIC_APP_URL lệch tên"
tags: [env-vars, vercel, lemon-squeezy, checkout, tech-debt]
keywords: [LEMON_SQUEEZY_STORE_ID, APP_URL, NEXT_PUBLIC_APP_URL, create-checkout-session, vercel env ls]
status: active
created: 2026-08-07
updated: 2026-08-07
summary: "Rà soát Vercel env (project imagesnap) đối chiếu process.env.* trong code sau khi triển khai F-001. Phát hiện 2 lệch ở luồng Lemon Squeezy checkout, user quyết định để nguyên."
---

## Why

Sau khi triển khai F-001 (Google Refresh Token Auth) và tự thêm `GOOGLE_CLIENT_SECRET`
+ `AUTH_ENCRYPTION_KEY` vào Vercel, đã chạy `vercel env ls production` đối chiếu
toàn bộ `process.env.*` trong code (`grep -rn "process\.env\."`) để đảm bảo không có
biến nào code cần mà Vercel thiếu. Việc rà soát phát sinh ngoài scope F-001 nhưng
phát hiện 2 điểm lệch ở luồng thanh toán Lemon Squeezy.

## What

1. **`LEMON_SQUEEZY_STORE_ID` — thiếu trên Vercel.**
   `app/api/create-checkout-session/route.ts:12` đọc
   `process.env.LEMON_SQUEEZY_STORE_ID` **không có fallback**. Vercel
   (`chautnus-projects/imagesnap`, kiểm tra 2026-08-07) chỉ có
   `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_VARIANT_ID`,
   `LEMON_SQUEEZY_WEBHOOK_SECRET` — không có `LEMON_SQUEEZY_STORE_ID`.
   Nếu biến thật sự thiếu ở production, `storeId` sẽ là `undefined` khi tạo
   checkout session → có thể lỗi thanh toán.

2. **`APP_URL` vs `NEXT_PUBLIC_APP_URL` — tên lệch, biến "chết" trên Vercel.**
   `app/api/create-checkout-session/route.ts:22` đọc `process.env.APP_URL` (có
   fallback hardcode `https://www.imagesnap.cloud` nên không vỡ), nhưng Vercel
   chỉ có `NEXT_PUBLIC_APP_URL` — code hiện tại không đọc biến này ở đâu cả.

User (2026-08-07) quyết định **để nguyên, không sửa** — checkout hiện vẫn chạy
ổn (có thể do Lemon Squeezy đã tự suy ra store từ API key, hoặc route này ít
được gọi thực tế).

## How to apply

- Nếu sau này có báo lỗi checkout Lemon Squeezy (đặc biệt lỗi liên quan store/redirect
  URL) → kiểm tra 2 điểm trên đầu tiên, không cần điều tra lại từ đầu.
- Nếu ai đó dọn env vars trên Vercel (xoá biến "không dùng") → **giữ lại**
  `NEXT_PUBLIC_APP_URL` cho tới khi xác nhận rõ không còn chỗ nào cần, hoặc đổi
  code sang đọc đúng tên này thay vì `APP_URL`.
- Không nằm trong roadmap nào hiện tại — chỉ là ghi nhận để tránh lặp lại công
  sức điều tra.
