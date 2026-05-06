# ImageSnap — SEO & Strategic Plan v4.0

> **Nguồn gốc:** Chuyển đổi từ [`ImageSnap_Plan_v4_1.docx`](./ImageSnap_Plan_v4_1.docx)  
> **Phiên bản:** 4.0 | **Ngày:** 03/05/2026  
> **Domain:** imagesnap.cloud

**Tài liệu liên quan:**
- [ARCH.md](../ARCH.md) — Kiến trúc hệ thống
- [DEVLOG.md](../DEVLOG.md) — Lịch sử phát triển
- [CHROME_STORE_JUSTIFICATIONS.md](../CHROME_STORE_JUSTIFICATIONS.md) — Chrome Store listing
- [PROJECT_REQUIREMENTS.md](../PROJECT_REQUIREMENTS.md) — Yêu cầu sản phẩm

---

## Mục lục

1. [Positioning Lock](#phần-1-positioning-lock)
2. [Wording Reference — Do / Don't Say](#phần-2-wording-reference--do--dont-say)
3. [Homepage Copy v4](#phần-3-homepage-copy-v4--founder-voice)
4. [Comparison Page Outlines (5 trang)](#phần-4-comparison-page-outlines-5-trang)
5. [Content Calendar 12 tuần](#phần-5-content-calendar-12-tuần)
6. [Plan Execution 3 tháng](#phần-6-plan-execution-3-tháng)
7. [Appendix — Schema Markup & Chrome Store](#phần-7-appendix)

---

## PHẦN 1: POSITIONING LOCK

> Đây là nền tảng chiến lược của toàn bộ project. Mọi content, messaging, landing page, outreach và marketing đều phải tuân theo positioning này.  
> **Không tự ý kéo ImageSnap sang category Etsy SEO, AI training platform hoặc scraping engine.**

### 1.1. Core Positioning Statement

> **"ImageSnap saves any image with your designed context — so every picture stays useful forever."**

### 1.2. Khái niệm "Designed Context"

Designed context là điểm khác biệt cốt lõi của ImageSnap:
- Người dùng **quyết định** field nào được gắn vào mỗi ảnh
- Auto-fill từ trang khi có thể, customizable luôn
- Schema riêng theo từng category

### 1.3. ImageSnap KHÔNG PHẢI

| Sai category | Đại diện đúng |
|---|---|
| Công cụ SEO cho Etsy | eRank, Marmalead, Alura |
| AI/ML training data platform | Scale AI, Labelbox |
| Analytics cho ecommerce | EverBee, EtsyHunt |
| Scraping engine / automation bot | Apify, Bright Data |
| Photo app / DAM | CompanyCam, Pics.io |
| Web clipper thuần | Pinterest, Notion Clipper |

### 1.4. ImageSnap LÀ

- Công cụ gắn **designed context** vào mọi ảnh — biến screenshot chết thành research record sống
- Capture ảnh + dữ liệu có chọn lọc vào **Google Drive** (ảnh) và **Sheets** (context)
- Lựa chọn nhẹ hơn và an toàn hơn so với tự dựng scraper
- Bước đầu vào tốt cho workflow phân tích, automation hoặc AI downstream ở mức vừa phải

### 1.5. Lợi thế cốt lõi

| Đối thủ | Pain | ImageSnap giải quyết |
|---|---|---|
| Manual copy-paste | Chậm, error-prone, không scale | Tự động capture + structured ngay |
| DIY scraper | Maintain cost, anti-bot risk, data noisy | Không maintain, không risk, curation quality |
| Web clipper (Pinterest, Notion, Eagle) | Không có structured fields, bookmark rời rạc | Structured fields, custom schema, searchable |
| Scraping API (Apify, Bright Data) | Đắt ($300–1000/mo), complex setup | Đơn giản, rẻ, curation > automation |

### 1.6. Target Audience

**Core ICP (90% messaging):**
- Researcher / market analyst cần database competitor có cấu trúc
- Founder / solo operator cần xây ops process từ research data
- Operations-heavy user / business analyst cần structured records
- Người làm automation cần dữ liệu sạch làm input cho workflow downstream

**Secondary ICP (10% messaging):**
- AI workflow user cần input data có cấu trúc (KHÔNG target ML enterprise)
- Indie ML builder cần curated product data

**KHÔNG target:** Enterprise ML team · Etsy seller specific · Pure marketer/designer

### 1.7. Ranh giới pháp lý / Policy

Messaging phải phản ánh vùng an toàn: mô tả ImageSnap là công cụ hỗ trợ capture trong lúc người dùng **đang nghiên cứu thực tế trên trang**, không phải bot thu thập dữ liệu hàng loạt.

### 1.8. Pricing

| Tier | Giá | Mô tả |
|---|---|---|
| Free | $0/tháng | 30 captures/tháng forever |
| Solo | $19/tháng | 1 user, unlimited captures |
| Team | $49/tháng | 3 users, unlimited captures |

> Có thể thêm tier Pro $99/tháng sau nếu có demand B2B rõ ràng — **KHÔNG launch với nó.**

---

## PHẦN 2: WORDING REFERENCE — Do / Don't Say

> Áp dụng cho **MỌI** content: homepage, blog, tweet, outreach email, Chrome Web Store listing, Product Hunt post, investor pitch. Không có ngoại lệ.

### 2.1. Messaging chính

| ✅ DO SAY | ❌ DON'T SAY |
|---|---|
| Save any image with your designed context. | Scrape product data automatically. |
| Your pictures are worthless without context. ImageSnap fixes that. | Extract data from ecommerce sites. |
| You design the context. ImageSnap captures it. | Better than a custom scraper. |
| Images in Drive, context in Sheets, tied to one record. | Automated data collection from the web. |
| Research once, use forever. | Bot-powered product intelligence. |
| Don't just save pictures. Save their meaning. | Bulk extract listings from marketplaces. |
| Context turns dead screenshots into living records. | Scale your scraping operation. |
| Spend one time, use forever. | Download all product data from any site. |

### 2.2. Khi nói về AI angle (secondary, vừa phải)

| ✅ DO SAY | ❌ DON'T SAY |
|---|---|
| AI-ready research data as a starting point. | AI training data platform. |
| Clean, structured input for your downstream workflows. | MLOps infrastructure. |
| Data that's ready for analysis, enrichment, or automation. | Build datasets for RAG / LLM fine-tuning. |
| A good first step for AI workflows. | Scale AI alternative / Labelbox alternative. |

### 2.3. Khi nói về competitor positioning

| ✅ DO SAY | ❌ DON'T SAY |
|---|---|
| eRank shows you keywords. ImageSnap helps you build a private database to track what competitors actually do. | ImageSnap vs eRank / eRank alternative. |
| Unlike scraping APIs, ImageSnap lets you curate what matters. | Cheaper than Bright Data. |
| Your data lives in your Google Sheet. Not locked in our database. | We're better than EverBee/EtsyHunt. |
| Stop copying and pasting. Start capturing. | Replace your entire research workflow. |

### 2.4. Từ vựng an toàn vs nguy hiểm

| ✅ AN TOÀN | ❌ NGUY HIỂM |
|---|---|
| capture, save, collect, curate, attach | scrape, crawl, extract, harvest, mine |
| context, meaning, story, record | metadata, data point, field extraction |
| designed, your schema, your fields | pipeline, ingestion, data lake, training |
| your images, your Drive, you own | our platform, our database, our engine |
| human-guided, chosen by you, curated | bot, agent, autonomous, automated |
| research, browse, explore, review | bulk, mass, at scale, scraping operation |

---

## PHẦN 3: HOMEPAGE COPY v4 — Founder Voice

> Thay đổi cốt lõi vs v3.x: chuyển từ "structured data tool" → "image + designed context" framing.  
> Vision: *"Your pictures are worthless without context. ImageSnap attaches context to your pictures so you can use them in any later work. Spend one time, use forever."*

### HERO SECTION

**[H1]** Your pictures are worthless without context.

**[Subhead]** ImageSnap captures any image with your designed context — the fields you choose, the categories you define, the details that make each picture useful forever. One capture, use it in any later work.

**[CTAs]** `[Try free — 30 captures/month]` | `[See how it works ↓]`

> Visual: GIF — user clicks extension → image saves to Drive → context fields fill in Sheet → both linked as one record

### PROBLEM SECTION

**[H2]** Sound familiar?

### SOLUTION SECTION

**[H2]** Save the image. Keep the meaning.

| Feature | Mô tả |
|---|---|
| Capture any image with context | Click extension → ảnh vào Drive, context vào Sheet. Auto-fill khi có thể, customizable luôn. |
| You design the context | Thêm bất kỳ field nào: supplier name, rating, project code, season, status — mỗi category có schema riêng. |
| Spend one time, use forever | 6 tháng sau vẫn biết tại sao save ảnh đó, từ đâu, nghĩa là gì. Drive + Sheet. Yours forever. |

### HOW IT WORKS

**[H2]** Three steps. No setup required.

### HOW IT'S DIFFERENT

**[H2]** Not a scraper. Not a bookmark. Images with meaning.

| | Screenshot folder | DIY scraper | ImageSnap |
|---|---|---|---|
| Images saved | Yes, no context | Bulk, no curation | Yes, with your context |
| Context attached | None | Fixed schema only | Your designed context |
| Findable later | Hard | Requires DB query | Search by any field |
| Maintenance | None | Ongoing | Low |
| Policy risk | None | High | Lower |
| Data ownership | Yours (unstructured) | Yours (custom DB) | Yours (Drive + Sheet) |

### USE CASES

**[H2]** Every image tells a story. ImageSnap remembers it.

- **Competitor tracking** — Save competitor product images with price, positioning and source. Build a visual database that shows how competitors change over time.
- **Market research** — Capture product trends with images and context. Review visually, compare by fields, share with your team.
- **Sourcing and procurement** — Save supplier products with photos, specs and pricing. Compare visually across sources — no more juggling tabs and screenshots.
- **Personal knowledge base** — Save anything visual from the web with the context that makes it findable later. Recipes, designs, references, inspiration — with your own fields attached.

### PRICING

| Tier | Giá | Nội dung |
|---|---|---|
| Free | $0/month | 30 captures/month. 1 user. 3 categories. |
| Solo | $19/month | Unlimited captures. 1 user. Unlimited categories. |
| Team | $49/month | Unlimited captures. 3 users. Unlimited categories. Priority support. |

### FAQ (với FAQPage schema)

**Q: What does ImageSnap actually do?**  
A: When you browse a product page, click the extension. ImageSnap saves images to your Google Drive and captures context — title, price, description, source — into your Google Sheet. You can also add custom fields.

**Q: What is "designed context"?**  
A: You decide what information gets attached to each image. ImageSnap auto-fills what it can from the page, but you can add any custom fields — project name, rating, supplier, status, notes.

**Q: How is this different from just saving screenshots?**  
A: Screenshots sit in a folder with no context. A month later, you can't remember the price, the source, or why you saved it. ImageSnap attaches context to every image so it stays useful.

**Q: Is my data private?**  
A: Images go to your Google Drive. Context goes to your Google Sheet. We don't store your research data on our servers.

**Q: What happens if I cancel?**  
A: Everything stays. Your Drive images and Sheet records are yours. ImageSnap simply stops adding new captures.

**Q: Is this a scraper?**  
A: No. ImageSnap works inside your browser while you browse normally. You choose what to capture. It's human-guided, not automated.

### FOOTER

Links: Blog | Pricing | How it works | About | Help | Contact | Privacy  
Tagline: *"Save the image. Keep the meaning. Use it forever."*

---

## PHẦN 4: COMPARISON PAGE OUTLINES (5 trang)

### Trang 1: `/compare/imagesnap-vs-manual-spreadsheet`

**H1:** Still copy-pasting product data into Google Sheets?

| Section | Nội dung |
|---|---|
| Section 1 | The hidden cost of manual research (50 products × 5 min = 4+ hours) |
| Section 2 | What if one click did the work? (demo screenshot/GIF) |
| Section 3 | Comparison table: speed, accuracy, scalability, data structure |
| Section 4 | How to switch: install → capture first product → see it in Sheet |
| Section 5 | FAQ (FAQPage schema) |
| CTA | Try free — 30 captures/month |

**Keyword target:** `product research spreadsheet`

---

### Trang 2: `/compare/imagesnap-vs-custom-scraper`

**H1:** Tired of maintaining a product scraper?

| Section | Nội dung |
|---|---|
| Section 1 | Real cost of DIY scraping: maintenance, proxy cost, breakage, policy risk |
| Section 2 | A different approach — human-guided capture |
| Section 3 | Comparison table: maintenance, cost, data quality, legal risk, setup time |
| Section 4 | Honest scope: scraper nếu cần 10k products/day; ImageSnap nếu cần 50–500 curated records |
| Section 5 | FAQ (schema) |
| CTA | Build cleaner datasets without maintaining a crawler |

**Keyword target:** `alternative to web scraping`

---

### Trang 3: `/compare/imagesnap-vs-web-clipper`

**H1:** Web clippers save pages. ImageSnap saves structured data.

| Section | Nội dung |
|---|---|
| Section 1 | Problem with bookmarks and clips: unstructured, no custom fields, unsearchable |
| Section 2 | What "structured capture" means (screenshot: bookmark vs ImageSnap row) |
| Section 3 | Comparison table: Pinterest / Notion Clipper / Eagle / ImageSnap |
| Section 4 | FAQ (schema) |
| CTA | Capture data, not just links |

**Keyword target:** `notion web clipper alternative`

---

### Trang 4: `/compare/imagesnap-vs-scraping-api`

**H1:** Scraping APIs are built for crawlers. ImageSnap is built for researchers.

| Section | Nội dung |
|---|---|
| Section 1 | When scraping APIs make sense: large-scale, automated, recurring |
| Section 2 | When they don't: small-scale research, one-off intel, curated datasets |
| Section 3 | Comparison table: cost, setup complexity, data quality, curation, maintenance |
| Section 4 | Use together? Scraping API for bulk; ImageSnap as curation layer on top |
| Section 5 | FAQ (schema) |
| CTA | Curate first. Automate later. |

**Keyword target:** `apify alternative`

---

### Trang 5: `/use-cases/competitor-tracking-beyond-keyword-tools`

**H1:** Keyword tools show you what's trending. But who's tracking what competitors actually do?

| Section | Nội dung |
|---|---|
| Section 1 | Gap in Etsy/ecommerce research: keyword tools → search volume, not competitor strategy |
| Section 2 | What a competitor database looks like (Sheet với price, images, description, date) |
| Section 3 | How ImageSnap fills the gap: companion to eRank/Marmalead, not replacement |
| Section 4 | Workflow: eRank for keywords → Browse top results → Capture with ImageSnap → Private DB |
| Section 5 | FAQ (schema) |
| CTA | Start building your competitor database |

**Keyword target:** `competitor tracking database`

---

## PHẦN 5: CONTENT CALENDAR 12 TUẦN

> **Ưu tiên nếu nguồn lực hạn chế:** Homepage + Pricing → About/Founder Story → `/compare/vs-manual-spreadsheet` → `/compare/vs-custom-scraper` → `/use-cases/competitor-tracking`

| Tuần | Nội dung | Loại | Keyword target |
|---|---|---|---|
| 1 | Homepage + Pricing + How it works | Foundation | Brand + "save product data to google sheets" |
| 2 | About / Founder Story + Privacy + Help | Foundation | Brand trust + E-E-A-T |
| 3 | `/compare/imagesnap-vs-manual-spreadsheet` | Comparison | "product research spreadsheet" |
| 4 | `/compare/imagesnap-vs-custom-scraper` | Comparison | "alternative to web scraping" |
| 5 | `/compare/imagesnap-vs-web-clipper` | Comparison | "notion web clipper alternative" |
| 6 | Blog: Why copy-paste research breaks at scale | Tutorial | "product research workflow" |
| 7 | Blog: Founder story — Why I built ImageSnap | Story | Brand + viral potential |
| 8 | `/use-cases/competitor-tracking-beyond-keyword-tools` | Use case | "competitor tracking database" |
| 9 | Blog: Building a competitor database without a scraper | Tutorial | "competitor database" |
| 10 | Free tool: Product page field checker | Link magnet | "product data checker" |
| 11 | Blog: Human-guided capture vs full automation | Thought piece | "human in the loop data" |
| 12 | `/compare/imagesnap-vs-scraping-api` + Big retrospective | Comparison + Story | "apify alternative" + brand |

### Phân loại content theo mục đích

| Loại | Tuần | Mục đích |
|---|---|---|
| Foundation | 1–2 | Không SEO traffic ngay, nhưng là nền tảng trust + conversion |
| Comparison (BOFU) | 3–5, 12 | Conversion cao nhất. Target 4 nhóm đối thủ |
| Use case / companion | 8 | Companion content: "Keyword tools show trends. ImageSnap tracks what competitors actually do." |
| Tutorial / thought piece | 6, 9, 11 | SEO content research-focused. Technical vừa phải |
| Founder story | 7 | E-E-A-T, viral potential. **Chỉ founder viết được — không AI** |
| Free tool | 10 | Link magnet. CTA: "Want to save 100 of these? Try ImageSnap." |

---

## PHẦN 6: PLAN EXECUTION 3 THÁNG

### 6.1. Tháng 1: Foundation + Trust

**SEO (40%):**
- Homepage copy v4 live trên imagesnap.cloud
- Pricing page, How it works page
- Schema markup: SoftwareApplication, Organization, FAQPage
- Blog setup, sitemap.xml, robots.txt (allow Googlebot, GPTBot, ClaudeBot, PerplexityBot)
- Google Search Console + Bing Webmaster verified

**Story (30%):**
- About / Founder Story page (personal, authentic)
- Twitter build-in-public setup + daily tweets
- IndieHackers profile + first post
- `/build-in-public` page (public dashboard)

**Distribution (30%):**
- Lurk + comment Reddit: r/SideProject, r/Entrepreneur, r/SaaS, r/webdev
- Facebook groups relevant
- Outreach 20 micro-influencer / reviewer
- Product Hunt profile setup (cần 30 ngày trước launch)
- Chrome Web Store submit
- Google Workspace Marketplace submit

**Code (chỉ nếu extension chưa xong):**
- Extension DOM selectors cho top 3 platform (Amazon, Etsy, Shopee/AliExpress)
- Google Sheets sync
- Lemon Squeezy billing integration
- **KHÔNG thêm feature mới ngoài core**

---

### 6.2. Tháng 2: Launch + BOFU Content

**Tuần 5 — Launch Week:**

| Ngày | Action |
|---|---|
| Thứ 3 | Product Hunt launch |
| Thứ 4 | IndieHackers post |
| Thứ 5 | Show HN |
| Thứ 6 | Reddit r/SideProject, r/Entrepreneur |
| Thứ 7–CN | Reply mọi comment + bug fix critical |

**Tuần 6–8:**
- 2–3 comparison pages chính (vs manual, vs scraper, companion keyword tools)
- Founder story + 1 tutorial thực dụng
- Onboarding email sequence cơ bản
- Outreach giới hạn, tập trung reviewer/blog phù hợp
- Daily Twitter + community engagement

---

### 6.3. Tháng 3: Optimize + Expand Content

**SEO:**
- Comparison page #4: vs scraping API
- 2–3 bài tutorial/thought piece chất lượng
- 1 free tool link magnet (nếu không ảnh hưởng core product)
- Cornerstone content: "The complete guide to building a competitor database" (5000+ words)
- Internal linking audit + fix
- Search Console review: optimize meta descriptions for CTR

**Story:**
- 3-month retrospective (transparent, full numbers)
- Customer case studies (2–3)
- Weekly/bi-weekly newsletter

**Distribution:**
- Affiliate program launch (30% recurring via Lemon Squeezy)
- Backlink outreach: 20 emails targeting high-DR sites
- Referral program: invite 3 friends = 1 month free
- Press outreach: IndieHackers featured, TLDR newsletter, relevant blogs

---

### 6.4. KPI Tracking

| Metric | End Month 1 | End Month 2 | End Month 3 |
|---|---|---|---|
| Free users | 50–150 | 300–800 | 800–2000 |
| Paying users | 0–5 | 10–30 | 30–80 |
| MRR | $0–100 | $200–800 | $800–2500 |
| Content published | 3–5 | 8–12 | 12–18 |
| Backlinks (DR 30+) | 0–2 | 2–5 | 5–8 |
| Keywords top 10 | 0 | 0–2 | 2–4 |

---

### 6.5. Quy tắc cứng

- Từ tháng 2 trở đi, tối thiểu **50% thời gian** dành cho marketing hoặc distribution.
- **Không thêm feature mới** sau tuần 8 trừ khi có nhiều người dùng trả phí cùng yêu cầu.
- Theo dõi MRR, active users và activation **hàng tuần**.
- Mọi content phải đi qua **Do/Don't Say filter** ([Phần 2](#phần-2-wording-reference--do--dont-say)) trước khi publish.
- **Không quay lại framing** "Etsy SEO tool" hoặc "AI training platform".

---

## PHẦN 7: APPENDIX

### A. Schema Markup — JSON-LD

#### SoftwareApplication (Homepage)

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "ImageSnap",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://imagesnap.cloud",
  "description": "Save the product, not just the link. Capture product images and details into structured research records. Images in Google Drive, details in Google Sheets.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "featureList": [
    "One-click capture: images + details from product pages",
    "Product images saved to Google Drive",
    "Structured details in Google Sheets",
    "Unlimited custom fields",
    "Team collaboration",
    "Data ownership — your Drive, your Sheet"
  ]
}
```

#### FAQPage

Tạo JSON-LD từ các Q&A trong [Phần 3 — FAQ](#faq-với-faqpage-schema). Mỗi Q&A là 1 `mainEntity`.

---

### B. Chrome Web Store Listing

Xem thêm: [CHROME_STORE_JUSTIFICATIONS.md](../CHROME_STORE_JUSTIFICATIONS.md)

| Field | Value |
|---|---|
| **Name** | ImageSnap — Save Product Images & Details to Google Sheets |
| **Short description** | Save any image with your designed context. Images in Drive, context in Sheets. Research once, use forever. |
| **Category** | Productivity |
| **Tags** | product research, google sheets, data capture, competitor tracking, web clipper |

---

### C. Lịch sử Positioning (để tham khảo)

| Version | Positioning | Vấn đề |
|---|---|---|
| v1.0 | "Photo organizer" | Quá rộng, sai category |
| v1.5 | "Etsy seller research tool" | Sai competitor framing (so sánh với SEO tools) |
| v2.0 | "AI training data platform" | Over-positioning, quá xa product thực tế |
| v3.0 | "Structured research data capture" | Đúng hướng nhưng overclaim ở homepage copy và KPI |
| v3.1 | Giảm overclaim, tăng trung thực | Bury visual element (ảnh sản phẩm) |
| v3.2 | Kéo visual record lên tuyến đầu | Image + dữ liệu, không chỉ spreadsheet rows |
| **v4.0** | **Founder voice + designed context** | Image + your designed context là core message |

> Ghi lại để tránh lặp lại sai lầm cũ khi viết content hoặc khi có AI khác tham gia project.

---

*imagesnap.cloud | Strategic Plan v4.0 | 03/05/2026*
