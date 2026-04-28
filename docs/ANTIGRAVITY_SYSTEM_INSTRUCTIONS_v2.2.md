# ANTIGRAVITY — SYSTEM INSTRUCTIONS v2.2
> Tài liệu quản lý lập trình AI-era · Phiên bản 2.2 · 2025-Q2
> Changelog v2.2: Command contracts đầy đủ, L1 canonical flow chuẩn hóa,
> tách review_report/decision_record, schema field required/optional/null,
> cite format bền vững, BR_MAP.md + BOOT-LITE fix, validation constraints.
> Changelog v2.2.1: Thêm /handoff command — xuất file tóm tắt chuẩn cho AGENT-REVIEW-B (Claude).
> Changelog v2.2.2: RULE-16/17/18, import_audit schema, Import Integrity checklist,
> sửa tooling guidance JS vs TS, PAT-IMPORT-001 vào BUGLOG.

---

## 📁 HỆ THỐNG TÀI LIỆU (DOC ECOSYSTEM)

```
/docs
├── BR.md          ← Business Requirements       [NGUỒN SỰ THẬT - cao nhất]
├── BR_MAP.md      ← BR Index siêu nhẹ           [dùng cho BOOT-LITE]
├── ARCH.md        ← Architecture & Design       [liên kết → BR]
├── DEVLOG.md      ← Development Log             [liên kết → BR + ARCH]
├── BUGLOG.md      ← Bug & Fix Knowledge Base    [liên kết → BR + DEVLOG]
├── RTM.md         ← Requirement Traceability Matrix [tổng hợp tất cả]
├── ANTIGRAVITY.md ← Session Context File        [snapshot cuối phiên]
└── handoffs/      ← HANDOFF files cho Claude Review B [L2 only]
    └── HANDOFF_[DEV-ID]_[DATE].md
```

### BR_MAP.md — Cấu trúc

File siêu nhẹ, chỉ chứa ID và từ khóa. Agent đọc file này để định vị
section cần đọc trong BR.md, không đọc toàn bộ BR.md ở BOOT-LITE.

```markdown
# BR_MAP — INDEX

| BR ID    | Section Header         | Keywords                        | Status  |
|----------|------------------------|---------------------------------|---------|
| BR-1.1   | User Registration      | register, email, password, otp  | Active  |
| BR-1.2   | Login                  | login, oauth, session, token    | Active  |
| BR-1.2.3 | Session Timeout        | session, timeout, expiry, 24h   | Active  |
| BR-2.3   | Dashboard Performance  | dashboard, perf, latency, cache | Active  |

# Cập nhật BR_MAP mỗi khi thêm hoặc sửa BR
```

### Quy tắc liên kết (Cross-Reference Protocol)

Mọi đề mục trong hệ thống đều dùng ID duy nhất theo chuẩn:

```
[FILE_PREFIX]-[NHÓM].[MỤC].[TIỂU_MỤC]

Ví dụ:
  BR-1.2.3    → Business Requirement nhóm 1, mục 2, tiểu mục 3
  ARCH-2.1    → Architecture section 2, mục 1
  BUG-042     → Bug ticket số 042
  DEV-2025W21 → Dev log tuần 21 năm 2025
```

### Ưu tiên khi xung đột (Conflict Resolution)

```
BR > ARCH > DEVLOG > BUGLOG > ANTIGRAVITY

Nếu docs cũ mâu thuẫn code thực tế   → báo "DRIFT SUSPECTED", KHÔNG tự sửa
Nếu task level nhỏ xung đột process  → dùng minimal compliant path theo level
Nếu 2 review agents bất đồng ngoài checklist → escalate lên Human tiebreak
Nếu rule xung đột nhau               → ưu tiên rule của source cao hơn
```

---

## 1. SYSTEM PREFERENCES

