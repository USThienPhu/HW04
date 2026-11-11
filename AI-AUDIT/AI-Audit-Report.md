**Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên (HCMUS)**

**CS423 / CSC13003 – Kiểm chứng Phần mềm (AI-augmented · 2026\)**

**CHÍNH SÁCH AI · BIỂU MẪU — 2026 v1.0**

# **AI Audit Report — Mẫu 5 mục cho mỗi Artifact**

*Phụ lục bắt buộc đính kèm cho mọi bài tập có dùng AI (HW\#01–HW\#06, Seminar).*

*Tài liệu được biên soạn lại từ Med Kharbach, PhD (2026) — Mẫu Chính sách Sử dụng AI cho Giáo dục Đại học. Giấy phép CC BY-NC-SA 4.0. Phiên bản này được FIT@HCMUS điều chỉnh cho môn CS423 / CSC15003 Kiểm chứng Phần mềm.*

## **1\. Thông tin Sinh viên**

| Mục | Giá trị |
| :---- | :---- |
| **Họ tên sinh viên (in hoa):** | THÁI THIÊN PHÚ |
| **MSSV:** | 23120327 |
| **Lớp / Khoá:** | Kiểm thử phần mềm - CQ2023/3 |
| **Mã bài tập (ví dụ HW\#00, HW\#02):** | HW\#04 (HW04-AI) |
| **Ngày làm bài:** | 12/11/2026 |
| **Công cụ AI đã dùng:** | Antigravity (Gemini 3.8 Flash (Medium)) |
| **Có sử dụng AI hay không:** | \[x\] Có  \[ \] Không |

## **2\. Hướng dẫn (đọc trước khi điền)**

* Thêm 1 hàng cho mỗi artifact AI sinh (test case, script, checklist, OpenAPI spec, JMeter plan…).  
* Dán nguyên văn prompt — KHÔNG paraphrase.  
* Dán nguyên văn output AI (hoặc kèm screenshot có chú thích trong báo cáo).  
* Gắn nhãn: VALID / INVALID / INCOMPLETE.  
* Lý do phải dẫn chiếu slide, mục ISTQB, hoặc RFC kỹ thuật.  
* Hiển thị bản sửa với phần thay đổi được tô sáng.  
* Hàng mẫu in nghiêng — thay trước khi nộp.

## **3\. Bảng Audit — 1 hàng / artifact**

| (1) Prompt \+ Công cụ | (2) Output AI | (3) Verdict | (4) Lý do (ISTQB) | (5) Bản SV sửa |
| :---- | :---- | :---- | :---- | :---- |
| **Artifact \#1**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:13 12/11/2026<br>Prompt: "Hãy tạo cho tôi một file AGENTS.md, file này quy định các quy tắt ai agent cần thực hiện trước khi tiến hành các task, đưa ra các câu trả lời<br>Với yêu cầu đầu tiên của tôi là: hãy dựa vào file @[Template/[AI-02] - FIT@HCMUS - AI Audit Report_Vn.md] , tạo thư mục AI-AUDIT và file AI-Audit-Report.md dựa vào template đã đưa, mỗi khi người dùng trao đổi với AI agent, sẽ cập nhật bảng artifact trong file này" | Đã tạo 2 tệp:<br>1. `AGENTS.md`: Quy định 3 nhóm quy tắc bắt buộc cho AI Agent (Pre-task Rules, Quy tắc cập nhật `AI-AUDIT/AI-Audit-Report.md` sau mỗi lượt trao đổi, và Pre-response Rules).<br>2. `AI-AUDIT/AI-Audit-Report.md`: Khởi tạo dựa trên `Template/[AI-02] - FIT@HCMUS - AI Audit Report_Vn.md` với mã bài tập `HW#04 (HW04-AI)` và ghi nhận `Artifact #1`. | \[Chờ SV đánh giá: VALID / INVALID / INCOMPLETE\] | \[Chờ SV bổ sung dẫn chiếu slide / mục ISTQB / RFC kỹ thuật\] | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#2**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:19 12/11/2026<br>Prompt: "- Cập nhật thông tin của tôi vào AI-Audit-Report.md: <br>   - Họ tên: Thái Thiên Phú<br>   - MSSV: 23120327<br>   - Lớp: Kiểm thử phần mềm - CQ2023/3<br>   - Giảng viên: Lâm Quang Vũ<br>- Bỏ đi dòng đầu: Mẫu (italic) — thay trước khi nộp:				<br>  Tool: AI Tool (e.g., ChatGPT, Claude, Gemini) Thời gian: 14:32 25/02/2026 Prompt: \"Sinh test case cho hàm parsePhoneNumberVN…\"	TC01: parsePhoneNumberVN(\"0912345678\") Kỳ vọng: {prefix:84, number:912345678, valid:true} …	INCOMPLETE	AI bỏ qua định dạng RFC 3966. ISTQB FL §4.3 Boundary Value Analysis yêu cầu test ranh giới định dạng.	Thêm TC: parsePhoneNumberVN(\"+84-91-234-5678\") Kỳ vọng: {prefix:84, number:912345678, valid:true}<br>- Sau mỗi hội thoại, cập nhật 4. Tổng kết Độ chính xác AI với chỉ số: Tổng artifact AI sinh đã audit luôn" | Đã cập nhật 2 tệp:<br>1. `AI-AUDIT/AI-Audit-Report.md`: Điền thông tin sinh viên (`THÁI THIÊN PHÚ`, `23120327`, `Kiểm thử phần mềm - CQ2023/3`, giảng viên `Lâm Quang Vũ`) vào Mục 1 và phần Chữ ký; xóa dòng mẫu in nghiêng ở Mục 3; ghi nhận `Artifact #2`; cập nhật `Tổng artifact AI sinh đã audit` = `2` ở Mục 4.<br>2. `AGENTS.md`: Bổ sung quy tắc luôn cập nhật chỉ số `Tổng artifact AI sinh đã audit` tại Mục 4 sau mỗi hội thoại và ghi chú đã bỏ hàng mẫu in nghiêng. | \[Chờ SV đánh giá: VALID / INVALID / INCOMPLETE\] | \[Chờ SV bổ sung dẫn chiếu slide / mục ISTQB / RFC kỹ thuật\] | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#3**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:23 12/11/2026<br>Prompt: "Thêm vào file AGENTS.md, sau mỗi output của agent, phần cuối cùng sẽ là dòng gợi ý git commit để người dùng dễ dàng commit git" | Đã cập nhật `AGENTS.md`: Thêm quy tắc số 4 vào **Mục 3. Quy tắc trước khi đưa ra câu trả lời (Pre-response Rules)** yêu cầu phần cuối cùng của mỗi output từ AI Agent phải có dòng gợi ý `git commit` phù hợp với thay đổi của lượt trao đổi. Đồng thời ghi nhận `Artifact #3` và cập nhật tổng số artifact = `3` trong `AI-AUDIT/AI-Audit-Report.md`. | \[Chờ SV đánh giá: VALID / INVALID / INCOMPLETE\] | \[Chờ SV bổ sung dẫn chiếu slide / mục ISTQB / RFC kỹ thuật\] | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#4**   |  |  |  |  |
| **Artifact \#5**   |  |  |  |  |
| **Artifact \#6**   |  |  |  |  |
| **Artifact \#7**   |  |  |  |  |
| **Artifact \#8**   |  |  |  |  |
| **Artifact \#9**   |  |  |  |  |
| **Artifact \#10**   |  |  |  |  |

## **4\. Tổng kết Độ chính xác AI**

Tổng hợp verdict từ Mục 3 và điền vào bảng dưới.

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | 3 |  |
| **VALID (đúng, dùng nguyên)** |  | % |
| **INVALID (sai; loại bỏ)** |  | % |
| **INCOMPLETE (chấp nhận sau khi sửa)** |  | % |

## **5\. Kết luận — Khi nào nên / không nên dùng AI?**

Viết 80–150 chữ mô tả pattern quan sát được. AI mạnh ở đâu? AI sai ở đâu? Khuyến nghị của bạn cho việc dùng AI trong loại công việc này?

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

## **6\. Mandatory Disclosure (dán nguyên văn)**

*"\[Test case / script / dataset / báo cáo\] này được sinh phiên bản đầu bởi \[tên công cụ AI\]; tôi đã rà soát và chỉnh sửa \[phần X\], bổ sung \[edge case Y, Z\]; \[phần W\] do tôi tự viết. AI Audit Report chi tiết đính kèm ở Phụ lục A. Tôi cam đoan không dùng AI để sinh bất kỳ artifact nào thuộc danh mục bị cấm."*

## **Chữ ký**

| Họ tên sinh viên (in hoa): | THÁI THIÊN PHÚ |
| :---- | :---- |
| **MSSV:** | 23120327 |
| **Lớp / Khoá:** | Kiểm thử phần mềm - CQ2023/3 |
| **Môn học:** | CS423 / CSC13003 – Kiểm chứng Phần mềm |
| **Giảng viên:** | Lâm Quang Vũ |
| **Ngày:** | 12/11/2026 |
| **Chữ ký:** |  |

## **Tham khảo**

* Kharbach, M. (2026). AI Use Policy Templates for Higher Education. CC BY-NC-SA 4.0.  
* ISTQB Foundation Level Syllabus (latest version).  
* Hardman, P. (2025). A Post-AI Learning Taxonomy.  
* Fuster Rabella, M. (2025). OECD Education Working Paper No. 338\.  
* Perkins, M., Roe, J., & Furze, L. (2025). AI Assessment Scale.  
* Anthropic (2025). Building reliable AI test agents — engineering blog.  
* DeepEval & Promptfoo documentation — testing frameworks for LLM systems.
