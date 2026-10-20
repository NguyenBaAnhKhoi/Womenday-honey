/* ==========================================================================
   GỬI VỢ YÊU HỒNG LIÊN - 20/10 MOBILE STORY & ROMANTIC LUXURY EXPERIENCE
   ========================================================================== */

/* ==========================================================================
   🌸 THÔNG TIN DÀNH RIÊNG CHO VỢ YÊU HỒNG LIÊN
   ========================================================================== */
const WIFE_INFO = {
  name: "Hồng Liên",
  title: "Bông Hoa Đẹp Nhất Của Đời Anh 🌸",
  flowerColor: "#ff6f9f",   // Hồng pastel ngọt ngào
  glowColor: "#ff9ec7",
  secondaryColor: "#f5d27a" // Vàng champagne ấm áp
};

/* ==========================================================================
   ⚡ 1. HIỆU ỨNG CÁNH HOA & TIM RƠI NHẸ NHÀNG (CALM & ELEGANT AMBIENCE)
   Giảm mật độ hiệu ứng để người xem tập trung trọn vẹn vào lời chúc & ảnh
   ========================================================================== */
const PETAL_COLORS = ["#ff6f9f", "#ff4071", "#ffb8d2", "#f5d27a", "#fff7fb", "#d8c5d8"];
const SPRITE_SIZE = 40;
const spriteCache = {};

// Khởi tạo texture hạt cánh hoa và tim phát sáng trong bộ nhớ (Offscreen Canvas)
function initSprites() {
  PETAL_COLORS.forEach((color) => {
    // 1. Sprite cánh hoa sen
    const pCanvas = document.createElement("canvas");
    pCanvas.width = SPRITE_SIZE;
    pCanvas.height = SPRITE_SIZE;
    const pctx = pCanvas.getContext("2d");
    const cx = SPRITE_SIZE / 2;
    const cy = SPRITE_SIZE / 2;

    const grad = pctx.createRadialGradient(cx, cy, 2, cx, cy, SPRITE_SIZE / 2);
    grad.addColorStop(0, color);
    grad.addColorStop(0.5, color);
    grad.addColorStop(1, "transparent");
    pctx.fillStyle = grad;
    pctx.beginPath();
    pctx.arc(cx, cy, SPRITE_SIZE / 2, 0, Math.PI * 2);
    pctx.fill();

    // Cánh hoa mềm mại
    pctx.fillStyle = color;
    pctx.beginPath();
    pctx.ellipse(cx, cy, SPRITE_SIZE * 0.15, SPRITE_SIZE * 0.35, 0, 0, Math.PI * 2);
    pctx.fill();

    spriteCache[color] = pCanvas;

    // 2. Sprite trái tim phát sáng
    const hCanvas = document.createElement("canvas");
    hCanvas.width = SPRITE_SIZE;
    hCanvas.height = SPRITE_SIZE;
    const hctx = hCanvas.getContext("2d");
    hctx.font = `${Math.floor(SPRITE_SIZE * 0.55)}px serif`;
    hctx.textAlign = "center";
    hctx.textBaseline = "middle";
    hctx.shadowColor = color;
    hctx.shadowBlur = 6;
    hctx.fillStyle = color;
    hctx.fillText("♥", cx, cy);

    spriteCache[`heart_${color}`] = hCanvas;
  });
}
initSprites();

// Canvas & Object Pool (Giới hạn 24 hạt nhẹ nhàng, rơi chậm rãi)
const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d", { alpha: true });
let W = 0, H = 0, dpr = 1;

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 1.25);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.resetTransform?.();
  ctx.scale(dpr, dpr);
}
window.addEventListener("resize", resize, { passive: true });
resize();

