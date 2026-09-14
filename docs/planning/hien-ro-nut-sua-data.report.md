# Report: hien-ro-nut-sua-data — Batch 1/1

- Date: 2026-09-14
- Status: done
- Tasks: T-0037 (1/1)
- Files changed:
  - `src/web/components/DataProductCard.tsx`: Bỏ `opacity-0 group-hover:opacity-100` ở 2 container nút Edit/Delete (grid layout và list layout), giúp nút luôn hiển thị rõ ràng.

## Verification
- `npm run build`: Pass (Next.js build + Vite extension build hoàn tất thành công 100%, không lỗi TypeScript/ESLint).
