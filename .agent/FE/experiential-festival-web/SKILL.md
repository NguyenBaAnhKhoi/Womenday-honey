---
name: experiential-festival-web
description: "Design and build immersive experiential event websites, music festival landing pages, and product launch portals. Features 100vh hero sections with kinetic typography, GSAP scrollytelling, interactive 3D ticket tier simulators, and direct SVG motif integration."
last-updated: 2026-10-19
---

# ⚡ Experiential Festival & Product Launch Web System

## 1. Core Mission & Anti-SaaS Manifesto
Creative campaigns and music festivals require high-octane emotional resonance. **SaaS dashboard layouts (shadcn-ui tables, standard gray cards, corporate form fields) are STRICTLY FORBIDDEN.**

### The 4 Pillars of Experiential Web Design:
1. **Kinetic Typography & Scale**: Massive display headlines (`clamp(3.5rem, 8vw, 8.5rem)`), uppercase tracking, and animated marquis tickers.
2. **Ambient Motion Canvas**: Backgrounds powered by Three.js / WebGL shaders or GSAP SVG motif loops rather than static white space.
3. **Interactive 3D Physical Ticket Tiering**: Ticket selection UI that mimics physical event tickets with tear-off stubs, holographic foil shimmers, and live seat/tier calculators.
4. **Visual DNA Synchronization**: Web assets must consume the exact colors, fonts, and SVG `<defs>` defined in `visual-dna.json`.

---

## 2. Page Architecture Blueprint

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. HERO (100vh): Kinetic Headline + SVG Motif Canvas + Countdown      │
├────────────────────────────────────────────────────────────────────────┤
│ 2. LINEUP / SHOWCASE: Horizontal GSAP Scroll or Asymmetric Bento Grid   │
├────────────────────────────────────────────────────────────────────────┤
│ 3. INTERACTIVE TICKETING: Holographic Physical Ticket Tier Selector    │
├────────────────────────────────────────────────────────────────────────┤
│ 4. VENUE & EXPERIENCE: 3D Stage Map + Festival Guidelines & FAQ        │
├────────────────────────────────────────────────────────────────────────┤
│ 5. SPONSOR LOCKUP & FOOTER: High-contrast Marquee + Social Links       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Specification 1: 100vh Hero Section
- **Headline Architecture**:
  ```html
  <section class="relative min-h-screen w-full flex flex-col justify-between p-8 bg-[#0a0a0c] text-white overflow-hidden">
    <!-- Ambient Animated Motif Background -->
    <div class="absolute inset-0 z-0 opacity-20 pointer-events-none">
      <svg class="w-full h-full animate-spin-slow">
        <use href="#brand-seamless-pattern" />
      </svg>
    </div>

    <!-- Top Navigation -->
    <header class="relative z-10 flex justify-between items-center border-b border-white/10 pb-6">
      <div class="text-2xl font-black tracking-tighter uppercase">[EVENT LOGO]</div>
      <div class="px-5 py-2 rounded-full border border-pink-500/50 bg-pink-500/10 text-pink-400 font-mono text-xs uppercase tracking-widest">
        Live Oct 25 • Saigon
      </div>
    </header>

    <!-- Center Kinetic Title -->
    <div class="relative z-10 my-auto">
      <p class="font-mono text-cyan-400 tracking-widest uppercase text-sm mb-2">The Annual Live Experience</p>
      <h1 class="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none bg-gradient-to-r from-white via-pink-400 to-cyan-400 bg-clip-text text-transparent">
        DONG LIVE '26
      </h1>
      <p class="mt-6 text-lg md:text-2xl max-w-2xl text-neutral-400 font-light">
        Product Innovation meets Electric Soundscapes. 1 Night. 12 Headliners.
      </p>
    </div>

    <!-- Live Countdown Ticker Bar -->
    <div class="relative z-10 grid grid-cols-4 gap-4 max-w-xl border-t border-white/10 pt-6 font-mono">
      <div><span class="text-4xl font-bold text-white">06</span><p class="text-xs text-neutral-500">DAYS</p></div>
      <div><span class="text-4xl font-bold text-white">14</span><p class="text-xs text-neutral-500">HOURS</p></div>
      <div><span class="text-4xl font-bold text-white">32</span><p class="text-xs text-neutral-500">MINS</p></div>
      <div><span class="text-4xl font-bold text-pink-500">45</span><p class="text-xs text-neutral-500">SECS</p></div>
    </div>
  </section>
  ```

---

## 4. Component Specification 2: Holographic Ticket Tier Selector

Never render concert tickets as plain SaaS pricing tables. Render them as **tactile physical tickets**:

```css
/* Holographic Shimmer Effect for SVIP Ticket */
.ticket-hologram {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(0, 240, 255, 0.15) 25%,
    rgba(255, 46, 147, 0.2) 50%,
    rgba(255, 215, 0, 0.15) 75%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 300% 300%;
  animation: hologramShift 8s ease infinite;
}

@keyframes hologramShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Realistic Perforation Cutout */
.ticket-stub-perforation {
  position: relative;
  border-left: 2px dashed rgba(255, 255, 255, 0.2);
}
.ticket-stub-perforation::before,
.ticket-stub-perforation::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  background-color: #0a0a0c; /* matches page bg */
  border-radius: 50%;
  left: -10px;
}
.ticket-stub-perforation::before { top: -10px; }
.ticket-stub-perforation::after { bottom: -10px; }
```

---

## 5. Component Specification 3: Lineup Horizontal Scrollytelling (GSAP)
Implement GSAP ScrollTrigger to lock the viewport and smoothly glide horizontally across headliners:

```javascript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export function initLineupScroll(containerRef, trackRef) {
  const totalWidth = trackRef.scrollWidth - window.innerWidth;
  
  gsap.to(trackRef, {
    x: -totalWidth,
    ease: "none",
    scrollTrigger: {
      trigger: containerRef,
      pin: true,
      scrub: 1,
      end: () => `+=${totalWidth}`,
      invalidateOnRefresh: true,
    }
  });
}
```