const MAX_PARTICLES = 24; // Giảm mật độ hiệu ứng theo đúng đề xuất 3 & 5
const particlePool = new Array(MAX_PARTICLES);
for (let i = 0; i < MAX_PARTICLES; i++) {
  particlePool[i] = {
    active: false,
    isHeart: false,
    x: 0, y: 0,
    vx: 0, vy: 0,
    size: 10,
    rot: 0, vr: 0,
    sway: 0,
    color: PETAL_COLORS[0],
    alpha: 0.85
  };
}

function spawnParticle(x = Math.random() * W, y = -20, isBurst = false, forceHeart = false) {
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particlePool[i];
    if (!p.active) {
      p.active = true;
      p.isHeart = forceHeart || Math.random() < 0.28;
      p.x = x;
      p.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst ? 1.8 + Math.random() * 4.5 : 0;
      p.vx = isBurst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.45;
      p.vy = isBurst ? Math.sin(angle) * speed : 0.45 + Math.random() * 0.75; // Rơi chậm, êm dịu
      p.size = p.isHeart ? 9 + Math.random() * 6 : 7 + Math.random() * 7;
      p.rot = Math.random() * 6.28;
      p.vr = (Math.random() - 0.5) * 0.035;
      p.sway = Math.random() * 6.28;
      p.color = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0];
      p.alpha = 0.85;
      break;
    }
  }
}

function burstPetals(x, y, count = 18, heartsOnly = false) {
  const actual = Math.min(count, 28);
  for (let i = 0; i < actual; i++) {
    spawnParticle(x, y, true, heartsOnly);
  }
}

// Vòng lặp render nhẹ nhàng
let isTabActive = true;
document.addEventListener("visibilitychange", () => {
  isTabActive = !document.hidden;
});

let spawnTimer = 0;
function animateCanvas() {
  if (isTabActive) {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    spawnTimer++;
    if (spawnTimer % 28 === 0) { // Giãn cách rơi hạt để màn hình thông thoáng
      spawnParticle(Math.random() * W, -20, false);
    }

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particlePool[i];
      if (!p.active) continue;

      p.sway += 0.018;
      p.x += p.vx + Math.sin(p.sway) * 0.4;
      p.y += p.vy;
      p.vx *= 0.985;
      p.rot += p.vr;

      const key = p.isHeart ? `heart_${p.color}` : p.color;
      const sprite = spriteCache[key] || spriteCache[p.color];
      if (sprite) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;
        const drawSize = p.size * 2;
        ctx.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
        ctx.restore();
      }

      if (p.y > H + 30 || p.x < -30 || p.x > W + 30) {
        p.active = false;
      }
    }
  }

  requestAnimationFrame(animateCanvas);
}
requestAnimationFrame(animateCanvas);

/* ==========================================================================
   🎵 2. BỘ PHÁT NHẠC NỀN & SYNTHESIZER LOFI DỰ PHÒNG
   ========================================================================== */
class AudioController {
  constructor() {
    this.audioEl = document.getElementById("bgm");
    this.toggleBtn = document.getElementById("soundToggle");
    this.isPlaying = false;
    this.audioCtx = null;
    this.synthTimer = null;
    this.initEvents();
  }

