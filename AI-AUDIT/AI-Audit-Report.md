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
| **Artifact \#1**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:13 12/11/2026<br>Prompt: "Hãy tạo cho tôi một file AGENTS.md, file này quy định các quy tắt ai agent cần thực hiện trước khi tiến hành các task, đưa ra các câu trả lời<br>Với yêu cầu đầu tiên của tôi là: hãy dựa vào file @[Template/[AI-02] - FIT@HCMUS - AI Audit Report_Vn.md] , tạo thư mục AI-AUDIT và file AI-Audit-Report.md dựa vào template đã đưa, mỗi khi người dùng trao đổi với AI agent, sẽ cập nhật bảng artifact trong file này" | Đã tạo 2 tệp:<br>1. `AGENTS.md`: Quy định 3 nhóm quy tắc bắt buộc cho AI Agent (Pre-task Rules, Quy tắc cập nhật `AI-AUDIT/AI-Audit-Report.md` sau mỗi lượt trao đổi, và Pre-response Rules).<br>2. `AI-AUDIT/AI-Audit-Report.md`: Khởi tạo dựa trên `Template/[AI-02] - FIT@HCMUS - AI Audit Report_Vn.md` với mã bài tập `HW#04 (HW04-AI)` và ghi nhận `Artifact #1`. | VALID | **ISTQB CTFL v4.0 §1.4** (*Test Activities, Testware, and Test Roles*): chuẩn hóa cấu trúc testware, nhật ký kiểm thử và tính truy vết (*traceability*) giữa prompt và output.<br>**ISTQB CTFL v4.0 §6.1–6.2**: sử dụng công cụ AI hỗ trợ sinh tài liệu có kiểm soát gắn với khâu con người rà soát (*Human-in-the-loop*).<br>**Chuẩn kỹ thuật:** **IETF RFC 2119 / RFC 8174** (quy ước từ khóa yêu cầu bắt buộc) & **ISO/IEC/IEEE 29119-3** (cấu trúc tài liệu kiểm thử). | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#2**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:19 12/11/2026<br>Prompt: "- Cập nhật thông tin của tôi vào AI-Audit-Report.md: <br>   - Họ tên: Thái Thiên Phú<br>   - MSSV: 23120327<br>   - Lớp: Kiểm thử phần mềm - CQ2023/3<br>   - Giảng viên: Lâm Quang Vũ<br>- Bỏ đi dòng đầu: Mẫu (italic) — thay trước khi nộp:				<br>  Tool: AI Tool (e.g., ChatGPT, Claude, Gemini) Thời gian: 14:32 25/02/2026 Prompt: \"Sinh test case cho hàm parsePhoneNumberVN…\"	TC01: parsePhoneNumberVN(\"0912345678\") Kỳ vọng: {prefix:84, number:912345678, valid:true} …	INCOMPLETE	AI bỏ qua định dạng RFC 3966. ISTQB FL §4.3 Boundary Value Analysis yêu cầu test ranh giới định dạng.	Thêm TC: parsePhoneNumberVN(\"+84-91-234-5678\") Kỳ vọng: {prefix:84, number:912345678, valid:true}<br>- Sau mỗi hội thoại, cập nhật 4. Tổng kết Độ chính xác AI với chỉ số: Tổng artifact AI sinh đã audit luôn" | Đã cập nhật 2 tệp:<br>1. `AI-AUDIT/AI-Audit-Report.md`: Điền thông tin sinh viên (`THÁI THIÊN PHÚ`, `23120327`, `Kiểm thử phần mềm - CQ2023/3`, giảng viên `Lâm Quang Vũ`) vào Mục 1 và phần Chữ ký; xóa dòng mẫu in nghiêng ở Mục 3; ghi nhận `Artifact #2`; cập nhật `Tổng artifact AI sinh đã audit` = `2` ở Mục 4.<br>2. `AGENTS.md`: Bổ sung quy tắc luôn cập nhật chỉ số `Tổng artifact AI sinh đã audit` tại Mục 4 sau mỗi hội thoại và ghi chú đã bỏ hàng mẫu in nghiêng. | VALID | **ISTQB CTFL v4.0 §1.4** (*Testware & Traceability*) & **§3.2** (*The Review Process*): hoàn thiện siêu dữ liệu định danh chủ sở hữu tài liệu kiểm thử, loại bỏ dữ liệu mẫu (*placeholder*) trước khi rà soát, và tự động hóa bước cập nhật số liệu tổng hợp phục vụ **§1.4.2** (*Test Monitoring and Control*). | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#3**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:23 12/11/2026<br>Prompt: "Thêm vào file AGENTS.md, sau mỗi output của agent, phần cuối cùng sẽ là dòng gợi ý git commit để người dùng dễ dàng commit git" | Đã cập nhật `AGENTS.md`: Thêm quy tắc số 4 vào **Mục 3. Quy tắc trước khi đưa ra câu trả lời (Pre-response Rules)** yêu cầu phần cuối cùng của mỗi output từ AI Agent phải có dòng gợi ý `git commit` phù hợp với thay đổi của lượt trao đổi. Đồng thời ghi nhận `Artifact #3` và cập nhật tổng số artifact = `3` trong `AI-AUDIT/AI-Audit-Report.md`. | VALID | **ISTQB CTFL v4.0 §5.4** (*Configuration Management*) & **§6.1** (*Management Tools*): gắn kết mỗi thay đổi tài liệu và testware với quản lý phiên bản (*version control*), bảo toàn tính toàn vẹn và lịch sử truy vết (*audit trail*).<br>**Chuẩn kỹ thuật:** **Conventional Commits v1.0.0** (chuẩn hóa thông điệp commit). | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#4**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:30 12/11/2026<br>Prompt: "- Mỗi khi cập nhật Artifact cho AI-Audit-report.md, phần verdict mặc định là Valid (Tôi sẽ tự cập nhật trạng thái, chỉnh sửa thành invalid/imcomplete sau khi kiểm tra)<br>- Hãy đọc các report trên github về mục ISTQB, hoặc RFC kỹ thuật và bổ sung luôn cột lý do cho từng Artifact." | Đã cập nhật `AGENTS.md` và `AI-AUDIT/AI-Audit-Report.md`:<br>1. Quy định mặc định cột `(3) Verdict` = `VALID` và tự động điền cột `(4) Lý do (ISTQB)` kèm cập nhật thống kê ở Mục 4.<br>2. Tra cứu cấu trúc **ISTQB CTFL Syllabus v4.0** & chuẩn/RFC kỹ thuật để bổ sung đầy đủ cột `(4) Lý do (ISTQB)` và đặt `Verdict` = `VALID` cho `Artifact #1`–`#4`, đồng thời cập nhật Mục 4 (`Tổng` = `4`, `VALID` = `4` / `100%`). | VALID | **ISTQB CTFL v4.0 §1.4** (*Test Monitoring, Control & Traceability*), **§3.2** (*The Review Process*), **§5.4** (*Configuration Management*) & **§6.1–6.2** (*Test Tools*): chuẩn hóa ngưỡng đánh giá ban đầu (`VALID` baseline) trước bước con người rà soát (*Human Review*) và gắn dẫn chiếu trực tiếp chuẩn ISTQB / RFC kỹ thuật cho từng artifact. | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#5**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:36 12/11/2026<br>Prompt: "Các tài liệu này: ISTQB CTFL v4.0, CT-AI / CT-GenAI, là ở online hay trong bộ nhớ của bạn, nếu download các file md về thì có cải thiện tốc độ đọc và dẫn xuất không, nếu có, hãy tải các skill/domain về ISTQB CTFL dưới dạng markdown về, tạo và đặt vào thư mục skills/verdict/" | Đã giải thích nguồn dữ liệu & lợi ích của Markdown cục bộ, đồng thời tạo bộ skill tại `skills/verdict/`:<br>1. `skills/verdict/SKILL.md`: Quy trình tra cứu & viết `Verdict` + `Lý do (ISTQB)`.<br>2. `skills/verdict/references/istqb-ctfl-v4.0.md`: Tổng hợp mục lục & nội dung `§1.1`–`§6.2` của ISTQB CTFL v4.0.<br>3. `skills/verdict/references/istqb-ct-ai-genai.md`: Tham chiếu CT-AI v2.0 & CT-GenAI (Human-in-the-loop, hallucination, auditability).<br>4. `skills/verdict/references/rfc-and-standards.md`: Danh mục IETF RFC & chuẩn kỹ thuật (`RFC 2119`, `3966`, `5322`, `8259`, `9110`, `ISO 29119`, `W3C WebDriver`, `Conventional Commits`).<br>5. Cập nhật `AGENTS.md` để ưu tiên đọc `skills/verdict/` khi dẫn chiếu. | VALID | **ISTQB CTFL v4.0 §1.4** (*Testware & Traceability*) & **§6.1–6.2** (*Tool Support for Testing*): chuẩn hóa tri thức miền dưới dạng Skill cục bộ (Markdown) giúp tăng tốc độ đọc, đảm bảo tính nhất quán và loại bỏ rủi ro sai lệch trích dẫn khi tự động hóa audit.<br>**ISTQB CT-GenAI**: áp dụng khung tri thức chuẩn hóa để kiểm soát chất lượng output của LLM.<br>**Chuẩn kỹ thuật:** **ISO/IEC/IEEE 29119-3** & **Topic HW04** (khuyến khích xây dựng Agent Skills). | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#6**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:39 12/11/2026<br>Prompt: "Hãy dịch file @[Topic/2026.HW04.Automation Testing_En.md]  sang tiếng việt (đặt chung thư mục luôn)" | Đã dịch toàn bộ nội dung đề bài sang tiếng Việt và lưu tại `Topic/2026.HW04.Automation Testing_Vn.md` (17 mục đầy đủ: thông tin chung, nguyên tắc hướng dẫn, chuẩn đầu ra, mô tả SUT EShop, chọn tính năng, Task 1–2, Agent Skill, công cụ & Bloom-AI, AI Audit Report, AI Critique, Anti-AI-Cheat, Git Commit Log, Oral Defense, quy định nộp bài, bảng tự đánh giá 100 điểm, tài liệu tham khảo và quy định khác). | VALID | **ISTQB CTFL v4.0 §1.4** (*Test Activities, Testware, and Test Roles* — `§1.4.4 Traceability`): chuẩn hóa và bản địa hóa tài liệu cơ sở kiểm thử (*test basis*) nhằm đảm bảo hiểu chính xác các tiêu chí chấp nhận, ràng buộc thực thi và điều kiện thoát (*exit criteria* — `§5.1`).<br>**ISTQB CTFL v4.0 §3.1–3.2** (*Static Testing & Review Process*): đối chiếu với tài liệu gốc tiếng Anh để khắc phục lỗi định dạng bảng từ PDF (cột điểm `15` ở Mục 15).<br>**Chuẩn kỹ thuật:** **ISO/IEC/IEEE 29119-3** (quản lý tài liệu kiểm thử nhất quán). | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#7**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 00:41 12/11/2026<br>Prompt: "Phần gợi ý commit, hãy sinh ra phần bash luôn, tương tự như này<br>Gợi ý Git Commit (Theo quy tắc tại AGENTS.md)<br>bash<br>git add .<br>git commit -m \"docs(pa2): update PA2.md with official tag pa2 commit and CI run links\"<br>Tôi có thể copy dễ dàng" | Đã cập nhật mục số 4 trong **Mục 3. Quy tắc trước khi đưa ra câu trả lời (Pre-response Rules)** của `AGENTS.md`: quy định phần cuối mọi câu trả lời phải xuất khối lệnh `bash` gồm `git add .` và `git commit -m "..."` dưới tiêu đề `Gợi ý Git Commit (Theo quy tắc tại AGENTS.md)`. Đồng thời ghi nhận `Artifact #7` và cập nhật Mục 4 (`Tổng = 7`). | VALID | **ISTQB CTFL v4.0 §5.4** (*Configuration Management*) & **§6.1** (*Management Tools*): chuẩn hóa khối lệnh Git dạng `bash` (`git add .` + `git commit -m "..."`) giúp giảm thao tác thủ công và đảm bảo tính nhất quán khi lưu vết phiên bản testware.<br>**Chuẩn kỹ thuật:** **Conventional Commits v1.0.0** (định dạng `<type>(<scope>): <description>`). | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#8**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 01:01 12/11/2026<br>Prompt: "Trong bày này, tôi tập trung vào automation testing của website theo yêu cầu của @[d:\Study\Y\Testing\HW04\Topic\2026.HW04.Automation Testing_Vn.md] 6. Yêu cầu bài tập, hãy đọc các github repo public, tải về các file markdown về skill/domain phù hợp với automation testing cho dự án esut này, tạo / đưa vào thư mục skills/automation-test" | Đã tìm và clone 2 GitHub repo công khai (`currents-dev/playwright-best-practices-skill` và `ttbhanh/eshop-sut`), chọn lọc các tệp Markdown phù hợp cho kiểm thử web EShop và xây dựng hoàn chỉnh skill tại `skills/automation-test/`:<br>1. `skills/automation-test/SKILL.md`: Quy trình & checklist kiểm thử tự động web EShop bằng Playwright bám sát HW04 Mục 6–7 & 11–12.<br>2. `skills/automation-test/domain/`: 3 tài liệu đặc tả miền EShop (`eshop-srs.md`, `eshop-api-spec.md`, `eshop-setup-guide.md`) lấy từ `ttbhanh/eshop-sut`.<br>3. `skills/automation-test/references/`: 18 tệp Markdown kỹ thuật Playwright (`core/`, `advanced/`, `debugging/`, `frameworks/react.md`, `infrastructure-ci-cd/reporting.md`, `testing-patterns/`) + `LICENSE.md` (MIT) lấy từ `currents-dev/playwright-best-practices-skill`. | VALID | **ISTQB CTFL v4.0 §2.1–2.2** (*SDLC, System & Regression Testing*), **§4.2–4.4** (*Black-Box & Experience-Based Techniques*) & **§6.1–6.2** (*Tool Support, Benefits & Risks of Test Automation*): xây dựng bộ Agent Skill chuẩn hóa (`Playwright Best Practices` + đặc tả miền `EShop SUT`) giúp kiểm soát chất lượng script, tránh fragile selectors / flaky waits và áp dụng Page Object Model + Data-Driven Testing.<br>**Chuẩn kỹ thuật:** **W3C WebDriver / ARIA Locators**, **IETF RFC 4180** (CSV data-driven & FR-16), **IETF RFC 8259** (JSON test data), **IETF RFC 9110** (HTTP API testing) & **Topic HW04 Mục 6–7**. | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#9**<br>Tool: Antigravity (Gemini 3.8 Flash (Medium))<br>Thời gian: 01:09 12/11/2026<br>Prompt: "Cập nhật AGENTS.md, bắt buộc agent mỗi khi có thực hiện các nhiệm vụ liên quan đến Automation testing (sinh test, kiểm tra, update test,...) phải đọc các skill đã tải về trước," | Đã cập nhật `AGENTS.md`: Bổ sung quy tắc số 4 vào **Mục 1. Quy tắc trước khi tiến hành Task (Pre-task Rules)**, bắt buộc AI Agent phải đọc trước `skills/automation-test/SKILL.md`, `skills/automation-test/domain/` và các tệp tương ứng trong `skills/automation-test/references/` trước khi thực hiện mọi tác vụ Automation Testing (sinh, kiểm tra, debug, cập nhật test). Đồng thời ghi nhận `Artifact #9` và cập nhật Mục 4 (`Tổng = 9`). | VALID | **ISTQB CTFL v4.0 §1.4** (*Testware & Traceability*) & **§6.1–6.2** (*Tool Support for Testing*): ràng buộc AI Agent đọc đặc tả miền (`skills/automation-test/domain/`) và chuẩn thực hành Playwright (`skills/automation-test/references/`) trước khi sinh/sửa test nhằm giảm sai lệch oracle, tránh fragile selectors và flaky waits.<br>**ISTQB CT-GenAI**: tăng độ tin cậy ngữ cảnh (*context grounding*) khi dùng LLM sinh mã kiểm thử.<br>**Chuẩn kỹ thuật:** **IETF RFC 2119 / RFC 8174** (từ khóa bắt buộc *PHẢI*) & **ISO/IEC/IEEE 29119-2** (tuân thủ quy trình kiểm thử). | \[Chờ SV rà soát & chỉnh sửa nếu cần\] |
| **Artifact \#10**   |  |  |  |  |

## **4\. Tổng kết Độ chính xác AI**

Tổng hợp verdict từ Mục 3 và điền vào bảng dưới.

| Chỉ số | Số lượng | Tỉ lệ |
| :---- | :---- | :---- |
| **Tổng artifact AI sinh đã audit** | 9 |  |
| **VALID (đúng, dùng nguyên)** | 9 | 100% |
| **INVALID (sai; loại bỏ)** | 0 | 0% |
| **INCOMPLETE (chấp nhận sau khi sửa)** | 0 | 0% |

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
