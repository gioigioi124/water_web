# Original User Request

## 2026-10-14T08:31:06Z

# Teamwork Project Prompt

Requested team: Phân rã nhiệm vụ cho 3 Agents: Agent 1 đọc kế hoạch, cài đặt các thư viện hoặc skill cần thiết cho dự án; Agent 2 viết code; Agent 3 kiểm tra, phản biện và ghi kết quả vào file Result.md

Phát triển ứng dụng web tĩnh giáo dục toán học tương tác "Vui học dung tích" dành cho học sinh lớp 2 theo đúng đặc tả và kế hoạch kiến trúc trong `plan.md`. Ứng dụng mang phong cách hoạt hình thân thiện, mô phỏng sinh động thao tác kéo nghiêng rót nước, bài toán đong nước dung tích số nguyên lít và cấu trúc 4 lớp tái sử dụng được.

Working directory: c:\Users\Administrator\Desktop\School
Integrity mode: development
Reference material: `plan.md` (tài liệu đặc tả chi tiết kiến trúc, dữ liệu và giao diện)

## Team Delegation & Responsibilities

- **Agent 1 (Setup & Environment):**
  - Đọc và phân tích kỹ tài liệu `plan.md`.
  - Khởi tạo dự án web tĩnh với Vite + TypeScript.
  - Cài đặt các thư viện cần thiết (nếu có, ví dụ canvas-confetti cho hiệu ứng chúc mừng).
  - Thiết lập cấu trúc thư mục 4 lớp theo mục 9 của `plan.md`: `core/`, `components/`, `activities/`, `lessons/capacity/`.
  - Chuẩn bị sẵn các file cấu hình mẫu (`lesson.json`, `items.json`, `levels.json`, `text.vi.json`).

- **Agent 2 (Implementation):**
  - Phát triển toàn bộ mã nguồn giao diện và logic:
    - **Lớp core:** Khung trang, định tuyến màn hình (Trang chủ, Phần A, Phần B), thanh công cụ trên cùng (Home, Làm lại, Ẩn/Hiện số lít, Âm thanh), chủ đề giao diện, mascot giọt nước Bi với bong bóng hội thoại và biểu cảm.
    - **Lớp components:** Bình nước SVG với vạch chia lít và mặt nước sóng sánh (`clipPath`), cốc đong chuẩn 1-5L, vòi nước cấp, cống thoát, nút bấm to >= 64px.
    - **Tương tác Pointer Events:** Cơ chế kéo nghiêng rót nước mượt mà theo khoảng cách/góc nghiêng và hỗ trợ song song chế độ chạm nguồn -> chạm đích (tap-to-pour).
    - **Lớp activities:**
      - Phần A (So sánh sức chứa): Quy trình 3 bước (Dự đoán -> Đổ qua lại đối chiếu tràn/đầy/thiếu -> Đo bằng cốc đong chuẩn -> Đối chiếu kết luận).
      - Phần B (Đổ nước giữa các bình): Khám phá tự do và 5 màn Thử thách (2L, 3L, 5L; vòi; cống) với thuật toán BFS tự động tìm đường đi giải tối ưu để hiển thị Gợi ý.
    - **Lớp lessons:** Nạp toàn bộ dữ liệu từ JSON, tuyệt đối không hardcode số liệu hay văn bản hiển thị trong code giao diện.

- **Agent 3 (Verification, Critique & Report):**
  - Chạy build (`npm run build`) và khởi động server kiểm tra nghiệm thu.
  - Viết và chạy script kiểm thử tự động thuật toán BFS đảm bảo 100% các màn thử thách từ 1 đến 5 đều có lời giải hợp lệ.
  - Kiểm tra tính bất biến của logic: mọi số đo lít luôn là số nguyên (không xuất hiện số lẻ, số âm, không vượt quá dung tích).
  - Đánh giá độc lập sản phẩm đối chiếu với danh sách kiểm tra 9 tiêu chí tại mục 13 của `plan.md`.
  - Lập biên bản phản biện và tổng hợp toàn bộ kết quả nghiệm thu vào file `Result.md`.