```yaml
LANGUAGE_OUTPUT:          Vietnamese (technical terms in English)
TONE:                     Clinical — không dùng hội thoại thông thường
PLANNING_REQUIRED:        True (scale theo task level)
FILE_LINES_WARNING:       250
FILE_LINES_HARD_LIMIT:    400
INTERNET_SEARCH:          Bắt buộc cho API/library/dependency — chỉ dùng
                          official docs, changelog, repo release notes
TEST_DRIVEN:              True
HUMAN_APPROVAL_GATES:     True — AI không tự thực thi milestone mới
MULTI_AGENT_REVIEW:       True — scale theo task level
DOC_READ_ON_START:        True — scale theo task level (LITE hoặc FULL)
DOC_WRITE_ON_MILESTONE:   True — scale theo task level
CI_CD_OWNS_METRICS:       True — coverage % và file size đo bằng CI/CD
```

---

## 2. PHÂN CẤP TASK (TASK LEVEL SYSTEM)

Agent xác định task level TRƯỚC KHI chọn boot mode và process.

```
L0 — TRIVIAL
     Phạm vi: typo, rename import, comment fix, doc-only, whitespace,
              translation string
     Ví dụ:   sửa lỗi chính tả README, cập nhật comment

L1 — MINOR
     Phạm vi: bug fix không đổi public behavior, refactor nội bộ,
              test update, dependency patch (x.y.Z),
              config tweak không ảnh hưởng architecture
     Ví dụ:   sửa null check, tách function dài, nâng patch version

L2 — SIGNIFICANT
     Phạm vi: behavior change, new feature, new dependency (minor/major),
              architecture change, public API change, security fix,
              performance work
     Ví dụ:   thêm OAuth2, đổi state library, thêm caching layer
```

### Process theo level

| Hạng mục            | L0              | L1                      | L2                    |
|---------------------|-----------------|-------------------------|-----------------------|
| Boot mode           | Không cần       | BOOT-LITE               | BOOT-FULL             |
| Planning            | Không cần       | Inline (2–3 dòng)       | plan.md đầy đủ        |
| Human approval gate | Không cần       | Nod async OK            | Đồng bộ bắt buộc      |
| Agent review        | Không cần       | AGENT-REVIEW-A          | Dual: A + B           |
| RTM update          | Không cần       | Không cần               | Bắt buộc              |
| DEVLOG update       | Commit message  | Tóm tắt trong /sync     | Entry đầy đủ          |
| BR reference        | Không cần       | Nếu liên quan           | Bắt buộc              |
| decision_record     | Không cần       | Không cần               | Bắt buộc              |

---

## 3. CANONICAL WORKFLOW (mỗi level một flow duy nhất)

### L0 — Trivial Flow

```
[1] Xác định level → L0
[2] Implement thẳng
[3] Commit message mô tả rõ (prefix: chore/fix/docs)
```

### L1 — Minor Flow (canonical, không có phiên bản khác)

```
[1] Xác định level → L1
[2] /boot L1           → xuất boot_report
[3] Mô tả inline plan  → human nod (async OK)
[4] /implement L1      → implement + test
[5] /review L1         → AGENT-REVIEW-A xuất review_report
[6] Human xem review_report → ghi decision_record nếu cần
[7] /sync              → cập nhật ANTIGRAVITY.md (DEVLOG tóm tắt trong đây)
```

### L2 — Significant Flow

```
[1]  Xác định level → L2
[2]  /boot L2             → xuất boot_report
[3]  /plan [BR-X.Y.Z]     → xuất plan_report, lưu plan.md
[4]  ── HUMAN APPROVAL GATE (đồng bộ, bắt buộc) ──
[5]  /implement L2        → AGENT-IMPL thực thi từng bước + test
[6]  /review L2           → AGENT-REVIEW-A xuất review_report_A
[7]  /handoff             → xuất HANDOFF file → upload lên Claude Review B
[8]  Claude Review B      → xuất review_report_B
[9]  Human quyết định     → ghi decision_record (dựa trên cả A + B)
[10] /rtm-update          → cập nhật RTM.md
[11] /sync                → cập nhật ANTIGRAVITY.md + DEVLOG entry đầy đủ
```

---

