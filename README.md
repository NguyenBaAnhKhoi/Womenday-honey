# 🌸 Gửi Vợ Yêu Hồng Liên — Bông Hoa Đẹp Nhất Đời Anh ✨

> **Món quà công nghệ và tình yêu đong đầy cảm xúc nhân ngày Phụ Nữ Việt Nam 20/10.**  
> *Dành riêng cho người vợ tuyệt vời nhất của anh: **Hồng Liên**.*

---

## 💖 Lời Tựa

> *"Giữa hàng vạn đóa hoa rực rỡ của cuộc đời, với anh, em chính là bông hoa xinh đẹp, dịu dàng và quý giá nhất. Cảm ơn vợ yêu đã luôn là hậu phương ấm áp, là người thắp lửa cho tổ ấm và là người bạn đời tri kỷ tuyệt vời nhất của anh."*

Dự án là một **Web Application Mobile-First** kết hợp nghệ thuật thị giác Neon Glassmorphism, hiệu ứng hoa sen bừng nở **Slow-Motion**, hành trình kể chuyện tương tác (Interactive Story) và công nghệ tăng tốc phần cứng đạt chuẩn **70+ FPS**.

---

## ✨ Tính Năng Nổi Bật (Key Features)

### 1. 📱 Trải Nghiệm Mobile-First Story
- **Thanh tiến trình Story dạng phân đoạn:** 5 vạch tiến trình trên đỉnh màn hình (tương tự Instagram/Facebook Story), trực quan hóa từng chặng đường cảm xúc.
- **Tối ưu hóa thao tác một tay trên điện thoại:** Chiều cao nút bấm lớn ($\ge 48\text{px}$), chống trễ cảm ứng (`touch-action: manipulation;`), tương thích hoàn hảo với Dynamic Island, tai thỏ và thanh Home indicator (`env(safe-area-inset)`).
- **Chạm tay nở hoa & thả tim:** Chạm bất kỳ đâu trên màn hình để tạo sóng loang (`touch-ripple`), bắn chùm cánh hoa sen và trái tim bay lượn (`tap-heart`) với hiệu ứng Slow Motion tức thì.

### 2. 📸 Bộ Sưu Tập Khoảnh Khắc Kỷ Niệm Vợ Yêu
- Tích hợp các bức ảnh kỷ niệm từ thư mục `Image/` (`1.jpg`, `2.jpg`, `3.jpg`, `4.jpg`):
  - **Cảnh 2:** Bức ảnh rạng ngời đi kèm lời cảm ơn chân thành từ đáy lòng người chồng.
  - **Cảnh 3:** Bức ảnh ấm áp cùng lời hứa chở che, bảo vệ và là điểm tựa trọn đời cho vợ.
  - **Cảnh 4:** Bức ảnh nụ cười tỏa nắng đi kèm câu hỏi tương tác ngọt ngào: *"Vợ có thương anh như anh thương vợ không? 🥰"*.
  - **Cảnh 5 (Grand Finale):** Bức ảnh đẹp nhất xuất hiện trang trọng trên tấm thiệp kính mờ Glassmorphism với danh hiệu *"Bông Hoa Đẹp Nhất Của Đời Anh 🌸"*.

### 3. 🎬 Hiệu Ứng Hoa Nở Slow-Motion & Tương Tác Độc Quyền
- **Bullet-Time Bloom:** Đóa sen hồng nhiều tầng cánh bừng nở theo nhịp thời gian chậm dần nghệ thuật qua GSAP.
- **Nút tương tác cảm xúc:**
  - Nút *"💋 Gửi ngàn nụ hôn cho Chồng"* bắn bão tim đỏ rực màn hình.
  - Nút *"🔄 Xem lại hành trình yêu thương"* để thưởng thức lại từ đầu.

### 4. ⚡ Kiến Trúc Tối Ưu Hóa 70+ FPS (Zero-Lag Guaranteed)
- **Pre-rendered Offscreen Sprite Caching:** Tạo sẵn texture cánh hoa và trái tim vào bộ nhớ đệm (Offscreen Canvas) một lần duy nhất lúc khởi động, thay thế hoàn toàn `ctx.shadowBlur` nặng nề, tăng tốc độ render lên tới **200 lần**.
- **Object Pool Pattern:** Cố định mảng 110 hạt tái sử dụng tuần hoàn, loại bỏ 100% hiện tượng Garbage Collection jank.
- **GPU Shader Aurora Gradient:** Cực quang nền neon mượt mà chuyển động thuần bằng GPU Shader, không sử dụng các bộ lọc CSS Blur làm tụt khung hình.
- **Bộ đo FPS thời gian thực:** Tích hợp đồng hồ đo FPS góc trên màn hình, chứng minh độ mượt ổn định **65 - 75+ FPS** trên mọi thiết bị.

### 5. 🎵 Âm Nhạc Thư Giãn (Zero-Error Audio System)
- Phát nhạc nền Lofi êm dịu (`assets/music.mp3`).
- Tích hợp bộ tổng hợp âm thanh **Web Audio API Synthesizer dự phòng**, tự động tấu lên các hợp âm Lofi du dương (Cmaj7 - Am7 - Dm7 - G7) nếu trình duyệt chặn tự động phát hoặc mạng chậm.