## Requirements

### R1. Kiến trúc 4 lớp và tách biệt hoàn toàn cấu hình
Xây dựng dự án theo đúng 4 lớp: `core`, `components`, `activities`, `lessons`. Tất cả dữ liệu bài học (danh sách đồ vật, dung tích, màn chơi, lời thoại của Bi) phải nằm trong thư mục `lessons/capacity/*.json` để người dùng có thể thêm/sửa bài học mới mà không cần sửa code giao diện.

### R2. Trải nghiệm Phần A: "Đồ vật nào đựng được nhiều nước hơn?"
Mỗi lượt thực hiện đủ 3 bước tuần tự:
1. Dự đoán đồ vật đựng nhiều nhất.
2. Đổ qua lại trực quan giữa hai đồ vật để quan sát 3 hiện tượng (tràn ra ngoài, vừa đầy, còn thiếu).
3. Rót vào cốc đong lớn có vạch chia lít để đo đạc chính xác và nhân vật Bi đưa ra nhận xét đối chiếu với dự đoán ban đầu.

### R3. Trải nghiệm Phần B: "Đổ nước giữa các bình"
Mô phỏng chính xác hoạt động đong nước giữa 3 bình 2L, 3L, 5L, vòi nước và cống xả:
- Chế độ Khám phá tự do: Học sinh tự do thao tác đổ qua lại, xả cống, bơm vòi.
- Chế độ Thử thách: 5 màn chơi tăng dần độ khó, tích hợp thuật toán BFS tìm đường đi ngắn nhất để hiển thị gợi ý khi học sinh cần. Khi hoàn thành có hiệu ứng pháo giấy chúc mừng và chuyển màn.

### R4. Thao tác kéo nghiêng bình & Thiết kế thân thiện học sinh lớp 2
- Hỗ trợ đầy đủ Pointer Events cho chuột và cảm ứng: Kéo bình nguồn về phía bình đích thì bình tự nghiêng và dòng nước tuôn chảy; hỗ trợ nút chạm bình nguồn rồi chạm bình đích.
- Giao diện nút bấm tối thiểu 64px, chữ to rõ ràng, độ tương phản cao để trình chiếu trong lớp học, có công tắc ẩn/hiện số lít phục vụ giảng dạy.

### R5. Đánh giá chất lượng và xuất báo cáo `Result.md`
Agent 3 tiến hành kiểm thử độc lập, thẩm định mọi tiêu chí trong checklist nghiệm thu của `plan.md` và xuất tài liệu `Result.md` chi tiết.

## Acceptance Criteria

### Tính chính xác Logic & Thuật toán
- [ ] Mực nước trong mọi thao tác luôn là số nguyên lít (0 <= level <= capacity).
- [ ] Thuật toán BFS giải được trọn vẹn và tính đúng số bước tối ưu cho cả 5 màn thử thách.
- [ ] Quy tắc đổ nước tuân thủ chuẩn: lượng chuyển = `Math.min(from.level, to.capacity - to.level)`.

### Tương tác & Giao diện
- [ ] Hoạt động mượt mà cả 2 cơ chế tương tác: Kéo-thả nghiêng bình và Chạm chọn nguồn-đích.
- [ ] Thanh điều khiển cố định: Nút Trang chủ, Làm lại (Reset), Ẩn/Hiện số lít, Âm thanh hoạt động ổn định.
- [ ] Phần A hiển thị trực quan 3 bước và cốc đong có vạch; Phần B có vòi, cống, gợi ý bước đi và chúc mừng.
- [ ] Hoạt hình nhân vật Bi đổi trạng thái cảm xúc theo tình huống.

### Bàn giao & Báo cáo
- [ ] Dự án build thành công không lỗi cú pháp (`npm run build`).
- [ ] File `Result.md` được tạo với đầy đủ nội dung:
  - Bảng đối chiếu 9 mục trong Checklist mục 13 của `plan.md`.
  - Kết quả kiểm thử thuật toán và các màn chơi.
  - Đánh giá ưu điểm, hạn chế và đề xuất phát triển tiếp theo.
