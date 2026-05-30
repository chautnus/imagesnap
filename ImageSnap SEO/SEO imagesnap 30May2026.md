# SEO ImageSnap — Kế hoạch triển khai
**Ngày:** 30/05/2026  
**Dựa trên:** Nghiên cứu nhu cầu người dùng tiềm năng (xem `docs/memory/Revisit imagesnap opportunity.md`)

---

## Tổng quan

Từ nghiên cứu thị trường, 3 segment có nhu cầu cao nhất và dễ tiếp cận nhất qua SEO:

| Segment | Keyword volume | Cạnh tranh | Priority |
|---------|---------------|-----------|---------|
| E-commerce / Dropshipping | Cao | Trung bình | 🔴 #1 |
| Marketing / Swipe file | Cao | Cao (nhưng tools đắt) | 🔴 #2 |
| DAM alternative (SMB) | Trung bình | Thấp | 🟡 #3 |

---

## Các trang cần tạo mới

### A. Use-case pages mới (2 trang)

#### A1. `/use-cases/aliexpress-product-research`
- **Target keyword:** "aliexpress product research organize" / "dropshipping product research tool"
- **Search intent:** Dropshipper đang tìm cách tổ chức nghiên cứu sản phẩm AliExpress
- **Angle:** "Stop copying product data by hand. One click → image + price + URL goes to your Google Sheet."
- **File component:** `src/web/pages/use-cases/AliexpressResearch.tsx`

#### A2. `/use-cases/shopify-competitor-tracking`
- **Target keyword:** "shopify competitor tracking tool" / "track competitor products"
- **Search intent:** Shopify seller muốn theo dõi đối thủ systematically
- **Angle:** "Track what competitors change — visually. Screenshots with context, auto-organized in Drive."
- **File component:** `src/web/pages/use-cases/ShopifyCompetitorTracking.tsx`

---

### B. Alternative pages mới (3 trang)

#### B1. `/alternatives/foreplay-alternative`
- **Target keyword:** "foreplay alternative" / "cheaper swipe file tool"
- **Search intent:** Marketer đang trả $249/tháng cho Foreplay, muốn option rẻ hơn
- **Angle:** "Foreplay is $249/mo. ImageSnap is $9.99. Both save ads with context — you do the math."
- **Key differentiator:** Google Drive native (dữ liệu của mình, không bị lock-in), giá thấp hơn 25x
- **File:** Thêm vào `AlternativeClient.tsx` slug `foreplay-alternative`

#### B2. `/alternatives/magicbrief-alternative`
- **Target keyword:** "magicbrief alternative" / "ad swipe file tool affordable"
- **Search intent:** Marketing team tìm tool creative research không cần custom quote
- **Angle:** "MagicBrief requires a custom quote. ImageSnap is $9.99/month. No sales call needed."
- **File:** Thêm slug `magicbrief-alternative`

#### B3. `/alternatives/dam-alternative-google-drive`
- **Target keyword:** "digital asset management alternative google drive" / "cheap DAM tool"
- **Search intent:** SMB không muốn trả $500+/tháng cho DAM enterprise
- **Angle:** "You already use Google Drive. ImageSnap adds custom metadata and structured capture on top of it — for $9.99/month."
- **File:** Thêm slug `dam-alternative-google-drive`

---

### C. Blog posts mới (3 bài)

#### C1. `/blog/organize-product-images-ecommerce`
- **Target keyword:** "how to organize product images ecommerce" / "product image organization"
- **Search intent:** Ecommerce seller đang tìm hệ thống tổ chức ảnh sản phẩm
- **Format:** How-to guide với workflow cụ thể
- **CTA:** ImageSnap làm tự động workflow này
- **File component:** `src/web/pages/blog/OrganizeProductImages.tsx`

#### C2. `/blog/swipe-file-chaos-how-to-fix`
- **Target keyword:** "swipe file organization" / "how to organize swipe file ads"
- **Search intent:** Marketer đang chết đuối trong screenshot chaos
- **Format:** Problem → Solution article
- **Key hook:** "A swipe file without context is just digital hoarding" (resonates với target audience)
- **File component:** `src/web/pages/blog/SwipeFileChaos.tsx`

