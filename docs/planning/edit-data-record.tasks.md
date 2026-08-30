# BATCH edit-data-record: Product Edit — Full implementation

goal: Admin có thể sửa 1 record Product đã lưu trong Data (nút Edit → form prefill → Save ghi đè đúng dòng trong Sheet, không tạo row mới, không đổi ID/createdAt/author/images).
report-to: C:\dev\imagesnap\docs\planning\edit-data-record.report.md
parallel-group: A
rule: chỉ ghi report-to; cấm sửa mọi file khác trong docs/planning/; cấm lập kế hoạch lại

## REALITY-CHECK (chạy trước khi làm bất kỳ task nào)
n/a — batch đầu tiên

## CHECKLIST (thứ tự bắt buộc)
1. T-0014: Thêm nút Edit trên DataProductCard
2. T-0015: Wire onEdit qua DataTab + state edit mode
3. T-0016: Tạo EditProductForm (prefill theo category schema)
4. T-0017: Wire form edit vào DataTab
5. T-0018: updateProduct() trong productService.ts
6. T-0019: handleUpdateProduct trong useAppData.ts
7. T-0020: Route /api/proxy/update-product trong server.ts
8. T-0021: Wire Save trong EditProductForm → handleUpdateProduct
9. T-0022: Test thủ công + đối chiếu must-keep list

## TASK T-0014: Thêm nút Edit trên DataProductCard
muc-tieu: Thêm nút Edit (icon Pencil từ lucide-react) cạnh nút Trash2 hiện có, cả 2 layout (list và grid), chỉ hiện khi isAdmin. Thêm prop `onEdit: (item: Product) => void` vào interface DataProductCardProps.
file-dich: src/web/components/DataProductCard.tsx
huong-dan: |
  1. Import `Pencil` từ 'lucide-react' cùng dòng import Trash2 hiện có.
  2. Thêm `onEdit: (item: Product) => void;` vào interface DataProductCardProps (sau dòng `onDelete`).
  3. Thêm `onEdit` vào destructure props của component.
  4. Trong block `layout === 'grid'`: bên trong `{isAdmin && (...)}` chứa nút Trash2, thêm 1 nút Pencil kế bên (cùng div wrapper hoặc div riêng cạnh nó), onClick={(e) => { e.stopPropagation(); onEdit(item); }}, dùng class tương tự nút Trash2 nhưng hover:text-accent thay vì hover:text-red-500.
  5. Lặp lại y hệt cho block list layout (nút Trash2 thứ 2 ở cuối file, dòng ~97-104).
  6. KHÔNG đổi hành vi onClick(item) hiện có của card (mở detail) — nút Edit phải stopPropagation để không trigger luôn onClick card.
verify-cmd: cd C:\dev\imagesnap && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "DataProductCard" || echo "no DataProductCard errors"
done-definition: File biên dịch không lỗi TypeScript liên quan DataProductCard; grep xác nhận có đúng 2 chỗ gọi onEdit(item) (1 cho grid, 1 cho list) và đều có e.stopPropagation() đứng trước.
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0015: Wire onEdit qua DataTab + state edit mode
muc-tieu: DataTab nhận thêm state `editingProduct` (Product | null), truyền `onEdit={setEditingProduct}` xuống DataProductCard ở cả 2 nơi gọi productGrid, và khi `editingProduct` khác null thì render EditProductForm thay vì luồng bình thường (component sẽ tạo ở T-0016 — tạm thời chỉ cần state + wiring).
file-dich: src/web/components/DataTab.tsx
huong-dan: |
  1. Thêm `const [editingProduct, setEditingProduct] = useState<Product | null>(null);` cạnh state `selectedProduct` hiện có (dòng 28).
  2. Trong hàm `productGrid`, thêm prop `onEdit={setEditingProduct}` vào JSX `<DataProductCard .../>` (dòng 77-78).
  3. Thêm 1 block điều kiện TRƯỚC block `if (selectedProduct) {...}` (dòng 69): `if (editingProduct) { ... render EditProductForm ... }` — nếu EditProductForm chưa tồn tại lúc chạy task này, để comment TODO và tạm return null, rồi hoàn thiện khi làm T-0017 (2 task này có thể gộp thực hiện cùng lúc trong 1 lượt sửa file, miễn done-definition của cả 2 đều đạt).