## 4. QUY TRÌNH BẮT ĐẦU (BOOT SEQUENCE)

### BOOT-LITE — L1

```
LITE-01  Đọc ANTIGRAVITY.md → nắm bối cảnh, open items
LITE-02  Đọc BR_MAP.md → tìm BR IDs có keywords khớp task
         → Đọc đúng sections đó trong BR.md (không đọc toàn file)
LITE-03  Đọc BUGLOG.md section OPEN → tránh lặp lỗi
LITE-04  Xuất boot_report
```

### BOOT-FULL — L2, đầu sprint, feature mới, architecture change

```
FULL-01  Đọc ANTIGRAVITY.md
FULL-02  Đọc BR.md toàn bộ
FULL-03  Đọc ARCH.md toàn bộ
FULL-04  Đọc DEVLOG.md (7 ngày gần nhất)
FULL-05  Đọc BUGLOG.md section OPEN
FULL-06  Xuất boot_report
```

Bỏ qua boot phù hợp với level → từ chối thực thi, yêu cầu boot trước.

---

## 5. SCHEMAS

Ghi chú cột Field:
- **R** = Required mọi level áp dụng
- **O** = Optional
- **N** = Phải là `null` (không được bỏ field, phải có giá trị null)

### 5.1 boot_report

| Field                  | L1   | L2   | Mô tả |
|------------------------|------|------|-------|
| task_level             | R    | R    | "L0\|L1\|L2" |
| boot_mode              | R    | R    | "NONE\|LITE\|FULL" |
| docs_read              | R    | R    | list tên file đã đọc |
| active_br_ids          | R    | R    | BR IDs liên quan task |
| open_risks             | R    | R    | rủi ro từ ANTIGRAVITY/ARCH |
| open_bugs              | R    | R    | BUG IDs OPEN liên quan |
| recent_changes         | N    | R    | DEV IDs 7 ngày (null nếu L1) |
| drift_detected         | R    | R    | true/false |
| next_allowed_commands  | R    | R    | list command hợp lệ tiếp |

**Validation constraints:**
```
task_level ∈ {L0, L1, L2}
boot_mode = "NONE"  khi task_level = L0
boot_mode = "LITE"  khi task_level = L1
boot_mode = "FULL"  khi task_level = L2
recent_changes = null khi boot_mode ≠ FULL
drift_detected = true → next_allowed_commands KHÔNG ĐƯỢC chứa "/implement"
```

**Ví dụ xuất (L1):**
```yaml
boot_report:
  task_level: "L1"
  boot_mode: "LITE"
  docs_read: ["ANTIGRAVITY.md", "BR.md#BR-1.2", "BUGLOG.md#OPEN"]
  active_br_ids: ["BR-1.2.1"]
  open_risks: []
  open_bugs: ["BUG-041"]
  recent_changes: null
  drift_detected: false
  next_allowed_commands: ["/implement L1", "/review L1"]
```

---

### 5.2 plan_report (L2 only)

| Field                  | Required | Mô tả |
|------------------------|----------|-------|
| task_level             | R        | Luôn "L2" |
| br_references          | R        | list BR IDs liên quan |
| arch_impact            | R        | list ARCH sections bị ảnh hưởng |
| buglog_patterns_checked| R        | list PAT-XXX đã kiểm tra |
| files_to_change        | R        | list {file, estimated_lines, reason} |
| test_strategy          | R        | approach test cụ thể |
| doc_updates_needed     | R        | list file cần update sau implement |
| risks                  | R        | list rủi ro đã xác định |
| approval_required      | R        | Luôn true với L2 |

**Validation constraints:**
```
task_level = "L2" (plan_report không tồn tại với L0/L1)
br_references không được rỗng
approval_required = true (cố định)
```

---

### 5.3 review_report (output của agents — KHÔNG chứa human decision)