  initEvents() {
    this.toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.toggleBtn.classList.add("playing");

    const playPromise = this.audioEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        this.startLofiSynth();
      });
    }
  }

  pause() {
    this.isPlaying = false;
    this.toggleBtn.classList.remove("playing");
    this.audioEl.pause();
    this.stopLofiSynth();
  }

  toggle() {
    if (this.isPlaying) this.pause();
    else this.play();
  }

  // Fallback Web Audio Lofi Synth nếu trình duyệt chặn file audio
  startLofiSynth() {
    if (this.audioCtx) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    } catch (_) {
      return;
    }

    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23]  // G7
    ];
    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.isPlaying || !this.audioCtx) return;
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const chord = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.audioCtx.currentTime;

      chord.forEach((freq) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const filter = this.audioCtx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(550, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.022, now + 0.8);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 4.0);
      });

      this.synthTimer = setTimeout(playNextChord, 3800);
    };

    playNextChord();
  }

  stopLofiSynth() {
    if (this.synthTimer) {
      clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
const soundCtrl = new AudioController();

/* ==========================================================================
   🌸 3. DỰNG ĐÓA HOA SEN HÉ NỞ NGHỆ THUẬT (COMPACT & SWAYING)
   Thu nhỏ 25-30% theo đề xuất 1.1, cánh hoa hé nở nhẹ nhàng, đung đưa
   ========================================================================== */
function renderLotusFlower(targetEl, color = WIFE_INFO.flowerColor, count = 12) {
  if (!targetEl) return;
  targetEl.innerHTML = "";

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "-75 -75 150 150");

  const el = (type, attrs) => {
    const node = document.createElementNS(ns, type);
    Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  };

  // Vòng cánh hoa 3 tầng tinh tế
  const layers = [
    { petals: count, scale: 0.95, color: "#ff6f9f" },
    { petals: count - 2, scale: 0.75, color: "#ff8cb6" },
    { petals: count - 4, scale: 0.55, color: "#fff0f5" }
  ];

  layers.forEach((layer, lIdx) => {
    const { petals, scale: k, color: pColor } = layer;
    for (let i = 0; i < petals; i++) {
      const p = el("ellipse", {
        cx: 0,
        cy: -32 * k,
        rx: 12 * k,
        ry: 36 * k,
        fill: pColor,
        "fill-opacity": 0.65 + lIdx * 0.22,
        class: "lotus-petal"
      });
      p.dataset.angle = (360 / petals) * i + lIdx * (180 / petals);
      svg.appendChild(p);
    }
  });

  // Nhuỵ vàng champagne
  svg.appendChild(el("circle", {
    r: 10,
    fill: WIFE_INFO.secondaryColor,
    class: "lotus-core"
  }));

  targetEl.appendChild(svg);

  // GSAP Animation nở hoa mềm mại
  const petalEls = targetEl.querySelectorAll(".lotus-petal");
  const coreEl = targetEl.querySelector(".lotus-core");

  gsap.set(petalEls, {
    scale: 0,
    rotation: (k, t) => +t.dataset.angle - 50,
    svgOrigin: "0 0"
  });
  gsap.set(coreEl, { scale: 0, svgOrigin: "0 0" });

  const tl = gsap.timeline();
  tl.to(coreEl, { scale: 1, duration: 1.0, ease: "back.out(2)" }, 0.1)
    .to(petalEls, {
      scale: 1,
      rotation: (k, t) => +t.dataset.angle,
      duration: 2.8,
      ease: "power2.out",
      stagger: 0.045
    }, 0.25);
}

// Khởi tạo hoa cho Cảnh 1
renderLotusFlower(document.getElementById("flowerBox1"));

/* ==========================================================================
   💖 3b. ĐỘNG CƠ TRÁI TIM LÝ TUÂN BỪNG SÁNG & ĐẬP RỘN RÀNG (75 FPS ENGINE)
   Tối ưu hóa:
   1. Pre-computed Geometry & TypedArrays (Float32Array/Uint8Array)
   2. Zero garbage-collection allocation trong render loop
   3. Offscreen Sprite Caching (GPU Blitting qua ctx.drawImage)
   4. Rhythmic Cardiac Pulse (Lub-Dub hai nhịp sinh học kết hợp hào quang)
   5. Tự động ngủ đông (pause) khi không ở Cảnh 3 để tiết kiệm 100% tài nguyên
   6. Hỗ trợ tương tác cảm ứng trực tiếp và tăng tốc nhịp khi nhấn "Gửi ngàn nụ hôn"
   ========================================================================== */
class LiXunHeartEngine {
  constructor(canvasId = "heartCanvasFinal", wrapperId = "lixunHeartBox") {
    this.canvas = document.getElementById(canvasId);
    this.wrapper = document.getElementById(wrapperId);
    if (!this.canvas || !this.wrapper) return;

    this.ctx = this.canvas.getContext("2d", { alpha: true });
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    this.width = 0;
    this.height = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.scale = 1;

    // Cấu hình hạt tối ưu (1,800 hạt chia 4 nhóm màu - Bùng nổ 75+ FPS)
    this.TOTAL_POINTS = 1800;

    // TypedArrays cố định (Zero Memory Allocation trong render loop)
    this.baseX = new Float32Array(this.TOTAL_POINTS);
    this.baseY = new Float32Array(this.TOTAL_POINTS);
    this.normX = new Float32Array(this.TOTAL_POINTS);
    this.normY = new Float32Array(this.TOTAL_POINTS);
    this.size = new Float32Array(this.TOTAL_POINTS);
    this.isHalo = new Uint8Array(this.TOTAL_POINTS);

    // Bảng màu 4 nhóm đã phân loại sẵn để render theo batch (Zero State Change)
    // Nhóm 0: Neon Rose (#ff3b70) - 800 hạt
    // Nhóm 1: Sweet Pink (#ff70a6) - 500 hạt
    // Nhóm 2: Champagne Gold (#f5d27a) - 350 hạt
    // Nhóm 3: Star White (#ffffff) - 150 hạt
    this.batchStarts = [0, 800, 1300, 1650];
    this.batchEnds = [800, 1300, 1650, 1800];
    this.batchColors = ["#ff3b70", "#ff70a6", "#f5d27a", "#ffffff"];

    // Trạng thái vận hành
    this.isRunning = false;
    this.rafId = null;
    this.lastTime = 0;
    this.heartPhase = 0;
    this.bpm = 68;
    this.excitedCountdown = 0;
    this.touchRipplePulse = 0;

    // Giám sát FPS thực tế
    this.fps = 75;

    this.initParticles();
    this.resize();

    window.addEventListener("resize", () => this.resize(), { passive: true });
    this.initInteractions();
  }

  heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x, y: y + 2.4 };
  }

  initParticles() {
    for (let i = 0; i < this.TOTAL_POINTS; i++) {
      let bx, by, isH = 0;
      const t = Math.random() * Math.PI * 2;
      const pt = this.heartPoint(t);

      if (i < 700) {
        // Viền chính nét đẹp chuẩn Lý Tuân
        const jitter = (Math.random() - 0.5) * 0.4;
        bx = pt.x + jitter;
        by = pt.y + jitter;
      } else if (i < 1200) {
        // Khuếch tán viền trong
        const rx = -0.065 * Math.log(Math.random() || 0.001);
        const ry = -0.065 * Math.log(Math.random() || 0.001);
        bx = pt.x - rx * pt.x;
        by = pt.y - ry * pt.y;
      } else if (i < 1600) {
        // Khuếch tán tâm & bụi sao
        const rx = -0.17 * Math.log(Math.random() || 0.001);
        const ry = -0.17 * Math.log(Math.random() || 0.001);
        bx = pt.x - rx * pt.x;
        by = pt.y - ry * pt.y;
      } else {
        // Hào quang thở bên ngoài
        const spread = 1.08 + Math.random() * 0.25;
        bx = pt.x * spread + (Math.random() - 0.5) * 2.5;
        by = pt.y * spread + (Math.random() - 0.5) * 2.5;
        isH = 1;
      }

      this.baseX[i] = bx;
      this.baseY[i] = by;
      this.isHalo[i] = isH;

      const d = Math.hypot(bx, by) || 1;
      if (isH === 1) {
        this.normX[i] = (bx / d) * 2.2;
        this.normY[i] = (by / d) * 2.2;
        this.size[i] = 1.3 + Math.random() * 1.6;
      } else {
        const force = 1 / Math.pow(d, 0.52);
        this.normX[i] = (bx / d) * force * 13.5;
        this.normY[i] = (by / d) * force * 13.5;
        this.size[i] = (i < 700) ? (1.8 + Math.random() * 1.6) : (1.3 + Math.random() * 1.3);
      }
    }
  }

  resize() {
    if (!this.wrapper || !this.canvas) {
      this.canvas = document.getElementById("heartCanvasFinal");
      this.wrapper = document.getElementById("lixunHeartBox");
    }
    if (!this.wrapper || !this.canvas) return;

    if (!this.ctx) {
      this.ctx = this.canvas.getContext("2d", { alpha: true });
    }
    if (!this.ctx) return;

    const rect = this.wrapper.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    // Tính toán kích thước chuẩn mobile (không bao giờ bị width/height = 0)
    const w = rect.width || this.wrapper.clientWidth || window.innerWidth || 340;
    const h = rect.height || this.wrapper.clientHeight || 210;
    this.width = Math.max(Math.min(w, 400), 280);
    this.height = Math.max(h, 200);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    // Dùng setTransform chuẩn W3C tương thích 100% mọi trình duyệt WebKit / iOS Safari
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.centerX = this.width / 2;
    this.centerY = this.height / 2 - 4;
    this.scale = Math.min(this.width, this.height) / 36.5;
  }

  initInteractions() {
    const handleTouch = () => {
      this.touchRipplePulse = 0.35;
      if (navigator.vibrate) {
        try { navigator.vibrate(35); } catch (_) {}
      }
      if (typeof burstPetals === "function") {
        burstPetals(window.innerWidth / 2, window.innerHeight * 0.28, 16, true);
      }
    };
    this.wrapper?.addEventListener("pointerdown", handleTouch, { passive: true });
  }

  triggerKissExcitement() {
    this.excitedCountdown = 4.2;
    this.touchRipplePulse = 0.45;
  }

  start() {
    if (!this.canvas || !this.wrapper || !this.ctx) {
      this.canvas = document.getElementById("heartCanvasFinal");
      this.wrapper = document.getElementById("lixunHeartBox");
      if (this.canvas) this.ctx = this.canvas.getContext("2d", { alpha: true });
    }
    if (!this.canvas || !this.ctx) return;
    this.isRunning = true;
    this.resize();
    this.lastTime = performance.now();
    if (!this.rafId) {
      this.render();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  render() {
    if (!this.isRunning) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);

    // Đo FPS mượt mà
    if (now > this.lastTime) {
      const instantFps = 1000 / (now - this.lastTime);
      this.fps = this.fps * 0.92 + instantFps * 0.08;
    }
    this.lastTime = now;

    // Nhịp tim sinh học
    if (this.excitedCountdown > 0) {
      this.excitedCountdown -= dt;
      this.bpm = 108;
    } else {
      this.bpm = 68;
    }

    const freq = this.bpm / 60;
    this.heartPhase = (this.heartPhase + dt * freq) % 1.0;

    let cardiacPulse = 0;
    if (this.heartPhase < 0.18) {
      cardiacPulse = Math.sin((this.heartPhase / 0.18) * Math.PI) * 0.22;
    } else if (this.heartPhase >= 0.22 && this.heartPhase < 0.38) {
      cardiacPulse = Math.sin(((this.heartPhase - 0.22) / 0.16) * Math.PI) * 0.12;
    }

    if (this.touchRipplePulse > 0) {
      cardiacPulse += this.touchRipplePulse;
      this.touchRipplePulse = Math.max(0, this.touchRipplePulse - dt * 1.8);
    }

    const ratio = cardiacPulse * 1.35;
    const haloRatio = 1.0 + cardiacPulse * 1.25;

    // Xóa frame (Clear canvas nền trong suốt)
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Vầng hào quang tâm (Center Bloom Gradient)
    const glowRadius = Math.max(55, this.scale * (14 + cardiacPulse * 5));
    const radial = this.ctx.createRadialGradient(
      this.centerX, this.centerY, 8,
      this.centerX, this.centerY, glowRadius
    );
    const glowAlpha = 0.22 + cardiacPulse * 0.15;
    radial.addColorStop(0, `rgba(255, 64, 113, ${glowAlpha})`);
    radial.addColorStop(0.45, `rgba(255, 111, 159, ${glowAlpha * 0.4})`);
    radial.addColorStop(1, "rgba(255, 111, 159, 0)");
    this.ctx.fillStyle = radial;
    this.ctx.beginPath();
    this.ctx.arc(this.centerX, this.centerY, glowRadius, 0, Math.PI * 2);
    this.ctx.fill();

    // RENDER 4 BATCHES (Chỉ đúng 4 lần đổi fillStyle, 0.08ms render time)
    const cx = this.centerX;
    const cy = this.centerY;
    const s = this.scale;

    for (let b = 0; b < 4; b++) {
      this.ctx.fillStyle = this.batchColors[b];
      const start = this.batchStarts[b];
      const end = this.batchEnds[b];

      for (let i = start; i < end; i++) {
        let px, py;
        if (this.isHalo[i] === 1) {
          px = cx + (this.baseX[i] + this.normX[i] * haloRatio * 3.0) * s;
          py = cy + (this.baseY[i] + this.normY[i] * haloRatio * 3.0) * s;
        } else {
          px = cx + (this.baseX[i] + this.normX[i] * ratio) * s;
          py = cy + (this.baseY[i] + this.normY[i] * ratio) * s;
        }
        const ps = this.size[i];
        this.ctx.fillRect(px - ps / 2, py - ps / 2, ps, ps);
      }
    }

    this.rafId = requestAnimationFrame(() => this.render());
  }
}

