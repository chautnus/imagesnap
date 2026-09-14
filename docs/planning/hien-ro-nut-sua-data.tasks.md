Story US-012: As an admin, I want to always see the edit button on a data card so that I can edit it without hunting for a hidden control.

| ID | Task | Story | Estimate | Priority | Deps | Status |
|----|------|-------|----------|----------|------|--------|
| T-0037 | Bỏ `opacity-0 group-hover:opacity-100` trên nút Sửa (Pencil) trong DataProductCard.tsx, cả grid layout (~dòng 41) và list layout (~dòng 107) — luôn hiển thị nút, giữ style hiện có (bg-white/90, border, shadow) | US-012 | 1h | P0 | none | todo |

Done-definition T-0037:
- Nút Sửa hiển thị mặc định (không cần hover) ở cả grid và list layout, không còn phụ thuộc opacity-0/group-hover cho riêng nút Edit.
- Không đổi hành vi onClick/onEdit/onDelete.
- Không đổi nút khác (ví dụ nút Delete nếu có trong cùng group) trừ khi cùng bị ẩn bởi opacity-0 và cần hiện theo yêu cầu.
- Visual verify: chạy `npm run build` (hoặc dev server) và xác nhận component render không lỗi TypeScript/ESLint.