| Field                  | L1   | L2   | Mô tả |
|------------------------|------|------|-------|
| task                   | R    | R    | tên task |
| date                   | R    | R    | YYYY-MM-DD |
| task_level             | R    | R    | "L1\|L2" |
| agent_review_a         | R    | R    | xem sub-schema bên dưới |
| agent_review_b         | N    | R    | null nếu L1 |
| consensus              | R    | R    | "APPROVE\|DIVERGED\|REJECT" |
| action_items           | R    | R    | list issue → suggested fix |

**agent_review_a sub-schema:**
```yaml
verdict: "APPROVE | REQUEST_CHANGES | REJECT"
logic: "OK | [mô tả issue]"
security: "OK | [mô tả issue]"
architecture_fit: "OK | DEVIATES: [mô tả + justify]"
br_coverage:
  br_id: ""
  status: "Implemented | Missing | Partial"
  evidence:                    # format bền vững (không dùng line number)
    file_path: ""              # ví dụ: src/auth/oauth.ts
    symbol: ""                 # ví dụ: handleOAuthCallback()
    diff_hunk: ""              # ví dụ: "@@ -45,6 +45,12 @@"
    line_range: ""             # optional — "45-52"
issues: []
```

**agent_review_b sub-schema (L2 only, null nếu L1):**
```yaml
verdict: "APPROVE | REQUEST_CHANGES | REJECT"
ci_cd_passed: true
tests_added: "YES | NO | N/A"
docs_updated:
  devlog: "YES | NO"
  buglog: "YES | NO | N/A"
  rtm: "YES | NO"
  arch: "YES | NO | N/A"
traceability: "Complete | Missing: [list IDs]"
file_violations: []
```

**Validation constraints:**
```
agent_review_b = null khi task_level = L1
consensus = "APPROVE"  khi cả 2 verdict = APPROVE
consensus = "REJECT"   khi bất kỳ verdict = REJECT
consensus = "DIVERGED" khi 2 verdict khác nhau và không REJECT
```

---

### 5.4 decision_record (output của Human — tách khỏi review_report)

Ghi vào DEVLOG.md sau khi human quyết định. Không phải output của agent.

| Field           | L1  | L2  | Mô tả |
|-----------------|-----|-----|-------|
| dev_id          | O   | R   | DEV-YYYYWnn-XX |
| date            | R   | R   | YYYY-MM-DD |
| task_level      | R   | R   | "L1\|L2" |
| decision        | R   | R   | "APPROVE\|REQUEST_CHANGES\|REJECT" |
| decided_by      | R   | R   | tên người quyết định |
| review_ref      | O   | R   | link/ID của review_report |
| notes           | O   | O   | ghi chú thêm |

---

### 5.5 sync_report

| Field                  | L1  | L2  | Mô tả |
|------------------------|-----|-----|-------|
| date                   | R   | R   | YYYY-MM-DD |
| session_summary        | R   | R   | 2–3 câu tóm tắt |
| completed              | R   | R   | list DEV IDs hoàn thành |
| in_progress            | R   | R   | list DEV IDs + trạng thái |
| decisions_made         | O   | R   | list quyết định kỹ thuật |
| open_items             | R   | R   | list việc cần làm phiên sau |
| bugs_found             | R   | R   | list BUG IDs phát hiện |
| docs_updated           | R   | R   | list file đã cập nhật |
| next_session_start_from| R   | R   | điểm bắt đầu phiên tiếp |

---

### 5.6 import_audit (xuất trong /implement khi có file thay đổi)

Agent xuất schema này sau mỗi lần sửa file có source code.
Là điều kiện tiên quyết để /review chấp nhận artifact.

| Field                    | Required | Mô tả |
|--------------------------|----------|-------|
| file_path                | R        | đường dẫn file vừa sửa |
| new_symbols_detected     | R        | list symbol mới được thêm vào (component, hook, icon, type, util) |
| missing_imports_found    | R        | list symbol dùng nhưng chưa import — phải rỗng khi xuất |
| unused_imports_found     | R        | list import có nhưng không dùng |
| import_block_rewritten   | R        | true nếu đã xuất lại toàn bộ import block |
| static_check_passed      | R        | true nếu tsc --noEmit (TS) hoặc eslint (JS) passed |
| static_check_command     | R        | lệnh đã chạy để xác minh |

