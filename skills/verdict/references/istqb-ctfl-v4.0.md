# ISTQB Certified Tester Foundation Level (CTFL) Syllabus v4.0 — Quick Reference

Tài liệu tóm tắt chuẩn mục lục và nội dung trọng tâm của **ISTQB CTFL v4.0** phục vụ tra cứu nhanh khi viết cột `(4) Lý do (ISTQB)` trong `AI-Audit-Report.md`.

---

## Tổng quan 6 Chương (CTFL v4.0)

| Chương | Tên chương | Tỉ trọng thi |
| :--- | :--- | :--- |
| **Chapter 1** | Fundamentals of Testing | ~20% (8 câu) |
| **Chapter 2** | Testing Throughout the Software Development Lifecycle (SDLC) | ~12.5% (5 câu) |
| **Chapter 3** | Static Testing | ~10% (4 câu) |
| **Chapter 4** | Test Analysis and Design | ~27.5% (11 câu) |
| **Chapter 5** | Managing the Test Activities | ~22.5% (9 câu) |
| **Chapter 6** | Test Tools | ~7.5% (3 câu) |

---

## Chi tiết các mục (Sections `§1.1` – `§6.2`)

### Chapter 1: Fundamentals of Testing
- **`§1.1` What is Testing?**: Mục tiêu kiểm thử (xác minh yêu cầu, xác thực nhu cầu người dùng, đánh giá chất lượng, tìm lỗi, giảm rủi ro); phân biệt Testing vs. Debugging.
- **`§1.2` Why is Testing Necessary?**: Vai trò trong đảm bảo chất lượng; phân biệt **QA vs. QC / Testing**; chuỗi **Error (lỗi con người) → Defect/Fault/Bug (lỗi mã/tài liệu) → Failure (sai hỏng khi thực thi)**.
- **`§1.3` Testing Principles (7 Nguyên lý)**:
  1. Testing shows the presence, not the absence of defects.
  2. Exhaustive testing is impossible.
  3. Early testing saves time and money (Shift-left).
  4. Defects cluster together (Pareto).
  5. Tests wear out (Pesticide paradox — cần cập nhật/đa dạng test case).
  6. Testing is context-dependent.
  7. Absence-of-errors fallacy.
- **`§1.4` Test Activities, Testware, and Test Roles**:
  - **7 hoạt động kiểm thử (`§1.4.1`)**: Test Planning, Test Monitoring & Control, Test Analysis, Test Design, Test Implementation, Test Execution, Test Completion.
  - **Test process in context (`§1.4.2`)**: Điều chỉnh quy trình theo bối cảnh dự án.
  - **Testware (`§1.4.3`)**: Test plans, test conditions, test cases, test data, test scripts, test logs, test completion reports.
  - **Traceability (`§1.4.4`)**: Truy vết hai chiều giữa Test Basis (yêu cầu/spec) ↔ Test Conditions ↔ Test Cases ↔ Test Results ↔ Defects.
  - **Test Roles (`§1.4.5`)**: Test Management role & Testing role.
- **`§1.5` Essential Skills and Good Practices in Testing**: Kỹ năng giao tiếp, tư duy phản biện, Whole-Team Approach, Independence of Testing.

### Chapter 2: Testing Throughout the SDLC
- **`§2.1` Testing in the Context of an SDLC**: Mô hình tuần tự (Waterfall/V-model), lặp/Agile; **Shift-left testing**; **Test-first approaches** (TDD, ATDD, BDD); **DevOps & CI/CD** (tự động hóa hồi quy liên tục).
- **`§2.2` Test Levels and Test Types**:
  - **Test Levels**: Component (Unit) Testing, Component Integration Testing, System Testing, System Integration Testing, Acceptance Testing (UAT, OAT, Alpha/Beta).
  - **Test Types**: Functional, Non-functional (ISO 25010: performance, usability, security, reliability...), Black-box, White-box, Change-related (**Confirmation Testing** & **Regression Testing**).
- **`§2.3` Maintenance Testing**: Kiểm thử khi chỉnh sửa, nâng cấp, di trú (*migration*) hoặc ngừng vận hành (*retirement*); phân tích tác động (*Impact Analysis*).

### Chapter 3: Static Testing
- **`§3.1` Static Testing Basics**: Kiểm thử tĩnh (không thực thi mã) trên tài liệu yêu cầu, user story, source code, test case, script; phát hiện lỗi sớm, giảm chi phí sửa lỗi.
- **`§3.2` Review Process**:
  - **Quy trình 5 bước**: Planning → Review Initiation → Individual Review → Communication and Analysis → Fixing and Reporting.
  - **Vai trò**: Manager, Author, Moderator, Scribe, Reviewer, Review Leader.
  - **Loại Review**: Informal Review, Walkthrough, Technical Review, Inspection.

