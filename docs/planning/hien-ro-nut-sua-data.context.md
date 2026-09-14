Problem: Nút Sửa (Pencil) trong thẻ dữ liệu tab Data bị ẩn (opacity-0, chỉ hiện khi group-hover), khó thấy/khó bấm đặc biệt trên mobile không có hover thật.
Goal: Nút Sửa luôn hiển thị rõ ràng, không cần hover/tap dò vị trí mới hiện.
Scope IN: src/web/components/DataProductCard.tsx - grid layout (~dòng 41) và list layout (~dòng 107)
Scope OUT: không đổi logic onEdit/onDelete/onClick, không đổi EditProductForm.tsx, không đổi các nút khác
Users: Admin (isAdmin=true) dùng tab Data
Constraints: giữ nguyên style hệ thống (Tailwind, Pencil icon lucide), không phá vỡ hover-scale ảnh
Data & phá hủy: không (chỉ đổi CSS visibility, không đổi/xóa data). Must-keep: onDelete, onClick, onEdit handlers giữ nguyên hành vi.
