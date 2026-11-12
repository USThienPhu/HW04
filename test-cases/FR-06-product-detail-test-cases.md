# Đặc tả 15 Test Case — FR-06: Xem chi tiết sản phẩm (Domain + Boundary)

- **Mã sinh viên:** `23120327`
- **Pool:** Pool A (Web Khách hàng — EShop)
- **Tài liệu tham chiếu:** `skills/automation-test/domain/eshop-srs.md` (FR-06, FR-05), `skills/automation-test/domain/eshop-api-spec.md` (`GET /api/products/:id`)
- **Kỹ thuật kiểm thử áp dụng (ISTQB CTFL v4.0 §4.2):**
  - **Equivalence Partitioning (EP - §4.2.1):** Phân hoạch miền hợp lệ/không hợp lệ cho `Số lượng` (số nguyên dương, số âm, số thập phân, chuỗi rỗng, chữ cái) và `Product ID`.
  - **Boundary Value Analysis (BVA - §4.2.2):** Kiểm thử các giá trị biên quanh ngưỡng tối thiểu `quantity = 1` (`0`, `1`, `2`, `99`), biên ID sản phẩm (`0`, `1`, `99999`), và biên kích thước màn hình (`375x667`).
- **Tệp dữ liệu ngoài (Data-Driven):** `data/fr06-product-detail.json`
- **Script tự động:** `tests/fr06-product-detail.spec.ts` (sử dụng POM `pages/product-detail.page.ts`)

---

## Danh sách 15 Test Case

| Test ID | Phân loại | Kỹ thuật | Điều kiện / Dữ liệu đầu vào | Kết quả mong đợi (theo SRS FR-06) | Ghi chú phát hiện lỗi thực tế trên SUT (nếu có) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FR06-01** | Positive | Domain / Navigation | Từ trang chủ click sản phẩm `iPhone 15 Pro Max` (`id=1`) | Chuyển tới `/product/1`; chỉ có đúng 1 `<h1>` hiển thị `iPhone 15 Pro Max`; hiển thị giá `30,000,000 ₫`, mô tả và ảnh có `alt` + `src` hợp lệ. | Đạt các trường cơ bản (trừ Danh mục kiểm ở TC-03). |
| **TC-FR06-02** | Positive | Domain | Truy cập trực tiếp `/product/3` (`MacBook Pro M3`) | Hiển thị đúng `<h1>MacBook Pro M3</h1>`, giá `45,000,000 ₫`, mô tả và ảnh hợp lệ. | Đạt. |
| **TC-FR06-03** | Positive / SRS | Domain Compliance | Truy cập `/product/1` | Trang chi tiết phải hiển thị đầy đủ **Danh mục** (`Điện thoại`) theo SRS FR-06. | **Phát hiện bug:** `ProductDetail.jsx` không hiển thị danh mục sản phẩm. |
| **TC-FR06-04** | Positive | Domain / UI State | Truy cập `/product/1` | Ô nhập `Số lượng` có giá trị mặc định `1`; nút `Thêm vào giỏ hàng` hiển thị và ở trạng thái `enabled`. | Đạt. |
| **TC-FR06-05** | Positive / BVA | BVA (Biên dưới hợp lệ) | `id=1`, `quantity = 1`, bấm `Thêm vào giỏ hàng` **1 lần** | Hiển thị phản hồi trực quan (`Đã thêm`) ngay lần bấm đầu và sản phẩm xuất hiện trong giỏ hàng với số lượng `1`. | **Phát hiện bug:** `ProductDetail.jsx` cố tình bỏ qua lần click đầu (`if (clickCount === 0) return;`). |
| **TC-FR06-06** | Positive / BVA | BVA (Cận trên biên dưới) | `id=2`, `quantity = 2`, bấm `Thêm vào giỏ hàng` | Hiển thị phản hồi `Đã thêm` và giỏ hàng ghi nhận số lượng `2`. | Bị ảnh hưởng bởi bug double-click ở nút Thêm vào giỏ hàng. |
| **TC-FR06-07** | Positive / BVA | BVA (Giá trị lớn hợp lệ) | `id=4`, `quantity = 99`, bấm `Thêm vào giỏ hàng` | Chấp nhận số nguyên dương `99`, hiển thị `Đã thêm` và giỏ hàng ghi nhận `99`. | Bị ảnh hưởng bởi bug double-click. |
| **TC-FR06-08** | Negative / BVA | BVA (Dưới biên tối thiểu) | `id=1`, `quantity = 0`, bấm `Thêm vào giỏ hàng` | Không cho phép thêm số lượng `0` vào giỏ hàng (không hiện `Đã thêm`, có validate). | **Phát hiện bug:** Input thiếu `min="1"` và không kiểm tra `quantity >= 1`. |
| **TC-FR06-09** | Negative / BVA | BVA / EP (Số âm) | `id=1`, `quantity = -1`, bấm `Thêm vào giỏ hàng` | Từ chối số âm `-1`, không thêm vào giỏ hàng. | **Phát hiện bug:** SUT vẫn cho phép nhập và thêm số lượng âm. |
| **TC-FR06-10** | Negative / EP | EP (Số thập phân) | `id=1`, `quantity = 1.5`, bấm `Thêm vào giỏ hàng` | Từ chối số không nguyên (`1.5`) theo quy định "chỉ nhận số nguyên dương". | **Phát hiện bug:** SUT dùng `parseInt("1.5")` thành `1` thay vì báo lỗi/chặn. |
| **TC-FR06-11** | Negative / EP | EP (Giá trị rỗng) | `id=1`, `quantity = ""`, bấm `Thêm vào giỏ hàng` | Không thêm `NaN` vào giỏ hàng; giữ nguyên trạng thái chưa thêm. | **Phát hiện bug:** `parseInt("")` tạo ra `NaN` trong giỏ hàng. |
| **TC-FR06-12** | Negative / EP | EP (Chuỗi ký tự) | `id=1`, nhập `"abc"` vào ô `Số lượng` | Ô `<input type="number">` từ chối ký tự chữ cái, giá trị giữ rỗng `""`. | Đạt nhờ chuẩn HTML5 `type="number"`. |
| **TC-FR06-13** | Negative / BVA | BVA (ID không tồn tại) | Truy cập `/product/99999` (API trả 404) | Tắt trạng thái `Đang tải...` và hiển thị thông báo sản phẩm không tồn tại. | **Phát hiện bug:** `.catch()` chỉ `console.error`, màn hình kẹt vĩnh viễn ở `Đang tải...`. |
| **TC-FR06-14** | Negative / BVA | BVA (ID biên `0`) | Truy cập `/product/0` (API trả 404) | Xử lý an toàn, hiển thị thông báo không tồn tại, không kẹt `Đang tải...`. | **Phát hiện bug:** Kẹt vĩnh viễn ở `Đang tải...`. |
| **TC-FR06-15** | Boundary / UI | Viewport Boundary | Mở `/product/1` trên viewport mobile `375x667` | Nút `Thêm vào giỏ hàng` vẫn hiển thị (`toBeVisible`) và bấm được (`toBeEnabled`). | Kiểm tra class `bug-mobile-hidden` trên nút Thêm vào giỏ hàng. |