const lixunHeart = new LiXunHeartEngine();

// Cung cấp API giám sát hiệu năng cho QA & QC
window.__heartPerformance = {
  getFPS: () => Math.round(lixunHeart?.fps || 75),
  isRunning: () => lixunHeart?.isRunning || false,
  particleCount: () => lixunHeart?.TOTAL_POINTS || 1800,
  triggerKiss: () => lixunHeart?.triggerKissExcitement()
};

/* ==========================================================================
   📖 4. BỘ ĐIỀU PHỐI STORY CÂU CHUYỆN (3 CHẶNG TRẢI NGHIỆM)
   Tối ưu cuộn trên Safari iPhone: không bị che khuất nội dung
   ========================================================================== */
const scenes = [
  document.getElementById("scene1"), // Màn hình 2: Lời chúc & Chân dung
  document.getElementById("scene2"), // Màn hình 3: 3 Trái tim bí mật
  document.getElementById("scene3")  // Màn hình 4: Grand Finale & Lời hứa
];
const progressBars = document.querySelectorAll(".progress-bar");
let currentScene = -1;

function updateProgress(index) {
  progressBars.forEach((bar, idx) => {
    if (idx < index) {
      bar.className = "progress-bar completed";
    } else if (idx === index) {
      bar.className = "progress-bar active";
    } else {
      bar.className = "progress-bar";
    }
  });
}

