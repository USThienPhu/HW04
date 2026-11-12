# Đặc tả 15 Test Case — FR-11: Xem lịch sử đơn hàng (Domain + Boundary)

- **Mã sinh viên:** `23120327`
- **Pool:** Pool B (Giỏ hàng, Thanh toán & Đơn hàng — EShop)
- **Tài liệu tham chiếu:** `skills/automation-test/domain/eshop-srs.md` (FR-10, FR-11), `skills/automation-test/domain/eshop-api-spec.md` (`GET /api/orders/my-orders`, `GET /api/orders/:id`)
- **Kỹ thuật kiểm thử áp dụng (ISTQB CTFL v4.0 §4.2):**
  - **Equivalence Partitioning (EP - §4.2.1):** Phân hoạch trạng thái xác thực (chưa đăng nhập, token sai, token hợp lệ, user khác), 5 trạng thái đơn hàng (`pending`, `confirmed`, `shipping`, `delivered`, `canceled`), và phản hồi lỗi API 500.
  - **Boundary Value Analysis (BVA - §4.2.2):** Kiểm thử số lượng đơn hàng biên (`0`, `1`, `50`), giá trị tổng tiền biên (`0 ₫`, `999,999,999 ₫`), và viewport mobile (`375x667`).
- **Tệp dữ liệu ngoài (Data-Driven):** `data/fr11-order-history.json`
- **Script tự động:** `tests/fr11-order-history.spec.ts` (sử dụng POM `pages/order-history.page.ts`)

---

## Danh sách 15 Test Case

| Test ID | Phân loại | Kỹ thuật | Điều kiện / Dữ liệu đầu vào | Kết quả mong đợi (theo SRS FR-10 & FR-11) | Ghi chú phát hiện lỗi thực tế trên SUT (nếu có) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR11-01** | Negative | EP (Unauthenticated UI) | Truy cập `/profile` khi chưa đăng nhập | Hiển thị `"Vui lòng đăng nhập"`, không hiển thị bảng lịch sử đơn hàng. | Đạt. |
| **TC-FR11-02** | Negative | EP (Missing Token API) | Gọi `GET /api/orders/my-orders` không có header `Authorization` | API từ chối với HTTP `401` hoặc `403`. | Đạt. |
| **TC-FR11-03** | Negative | EP (Invalid JWT API) | Gọi `GET /api/orders/my-orders` với token sai `invalid.jwt.token.23120327` | API từ chối với HTTP `401` hoặc `403`. | Đạt. |
| **TC-FR11-04** | Negative / Security | EP (User Isolation / IDOR) | User `test@eshop.com` gọi `GET /api/orders/:id` của đơn hàng thuộc `admin@eshop.com` | Hệ thống phải từ chối (`401`/`403`/`404`) vì người dùng chỉ xem được đơn của chính mình. | **Phát hiện bug IDOR:** `server.js` không kiểm tra `authenticateToken` và `user_id` ở `/api/orders/:id`. |
| **TC-FR11-05** | Boundary | BVA (0 đơn hàng) | User đã đăng nhập, danh sách đơn hàng `[]` | Hiển thị `"Bạn chưa có đơn hàng nào."`, không render `<table>`. | Đạt. |
| **TC-FR11-06** | Positive / BVA | BVA (1 đơn hàng) | User đã đăng nhập, có 1 đơn `#101` (`30000000`, `pending`) | Hiển thị đủ các cột `Mã ĐH`, `Ngày đặt`, `Tổng tiền`, `Trạng thái` và giá trị `#101`, `30,000,000 ₫`, `Chờ xác nhận`. | Đạt. |
| **TC-FR11-07** | Boundary | BVA (50 đơn hàng) | User đã đăng nhập, danh sách gồm 50 đơn hàng | Render đầy đủ 50 dòng `<tr>` trong bảng lịch sử đơn hàng. | Đạt. |
| **TC-FR11-08** | Positive | EP (Status `pending`) | Đơn `#201` có `status = "pending"` | Nhãn `"Chờ xác nhận"`, class màu vàng (`bg-yellow-100 text-yellow-800`), có nút `"Hủy đơn"`. | Đạt. |
| **TC-FR11-09** | Positive | EP (Status `confirmed`) | Đơn `#202` có `status = "confirmed"` | Nhãn `"Đã xác nhận"`, class màu chàm (`bg-indigo-100 text-indigo-800`), có nút `"Hủy đơn"`. | Đạt. |
| **TC-FR11-10** | Negative / SRS | EP (Status `shipping`) | Đơn `#203` có `status = "shipping"` | Nhãn `"Đang giao"`, class màu xanh dương (`bg-blue-100 text-blue-800`), **ẩn nút `"Hủy đơn"`** vì User không được tự hủy khi đang giao (FR-10). | **Phát hiện bug:** `Profile.jsx` vẫn hiển thị nút `"Hủy đơn"` khi `status = "shipping"`. |
| **TC-FR11-11** | Positive | EP (Status `delivered`) | Đơn `#204` có `status = "delivered"` | Nhãn `"Đã giao"`, class màu xanh lá (`bg-green-100 text-green-800`), không hiển thị nút `"Hủy đơn"`. | Đạt. |
| **TC-FR11-12** | Positive | EP (Status `canceled`) | Đơn `#205` có `status = "canceled"` | Nhãn `"Đã hủy"`, class màu đỏ (`bg-red-100 text-red-800`), không hiển thị nút `"Hủy đơn"`. | Đạt. |
| **TC-FR11-13** | Boundary | BVA (Tổng tiền biên) | Đơn `#301` (`total_amount = 0`) và `#302` (`total_amount = 999999999`) | Hiển thị `0 ₫` và `999,999,999 ₫`, không bị `NaN`. | Đạt. |
| **TC-FR11-14** | Negative | EP (API 500 Fallback) | API `/api/orders/my-orders` trả về HTTP `500` | Giao diện không trắng trang, fallback về `"Bạn chưa có đơn hàng nào."`. | Đạt. |
| **TC-FR11-15** | Boundary / UI | Viewport Boundary | Mở `/profile` có đơn hàng trên màn hình mobile `375x667` | Tiêu đề `"Lịch sử đơn hàng"` và bảng đơn hàng vẫn hiển thị (`toBeVisible`). | Đạt. |
