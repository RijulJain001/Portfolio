/* ============================================================
   RIJUL JAIN — login.js
   Access Portal: Boot sequence, typewriter, canvas, cursor
   ============================================================ */

"use strict";

/* ------------------------------------------------------------------
   1. CANVAS BACKGROUND (same matrix style)
------------------------------------------------------------------ */
const canvas = document.getElementById("bg-canvas");
const ctx    = canvas.getContext("2d");

const SNIPPETS = [
  "jumpcloud users list",
  "Get-ComputerInfo",
  "az account show",
  "workspace migration status",
  "[+] identity verified",
  "[+] workspace synced",
  "fortinet policy review",
  "device posture check",
  "onboarding workflow ready",
  "support queue cleared",
  "whoami",
  "[ACCESS GRANTED]",
  "google workspace healthy",
  "identity platform ready",
];

const COLORS = ["#3dffa4", "#2bdcff", "#f7d85a", "#ff4f77", "#3578ff"];
let cols = [], W = 0, H = 0, lastTs = 0;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width  = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  canvas.style.width  = `${W}px`;
  canvas.style.height = `${H}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(14, Math.floor(W / 60));
  cols = Array.from({ length: count }, (_, i) => ({
    x:      i * (W / count) + Math.random() * 12,
    y:      Math.random() * H,
    speed:  14 + Math.random() * 48,
    color:  COLORS[i % COLORS.length],
    text:   SNIPPETS[i % SNIPPETS.length],
    offset: Math.floor(Math.random() * 20),
  }));
}

function drawCanvas(ts) {
  const delta = Math.min((ts - lastTs) / 1000 || 0.016, 0.05);
  lastTs = ts;

  ctx.fillStyle = "rgba(1, 4, 3, 0.14)";
  ctx.fillRect(0, 0, W, H);
  ctx.font = "12px 'JetBrains Mono', Consolas, monospace";
  ctx.textBaseline = "top";

  cols.forEach((col, i) => {
    col.y += col.speed * delta;
    if (col.y > H + 140) {
      col.y    = -90 - Math.random() * 160;
      col.text = SNIPPETS[(i + Math.floor(Math.random() * SNIPPETS.length)) % SNIPPETS.length];
    }
    for (let j = 0; j < 8; j++) {
      const y = col.y - j * 20;
      if (y < -24 || y > H + 24) continue;
      const alpha = Math.max(0, 0.8 - j * 0.11);
      const frag  = col.text.slice(0, Math.max(5, col.text.length - j - col.offset));
      const hex   = col.color.replace("#", "");
      ctx.fillStyle = `rgba(${parseInt(hex.slice(0,2),16)},${parseInt(hex.slice(2,4),16)},${parseInt(hex.slice(4,6),16)},${alpha})`;
      ctx.fillText(frag, col.x, y);
    }
  });
  requestAnimationFrame(drawCanvas);
}

window.addEventListener("resize", resizeCanvas, { passive: true });
resizeCanvas();
requestAnimationFrame(drawCanvas);

/* ------------------------------------------------------------------
   2. CURSOR GLOW
------------------------------------------------------------------ */
const cursorGlow = document.getElementById("cursor-glow");
let mx = -999, my = -999, cx = -999, cy = -999;

window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });

function animCursor() {
  cx += (mx - cx) * 0.09;
  cy += (my - cy) * 0.09;
  if (cursorGlow) cursorGlow.style.transform = `translate(${cx - 170}px, ${cy - 170}px)`;
  requestAnimationFrame(animCursor);
}
animCursor();

/* ------------------------------------------------------------------
   3. SESSION ID (random hex)
------------------------------------------------------------------ */
const sessEl = document.getElementById("sess-num");
if (sessEl) {
  sessEl.textContent = Math.random().toString(16).slice(2, 8).toUpperCase();
}

/* ------------------------------------------------------------------
   4. BOOT SEQUENCE
------------------------------------------------------------------ */
const BOOT_MESSAGES = [
  { text: "[ OK ] Booting access portal…",            delay: 0   },
  { text: "[ OK ] Loading workspace modules…",        delay: 180 },
  { text: "[ OK ] Syncing identity platform…",        delay: 360 },
  { text: "[ OK ] Checking device posture…",          delay: 540 },
  { text: "[ OK ] Verifying agent identity…",         delay: 760 },
  { text: "[ OK ] Validating secure access…",         delay: 960 },
  { text: "[ OK ] Identity confirmed: Rijul Jain",    delay: 1180 },
  { text: "[ OK ] ACCESS GRANTED — Portal ready.",    delay: 1400 },
];

const bootLinesEl  = document.getElementById("boot-lines");
const bootBarEl    = document.getElementById("boot-bar");
const bootStatusEl = document.getElementById("boot-status");
const bootScreen   = document.getElementById("boot-screen");
const portalCard   = document.getElementById("portal-card");

function runBoot() {
  BOOT_MESSAGES.forEach(({ text, delay }, i) => {
    setTimeout(() => {
      // Add line
      const p = document.createElement("p");
      p.className = "boot-line";
      p.textContent = text;
      p.style.animationDelay = "0s";
      bootLinesEl.appendChild(p);
      bootLinesEl.scrollTop = bootLinesEl.scrollHeight;

      // Progress bar
      const pct = Math.round(((i + 1) / BOOT_MESSAGES.length) * 100);
      bootBarEl.style.width = `${pct}%`;

      // Status text
      bootStatusEl.textContent = text.replace("[ OK ] ", "");

      // Final: reveal portal
      if (i === BOOT_MESSAGES.length - 1) {
        setTimeout(() => {
          bootScreen.classList.add("hidden");
          setTimeout(() => {
            bootScreen.style.display = "none";
            portalCard.setAttribute("aria-hidden", "false");
            portalCard.classList.add("visible");
          }, 620);
        }, 700);
      }
    }, delay + 300);
  });
}

runBoot();

/* ------------------------------------------------------------------
   5. TYPEWRITER — portal sub-text
------------------------------------------------------------------ */
const subEl = document.getElementById("portal-sub-text");
const SUB_PHRASES = [
  "Select a platform to authenticate →",
  "Your identity has been verified ✓",
  "Choose your access method below",
];
let subPhraseIdx = 0, subCharIdx = 0, subDeleting = false;

function typeSub() {
  if (!subEl) return;
  const phrase = SUB_PHRASES[subPhraseIdx];
  if (!subDeleting) {
    subCharIdx++;
    subEl.innerHTML = phrase.slice(0, subCharIdx) + '<span class="sub-cursor">|</span>';
    if (subCharIdx >= phrase.length) {
      subDeleting = true;
      setTimeout(typeSub, 2200);
      return;
    }
    setTimeout(typeSub, 52);
  } else {
    subCharIdx--;
    subEl.innerHTML = phrase.slice(0, subCharIdx) + '<span class="sub-cursor">|</span>';
    if (subCharIdx === 0) {
      subDeleting = false;
      subPhraseIdx = (subPhraseIdx + 1) % SUB_PHRASES.length;
      setTimeout(typeSub, 360);
      return;
    }
    setTimeout(typeSub, 28);
  }
}

// Start typewriter after boot
setTimeout(typeSub, 2600);

/* ------------------------------------------------------------------
   6. BUTTON CLICK — ripple + open link
------------------------------------------------------------------ */
function addRipple(btn, color) {
  btn.addEventListener("click", function(e) {
    const ripple = document.createElement("span");
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute;
      border-radius:50%;
      background:${color};
      width:${size}px;
      height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      transform:scale(0);
      animation:rippleAnim 0.55s ease-out forwards;
      pointer-events:none;
      z-index:10;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
}

// Inject ripple keyframes
const style = document.createElement("style");
style.textContent = `
@keyframes rippleAnim {
  to { transform: scale(1); opacity: 0; }
}`;
document.head.appendChild(style);

const githubBtn   = document.getElementById("github-access-btn");
const linkedinBtn = document.getElementById("linkedin-access-btn");

if (githubBtn)   addRipple(githubBtn,   "rgba(255,255,255,0.1)");
if (linkedinBtn) addRipple(linkedinBtn, "rgba(10,102,194,0.15)");
