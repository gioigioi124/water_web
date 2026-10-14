# Báo cáo chuyển giao công việc (Handoff Report) - Agent 2: Implementation

## 1. Observation

- **Cấu hình ban đầu từ Agent 1:**
  - Thư mục dự án đã có bộ khung 4 lớp: `src/core/`, `src/components/`, `src/activities/`, `src/lessons/capacity/`.
  - Bộ dữ liệu bài học cấu hình thuần JSON: `items.json` (7 đồ vật, 5 lượt so sánh), `levels.json` (5 màn thử thách), `text.vi.json` (toàn bộ văn bản tiếng Việt giao diện và lời thoại Bi), `lesson.json` (khai báo bài học dung tích lít số nguyên).
- **Các thành phần đã triển khai mới và nâng cấp:**
  1. `src/core/theme.css`:
     - Thiết lập hệ biến màu hoạt hình chuẩn: nền trời nhạt `#e8f6ff`, nước `#3da9fc`, mặt nước `#7cc8ff`, vàng nắng `#ffd23f`, hồng đào `#ff8fa3`, chữ xanh đậm `#12355b`.
     - Quy chuẩn kích thước tương tác tối thiểu >= 64px (`--touch-target-min: 64px; .btn-big`).
     - Hoạt họa giọt nước mascot Bi (bồng bềnh, nhảy múa ăn mừng, lắc lư phụng phịu khi nước tràn).
     - Hiệu ứng vũng nước tràn `spill-puddle`, tia nước rót `water-stream-path`, hiệu ứng viền vàng phát sáng khi chọn bình `selected-source` và viền đích hợp lệ `valid-target`.
  2. `src/core/interaction.ts` (Mới):
     - Lớp `VesselInteractionManager` quản lý cơ chế tương tác kép (Dual Pointer Events) đáp ứng chuột, bút cảm ứng và màn hình chạm ngón tay.
     - Kéo nghiêng (Drag-and-Tilt): Khi kéo bình nguồn về phía bình đích, góc nghiêng tự động xoay tỉ lệ theo hướng và khoảng cách (tối đa 50 độ). Khi đưa gần hoặc thả vào bình đích hợp lệ, bình nghiêng đổ nước và tự động tính `amount = Math.min(from.level, to.capacity - to.level)`. Nếu thả ngoài vùng đích, bình trượt đàn hồi (spring back) mượt mà về vị trí ban đầu.
     - Chạm - chạm (Tap-to-Pour): Chạm bình nguồn (bình phát sáng viền vàng và Bi hướng dẫn) -> Chạm bình đích (nước rót sang bình đích) / Chạm vòi (lấy đầy nước) / Chạm cống (xả cạn nước). Hoàn hảo cho máy tính bảng và bảng tương tác lớp học.
  3. `src/components/vessel.ts`:
     - Vẽ bình nước SVG động đa dạng hình thể: Chai nhỏ & bình thể thao cao (`bottle`), bình hoa (`vase`), ấm nước bụng tròn có quai & mỏ rót (`teapot`), xô nhỏ & xô lớn (`bucket_small`, `bucket_large`), và bình chuẩn hình trụ (`standard`).
     - Vạch chia lít sắc nét (1L - 5L), mặt nước sóng sánh với clipPath, nhãn số lít có thể ẩn/hiện bằng công tắc giáo viên, khuôn mặt hoạt hình dễ thương.
     - Hỗ trợ hiển thị tia nước rót cong `streamSvg` từ miệng bình sang bình đích khi đang rót.
  4. `src/components/speech-bubble.ts`:
     - Giọt nước Bi hỗ trợ 6 biểu cảm hoạt hình chân thực: `happy` (cười tươi, vẫy tay), `surprised` (mắt tròn, miệng chữ O), `sad` (mắt rũ, giọt nước mắt phụng phịu khi nước tràn), `celebrating` (mắt sao, miệng cười lớn, ánh hào quang chúc mừng), `thinking` (nhíu mày tò mò), `pointing` (cánh tay SVG chỉ hướng về bình và công cụ gợi ý).
  5. `src/activities/predict-rank.ts` (Phần A - Bước 1: Dự đoán):
     - Hiển thị thanh chọn 5 lượt so sánh (Lượt 1 đến Lượt 5).
     - Trực quan hóa các đồ vật so sánh từ `items.json`, bao gồm các cặp đánh lừa thị giác (bình thể thao cao thon 2L vs ấm nước lùn bụng bự 3L; nồi rộng miệng thấp 3L vs xô nhỏ cao 4L).
     - Học sinh chạm chọn đồ vật dự đoán chứa nhiều nhất (hiển thị viền vàng và huy hiệu `⭐ Em chọn cái này`).
  6. `src/activities/pour-compare.ts` (Phần A - Bước 2: Đổ qua lại đối chiếu):
     - Đồ vật nguồn ban đầu chứa đầy nước; đồ vật đích rỗng.
     - Học sinh kéo nghiêng hoặc bấm nút rót nước, mô phỏng sinh động 3 hiện tượng vật lý:
       * **Tràn ra ngoài (A > B):** Nước tràn bờ tạo thành vũng nước `spill-puddle` dưới chân bình đích, Bi phụng phịu buồn.
       * **Vừa đầy (A == B):** Nước vừa vặn khít miệng bình đích không thừa không thiếu, Bi nhảy múa chúc mừng và pháo giấy.
       * **Còn thiếu (A < B):** Bình đích vẫn còn khoảng trống, bình nguồn đã cạn, Bi suy nghĩ.
     - Nút "🔄 Đổi vai trò đổ" cho phép học sinh thử nghiệm đổ theo chiều ngược lại để hiểu sâu bản chất.
  7. `src/activities/measure.ts` (Phần A - Bước 3: Đo bằng cốc đong chuẩn):
     - Cốc đong chuẩn 5 lít có mỏ rót và vạch chia lít chi tiết 1L, 2L, 3L, 4L, 5L.
     - Cho phép học sinh lần lượt đong từng đồ vật vào cốc để kiểm chứng chính xác số lít thực tế.
     - Thẻ tổng kết đối chiếu thông minh với dự đoán ở Bước 1: Khen ngợi nếu đoán đúng (pháo hoa chúc mừng), giải thích rõ ràng nếu bị thị giác đánh lừa.
  8. `src/activities/explore.ts` (Phần B - Khám phá tự do):
     - Cung cấp 3 bình (2L, 3L, 5L), vòi nước cấp và cống xả nước.
     - Học sinh tự do bơm nước, rót qua lại và xả cống với âm thanh nước chảy và phản hồi dễ thương từ Bi.
  9. `src/activities/goal-puzzle.ts` (Phần B - 5 Màn Thử thách):
     - Giao diện 5 màn thử thách với thanh chọn màn, mục tiêu đề bài nổi bật, bộ công cụ tương ứng từng màn.
     - Tích hợp nút "💡 Gợi ý bước đi": gọi thuật toán BFS tính toán đường đi ngắn nhất từ *trạng thái hiện tại* và hiển thị hướng dẫn cùng hiệu ứng viền phát sáng/nhấp nháy (`hint-target`) lên bình cần thao tác.
     - Đếm số bước đi và so sánh với số bước tối ưu.
     - Khi đạt mục tiêu: nổ pháo hoa `canvas-confetti`, phát âm thanh `ting` chúc mừng và nút chuyển sang màn tiếp theo.
  10. `src/main.ts`:
      - Điều phối toàn bộ luồng giao diện (Trang chủ ➔ Phần A ➔ Phần B) và thanh công cụ cố định trên cùng.
      - Nút Trang chủ (🏠), Làm lại (🔄), Ẩn/Hiện số lít (👁️/🙈), Âm thanh (🔊/🔇), và Hướng dẫn dành cho Giáo viên (👩‍🏫) với modal chứa 5 lời khuyên sư phạm.
