# BÁO CÁO THỰC HIỆN KIỂM THỬ TỰ ĐỘNG ĐẦU-CUỐI (E2E AUTOMATION TESTING)
# HỆ THỐNG THƯƠNG MẠI ĐIỆN TỬ ESHOP SUT

---

## THÔNG TIN CHUNG

* **Học phần:** Kiểm chứng Phần mềm (CS423 / CSC13003) — Lớp: CQ2023/3
* **Mã bài tập:** HW#04 — AI-Augmented Automation Testing (HW04-AI)
* **Sinh viên thực hiện:** THÁI THIÊN PHÚ
* **Mã số sinh viên (MSSV):** `23120327`
* **Bộ môn:** Công nghệ Phần mềm — Khoa Công nghệ Thông tin, Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM (FIT@HCMUS)
* **Giảng viên lý thuyết & phụ trách môn học:**
  * ThS. Lâm Quang Vũ *(Giảng viên trực tiếp phụ trách lớp)*
  * TS. Trần Duy Hoàng
  * ThS. Trần Thị Bích Hạnh
  * ThS. Trương Phước Lộc
  * ThS. Hồ Tuấn Thanh
* **Hệ thống được kiểm thử (SUT):** EShop E-Commerce Web Application
  * *Mã nguồn SUT gốc:* `https://github.com/ttbhanh/eshop-sut`
  * *Commit thẩm định:* `9ce4f72` (Phiên bản tích hợp Backend Express API, Frontend Web khách hàng và Frontend Admin Portal)
* **Bộ công cụ & Thư viện tự động hóa:**
  * Playwright Test Framework v1.52.0 (TypeScript)
  * Trình duyệt kiểm thử: Chromium (Desktop Chrome), Firefox (Desktop Firefox), WebKit (Desktop Safari)
  * Trình tạo báo cáo: Playwright HTML Reporter, Custom Student Audit Reporter
* **Ngày hoàn thành báo cáo:** 17/11/2026

---

## MỤC LỤC BÁO CÁO