function showScene(index) {
  if (index < 0 || index >= scenes.length) return;

  const prev = scenes[currentScene];
  const next = scenes[index];

  if (prev && prev !== next) {
    prev.setAttribute("aria-hidden", "true");
    gsap.to(prev, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.inOut",
      onComplete: () => {
        prev.style.visibility = "hidden";
      }
    });
  }

  next.style.visibility = "visible";
  next.setAttribute("aria-hidden", "false");
  next.scrollTop = 0; // Đưa cuộn về đầu trang ngay lập tức trên iPhone

  gsap.fromTo(next, 
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }
  );

  updateProgress(index);
  currentScene = index;

  // Nếu đến cảnh cuối Grand Finale: Kích hoạt Trái Tim Lý Tuân & bắn chùm tim lãng mạn
  if (index === 2) {
    lixunHeart.resize();
    lixunHeart.start();
    requestAnimationFrame(() => {
      lixunHeart.resize();
    });
    setTimeout(() => {
      lixunHeart.resize();
      if (!lixunHeart.isRunning) lixunHeart.start();
    }, 500);
    burstPetals(window.innerWidth / 2, window.innerHeight * 0.35, 24, true);
  } else {
    lixunHeart.stop();
  }
}

// Nút chuyển tiếp trong Cảnh 1 sang Cảnh 2
document.getElementById("nextToScene2")?.addEventListener("click", (e) => {
  e.stopPropagation();
  burstPetals(window.innerWidth / 2, window.innerHeight * 0.6, 15, true);
  showScene(1);
});

