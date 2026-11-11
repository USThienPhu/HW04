# ISTQB CT-AI v2.0 & CT-GenAI — Reference for AI-Augmented Testing

Tài liệu tham chiếu tóm tắt định hướng của **ISTQB Certified Tester AI Testing (CT-AI v2.0)** và **ISTQB Certified Tester Testing with Generative AI (CT-GenAI)** phục vụ đánh giá artifact do AI sinh ra trong môn `CS423 / CSC13003`.

---

## 1. Phân tách phạm vi giữa CT-AI v2.0 và CT-GenAI

- **ISTQB CT-AI v2.0** (*Testing AI-Based Systems*): Tập trung kiểm thử các hệ thống sử dụng AI/ML (kiểm thử dữ liệu đầu vào ở Chương 5, kiểm thử mô hình ML ở Chương 6: functional performance metrics, adversarial testing, metamorphic testing, data drift, overfitting).
- **ISTQB CT-GenAI** (*Testing with Generative AI*): Tập trung vào việc **ứng dụng Generative AI / LLM vào hoạt động kiểm thử phần mềm** (sinh test case, acceptance criteria, dữ liệu test tổng hợp, automation script, phân tích lỗi) và các rủi ro đi kèm.

---

## 2. Nguyên tắc đánh giá Artifact do GenAI sinh ra (`CT-GenAI` & `Human-in-the-Loop`)

Khi đánh giá artifact AI sinh để gán nhãn `VALID` / `INCOMPLETE` / `INVALID` trong `AI-Audit-Report.md`, cần đối chiếu các tiêu chí sau:

1. **Tính chính xác & Hallucination (`CT-GenAI`)**:
   - AI có bịa đặt API, locator DOM, selector, tên hàm hoặc assertion sai lệch so với hệ thống thực tế (AUT) không?
   - Nếu có sai lệch kỹ thuật không dùng được → `INVALID`.
2. **Độ đầy đủ theo kỹ thuật kiểm thử (`CTFL v4.0 §4.x` + `CT-GenAI`)**:
   - AI thường chỉ sinh luồng chính (*happy path*) và bỏ sót giá trị biên (BVA), phân vùng không hợp lệ (EP), trạng thái lỗi hoặc ràng buộc RFC/spec.
   - Nếu khung chính đúng nhưng thiếu edge case / assertion / cấu hình → `INCOMPLETE` (và ghi phần bổ sung ở cột `(5) Bản SV sửa`).
3. **Tính xác định & Tái lập (*Determinism & Reproducibility*)**:
   - Kết quả từ LLM mang tính xác suất; do đó bắt buộc lưu **Prompt nguyên văn**, **Model/Tool**, **Timestamp** và kết quả kiểm chứng thực tế để đảm bảo khả năng truy vết (*auditability*).
4. **Human-in-the-Loop (Giám sát của con người)**:
   - Theo nguyên tắc **ISTQB CT-GenAI** và quy định môn học `HW04`: AI chỉ là trợ lý tạo bản nháp đầu (*draft*), sinh viên chịu trách nhiệm rà soát (Static Review — `CTFL v4.0 §3.2`) và chạy kiểm chứng thực tế trước khi chấp nhận artifact (`VALID`).
5. **Bảo mật & Quyền riêng tư dữ liệu (*Data Privacy / Prompt Injection*)**:
   - Không đưa thông tin nhạy cảm, secret/credential thật hoặc dữ liệu bị cấm vào prompt gửi lên mô hình bên ngoài.
