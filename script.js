/* ==========================================================================
   GỬI VỢ YÊU HỒNG LIÊN - 20/10 MOBILE STORY & HIGH PERFORMANCE (70+ FPS)
   ========================================================================== */

/* ==========================================================================
   🌸 THÔNG TIN DÀNH RIÊNG CHO VỢ YÊU HỒNG LIÊN
   ========================================================================== */
const WIFE_INFO = {
  name: "Hồng Liên",
  title: "Bông Hoa Đẹp Nhất Của Đời Anh 🌸",
  flowerColor: "#ff4071",   // Đóa sen hồng rực rỡ
  glowColor: "#ff75a0",
  secondaryColor: "#ffd166" // Nhị hoa vàng nắng
};

/* ==========================================================================
   ⚡ 1. TỐI ƯU HÓA HIỆU NĂNG: PRE-RENDERED SPRITES & OBJECT POOL (70+ FPS)
   ========================================================================== */
const PETAL_COLORS = ["#ff75a0", "#ff4071", "#ff9ec7", "#ffd166", "#ffffff", "#c77dff"];
const SPRITE_SIZE = 42;
const spriteCache = {};

// Khởi tạo trước texture hạt cánh hoa và tim phát sáng trong bộ nhớ (Offscreen Canvas)
function initSprites() {
  PETAL_COLORS.forEach((color) => {
    // 1. Sprite cánh hoa sen
    const pCanvas = document.createElement("canvas");
    pCanvas.width = SPRITE_SIZE;
    pCanvas.height = SPRITE_SIZE;
    const pctx = pCanvas.getContext("2d");
    const cx = SPRITE_SIZE / 2;
    const cy = SPRITE_SIZE / 2;

    // Quầng sáng mềm
    const grad = pctx.createRadialGradient(cx, cy, 2, cx, cy, SPRITE_SIZE / 2);
    grad.addColorStop(0, color);
    grad.addColorStop(0.45, color);
    grad.addColorStop(1, "transparent");
    pctx.fillStyle = grad;
    pctx.beginPath();
    pctx.arc(cx, cy, SPRITE_SIZE / 2, 0, Math.PI * 2);
    pctx.fill();

    // Thân cánh hoa
    pctx.fillStyle = color;
    pctx.beginPath();
    pctx.ellipse(cx, cy, SPRITE_SIZE * 0.16, SPRITE_SIZE * 0.38, 0, 0, Math.PI * 2);
    pctx.fill();

    spriteCache[color] = pCanvas;

    // 2. Sprite trái tim phát sáng
    const hCanvas = document.createElement("canvas");
    hCanvas.width = SPRITE_SIZE;
    hCanvas.height = SPRITE_SIZE;
    const hctx = hCanvas.getContext("2d");
    hctx.font = `${Math.floor(SPRITE_SIZE * 0.6)}px serif`;
    hctx.textAlign = "center";
    hctx.textBaseline = "middle";
    hctx.shadowColor = color;
    hctx.shadowBlur = 8;
    hctx.fillStyle = color;
    hctx.fillText("♥", cx, cy);

    spriteCache[`heart_${color}`] = hCanvas;
  });
}
initSprites();

// Canvas & Object Pool
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

const MAX_PARTICLES = 110;
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
    alpha: 0.9
  };
}

function spawnParticle(x = Math.random() * W, y = -20, isBurst = false, forceHeart = false) {
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p = particlePool[i];
    if (!p.active) {
      p.active = true;
      p.isHeart = forceHeart || Math.random() < 0.25;
      p.x = x;
      p.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = isBurst ? 2.5 + Math.random() * 6 : 0;
      p.vx = isBurst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.65;
      p.vy = isBurst ? Math.sin(angle) * speed : 0.7 + Math.random() * 1.3;
      p.size = p.isHeart ? 10 + Math.random() * 7 : 7 + Math.random() * 8;
      p.rot = Math.random() * 6.28;
      p.vr = (Math.random() - 0.5) * 0.05;
      p.sway = Math.random() * 6.28;
      p.color = PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0];
      p.alpha = 0.9;
      break;
    }
  }
}

