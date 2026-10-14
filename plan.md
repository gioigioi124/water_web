# Kế hoạch: Trang web "Vui học dung tích" (lớp 2)

## 0. Tóm tắt

| Mục | Quyết định |
|---|---|
| Đối tượng | Học sinh lớp 2 (khoảng 7-8 tuổi), ít chữ, nút to, hình ảnh là chính |
| Cách dùng | Giáo viên chiếu lên màn hình lớp và học sinh tự thao tác (chuột hoặc cảm ứng) |
| Cấu trúc | Hai phần riêng: **A. So sánh sức chứa đồ vật** và **B. Đổ nước giữa các bình** |
| Thao tác | Kéo bình nghiêng để đổ nước (giống thật) |
| Đơn vị | Chỉ dùng **lít**, số nguyên |
| Chấm điểm | Không chấm điểm, không lưu dữ liệu, không đăng nhập |
| Triển khai | Web tĩnh đăng online, học sinh vào bằng đường link |
| Phong cách | Hoạt hình dễ thương (mục 2) |
| Khả năng mở rộng | Xây thành **khung bài học dùng lại được**: bài "Dung tích" là bài đầu tiên, các bài sau thêm bằng cấu hình (mục 9) |

Nguyên tắc xuyên suốt: mọi con số nước luôn là số nguyên lít, mọi hướng dẫn đều đọc hiểu được bằng hình và biểu tượng, học sinh không thể "làm hỏng" trang web (luôn có nút Làm lại).

---

## 1. Sơ đồ màn hình và luồng người dùng

```
Trang chủ
 ├─ [A] So sánh sức chứa
 │     Bước 1 Dự đoán → Bước 2 Đổ qua lại → Bước 3 Đo bằng cốc đong → Kết quả đối chiếu → Lượt tiếp theo
 └─ [B] Đổ nước giữa các bình
       ├─ Khám phá tự do
       └─ Thử thách (danh sách màn chơi → màn chơi → chúc mừng)
```

Thanh trên cùng của mọi màn hình (cố định): nút Trang chủ, nút Làm lại, công tắc Ẩn/Hiện số lít (dành cho giáo viên), nút Âm thanh bật/tắt.

---

## 2. Phong cách hoạt hình dễ thương

**Nhân vật dẫn dắt:** một giọt nước tròn, mắt to, hay cười (tên gọi tạm là "Bi"). Bi xuất hiện ở góc màn hình, đổi biểu cảm (vui, ngạc nhiên, buồn nhẹ khi nước tràn), nói bằng bong bóng chữ ngắn và có biểu tượng minh họa.

