# AGENTS.md — Quy tắc bắt buộc cho AI Agent (HW04 - CS423 / CSC13003)

Tài liệu này quy định các nguyên tắc và bước kiểm tra **bắt buộc** mà mọi AI Agent phải tuân thủ **trước khi tiến hành bất kỳ task nào** và **trước khi đưa ra câu trả lời** cho người dùng trong workspace `HW04`.

---

## 1. Quy tắc trước khi tiến hành Task (Pre-task Rules)

1. **Đọc ngữ cảnh dự án trước khi hành động**:
   - Kiểm tra cấu trúc thư mục hiện tại và đọc các tài liệu liên quan đến bài tập trong `Topic/` (ví dụ: `Topic/2026.HW04.Automation Testing_En.md`), biểu mẫu trong `Template/` và nhật ký hiện có trong `AI-AUDIT/AI-Audit-Report.md`.
   - Không tự ý giả định thông tin chưa kiểm chứng. Chỉ sử dụng dữ liệu, tên file, mã nguồn và kết quả thực thi đã được đọc/kiểm tra thực tế trong workspace.
2. **Tuân thủ nguyên tắc học thuật của môn học (CS423 / CSC13003)**:
   - Áp dụng đúng kỹ thuật kiểm thử được yêu cầu theo từng bước (không tạo output chung chung kiểu "hộp đen").
   - Tôn trọng ranh giới tự kiểm chứng của sinh viên: AI hỗ trợ sinh artifact, sinh viên là người chịu trách nhiệm rà soát, đánh giá (`VALID / INVALID / INCOMPLETE`) và chỉnh sửa trước khi nộp.
3. **Bảo toàn dữ liệu sẵn có**:
   - Không xóa hoặc ghi đè các artifact đã được ghi nhận trước đó trong `AI-AUDIT/AI-Audit-Report.md`.
   - Giữ nguyên cấu trúc biểu mẫu gốc từ `Template/[AI-02] - FIT@HCMUS - AI Audit Report_Vn.md`.

---

## 2. Quy tắc cập nhật AI Audit Report (Bắt buộc mỗi lượt trao đổi)

**Mỗi khi người dùng trao đổi với AI Agent** (đặt câu hỏi, yêu cầu tạo/sửa code, test case, script, tài liệu, phân tích...), AI Agent **PHẢI cập nhật bảng artifact** tại **Mục 3. Bảng Audit** trong tệp `AI-AUDIT/AI-Audit-Report.md` trước khi kết thúc phản hồi.

### Quy cách ghi nhận vào bảng Audit (`AI-AUDIT/AI-Audit-Report.md`)

1. **Vị trí ghi**:
   - Điền tuần tự vào các hàng `Artifact #1`, `Artifact #2`, ... còn trống trong **Mục 3. Bảng Audit**.
   - Nếu đã dùng hết đến `Artifact #10`, tự động thêm hàng mới (`Artifact #11`, `Artifact #12`, ...) ở cuối bảng; **không** xóa hàng mẫu in nghiêng (chỉ nhắc sinh viên thay/xóa trước khi nộp).
2. **Quy tắc từng cột**:
   - **Cột `(1) Prompt + Công cụ`**:
     - Ghi rõ: `Tool: <Tên công cụ AI / Model>`, `Thời gian: <HH:mm DD/MM/YYYY>`, và `Prompt: "<Nguyên văn prompt của người dùng>"`.
     - **Bắt buộc dán nguyên văn prompt — KHÔNG paraphrase.** Nếu prompt có nhiều dòng hoặc chứa ký tự `|`, thay xuống dòng bằng `<br>` và escape `\|` để không làm vỡ bảng Markdown.
   - **Cột `(2) Output AI`**:
     - Dán nguyên văn output chính do AI tạo ra hoặc nội dung đầy đủ của artifact được sinh (nếu output quá dài hoặc nằm ở file riêng, ghi rõ nội dung cốt lõi/nguyên văn phần chính kèm đường dẫn tới file artifact tương ứng).
   - **Cột `(3) Verdict`**:
     - Để `[Chờ SV đánh giá: VALID / INVALID / INCOMPLETE]` (AI không tự ý chốt `VALID` thay sinh viên).
   - **Cột `(4) Lý do (ISTQB)`**:
     - Để `[Chờ SV bổ sung dẫn chiếu slide / mục ISTQB / RFC kỹ thuật]` (có thể kèm ghi chú gợi ý ngắn nếu cần, nhưng đánh dấu rõ để sinh viên tự hoàn thiện).
   - **Cột `(5) Bản SV sửa`**:
     - Để trống hoặc ghi `[Chờ SV rà soát & chỉnh sửa nếu cần]`.
3. **Cập nhật Mục 1 (nếu cần)**:
   - Đảm bảo trường **Công cụ AI đã dùng** và **Ngày làm bài** phản ánh đúng thực tế phiên làm việc; giữ nguyên các thông tin cá nhân của sinh viên (Họ tên, MSSV, Lớp/Khoá...) nếu chưa được cung cấp.

---

## 3. Quy tắc trước khi đưa ra câu trả lời (Pre-response Rules)

Trước khi gửi câu trả lời cuối cùng tới người dùng, AI Agent phải tự kiểm tra các điều kiện sau:

1. **Đã cập nhật `AI-AUDIT/AI-Audit-Report.md` chưa?**
   - Xác nhận lượt trao đổi hiện tại đã được ghi thành một hàng mới (hoặc artifact tương ứng) trong **Mục 3. Bảng Audit** của `AI-AUDIT/AI-Audit-Report.md`.
2. **Tính chính xác & minh bạch**:
   - Mọi đường dẫn file, tên hàm/biến, nội dung tài liệu và kết quả chạy lệnh nêu trong câu trả lời phải khớp 100% với những gì đã quan sát trực tiếp từ file hoặc terminal.
   - Nếu có phần việc chưa thực hiện hoặc cần người dùng kiểm tra lại (như đánh giá `Verdict`, điền thông tin cá nhân, kiểm chứng test case), phải nêu rõ ràng.
3. **Nhắc kiểm tra & xác nhận nhật ký**:
   - Cuối câu trả lời, thông báo ngắn gọn mã `Artifact #<N>` vừa được cập nhật vào `AI-AUDIT/AI-Audit-Report.md` để người dùng tiện theo dõi và rà soát.
