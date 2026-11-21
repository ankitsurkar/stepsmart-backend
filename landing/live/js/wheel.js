/**
 * Lightweight, high-DPI HTML5 Canvas Career Wheel renderer.
 * - Zero audio (per spec: no sound)
 * - Respects prefers-reduced-motion
 * - Smooth ~1s morph animation when slices resize
 * - Always labels the Product Manager slice clearly, even when narrow (5%)
 */

const TWO_PI = Math.PI * 2;
const POINTER_ANGLE = (3 * Math.PI) / 2; // Top 12 o'clock pointer

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export class WheelRenderer {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.mode = options.mode || 'role'; // 'role' | 'statement'
    this.size = options.size || 320;
    this.isHost = Boolean(options.isHost);
    this.slices = [];
    this.rotation = -Math.PI / 2;
    this.isSpinning = false;
    this.highlightedIndex = -1;
    this._morphRaf = null;
    this._spinRaf = null;

    this._setupCanvas();
  }

  _setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.round(this.size * dpr);
    this.canvas.height = Math.round(this.size * dpr);
    this.canvas.style.width = `${this.size}px`;
    this.canvas.style.height = `${this.size}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  resize(newSize) {
    if (newSize && newSize !== this.size) {
      this.size = newSize;
      this._setupCanvas();
      this.draw();
    }
  }

  setSlices(slices, animate = false, duration = 900) {
    const next = slices.map((s) => ({ ...s }));
    if (!animate || this.slices.length === 0 || prefersReducedMotion()) {
      this._cancelMorph();
      this.slices = next;
      this.draw();
      return;
    }

    // Build key-aligned start/end weights so slices slide smoothly to new sizes
    const allKeys = [];
    const seen = new Set();
    for (const s of this.slices) {
      if (!seen.has(s.key)) {
        seen.add(s.key);
        allKeys.push(s.key);
      }
    }
    for (const s of next) {
      if (!seen.has(s.key)) {
        seen.add(s.key);
        allKeys.push(s.key);
      }
    }

    const fromMap = new Map(this.slices.map((s) => [s.key, s]));
    const toMap = new Map(next.map((s) => [s.key, s]));

    const startTime = performance.now();
    this._cancelMorph();

    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease out
      const ease = 1 - Math.pow(1 - t, 3);

      const frameSlices = [];
      for (const key of allKeys) {
        const fromS = fromMap.get(key);
        const toS = toMap.get(key);
        const w0 = fromS ? fromS.weight : 0;
        const w1 = toS ? toS.weight : 0;
        const w = w0 + (w1 - w0) * ease;
        const p0 = fromS ? fromS.pct : 0;
        const p1 = toS ? toS.pct : 0;
        const pct = Math.round(p0 + (p1 - p0) * ease);

        if (w > 0.15) {
          const meta = toS || fromS;
          frameSlices.push({ ...meta, weight: w, pct });
        }
      }

      this.slices = frameSlices;
      this.draw();

      if (t < 1) {
        this._morphRaf = requestAnimationFrame(step);
      } else {
        this._morphRaf = null;
        this.slices = next;
        this.draw();
      }
    };

    this._morphRaf = requestAnimationFrame(step);
  }

  _cancelMorph() {
    if (this._morphRaf) {
      cancelAnimationFrame(this._morphRaf);
      this._morphRaf = null;
    }
  }

  destroy() {
    this._cancelMorph();
    if (this._spinRaf) {
      cancelAnimationFrame(this._spinRaf);
      this._spinRaf = null;
    }
    this.isSpinning = false;
  }

  /**
   * Weighted random spin. Returns Promise<{ slice, index }>.
   * Optional forcedIndex lets statement demos cycle cleanly if desired.
   */
  spin(forcedIndex = null) {
    if (this.isSpinning || this.slices.length === 0) return Promise.resolve(null);
    this.isSpinning = true;
    this.highlightedIndex = -1;

    const totalWeight = this.slices.reduce((acc, s) => acc + s.weight, 0) || 1;

    // Pick winning slice by weighted probability
    let chosenIndex = 0;
    if (typeof forcedIndex === 'number' && forcedIndex >= 0 && forcedIndex < this.slices.length) {
      chosenIndex = forcedIndex;
    } else {
      let r = Math.random() * totalWeight;
      for (let i = 0; i < this.slices.length; i++) {
        if (r < this.slices[i].weight) {
          chosenIndex = i;
          break;
        }
        r -= this.slices[i].weight;
      }
    }

    // Calculate target angle inside the chosen slice
    let sliceStart = 0;
    for (let i = 0; i < chosenIndex; i++) {
      sliceStart += (this.slices[i].weight / totalWeight) * TWO_PI;
    }
    const sliceSpan = (this.slices[chosenIndex].weight / totalWeight) * TWO_PI;
    const offsetInside = sliceSpan * (0.22 + Math.random() * 0.56);
    const chosenMidAngle = sliceStart + offsetInside;

    const reduced = prefersReducedMotion();
    const currentMod = ((this.rotation + chosenMidAngle) % TWO_PI + TWO_PI) % TWO_PI;
    let deltaToPointer = (POINTER_ANGLE - currentMod + TWO_PI) % TWO_PI;

    const fullTurns = reduced ? 0 : 4 + Math.floor(Math.random() * 2);
    const startRotation = this.rotation;
    const deltaRotation = fullTurns * TWO_PI + deltaToPointer;
    const duration = reduced ? 280 : 2400;
    const startTime = performance.now();

    return new Promise((resolve) => {
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = reduced ? progress : 1 - Math.pow(1 - progress, 3.6);
        this.rotation = startRotation + deltaRotation * eased;
        this.draw();

        if (progress < 1) {
          this._spinRaf = requestAnimationFrame(animate);
        } else {
          this._spinRaf = null;
          this.isSpinning = false;
          this.highlightedIndex = chosenIndex;
          this.draw();
          resolve({ slice: this.slices[chosenIndex], index: chosenIndex });
        }
      };
      this._spinRaf = requestAnimationFrame(animate);
    });
  }

  draw() {
    const ctx = this.ctx;
    const size = this.size;
    const cx = size / 2;
    const cy = size / 2;
    const radius = cx - 8;

    ctx.clearRect(0, 0, size, size);
    if (this.slices.length === 0) return;

    const totalWeight = this.slices.reduce((sum, s) => sum + s.weight, 0) || 1;
    const styles = getComputedStyle(document.documentElement);
    const dividerColor = styles.getPropertyValue('--wheel-divider').trim() || '#ffffff';
    const rimColor = styles.getPropertyValue('--wheel-rim').trim() || 'rgba(0,0,0,0.16)';

    let startAngle = this.rotation;

    this.slices.forEach((slice, idx) => {
      const span = (slice.weight / totalWeight) * TWO_PI;
      const endAngle = startAngle + span;

      // Slice fill
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color || '#334155';
      ctx.fill();

      // Subtle highlight overlay on winning slice after spin
      if (idx === this.highlightedIndex && !this.isSpinning) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.fill();
        ctx.restore();
      }

      // Crisp slice divider
      ctx.lineWidth = this.isHost ? 2.5 : 2;
      ctx.strokeStyle = dividerColor;
      ctx.stroke();

      // Label rendering
      const midAngle = startAngle + span / 2;
      const showLabel = slice.isDream || span >= 0.17 || this.mode === 'statement';

      if (showLabel) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(midAngle);

        // Keep text readable (never upside-down on the left half)
        const normAngle = ((midAngle % TWO_PI) + TWO_PI) % TWO_PI;
        const isLeftHalf = normAngle > Math.PI / 2 && normAngle < (3 * Math.PI) / 2;
        if (isLeftHalf) {
          ctx.rotate(Math.PI);
          ctx.textAlign = 'left';
        } else {
          ctx.textAlign = 'right';
        }

        const edgeX = isLeftHalf ? -(radius - (this.isHost ? 18 : 12)) : (radius - (this.isHost ? 18 : 12));
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 3;

        if (this.mode === 'statement') {
          const fs = this.isHost ? 16 : 13;
          ctx.font = `700 ${fs}px "Plus Jakarta Sans", system-ui, sans-serif`;
          ctx.fillText(slice.label, edgeX, 0);
        } else {
          // Adaptive font sizing so thin Product Manager slice ALWAYS fits cleanly and legibly
          let fontSize;
          if (this.isHost) {
            fontSize = span < 0.34 ? 13 : span < 0.6 ? 15 : 17;
          } else {
            fontSize = span < 0.32 ? 10.5 : span < 0.55 ? 12 : 13.5;
          }
          ctx.font = `${slice.isDream ? 800 : 700} ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;

          const pctLabel = `${slice.pct}%`;
          if (span < 0.38) {
            // Single compact line for narrow slices (including 5% Product Manager!)
            const text = `${slice.label} ${pctLabel}`;
            ctx.fillText(text, edgeX, 0);
          } else {
            ctx.fillText(slice.label, edgeX, -fontSize * 0.52);
            ctx.font = `600 ${Math.max(10, fontSize - 1.5)}px "Plus Jakarta Sans", system-ui, sans-serif`;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
            ctx.fillText(pctLabel, edgeX, fontSize * 0.58);
          }
        }

        ctx.restore();
      }

      startAngle = endAngle;
    });

    // Outer rim ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = rimColor;
    ctx.stroke();

    // Subtle center hub dot
    ctx.beginPath();
    ctx.arc(cx, cy, this.isHost ? 20 : 14, 0, TWO_PI);
    ctx.fillStyle = dividerColor;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = rimColor;
    ctx.stroke();
  }
}