**Bảng màu gợi ý (có thể chỉnh sau):**
- Nền: xanh trời nhạt (#E8F6FF) với mây và bong bóng nhẹ trôi chậm
- Nước: xanh dương tươi (#3DA9FC), phần mặt nước sáng hơn (#7CC8FF)
- Điểm nhấn: vàng nắng (#FFD23F) cho nút chính, hồng đào (#FF8FA3) cho chúc mừng
- Chữ: xanh đậm (#12355B) trên nền sáng, độ tương phản cao để chiếu lớp vẫn rõ

**Chữ:** font tròn, dễ đọc, hỗ trợ tiếng Việt đầy đủ dấu (ví dụ Nunito hoặc Baloo 2 từ Google Fonts), cỡ chữ lớn.

**Hình khối:** nét bo tròn, viền dày, bóng đổ nhẹ. Bình và đồ vật vẽ bằng SVG, có khuôn mặt nhỏ dễ thương tuỳ chọn (có thể bật/tắt để không gây rối khi cần nhìn mực nước).

**Hoạt hình:** nước có sóng gợn nhẹ, tia nước chảy khi đổ, bong bóng nổi lên, bình rung nhẹ khi đầy. Thời gian chuyển cảnh ngắn. Có tuỳ chọn "Giảm chuyển động".

**Âm thanh (tuỳ chọn, mặc định tắt khi chiếu lớp):** tiếng nước róc rách, tiếng "ting" khi đạt mục tiêu.

---

## 3. Phần A: "Đồ vật nào đựng được nhiều nước hơn?"

### 3.1 Đồ vật gợi ý (dung tích là số nguyên lít)

| Đồ vật | Dung tích |
|---|---|
| Chai nhỏ | 1 lít |
| Bình hoa | 2 lít |
| Ấm nước | 3 lít |
| Xô nhỏ | 4 lít |
| Xô lớn | 5 lít |

Lưu ý: dùng cùng một cặp đồ vật có hình dáng *khác nhau nhưng dễ gây hiểu nhầm* (ví dụ chai cao và gầy so với bình thấp và rộng) ở các lượt sau để học sinh hiểu rằng không thể chỉ nhìn chiều cao.

### 3.2 Mỗi lượt gồm 3 bước

**Bước 1: Dự đoán.** Hiện 2 đến 3 đồ vật. Học sinh chạm vào đồ vật nghĩ là đựng nhiều nhất (hoặc xếp thứ tự bằng cách kéo-thả vào các ô 1, 2, 3). Bi hỏi: "Cái nào đựng được nhiều nhất nhỉ?". Chưa hiện đáp án.

**Bước 2: Đổ qua lại.** Đồ vật A đầy nước. Học sinh kéo A nghiêng đổ sang B. Ba kết quả có thể xảy ra, mỗi kết quả có hoạt hình riêng:
- Tràn ra ngoài: A đựng nhiều hơn B
- Vừa đầy: A và B đựng bằng nhau
- Còn thiếu: A đựng ít hơn B (B chưa đầy)
Học sinh được đổi vai trò A/B và thử lại.

**Bước 3: Đo bằng cốc đong có vạch.** Đổ đầy từng đồ vật vào cốc đong lớn có vạch 1, 2, 3, 4, 5 lít. Hiện số lít cạnh vạch (có thể ẩn/hiện bằng công tắc của giáo viên). Sau đó đối chiếu với dự đoán ở Bước 1: Bi nói "Bạn đoán đúng rồi!" hoặc "Cùng xem lại nhé!".

### 3.3 Số lượt gợi ý

Khoảng 5 đến 6 lượt, từ dễ đến khó (từ hai đồ vật khác hẳn nhau đến hai đồ vật dung tích gần nhau hoặc hình dáng đánh lừa). Có thể thêm chế độ xem lượt ngẫu nhiên cho giáo viên.

---

## 4. Phần B: "Đổ nước giữa các bình"

### 4.1 Bộ dụng cụ

- Ba bình: **2 lít, 3 lít, 5 lít**, mỗi bình có vạch lít
- **Vòi nước** (đổ đầy một bình) và **cống** (đổ bỏ hết nước của một bình), chỉ hiện ở các màn cần dùng
- Hiển thị số lít hiện có trong mỗi bình (ẩn/hiện được)

### 4.2 Khám phá tự do

Học sinh tự đổ qua lại, đổ đầy từ vòi, đổ bỏ vào cống. Không có yêu cầu nào. Bi gợi ý nhẹ: "Thử đổ bình 2 lít sang bình 5 lít xem!".

### 4.3 Thử thách (có đề bài mục tiêu, không chấm điểm)

Gợi ý các màn, xếp từ dễ đến khó (lời giải được kiểm tra tự động, xem mục 6.3):

| Màn | Trạng thái ban đầu | Mục tiêu | Lời giải ngắn |
|---|---|---|---|
| 1 | Bình 2 lít đầy, bình 3 lít đầy, bình 5 lít rỗng | Làm đầy bình 5 lít | Đổ 2 lít và 3 lít sang bình 5 lít |
| 2 | Bình 2 lít đầy, bình 5 lít rỗng | Bình 5 lít có đúng 2 lít | Đổ bình 2 lít sang bình 5 lít |
| 3 | Có vòi nước; các bình rỗng | Bình 5 lít có đúng 4 lít | Đổ đầy bình 2 lít rồi đổ sang bình 5 lít, làm hai lần |
| 4 | Có vòi nước; các bình rỗng | Một bình có đúng 1 lít | Đổ đầy bình 3 lít rồi đổ sang bình 2 lít, bình 3 lít còn lại 1 lít |
| 5 (thử thách vui) | Có vòi nước và cống | Bình 5 lít có đúng 1 lít | Khó hơn, tuỳ chọn |

Khi đạt mục tiêu: pháo giấy nhẹ, Bi nhảy múa, nút "Màn tiếp theo". Khi chưa đạt thì không báo lỗi, chỉ có nút "Gợi ý" (hiện bước kế tiếp bằng mũi tên nhấp nháy) và nút Làm lại.

### 4.4 Quy tắc đổ nước (đã chốt cho lớp 2)

- Đổ **tự động đến khi bình nguồn hết nước hoặc bình đích đầy**, không cho dừng giữa chừng, để mọi số lượng luôn là số nguyên lít và học sinh không gặp số thập phân.
- Lượng chuyển = nhỏ nhất của (nước đang có ở bình nguồn, chỗ trống còn lại ở bình đích).
- Nếu bình đích đã đầy hoặc bình nguồn rỗng: bình nghiêng rồi tự về vị trí cũ, Bi nói câu ngắn như "Bình này đầy rồi!".
- Không bao giờ có nước tràn ra ngoài trong Phần B (để tránh làm lệch trọng tâm bài toán); tràn chỉ xuất hiện ở Phần A.

---

## 5. Thao tác kéo nghiêng bình

- Dùng **Pointer Events** để một mã nguồn chạy được cho chuột, bút và cảm ứng.
- Học sinh nhấn giữ bình nguồn, kéo đến gần bình đích: bình tự xoay nghiêng theo khoảng cách tới bình đích. Khi nghiêng quá một ngưỡng và đang ở trên bình đích hợp lệ thì nước bắt đầu chảy.
- Thả tay giữa chừng: bình về vị trí cũ nếu chưa bắt đầu đổ; nếu đã bắt đầu đổ thì cho phép đổ tiếp tự động hết lượng chuyển theo quy tắc 4.4.
- Vùng chạm lớn (tối thiểu 64 px) và hiện viền sáng quanh bình đích hợp lệ khi đang kéo.
- Có nút thay thế "chạm bình nguồn rồi chạm bình đích" cho học sinh khó kéo, và cho giáo viên thao tác nhanh khi chiếu.

---

## 6. Mô hình dữ liệu và logic

### 6.1 Trạng thái

```ts
type Vessel = { id: string; capacity: number; level: number }; // số nguyên lít
type GameState = { vessels: Vessel[]; moves: Move[] };
type Move =
  | { type: "pour"; from: string; to: string }
  | { type: "fill"; vessel: string }    // từ vòi
  | { type: "empty"; vessel: string };  // vào cống
```

### 6.2 Hàm đổ

```ts
function pour(from: Vessel, to: Vessel): number {
  const amount = Math.min(from.level, to.capacity - to.level);
  from.level -= amount;
  to.level += amount;
  return amount; // 0 nếu không đổ được
}
```

Hoạt hình được tách khỏi logic: logic cho kết quả ngay, hoạt hình chạy theo `amount` (thời gian chảy tỉ lệ với số lít).

### 6.3 Kiểm tra màn chơi

Viết một đoạn mã tìm đường (BFS trên không gian trạng thái) để xác nhận mỗi màn thử thách đều có lời giải và tính số bước ít nhất, dùng làm gợi ý. Chạy lúc build, không cần cho học sinh thấy.

### 6.4 Dữ liệu cấu hình

Đồ vật, màn chơi, câu thoại của Bi được viết trong tệp cấu hình riêng (ví dụ JSON) để giáo viên hoặc người lập trình sửa mà không đụng mã giao diện.

---

## 7. Giao diện từng màn hình (phác thảo chữ)

**Trang chủ**
```
[Bi vẫy tay]            VUI HỌC DUNG TÍCH
 ┌───────────────┐   ┌───────────────┐
 │  Đồ vật nào   │   │  Đổ nước giữa │
 │  đựng nhiều?  │   │  các bình     │
 │  (hình 3 đồ   │   │  (hình 3 bình │
 │   vật)        │   │   2-3-5)      │
 └───────────────┘   └───────────────┘
```

**Phần A, Bước 1 (Dự đoán)**
```
[Home] [Làm lại] [Ẩn/hiện lít] [Âm thanh]
         Cái nào đựng nhiều nhất?
   [chai]      [ấm nước]      [xô]
   (chạm để chọn / kéo xếp hạng 1-2-3)
                              [Bi: bong bóng chữ]  [Tiếp ➜]
```

**Phần A, Bước 2 (Đổ qua lại)**
```
      [A đầy nước] ~~nghiêng~~►  [B]
 Kéo A sang B. Bi: "Nước có tràn không nhỉ?"
 [Đổi chỗ A/B] [Làm lại]                  [Tiếp ➜]
```

**Phần A, Bước 3 (Cốc đong)**
```
 [Đồ vật] ➜ đổ vào [Cốc đong lớn 1-2-3-4-5 lít]
 Số lít hiện cạnh vạch. Bảng so sánh với dự đoán Bước 1.
```

**Phần B (Màn chơi)**
```
 Mục tiêu: [hình bình 5 lít + dấu sao + "4"]      [Gợi ý]
   [Vòi 💧]                                       [Cống]
   [bình 2L]    [bình 3L]       [bình 5L]
     2 lít        3 lít           0 lít   (ẩn/hiện được)
```

Bố cục ưu tiên **chiều ngang** (chiếu lớp, máy tính bảng ngang). Khi dọc (điện thoại), xếp bình theo hàng ngang thu nhỏ hoặc cuộn nhẹ, giữ nút lớn.

---

## 8. Công nghệ và triển khai

**Đề xuất:** web tĩnh (HTML, CSS, JavaScript hoặc TypeScript), vẽ bình và nước bằng **SVG** (dùng `clipPath` cho mực nước và hoạt hình sóng bằng CSS/JS). Không cần máy chủ hay cơ sở dữ liệu.

- **Cách làm đơn giản nhất:** JavaScript thuần với Vite để đóng gói, hoặc một khung nhẹ như Preact/Svelte nếu muốn dễ tách thành phần. Với phạm vi này, JavaScript thuần hoặc TypeScript thuần là đủ.
- **Đăng online:** dịch vụ lưu trữ web tĩnh miễn phí như GitHub Pages, Netlify hoặc Cloudflare Pages. Học sinh vào bằng một đường link (có thể làm mã QR để chiếu lên lớp).
- **Hiệu năng:** tải nhanh trên điện thoại cũ (nén SVG, hạn chế hoạt hình nặng), chạy tốt trên trình duyệt phổ biến hiện nay.
- **Không thu thập dữ liệu:** không đăng nhập, không cookie theo dõi, thuận tiện cho dùng trong trường học.

---

## 9. Kiến trúc để tái sử dụng cho các bài học sau

### 9.1 Ý tưởng: tách thành 4 lớp

| Lớp | Nội dung | Dùng lại thế nào |
|---|---|---|
| **Lõi dùng chung** (`core`) | Khung trang, chuyển giữa các bài học, thanh công cụ (Trang chủ, Làm lại, Ẩn/hiện số, Âm thanh), cơ chế kéo-thả, chủ đề giao diện, nhân vật Bi, âm thanh, hiệu ứng chúc mừng | Mọi bài học đều dùng |
| **Thành phần** (`components`) | Bình/đồ vật, cốc đong, vòi, cống, thước vạch, bong bóng thoại, nút lớn, ô chọn, ô xếp hạng | Ghép lại cho từng hoạt động |
| **Kiểu hoạt động** (`activities`) | Dự đoán/xếp hạng, thao tác và quan sát, đo bằng dụng cụ, đề mục tiêu (kiểm tra trạng thái đích), trắc nghiệm bằng hình | Mỗi kiểu nhận một cấu hình và báo "đã hoàn thành" |
| **Bài học** (`lessons`) | Một thư mục cấu hình: tên, biểu tượng, danh sách hoạt động theo thứ tự, dữ liệu (đồ vật, màn chơi), câu thoại của Bi, đơn vị | Bài "Dung tích" là bài đầu tiên; bài mới chỉ thêm một thư mục |

Phần mô phỏng nước (bình, cốc đong, quy tắc đổ) là thành phần riêng của chủ đề chất lỏng; bộ máy "đề mục tiêu" (trạng thái đầu, các thao tác hợp lệ, trạng thái đích, tìm lời giải) viết **tổng quát** để dùng được cho cả những bài khác có dạng "biến đổi trạng thái để đạt mục tiêu".

### 9.2 Cấu trúc thư mục gợi ý

```
src/
  core/          khung trang, định tuyến, thanh công cụ, kéo-thả, chủ đề, âm thanh, ngôn ngữ
  components/    vessel, measuring-cup, tap, sink, ruler, speech-bubble, big-button
  activities/    predict-rank, pour-compare, measure, goal-puzzle, quiz
  lessons/
    capacity/    lesson.json, items.json, levels.json, text.vi.json, assets/
    (bài mới)/   cùng cấu trúc
public/
```

### 9.3 Ví dụ cấu hình một bài học

```json
{
  "id": "capacity",
  "title": "Dung tích",
  "icon": "assets/icon.svg",
  "unit": "lít",
  "allowDecimals": false,
  "activities": [
    { "type": "predict-rank", "data": "items.json#round1" },
    { "type": "pour-compare", "data": "items.json#round1" },
    { "type": "measure", "data": "items.json#round1" },
    { "type": "goal-puzzle", "data": "levels.json" }
  ]
}
```

Các giá trị như dung tích 2-3-5, danh sách đồ vật, màn thử thách và câu thoại của Bi **không viết cứng trong mã**, chỉ nằm trong các tệp cấu hình.

### 9.4 Ba mức khi thêm nội dung mới

1. **Chỉ sửa nội dung** (không cần lập trình): thêm đồ vật, thêm màn thử thách, đổi dung tích các bình, sửa câu thoại.
2. **Bài mới dùng kiểu hoạt động có sẵn**: tạo thư mục bài học mới, viết cấu hình và dữ liệu, ghép các hoạt động đã có.
3. **Hoạt động mới**: viết thêm một kiểu hoạt động (cần lập trình), đăng ký vào danh sách kiểu hoạt động để mọi bài khác cũng dùng được.

### 9.5 Quy ước giữ cho khung dùng lại được

- Dữ liệu tách khỏi giao diện; không viết cứng số liệu trong mã.
- Màu sắc, cỡ chữ, độ bo góc lấy từ biến giao diện (CSS variables) để đổi phong cách hoặc tạo chủ đề mới mà không sửa từng thành phần.
- Mọi dòng chữ nằm trong tệp ngôn ngữ (ví dụ `text.vi.json`) để sửa lời hoặc thêm ngôn ngữ sau này.
- Đơn vị và mức độ theo từng bài (ví dụ bài này chỉ số nguyên lít; bài lớn hơn có thể cho phép số thập phân hoặc ml).
- Mỗi thành phần chỉ nhận dữ liệu qua đầu vào rõ ràng, không đọc trạng thái toàn cục, để ghép lại ở bài khác.

### 9.6 Trang chủ nhiều bài và liên kết trực tiếp

- Trang chủ hiển thị **danh sách thẻ bài học** từ danh mục bài học. Hiện chỉ có một bài nhưng khung đã sẵn sàng.
- Mỗi hoạt động có đường link riêng (ví dụ `?bai=dung-tich&hoatdong=thu-thach&man=3`) để giáo viên mở thẳng đúng màn trên lớp hoặc gửi cho học sinh.

### 9.7 Hướng phát triển sau (tuỳ chọn, vẫn không cần máy chủ)

- Trang **soạn bài cho giáo viên**: điền biểu mẫu để tự đặt dung tích các bình, mục tiêu và đồ vật, rồi xuất ra tệp cấu hình hoặc đường link chia sẻ.
- Ngân hàng đồ vật và màn chơi dùng chung giữa các bài.

---

## 10. Khả năng tiếp cận và thân thiện lớp 2

- Chữ lớn, câu ngắn, mỗi màn chỉ một việc chính
- Không chỉ dùng màu để truyền thông tin: luôn có số lít, vạch và biểu tượng đi kèm
- Nút tối thiểu 64 px, cách nhau đủ rộng
- Tuỳ chọn "Giảm chuyển động" và "Tắt âm"
- Đọc hướng dẫn bằng giọng nói là phần **tuỳ chọn**: có thể dùng bản ghi âm giọng người đọc (ổn định hơn), hoặc giọng đọc của trình duyệt (tuỳ thiết bị có giọng tiếng Việt hay không, cần thử trên máy thật)

---

## 11. Hướng dẫn ngắn cho giáo viên (sẽ có trong trang "Dành cho giáo viên")

1. **Ẩn số lít** rồi để cả lớp đoán, sau đó **hiện số lít** để đối chiếu.
2. Dùng Phần A để vào bài: cho học sinh dự đoán trước khi đổ nước.
3. Dùng Phần B ở chế độ khám phá trước, sau đó chuyển sang Thử thách.
4. Gợi ý câu hỏi thảo luận: "Vì sao bình cao hơn mà chưa chắc đựng nhiều hơn?", "2 lít cộng 3 lít được bao nhiêu lít?".
5. Chiếu mã QR để học sinh tự mở trên thiết bị của mình.

---

## 12. Lộ trình thực hiện

| Giai đoạn | Việc chính | Kết quả |
|---|---|---|
| 1. Nền tảng | Khung lõi dùng chung, cơ chế nạp bài học từ cấu hình, trang chủ dạng danh sách bài, thanh công cụ, phong cách hoạt hình (màu, font, Bi) | Giao diện chạy được, bài "Dung tích" đã đăng ký trong khung |
| 2. Phần B (cốt lõi) | Bình SVG, logic đổ, kéo nghiêng, khám phá tự do | Đổ nước giữa 2-3-5 hoạt động |
| 3. Thử thách | Vòi, cống, các màn 1-5, gợi ý, chúc mừng | Chơi trọn bộ Phần B |
| 4. Phần A | Đồ vật, 3 bước, cốc đong, đối chiếu dự đoán | Chơi trọn bộ Phần A |
| 5. Hoàn thiện | Ẩn/hiện lít, giảm chuyển động, âm thanh, trang giáo viên | Bản dùng trên lớp |
| 6. Thử và đăng | Thử trên máy chiếu, điện thoại, máy tính bảng; đăng online; tạo mã QR | Link cho học sinh |
| 7. Kiểm chứng khả năng tái sử dụng | Thử thêm một bài rất nhỏ (ví dụ một hoạt động mới chỉ bằng cấu hình) để xem khung có đủ linh hoạt không | Điều chỉnh khung trước khi thêm nhiều bài |

Nên làm **Phần B trước** vì đây là phần phức tạp nhất (kéo nghiêng, logic đổ); phần nước và bình dùng lại được cho Phần A.

---

## 13. Danh sách kiểm tra trước khi dùng trên lớp

- [ ] Kéo bình bằng chuột, bằng ngón tay, và bằng cách chạm-chạm đều hoạt động
- [ ] Mọi màn thử thách có lời giải (đã chạy kiểm tra tự động)
- [ ] Số lít luôn là số nguyên, không bao giờ âm hoặc vượt dung tích
- [ ] Chiếu lớp: chữ và vạch lít nhìn rõ từ cuối lớp
- [ ] Công tắc ẩn/hiện số lít hoạt động ở mọi màn
- [ ] Chạy ổn trên điện thoại cũ và mạng chậm
- [ ] Nút Làm lại luôn có mặt và hoạt động
- [ ] Không còn số liệu hay câu chữ viết cứng trong mã (đều lấy từ tệp cấu hình)
- [ ] Thêm thử một đồ vật hoặc một màn chơi mới chỉ bằng cách sửa tệp cấu hình

---

## 14. Rủi ro và điểm cần bạn quyết định thêm

1. **Độ tuổi:** kế hoạch này viết cho lớp 2. Nếu thực tế là lớp 6-9, cần nâng độ khó, thêm đơn vị ml và cho phép đổ một phần.
2. **Dung tích đồ vật thật:** ly, chai thực tế thường dưới 1 lít. Vì chỉ dùng số nguyên lít, Phần A dùng đồ vật "phóng to" (xô, can, bình lớn). Bạn có muốn thêm phân số (nửa lít) sau này không?
3. **Đổ một phần:** hiện chốt là chỉ đổ đến khi nguồn hết hoặc đích đầy. Nếu muốn cho học sinh tự dừng giữa chừng, sẽ cần thêm số thập phân hoặc vạch nhỏ hơn.
4. **Giọng đọc hướng dẫn:** dùng bản thu âm hay giọng của trình duyệt (cần thử thiết bị)?
5. **Tên và hình dáng của Bi:** có thể giữ như đề xuất hoặc thay bằng nhân vật khác bạn thích.
6. **Địa chỉ đăng web:** dùng tên miền miễn phí của dịch vụ lưu trữ hay tên miền riêng của trường?
7. **Các bài học sau:** dự kiến là những chủ đề nào (ví dụ đo độ dài, cân nặng, giờ, tiền) và cho lớp nào? Biết trước sẽ giúp chọn đúng các thành phần dùng chung thay vì làm quá rộng.
8. **Ai sẽ thêm nội dung mới:** chỉ bạn (sửa tệp cấu hình), hay cả đồng nghiệp là giáo viên cần một trang soạn bài có biểu mẫu (mục 9.7)?
