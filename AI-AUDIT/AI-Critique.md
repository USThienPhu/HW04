**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **Biểu mẫu Khai báo Sử dụng AI & Tự phê bình AI (AI Critique)**

*Đính kèm bài tập HW04 — Kiểm thử Tự động (Automation Testing).*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC13003 Kiểm chứng Phần mềm.*

---

## **1. Thông tin Môn học & Sinh viên**

| Mục | Giá trị |
| :--- | :--- |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Mã bài tập:** | HW04-AI |
| **Tên bài tập:** | Kiểm thử Tự động (Automation Testing) |
| **Cấp độ AI (1–5):** | Cấp 3 (AI-Assisted & Human Review) |
| **Ngày:** | 17/11/2026 |
| **Họ tên sinh viên:** | THÁI THIÊN PHÚ |
| **MSSV:** | 23120327 |
| **Lớp / Khóa:** | CQ2023/3 |
| **Giảng viên lý thuyết:** | ThS. Lâm Quang Vũ |

---

## **2. Câu hỏi Khai báo Sử dụng AI**

### **1. Công cụ AI đã dùng:**
- **Google Antigravity Agent (Mô hình Gemini 3.8 Flash)**: Hỗ trợ sinh khung mã kiểm thử Playwright Test, Page Object Model (POM), cấu trúc dữ liệu JSON và phân tích lỗi.

### **2. Giai đoạn nào của bài tập có dùng AI:**
- [x] Brainstorm & Lựa chọn kỹ thuật kiểm thử
- [x] Outline & Thiết kế khung Page Object Model
- [x] Code: Sinh bản thảo Playwright test script (`.spec.ts`) & POM (`.page.ts`)
- [x] Phân tích dữ liệu & Bóc tách Test Data sang file JSON độc lập
- [x] Phản hồi & Sửa chữa bộ chọn (Locators / Selectors) khi chạy thực tế

### **3. Prompt / nhiệm vụ chính cho AI:**

1. **Prompt sinh mã kiểm thử & POM:**
   > *"Dựa vào đặc tả SRS và tài liệu API của EShop SUT, hãy thiết kế Page Object Model và 15 test cases Playwright (TypeScript) theo hướng Data-driven cho tính năng FR-06 (Xem chi tiết sản phẩm), FR-11 (Lịch sử đơn hàng) và FR-14 (Quản lý Danh mục Admin CRUD). Dữ liệu kiểm thử phải tách biệt hoàn toàn vào tệp JSON ngoài."*

2. **Prompt rà soát và khắc phục lỗi bộ chọn:**
   > *"Hãy sửa lại các bộ chọn trong `pages/admin-category.page.ts` cho khớp chính xác với DOM thực tế của ứng dụng Web Admin EShop SUT (`eshop-sut/frontend-admin/src/App.jsx`), thay thế các selector giả định `<aside>` và `<main>` bằng `div` và `ul`, nhận diện nút 'Login' thay vì 'Đăng nhập', KHÔNG sửa mã nguồn ứng dụng SUT."*

### **4. Phần cụ thể AI đóng góp:**
- **AI đóng góp:**
  - Sinh cấu trúc khung ban đầu cho 3 file Page Object Model trong `pages/`.
  - Sinh khung 45 test cases Playwright trong `tests/` kết hợp đọc dữ liệu từ các file JSON trong `data/`.
  - Gợi ý cấu hình Custom Reporter `reporters/student-audit.reporter.ts` để nhúng metadata sinh viên `"Run by: 23120327"` vào Playwright HTML Report.
- **Sinh viên thực hiện trực tiếp (AI không can thiệp hoặc đã được sinh viên sửa lại hoàn toàn):**
  - Chạy thực nghiệm SUT, đối soát DOM thực tế, phát hiện và sửa toàn bộ lỗi Semantic Hallucination (`<aside>`, `<main>`), lỗi nút `"Login"`, và lỗi trùng lặp text khi xóa dòng danh mục.
  - Phân loại lỗi thực tế của SUT (Lỗi RBAC `BUG-FR14-01`, lỗi khoảng trắng `BUG-FR14-02`, lỗi IDOR `BUG-FR11-01`) để lập Báo cáo lỗi (`bug/bug-report.md`) và tạo GitHub Issues.
  - Tự quay video thuyết minh chính chủ và tự viết bản đánh giá Tự phê bình AI (AI Critique).