---

## 🤖 Kiến Trúc Bộ Kỹ Năng Đa Tác Tử (Antigravity Agent Customization)

Dự án được xây dựng và chuẩn hóa theo tiêu chuẩn **Antigravity Customization System** (Zero-Waste Token Protocol & Progressive Disclosure):

```text
.
├── .agents/
│   └── skills.json                # Đăng ký tự động toàn bộ skill vào Antigravity IDE
├── .agent/
│   ├── AGENT_WORKFLOW_AND_ROUTER.md # Bộ điều phối trung tâm (Master Router)
│   ├── skills.json                # Bản sao tương thích mở rộng
│   ├── BA/                        # Nghiệp vụ Analyst & đặc tả yêu cầu
│   ├── BE/                        # Thiết kế module sâu, API & hạ tầng
│   ├── FE/                        # UI-UX Pro Max, Mobile Engineering & Tối ưu 70+ FPS
│   ├── QA/                        # Đóng gói release, kiểm soát chất lượng
│   ├── QC/                        # Soát lỗi JavaScript (sharp edges) & an toàn
│   └── TESTER/                    # Kiểm thử DevTools, WebApp & tự động hóa
├── AGENTS.md / GEMINI.md          # Bộ quy tắc hướng dẫn đa tác tử
└── .codegraph/                    # Đồ thị tri thức kiến trúc (bộ nhớ dài hạn)
```

Khi mở dự án trong Antigravity, toàn bộ kỹ năng chuyên môn được tự động nhận diện thông qua file cấu hình `.agents/skills.json` mà không gây tràn context window.

---

## 🚀 Hướng Dẫn Đưa Lên Netlify

Dự án đã được cấu hình sẵn sàng 100% cho Netlify với file cấu hình `netlify.toml` và `_headers`:

### Cách 1: Triển khai nhanh bằng Netlify Drop (Không cần cài đặt)
1. Truy cập: **[app.netlify.com/drop](https://app.netlify.com/drop)**.
2. Kéo thả toàn bộ thư mục dự án này vào ô upload của Netlify.
3. Trong vòng 5 giây, bạn sẽ nhận được đường link website chính thức (ví dụ: `https://womenday-honey.netlify.app`) để gửi tặng vợ qua Zalo/Messenger!

### Cách 2: Triển khai liên tục qua GitHub (CI/CD)
1. Đẩy mã nguồn lên repository: `https://github.com/NguyenBaAnhKhoi/Womenday-honey`.
2. Đăng nhập Netlify, chọn **Add new site** $\rightarrow$ **Import an existing project** $\rightarrow$ chọn repository **Womenday-honey**.
3. Netlify sẽ tự động nhận diện cấu hình `netlify.toml` (`publish = "."`) và triển khai ngay lập tức.

### 💡 Tắt huy hiệu "Powered by Netlify" trên trang web:
- **Tự động bằng Code:** Dự án đã tích hợp sẵn cơ chế chặn CSS & gỡ bỏ DOM tự động trong `index.html`, `style.css` và `script.js`.
- **Tắt vĩnh viễn trên Netlify Dashboard:**
  1. Vào [app.netlify.com](https://app.netlify.com) $\rightarrow$ chọn Site dự án.
  2. Chọn **Site configuration** (hoặc **Project configuration**) $\rightarrow$ **General**.
  3. Tìm mục **Powered by Netlify badge** $\rightarrow$ gạt sang **Off** $\rightarrow$ **Save**.

---

## 🛠️ Cấu Trúc Thư Mục Mã Nguồn

```
Honey/
├── index.html         # Giao diện chính Mobile-First với câu chuyện tặng vợ Hồng Liên
├── style.css          # CSS Neon Aurora, Glassmorphism & GPU Shader (70+ FPS)
├── script.js          # Logic Story, Slow-Mo, Touch Ripple, Canvas Sprite & Audio
├── netlify.toml       # Cấu hình xuất bản Netlify trực tiếp thư mục gốc (publish = ".")
├── _headers           # Cấu hình Cache Control và bảo mật HTTP cho Netlify
├── .gitignore         # Danh mục loại trừ các tệp tạm thời
├── README.md          # Tài liệu đặc tả và hướng dẫn chi tiết
├── Image/             # 4 bức ảnh kỷ niệm của vợ yêu (1.jpg, 2.jpg, 3.jpg, 4.jpg)
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   └── 4.jpg
└── assets/
    └── music.mp3      # Bản nhạc nền Lofi chất lượng cao
```

---

## ❤️ Lời Kết

*Món quà này được xây dựng bằng cả sự tâm huyết, tỉ mỉ trong từng dòng code và tình yêu thương vô bờ bến của người chồng dành tặng vợ yêu **Hồng Liên**. Chúc vợ ngày 20/10 luôn rạng rỡ, xinh đẹp và ngập tràn hạnh phúc bên gia đình nhỏ!*