- **Kết quả kiểm thử tự động (`npm test`):**
  - Chạy `node scripts/verify-bfs.mjs && node scripts/verify-app-integrity.mjs`:
    ```
    === KIỂM THỬ THUẬT TOÁN BFS 5 MÀN THỬ THÁCH ===
    Màn 1: Làm đầy bình 5 lít -> THÀNH CÔNG (2 bước)
    Màn 2: Đong đúng 2 lít vào bình 5L -> THÀNH CÔNG (1 bước)
    Màn 3: Dùng vòi nước lấy đúng 4 lít -> THÀNH CÔNG (4 bước)
    Màn 4: Tạo ra đúng 1 lít nước -> THÀNH CÔNG (2 bước)
    Màn 5: Thử thách đong 1 lít vào bình 5L -> THÀNH CÔNG (3 bước)
    ✅ 100% các màn thử thách (1 -> 5) đều có lời giải tối ưu hợp lệ!

    === KIỂM THỬ TÍNH TOÀN VẸN VÀ BẤT BIẾN CỦA HỆ THỐNG ===
    1. Kiểm tra cấu hình bài học (lesson.json): ✅ Cấu hình bài học hợp lệ: đơn vị lít, không số thập phân.
    2. Kiểm tra Phần A (items.json): ✅ Đủ 5 lượt so sánh, 100% cặp so sánh hợp lệ.
    3. Kiểm tra Phần B (levels.json): ✅ Đủ 5 màn thử thách, 100% dung tích và mức nước là số nguyên.
    4. Kiểm tra từ điển hiển thị tiếng Việt (text.vi.json): ✅ Đầy đủ module ngôn ngữ.
    5. Kiểm tra tính bất biến phép đổ nước (calculatePour): ✅ Bảo toàn 100% số nguyên lít, không tràn trong Phần B.
    🎉 TOÀN BỘ CÁC TIÊU CHÍ TOÀN VẸN VÀ BẤT BIẾN ĐỀU ĐẠT CHUẨN 100%!
    ```
