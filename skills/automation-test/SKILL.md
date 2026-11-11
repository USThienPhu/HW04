---
name: automation-test
description: >-
  Agent Skill cho kiểm thử tự động (Web E2E & Web Admin) hệ thống EShop SUT bằng Playwright
  theo yêu cầu Mục 6 & Mục 7 của HW04 (CS423 / CSC13003). Tổng hợp Playwright Best Practices
  từ currents-dev/playwright-best-practices-skill (MIT) và tài liệu miền EShop từ ttbhanh/eshop-sut.
---

# Skill: Web Automation Testing for EShop SUT (`skills/automation-test/`)

Skill này hướng dẫn AI Agent và sinh viên thiết kế, sinh code từng bước, rà soát và bảo trì bộ kiểm thử tự động giao diện Web (**Frontend Web** `http://localhost:5173` và **Web Admin** `http://localhost:5174`) cho dự án **EShop SUT** bằng **Playwright**, đáp ứng đầy đủ yêu cầu tại `Topic/2026.HW04.Automation Testing_Vn.md` (Mục 6–7).

---

## 1. Tài liệu miền EShop SUT (`domain/`)

Nguồn: `https://github.com/ttbhanh/eshop-sut`

| Tệp | Nội dung chính | Khi nào cần đọc |
| :--- | :--- | :--- |
| **[domain/eshop-srs.md](./domain/eshop-srs.md)** | Đặc tả yêu cầu hệ thống (FR-01 → FR-24, SEC-01 → SEC-07, tài khoản mặc định, quy tắc UI/UX) | Thiết kế test case, xác định oracle/expected result, đối chiếu lỗi thực tế trên SUT |
| **[domain/eshop-api-spec.md](./domain/eshop-api-spec.md)** | Đặc tả Backend REST API (`http://localhost:3000/api/*`) | Seeding/reset dữ liệu qua API, kiểm tra trạng thái backend, authentication token |
| **[domain/eshop-setup-guide.md](./domain/eshop-setup-guide.md)** | Hướng dẫn cài đặt, seed SQLite (`node database.js`) & khởi chạy Backend / Web / Web Admin | Thiết lập môi trường chạy test local trước khi thực thi Playwright |

---

## 2. Tài liệu kỹ thuật Playwright (`references/`)

Nguồn: `https://github.com/currents-dev/playwright-best-practices-skill` (Giấy phép MIT — xem [references/LICENSE.md](./references/LICENSE.md))

### Lõi thiết kế & Cấu trúc (`references/core/`)
- **[core/locators.md](./references/core/locators.md):** Ưu tiên locator ngữ nghĩa (`getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`), tránh selector CSS/XPath dễ gãy.
- **[core/assertions-waiting.md](./references/core/assertions-waiting.md):** Dùng web-first assertions tự động retry (`toBeVisible`, `toHaveText`, `toHaveURL`, `toHaveCount`...), cấm `waitForTimeout()` cứng.
- **[core/page-object-model.md](./references/core/page-object-model.md):** Tách biệt Page Object (locators & thao tác) khỏi test spec (test flow & assertions).
- **[core/test-data.md](./references/core/test-data.md):** Data-driven testing từ tệp `.csv` / `.json` tách biệt và factory tạo dữ liệu động.
- **[core/test-suite-structure.md](./references/core/test-suite-structure.md):** Tổ chức thư mục, tính độc lập (*test isolation*) giữa các test case.
- **[core/configuration.md](./references/core/configuration.md):** Cấu hình `playwright.config.ts` cho chạy đa trình duyệt (`chromium`, `firefox`, `webkit` / `msedge`).
- **[core/fixtures-hooks.md](./references/core/fixtures-hooks.md):** Tái sử dụng `test.extend`, setup/teardown sạch dữ liệu.