function burstPetals(x, y, count = 28, heartsOnly = false) {
  const actual = Math.min(count, 45);
  for (let i = 0; i < actual; i++) {
    spawnParticle(x, y, true, heartsOnly);
  }
}

// Đo FPS thời gian thực
let frameCount = 0;
let lastFpsTime = performance.now();
const fpsValEl = document.getElementById("fpsVal");

function updateFps(now) {
  frameCount++;
  if (now - lastFpsTime >= 500) {
    const currentFps = Math.round((frameCount * 1000) / (now - lastFpsTime));
    if (fpsValEl) {
      fpsValEl.textContent = currentFps;
      const dot = document.querySelector(".fps-dot");
      if (dot) {
        dot.style.background = currentFps >= 60 ? "#06d6a0" : (currentFps >= 45 ? "#ffd166" : "#ff4071");
      }
    }
    frameCount = 0;
    lastFpsTime = now;
  }
}

// Vòng lặp render tối ưu
let isTabActive = true;
document.addEventListener("visibilitychange", () => {
  isTabActive = !document.hidden;
});

let spawnTimer = 0;
function animateCanvas(now) {
  if (isTabActive) {
    updateFps(now);
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    spawnTimer++;
    if (spawnTimer % 8 === 0) {
      spawnParticle(Math.random() * W, -20, false);
    }

    const slow = gsap.globalTimeline.timeScale();

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p = particlePool[i];
      if (!p.active) continue;

      p.sway += 0.025 * slow;
      p.x += (p.vx + Math.sin(p.sway) * 0.6) * slow;
      p.y += p.vy * slow;
      p.vx *= 0.985;
      p.rot += p.vr * slow;

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

      if (p.y > H + 30 || p.x < -40 || p.x > W + 40) {
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

  startLofiSynth() {
    if (this.synthTimer) return;
    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!this.audioCtx) this.audioCtx = new AudioCtxClass();
      if (this.audioCtx.state === "suspended") this.audioCtx.resume();

      const notes = [261.63, 329.63, 392.00, 493.88, 440.00, 523.25, 587.33];
      let step = 0;

      const playChime = () => {
        if (!this.isPlaying) return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(notes[step % notes.length], now);
        step = (step + 1 + Math.floor(Math.random() * 2)) % notes.length;

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 1.65);

        this.synthTimer = setTimeout(playChime, 650 + Math.random() * 350);
      };

      playChime();
    } catch {
      // Bỏ qua nếu trình duyệt chặn hoàn toàn
    }
  }

  stopLofiSynth() {
    if (this.synthTimer) {
      clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
  }
}
const soundCtrl = new AudioController();

/* ==========================================================================
   🎬 3. HIỆU ỨNG SLOW MOTION & CHẠM MÀN HÌNH
   ========================================================================== */
const slowBadge = document.getElementById("slowBadge");
let slowMoTimeout = null;

function slowMo(scale = 0.35, hold = 3) {
  if (slowMoTimeout) clearTimeout(slowMoTimeout);

  slowBadge.classList.add("active");
  gsap.to(gsap.globalTimeline, {
    timeScale: scale,
    duration: 0.45,
    ease: "power2.out"
  });

  slowMoTimeout = setTimeout(() => {
    gsap.to(gsap.globalTimeline, {
      timeScale: 1.0,
      duration: 1.2,
      ease: "power2.inOut",
      onComplete: () => {
        slowBadge.classList.remove("active");
      }
    });
  }, hold * 1000);
}

// Chạm bất kỳ đâu = bắn chùm hạt + bay tim + mini slow-mo
window.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button") || currentScene < 0) return;

  createTouchEffect(e.clientX, e.clientY);
  burstPetals(e.clientX, e.clientY, 20);
  slowMo(0.52, 0.7);
}, { passive: true });

