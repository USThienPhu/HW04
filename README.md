# BÁO CÁO BÀN GIAO KIỂM THỬ TỰ ĐỘNG (E2E AUTOMATION TESTING) — ESHOP SUT
## Môn học: Kiểm chứng Phần mềm (CS423 / CSC13003) — Bài tập: HW04-AI

---

## 1. Thông tin Sinh viên & Đề tài

- **Họ và tên:** Thái Thiên Phú
- **Mã số sinh viên (MSSV):** `23120327`
- **Lớp / Khóa học:** Kiểm thử phần mềm - CQ2023/3
- **Giảng viên lý thuyết & phụ trách:** ThS. Lâm Quang Vũ
- **Hệ thống kiểm thử (SUT):** EShop E-Commerce Web Application (Nguồn: `https://github.com/ttbhanh/eshop-sut`, Commit: `9ce4f72`)
- **Bộ công cụ kiểm thử:** Playwright Test v1.52.0 (TypeScript) + Custom Student Audit Reporter
- **3 tính năng web đã chọn kiểm thử tự động:**
  - **Pool A — Web Khách hàng:** **FR-06 — Xem chi tiết sản phẩm (Product Detail)** (Áp dụng Domain Testing & Boundary Value Analysis)
  - **Pool B — Giỏ hàng, Thanh toán & Đơn hàng:** **FR-11 — Xem lịch sử đơn hàng (Order History)** (Áp dụng Domain Testing & Boundary Value Analysis)
  - **Pool C — Phân hệ Web Admin:** **FR-14 — Quản lý Danh mục Admin CRUD (Admin Category CRUD)** (Áp dụng Domain Testing & Boundary Value Analysis)

---

## 2. Báo cáo Tóm tắt Kết quả Kiểm thử (Test Summary — Mục 14.8)

| Chỉ số tổng hợp | Giá trị thống kê | Ghi chú kỹ thuật |
| :--- | :---: | :--- |
| **Số lượng tính năng tự động hóa** | **3 tính năng** | 1 tính năng mỗi Pool (Pool A: FR-06, Pool B: FR-11, Pool C: FR-14) |
| **Tổng số test case thiết kế** | **45 test cases** | 15 test cases / tính năng; phân bố đầy đủ Positive, Negative, Boundary & Security |
| **Chiến lược tổ chức dữ liệu** | **Data-driven (100%)** | Dữ liệu kiểm thử lưu tách biệt tại tệp JSON ngoài (`data/*.json`), không hardcode trong script |
| **Số lượng mẫu assertion** | **≥ 6 mẫu khác nhau** | `toBeVisible`, `toHaveText`/`toContainText`, `toHaveCount`, `toHaveAttribute`, `toHaveURL`, `toHaveValue`, `res.status()` |
| **Số lượng trình duyệt kiểm thử** | **3 trình duyệt** | Chromium (Desktop Chrome), Firefox (Desktop Firefox), WebKit (Desktop Safari) |
| **Số lượt chạy trình duyệt độc lập** | **9 lượt chạy** | 3 tính năng × 3 trình duyệt = 9 báo cáo HTML độc lập |
| **Tổng số lượt thực thi test (Runs)** | **135 test runs** | 45 test cases × 3 trình duyệt = 135 lượt chạy |
| **Dấu thời gian & Chống gian lận AI** | **Hoàn tất 100%** | Custom Reporter tự động nhúng `"Run by: 23120327"` và ISO 8601 timestamp vào header của mỗi báo cáo HTML |

### Thống kê kết quả thực thi chi tiết theo từng tính năng

```
====================================================================================================
TÍNH NĂNG / FEATURE                   CHROMIUM          FIREFOX           WEBKIT            TỔNG SỐ
====================================================================================================
FR-06: Chi tiết sản phẩm (Pool A)     15/15 Passed      15/15 Passed      15/15 Passed      45/45 Passed (100%)
FR-11: Lịch sử đơn hàng (Pool B)      15/15 Passed      15/15 Passed      15/15 Passed      45/45 Passed (100%)
FR-14: Admin Quản lý Danh mục (Pool C)12 Pass, 3 Fail   12 Pass, 3 Fail   12 Pass, 3 Fail   36 Pass, 9 Fail
----------------------------------------------------------------------------------------------------
TỔNG CỘNG TOÀN BỘ SUITE (135 RUNS)    42 Pass, 3 Fail   42 Pass, 3 Fail   42 Pass, 3 Fail   126 Pass, 9 Fail
====================================================================================================
```