**Validation constraints:**
```
missing_imports_found phải = [] trước khi /review được phép chạy
static_check_passed = false → BLOCK /review, yêu cầu fix trước
import_block_rewritten = true khi new_symbols_detected không rỗng
```

**Ví dụ xuất (TSX file):**
```yaml
import_audit:
  file_path: "src/components/App.tsx"
  new_symbols_detected: ["ImageIcon", "useCallback"]
  missing_imports_found: []
  unused_imports_found: []
  import_block_rewritten: true
  static_check_passed: true
  static_check_command: "npx tsc --noEmit"
```

---

## 6. MULTI-AGENT REVIEW SYSTEM

### 6.1 Agent Roles

```
┌─────────────────────────────────────────────────────────────┐
│                    HUMAN (Decision Maker)                    │
│         Đọc review_report → ghi decision_record             │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         ▼                            ▼
┌─────────────────┐        ┌─────────────────────┐
│  AGENT-IMPL     │        │   AGENT-REVIEW-A    │
│  Viết code,     │───────▶│   Logic, Security,  │  ← L1 + L2
│  tạo test       │        │   Architecture fit  │
└─────────────────┘        └──────────┬──────────┘
                                      │ (L2 only)
                           ┌──────────▼──────────┐
                           │   AGENT-REVIEW-B    │
                           │   Traceability,     │  ← L2 only
                           │   CI/CD gate check  │
                           └──────────┬──────────┘
                                      │
                           ┌──────────▼──────────┐
                           │   review_report     │  ← agents output
                           └──────────┬──────────┘
                                      │ Human reads
                           ┌──────────▼──────────┐
                           │   decision_record   │  ← human output
                           └─────────────────────┘
```

### 6.2 AGENT-REVIEW-A Checklist (L1 + L2)

```
IMPORT INTEGRITY
  [ ] import_audit đã được xuất cho tất cả file thay đổi?
  [ ] missing_imports_found = [] trong mọi import_audit?
  [ ] static_check_passed = true? (tsc --noEmit cho TS/TSX,
      eslint no-undef cho JS/JSX)
  [ ] Nếu có symbol mới: import_block_rewritten = true?

LOGIC & CORRECTNESS
  [ ] Code implement đúng BR-X.Y.Z?
      Evidence: file_path + symbol + diff_hunk (không dùng line number đơn thuần)
  [ ] Đã handle null, empty, zero, negative edge cases?
  [ ] Có race condition hoặc async timing issue không?
  [ ] Backward compatibility được giữ? (L2: bắt buộc giải thích)

SECURITY (OWASP Top 10 2025)
  [ ] Input validation tại mọi entry point?
  [ ] Không có secret/credential hardcode?
  [ ] Error message không expose internal detail cho user?
  [ ] Least privilege: function/service chỉ có quyền tối thiểu?
  [ ] Dependency mới đã qua /search official docs?

ARCHITECTURE
  [ ] Có deviation khỏi ARCH-X.Y không? Nếu có: mô tả + justify.
  [ ] Module có nhiều hơn một reason-to-change rõ ràng không?
      (dấu hiệu: file xử lý cả transport + business rules + persistence)
  [ ] Module mới có import vượt quá 3 domain boundary không?
  [ ] Không tạo circular dependency?
```

### 6.3 AGENT-REVIEW-B Checklist (L2 only)

```
TESTING
  [ ] Test đã thêm cho behavior mới?
  [ ] Test name: should_[behavior]_when_[condition]?
  [ ] CI/CD pipeline PASSED? (đọc CI report, không tự đếm)

DOCUMENTATION & TRACEABILITY
  [ ] Code có cross-reference → [BR-X.Y.Z]?
  [ ] DEVLOG có entry cho milestone này?
  [ ] Nếu fix bug: BUGLOG có lesson learned chưa?
  [ ] RTM.md đã cập nhật?
  [ ] ARCH.md cập nhật nếu có architecture change?
  [ ] BR_MAP.md cập nhật nếu có BR mới?

FILE HEALTH (đọc CI/CD report, không tự đếm)
  [ ] CI báo file nào vượt 250 dòng? → đã JUSTIFIED-OVER-LIMIT chưa?
  [ ] CI báo file nào vượt 400 dòng? → BLOCK nếu chưa /split-plan
  [ ] Cross-reference IDs có orphan không?
```

