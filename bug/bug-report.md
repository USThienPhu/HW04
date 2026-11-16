# BÁO CÁO LỖI (BUG REPORT) — ESHOP SUT (HW04)

- **Sinh viên thực hiện:** Thái Thiên Phú — MSSV: `23120327`
- **Môn học:** Kiểm chứng Phần mềm (CS423 / CSC13003) — Lớp: CQ2023/3
- **Hệ thống kiểm thử (SUT):** EShop SUT (Commit: `9ce4f72`)
- **Môi trường thử nghiệm chung:**
  - Hệ điều hành: Windows (PowerShell)
  - Công cụ tự động hóa: Playwright v1.52.0
  - Trình duyệt kiểm thử: Chromium (Desktop Chrome), Firefox (Desktop Firefox), WebKit (Desktop Safari)
  - Base URLs: Frontend Web (`http://localhost:5173`), Web Admin (`http://localhost:5174`), Backend API (`http://localhost:3000`)
- **Tổng số lỗi phát hiện:** 9 lỗi (1 Critical, 5 Major, 3 Minor)

---

# BUG-FR06-01: Nút "Thêm vào giỏ hàng" bỏ qua lần click đầu tiên, yêu cầu click 2 lần mới thêm được sản phẩm

| Mục | Nội dung |
|---|---|
| Tính năng | FR-06 – Xem chi tiết sản phẩm (Domain + Boundary) |
| Test case liên quan | TC-FR06-05 (BVA Min Valid quantity = 1), TC-FR06-06 (BVA quantity = 2), TC-FR06-07 (BVA quantity = 99) |
| Mức độ (Severity) | Major |
| Độ ưu tiên (Priority) | High |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Chromium / Firefox / WebKit, commit eshop-sut `9ce4f72`, base URL: `http://localhost:5173` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Backend API đang hoạt động tại `http://localhost:3000`.
- Frontend Web đang hoạt động tại `http://localhost:5173`.
- Sản phẩm ID 1 (`iPhone 15 Pro Max`) tồn tại trong cơ sở dữ liệu.

## Các bước tái hiện
1. Truy cập trực tiếp trang chi tiết sản phẩm: `http://localhost:5173/product/1`.
2. Giữ nguyên số lượng mặc định là `1`.
3. Nhấp chuột **đúng 1 lần** vào nút **"Thêm vào giỏ hàng"**.
4. Quan sát phản hồi trên nút và nhấp vào mục **"Giỏ hàng"** trên thanh điều hướng.

## Request / Response thực tế
```http
GET /api/products/1 HTTP/1.1
Host: localhost:3000

HTTP/1.1 200 OK
Content-Type: application/json
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "price": 30000000,
  "description": "Điện thoại cao cấp của Apple",
  "imageUrl": "https://placehold.co/300x300/png?text=iPhone+15",
  "category_id": 1
}
```
*(Thao tác click lần 1 ở client không kích hoạt hàm `addToCart`, không có sự kiện thay đổi giỏ hàng).*

## Kết quả mong đợi
Sau khi bấm nút 1 lần, nút hiển thị phản hồi trực quan (chuyển chữ `"Đã thêm"`) và giỏ hàng được cập nhật thêm 1 sản phẩm. — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-06).

## Kết quả thực tế
Ở lần nhấp đầu tiên, nút không phản hồi gì, chữ trên nút vẫn giữ nguyên `"Thêm vào giỏ hàng"`. Giỏ hàng vẫn trống rỗng (`0` sản phẩm). Người dùng bắt buộc phải nhấp thêm lần thứ hai thì sản phẩm mới vào giỏ hàng.

## Bằng chứng
- `evidence/TC-FR06-05.png`
- Ảnh chụp trang GitHub Issues: `evidence/issue-01.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
`eshop-sut/frontend-web/src/pages/ProductDetail.jsx: dòng 22–26` — Lập trình viên cố tình cài đặt biến trạng thái `clickCount` và bỏ qua lần click đầu tiên:
```javascript
const handleAddToCart = () => {
  if (clickCount === 0) {
    setClickCount(1);
    return; // Không làm gì cả ở lần đầu tiên
  }
  addToCart(product, parseInt(quantity));
  setAdded(true);
  setClickCount(0);
  setTimeout(() => setAdded(false), 2000);
};
```

## Phát hiện bởi
Test case `TC-FR06-05`, `TC-FR06-06`, `TC-FR06-07` do AI thiết kế và sinh mã tự động bằng Playwright.

---

# BUG-FR06-02: Trang chi tiết sản phẩm không hiển thị thông tin Danh mục sản phẩm

| Mục | Nội dung |
|---|---|
| Tính năng | FR-06 – Xem chi tiết sản phẩm (Domain + Boundary) |
| Test case liên quan | TC-FR06-01 (Domain Navigation), TC-FR06-03 (Domain Compliance) |
| Mức độ (Severity) | Minor |
| Độ ưu tiên (Priority) | Medium |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Chromium / Firefox / WebKit, commit eshop-sut `9ce4f72`, base URL: `http://localhost:5173` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Backend API và Frontend Web đang hoạt động.
- Sản phẩm ID 1 có `category_id = 1` ứng với danh mục `"Điện thoại"`.

