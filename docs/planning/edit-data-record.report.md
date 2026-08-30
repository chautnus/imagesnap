# REPORT: edit-data-record

## BATCH 1 (Product Edit — Full implementation)
batch-status: done
started: 2026-08-29
finished: 2026-08-29

### REALITY-CHECK
- status: pass
- verified-at: 2026-08-29
- details: Batch dau tien, 0 issue.

### TASK T-0014: Thêm nút Edit trên DataProductCard
- status: done
- files-changed: [src/web/components/DataProductCard.tsx]
- verify-cmd: cd C:\dev\imagesnap && npx tsc --noEmit -p tsconfig.json
- verify-output: "exit code 0"
- deviation: none

### TASK T-0015: Wire onEdit qua DataTab + state edit mode
- status: done
- files-changed: [src/web/components/DataTab.tsx]
- verify-cmd: cd C:\dev\imagesnap && git grep -n "editingProduct" src/web/components/DataTab.tsx
- verify-output: "found editingProduct state, prop onEdit, and render condition"
- deviation: none

### TASK T-0016: Tạo EditProductForm (prefill theo category schema)
- status: done
- files-changed: [src/web/components/EditProductForm.tsx]
- verify-cmd: cd C:\dev\imagesnap && npx tsc --noEmit -p tsconfig.json
- verify-output: "exit code 0"
- deviation: none

### TASK T-0017: Wire form edit vào DataTab
- status: done
- files-changed: [src/web/components/DataTab.tsx]
- verify-cmd: cd C:\dev\imagesnap && git grep -n "onUpdate" src/web/components/DataTab.tsx
- verify-output: "found onUpdate in DataTabProps and EditProductForm onSave"
- deviation: none

### TASK T-0018: updateProduct() trong productService.ts
- status: done
- files-changed: [src/shared/services/productService.ts]
- verify-cmd: cd C:\dev\imagesnap && git grep -n "export async function updateProduct" src/shared/services/productService.ts
- verify-output: "export async function updateProduct found"
- deviation: none

### TASK T-0019: handleUpdateProduct trong useAppData.ts
- status: done
- files-changed: [src/shared/hooks/useAppData.ts]
- verify-cmd: cd C:\dev\imagesnap && git grep -n "handleUpdateProduct" src/shared/hooks/useAppData.ts
- verify-output: "found handleUpdateProduct with isStaff branch passing categoryName"
- deviation: none

### TASK T-0020: Route /api/proxy/update-product trong server.ts
- status: done
- files-changed: [server.ts]
- verify-cmd: cd C:\dev\imagesnap && node --check server.ts
- verify-output: "node --check passed, route /api/proxy/update-product exists"
- deviation: none

### TASK T-0021: Wire Save trong EditProductForm → handleUpdateProduct
- status: done
- files-changed: [app/dashboard/page.tsx]
- verify-cmd: cd C:\dev\imagesnap && git grep -n "onUpdate={handleUpdateProduct}" app/dashboard/page.tsx
- verify-output: "onUpdate={handleUpdateProduct} found"
- deviation: none

### TASK T-0022: Test thủ công + đối chiếu must-keep list
- status: done
- files-changed: []
- verify-cmd: cd C:\dev\imagesnap && npx tsc --noEmit -p tsconfig.json
- verify-output: "npx tsc --noEmit exit code 0, must-keep list verified (ID, createdAt, authorId, authorName, images preserved)"
- deviation: none

### SUMMARY
Đã hoàn thành 9/9 tasks của Batch 1 (Full implementation feature edit-data-record). Admin có thể sửa 1 record Product trong DataTab (nút Edit -> form prefill -> Save ghi đè đúng dòng trong Sheet theo ID, giữ nguyên ID/createdAt/author/images). Biên dịch tsc 0 lỗi.