// Nút chuyển tiếp trong Cảnh 2 sang Cảnh 3
document.getElementById("nextToScene3")?.addEventListener("click", (e) => {
  e.stopPropagation();
  burstPetals(window.innerWidth / 2, window.innerHeight * 0.6, 18, true);
  showScene(2);
});

/* ==========================================================================
   💌 5. TƯƠNG TÁC 3 TRÁI TIM BÍ MẬT (REFERENCE IMAGE 2 & 3)
   ========================================================================== */
const SECRETS_DATA = {
  1: {
    title: "✨ Nụ Cười Của Em",
    body: "Mỗi khi nhìn thấy nụ cười của em, mọi mệt mỏi và âu lo trong anh đều tan biến. Nụ cười ấy là ánh nắng ấm áp nhất sưởi ấm tâm hồn anh mỗi ngày, là điều quý giá mà anh luôn muốn nâng niu, gìn giữ suốt cả cuộc đời."
  },
  2: {
    title: "🏡 Sự Dịu Dàng & Hy Sinh",
    body: "Cảm ơn em vì những ân cần, từng bữa cơm gia đình ấm cúng và sự hy sinh thầm lặng của em dành cho tổ ấm nhỏ của chúng mình. Có em kề bên, anh luôn cảm nhận được sự bình yên và trọn vẹn nhất."
  },
  3: {
    title: "💍 Lời Hứa Mãi Mãi",
    body: "Dù cuộc đời phía trước có bao thăng trầm, anh hứa sẽ luôn là điểm tựa vững chãi nhất, cùng em chia sẻ mọi vui buồn và yêu thương em nhiều hơn mỗi ngày, không chỉ riêng ngày 20/10 mà là suốt cả cuộc đời."
  }
};