function createTouchEffect(x, y) {
  // 1. Sóng nước loang tỏa
  const ripple = document.createElement("div");
  ripple.className = "touch-ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = "36px";
  ripple.style.height = "36px";
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 650);

  // 2. Trái tim bay lên
  const heart = document.createElement("div");
  heart.className = "tap-heart";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  heart.textContent = ["💖", "🌸", "💕", "✨"][Math.floor(Math.random() * 4)];
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 900);
}

/* ==========================================================================
   🌸 4. DỰNG HOA SEN SVG (HỒNG LIÊN NỞ CHẬM)
   ========================================================================== */
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
};

function renderLotusFlower(targetEl, color = WIFE_INFO.flowerColor, petals = 12) {
  targetEl.innerHTML = "";
  const svg = el("svg", {
    viewBox: "-100 -100 200 200",
    role: "img",
    "aria-label": "Đóa Hồng Liên phát sáng"
  });

  // Vẽ 2 lớp cánh hoa sen
  for (let l = 0; l < 2; l++) {
    const k = 1 - l * 0.3;
    for (let i = 0; i < petals; i++) {
      const p = el("ellipse", {
        cx: 0,
        cy: -42 * k,
        rx: 16 * k,
        ry: 46 * k,
        fill: color,
        "fill-opacity": 0.62 + l * 0.28,
        class: "lotus-petal"
      });
      p.dataset.angle = (360 / petals) * i + l * (180 / petals);
      svg.appendChild(p);
    }
  }

  // Nhuỵ vàng
  svg.appendChild(el("circle", {
    r: 13,
    fill: WIFE_INFO.secondaryColor,
    class: "lotus-core"
  }));

  targetEl.appendChild(svg);

  // GSAP Animation nở hoa
  const petalEls = targetEl.querySelectorAll(".lotus-petal");
  const coreEl = targetEl.querySelector(".lotus-core");

  gsap.set(petalEls, {
    scale: 0,
    rotation: (k, t) => +t.dataset.angle - 65,
    svgOrigin: "0 0"
  });
  gsap.set(coreEl, { scale: 0, svgOrigin: "0 0" });

  const tl = gsap.timeline();
  tl.to(coreEl, { scale: 1, duration: 1.0, ease: "back.out(2.4)" }, 0.1)
    .to(petalEls, {
      scale: 1,
      rotation: (k, t) => +t.dataset.angle,
      duration: 3.2,
      ease: "expo.out",
      stagger: 0.055
    }, 0.25);

  gsap.to(svg, {
    rotation: 360,
    duration: 65,
    ease: "none",
    repeat: -1
  });
}

// Dựng hoa cho cảnh 1 và cảnh 5
renderLotusFlower(document.getElementById("flowerBox1"));
renderLotusFlower(document.getElementById("flowerBoxFinal"), WIFE_INFO.flowerColor, 14);

/* ==========================================================================
   📖 5. BỘ ĐIỀU PHỐI STORY CÂU CHUYỆN (5 CẢNH MOBILE)
   ========================================================================== */
const scenes = [
  document.getElementById("scene1"),
  document.getElementById("scene2"),
  document.getElementById("scene3"),
  document.getElementById("scene4"),
  document.getElementById("scene5")
];
const progressBars = document.querySelectorAll(".progress-bar");
const nextBtn = document.getElementById("nextBtn");
const hintText = document.getElementById("hintText");