### Xác thực, Debug, React & Báo cáo
- **[advanced/authentication.md](./references/advanced/authentication.md)** & **[advanced/authentication-flows.md](./references/advanced/authentication-flows.md):** Lưu `storageState` JWT, đăng nhập user/admin, xử lý khóa tài khoản & OTP 2 bước.
- **[frameworks/react.md](./references/frameworks/react.md):** Kinh nghiệm kiểm thử ứng dụng **React + Vite** (hydration, state updates, toast/modal).
- **[infrastructure-ci-cd/reporting.md](./references/infrastructure-ci-cd/reporting.md):** Cấu hình Playwright HTML Reporter / Allure Report, trace, screenshot & video khi fail.
- **[debugging/flaky-tests.md](./references/debugging/flaky-tests.md)**, **[debugging/debugging.md](./references/debugging/debugging.md)**, **[debugging/error-testing.md](./references/debugging/error-testing.md):** Xử lý flaky test, xem trace, mô phỏng lỗi mạng/validation.

### Mẫu kiểm thử chuyên biệt cho các FR của EShop (`references/testing-patterns/`)
- **[testing-patterns/forms-validation.md](./references/testing-patterns/forms-validation.md):** Kiểm thử form đăng ký, đăng nhập, quên mật khẩu, hồ sơ, CRUD (FR-01→04, FR-14→17, FR-22).
- **[testing-patterns/file-upload-download.md](./references/testing-patterns/file-upload-download.md):** Kiểm thử upload file CSV cho **FR-16** (Import sản phẩm từ CSV).
- **[testing-patterns/security-testing.md](./references/testing-patterns/security-testing.md):** Kiểm thử XSS (FR-05, FR-18, SEC-04) và phân quyền Admin/User (FR-12, SEC-02/03/06).
- **[testing-patterns/api-testing.md](./references/testing-patterns/api-testing.md):** Dùng `request` fixture kiểm chứng API song song với UI.

---

## 3. Checklist bắt buộc theo HW04 (Mục 6 & Mục 11–12)

Khi sinh hoặc rà soát bộ automation script cho mỗi tính năng (3 tính năng từ Pool A, B, C), AI Agent **PHẢI** kiểm tra đủ các điều kiện sau:

1. **Sinh từng bước (AI-First, không 1-shot):** Đi tuần tự từ phân tích đặc tả (`domain/eshop-srs.md`) → thiết kế dữ liệu test → viết Page Object → viết test spec → chạy & sửa lỗi.
2. **Số lượng test case:** Tối thiểu **12 test case / tính năng** (kết hợp positive, negative và edge cases).
3. **Data-Driven tách file:** Toàn bộ dữ liệu test lưu trong tệp `.csv` hoặc `.json` ngoài script (không hardcode mảng/object inline trong `.spec.ts`).
4. **Đa dạng Assertion:** Sử dụng ít nhất **3 mẫu assertion khác nhau** trong bộ script của tính năng (ví dụ: `toBeVisible`, `toHaveText`/`toContainText`, `toHaveURL`, `toHaveCount`, `toHaveValue`, `toHaveAttribute`, API status check).
5. **Chạy đa trình duyệt:** Chạy trên **≥ 3 trình duyệt** (`chromium`, `firefox`, `webkit` hoặc `chrome`, `msedge`, `firefox`) → tối thiểu **9 lượt chạy trình duyệt** trên toàn bộ 3 tính năng.
6. **Báo cáo HTML hợp lệ:** Báo cáo Playwright HTML / Allure bắt buộc hiển thị rõ `"Run by: 23120327"` kèm **ISO timestamp** trong metadata/title/header/footer.
7. **Human Review & Bug Report:** Ghi nhận lỗi do AI tạo ra (fragile selector, assertion yếu, flaky wait, thiếu edge case) và lập bug report (Markdown + GitHub Issues kèm screenshot) cho các defect thực sự phát hiện trên EShop SUT.
8. **Git History:** Duy trì tối thiểu **8 commits** có thay đổi tệp test script (`.spec.ts` / `.spec.js`).