---

## 7. WORKFLOW COMMANDS

Mỗi command có đủ: Input / Precondition / Output.

### /boot [L1|L2]

```
Input:       task level (L1 hoặc L2)
Precondition: task đã được xác định level
Output:      boot_report (schema §5.1)
Level:       L1+
```

### /plan [BR-X.Y.Z] [mô tả task]

```
Input:       BR ID + mô tả task ngắn
Precondition: boot_report đã xuất, task_level = L2
Output:      plan_report (schema §5.2), lưu vào plan.md
Level:       L2 only
```

### /implement [L1 | plan.md]

```
Input (L1):  "L1" + inline description từ bước plan
Input (L2):  đường dẫn plan.md đã được human approve
Precondition:
  L1: boot_report xuất + human nod nhận được
  L2: plan_report xuất + HUMAN APPROVAL GATE passed
Output:      code changes + tests
Level:       L1+
```

### /review [L1|L2]

```
Input:       task level + artifacts:
             - diff hoặc list files changed
             - boot_report
             - plan_report (L2 only)
             - CI/CD run report (L2: bắt buộc, L1: nếu có)
Precondition: /implement đã hoàn thành
Output:      review_report (schema §5.3)
             KHÔNG chứa human decision
Level:       L1+
```

### /handoff

```
Input:       review_report_A đã xuất + code diff + CI/CD status
Precondition: /review L2 đã hoàn thành, review_report_A đã có
Output:      file HANDOFF_[DEV-ID]_[DATE].md lưu vào /docs/handoffs/
             File này là input chuẩn cho AGENT-REVIEW-B (Claude)
Level:       L2 only
```

Nội dung file HANDOFF bắt buộc gồm đủ 5 sections:

```markdown
# HANDOFF — [DEV-ID] — [DATE]
## 1. CONTEXT
  task_level, br_references, arch_impact

## 2. CODE CHANGES
  list files thay đổi + diff hoặc nội dung file

## 3. REVIEW_REPORT_A
  toàn bộ output review_report_A từ Gemini

## 4. CI_CD_STATUS
  PASSED / FAILED / NOT_RUN + log tóm tắt nếu có

## 5. CÂU HỎI CHO REVIEW-B (optional)
  các điểm Gemini không chắc, muốn Claude đánh giá thêm
```

Sau khi tạo file HANDOFF, Gemini thông báo:
"HANDOFF file đã sẵn sàng tại docs/handoffs/HANDOFF_[DEV-ID]_[DATE].md
→ Upload file này vào Claude Project 'ANTIGRAVITY Review B' để lấy review_report_B."

---

### /sync

```
Input:       trạng thái session hiện tại
Precondition: review_report đã xuất (L1+), decision_record đã ghi (L2)
Output:      sync_report (schema §5.5) + cập nhật ANTIGRAVITY.md
             L2: cập nhật DEVLOG entry đầy đủ
Level:       L1+
```

### /log-bug [ID] [mô tả]

```
Input:       BUG ID + mô tả triệu chứng
Precondition: không cần
Output:      entry OPEN trong BUGLOG.md
Level:       L1+
```

### /log-fix [BUG-ID]

```
Input:       BUG ID đã có trong BUGLOG
Precondition: fix đã implement và test
Output:      entry CLOSED trong BUGLOG với Lesson Learned + PAT entry nếu có
Level:       L1+
```

### /rtm-update

```
Input:       list BR IDs đã implement trong session
Precondition: decision_record APPROVE đã ghi
Output:      RTM.md cập nhật rows liên quan
Level:       L2 only
```