## Các bước tái hiện
1. Mở trình duyệt, truy cập `http://localhost:5173/product/1`.
2. Kiểm tra toàn bộ các thông tin hiển thị trên trang chi tiết sản phẩm.

## Request / Response thực tế
```http
GET /api/products/1 HTTP/1.1
Host: localhost:3000

HTTP/1.1 200 OK
{
  "id": 1,
  "name": "iPhone 15 Pro Max",
  "price": 30000000,
  "description": "Điện thoại cao cấp của Apple",
  "imageUrl": "https://placehold.co/300x300/png?text=iPhone+15",
  "category_id": 1
}
```

## Kết quả mong đợi
Trang chi tiết sản phẩm phải hiển thị đầy đủ: Ảnh lớn, Tên, Giá, Mô tả, Danh mục (ví dụ: `"Danh mục: Điện thoại"`). — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-06).

## Kết quả thực tế
Giao diện chỉ hiển thị ảnh, tên `iPhone 15 Pro Max`, giá `30,000,000 ₫`, mô tả, ô số lượng và nút bấm; hoàn toàn thiếu thông tin Danh mục của sản phẩm.

## Bằng chứng
- `evidence/TC-FR06-03.png`
- Ảnh chụp trang GitHub Issues: `evidence/issue-02.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
`eshop-sut/frontend-web/src/pages/ProductDetail.jsx: dòng 38–72` — Component React chỉ render các trường `product.imageUrl`, `product.name`, `product.price`, `product.description` mà không hề render thông tin category hoặc truy vấn tên category từ `category_id`.

## Phát hiện bởi
Test case `TC-FR06-03` do AI thiết kế đối chiếu trực tiếp với tiêu chí chấp nhận của SRS FR-06.

---

# BUG-FR06-03: Kẹt vĩnh viễn ở trạng thái "Đang tải..." khi truy cập ID sản phẩm không tồn tại (HTTP 404)

| Mục | Nội dung |
|---|---|
| Tính năng | FR-06 – Xem chi tiết sản phẩm (Domain + Boundary) |
| Test case liên quan | TC-FR06-13 (BVA Non-existent ID 99999), TC-FR06-14 (BVA Boundary ID 0) |
| Mức độ (Severity) | Major |
| Độ ưu tiên (Priority) | High |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Chromium / Firefox / WebKit, commit eshop-sut `9ce4f72`, base URL: `http://localhost:5173` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Backend API và Frontend Web đang chạy.
- CSDL không có sản phẩm nào mang ID `99999` hoặc `0`.

## Các bước tái hiện
1. Mở trình duyệt, truy cập trực tiếp URL sản phẩm không tồn tại: `http://localhost:5173/product/99999`.
2. Quan sát giao diện người dùng.

## Request / Response thực tế
```http
GET /api/products/99999 HTTP/1.1
Host: localhost:3000

HTTP/1.1 404 Not Found
Content-Type: application/json
{
  "error": "Product not found"
}
```

## Kết quả mong đợi
Hệ thống phải tắt trạng thái loading và hiển thị thông báo lỗi thân thiện cho người dùng (ví dụ: `"Sản phẩm không tồn tại"` hoặc thông báo 404), kèm nút quay lại trang chủ. — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-05 & FR-06).

## Kết quả thực tế
Giao diện hiển thị dòng chữ `Đang tải...` và bị treo vô tận tại màn hình này. Người dùng không nhận được bất kỳ thông báo nào cho biết sản phẩm không tồn tại.