let currentScene = -1;
let autoAdvanceTimer = null;

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
  clearTimeout(autoAdvanceTimer);

  const prev = scenes[currentScene];
  const next = scenes[index];

  if (prev) {
    prev.setAttribute("aria-hidden", "true");
    gsap.to(prev, {
      opacity: 0,
      y: -15,
      duration: 0.65,
      ease: "power2.inOut",
      onComplete: () => {
        prev.style.visibility = "hidden";
      }
    });
  }

  next.style.visibility = "visible";
  next.setAttribute("aria-hidden", "false");
  gsap.fromTo(next, 
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.75, ease: "power2.out" }
  );

  updateProgress(index);
  currentScene = index;

  // Ẩn nút "Tiếp tục" ở cảnh tương tác câu hỏi (scene 3) và cảnh kết (scene 4)
  if (index === 3 || index === 4) {
    nextBtn.hidden = true;
  } else {
    nextBtn.hidden = false;
  }
  if (hintText) {
    hintText.hidden = false;
    gsap.set(hintText, { opacity: 0.75 });
    clearTimeout(autoAdvanceTimerHint);
    autoAdvanceTimerHint = setTimeout(() => {
      gsap.to(hintText, { opacity: 0, duration: 0.8, onComplete: () => { hintText.hidden = true; } });
    }, 3500);
  }

  // Cảnh Grand Finale (Scene 4)
  if (index === 4) {
    slowMo(0.28, 4.0);
    burstPetals(window.innerWidth / 2, window.innerHeight * 0.35, 40, true);
  } else if (index < 3) {
    // Tự động chuyển cảnh sau 7 giây nếu người dùng không bấm
    autoAdvanceTimer = setTimeout(() => {
      showScene(index + 1);
    }, 7000);
  }
}

let autoAdvanceTimerHint = null;

// Bấm nút "Tiếp tục"
nextBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentScene < scenes.length - 1) {
    showScene(currentScene + 1);
  }
});

// Xử lý các lựa chọn trong Cảnh 4
document.querySelectorAll(".choice-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    burstPetals(window.innerWidth / 2, window.innerHeight / 2, 40, true);
    slowMo(0.35, 1.5);
    setTimeout(() => {
      showScene(4); // Chuyển sang Grand Finale
    }, 900);
  });
});

// Nút "Gửi ngàn nụ hôn cho Chồng"
document.getElementById("kissBtn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  burstPetals(window.innerWidth / 2, window.innerHeight * 0.45, 50, true);
  slowMo(0.32, 2.0);

  const btn = document.getElementById("kissBtn");
  btn.style.transform = "scale(0.92)";
  setTimeout(() => (btn.style.transform = "scale(1)"), 200);
});

// Nút "Xem lại hành trình"
document.getElementById("replayBtn")?.addEventListener("click", (e) => {
  e.stopPropagation();
  showScene(0);
});

/* ==========================================================================
   🎁 6. NÚT MỞ QUÀ BAN ĐẦU (START BUTTON)
   ========================================================================== */
function handleStartGift(e) {
  if (e) e.stopPropagation();

  // Ngay lập tức làm biến mất dòng chữ "Chạm vào màn hình để bắt đầu hành trình ✨"
  const tapGuide = document.querySelector(".tap-guide");
  if (tapGuide) {
    tapGuide.style.transition = "opacity 0.25s ease, transform 0.25s ease";
    tapGuide.style.opacity = "0";
    tapGuide.style.transform = "translateY(8px)";
    setTimeout(() => {
      if (tapGuide) tapGuide.remove();
    }, 250);
  }

  soundCtrl.play();
  burstPetals(window.innerWidth / 2, window.innerHeight / 2, 35, true);

  const startScreen = document.getElementById("start");
  if (startScreen) {
    startScreen.classList.add("gone");
    setTimeout(() => {
      startScreen.remove();
      showScene(0);
    }, 650);
  } else {
    showScene(0);
  }
}

document.getElementById("openBtn")?.addEventListener("click", handleStartGift);

/* ==========================================================================
   🚫 7. TỰ ĐỘNG GỠ BỎ HUY HIỆU "POWERED BY NETLIFY" TRÊN DOM
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

// Thực thi ngay khi chạy script
purgeNetlifyBadge();

// Lắng nghe khi Netlify Edge script chèn iframe vào DOM
if (typeof MutationObserver !== "undefined") {
  const netlifyBadgeObserver = new MutationObserver(() => {
    purgeNetlifyBadge();
  });
  netlifyBadgeObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}