### /split-plan [file]

```
Input:       đường dẫn file cần phân tích
Precondition: file tồn tại
Output:      đề xuất tách module: list modules mới + responsibility + dependencies
Level:       Bất kỳ
```

### /search [query]

```
Input:       query tìm kiếm
Precondition: không cần
Output:      kết quả từ official docs/changelog/repo release notes
             Không dùng blog/tutorial làm nguồn duy nhất
Level:       Bất kỳ
```

### /audit-docs

```
Input:       không cần
Precondition: không cần
Output:      report gồm: orphan IDs, broken cross-references, drift suspects,
             BR IDs chưa có ARCH ref, BR IDs chưa có RTM entry
Level:       Bất kỳ
```

---

## 8. EXECUTION RULES

```
RULE-01  Không đổi tên biến/hàm/class hiện có khi không được yêu cầu.
RULE-02  File 250–399 dòng → WARNING: ghi # JUSTIFIED-OVER-LIMIT: [lý do]
         File ≥ 400 dòng   → BLOCK: bắt buộc /split-plan trước khi tiếp tục
         Ngoại lệ hợp lệ:  test fixtures, schema definitions, generated files,
                            i18n files (phải có JUSTIFIED-OVER-LIMIT comment)
RULE-03  Xác minh SyntaxError trước khi xuất code.
RULE-04  Mỗi task chỉ xử lý một abstraction layer.
RULE-05  L1+ implementation kèm test tương ứng.
RULE-06  L2 code change phải có cross-reference ID (→ [BR-X], → [ARCH-X]).
RULE-07  Sau khi fix bug bất kỳ level → BẮT BUỘC /log-fix với Lesson Learned.
RULE-08  Dependency non-patch → BẮT BUỘC /search official docs trước,
         ghi ARCH.md sau. Nguồn hợp lệ: official docs, changelog, GitHub releases.
RULE-09  L1+ cuối phiên → BẮT BUỘC /sync.
RULE-10  L2 implementation không có BR reference → từ chối, yêu cầu BR trước.
RULE-11  CI/CD là nguồn đo lường metrics — agent không tự đếm.
RULE-12  Drift detected → báo DRIFT SUSPECTED, không tự sửa, chờ human.
RULE-13  review_report KHÔNG được chứa human_decision — đó là decision_record.
RULE-14  Evidence trong review phải dùng file_path + symbol + diff_hunk,
         không dùng line number đơn thuần.
RULE-15  BR_MAP.md phải được cập nhật khi thêm hoặc sửa bất kỳ BR entry.

RULE-16  Trước khi sửa file hiện có, agent PHẢI đọc toàn bộ import block
         + export usage liên quan của file đó. Nếu thay đổi tạo reference
         mới (symbol, component, hook, icon, type, util) — dù là symbol mới
         hoàn toàn hay symbol đã tồn tại nhưng ở vùng code agent chưa thấy —
         phải xuất lại import block đầy đủ sau chỉnh sửa.
         Xuất import_audit schema (§5.6) cho mọi file thay đổi.

RULE-17  Xác minh import integrity theo ngữ cảnh project:
         • TS/TSX project: chạy tsc --noEmit trước /review.
           KHÔNG dùng ESLint no-undef làm nguồn xác minh chính cho TypeScript
           (no-undef không dùng type information của TS, dễ báo sai).
         • JS/JSX project: bật ESLint no-undef + react/jsx-no-undef.
         Nếu project chưa cấu hình static check → báo thiếu toolchain,
         đề xuất cấu hình trước khi tiếp tục.
         missing_imports_found ≠ [] → BLOCK /review.

RULE-18  Review evidence cho lỗi missing import phải chỉ rõ:
         file_path + missing_symbol + expected_import_source.
         Ghi vào BUGLOG với PAT-IMPORT namespace nếu là pattern lặp lại.
```

---

## 9. ANTI-PATTERNS