verify-cmd: cd C:\dev\imagesnap && grep -n "editingProduct" src/web/components/DataTab.tsx
done-definition: grep tìm thấy ít nhất 3 dòng chứa "editingProduct" trong DataTab.tsx (khai báo state, truyền prop onEdit, dùng trong điều kiện render).
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0016: Tạo EditProductForm (prefill theo category schema)
muc-tieu: Tạo component mới `EditProductForm` nhận `product: Product`, `category: Category`, `onSave: (updated: Partial<Product>) => Promise<void>`, `onCancel: () => void`, `t`, `lang`. Render lại đúng field schema của category (tái dùng cấu trúc field-loop giống CaptureForm.tsx/CaptureFormFields.tsx) nhưng KHÔNG có phần search-suggestions dropdown và KHÔNG có phần upload ảnh (ảnh ngoài scope). Form prefill giá trị ban đầu từ `product.data`.
file-dich: src/web/components/EditProductForm.tsx (file mới)
huong-dan: |
  1. Tạo file mới, "use client" ở đầu.
  2. State nội bộ: `const [formData, setFormData] = useState<Record<string, any>>({ ...product.data });`
  3. Render 1 field cho mỗi `category.fields`, dùng cùng input types như CaptureForm.tsx (text/date/url/select), value={formData[field.id] ?? ''}, onChange cập nhật formData[field.id].
  4. Dùng class `.input`, `.label-meta`, `text-ink` giống các form khác trong codebase (tham khảo src/web/components/CaptureFormFields.tsx để đồng bộ style).
  5. Nút Save gọi `onSave({ ...product, data: { ...formData }, name: formData[keyFieldId] || product.name })` trong đó `keyFieldId` là id của field có `type === 'key'` trong category.fields (nếu có).
  6. Nút Cancel gọi `onCancel()`.
  7. Thêm state `isSaving` để disable nút Save khi đang lưu, catch lỗi và hiển thị thông báo lỗi đơn giản.
verify-cmd: cd C:\dev\imagesnap && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "EditProductForm" || echo "no EditProductForm errors"
done-definition: File tồn tại, export component EditProductForm, biên dịch không lỗi TypeScript; grep xác nhận field-loop dùng `category.fields.map` và KHÔNG có logic upload ảnh (không import/dùng bất kỳ hàm liên quan `compressImage`/`uploadBase64Image`).
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0017: Wire form edit vào DataTab
muc-tieu: Hoàn thiện wiring T-0015 — khi `editingProduct` khác null, render `<EditProductForm product={editingProduct} category={cat} onSave={...} onCancel={() => setEditingProduct(null)} t={t} lang={lang} />`, `cat` lấy từ `categories.find(c => c.id === editingProduct.categoryId)`.
file-dich: src/web/components/DataTab.tsx
huong-dan: |
  1. Import `EditProductForm` từ './EditProductForm'.
  2. Trong block điều kiện `if (editingProduct) {...}` đã tạo ở T-0015, render đầy đủ component EditProductForm như mô tả ở muc-tieu.
  3. Prop `onSave` của EditProductForm sẽ được nối với `onUpdate` (prop mới của DataTabProps, thêm `onUpdate: (product: Partial<Product>) => Promise<void>;` vào interface DataTabProps) — gọi `await onUpdate(updated); setEditingProduct(null);`.
  4. KHÔNG tự implement logic update tại đây — chỉ gọi prop `onUpdate` truyền từ ngoài vào (sẽ wire ở T-0021 từ app/dashboard/page.tsx).
