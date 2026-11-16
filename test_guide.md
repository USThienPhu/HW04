Dưới đây là phần cấu trúc lệnh đã được cập nhật đầy đủ cho cả 3 tính năng (**FR-06**, **FR-11**, **FR-14**) cùng hướng dẫn khởi động Backend, Frontend Web và Web Admin của **EShop SUT** để bạn tiện copy:

### 1. Khởi động hệ thống (Mở các terminal riêng biệt)

```bash
cd eshop-sut/backend
npm start
```

```bash
cd eshop-sut/frontend-web
npm run dev
```

```bash
cd eshop-sut/frontend-admin
npm run dev
```

---

### 2. Chạy theo từng trình duyệt riêng lẻ

```bash
npm run test:fr06:chromium
npm run test:fr11:chromium
npm run test:fr14:chromium
```

```bash
npm run test:fr06:firefox
npm run test:fr11:firefox
npm run test:fr14:firefox
```

```bash
npm run test:fr06:webkit
npm run test:fr11:webkit
npm run test:fr14:webkit
```

---

### 3. Chạy toàn bộ test suites (45 lượt test / tính năng)

```bash
npm run test:fr06:all
```

```bash
npm run test:fr11:all
```

```bash
npm run test:fr14:all
```

---

### 4. Xem báo cáo kết quả (HTML Report)

*(Đã tích hợp sẵn thông tin `Run by: 23120327` và ISO timestamp)*

```bash
npm run report:fr06:chromium
npm run report:fr06:firefox
npm run report:fr06:webkit
```

```bash
npm run report:fr11:chromium
npm run report:fr11:firefox
npm run report:fr11:webkit
```

```bash
npm run report:fr14:chromium
npm run report:fr14:firefox
npm run report:fr14:webkit
```