### **5. Cách tôi rà soát / chỉnh sửa / xác minh đầu ra AI:**
- **Thực thi kiểm thử thực tế:** Chạy toàn bộ 135 lượt test trên 3 trình duyệt (Chromium, Firefox, WebKit) bằng Playwright Test CLI.
- **Đối soát DOM & Source Code:** Trực tiếp đọc mã nguồn JSX của frontend web và frontend admin (`App.jsx`) để đối chiếu tính khả dụng của selectors.
- **Tra cứu chuẩn kiểm thử ISTQB:** Vận dụng tài liệu *ISTQB CTFL v4.0* (§4.2.1 Equivalence Partitioning, §4.2.2 Boundary Value Analysis) và *ISTQB CT-AI / CT-GenAI* để thẩm định chất lượng các test case và assertion do AI đề xuất.

### **6. Trích dẫn:**
- Google DeepMind. (2026). *Gemini 3.8 / Antigravity AI Agent* [Large language model]. https://gemini.google.com
- Microsoft. (2026). *Playwright: Fast and reliable end-to-end testing for modern web apps*. https://playwright.dev

---

## **3. Tự phê bình AI / AI Critique (200–300 từ — Bắt buộc theo Mục 10)**

Trong quá trình thực hiện bài tập tự động hóa kiểm thử cho hệ thống EShop SUT, mô hình AI đã bộc lộ ba khiếm khuyết kỹ thuật điển hình:

1. **Ảo giác cấu trúc ngữ nghĩa (Semantic Hallucination):** AI mặc định suy đoán giao diện web tuân thủ cấu trúc HTML5 Semantic chuẩn mực (tự ý sinh ra các bộ chọn `aside li` cho thanh điều hướng và `main table` cho bảng dữ liệu). Trong thực tế, ứng dụng chỉ sử dụng các thẻ `<div>` và `<ul>` thuần, dẫn đến việc 14/15 ca kiểm thử ban đầu của tính năng FR-14 bị lỗi `TimeoutError` do không tìm thấy phần tử trong cây DOM.
2. **Nhầm lẫn ngôn ngữ giao diện (Localization Mismatch) và va chạm bộ chọn (Selector Collision):** AI sinh selector tìm nút *"Đăng nhập"* trong khi giao diện Admin thực tế hiển thị chữ tiếng Anh *"Login"*. Ngoài ra, phương thức tìm dòng để xóa `filter({ hasText: 'A' })` bắt nhầm tất cả các dòng chứa chữ 'A' thay vì so khớp chính xác tên danh mục, làm hỏng assertion kiểm tra xóa dữ liệu.
3. **Nguyên nhân cốt lõi:** AI hoạt động thuần túy dựa trên suy luận xác suất từ prompt tĩnh và văn bản mô tả mà không có khả năng quan sát trực tiếp runtime DOM thực tế hay tương tác mạng nếu không được con người dẫn dắt từng bước.

**Bài học rút ra:** Việc áp dụng AI trong kiểm thử tự động đòi hỏi nguyên tắc **Human-in-the-loop (Con người rà soát phản biện)**. Kỹ sư kiểm thử không được xem AI như một "hộp đen" hoàn hảo, mà phải đóng vai trò là người thẩm định, liên tục kiểm chứng thực nghiệm bằng execution log, tinh chỉnh các bộ chọn bền vững (robust locators) và chịu trách nhiệm tối hậu đối với chất lượng của bộ kiểm thử. *(Độ dài: 285 từ)*

---

## **4. Cam đoan Trung thực**

*Bằng việc ký tên dưới đây, tôi cam đoan thông tin khai báo ở trên là chính xác và đầy đủ. Tôi hiểu rằng việc không khai báo hoặc khai báo sai lệch về việc dùng AI sẽ bị coi là vi phạm liêm chính học thuật và có thể dẫn đến điểm 0 cho bài tập cùng việc bị chuyển lên hội đồng kỷ luật.*

## **Chữ ký**

| Họ tên sinh viên (in hoa): | THÁI THIÊN PHÚ |
| :--- | :--- |
| **MSSV:** | 23120327 |
| **Lớp / Khóa:** | CQ2023/3 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** | ThS. Lâm Quang Vũ |
| **Ngày:** | 17/11/2026 |
| **Chữ ký:** | *Thái Thiên Phú* |

---

## **Tham khảo**
* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus v4.0.  
* ISTQB Certified Tester AI Testing (CT-AI) & Generative AI Testing (CT-GenAI).  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