## Bằng chứng
- `evidence/TC-FR06-13.png`
- Ảnh chụp trang GitHub Issues: `evidence/issue-03.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
`eshop-sut/frontend-web/src/pages/ProductDetail.jsx: dòng 14–19 & dòng 33`:
```javascript
useEffect(() => {
  axios
    .get(`http://localhost:3000/api/products/${id}`)
    .then((res) => setProduct(res.data))
    .catch((err) => console.error(err)); // Không cập nhật trạng thái lỗi
}, [id]);

if (!product) return <div>Đang tải...</div>; // Khi lỗi 404, product mãi là null
```

## Phát hiện bởi
Test case `TC-FR06-13` và `TC-FR06-14` do AI thiết kế kiểm thử giá trị biên ngoại lệ (BVA & Error Handling).

---

# BUG-FR06-04: Ô nhập số lượng không ràng buộc giá trị tối thiểu (cho phép nhập 0, số âm, rỗng) và gửi vào giỏ hàng

| Mục | Nội dung |
|---|---|
| Tính năng | FR-06 – Xem chi tiết sản phẩm (Domain + Boundary) |
| Test case liên quan | TC-FR06-08 (BVA quantity = 0), TC-FR06-09 (BVA quantity = -1), TC-FR06-11 (Empty quantity) |
| Mức độ (Severity) | Major |
| Độ ưu tiên (Priority) | Medium |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Chromium / Firefox / WebKit, commit eshop-sut `9ce4f72`, base URL: `http://localhost:5173` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Backend API và Frontend Web đang chạy.
- Đang mở trang chi tiết sản phẩm `http://localhost:5173/product/1`.

## Các bước tái hiện
1. Tại trang chi tiết sản phẩm, xóa giá trị mặc định trong ô "Số lượng".
2. Nhập vào giá trị `0` (hoặc `-1`, hoặc để trống).
3. Bấm nút "Thêm vào giỏ hàng" (nhấp 2 lần do ảnh hưởng của BUG-FR06-01).
4. Điều hướng tới trang `/cart`.

## Request / Response thực tế
Client xử lý lưu trực tiếp vào state React `CartContext`:
```javascript
addToCart(product, parseInt("0")); // quantity: 0
addToCart(product, parseInt("-1")); // quantity: -1
addToCart(product, parseInt("")); // quantity: NaN
```

## Kết quả mong đợi
Ô nhập phải có thuộc tính `min="1"`, hệ thống từ chối giá trị `<= 0` hoặc rỗng, ngăn chặn thêm số lượng không hợp lệ vào giỏ hàng. — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-06: *"Có ô nhập Số lượng (chỉ nhận số nguyên dương, tối thiểu là 1)"*).

## Kết quả thực tế
Giao diện cho phép nhập và đưa số lượng `0`, `-1` hoặc `NaN` vào giỏ hàng, dẫn đến sai lệch tổng tiền đơn hàng tại trang giỏ hàng.

## Bằng chứng
- `evidence/TC-FR06-08.png`
- Ảnh chụp trang GitHub Issues: `evidence/issue-04.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
`eshop-sut/frontend-web/src/pages/ProductDetail.jsx: dòng 56–62`:
```jsx
<input
  type="number"
  value={quantity}
  onChange={(e) => setQuantity(e.target.value)}
  className="border p-2 w-20 rounded"
/>
```
Input thiếu `min="1"` và không có hàm kiểm tra điều kiện `parseInt(quantity) >= 1` trước khi gọi `addToCart`.

## Phát hiện bởi
Test case `TC-FR06-08`, `TC-FR06-09`, `TC-FR06-11` do AI thiết kế áp dụng kỹ thuật Phân hoạch tương đương (EP) và Phân tích giá trị biên (BVA).

---

# BUG-FR11-01: Lỗ hổng IDOR nghiêm trọng tại API chi tiết đơn hàng GET /api/orders/:id (Không xác thực và phân quyền)

| Mục | Nội dung |
|---|---|
| Tính năng | FR-11 – Xem lịch sử đơn hàng (User) |
| Test case liên quan | TC-FR11-04 (Security Isolation / IDOR) |
| Mức độ (Severity) | Critical |
| Độ ưu tiên (Priority) | High |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Node.js + Express + SQLite, commit eshop-sut `9ce4f72`, base URL: `http://localhost:3000` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Backend API đang chạy tại `http://localhost:3000`.
- Có đơn hàng ID 1 thuộc quyền sở hữu của tài khoản Admin (`admin@eshop.com`, `user_id = 1`).
- Người dùng thường đăng nhập tài khoản `test@eshop.com` (`user_id = 2`).