### Chapter 4: Test Analysis and Design
- **`§4.1` Categories of Test Techniques**: Black-box (specification-based), White-box (structure-based), Experience-based.
- **`§4.2` Black-Box Test Techniques**:
  - **`§4.2.1` Equivalence Partitioning (EP)**: Chia miền đầu vào/đầu ra hợp lệ và không hợp lệ.
  - **`§4.2.2` Boundary Value Analysis (BVA)**: 2-value BVA & 3-value BVA tại các giá trị biên và lân cận biên.
  - **`§4.2.3` Decision Table Testing**: Tổ hợp điều kiện và hành động tương ứng.
  - **`§4.2.4` State Transition Testing**: Trạng thái, sự kiện, điều kiện chuyển trạng thái, hành động; phủ state / 0-switch / n-switch.
- **`§4.3` White-Box Test Techniques**:
  - **`§4.3.1` Statement Testing & Statement Coverage**: Tỉ lệ câu lệnh thực thi được phủ.
  - **`§4.3.2` Branch Testing & Branch Coverage**: Tỉ lệ nhánh quyết định (True/False) được phủ (mạnh hơn Statement Coverage).
- **`§4.4` Experience-Based Test Techniques**:
  - **`§4.4.1` Error Guessing** (đoán lỗi phổ biến/edge case).
  - **`§4.4.2` Exploratory Testing** (test thăm dò theo session/charter).
  - **`§4.4.3` Checklist-Based Testing** (kiểm thử dựa trên danh sách kiểm tra).
- **`§4.5` Collaboration-Based Test Approaches**: User Stories (3C, INVEST), Acceptance Criteria (Given-When-Then / Rule-oriented), ATDD, BDD.

### Chapter 5: Managing the Test Activities
- **`§5.1` Test Planning**: Mục đích & nội dung Test Plan; Entry criteria & Exit criteria (Definition of Ready / Definition of Done); kỹ thuật ước lượng (Estimation: ratios, extrapolation, Wideband Delphi, Three-point).
- **`§5.2` Risk Management**: Project risks vs. Product risks; Risk Analysis (Likelihood × Impact); Risk Mitigation & Risk-based Testing.
- **`§5.3` Test Monitoring, Control, and Completion**: Test metrics (tiến độ, chất lượng, defect, coverage), Test Status Report, Test Completion Report.
- **`§5.4` Configuration Management (CM)**: Định danh duy nhất, kiểm soát phiên bản (*version control*), thiết lập *baseline*, đảm bảo tính truy vết & khả năng tái lập kết quả test (*reproducibility*).
- **`§5.5` Defect Management**: Chu trình xử lý lỗi, nội dung Defect Report chuẩn (steps to reproduce, expected vs. actual, severity/priority, environment).

### Chapter 6: Test Tools
- **`§6.1` Tool Support for Testing**: Phân loại công cụ: Test Management, Static Testing, Test Design & Implementation, Test Execution & Coverage, Non-Functional Testing, DevOps/CI, Collaboration.
- **`§6.2` Benefits and Risks of Test Automation**:
  - **Benefits**: Giảm lặp lại nhàm chán, nhất quán & lặp lại được, đánh giá khách quan (metrics/coverage), thực thi nhanh trong CI/CD.
  - **Risks**: Kỳ vọng phi thực tế, đánh giá thấp chi phí bảo trì script/testware, phụ thuộc quá mức vào công cụ (bỏ qua exploratory testing & human review), mất ổn định do thay đổi UI/locator (*flaky tests*).

---

## Bảng tra nhanh ánh xạ Artifact → ISTQB CTFL v4.0

| Loại Artifact / Hoạt động | Mục ISTQB CTFL v4.0 ưu tiên trích dẫn |
| :--- | :--- |
| Quy trình, Test Plan, Checklist, Audit Log | `§1.4` (Test Activities & Testware), `§1.4.4` (Traceability), `§5.1`, `§5.3` |
| Rà soát tài liệu / AI Audit / Review code | `§3.1` (Static Testing Basics), `§3.2` (Review Process) |
| Thiết kế Test Case (input/output, điều kiện) | `§4.2.1` (EP), `§4.2.2` (BVA), `§4.2.3` (Decision Table), `§4.2.4` (State Transition) |
| Kiểm thử phủ code / Unit test | `§2.2` (Component Testing), `§4.3.1` (Statement), `§4.3.2` (Branch) |
| Edge case, Exploratory, Checklist | `§4.4.1` (Error Guessing), `§4.4.2` (Exploratory), `§4.4.3` (Checklist) |
| Script Automation (Web/API/E2E) | `§2.1` (CI/CD, Test-first), `§2.2` (System/Regression), `§6.1–6.2` (Tool Support, Benefits & Risks) |
| Quản lý Git / Version / Baseline | `§5.4` (Configuration Management), `§1.4.4` (Traceability) |
| Báo cáo lỗi / Defect | `§5.5` (Defect Management), `§1.2` (Error–Defect–Failure) |