#### C3. `/blog/google-drive-metadata-images`
- **Target keyword:** "google drive image metadata" / "add metadata to google drive images"
- **Search intent:** User muốn tìm kiếm ảnh trong Drive theo nội dung, không phải tên file
- **Format:** Educational — vấn đề của Drive + giải pháp
- **Angle:** "Google Drive stores images but can't understand them. ImageSnap adds the layer Drive is missing."
- **File component:** `src/web/pages/blog/GoogleDriveMetadata.tsx`

---

## Kế hoạch triển khai từng bước

### Bước 1: Tạo component nội dung (3-4 ngày dev)

**Thứ tự ưu tiên:**

| # | File cần tạo | Route | Priority |
|---|-------------|-------|---------|
| 1 | `src/web/pages/use-cases/AliexpressResearch.tsx` | /use-cases/aliexpress-product-research | 🔴 Ngay |
| 2 | `src/web/pages/use-cases/ShopifyCompetitorTracking.tsx` | /use-cases/shopify-competitor-tracking | 🔴 Ngay |
| 3 | `src/web/pages/blog/SwipeFileChaos.tsx` | /blog/swipe-file-chaos-how-to-fix | 🔴 Ngay |
| 4 | `src/web/pages/blog/OrganizeProductImages.tsx` | /blog/organize-product-images-ecommerce | 🟡 Tuần 2 |
| 5 | `src/web/pages/blog/GoogleDriveMetadata.tsx` | /blog/google-drive-metadata-images | 🟡 Tuần 2 |
| 6 | Alternative pages (3 slugs) | /alternatives/... | 🟡 Tuần 2 |

### Bước 2: Đăng ký route

**Use-cases** — thêm vào `app/use-cases/[slug]/page.tsx`:
```typescript
'aliexpress-product-research': {
  component: AliexpressResearch,
  title: "AliExpress Product Research — Organize Images & Data | ImageSnap",
  description: "..."
},
'shopify-competitor-tracking': {
  component: ShopifyCompetitorTracking,
  title: "Shopify Competitor Tracking — Visual Database | ImageSnap",
  description: "..."
},
```

**Blog** — thêm vào `app/blog/[slug]/page.tsx`:
```typescript
'organize-product-images-ecommerce': { component: OrganizeProductImages, ... },
'swipe-file-chaos-how-to-fix': { component: SwipeFileChaos, ... },
'google-drive-metadata-images': { component: GoogleDriveMetadata, ... },
```

**Alternatives** — thêm slugs vào `app/alternatives/[slug]/page.tsx` + content vào `AlternativeClient.tsx`

### Bước 3: Internal linking

- Mỗi trang mới → link về homepage và pricing
- `/use-cases/aliexpress-product-research` ↔ `/blog/organize-product-images-ecommerce`
- `/alternatives/foreplay-alternative` ↔ `/use-cases/swipe-file-tool`
- `/alternatives/magicbrief-alternative` ↔ `/use-cases/competitor-tracking-beyond-keyword-tools`
- Tất cả blog mới → suggest 2 "Continue Reading" bài liên quan

### Bước 4: SEO checklist trước khi deploy mỗi trang

- [ ] Title tag unique, có keyword target
- [ ] Meta description 150-160 ký tự, có CTA
- [ ] Canonical URL đúng
- [ ] Open Graph tags (title + description + OG image)
- [ ] JSON-LD schema (Article / FAQPage / Product)
- [ ] Internal links ≥ 2 trang liên quan
- [ ] Image alt text đầy đủ
- [ ] CTA rõ ràng (button "Try ImageSnap free")
- [ ] Sitemap.xml updated sau deploy

### Bước 5: Submit & monitor

- Submit sitemap lên Google Search Console sau mỗi batch deploy
- Track keyword ranking hàng tuần (Google Search Console + GSC queries)
- Monitor organic traffic mỗi trang sau 4 tuần

---

## Lịch triển khai

| Tuần | Hành động |
|------|-----------|
| Tuần 1 (30/5) | Viết nội dung + tạo component cho A1, A2, C2 |
| Tuần 2 | Tạo component C1, C3 + thêm 3 alternative slugs |
| Tuần 3 | Deploy tất cả, submit sitemap, internal linking |
| Tuần 4-8 | Monitor, optimize, viết thêm bài từ data thực |

---

## KPIs theo dõi

| Metric | Mục tiêu 3 tháng |
|--------|-----------------|
| Organic clicks mới/tháng | +200 từ các trang này |
| Số trang index | +8 trang |
| Keyword ranking page 1 | ≥ 3 keywords |
| Signups từ SEO traffic | +15% so với baseline |
