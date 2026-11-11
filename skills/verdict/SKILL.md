---
name: verdict
description: >-
  Skill tra cứu nhanh chuẩn ISTQB CTFL v4.0, CT-AI / CT-GenAI và các RFC / chuẩn kỹ thuật
  để gắn nhãn Verdict và viết cột (4) Lý do (ISTQB) trong AI-AUDIT/AI-Audit-Report.md.
  Đọc trực tiếp từ references/*.md trong workspace để tối ưu tốc độ và độ nhất quán.
---

# Skill: Verdict & ISTQB/RFC Citation (`skills/verdict/`)

Skill này cung cấp bộ tài liệu tham chiếu cục bộ (Markdown) giúp AI Agent và sinh viên tra cứu nhanh mục **ISTQB CTFL v4.0**, **CT-AI v2.0 / CT-GenAI**, và **RFC / Chuẩn kỹ thuật** khi đánh giá artifact và điền cột `(3) Verdict` + `(4) Lý do (ISTQB)` trong `AI-AUDIT/AI-Audit-Report.md`.

---

## Tài liệu tham chiếu cục bộ

Chỉ đọc file tương ứng với ngữ cảnh artifact đang đánh giá:

1. **[references/istqb-ctfl-v4.0.md](./references/istqb-ctfl-v4.0.md)**
   - Toàn bộ cấu trúc Chương 1–6 của **ISTQB Certified Tester Foundation Level (CTFL) Syllabus v4.0** (`§1.1`–`§6.2`), kèm bảng tra nhanh theo loại artifact (Test Case, Automation Script, Review/Audit, Configuration/CI, Tooling).
2. **[references/istqb-ct-ai-genai.md](./references/istqb-ct-ai-genai.md)**
   - Khung kiến thức **ISTQB CT-AI v2.0** & **CT-GenAI** (sử dụng LLM sinh testware, Human-in-the-loop, rủi ro hallucination / bias / drift, đánh giá độ chính xác artifact AI).
3. **[references/rfc-and-standards.md](./references/rfc-and-standards.md)**
   - Danh mục **IETF RFC** và chuẩn kỹ thuật thường gặp trong Automation Testing & API/Web/Input Validation (RFC 2119/8174, RFC 3966, RFC 5322, RFC 3986, RFC 8259, RFC 9110, ISO/IEC/IEEE 29119, W3C WebDriver, Conventional Commits v1.0.0).

---

## Quy trình áp dụng khi cập nhật `AI-AUDIT/AI-Audit-Report.md`

1. **Xác định loại artifact** được sinh hoặc chỉnh sửa trong lượt trao đổi:
   - *Tài liệu quy trình / cấu hình / audit / git*: ưu tiên `§1.4`, `§3.2`, `§5.3`, `§5.4`, `§6.1–6.2` trong `references/istqb-ctfl-v4.0.md` + `RFC 2119`, `ISO 29119-3`, `Conventional Commits`.
   - *Thiết kế test case / phân tích biên / bảng quyết định*: ưu tiên `§4.1`–`§4.5` trong `references/istqb-ctfl-v4.0.md` + RFC định dạng dữ liệu đầu vào (`RFC 3966`, `RFC 5322`, `RFC 8259`...).
   - *Script automation (Selenium, Playwright, Cypress, REST API, JMeter...)*: ưu tiên `§2.2`, `§4.2–4.3`, `§6.1–6.2` trong `references/istqb-ctfl-v4.0.md` + `W3C WebDriver` / `RFC 9110`.
   - *Đánh giá chất lượng AI output*: kết hợp `references/istqb-ct-ai-genai.md`.
2. **Gắn `Verdict` mặc định**:
   - Theo quy tắc tại `AGENTS.md`, đặt `(3) Verdict` mặc định là `VALID` (sinh viên sẽ tự kiểm chứng và chuyển sang `INVALID` hoặc `INCOMPLETE` nếu phát hiện lỗi/thiếu sót).
3. **Viết cột `(4) Lý do (ISTQB)` ngắn gọn, chính xác**:
   - Mẫu khuyến nghị:
     `**ISTQB <Phiên bản & Mục>** (*<Tên mục>*): <Giải thích ngắn liên hệ trực tiếp với artifact>. <br>**Chuẩn kỹ thuật:** <RFC / ISO / Spec nếu có>.`
4. **Không bịa số mục**:
   - Luôn đối chiếu đúng số hiệu mục trong `references/*.md` trước khi trích dẫn.
