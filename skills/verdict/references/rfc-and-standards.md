# Technical RFCs & Standards — Reference for Software & Automation Testing

Tổng hợp các **IETF RFC** và chuẩn kỹ thuật phổ biến dùng để dẫn chiếu ở cột `(4) Lý do (ISTQB)` khi đánh giá test case, API test, automation script và tài liệu kiểm thử.

---

## 1. Quy chuẩn tài liệu, quy trình & quản lý phiên bản

| Chuẩn / RFC | Tên đầy đủ | Ứng dụng trong dẫn chiếu Verdict / Audit |
| :--- | :--- | :--- |
| **IETF RFC 2119** / **RFC 8174** | Key words for use in RFCs to Indicate Requirement Levels | Quy chuẩn hóa mức độ bắt buộc trong đặc tả/quy tắc (`MUST`, `MUST NOT`, `SHOULD`, `MAY`), như các quy tắc trong `AGENTS.md`. |
| **ISO/IEC/IEEE 29119-1/2/3** | Software and systems engineering — Software testing | Chuẩn quốc tế về khái niệm (`Part 1`), quy trình kiểm thử (`Part 2`), và cấu trúc tài liệu/báo cáo kiểm thử (`Part 3`). |
| **ISO/IEC 25010** | Systems and software Quality Requirements and Evaluation (SQuaRE) | Cơ sở phân loại kiểm thử phi chức năng (Performance Efficiency, Compatibility, Usability, Reliability, Security, Maintainability). |
| **Conventional Commits v1.0.0** | Conventional Commits Specification | Chuẩn hóa commit message (`feat:`, `fix:`, `docs:`, `test:`, `chore:`) phục vụ truy vết thay đổi (`ISTQB §5.4`). |

---

## 2. Chuẩn giao thức Web, API & Automation

| Chuẩn / RFC | Tên đầy đủ | Ứng dụng trong Automation Testing (HW04) |
| :--- | :--- | :--- |
| **IETF RFC 9110** | HTTP Semantics | Kiểm chứng method (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), idempotency, và HTTP status codes (`200`, `201`, `400`, `401`, `403`, `404`, `422`, `500`). |
| **IETF RFC 9111** | HTTP Caching | Kiểm tra header `Cache-Control`, `ETag`, `If-None-Match` trong API/Web testing. |
| **IETF RFC 8259** | The JavaScript Object Notation (JSON) Data Interchange Format | Kiểm tra định dạng JSON hợp lệ, kiểu dữ liệu, escape ký tự, schema response API. |
| **IETF RFC 7807 / RFC 9457** | Problem Details for HTTP APIs | Kiểm tra cấu trúc payload báo lỗi chuẩn hóa của REST API. |
| **W3C WebDriver** | WebDriver Specification | Chuẩn giao thức điều khiển trình duyệt cho Selenium / WebDriver-based UI automation. |
| **W3C ARIA / WCAG 2.1–2.2** | Accessible Rich Internet Applications / Accessibility Guidelines | Cơ sở kiểm thử role-based locators (`getByRole`, `aria-label`) và tính truy cập giao diện. |

---

## 3. Chuẩn định dạng dữ liệu đầu vào (Input Validation / EP & BVA)

| Chuẩn / RFC | Tên đầy đủ | Ứng dụng trong Test Data & Edge Cases |
| :--- | :--- | :--- |
| **IETF RFC 3966** | The `tel` URI for Telephone Numbers | Định dạng số điện thoại quốc tế/nội địa (`+84-...`, dấu phân cách, độ dài). |
| **IETF RFC 5322** | Internet Message Format | Định dạng địa chỉ email hợp lệ / không hợp lệ (local-part, `@`, domain, ký tự đặc biệt). |
| **IETF RFC 3986** | Uniform Resource Identifier (URI): Generic Syntax | Kiểm thử URL/URI, query string, percent-encoding (`%20`), path traversal. |
| **IETF RFC 3339 / ISO 8601** | Date and Time on the Internet: Timestamps | Kiểm thử định dạng ngày giờ (`YYYY-MM-DDTHH:mm:ssZ`), múi giờ, năm nhuận. |
| **IETF RFC 4122 / RFC 9562** | Universally Unique IDentifier (UUID) | Kiểm thử định danh UUID v4/v7 trong API và database assertions. |
| **Unicode Standard (UTF-8 / RFC 3629)** | UTF-8 transformation format | Kiểm thử chuỗi tiếng Việt có dấu, emoji, surrogate pairs, RTL/normalization. |