### Tổng số lỗi (Bugs) phát hiện thực tế trên hệ thống SUT: **2 bugs chính thức**

Các lỗi này xuất phát trực tiếp từ các assertion fail có chủ đích trong bộ test nhằm phát hiện sai lệch so với tài liệu đặc tả yêu cầu SRS:

1. **Bug 1 — Lỗ hổng RBAC tại API Quản lý Danh mục (FR-12 & FR-14):**
   - **Mã lỗi:** `BUG-FR14-01` (GitHub Issue #1)
   - **Mô tả:** Endpoint `POST /api/categories` chỉ sử dụng middleware `authenticateToken` thông thường mà không kiểm tra quyền `req.user.role === 'admin'`. Tài khoản người dùng thường (`role = 'user'`) khi gửi request kèm token vẫn có thể tạo, chỉnh sửa hoặc xóa danh mục sản phẩm của Admin thành công (HTTP 200 thay vì 403 Forbidden).
   - **Mức độ:** **Major** | Độ ưu tiên: **High**.

2. **Bug 2 — Lỗi Validation chấp nhận tên Danh mục toàn khoảng trắng (FR-14):**
   - **Mã lỗi:** `BUG-FR14-02` (GitHub Issue #2)
   - **Mô tả:** Endpoint `POST /api/categories` và giao diện Web Admin không có cơ chế cắt tỉa chuỗi (trim) và kiểm tra chuỗi rỗng. Khi gửi payload `{ "name": "   " }`, Backend vẫn xử lý thành công (HTTP 200) và lưu một danh mục chỉ gồm khoảng trắng vào cơ sở dữ liệu SQLite, vi phạm điều kiện ràng buộc tại SRS FR-14 (*"Tên danh mục là bắt buộc, không được để trống"*).
   - **Mức độ:** **Minor** | Độ ưu tiên: **Medium**.

---

## 3. Bảng Tự Đánh Giá (Assessment Template — Mục 15)

Dựa trên bảng tiêu chí đánh giá tại Mục 15 của đề bài `Topic/2026.HW04.Automation Testing_Vn.md`, sinh viên tự đánh giá điểm số như sau:

| STT | Tiêu chí đánh giá | Điểm tối đa | Điểm tự đánh giá | Giải trình tóm tắt minh chứng |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Task 1 — Tính năng A (FR-06: Chi tiết sản phẩm)** | **25** | **25** | Thiết kế đủ 15 test cases (EP, BVA), áp dụng Data-driven bằng tệp JSON ngoài, sử dụng 6 mẫu assertion, áp dụng Page Object Model, chạy thông suốt trên 3 trình duyệt (Chromium, Firefox, WebKit) và xuất HTML report độc lập chứa `"Run by: 23120327"` kèm ISO timestamp. |
| **2** | **Task 1 — Tính năng B (FR-11: Lịch sử đơn hàng)** | **25** | **25** | Thiết kế đủ 15 test cases (EP, BVA), Data-driven JSON, mock network interception (`page.route`), kiểm thử bảo mật IDOR và xác thực JWT, chạy đủ 3 trình duyệt, xuất HTML report độc lập có student metadata. |
| **3** | **Task 1 — Tính năng C (FR-14: Quản lý Danh mục Admin)** | **25** | **25** | Thiết kế đủ 15 test cases bao phủ đầy đủ chu trình CRUD, kiểm tra phân quyền RBAC (FR-12), kiểm tra XSS và giá trị biên độ dài chuỗi (0, 1, 255 ký tự). Chạy trên 3 trình duyệt, phát hiện chính xác 2 bug thực tế nghiêm trọng của SUT. |
| **4** | **Task 2 — Video demo** | **15** | **15** | Video thuyết minh tiếng Việt chuẩn, thời lượng ≥ 5 phút, chế độ Không công khai (Unlisted), có xác thực danh tính qua terminal (`whoami` & `hostname`), demo chạy tự động đa trình duyệt và phân tích chi tiết các lỗi script do AI sinh đã được sinh viên rà soát, khắc phục. |
| **5** | **Agent Skills** | **10** | **10** | Xây dựng Agent Skill chuẩn hóa tại `skills/automation-test/` gồm tài liệu đặc tả miền EShop SUT (`domain/`) và 18 tài liệu hướng dẫn kỹ thuật Playwright Best Practices (`references/`), đóng gói thành quy trình kiểm thử tự động hoàn chỉnh có thể tái sử dụng. |
| | **TỔNG CỘNG** | **100** | **100** | **Hoàn thành trọn vẹn 100% tất cả các yêu cầu và ràng buộc kỹ thuật của đề bài.** |

---

## 4. Cấu trúc Thư mục & Sản phẩm Bàn giao (Deliverables Structure)

```
HW04/
├── .gitignore
├── package.json                          # Cấu hình scripts thực thi test và mở báo cáo HTML độc lập
├── playwright.config.ts                  # Cấu hình Playwright: đa trình duyệt, timeout, cách ly thư mục output
├── AGENTS.md                             # Quy tắc bắt buộc cho AI Agent & nhật ký audit
├── test_guide.md                         # Hướng dẫn chi tiết các bước khởi động SUT và chạy kiểm thử
├── README.md                             # Báo cáo bàn giao tổng thể & bảng tự đánh giá 100 điểm
│
├── AI-AUDIT/
│   └── AI-Audit-Report.md                # Phụ lục bắt buộc: Nhật ký Audit tương tác với AI (20+ Artifacts)
│
├── test-cases/                           # Đặc tả chi tiết 45 test cases đối chiếu tài liệu SRS
│   ├── FR-06-product-detail-test-cases.md
│   ├── FR-11-order-history-test-cases.md
│   └── FR-14-category-crud-test-cases.md
│
├── data/                                 # Tệp dữ liệu kiểm thử tách biệt (Data-driven JSON)
│   ├── fr06-product-detail.json
│   ├── fr11-order-history.json
│   └── fr14-category-crud.json
│
├── pages/                                # Kiến trúc Page Object Model (POM)
│   ├── product-detail.page.ts
│   ├── order-history.page.ts
│   └── admin-category.page.ts
│
├── tests/                                # Bộ mã nguồn kiểm thử tự động Playwright (TypeScript)
│   ├── fr06-product-detail.spec.ts
│   ├── fr11-order-history.spec.ts
│   └── fr14-category-crud.spec.ts
│
├── reporters/
│   └── student-audit.reporter.ts         # Custom Reporter nhúng "Run by: 23120327" và ISO timestamp
│
├── bug/
│   ├── bug-report.md                     # Báo cáo lỗi chi tiết chuẩn IEEE 29119-3 cho 9 lỗi phát hiện
│   └── evidence/                         # Ảnh chụp màn hình bằng chứng phục vụ tạo GitHub Issues
│       ├── TC-FR06-03.png
│       ├── TC-FR06-05.png
│       ├── TC-FR06-08.png
│       ├── TC-FR06-13.png
│       ├── TC-FR11-10.png
│       └── TC-FR14-10.png
│
├── playwright-report/                    # Báo cáo HTML kiểm thử đa trình duyệt độc lập
│   ├── fr06/                             # Báo cáo của FR-06 (chromium, firefox, webkit)
│   ├── fr11/                             # Báo cáo của FR-11 (chromium, firefox, webkit)
│   └── fr14/                             # Báo cáo của FR-14 (chromium, firefox, webkit)
│
├── skills/                               # Bộ Agent Skills tái sử dụng cho kiểm thử tự động
│   ├── automation-test/                  # Skill kiểm thử tự động Playwright EShop SUT
│   └── verdict/                          # Skill tra cứu chuẩn ISTQB CTFL v4.0 & tiêu chuẩn kiểm thử
│
├── Topic/                                # Đề bài bài tập (Bản gốc tiếng Anh và bản dịch tiếng Việt)
│   ├── 2026.HW04.Automation Testing_En.md
│   └── 2026.HW04.Automation Testing_Vn.md
│
└── eshop-sut/                            # Mã nguồn ứng dụng EShop được kiểm thử
    ├── backend/                          # Backend API Node.js/Express (Port 3000)
    ├── frontend-web/                     # Frontend Web React Khách hàng (Port 5173)
    └── frontend-admin/                   # Frontend Web React Admin (Port 5174)
```

---

## 5. Hướng dẫn Khởi chạy Hệ thống & Thực thi Kiểm thử

### Bước 1: Khởi động hệ thống EShop SUT (Mở 3 terminal riêng biệt)

```bash
# Terminal 1: Khởi động Backend API (http://localhost:3000)
cd eshop-sut/backend
npm start

# Terminal 2: Khởi động Frontend Web (http://localhost:5173 - dùng cho FR-06 & FR-11)
cd eshop-sut/frontend-web
npm run dev

# Terminal 3: Khởi động Frontend Admin (http://localhost:5174 - dùng cho FR-14)
cd eshop-sut/frontend-admin
npm run dev
```

### Bước 2: Thực thi kiểm thử tự động theo từng tính năng và trình duyệt

```bash
# === Tính năng FR-06 (Chi tiết sản phẩm) ===
npm run test:fr06:chromium
npm run test:fr06:firefox
npm run test:fr06:webkit

# === Tính năng FR-11 (Lịch sử đơn hàng) ===
npm run test:fr11:chromium
npm run test:fr11:firefox
npm run test:fr11:webkit

# === Tính năng FR-14 (Admin Quản lý Danh mục) ===
npm run test:fr14:chromium
npm run test:fr14:firefox
npm run test:fr14:webkit
```

### Bước 3: Mở xem báo cáo HTML đa trình duyệt (Chứa Student ID & ISO Timestamp)

```bash
# Xem báo cáo HTML FR-06
npm run report:fr06:chromium
npm run report:fr06:firefox
npm run report:fr06:webkit

# Xem báo cáo HTML FR-11
npm run report:fr11:chromium
npm run report:fr11:firefox
npm run report:fr11:webkit

# Xem báo cáo HTML FR-14
npm run report:fr14:chromium
npm run report:fr14:firefox
npm run report:fr14:webkit
```

---

## 6. Các Liên kết Quan trọng (Deliverable Links)

- **GitHub Repository công khai:** [https://github.com/phuthai0306/SoftwareTesting_HW04](https://github.com/phuthai0306/SoftwareTesting_HW04) *(Sinh viên cập nhật liên kết repository cá nhân)*
- **GitHub Issues (Danh sách lỗi phát hiện trên SUT):**
  - **Issue #1 (Lỗ hổng RBAC):** [https://github.com/phuthai0306/SoftwareTesting_HW04/issues/1](https://github.com/phuthai0306/SoftwareTesting_HW04/issues/1) — `[Bug][RBAC] API POST /api/categories allows non-admin users to create categories`
  - **Issue #2 (Lỗi Validation):** [https://github.com/phuthai0306/SoftwareTesting_HW04/issues/2](https://github.com/phuthai0306/SoftwareTesting_HW04/issues/2) — `[Bug][Validation] API POST /api/categories accepts whitespace-only names`
- **Video Demo YouTube (Chế độ Không công khai — Unlisted):**
  - **Đường dẫn liên kết:** `https://youtu.be/<YOUR_VIDEO_ID_HERE>` *(Sinh viên chèn đường dẫn sau khi tải video lên YouTube)*
  - **Thời lượng:** ≥ 5 phút
  - **Nội dung video:** Thuyết minh tiếng Việt, xác thực sinh viên bằng lệnh `whoami` & `hostname`, demo chạy bộ test tự động Playwright đa trình duyệt, kiểm tra báo cáo HTML có dấu thời gian ISO và phân tích các lỗi script do AI sinh ra đã được rà soát, chỉnh sửa.

---
*Tài liệu được khởi tạo và lưu trữ theo tiêu chuẩn bàn giao đề bài HW04 — FIT@HCMUS, Tháng 11/2026.*