verify-cmd: cd C:\dev\imagesnap && grep -n "onUpdate" src/web/components/DataTab.tsx
done-definition: grep tìm thấy `onUpdate` xuất hiện trong interface DataTabProps VÀ trong phần gọi EditProductForm; component biên dịch không lỗi TypeScript.
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0018: updateProduct() trong productService.ts
muc-tieu: Thêm hàm `updateProduct(spreadsheetId, product, categories, providedToken?)` vào productService.ts, dùng `updateRowBySearch` để ghi đè đúng dòng theo `product.id`, GIỮ NGUYÊN createdAt/images/authorId/authorName gốc.
file-dich: src/shared/services/productService.ts
huong-dan: |
  1. Import thêm `updateRowBySearch` từ '../lib/sheets' (cạnh `appendRow, ensureSheetExists, deleteRowBySearch` đã có).
  2. Viết hàm mới: `export async function updateProduct(spreadsheetId: string, product: Product, categories: Category[], providedToken?: string) { ... }` — nhận `product` đầy đủ (bao gồm id, createdAt, images, authorId/authorName gốc — không đổi) và `data` mới đã sửa.
  3. Tìm `cat = categories.find(c => c.id === product.categoryId)`, build `sheetTitle = cat.name.substring(0, 31)`.
  4. Build `fieldValues = cat.fields.map(f => product.data?.[f.id] || '')` giống saveProduct.
  5. Build `row = [product.id, product.createdAt, (product.images||[]).join(','), product.name, (product.tags||[]).join(','), product.authorId || '', product.authorName || '', ...fieldValues]` — thứ tự cột PHẢI khớp chính xác với header đã dùng trong `saveProduct` (dòng 40: `['ID', 'Created At', 'Images', 'Name', 'Tags', 'Author ID', 'Author Name', ...cat.fields.map(f => f.label)]`).
  6. Gọi `await updateRowBySearch(spreadsheetId, sheetTitle, product.id, row, providedToken);`.
  7. Return `{ id: product.id, keyValue: product.name }`.
  8. KHÔNG sửa hàm `saveProduct` hiện có — chỉ thêm hàm mới.
verify-cmd: cd C:\dev\imagesnap && grep -n "export async function updateProduct" src/shared/services/productService.ts && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "productService" || echo "no productService errors"
done-definition: Hàm `updateProduct` tồn tại và export; row array có đúng 7 + số field cột (khớp thứ tự header saveProduct); grep xác nhận `saveProduct` gốc KHÔNG bị sửa nội dung.
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0019: handleUpdateProduct trong useAppData.ts
muc-tieu: Thêm hàm `handleUpdateProduct(product: Product)` vào useAppData.ts, phân nhánh giống `handleSaveProduct`: nếu `isStaff` → gọi API `/api/proxy/update-product`; nếu không → gọi `updateProduct()` trực tiếp. Sau khi xong, gọi `refreshData(spreadsheetId)`. Export hàm này trong return object của hook.
file-dich: src/shared/hooks/useAppData.ts
huong-dan: |
  1. Import `updateProduct` từ '../services/productService' (cạnh `saveProduct, deleteProduct` đã import ở dòng 6).
  2. Viết hàm `const handleUpdateProduct = async (product: Product) => { ... }` đặt ngay sau `handleSaveProduct` (dòng 159), theo cùng cấu trúc try/catch/finally với `setIsSyncing(true/false)`.
  3. Nhánh isStaff: `fetch(${API_BASE_URL}/api/proxy/update-product, { method: 'POST', headers: {...}, body: JSON.stringify({ spreadsheetId, product }) })`, throw Error nếu !res.ok.
  4. Nhánh else: gọi đúng signature đã định nghĩa ở T-0018: `updateProduct(spreadsheetId, product, appData.categories)`.
  5. Cuối cùng `await refreshData(spreadsheetId);` giống handleSaveProduct.
  6. Thêm `handleUpdateProduct,` vào object return của hook (cạnh `handleSaveProduct, handleDeleteProduct,` dòng 212-213).
verify-cmd: cd C:\dev\imagesnap && grep -n "handleUpdateProduct" src/shared/hooks/useAppData.ts && npx tsc --noEmit -p tsconfig.json 2>&1 | grep -i "useAppData" || echo "no useAppData errors"
done-definition: `handleUpdateProduct` tồn tại, có nhánh isStaff/else, được export trong return object; biên dịch không lỗi TypeScript.
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0020: Route /api/proxy/update-product trong server.ts
muc-tieu: Thêm route Express mới `POST /api/proxy/update-product` trong server.ts, mirror logic tìm-dòng-theo-ID + PUT của `updateRowBySearch` (sheets.ts:206), dùng admin token giống route `/api/proxy/save-product` hiện có (dòng 152-170).
file-dich: server.ts
huong-dan: |
  1. Thêm route mới NGAY SAU route `/api/proxy/save-product` (sau dòng 170, trước comment `// --- PAYMENT ROUTES ---`).
  2. Lấy `{ spreadsheetId, product, adminAccessToken }` từ req.body (product phải có `id` và `categoryName`).
  3. Lấy token giống route save-product (`adminAccessToken || masterToken`), 401 nếu thiếu.
  4. Bước 1: GET `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A:A` để tìm rowIndex có giá trị = product.id (sheetTitle = product.categoryName substring 31 ký tự đầu).
  5. Nếu không tìm thấy → trả 404 `{ error: "Row not found" }`.
  6. Bước 2: PUT `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetTitle}!A${rowIndex+1}?valueInputOption=USER_ENTERED` với body `{ values: [Object.values(product)] }`.
  7. try/catch trả lỗi 500 giống route save-product.