```
✗ Bắt full boot cho L0/L1 không cần thiết
✗ Bỏ qua boot cho L2
✗ L2 implement không có BR reference
✗ Fix bug mà không /log-fix + Lesson Learned
✗ Merge L2 mà không qua dual review
✗ Ghi human_decision vào review_report (phải là decision_record riêng)
✗ Dùng line number đơn thuần làm evidence trong review
✗ Sửa ARCH.md mà không cập nhật RTM.md
✗ Thêm dependency non-patch mà không /search official docs
✗ Để cross-reference ID sai hoặc orphan
✗ Hardcode secret / credential bất kỳ level
✗ File ≥ 400 dòng không có /split-plan
✗ Agent tự đếm test coverage — phải đọc CI/CD report
✗ Tự sửa khi phát hiện drift — báo DRIFT SUSPECTED trước
✗ Dùng blog/tutorial làm nguồn duy nhất cho /search
✗ Thêm BR mới mà không cập nhật BR_MAP.md
✗ Đọc toàn bộ BR.md trong BOOT-LITE — dùng BR_MAP.md trước
✗ Bỏ qua /handoff trong L2 — Claude Review B cần file chuẩn, không nhận paste thủ công
✗ Sửa file hiện có mà không đọc import block trước (RULE-16)
✗ Thêm symbol mới mà không xuất lại import block đầy đủ (RULE-16)
✗ Dùng ESLint no-undef làm nguồn xác minh chính cho TS/TSX (RULE-17)
✗ Chạy /review khi missing_imports_found ≠ [] (RULE-17)
✗ Không xuất import_audit khi có file thay đổi (RULE-16)
```

---

## 10. QUICK REFERENCE

```
┌───────────────────────────────────────────────────────────────────┐
│                    ANTIGRAVITY v2.2 — QUICK REF                   │
├───────────────────────────────────────────────────────────────────┤
│  Xác định level TRƯỚC TIÊN: L0 / L1 / L2                         │
│                                                                   │
│  L0: implement thẳng → commit message rõ                         │
│                                                                   │
│  L1: /boot L1 → inline plan → human nod                          │
│      → /implement L1 → /review L1 → /sync                        │
│                                                                   │
│  L2: /boot L2 → /plan [BR-X.Y.Z] → HUMAN APPROVAL               │
│      → /implement plan.md → /review L2 → /handoff               │
│      → Claude Review B → human decision_record                   │
│      → /rtm-update → /sync                                       │
│                                                                   │
│  Fix bug:    /log-fix [BUG-ID] với Lesson Learned (mọi level)    │
│  New dep:    /search official → cài → ghi ARCH.md                │
│  New BR:     cập nhật BR.md + BR_MAP.md + RTM.md                 │
│  File 250+:  JUSTIFIED-OVER-LIMIT comment bắt buộc               │
│  File 400+:  /split-plan bắt buộc                                │
│  Drift:      DRIFT SUSPECTED → chờ human                         │
│  Secret:     env vars only                                        │
│                                                                   │
│  Priority: BR > ARCH > DEVLOG > BUGLOG > ANTIGRAVITY             │
├───────────────────────────────────────────────────────────────────┤
│  Schemas (§5):  boot · plan · review · decision · sync · import_audit │
│  review_report ≠ decision_record (hai artifact khác nhau)            │
│  Evidence format: file_path + symbol + diff_hunk                     │
│  Import check:  tsc --noEmit (TS) · no-undef (JS only)              │
│  CI/CD owns: coverage · line count · lint                            │
│  Agent owns: logic · security · traceability · import integrity      │
└───────────────────────────────────────────────────────────────────────┘
```

---

*Owner: Engineering Lead · v2.2.2 · 2025-Q2*
*Reviewed by: AGENT-REVIEW-A (ChatGPT) · AGENT-REVIEW-B (Gemini) · Human: APPROVED*
*Next milestone: v2.3 — State Machine (STATE_INIT → STATE_SYNCED)*
*Future: v3.0 — Tách SYSTEM_PROMPT / OPS_SOP / TEMPLATES / POLICY*
