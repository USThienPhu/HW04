Dưới đây là phần cấu trúc lệnh đã được cập nhật, bổ sung thêm phần khởi động Backend và Frontend Web của **EShop SUT** vào ngay bên dưới để bạn tiện copy:

### 1. Khởi động hệ thống (Mở 2 terminal riêng biệt)

```bash
cd eshop-sut/backend
npm start
```

```bash
cd eshop-sut/frontend-web
npm run dev
```

---

### 2. Chạy theo từng trình duyệt riêng lẻ

```bash
npm run test:fr06:chromium
```

```bash
npm run test:fr06:firefox
```

```bash
npm run test:fr06:webkit
```

---

### 3. Chạy toàn bộ test suites (45 lượt test)

```bash
npm run test:fr06:all
```


---

### 4. Xem báo cáo kết quả (HTML Report)

*(Đã tích hợp sẵn thông tin `Run by: 23120327` và ISO timestamp)*

```bash
npm run report
```