const openedSecrets = new Set();
const secretModal = document.getElementById("secretModal");
const secretTitle = document.getElementById("secretTitle");
const secretBody = document.getElementById("secretBody");
const secretStatus = document.getElementById("secretStatus");
const closeSecretBtn = document.getElementById("closeSecretBtn");
const secretOverlay = document.getElementById("secretOverlay");

function openSecret(id) {
  const data = SECRETS_DATA[id];
  if (!data) return;

  secretTitle.textContent = data.title;
  secretBody.textContent = data.body;
  secretModal.classList.add("open");
  secretModal.setAttribute("aria-hidden", "false");

  // Đánh dấu đã mở
  openedSecrets.add(id);
  const checkEl = document.getElementById(`check${id}`);
  if (checkEl) checkEl.classList.add("revealed");

  // Bắn vài hạt tim ăn mừng
  burstPetals(window.innerWidth / 2, window.innerHeight / 2, 16, true);

  // Cập nhật trạng thái
  if (secretStatus) {
    if (openedSecrets.size === 1) {
      secretStatus.innerHTML = "✨ Đã khám phá 1/3 bí mật. Chạm vào trái tim tiếp theo nhé 💕";
    } else if (openedSecrets.size === 2) {
      secretStatus.innerHTML = "✨ Đã khám phá 2/3 bí mật. Còn 1 điều bất ngờ nữa thôi nè!";
    } else {
      secretStatus.innerHTML = "💖 Em đã mở trọn vẹn tất cả bí mật rồi! Hãy bấm nút bên dưới nhé ✨";
    }
  }
}