- **Kết quả biên dịch sản xuất (`npm run build`):**
  - Thực thi: `tsc && vite build`
  - Kết quả: `✓ 23 modules transformed. built in 528ms` với 0 lỗi TypeScript, tạo thư mục `dist/` hoàn chỉnh.

---

## 2. Logic Chain

1. **Tuân thủ quy chuẩn số nguyên lít:** Toàn bộ thuật toán đong rót `calculatePour(from, to)` tuân theo nguyên tắc: `amount = Math.min(from.level, to.capacity - to.level)`. Không có phép chia hay số thập phân, đảm bảo phù hợp 100% cho học sinh lớp 2 theo đúng mục 4.4 của `plan.md`.
2. **Khả năng tương tác kép (Dual Pointer Events):** Nhận diện `pointerdown`, `pointermove`, `pointerup` giúp chuột máy tính, bảng tương tác lớp học (interactive whiteboard) và màn hình cảm ứng điện thoại/tablet cùng dùng chung một bộ điều khiển mượt mà, hỗ trợ cả thao tác kéo nghiêng lẫn chạm nguồn -> chạm đích.
3. **Phân tách hoàn toàn dữ liệu và giao diện:** Mọi văn bản, câu thoại của Bi, thông số đồ vật và cấu hình màn chơi đều được nạp trực tiếp từ `src/lessons/capacity/*.json`, không tồn tại chuỗi văn bản tiếng Việt hay số liệu hardcode trong các component.
4. **Giải thuật BFS tối ưu làm gợi ý:** Thuật toán duyệt không gian trạng thái `solveLevelBfs` không chỉ kiểm thử lúc build mà còn chạy trực tiếp lúc runtime khi người dùng bấm nút "Gợi ý", tính toán bước đi tiếp theo ngắn nhất từ bất kỳ trạng thái nào của học sinh.

---

## 3. Caveats

- **Autoplay Policy của trình duyệt:** Âm thanh Web Audio API được cấu hình kích hoạt khi có tương tác người dùng đầu tiên (click/tap) để tuân thủ chính sách của trình duyệt.
- **Kích thước màn hình:** Đã tối ưu bố cục theo chiều ngang (cho máy chiếu và máy tính bảng nằm ngang) và hỗ trợ tự co giãn (`flex-wrap`) khi màn hình thu hẹp.

---

## 4. Conclusion

- Agent 2 đã hoàn thành 100% yêu cầu phát triển giao diện, hiệu ứng hoạt hình, cơ chế kéo nghiêng, chế độ chạm-chạm, 3 bước của Phần A và toàn bộ chế độ Khám phá + 5 màn Thử thách của Phần B.
- Lệnh `npm test` và `npm run build` đều vượt qua với mã thoát `0`.
- Sẵn sàng bàn giao cho **Agent 3 (Verification, Critique & Report)** thực hiện kiểm tra, phản biện độc lập và lập báo cáo `Result.md`.

---

## 5. Verification Method

Để kiểm tra độc lập toàn bộ sản phẩm của Agent 2:

1. **Biên dịch và kiểm tra kiểu dữ liệu:**
   ```powershell
   npm run build
   ```
   *Kỳ vọng:* `tsc && vite build` chạy hoàn tất không phát sinh lỗi, thư mục `dist/` chứa bundle HTML, JS, CSS.

2. **Kiểm tra tự động thuật toán BFS và tính toàn vẹn hệ thống:**
   ```powershell
   npm test
   ```
   *Kỳ vọng:* Cả 5 màn thử thách đều tìm ra lời giải tối ưu và toàn bộ kiểm tra tính bất biến đều in ra `✅` và `🎉 TOÀN BỘ CÁC TIÊU CHÍ TOÀN VẸN VÀ BẤT BIẾN ĐỀU ĐẠT CHUẨN 100%!`.

3. **Chạy thử nghiệm giao diện trực quan:**
   ```powershell
   npm run preview
   ```
   Hoặc:
   ```powershell
   npm run dev
   ```
   Mở trình duyệt truy cập đường dẫn cục bộ để kiểm tra:
   - Thanh công cụ trên cùng: Nút Trang chủ, Làm lại, Ẩn/Hiện số lít, Bật/Tắt âm thanh, Hướng dẫn giáo viên.
   - Phần A: 3 bước tuần tự (Dự đoán -> Đổ qua lại xem tràn/vừa/thiếu -> Đong cốc 5L đối chiếu).
   - Phần B: Khám phá tự do (2L, 3L, 5L, vòi, cống) và 5 Màn thử thách (Gợi ý BFS, pháo giấy khi hoàn thành).