## Các bước tái hiện
1. Sử dụng tài khoản `test@eshop.com` đăng nhập lấy token người dùng thường.
2. Gửi request `GET /api/orders/1` kèm token của `test@eshop.com` (hoặc gửi request không kèm token bất kỳ).
3. Kiểm tra phản hồi trả về từ API.

## Request / Response thực tế
```http
GET /api/orders/1 HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token_cua_user_test>

HTTP/1.1 200 OK
Content-Type: application/json
{
  "id": 1,
  "user_id": 1,
  "total_amount": 500000,
  "status": "pending",
  "shipping_address": "123 Nguyen Hue, Q1, TP.HCM",
  "created_at": "2026-11-12 13:24:41"
}
```

## Kết quả mong đợi
API phải từ chối truy cập (HTTP `401 Unauthorized` nếu thiếu token hoặc `403 Forbidden` / `404 Not Found` nếu người dùng không phải chủ sở hữu của đơn hàng). — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-11: *"Người dùng chỉ xem được đơn hàng của chính mình"* và SEC-02/03).

## Kết quả thực tế
API trả về mã HTTP `200 OK` kèm toàn bộ thông tin nhạy cảm của đơn hàng (địa chỉ giao hàng, tổng tiền, user_id) thuộc về tài khoản khác.

## Bằng chứng
- Nhật ký Playwright test log: `playwright-report/fr11/chromium/data/b1d81375f65b79c75b5da7b4d2422f41b783da26.md`
- Ảnh chụp trang GitHub Issues: `evidence/issue-05.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
`eshop-sut/backend/server.js: dòng 344–349`:
```javascript
app.get("/api/orders/:id", (req, res) => {
  db.get("SELECT * FROM orders WHERE id = ?", [req.params.id], (err, order) => {
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });
});
```
Endpoint này hoàn toàn thiếu middleware `authenticateToken` và không hề kiểm tra ràng buộc `order.user_id === req.user.id`.

## Phát hiện bởi
Test case bảo mật `TC-FR11-04` do AI thiết kế dựa trên tiêu chuẩn kiểm thử an toàn ứng dụng web (OWASP Top 10 - Broken Object Level Authorization / IDOR).

---

# BUG-FR11-02: Cho phép người dùng tự hủy đơn hàng khi đơn đang ở trạng thái "shipping" (Đang giao)

| Mục | Nội dung |
|---|---|
| Tính năng | FR-11 – Xem lịch sử đơn hàng (User) & FR-10 – Trạng thái đơn hàng |
| Test case liên quan | TC-FR11-10 (Status Domain shipping cancel button visibility) |
| Mức độ (Severity) | Major |
| Độ ưu tiên (Priority) | High |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Chromium / Firefox / WebKit, commit eshop-sut `9ce4f72`, base URL: `http://localhost:5173` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Người dùng đã đăng nhập và có ít nhất 1 đơn hàng ở trạng thái `shipping` (Đang giao).
- Đang xem trang Lịch sử đơn hàng tại `http://localhost:5173/profile`.

## Các bước tái hiện
1. Đăng nhập tài khoản `test@eshop.com`.
2. Mở trang `/profile` mục "Lịch sử đơn hàng".
3. Tìm đơn hàng có huy hiệu "Đang giao" (màu xanh dương).
4. Quan sát cột "Thao tác" và nhấp thử vào nút "Hủy đơn".

## Request / Response thực tế
```http
PUT /api/orders/2/cancel HTTP/1.1
Host: localhost:3000
Authorization: Bearer <token>

HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "Order canceled successfully"
}
```

## Kết quả mong đợi
Khi đơn hàng đã ở trạng thái `shipping`, giao diện của User **không được hiển thị nút "Hủy đơn"** và Backend phải từ chối chuyển trạng thái đơn hàng sang `canceled`. — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-10: *"Khi đơn hàng đã ở trạng thái shipping, User không được phép tự hủy — chỉ Admin mới có thể thao tác"*).

## Kết quả thực tế
Giao diện User vẫn hiển thị nút "Hủy đơn" màu đỏ cạnh dòng đơn hàng `shipping`, và khi người dùng bấm vào thì Backend vẫn thực thi cập nhật trạng thái đơn hàng sang `canceled` thành công.

