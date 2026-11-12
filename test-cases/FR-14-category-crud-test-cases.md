# Đặc tả 15 Test Case — FR-14: Quản lý Danh mục CRUD (Admin) (Domain + Boundary)

- **Mã sinh viên:** `23120327`
- **Pool:** Pool C (Web Admin — EShop `http://localhost:5174`)
- **Tài liệu tham chiếu:** `skills/automation-test/domain/eshop-srs.md` (FR-12, FR-14), `skills/automation-test/domain/eshop-api-spec.md` (`GET/POST/PUT/DELETE /api/categories`)
- **Kỹ thuật kiểm thử áp dụng (ISTQB CTFL v4.0 §4.2):**
  - **Equivalence Partitioning (EP - §4.2.1):** Phân hoạch quyền truy cập (chưa đăng nhập, User thường `role='user'`, Admin `role='admin'`), dữ liệu tên danh mục hợp lệ/rỗng/khoảng trắng/XSS, và trạng thái danh sách rỗng.
  - **Boundary Value Analysis (BVA - §4.2.2):** Kiểm thử độ dài tên danh mục biên (`0` ký tự, `1` ký tự, `255` ký tự), ID không tồn tại (`99999`), và viewport mobile (`375x667`).
- **Tệp dữ liệu ngoài (Data-Driven):** `data/fr14-category-crud.json`
- **Script tự động:** `tests/fr14-category-crud.spec.ts` (sử dụng POM `pages/admin-category.page.ts`)

---

## Danh sách 15 Test Case

| Test ID | Phân loại | Kỹ thuật | Điều kiện / Dữ liệu đầu vào | Kết quả mong đợi (theo SRS FR-12 & FR-14) | Ghi chú phát hiện lỗi thực tế trên SUT (nếu có) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR14-01** | Negative | EP (Unauthenticated UI) | Truy cập `http://localhost:5174` khi chưa đăng nhập | Hiển thị form Đăng nhập Admin, không hiển thị tab Quản lý Danh mục. | Đạt. |
| **TC-FR14-02** | Negative | EP (Non-Admin UI Login) | Đăng nhập bằng tài khoản User thường (`test@eshop.com`) trên Web Admin | Từ chối với thông báo `"Bạn không phải là admin!"`, không vào được trang quản trị. | Đạt. |
| **TC-FR14-03** | Negative | EP (Missing Token API) | Gọi `POST /api/categories` không có token | API từ chối với HTTP `401` hoặc `403`. | Đạt. |
| **TC-FR14-04** | Negative / Security | EP (RBAC - FR-12) | User thường (`role='user'`) gọi `POST /api/categories` | API phải từ chối (`403 Forbidden`) vì chỉ Admin mới có quyền CRUD danh mục. | **Phát hiện bug RBAC:** `server.js` chỉ gọi `authenticateToken`, thiếu kiểm tra `role === 'admin'`. |
| **TC-FR14-05** | Positive | Domain (Read Seeded) | Admin mở tab `Danh mục` | Hiển thị tiêu đề `"Quản lý Danh mục"`, cột `ID`, `Tên Danh Mục`, `Hành động` và các danh mục mẫu (`Điện thoại`, `Laptop`, `Phụ kiện`). | Đạt. |
| **TC-FR14-06** | Boundary | BVA (0 danh mục) | Mock `GET /api/categories` trả về `[]` | Bảng danh mục hiển thị `0` dòng `<tr>` và không bị lỗi crash. | Đạt. |
| **TC-FR14-07** | Positive / BVA | BVA (1 ký tự) | Admin thêm danh mục `"A..."` (tối thiểu 1 ký tự gốc) | Thêm thành công, hiển thị trong bảng; sau đó dọn dẹp. | Đạt. |
| **TC-FR14-08** | Positive | Domain (Unicode & Ký tự đặc biệt) | Admin thêm danh mục `"Thiết bị & Phụ kiện 2026..."` | Thêm thành công và hiển thị đúng dấu tiếng Việt + `&`. | Đạt. |
| **TC-FR14-09** | Boundary | BVA (255 ký tự) | Admin thêm danh mục dài đúng `255` ký tự | Chấp nhận và hiển thị đầy đủ trong bảng mà không lỗi server. | Đạt. |
| **TC-FR14-10** | Negative / BVA | BVA (Chuỗi rỗng `""` UI) | Admin để trống ô tên danh mục (`""`) và bấm `Thêm mới` | Theo SRS FR-14 ("không được để trống"), hệ thống phải chặn/báo lỗi và không tăng số dòng bảng. | **Phát hiện bug:** Input thiếu `required` và không validate rỗng, tạo dòng danh mục trống trong DB. |
| **TC-FR14-11** | Negative | EP (Khoảng trắng `"   "` API) | Admin gửi `POST /api/categories` với `{ "name": "   " }` | API phải từ chối (`status >= 400`) thay vì lưu chuỗi toàn khoảng trắng. | **Phát hiện bug:** Backend trả `200 OK` và lưu `"   "`. |
| **TC-FR14-12** | Negative / Security | EP (XSS Payload) | Admin thêm danh mục `<script>window.__xssTriggered=true</script>Laptop Gaming` | Nội dung được escape an toàn dưới dạng text, không thực thi script (`__xssTriggered` là `undefined`). | Đạt (React tự động escape text). |
| **TC-FR14-13** | Positive | Domain (Update `PUT`) | Tạo danh mục tạm, gọi `PUT /api/categories/:id` đổi tên và tải lại UI | Tên danh mục mới hiển thị chính xác trong bảng Admin. | API `PUT` hoạt động đúng (lưu ý UI chưa có nút Sửa trực tiếp). |
| **TC-FR14-14** | Positive | Domain (Delete UI) | Tạo danh mục tạm, bấm nút `Xóa` trên dòng tương ứng | Danh mục bị xóa khỏi bảng và không còn tồn tại sau khi tải lại. | Đạt. |
| **TC-FR14-15** | Boundary / UI | BVA (ID `99999` + Mobile `375x667`) | Kiểm tra `DELETE /api/categories/99999` và mở tab Danh mục trên viewport `375x667` | Form thêm mới và bảng danh mục vẫn hiển thị (`toBeVisible`) trên màn hình mobile. | Đạt (lưu ý API `DELETE 99999` trả `200` do không kiểm tra `this.changes`). |