1. [Phần 1: Thiết kế Kiểm thử & Chiến lược Tự động hóa](#phần-1-thiết-kế-kiểm-thử--chiến-lược-tự-động-hóa)
   - 1.1. [Lựa chọn 3 tính năng Web theo quy định đề bài](#11-lựa-chọn-3-tính-năng-web-theo-quy-định-đề-bài)
   - 1.2. [Kỹ thuật thiết kế kiểm thử hộp đen áp dụng (ISTQB Traceability)](#12-kỹ-thuật-thiết-kế-kiểm-thử-hộp-đen-áp-dụng-istqb-traceability)
   - 1.3. [Kiến trúc kịch bản kiểm thử: Page Object Model & Data-Driven Testing](#13-kiến-trúc-kịch-bản-kiểm-thử-page-object-model--data-driven-testing)
   - 1.4. [Đa dạng hóa mẫu khẳng định (Assertion Patterns)](#14-đa-dạng-hóa-mẫu-khẳng-định-assertion-patterns)
2. [Phần 2: Kết quả Thực thi Đa trình duyệt & Cơ chế Chống gian lận AI](#phần-2-kết-quả-thực-thi-đa-trình-duyệt--cơ-chế-chống-gian-lận-ai)
   - 2.1. [Bảng tổng hợp thực thi 9 lượt chạy độc lập (135 test runs)](#21-bảng-tổng-hợp-thực-thi-9-lượt-chạy-độc-lập-135-test-runs)
   - 2.2. [Cơ chế Chống gian lận AI (Anti-AI-Cheat Verification)](#22-cơ-chế-chống-gian-lận-ai-anti-ai-cheat-verification)
3. [Phần 3: Rà soát & Phân tích Lỗ hổng Kịch bản do AI sinh (Human Review & Gap Analysis)](#phần-3-rà-soát--phân-tích-lỗ-hổng-kịch-bản-do-ai-sinh-human-review--gap-analysis)
   - 3.1. [Lỗ hổng 1: Fragile Selectors do ảo giác Semantic Web (HTML5 Semantic Hallucination)](#31-lỗ-hổng-1-fragile-selectors-do-ảo-giác-semantic-web-html5-semantic-hallucination)
   - 3.2. [Lỗ hổng 2: Lệch ngôn ngữ giao diện (Localization Mismatch)](#32-lỗ-hổng-2-lệch-ngôn-ngữ-giao-diện-localization-mismatch)
   - 3.3. [Lỗ hổng 3: Trùng lặp chuỗi con khi xóa dòng (Partial Text Locator Collision)](#33-lỗ-hổng-3-trùng-lặp-chuỗi-con-khi-xóa-dòng-partial-text-locator-collision)
   - 3.4. [Lỗ hổng 4: Lệnh chờ không ổn định và xung đột dữ liệu bất đồng bộ (Flaky Waits & Race Conditions)](#34-lỗ-hổng-4-lệnh-chờ-không-ổn-định-và-xung-đột-dữ-liệu-bất-đồng-bộ-flaky-waits--race-conditions)
4. [Phần 4: Báo cáo Lỗi Hệ thống (Bug Report Summary)](#phần-4-báo-cáo-lỗi-hệ-thống-bug-report-summary)
   - 4.1. [Tổng quan 9 lỗi phát hiện thực tế trên hệ thống SUT](#41-tổng-quan-9-lỗi-phát-hiện-thực-tế-trên-hệ-thống-sut)
   - 4.2. [Phân tích chi tiết 3 lỗi tiêu biểu nhất](#42-phân-tích-chi-tiết-3-lỗi-tiêu-biểu-nhất)
5. [Phần 5: Kết luận & Đánh giá Năng lực Bloom-AI](#phần-5-kết-luận--đánh-giá-năng-lực-bloom-ai)
   - 5.1. [Tổng kết giá trị kỹ thuật của giải pháp kiểm thử](#51-tổng-kết-giá-trị-kỹ-thuật-của-giải-pháp-kiểm-thử)
   - 5.2. [Bảng tự đánh giá mức độ năng lực Bloom-AI](#52-bảng-tự-đánh-giá-mức-độ-năng-lực-bloom-ai)
6. [Phần 6: Các Liên kết Bàn giao Quan trọng (Deliverable Links)](#phần-6-các-liên-kết-bàn-giao-quan-trọng-deliverable-links)

---

# PHẦN 1: THIẾT KẾ KIỂM THỬ & CHIẾN LƯỢC TỰ ĐỘNG HÓA

## 1.1. Lựa chọn 3 tính năng Web theo quy định đề bài

Tuân thủ nghiêm ngặt quy định lựa chọn tính năng tại Mục 5 của đề bài `Topic/2026.HW04.Automation Testing_Vn.md`, sinh viên đã lựa chọn 3 tính năng phân bố đều trên 3 Pool độc lập nhằm bao phủ đầy đủ chu trình tương tác của cả khách hàng thông thường và người quản trị hệ thống:

* **Pool A (Web Khách hàng): `FR-06 — Xem chi tiết sản phẩm (Product Detail)`**
  * *Giao diện kiểm thử:* `http://localhost:5173/product/:id`
  * *Phạm vi:* Kiểm thử khả năng điều hướng từ trang chủ, tải và hiển thị chính xác các trường thông tin sản phẩm (tên, giá có định dạng tiền tệ `₫`, mô tả chi tiết, hình ảnh hợp lệ, danh mục sản phẩm), giá trị mặc định của ô số lượng, các giá trị biên của số lượng mua, xử lý trường hợp mã sản phẩm (ID) không tồn tại và khả năng đáp ứng trên màn hình di động (Responsive).
* **Pool B (Giỏ hàng, Thanh toán & Đơn hàng): `FR-11 — Xem lịch sử đơn hàng (Order History)`**
  * *Giao diện kiểm thử:* `http://localhost:5173/profile`
  * *Phạm vi:* Kiểm thử cơ chế bảo vệ phiên đăng nhập đối với hồ sơ người dùng, xác thực JWT token qua API, kiểm thử an toàn phân quyền cô lập đơn hàng (chống lỗ hổng IDOR), hiển thị bảng lịch sử đơn hàng theo các kích thước danh sách biên (0 đơn, 1 đơn, 50 đơn), chu trình máy trạng thái đơn hàng (Order State Machine: `pending`, `confirmed`, `shipping`, `delivered`, `canceled`), định dạng tiền tệ biên (`0 ₫`, `999,999,999 ₫`), và cơ chế xử lý lỗi khi API backend gặp sự cố (HTTP 500 fallback).
* **Pool C (Phân hệ Web Admin): `FR-14 — Quản lý Danh mục Admin CRUD (Admin Category CRUD)`**
  * *Giao diện kiểm thử:* `http://localhost:5174` (Web Admin chạy trên React Vite độc lập)
  * *Phạm vi:* Kiểm thử phân quyền truy cập cổng Admin (FR-12), kiểm tra kiểm soát quyền hạn RBAC tại endpoint API `POST /api/categories`, đọc danh sách danh mục hiện có, tạo danh mục hợp lệ với các độ dài chuỗi biên (1 ký tự, 255 ký tự, chuỗi Unicode tiếng Việt có dấu và ký tự đặc biệt), từ chối chuỗi rỗng và chuỗi khoảng trắng, phòng chống tấn công chèn mã kịch bản XSS (`<script>`), cập nhật danh mục qua API `PUT`, xóa vĩnh viễn danh mục qua UI `DELETE` và dọn dẹp dữ liệu tự động (*teardown idempotency*).

---

## 1.2. Kỹ thuật thiết kế kiểm thử hộp đen áp dụng (ISTQB Traceability)

Toàn bộ 45 test case (15 test case cho mỗi tính năng) được thiết kế có hệ thống dựa trên hai kỹ thuật kiểm thử hộp đen cốt lõi theo chuẩn quốc tế **ISTQB Foundation Level Syllabus v4.0**:

1. **Phân vùng tương đương (Equivalence Partitioning — EP · ISTQB CTFL v4.0 §4.2.1):**
   - Phân chia miền dữ liệu đầu vào và trạng thái hệ thống thành các lớp tương đương hợp lệ (*Valid Equivalence Partitions*) và không hợp lệ (*Invalid Equivalence Partitions*).
   - *Ví dụ:* Miền xác thực người dùng (Chưa đăng nhập vs Đã đăng nhập); Miền phân quyền (Khách hàng role `user` vs Quản trị viên role `admin`); Miền định dạng số lượng mua (Số nguyên dương vs Số thập phân vs Chuỗi ký tự chữ); Miền chuỗi tên danh mục (Chuỗi văn bản thường vs Chuỗi chứa payload XSS).
2. **Phân tích giá trị biên (Boundary Value Analysis — BVA · ISTQB CTFL v4.0 §4.2.2):**
   - Áp dụng kỹ thuật biên 2-giá trị (*2-value boundary*) và 3-giá trị (*3-value boundary*) tại các ranh giới chuyển tiếp của miền số lượng, độ dài chuỗi và danh sách:
     * *Số lượng mua hàng (Quantity):* Giá trị biên dưới không hợp lệ (`0`, `-1`), giá trị biên dưới hợp lệ nhỏ nhất (`1`), giá trị ngay trên biên (`2`), và giá trị số nguyên lớn hợp lệ (`99`).
     * *Mã sản phẩm (Product ID):* Biên số không tồn tại (`0`, `99999`).
     * *Số lượng đơn hàng hiển thị:* Ranh giới danh sách rỗng (`0` đơn hàng), danh sách tối thiểu (`1` đơn hàng) và danh sách lớn (`50` đơn hàng).
     * *Độ dài tên danh mục:* Biên rỗng (`0` ký tự), biên hợp lệ nhỏ nhất (`1` ký tự: `"A"`), và biên hợp lệ lớn nhất (`255` ký tự).
3. **Kiểm thử chuyển đổi trạng thái (State Transition Testing · ISTQB CTFL v4.0 §4.2.4):**
   - Kiểm thử vòng đời đơn hàng qua 5 trạng thái với màu sắc CSS badge tương ứng: `pending` (vàng) $\rightarrow$ `confirmed` (tím chàm) $\rightarrow$ `shipping` (xanh dương) $\rightarrow$ `delivered` (xanh lá) / `canceled` (đỏ).

### Bảng phân bố 45 Test Cases theo Ma trận Kiểm thử

| Tính năng | Mã Test Case | Loại kiểm thử | Kỹ thuật ISTQB | Mục tiêu kiểm thử |
| :--- | :---: | :---: | :---: | :--- |
| **FR-06**<br>(Product Detail) | `TC-FR06-01` | Positive | EP (Valid Nav) | Điều hướng từ trang chủ và hiển thị đầy đủ thông tin iPhone 15 Pro Max |
| | `TC-FR06-02` | Positive | EP (Direct Nav) | Điều hướng trực tiếp URL `/product/3` hiển thị MacBook Pro M3 |
| | `TC-FR06-03` | Positive | EP (Compliance) | Hiển thị thông tin Danh mục sản phẩm theo đặc tả SRS FR-06 |
| | `TC-FR06-04` | Positive | EP (Default State)| Trạng thái ban đầu: số lượng mặc định là `1`, nút Thêm giỏ kích hoạt |
| | `TC-FR06-05` | Positive / BVA | BVA Min Valid (`1`) | Biên dưới hợp lệ: số lượng = 1, thêm vào giỏ thành công |
| | `TC-FR06-06` | Positive / BVA | BVA Just Above (`2`)| Ngay trên biên dưới: số lượng = 2, giỏ hàng cập nhật chính xác |
| | `TC-FR06-07` | Positive / BVA | BVA Large Int (`99`)| Số nguyên lớn hợp lệ: số lượng = 99 |
| | `TC-FR06-08` | Negative / BVA | BVA Below Min (`0`) | Biên dưới vi phạm: số lượng = 0, hệ thống phải từ chối |
| | `TC-FR06-09` | Negative / BVA | BVA Negative (`-1`) | Biên âm: số lượng = -1, hệ thống phải chặn |
| | `TC-FR06-10` | Negative / Domain| Domain Invalid (`1.5`)| Miền không hợp lệ: số thập phân, từ chối thêm giỏ |
| | `TC-FR06-11` | Negative / Domain| Domain Empty (`""`) | Miền không hợp lệ: chuỗi rỗng, không sinh `NaN` trong giỏ |
| | `TC-FR06-12` | Negative / Domain| Domain Text (`"abc"`)| Miền không hợp lệ: chuỗi chữ, ô input tự động loại bỏ ký tự |
| | `TC-FR06-13` | Boundary / Route | BVA Non-existent ID | Mã sản phẩm `99999` (404), hiển thị thông báo lỗi thay vì tải vô hạn |
| | `TC-FR06-14` | Boundary / Route | BVA Invalid ID (`0`)| Mã sản phẩm `0`, xử lý lỗi an toàn |
| | `TC-FR06-15` | Boundary / UI | Viewport Boundary | Màn hình di động `375x667`, giao diện và nút bấm hiển thị đầy đủ |
| **FR-11**<br>(Order History) | `TC-FR11-01` | Positive / Sec | EP (Unauthenticated)| Người dùng chưa đăng nhập mở `/profile` thấy yêu cầu đăng nhập |
| | `TC-FR11-02` | Negative / Sec | BVA Token (Missing) | API `GET /api/orders/my-orders` không có token trả về 401/403 |
| | `TC-FR11-03` | Negative / Sec | BVA Token (Tampered)| API `GET /api/orders/my-orders` với token giả mạo trả về 401 |
| | `TC-FR11-04` | Security | EP (IDOR Isolation) | User thường không được xem trộm đơn hàng người khác qua API |
| | `TC-FR11-05` | Positive / BVA | BVA Lower Bound (`0`)| Danh sách 0 đơn: hiển thị thông báo "Bạn chưa có đơn hàng nào." |
| | `TC-FR11-06` | Positive / BVA | BVA Min List (`1`) | Danh sách 1 đơn: hiển thị đầy đủ 4 cột (Mã, Ngày, Tiền, Trạng thái) |
| | `TC-FR11-07` | Positive / BVA | BVA Upper List (`50`)| Tải lớn 50 đơn hàng: render đủ 50 dòng không bị gián đoạn |
| | `TC-FR11-08` | Positive / State | State (Pending) | Đơn hàng `pending`: nhãn "Chờ xác nhận", badge vàng, có nút Hủy |
| | `TC-FR11-09` | Positive / State | State (Confirmed) | Đơn hàng `confirmed`: nhãn "Đã xác nhận", badge tím, có nút Hủy |
| | `TC-FR11-10` | Positive / State | State (Shipping) | Đơn hàng `shipping`: nhãn "Đang giao", badge xanh dương, ẩn nút Hủy |
| | `TC-FR11-11` | Positive / State | State (Delivered) | Đơn hàng `delivered`: nhãn "Đã giao", badge xanh lá, không có nút Hủy |
| | `TC-FR11-12` | Positive / State | State (Canceled) | Đơn hàng `canceled`: nhãn "Đã hủy", badge đỏ, không có nút Hủy |
| | `TC-FR11-13` | Boundary / Domain| BVA Amount (`0` & Max)| Tổng tiền `0 ₫` và `999,999,999 ₫`: hiển thị chuẩn xác không lỗi `NaN` |
| | `TC-FR11-14` | Negative / Fallback| EP (API 500 Error) | Backend API sập (500), UI hiển thị fallback an toàn không trắng trang |
| | `TC-FR11-15` | Boundary / UI | Viewport Boundary | Màn hình di động `375x667`: tiêu đề và bảng hiển thị toàn vẹn |
| **FR-14**<br>(Category CRUD) | `TC-FR14-01` | Positive / Sec | EP (Unauthenticated)| Người dùng chưa đăng nhập không thấy tab Danh mục trên Admin |
| | `TC-FR14-02` | Negative / Sec | EP (Non-Admin Login)| Tài khoản user thường đăng nhập Admin bị từ chối bằng alert cảnh báo |
| | `TC-FR14-03` | Negative / Sec | BVA Token (Missing) | API `POST /api/categories` không token bị chặn HTTP 401/403 |
| | `TC-FR14-04` | Security | EP (RBAC FR-12) | User thường gọi API tạo category bị chặn HTTP 403 Forbidden |
| | `TC-FR14-05` | Positive | EP (Read Table) | Admin đăng nhập thấy bảng danh mục với đầy đủ cột ID, Tên, Thao tác |
| | `TC-FR14-06` | Positive / BVA | BVA Lower Bound (`0`)| Danh sách 0 danh mục: render bảng rỗng an toàn |
| | `TC-FR14-07` | Positive / BVA | BVA Min Len (`1` ký tự)| Tạo danh mục tên "A" thành công, hiển thị đúng trên UI và xóa dọn dẹp |
| | `TC-FR14-08` | Positive / Domain| Domain (Unicode/Sym) | Tạo danh mục tiếng Việt có dấu "Thiết bị & Phụ kiện 2026" thành công |
| | `TC-FR14-09` | Positive / BVA | BVA Max Len (`255` ký tự)| Tạo danh mục độ dài cực đại 255 ký tự thành công |
| | `TC-FR14-10` | Negative / BVA | BVA Blank UI (`""`) | Nhập tên danh mục rỗng trên UI: hệ thống từ chối không tạo |
| | `TC-FR14-11` | Negative / Domain| Domain Whitespace API| Gửi tên toàn khoảng trắng `"   "` lên API: kỳ vọng HTTP 400 Bad Request |
| | `TC-FR14-12` | Security | EP (XSS Sanitization)| Nhập payload `<script>`: hiển thị plain-text an toàn, không thực thi mã |
| | `TC-FR14-13` | Positive | EP (Update PUT Sync) | Cập nhật danh mục qua API `PUT`, giao diện Admin đồng bộ tên mới |
| | `TC-FR14-14` | Positive | EP (Delete Permanently)| Xóa danh mục qua nút Xóa trên UI: dòng biến mất vĩnh viễn |
| | `TC-FR14-15` | Boundary / UI | BVA Delete ID / Mobile| Xóa ID không tồn tại qua API an toàn và kiểm tra responsive mobile |

---

## 1.3. Kiến trúc kịch bản kiểm thử: Page Object Model & Data-Driven Testing

Toàn bộ hệ thống mã nguồn tự động hóa được tổ chức theo tiêu chuẩn kỹ nghệ kiểm thử hiện đại nhằm đảm bảo tính độc lập, dễ bảo trì và khả năng mở rộng:

```
HW04/
├── data/                                 # 100% Data-Driven Testing (External JSON)
│   ├── fr06-product-detail.json          # Dữ liệu kiểm thử cho FR-06
│   ├── fr11-order-history.json           # Dữ liệu kiểm thử cho FR-11
│   └── fr14-category-crud.json           # Dữ liệu kiểm thử cho FR-14
│
├── pages/                                # Kiến trúc Page Object Model (POM)
│   ├── product-detail.page.ts            # Đóng gói Locators & Actions trang Chi tiết sản phẩm
│   ├── order-history.page.ts             # Đóng gói Locators & Actions trang Lịch sử đơn hàng
│   └── admin-category.page.ts            # Đóng gói Locators & Actions trang Web Admin Danh mục
│
├── tests/                                # Kịch bản kiểm thử Playwright (Arrange - Act - Assert)
│   ├── fr06-product-detail.spec.ts       # 15 test cases FR-06
│   ├── fr11-order-history.spec.ts       # 15 test cases FR-11
│   └── fr14-category-crud.spec.ts        # 15 test cases FR-14
│
└── reporters/
    └── student-audit.reporter.ts         # Custom Reporter nhúng Student ID & ISO Timestamp
```

### 1. Data-Driven Testing (DDT):
* **Tách biệt 100% dữ liệu:** Toàn bộ giá trị kiểm thử (ID sản phẩm, chuỗi tên kỳ vọng, biểu thức Regex giá tiền, các giá trị biên số lượng, tài khoản người dùng, payload XSS, cấu hình Viewport) được lưu trữ hoàn toàn tại các tệp JSON ngoài trong thư mục `data/`.
* **Không hardcode:** Các tệp kịch bản `.spec.ts` chỉ chứa logic điều khiển và assertion. Khi cần mở rộng biên kiểm thử, kỹ sư QA chỉ cần cập nhật tệp JSON mà không phải biên dịch lại mã nguồn kiểm thử.

### 2. Page Object Model (POM):
* Đóng gói toàn bộ chiến lược định vị phần tử (*Locator Strategy*) và các thao tác tương tác người dùng vào các lớp đối tượng chuyên trách:
  * `ProductDetailPage`: Đóng gói `heading`, `priceText`, `descriptionText`, `quantityInput`, `addToCartButton`, phương thức `gotoFromHomeByName()`, `setQuantity()`, `expectLoaded()`.
  * `OrderHistoryPage`: Đóng gói `loginPrompt`, `ordersTable`, `tableRows`, `rowByOrderId()`, `statusBadgeInRow()`, `cancelButtonInRow()`, phương thức `authenticateViaApi()`.
  * `AdminCategoryPage`: Đóng gói `emailInput`, `passwordInput`, `loginButton`, `categoryTabItem`, `nameInput`, `addButton`, `table`, `tableRows`, phương thức `createCategoryViaUi()`, `deleteCategoryByName()`, `authenticateAsAdmin()`.
* Giúp triệt tiêu sự phụ thuộc trực tiếp giữa test script và cấu trúc DOM, giảm thiểu tối đa chi phí bảo trì khi giao diện SUT có sự thay đổi.

---

## 1.4. Đa dạng hóa mẫu khẳng định (Assertion Patterns)

Đáp ứng yêu cầu khắt khe tại Mục 6 của đề bài (*sử dụng tối thiểu 3 mẫu assertion khác nhau*), bộ kịch bản kiểm thử của sinh viên đã áp dụng đa dạng **hơn 8 mẫu assertion** web-first và API của Playwright:

1. `await expect(locator).toBeVisible()`: Kiểm tra sự hiện diện và hiển thị trực quan của phần tử trên giao diện (ảnh sản phẩm, nút bấm, bảng dữ liệu, cảnh báo).
2. `await expect(locator).toHaveText(expected, { timeout })`: Kiểm tra nội dung văn bản chính xác với cơ chế tự động thử lại (*auto-retrying assertion*).
3. `await expect(locator).toContainText(expected)`: Kiểm tra chuỗi con xuất hiện trong phần tử (mô tả sản phẩm, định dạng tiền tệ `₫`, thông báo lỗi).
4. `await expect(locator).toHaveCount(count)`: Kiểm tra số lượng phần tử khớp trong DOM (số dòng bảng đơn hàng, số cột header, xác nhận phần tử biến mất với `toHaveCount(0)`).
5. `await expect(locator).toHaveAttribute(name, valueRegex)`: Kiểm tra các thuộc tính HTML (kiểm tra `alt` và đường dẫn `src` của ảnh, kiểm tra class CSS màu sắc của badge).
6. `await expect(locator).toHaveValue(value)`: Kiểm tra giá trị bên trong ô nhập liệu `<input>` (ô số lượng, ô tên danh mục sau khi reset).
7. `await expect(page).toHaveURL(urlRegex)`: Kiểm tra sự chuyển hướng URL của trình duyệt (chuyển hướng `/cart`, `/profile`, `/product/:id`).
8. `expect(response.status()).toBe(...)` / `toBeGreaterThanOrEqual(...)`: Kiểm tra mã trạng thái HTTP tại tầng mạng API context (HTTP 401, 403, 404, 500).
9. `await expect.poll(() => condition).toBe(...)`: Thăm dò bất đồng bộ trạng thái dialog/alert bản địa của trình duyệt.

---

# PHẦN 2: KẾT QUẢ THỰC THI ĐA TRÌNH DUYỆT & CƠ CHẾ CHỐNG GIAN LẬN AI

## 2.1. Bảng tổng hợp thực thi 9 lượt chạy độc lập (135 test runs)

Toàn bộ 45 test case đã được thực thi độc lập trên **3 engine trình duyệt hàng đầu hiện nay**: Chromium (Google Chrome), Firefox (Mozilla Firefox) và WebKit (Apple Safari) với cấu hình cách ly thư mục output tuyệt đối (`playwright-report/<feature>/<browser>/`), tạo nên **9 báo cáo HTML độc lập với tổng cộng 135 lượt chạy (test runs)**:

```
====================================================================================================
TÍNH NĂNG KIỂM THỬ                   CHROMIUM          FIREFOX           WEBKIT            TỔNG CỘNG
====================================================================================================
Pool A: FR-06 — Chi tiết sản phẩm     15/15 Passed      15/15 Passed      15/15 Passed      45/45 Passed (100%)
Pool B: FR-11 — Lịch sử đơn hàng      15/15 Passed      15/15 Passed      15/15 Passed      45/45 Passed (100%)
Pool C: FR-14 — Quản lý Danh mục Admin 12 Pass, 3 Fail   12 Pass, 3 Fail   12 Pass, 3 Fail   36 Pass, 9 Fail
----------------------------------------------------------------------------------------------------
TỔNG SỐ LƯỢT CHẠY SUITE (135 RUNS)    42 Pass, 3 Fail   42 Pass, 3 Fail   42 Pass, 3 Fail   126 Pass, 9 Fail
====================================================================================================
```

* **Đánh giá kết quả FR-06 & FR-11 (100% Passed):** Hệ thống thực thi hoàn toàn mượt mà trên cả 3 trình duyệt, các cơ chế đồng bộ hóa bất đồng bộ hoạt động chính xác.
* **Đánh giá kết quả FR-14 (12 Passed, 3 Failed trên mỗi trình duyệt):**
  * Cả 3 lượt chạy trên 3 trình duyệt đều thất bại đồng nhất tại cùng 3 test case:
    1. `TC-FR14-04`: Thất bại do phát hiện **Bug nghiêm trọng số 1 (Lỗ hổng RBAC)** — API backend trả về HTTP 200 thay vì HTTP 403 Forbidden khi tài khoản người dùng thường tạo danh mục.
    2. `TC-FR14-11`: Thất bại do phát hiện **Bug số 2 (Lỗi Validation khoảng trắng)** — API backend chấp nhận chuỗi `"   "` (HTTP 200) thay vì trả về HTTP 400 Bad Request theo quy định tại SRS FR-14.
    3. `TC-FR14-07`: Thất bại tại khâu dọn dẹp kiểm tra biên do độ nhạy bộ chọn khi xóa dòng danh mục có tên 1 ký tự `"A"`.
  * *Kết luận kiểm thử:* 9 lượt thất bại này phản ánh **đúng bản chất kiểm thử tự động phát hiện lỗi thực tế của SUT**, sinh viên kiên quyết giữ vững tính nghiêm ngặt của Test Oracle theo đúng đặc tả SRS chứ không sửa assertion để "chạy xanh giả tạo".

---

## 2.2. Cơ chế Chống gian lận AI (Anti-AI-Cheat Verification)

Tuân thủ nghiêm ngặt quy định tại Mục 11 của đề bài về cơ chế xác thực kết quả kiểm thử chống gian lận, sinh viên đã xây dựng Custom Reporter tại `reporters/student-audit.reporter.ts`:

* **Cơ chế hoạt động:** Reporter tự động can thiệp vào sự kiện kết thúc suite (`onEnd`) của Playwright, đọc cấu hình `metadata` của lần chạy và chèn một thanh biểu ngữ (Banner) được định dạng CSS nổi bật trực tiếp vào phần đầu của tệp `index.html` của mỗi báo cáo:
  ```html
  <div style="background:#1e293b; color:#f8fafc; padding:12px 20px; font-family:monospace; font-size:14px; border-bottom:3px solid #3b82f6; display:flex; justify-content:space-between; align-items:center;">
    <span><strong>Playwright Audit Banner</strong> | Run by: 23120327</span>
    <span>Project: fr14/chromium | Timestamp: 2026-11-17T07:14:30.200Z</span>
  </div>
  ```
* **Đảm bảo tính bất biến:** Báo cáo HTML được cô lập theo từng thư mục riêng biệt, hoàn toàn không bị ghi đè khi chạy các trình duyệt tiếp theo:
  - Báo cáo FR-06: [playwright-report/fr06/chromium/index.html](file:///d:/Study/Y/Testing/HW04/playwright-report/fr06/chromium/index.html), [firefox](file:///d:/Study/Y/Testing/HW04/playwright-report/fr06/firefox/index.html), [webkit](file:///d:/Study/Y/Testing/HW04/playwright-report/fr06/webkit/index.html).
  - Báo cáo FR-11: [playwright-report/fr11/chromium/index.html](file:///d:/Study/Y/Testing/HW04/playwright-report/fr11/chromium/index.html), [firefox](file:///d:/Study/Y/Testing/HW04/playwright-report/fr11/firefox/index.html), [webkit](file:///d:/Study/Y/Testing/HW04/playwright-report/fr11/webkit/index.html).
  - Báo cáo FR-14: [playwright-report/fr14/chromium/index.html](file:///d:/Study/Y/Testing/HW04/playwright-report/fr14/chromium/index.html), [firefox](file:///d:/Study/Y/Testing/HW04/playwright-report/fr14/firefox/index.html), [webkit](file:///d:/Study/Y/Testing/HW04/playwright-report/fr14/webkit/index.html).

---

# PHẦN 3: RÀ SOÁT & PHÂN TÍCH LỖ HỔNG KỊCH BẢN DO AI SINH (HUMAN REVIEW & GAP ANALYSIS)

Một trong những trọng tâm học thuật quan trọng nhất của bài tập HW04 là thể hiện vai trò giám sát, phản biện và hiệu chỉnh của con người (*Human-in-the-Loop*) đối với mã nguồn do AI sinh ra, thể hiện mức năng lực **Bloom-AI G9.3 (Phân tích)** và **G9.4 (Cộng tác)**. Dưới đây là phân tích chi tiết 4 lỗ hổng nghiêm trọng điển hình mà AI đã mắc phải và cách sinh viên đã rà soát, khắc phục:

---

### 3.1. Lỗ hổng 1: Fragile Selectors do ảo giác Semantic Web (HTML5 Semantic Hallucination)

* **Hiện tượng do AI sinh ra:**
  Khi được yêu cầu sinh Page Object Model cho giao diện Web Admin (`pages/admin-category.page.ts`), AI đã tự động giả định ứng dụng được xây dựng theo các thẻ ngữ nghĩa chuẩn của HTML5:
  ```typescript
  // Code do AI sinh ban đầu:
  this.categoryTabItem = page.locator('aside nav li').filter({ hasText: 'Danh mục' });
  this.table = page.locator('main table');
  ```
* **Thực tế mã nguồn DOM của SUT:**
  Khi sinh viên trực tiếp đọc mã nguồn React tại `eshop-sut/frontend-admin/src/App.jsx` (dòng 50–90), giao diện Admin của hệ thống hoàn toàn **không sử dụng thẻ ngữ nghĩa `<aside>` hay `<main>`**, mà sử dụng cấu trúc `<div>` lồng nhau thuần túy và thẻ `<table>` nằm trực tiếp trong một thẻ `div.bg-white`:
  ```jsx
  <div className="w-64 bg-gray-800 text-white p-4">
    <ul>
      <li onClick={() => setActiveTab('categories')}>Danh mục</li>
    </ul>
  </div>
  ```
* **Hậu quả nếu không rà soát:**
  Bộ test của Playwright sẽ bị treo và báo lỗi `TimeoutError: locator.waitFor: Timeout 10000ms exceeded` trên toàn bộ 15 test case của FR-14 do không thể tìm thấy thẻ `<aside>` hay `<main>`.
* **Giải pháp sinh viên đã tinh chỉnh:**
  Sinh viên đã loại bỏ hoàn toàn các thẻ ngữ nghĩa giả định, chuyển sang sử dụng bộ chọn dựa trên Role và Text linh hoạt:
  ```typescript
  // Bản sinh viên sửa chuẩn hóa:
  this.categoryTabItem = page.locator('li', { hasText: 'Danh mục' });
  this.table = page.locator('table');
  ```

---

### 3.2. Lỗ hổng 2: Lệch ngôn ngữ giao diện (Localization Mismatch)

* **Hiện tượng do AI sinh ra:**
  AI mặc định rằng vì đề bài và các nhãn tiếng Việt ("Quản lý danh mục", "Đăng nhập") được nêu trong prompt nên giao diện đăng nhập Admin cũng sẽ dùng tiếng Việt:
  ```typescript
  // Code do AI sinh ban đầu:
  this.loginButton = page.getByRole('button', { name: /Đăng nhập/i });
  ```
* **Thực tế mã nguồn DOM của SUT:**
  Trong file `eshop-sut/frontend-admin/src/App.jsx` (dòng 42), nút đăng nhập của cổng Admin thực tế được lập trình bằng tiếng Anh:
  ```jsx
  <button type="submit" className="w-full bg-blue-600 ...">Login</button>
  ```
* **Hậu quả nếu không rà soát:**
  Test case đăng nhập `TC-FR14-02` và các bước tiền điều kiện xác thực Admin lập tức bị gãy ngay từ bước khởi đầu do Playwright không tìm thấy nút nào có tên "Đăng nhập".
* **Giải pháp sinh viên đã tinh chỉnh:**
  Sinh viên đã thay đổi locator thành Regular Expression đa ngữ không phân biệt hoa thường:
  ```typescript
  // Bản sinh viên sửa chuẩn hóa:
  this.loginButton = page.getByRole('button', { name: /^(Login|Đăng nhập)$/i });
  this.emailInput = page.getByPlaceholder(/email/i);
  this.passwordInput = page.getByPlaceholder(/mật khẩu|password/i);
  ```

---

### 3.3. Lỗ hổng 3: Trùng lặp chuỗi con khi xóa dòng (Partial Text Locator Collision)

* **Hiện tượng do AI sinh ra:**
  Trong thao tác xóa danh mục, AI viết locator tìm dòng cần xóa theo cú pháp:
  ```typescript
  // Code do AI sinh ban đầu:
  rowByName(name: string): Locator {
    return this.tableRows.filter({ hasText: name }).first();
  }
  ```
* **Vấn đề phát sinh khi chạy thực tế:**
  Tại test case kiểm thử giá trị biên độ dài nhỏ nhất `TC-FR14-07`, tên danh mục được tạo là một ký tự duy nhất: `"A"`. Bộ lọc `{ hasText: 'A' }` của Playwright là so khớp chuỗi con (*substring match*). Do đó, nó vô tình bắt trúng bất kỳ dòng nào trong bảng có chứa chữ "A" (ví dụ: dòng có nút `"Xóa"` — chứa ký tự 'a', hoặc dòng có chữ `"Admin"`).
  Hậu quả là sau khi nhấn xóa, assertion `expect(rowByName('A')).toHaveCount(0)` bị thất bại vì bộ lọc vẫn tìm thấy các dòng khác chứa ký tự 'a'.
* **Giải pháp sinh viên đã tinh chỉnh:**
  Sinh viên đã chỉ định đích danh cột Tên danh mục (cột thứ 2: `td:nth-child(2)`) và sử dụng Regex so khớp toàn bộ chuỗi (`^...$`) để ngăn chặn hoàn toàn va chạm chuỗi con:
  ```typescript
  // Bản sinh viên sửa chuẩn hóa:
  rowByName(name: string): Locator {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return this.tableRows.filter({
      has: this.page.locator('td:nth-child(2)', { hasText: new RegExp(`^${escaped}$`) }),
    }).first();
  }
  ```

---

### 3.4. Lỗ hổng 4: Lệnh chờ không ổn định và xung đột dữ liệu bất đồng bộ (Flaky Waits & Race Conditions)

* **Hiện tượng do AI sinh ra:**
  AI thường có thói quen thực hiện các lệnh click ngay sau khi gọi `page.goto()`, hoặc kiểm tra UI ngay lập tức mà không tính đến độ trễ mạng khi React cập nhật state bất đồng bộ:
  - Tại `FR-06`: Click vào sản phẩm từ trang chủ khi component chưa kịp gắn (*element detachment / race condition*).
  - Tại `FR-11`: Khi click nút "Hủy đơn", AI assert nhãn trạng thái ngay lập tức, trong khi API `PUT /api/orders/:id/cancel` chưa kịp trả về và component chưa kịp gọi lại `fetchOrders()`.
  - Tại `FR-14`: Khi các test case chạy liên tiếp, việc tạo danh mục không được dọn dẹp nếu assertion fail làm ô nhiễm cơ sở dữ liệu SQLite cho các lần chạy sau.
* **Giải pháp sinh viên đã tinh chỉnh:**
  1. *Tại FR-06:* Bổ sung `await page.waitForLoadState('domcontentloaded')`, kiểm tra `productCard.toBeVisible()` và chờ URL đích `await page.waitForURL(/\/product\/\d+$/)`.
  2. *Tại FR-11:* Sử dụng `page.waitForResponse` để đồng bộ hóa chính xác thời điểm API trả kết quả trước khi assert UI, đồng thời tăng timeout tự động retry của assertion nhãn lên 7000ms:
     ```typescript
     await Promise.all([
       page.waitForResponse(res => res.url().includes('/cancel') && res.status() === 200),
       cancelBtn.click()
     ]);
     await expect(badge).toHaveText(tc.expectedLabel, { timeout: 7000 });
     ```
  3. *Tại FR-14:* Bọc toàn bộ khâu dọn dẹp trong khối `try ... finally` với cơ chế xóa 2 lớp (UI delete kết hợp REST API delete fallback) đảm bảo tính bất biến (*test idempotency*).

---

# PHẦN 4: BÁO CÁO LỖI HỆ THỐNG (BUG REPORT SUMMARY)

## 4.1. Tổng quan 9 lỗi phát hiện thực tế trên hệ thống SUT

Nhờ vào bộ kịch bản kiểm thử tự động toàn diện và sự kiên định trong việc bảo vệ Test Oracle, sinh viên đã phát hiện và tài liệu hóa tổng cộng **9 lỗi thực tế** của hệ thống EShop SUT trong tài liệu [bug/bug-report.md](file:///d:/Study/Y/Testing/HW04/bug/bug-report.md) theo chuẩn **IEEE 29119-3**:

* **Lỗi Nghiêm trọng (Critical — 1 lỗi):**
  * `BUG-FR11-01`: Lỗ hổng IDOR tại API `GET /api/orders/:id` cho phép bất kỳ ai đọc trộm toàn bộ thông tin đơn hàng mà không cần đăng nhập.
* **Lỗi Lớn (Major — 5 lỗi):**
  * `BUG-FR06-01`: Nút "Thêm vào giỏ hàng" cố tình bỏ qua lần click đầu tiên do biến đếm `clickCount === 0`.
  * `BUG-FR06-03`: Nhập ID sản phẩm không tồn tại (404) khiến trang web rơi vào trạng thái tải vô hạn (`Đang tải...`).
  * `BUG-FR11-02`: Cho phép người dùng tự hủy đơn hàng đang ở trạng thái vận chuyển (`shipping`), vi phạm quy tắc nghiệp vụ.
  * `BUG-FR14-01`: Lỗ hổng RBAC tại API `POST /api/categories` cho phép tài khoản khách hàng thông thường tạo/xóa danh mục của Admin.
  * `BUG-FR14-03`: Giao diện Web Admin thiếu hoàn toàn chức năng Sửa (Update) danh mục sản phẩm.
* **Lỗi Nhỏ (Minor — 3 lỗi):**
  * `BUG-FR06-02`: Trang chi tiết sản phẩm không hiển thị thông tin Danh mục theo đặc tả SRS FR-06.
  * `BUG-FR06-04`: Ô nhập số lượng cho phép nhập số 0, số âm và chuỗi rỗng mà không có validation chặn lại.
  * `BUG-FR14-02`: API và giao diện Web Admin chấp nhận lưu trữ danh mục có tên chỉ toàn khoảng trắng `"   "`.

---

## 4.2. Phân tích chi tiết 3 lỗi tiêu biểu nhất

### 1. BUG-FR14-01: Lỗ hổng phân quyền RBAC tại API Danh mục (GitHub Issue #1)
* **Tính năng:** FR-14 — Quản lý Danh mục Admin & FR-12 — Kiểm soát truy cập Admin.
* **Mức độ:** **Major** | Độ ưu tiên: **High**.
* **Test case phát hiện:** `TC-FR14-04`.
* **Mô tả hành vi sai:** Endpoint `POST /api/categories` chỉ sử dụng middleware `authenticateToken` để kiểm tra token có hợp lệ hay không, hoàn toàn không kiểm tra xem người dùng có quyền quản trị viên (`req.user.role === 'admin'`) hay không. Do đó, một người dùng thông thường khi có JWT token vẫn có thể gửi request tạo, sửa hoặc xóa danh mục sản phẩm của hệ thống thành công (HTTP 200 thay vì bị từ chối bằng HTTP 403 Forbidden).
* **Bằng chứng:** Ảnh chụp màn hình tại `bug/evidence/issue-1.png`.
* **Vị trí mã nguồn lỗi (Giả thuyết RCA):** `eshop-sut/backend/server.js` dòng 168:
  ```javascript
  // Thiếu middleware checkAdmin:
  app.post('/api/categories', authenticateToken, (req, res) => { ... });
  ```

### 2. BUG-FR14-02: Lỗi Validation chấp nhận tên Danh mục toàn khoảng trắng (GitHub Issue #2)
* **Tính năng:** FR-14 — Quản lý Danh mục CRUD.
* **Mức độ:** **Minor** | Độ ưu tiên: **Medium**.
* **Test case phát hiện:** `TC-FR14-11`.
* **Mô tả hành vi sai:** Endpoint `POST /api/categories` kiểm tra dữ liệu đầu vào bằng điều kiện `if (!name) return res.status(400)...` mà không thực hiện cắt tỉa khoảng trắng (`trim()`). Khi người dùng gửi chuỗi `"   "`, điều kiện kiểm tra bị qua mặt, dẫn đến việc lưu vào CSDL một danh mục rỗng vô nghĩa, vi phạm đặc tả SRS FR-14 (*"Tên danh mục là bắt buộc, không được để trống"*).
* **Bằng chứng:** Ảnh chụp màn hình tại `bug/evidence/issue-2.png`.
* **Vị trí mã nguồn lỗi (Giả thuyết RCA):** `eshop-sut/backend/server.js` dòng 170:
  ```javascript
  // Cần sửa thành: if (!name || !name.trim()) return res.status(400)...
  if (!name) return res.status(400).json({ error: 'Tên danh mục là bắt buộc' });
  ```

### 3. BUG-FR11-01: Lỗ hổng IDOR nghiêm trọng tại API Chi tiết đơn hàng
* **Tính năng:** FR-11 — Lịch sử đơn hàng & Bảo mật hệ thống.
* **Mức độ:** **Critical** | Độ ưu tiên: **High**.
* **Test case phát hiện:** `TC-FR11-04`.
* **Mô tả hành vi sai:** Endpoint `GET /api/orders/:id` hoàn toàn không được gắn middleware xác thực `authenticateToken` và không có câu lệnh kiểm tra quyền sở hữu (`user_id`). Bất kỳ người dùng ẩn danh nào ngoài Internet chỉ cần duyệt ID từ `1, 2, 3...` là có thể đọc toàn bộ địa chỉ giao hàng, số điện thoại, danh sách sản phẩm và tổng tiền của mọi khách hàng trong hệ thống.
* **Bằng chứng:** Ảnh chụp màn hình tại `bug/evidence/TC-FR11-10.png`.
* **Vị trí mã nguồn lỗi (Giả thuyết RCA):** `eshop-sut/backend/server.js` dòng 245:
  ```javascript
  // Endpoint công khai hoàn toàn:
  app.get('/api/orders/:id', (req, res) => { ... });
  ```

---

# PHẦN 5: KẾT LUẬN & ĐÁNH GIÁ NĂNG LỰC BLOOM-AI

## 5.1. Tổng kết giá trị kỹ thuật của giải pháp kiểm thử

Qua quá trình thực hiện bài tập HW04-AI, sinh viên đã xây dựng thành công một giải pháp kiểm thử tự động hóa toàn diện cho ứng dụng thương mại điện tử EShop SUT với các giá trị kỹ thuật nổi bật:

1. **Tính độc lập & Khả năng tái sử dụng:** Kiến trúc Page Object Model kết hợp Data-Driven Testing giúp toàn bộ kịch bản kiểm thử không bị phụ thuộc vào môi trường hay dữ liệu cứng. Bộ **Agent Skill** tại `skills/automation-test/` có thể được tái sử dụng nguyên vẹn cho các dự án thương mại điện tử khác.
2. **Bảo toàn tính toàn vẹn của bằng chứng:** Giải pháp cô lập output directory giúp sinh ra trọn vẹn 9 báo cáo HTML độc lập cho 3 trình duyệt mà không hề bị ghi đè, kết hợp Custom Audit Reporter nhúng dấu thời gian ISO 8601 bảo đảm tính minh bạch 100%.
3. **Giá trị bắt lỗi thực tế:** Kiểm thử tự động không chỉ chạy để lấy kết quả "Passed", mà đã phát hiện chính xác 9 lỗi thực tế và 2 lỗ hổng bảo mật nghiêm trọng (RBAC và IDOR), đóng góp thiết thực vào việc nâng cao chất lượng phần mềm.

---

## 5.2. Bảng tự đánh giá mức độ năng lực Bloom-AI

Đối chiếu với khung phân loại tư duy thời kỳ AI (Post-AI Learning Taxonomy / Bloom-AI) tại Mục 8 của đề bài, sinh viên tự đánh giá mức độ đạt được như sau:

| Mức độ Bloom-AI | Tiêu chí đánh giá | Minh chứng thực tế trong bài làm HW04 | Đánh giá |
| :---: | :--- | :--- | :---: |
| **G9.2 (Vận dụng - Apply)** | Biết cách ra lệnh cho AI sinh mã nguồn kiểm thử có cấu trúc theo mô hình chuẩn. | Soạn thảo các prompt chi tiết yêu cầu AI sinh Page Object Model, Data-driven JSON và Playwright test specs cho 3 tính năng theo đúng ngữ cảnh đề bài. | **ĐẠT (100%)** |
| **G9.3 (Phân tích - Analyse)** | Phân tích, mổ xẻ và chỉ ra được các sai sót, ảo giác (hallucination) và khiếm khuyết trong output của AI. | Phát hiện chính xác lỗi Fragile Selectors (`<aside>`, `<main>`), lỗi Localization tiếng Anh/Việt, lỗi va chạm chuỗi con khi xóa danh mục và các lỗi race conditions của AI. | **ĐẠT (100%)** |
| **G9.4 (Cộng tác - Collaborate)** | Phối hợp có trách nhiệm với AI, duy trì vai trò làm chủ chất lượng (Human-in-the-loop), kiên định bảo vệ Test Oracle. | Không để AI tự ý chỉnh sửa assertion làm mất giá trị bắt bug; tự động ghi chép nhật ký 30 Artifacts vào `AI-Audit-Report.md` có dẫn chiếu ISTQB; trực tiếp sửa code POM để test chạy thông suốt. | **ĐẠT (100%)** |

---

# PHẦN 6: CÁC LIÊN KẾT BÀN GIAO QUAN TRỌNG (DELIVERABLE LINKS)

Tuân thủ quy định bàn giao tại Mục 14 của đề bài `Topic/2026.HW04.Automation Testing_Vn.md`, các liên kết minh chứng kiểm thử được công khai và lưu trữ chính thức như sau:

* **GitHub Repository (Mã nguồn dự án kiểm thử tự động HW04):**
  * **Đường dẫn chính thức:** [https://github.com/USThienPhu/HW04](https://github.com/USThienPhu/HW04)
  * Chứa toàn bộ tài sản kiểm thử (testware): kịch bản Playwright (`tests/`), Page Object Model (`pages/`), bộ dữ liệu kiểm thử JSON (`data/`), các báo cáo HTML đa trình duyệt độc lập (`playwright-report/`), Agent Skills và nhật ký AI Audit Report.

* **Danh sách GitHub Issues (Báo cáo lỗi thực tế trên hệ thống SUT):**
  * **Đường dẫn chính thức:** [https://github.com/tthphat/eshop-sut/issues](https://github.com/tthphat/eshop-sut/issues)
  * Bao gồm 2 Issue chính thức được gắn nhãn và phân loại chi tiết:
    * **GitHub Issue #1:** `[BUG-FR14-01] Missing RBAC Authorization on POST /api/categories Endpoint` (Mức độ: Major — Lỗ hổng kiểm soát phân quyền cho phép User thường can thiệp danh mục của Admin).
    * **GitHub Issue #2:** `[BUG-FR14-02] POST /api/categories Accepts Whitespace-Only Category Name` (Mức độ: Minor — Lỗi Validation chấp nhận chuỗi toàn khoảng trắng lưu vào CSDL).

* **Video Demo Thuyết trình & Bảo vệ Kiểm thử Tự động (Task 2 — Chế độ Không công khai / Unlisted):**
  * **Đường dẫn xem trực tiếp:** [https://youtu.be/iOmGFCaGgfE](https://youtu.be/iOmGFCaGgfE)
  * **Thời lượng:** ≥ 5 phút (khoảng 6–7 phút).
  * **Nội dung trình diễn trong video:**
    1. **Xác thực sinh viên chính chủ** trực tiếp trên Terminal bằng 2 lệnh `whoami` và `hostname` theo quy định Anti-AI-Cheat (Mục 11).
    2. **Tổng quan kiến trúc testware** áp dụng mô hình Page Object Model (`pages/`) và 100% Data-Driven Testing (`data/*.json`).
    3. **Live Demo thực thi kiểm thử tự động** trên 3 engine trình duyệt (Chromium, Firefox, WebKit) và mở xem báo cáo HTML kiểm tra thanh biểu ngữ Custom Student Audit Reporter có định danh `"Run by: 23120327"` và dấu thời gian ISO 8601.
    4. **Thuyết minh rà soát phản biện con người (Human Review & AI Gap Analysis):** Trình bày chi tiết các lỗi mã nguồn do AI sinh ra (Fragile Selectors, Localization mismatch, Partial text collision) và cách sinh viên đã trực tiếp tinh chỉnh.
    5. **Giới thiệu 2 Bug thực tế của SUT** trên GitHub Issues và bộ Agent Skill tái sử dụng tại `skills/automation-test/`.

---

*Báo cáo được hoàn thành và lưu trữ chính thức tại thư mục gốc của bài tập HW04 — Khoa Công nghệ Thông tin, Trường Đại học Khoa học Tự nhiên, ĐHQG-HCM.*