## Bằng chứng
- `evidence/TC-FR11-10.png`
- Ảnh chụp trang GitHub Issues: `evidence/issue-06.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
- **Frontend** (`eshop-sut/frontend-web/src/pages/Profile.jsx: dòng 200–207`):
  ```jsx
  {/* Nút hủy hiển thị khi chưa giao xong và chưa hủy (kể cả khi đang giao) */}
  {o.status !== "delivered" && o.status !== "canceled" && (
    <button onClick={() => cancelOrder(o.id)} ...>Hủy đơn</button>
  )}
  ```
- **Backend** (`eshop-sut/backend/server.js: dòng 321–339`):
  Lập trình viên để lại comment trong code: `// Lẽ ra phải là: if (order.status !== 'pending' && order.status !== 'confirmed')` nhưng không cài đặt điều kiện chặn này trước khi gọi câu lệnh `UPDATE orders SET status = 'canceled'`.

## Phát hiện bởi
Test case `TC-FR11-10` do AI thiết kế dựa trên sơ đồ chuyển đổi trạng thái State Machine của FR-10.

---

# BUG-FR14-01: Lỗ hổng RBAC tại API POST/PUT/DELETE /api/categories cho phép tài khoản người dùng thường thao tác danh mục của Admin

| Mục | Nội dung |
|---|---|
| Tính năng | FR-14 – Quản lý Danh mục (Admin) & FR-12 – Kiểm soát truy cập (Access Control) |
| Test case liên quan | TC-FR14-04 (API RBAC regular user cannot create category) |
| Mức độ (Severity) | Major |
| Độ ưu tiên (Priority) | High |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Node.js + Express + SQLite, commit eshop-sut `9ce4f72`, base URL: `http://localhost:3000` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Backend API đang chạy tại `http://localhost:3000`.
- Tài khoản người dùng thường `test@eshop.com` (`role = 'user'`).

## Các bước tái hiện
1. Gửi request đăng nhập `POST /api/login` với thông tin `test@eshop.com` để nhận chuỗi JWT Token của user thường.
2. Gửi request `POST /api/categories` kèm header `Authorization: Bearer <user_token>` và body `{"name": "Danh mục trái phép"}`.
3. Quan sát mã phản hồi từ server.

## Request / Response thực tế
```http
POST /api/categories HTTP/1.1
Host: localhost:3000
Authorization: Bearer <user_token_role_user>
Content-Type: application/json

{
  "name": "Danh mục trái phép"
}

HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "Category created",
  "id": 4
}
```

## Kết quả mong đợi
Server phải từ chối yêu cầu và trả về mã lỗi HTTP `403 Forbidden` vì tài khoản không có quyền Admin (`role !== 'admin'`). — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-12: *"Tất cả các API Admin và các API có tính ảnh hưởng dữ liệu (POST/PUT/DELETE /api/categories...) đều phải yêu cầu: 1. Token JWT hợp lệ; 2. role = 'admin' trong Token"*).

## Kết quả thực tế
Server trả về HTTP `200 OK` và ghi nhận danh mục mới vào cơ sở dữ liệu thành công.

## Bằng chứng
- Nhật ký Playwright test log: `playwright-report/fr14/chromium/data/fc2c5f48719c1037e4be7dee9fc5fe0a7a9f7d61.md`
- Ảnh chụp trang GitHub Issues: `evidence/issue-07.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
`eshop-sut/backend/server.js: dòng 249–255`:
```javascript
app.post("/api/categories", authenticateToken, (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO categories (name) VALUES (?)", [name], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Category created", id: this.lastID });
  });
});
```
Middleware chỉ sử dụng `authenticateToken` để kiểm tra tính hợp lệ của token mà không hề kiểm tra giá trị `req.user.role === 'admin'`.

## Phát hiện bởi
Test case bảo mật `TC-FR14-04` do AI thiết kế kiểm thử ma trận phân quyền RBAC (Role-Based Access Control).

---

# BUG-FR14-02: Cho phép tạo danh mục có tên rỗng hoặc toàn khoảng trắng từ giao diện Web Admin và API

| Mục | Nội dung |
|---|---|
| Tính năng | FR-14 – Quản lý Danh mục CRUD (Admin) |
| Test case liên quan | TC-FR14-10 (BVA Empty Name UI), TC-FR14-11 (Domain Whitespace Name API) |
| Mức độ (Severity) | Minor |
| Độ ưu tiên (Priority) | Medium |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Chromium / Firefox / WebKit, commit eshop-sut `9ce4f72`, base URL: `http://localhost:5174` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Đăng nhập quyền Admin tại `http://localhost:5174`.
- Đang mở tab "Danh mục".