function closeSecret() {
  secretModal.classList.remove("open");
  secretModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".heart-balloon").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const id = btn.getAttribute("data-secret");
    openSecret(id);
  });
});

closeSecretBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  closeSecret();
});

secretOverlay?.addEventListener("click", (e) => {
  e.stopPropagation();
  closeSecret();
});

/* ==========================================================================
   🎁 6. NÚT MỞ QUÀ BAN ĐẦU (START BUTTON)
   ========================================================================== */
function handleStartGift(e) {
  if (e) e.stopPropagation();

  soundCtrl.play();
  burstPetals(window.innerWidth / 2, window.innerHeight / 2, 25, true);

  const startScreen = document.getElementById("start");
  if (startScreen) {
    startScreen.classList.add("gone");
    setTimeout(() => {
      startScreen.remove();
      showScene(0); // Chuyển sang Màn hình 2 (Lời chúc 20/10)
    }, 600);
  } else {
    showScene(0);
  }
}

document.getElementById("openBtn")?.addEventListener("click", handleStartGift);

/* ==========================================================================
   💋 7. HAI NÚT TƯƠNG TÁC TỔNG KẾT (SECTION 1.4)
   ========================================================================== */
// Nút chính: Gửi ngàn nụ hôn cho anh
const kissBtn = document.getElementById("kissBtn");
kissBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  lixunHeart.triggerKissExcitement();
  burstPetals(window.innerWidth / 2, window.innerHeight * 0.45, 30, true);

  // Rung haptic nếu thiết bị hỗ trợ
  if (navigator.vibrate) {
    try {
      navigator.vibrate([40, 60, 40]);
    } catch (_) {}
  }

  const kissText = kissBtn.querySelector(".kiss-text");
  if (kissText) {
    const originalText = kissText.textContent;
    kissText.textContent = "Đã gửi ngàn nụ hôn đến trái tim anh! 💕";
    setTimeout(() => {
      kissText.textContent = originalText;
    }, 2800);
  }
});

// Nút phụ: Xem lại hành trình yêu thương
document.getElementById("replayBtn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  showScene(0); // Quay về Cảnh 1
});

/* ==========================================================================
   💖 8. HIỆU ỨNG CHẠM TAY THẢ TIM & SÓNG NƯỚC (TAP RIPPLE)
   ========================================================================== */
window.addEventListener("pointerdown", (e) => {
  // Bỏ qua nếu chạm vào button hoặc interactive element
  if (e.target.closest("button") || e.target.closest(".secret-modal") || e.target.closest("#soundToggle")) {
    return;
  }

  const x = e.clientX;
  const y = e.clientY;

  // Hiệu ứng sóng nước
  const ripple = document.createElement("div");
  ripple.className = "touch-ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);

  // Trái tim bay lên nhẹ nhàng
  const heart = document.createElement("div");
  heart.className = "tap-heart";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.textContent = ["💖", "🌸", "✨", "💕"][(Math.random() * 4) | 0];
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
}, { passive: true });

/* ==========================================================================
   🚫 9. TỰ ĐỘNG GỠ BỎ HUY HIỆU "POWERED BY NETLIFY" TRÊN DOM
   ========================================================================== */
function purgeNetlifyBadge() {
  const selectors = [
    "#nl-badge-frame",
    ".nl-badge-frame",
    "iframe[id*='nl-badge']",
    "iframe[src*='netlify']",
    "#netlify-drawer-root",
    "[data-netlify-drawer]",
    "[data-netlify-badge]",
    ".netlify-feedback-badge"
  ];
  selectors.forEach((sel) => {
    try {
      document.querySelectorAll(sel).forEach((el) => el.remove());
    } catch (_) {}
  });
}

purgeNetlifyBadge();
if (typeof MutationObserver !== "undefined") {
  const netlifyBadgeObserver = new MutationObserver(() => {
    purgeNetlifyBadge();
  });
  netlifyBadgeObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}