verify-cmd: cd C:\dev\imagesnap && grep -n "update-product" server.ts && node --check server.ts
done-definition: Route `/api/proxy/update-product` tồn tại trong server.ts, `node --check server.ts` không báo lỗi cú pháp; route có đủ 2 bước gọi Sheets API.
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0021: Wire Save trong EditProductForm → handleUpdateProduct
muc-tieu: `app/dashboard/page.tsx` truyền `onUpdate={handleUpdateProduct}` xuống DataTab (tương tự cách `onDelete={handleDeleteProduct}` đang được truyền ở dòng 225).
file-dich: app/dashboard/page.tsx
huong-dan: |
  1. Destructure thêm `handleUpdateProduct` từ chỗ đang lấy `handleSaveProduct, handleDeleteProduct` (dòng 103-104).
  2. Thêm prop `onUpdate={handleUpdateProduct}` vào JSX render `<DataTab .../>` (cạnh dòng `onDelete={handleDeleteProduct}` dòng 225).
verify-cmd: cd C:\dev\imagesnap && grep -n "onUpdate={handleUpdateProduct}" app/dashboard/page.tsx
done-definition: grep tìm thấy dòng `onUpdate={handleUpdateProduct}`; toàn bộ chain đã nối liền, biên dịch TypeScript không lỗi.
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## TASK T-0022: Test thủ công + đối chiếu must-keep list
muc-tieu: Xác nhận toàn bộ luồng edit hoạt động đúng và không phá vỡ must-keep list (ID, createdAt, authorId, authorName, images không đổi) và không ảnh hưởng luồng tạo mới hiện có.
file-dich: (không sửa file — chỉ verify, có thể ghi kết quả vào report)
huong-dan: |
  1. Chạy `npx tsc --noEmit -p tsconfig.json` toàn bộ project — xác nhận 0 lỗi TypeScript liên quan các file đã sửa trong batch.
  2. grep xác nhận `saveProduct` (hàm gốc) trong productService.ts KHÔNG bị sửa đổi ngoài việc thêm hàm mới `updateProduct`.
  3. grep xác nhận `deleteProduct` không bị đụng tới.
  4. Đối chiếu must-keep list: grep trong `updateProduct` và route `/api/proxy/update-product` xác nhận row/values được build KHÔNG generate id mới (`Date.now()`), KHÔNG bỏ qua images/authorId/authorName/createdAt.
  5. Nếu có thể chạy dev server: thử tạo 1 product test, sửa nó qua UI mới, xác nhận Sheet chỉ update chứ không tạo row mới — nếu môi trường không cho phép E2E, ghi rõ trong report là verify tĩnh qua grep/tsc.
verify-cmd: cd C:\dev\imagesnap && npx tsc --noEmit -p tsconfig.json && grep -n "prod_${Date.now()}" src/shared/services/productService.ts
done-definition: `npx tsc --noEmit` exit code 0; grep xác nhận `prod_${Date.now()}` CHỈ xuất hiện 1 lần (trong saveProduct); report ghi rõ kết quả đối chiếu must-keep list — PASS hoặc FAIL kèm lý do.
anchor: cập nhật block TASK này trong report NGAY → đọc lại CHECKLIST → sang task kế

## KHI XONG BATCH
1. Điền SUMMARY trong report, batch-status: done (hoặc blocked + lý do).
2. Commit toàn bộ thay đổi:
   git add -A
   git commit -m "feat(edit-data-record): sửa thông tin record trong Data — implemented"
3. DỪNG. Không làm batch kế. Báo user: "chạy validate-execution bên Claude".