## Các bước tái hiện
1. Để trống ô nhập "Tên danh mục mới" (hoặc chỉ nhập các dấu cách `"   "`).
2. Nhấn nút "Thêm mới".
3. Quan sát bảng danh mục hiển thị bên dưới.

## Request / Response thực tế
```http
POST /api/categories HTTP/1.1
Host: localhost:3000
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": ""
}

HTTP/1.1 200 OK
Content-Type: application/json
{
  "message": "Category created",
  "id": 5
}
```

## Kết quả mong đợi
Giao diện phải chặn form submit (HTML5 validation required) hoặc Backend trả về lỗi HTTP `400 Bad Request`. Bảng danh mục không được phép tăng số dòng với tên rỗng. — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-14: *"Tên danh mục là bắt buộc, không được để trống"*).

## Kết quả thực tế
Request gửi thành công, bảng danh mục xuất hiện một hàng mới có ID nhưng phần tên để trống hoàn toàn.

## Bằng chứng
- `evidence/TC-FR14-10.png`
- Ảnh chụp trang GitHub Issues: `evidence/issue-08.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
- **Frontend** (`eshop-sut/frontend-admin/src/App.jsx: dòng 298–307`): Thẻ `<input>` thiếu thuộc tính `required` và sự kiện `handleCategorySubmit` không kiểm tra `if (!categoryName.trim()) return`.
- **Backend** (`eshop-sut/backend/server.js: dòng 249–254`): Không có câu lệnh kiểm tra validation `name` trước khi thực hiện câu lệnh SQL `INSERT`.

## Phát hiện bởi
Test case `TC-FR14-10` và `TC-FR14-11` do AI thiết kế áp dụng kỹ thuật Phân tích giá trị biên (BVA biên dưới: chuỗi rỗng và chuỗi ký tự trắng).

---

# BUG-FR14-03: Bảng danh mục trên giao diện Web Admin thiếu chức năng cập nhật (Update) danh mục

| Mục | Nội dung |
|---|---|
| Tính năng | FR-14 – Quản lý Danh mục CRUD (Admin) |
| Test case liên quan | TC-FR14-13 (Update Category via PUT) |
| Mức độ (Severity) | Minor |
| Độ ưu tiên (Priority) | Low |
| Khả năng tái hiện | Luôn luôn |
| Môi trường | Windows, Chromium / Firefox / WebKit, commit eshop-sut `9ce4f72`, base URL: `http://localhost:5174` |
| Ngày phát hiện | 2026-11-12 |

## Điều kiện tiên quyết
- Đăng nhập quyền Admin tại `http://localhost:5174`.
- Đang mở tab "Danh mục".

## Các bước tái hiện
1. Mở tab "Danh mục" trong cổng quản trị Admin.
2. Quan sát các nút chức năng tại cột "Hành động" trên bảng danh mục.

## Kết quả mong đợi
Admin có thể thực hiện đầy đủ các thao tác CRUD: Thêm / Xem / Sửa / Xóa danh mục ngay trên giao diện Web Admin (phải có nút "Sửa" hoặc modal chỉnh sửa tên danh mục). — nguồn: [SPEC] (`skills/automation-test/domain/eshop-srs.md` - FR-14: *"Admin có thể Thêm / Xem / Sửa / Xóa danh mục"*).

## Kết quả thực tế
Trên bảng danh mục, cột "Hành động" chỉ có duy nhất nút "Xóa" màu đỏ. Mặc dù Backend API có cung cấp endpoint `PUT /api/categories/:id`, giao diện Web Admin hoàn toàn chưa xây dựng nút hoặc form để Admin chỉnh sửa tên danh mục.

## Bằng chứng
- `evidence/TC-FR14-10.png` (Hình ảnh cột Hành động trên bảng danh mục chỉ có nút Xóa)
- Ảnh chụp trang GitHub Issues: `evidence/issue-09.png`

## Phân tích nguyên nhân (giả thuyết, nếu thấy trong code)
`eshop-sut/frontend-admin/src/App.jsx: dòng 323–329`:
```jsx
<td className="p-3">
  <button
    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
    onClick={() => deleteCategory(c.id)}
  >
    Xóa
  </button>
</td>
```
Giao diện chưa lập trình nút "Sửa" cho danh mục như đã làm với phần Sản phẩm.

## Phát hiện bởi
Test case `TC-FR14-13` do AI thiết kế kiểm thử chu trình vòng đời CRUD hoàn chỉnh của thực thể Danh mục.
