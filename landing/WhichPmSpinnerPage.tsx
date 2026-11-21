import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface WheelItem {
  label: string;
  tagTitle: string;
  emoji: string;
  caption: string;
  sliceBg: string;
  sliceText: string;
}

const WHEEL_ITEMS: WheelItem[] = [
  {
    label: "Born to Be",
    tagTitle: "Born to Be PM",
    emoji: "😎",
    caption: "“It was always on the roadmap.”",
    sliceBg: "#2E1052",
    sliceText: "#FEF3C7"
  },
  {
    label: "Swag",
    tagTitle: "Swag PM",
    emoji: "🕶️",
    caption: "“Walks into the meeting. Priorities rearrange themselves.”",
    sliceBg: "#F59E0B",
    sliceText: "#1A0830"
  },
  {
    label: "No-Fuss",
    tagTitle: "No-Fuss PM",
    emoji: "🎯",
    caption: "“No slides, no drama. Just ships.”",
    sliceBg: "#3B1466",
    sliceText: "#FEF3C7"
  },
  {
    label: "But Why?",
    tagTitle: "The “But Why?” PM",
    emoji: "🔍",
    caption: "“Asks why seven times. Finds the real problem on the eighth.”",
    sliceBg: "#F59E0B",
    sliceText: "#1A0830"
  },
  {
    label: "Chaos Calmer",
    tagTitle: "Chaos Calmer",
    emoji: "🧘",
    caption: "“Deadline moved up? Scope doubled? Still sipping chai.”",
    sliceBg: "#2E1052",
    sliceText: "#FEF3C7"
  },
  {
    label: "Thala",
    tagTitle: "Thala PM",
    emoji: "👑",
    caption: "“Leads from the front. Finishes what the team started.”",
    sliceBg: "#F59E0B",
    sliceText: "#1A0830"
  },
  {
    label: "Jugaad",
    tagTitle: "Jugaad PM",
    emoji: "🛠️",
    caption: "“Ships with what’s available. Somehow it works.”",
    sliceBg: "#3B1466",
    sliceText: "#FEF3C7"
  },
  {
    label: "Metrics",
    tagTitle: "Metric Magician",
    emoji: "📈",
    caption: "“Makes the graph go up and the room go quiet.”",
    sliceBg: "#F59E0B",
    sliceText: "#1A0830"
  }
];

const NUM_SLICES = WHEEL_ITEMS.length;
const SLICE_ANGLE = 360 / NUM_SLICES; // 45 deg
const NUM_BULBS = 24;

export function WhichPmSpinnerPage() {
  const [searchParams] = useSearchParams();
  const customDate = searchParams.get('date') || 'Sunday';
  const customTime = searchParams.get('time') || '8:00 PM IST';
  const customRegUrl = searchParams.get('reg') || searchParams.get('register') || 'https://docs.google.com/forms/d/e/1FAIpQLSdRBsOZLN4E4cJh-l7b4NYTEisRemCTpPsoBZEAboHQk67tlA/viewform?usp=publish-editor';

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [resultItem, setResultItem] = useState<WheelItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [copied, setCopied] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<HTMLDivElement | null>(null);
  const currentAngleRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [litBulbs, setLitBulbs] = useState<boolean[]>(new Array(NUM_BULBS).fill(false));
  const bulbTickRef = useRef<number>(0);
  const isSpinningRef = useRef<boolean>(false);
  isSpinningRef.current = isSpinning;

  // Bulbs animation loop
  useEffect(() => {
    let animId: number;
    const updateBulbs = () => {
      bulbTickRef.current++;
      const tick = bulbTickRef.current;
      const newLit = new Array(NUM_BULBS).fill(false);

      if (isSpinningRef.current) {
        const activeIdx = tick % NUM_BULBS;
        for (let i = 0; i < NUM_BULBS; i++) {
          const diff = (i - activeIdx + NUM_BULBS) % NUM_BULBS;
          if (diff < 4) newLit[i] = true;
        }
      } else {
        const isAlt = Math.floor(tick / 25) % 2;
        for (let j = 0; j < NUM_BULBS; j++) {
          if ((j % 2) === isAlt) newLit[j] = true;
        }
      }

      setLitBulbs(newLit);
      animId = requestAnimationFrame(updateBulbs);
    };

    animId = requestAnimationFrame(updateBulbs);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Web Audio Click & Haptic Tick
  const playTick = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(700, audioCtxRef.current.currentTime);
        osc.frequency.exponentialRampToValueAtTime(160, audioCtxRef.current.currentTime + 0.015);
        gain.gain.setValueAtTime(0.09, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.015);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.015);
      }
    } catch {
      // Graceful
    }

    if (navigator.vibrate) {
      try {
        navigator.vibrate(8);
      } catch {}
    }

    if (pointerRef.current) {
      pointerRef.current.style.transform = 'translateX(-50%) rotate(-7deg)';
      setTimeout(() => {
        if (pointerRef.current) {
          pointerRef.current.style.transform = 'translateX(-50%) rotate(0deg)';
        }
      }, 45);
    }
  }, []);

  // Canvas Drawing
  const drawWheel = useCallback((rotationDeg: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const radius = cx - 18;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rotationDeg * Math.PI) / 180);

    for (let i = 0; i < NUM_SLICES; i++) {
      const item = WHEEL_ITEMS[i];
      const startAngle = (i * SLICE_ANGLE * Math.PI) / 180;
      const endAngle = ((i + 1) * SLICE_ANGLE * Math.PI) / 180;

      // Slice arc
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = item.sliceBg;
      ctx.fill();

      // Divider stroke
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#F59E0B';
      ctx.stroke();

      // Label text
      ctx.save();
      const midAngle = startAngle + (SLICE_ANGLE * Math.PI) / 360;
      ctx.rotate(midAngle);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = item.sliceText;
      ctx.font = 'bold 26px Georgia, serif';
      ctx.shadowColor = item.sliceBg === '#F59E0B' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(item.label, radius - 28, 0);
      ctx.restore();
    }

    // Outer rim stroke
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#D97706';
    ctx.stroke();

    ctx.restore();
  }, []);

  useEffect(() => {
    drawWheel(0);
  }, [drawWheel]);

  // Spin Execution
  const handleSpin = () => {
    if (isSpinning) return;

    try {
      if (!audioCtxRef.current) {
        const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtxRef.current = new AudioCtxClass();
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch {}

    setIsSpinning(true);
    setShowResult(false);

    // Pick random target slice 0..7
    const targetIdx = Math.floor(Math.random() * NUM_SLICES);
    const chosen = WHEEL_ITEMS[targetIdx];

    // Pointer is at 270 deg (top)
    const sliceCenter = (targetIdx + 0.5) * SLICE_ANGLE;
    let phiTarget = (270 - sliceCenter) % 360;
    if (phiTarget < 0) phiTarget += 360;

    const jitter = (Math.random() - 0.5) * 22; // within 11 deg of center
    const fullTurns = (5 + Math.floor(Math.random() * 2)) * 360;
    const currentMod = currentAngleRef.current % 360;
    const delta = ((phiTarget - currentMod) % 360 + 360) % 360;
    const totalSpin = fullTurns + delta + jitter;

    const startRot = currentAngleRef.current;
    const endRot = currentAngleRef.current + totalSpin;
    const duration = 4000;
    let startTime: number | null = null;
    let lastTickIdx = -1;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / duration, 1);

      // Deceleration easing (quintic)
      const ease = 1 - Math.pow(1 - t, 4.2);
      const rot = startRot + (endRot - startRot) * ease;
      currentAngleRef.current = rot;

      drawWheel(rot);

      const currentTick = Math.floor(rot / SLICE_ANGLE);
      if (currentTick !== lastTickIdx) {
        lastTickIdx = currentTick;
        playTick();
      }

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        setIsSpinning(false);
        setSpinCount(prev => prev + 1);
        setResultItem(chosen);

        setTimeout(() => {
          setShowResult(true);
        }, 320);
      }
    };

    requestAnimationFrame(step);
  };

  const copyLink = () => {
    const url = window.location.href.split('#')[0];
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch {}
      document.body.removeChild(input);
    }
  };

  const pageUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : 'https://stepsmart.net/spinner';
  const whatsappText = resultItem
    ? `The wheel says I’m ${resultItem.tagTitle} ${resultItem.emoji}. What are you? ${pageUrl}`
    : `Which PM are you? Spin the wheel: ${pageUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const trackingSeparator = customRegUrl.indexOf('?') === -1 ? '?' : '&';
  const registerWithTracking = `${customRegUrl}${trackingSeparator}utm_source=pm_spinner&utm_medium=result_card&utm_campaign=ai_pm_making`;

  return (
    <div
      className={`min-h-screen min-h-[100dvh] flex flex-col justify-between items-center px-4 py-4 md:py-6 relative transition-colors duration-300 select-none overflow-x-hidden ${
        theme === 'dark'
          ? 'bg-[#140626] text-[#FDFCF7]'
          : 'bg-[#EFE8FA] text-[#1D0E33]'
      }`}
      style={{
        background:
          theme === 'dark'
            ? 'radial-gradient(circle at 50% 30%, #2a0b4d 0%, #150627 65%, #0d0319 100%)'
            : 'radial-gradient(circle at 50% 30%, #F5F0FF 0%, #EFE8FA 65%, #E5DCF5 100%)'
      }}
    >
      {/* Top Header Bar */}
      <header className="w-full max-w-lg flex items-center justify-between z-10 px-2 py-1">
        <Link
          to="/"
          className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ${
            theme === 'dark'
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
              : 'border-violet-600/40 bg-white text-violet-900 hover:bg-violet-50'
          }`}
        >
          <span>←</span>
          <span>StepSmart</span>
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-amber-500/30 text-amber-400 bg-amber-500/10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            The AI PM: The Making
          </div>
          <button
            onClick={() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all ${
              theme === 'dark'
                ? 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                : 'border-violet-300 bg-white text-violet-900 hover:bg-violet-50'
            }`}
            aria-label="Toggle theme"
          >
            <span>{theme === 'dark' ? '🌙' : '☀️'}</span>
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </header>

      {/* Screen 1: Title & Subtitle */}
      <section className="text-center max-w-md my-2 z-10">
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-2 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Which PM <span className="text-amber-400 italic">are you?</span>
        </h1>
        <p className={`text-sm sm:text-base font-medium ${theme === 'dark' ? 'text-violet-200/80' : 'text-slate-600'}`}>
          Spin to find your tag. Just for fun.
        </p>
      </section>

      {/* Screen 1 & 2: Marquee Wheel Stage */}
      <div className="relative w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] my-3 flex items-center justify-center">
        {/* Ambient backlight glow */}
        <div
          className="absolute -inset-3 rounded-full pointer-events-none filter blur-xl"
          style={{
            background: 'radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, rgba(245, 158, 11, 0) 70%)'
          }}
        />

        {/* Marquee Rim Bezel */}
        <div className="absolute inset-1 rounded-full border-4 border-amber-600 bg-[#17072B] shadow-[0_8px_30px_rgba(0,0,0,0.7)] z-[2]" />

        {/* 24 Marquee Bulbs */}
        <div className="absolute inset-0 rounded-full pointer-events-none z-[4]">
          {litBulbs.map((isLit, i) => {
            const angleDeg = (i * 360) / NUM_BULBS;
            const angleRad = (angleDeg * Math.PI) / 180;
            // 360/2 = 180px radius in standard, offset 6px
            const stageR = 180;
            const bulbR = stageR - 7;
            const bx = stageR + bulbR * Math.sin(angleRad);
            const by = stageR - bulbR * Math.cos(angleRad);

            return (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full -mt-1.5 -ml-1.5 transition-all duration-75"
                style={{
                  left: `${bx}px`,
                  top: `${by}px`,
                  background: isLit
                    ? 'radial-gradient(circle at 40% 35%, #FFFDF5 0%, #FBBF24 50%, #D97706 100%)'
                    : '#3D2206',
                  boxShadow: isLit
                    ? '0 0 8px #FBBF24, 0 0 16px rgba(245, 158, 11, 0.85), inset 0 0 2px #FFFFFF'
                    : 'none',
                  transform: isLit ? 'scale(1.15)' : 'scale(1)',
                  border: '1.5px solid rgba(0,0,0,0.4)'
                }}
              />
            );
          })}
        </div>

        {/* Top Pointer */}
        <div
          ref={pointerRef}
          className="absolute -top-3 left-1/2 -translate-x-1/2 z-[6] pointer-events-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.65)] transition-transform duration-75"
        >
          <svg className="w-8 h-11 block" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 42L2 14C-1 8 3 0 10 0H22C29 0 33 8 30 14L16 42Z"
              fill="url(#pointerGradReact)"
              stroke="#140626"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <circle cx="16" cy="12" r="5" fill="#140626" />
            <circle cx="16" cy="12" r="3" fill="#FDE68A" />
            <defs>
              <linearGradient id="pointerGradReact" x1="16" y1="0" x2="16" y2="42" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFBEB" />
                <stop offset="0.35" stopColor="#FBBF24" />
                <stop offset="0.75" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#B45309" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* High-DPI Canvas Wheel */}
        <canvas
          ref={canvasRef}
          width={680}
          height={680}
          onClick={handleSpin}
          className="absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] rounded-full z-[3] cursor-pointer touch-none shadow-inner"
        />

        {/* Center Hub */}
        <div
          onClick={handleSpin}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-[3px] border-[#FEF3C7] shadow-[0_4px_15px_rgba(0,0,0,0.6)] z-[5] flex items-center justify-center text-xl cursor-pointer"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #FFFBEB 0%, #F59E0B 45%, #92400E 100%)'
          }}
        >
          🎡
        </div>
      </div>

      {/* Spin Controls */}
      <div className="w-full max-w-sm flex flex-col items-center gap-2 z-10 mb-2">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`w-full py-4 px-6 rounded-2xl font-black text-lg tracking-wider uppercase border-[3px] border-[#140626] transition-all cursor-pointer flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'bg-[#F59E0B] text-[#17072B] shadow-[0_6px_0_#B45309,0_10px_24px_rgba(245,158,11,0.4)] active:translate-y-1 active:shadow-[0_2px_0_#B45309]'
              : 'bg-[#1D0E33] text-[#FFF8E7] shadow-[0_6px_0_#000000,0_10px_24px_rgba(29,14,51,0.3)] active:translate-y-1 active:shadow-[0_2px_0_#000000]'
          } ${isSpinning ? 'opacity-85 cursor-not-allowed filter saturate-75' : 'hover:-translate-y-0.5'}`}
        >
          <span>{isSpinning ? 'SPINNING…' : 'SPIN THE WHEEL'}</span>
          <span>➜</span>
        </button>

        {spinCount > 0 && (
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400/90">
            Spin #{spinCount}
          </span>
        )}
      </div>

      {/* Screen 3: Result Card (Slide-Up Modal) */}
      <div
        className={`fixed inset-0 z-50 flex items-end justify-center transition-opacity duration-300 ${
          showResult ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          background: theme === 'dark' ? 'rgba(10, 3, 20, 0.82)' : 'rgba(29, 14, 51, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) setShowResult(false);
        }}
      >
        <div
          className={`w-full max-w-lg rounded-t-[28px] border-t-[3px] border-x-[3px] p-6 sm:p-8 flex flex-col items-center text-center transition-transform duration-400 ease-out max-h-[90vh] overflow-y-auto ${
            showResult ? 'translate-y-0' : 'translate-y-full'
          } ${
            theme === 'dark'
              ? 'bg-[#1A0930]/95 border-[#F59E0B] text-white'
              : 'bg-white/95 border-violet-500 text-[#1D0E33]'
          }`}
        >
          {/* Top handle */}
          <div className="w-11 h-1.5 bg-white/30 rounded-full mb-4" />

          {/* Emoji */}
          <div className="text-6xl mb-2 animate-bounce">
            {resultItem?.emoji || '😎'}
          </div>

          {/* Tag Title */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-amber-400" style={{ fontFamily: 'Georgia, serif' }}>
            {resultItem?.tagTitle}
          </h2>

          {/* Caption */}
          <p className="text-lg sm:text-xl italic mb-4 max-w-md" style={{ fontFamily: 'Georgia, serif' }}>
            {resultItem?.caption}
          </p>

          {/* Disclaimer */}
          <div className="text-xs font-bold tracking-widest uppercase text-violet-200/70 pb-4 mb-5 border-b border-dashed border-amber-500/30 w-full">
            Just for fun. Not a prediction.
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3 mb-5">
            {/* REGISTER Button */}
            <a
              href={registerWithTracking}
              target="_self"
              className="w-full py-3.5 px-6 rounded-xl font-black text-base uppercase tracking-wider bg-amber-500 text-slate-950 border-2 border-slate-950 shadow-[0_4px_0_#B45309] hover:bg-amber-400 active:translate-y-0.5 active:shadow-[0_1px_0_#B45309] flex items-center justify-center gap-2 transition-all"
            >
              <span>REGISTER FOR FREE</span>
              <span>➜</span>
            </a>

            {/* SHARE Button & Copy Link */}
            <div className="grid grid-cols-[1fr_auto] gap-2 w-full">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl font-bold text-sm bg-[#25D366] text-[#073614] border-2 border-slate-950 shadow-[0_3px_0_#128C7E] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.476-.15-.676.15-.2.3-.776.98-.952 1.18-.175.2-.35.225-.651.075s-1.272-.469-2.424-1.496c-.896-.799-1.501-1.786-1.677-2.086-.175-.3-.019-.462.131-.611.136-.134.301-.35.451-.525.15-.175.2-.3.301-.5.1-.2.05-.375-.025-.525s-.676-1.631-.926-2.233c-.244-.585-.492-.506-.676-.515l-.576-.01c-.2 0-.525.075-.8.375s-1.05 1.026-1.05 2.502 1.075 2.9 1.225 3.101c.15.2 2.115 3.23 5.124 4.529.716.309 1.275.494 1.71.633.72.229 1.375.197 1.892.12.578-.087 1.782-.728 2.032-1.431.25-.703.25-1.305.175-1.431-.075-.126-.275-.201-.576-.351zM12.04 2C6.51 2 2.025 6.485 2.025 12.015c0 1.93.55 3.73 1.501 5.255L2 22l4.87-1.474c1.474.875 3.2 1.375 5.17 1.375 5.53 0 10.015-4.485 10.015-10.015S17.57 2 12.04 2z"/>
                </svg>
                <span>Share on WhatsApp</span>
              </a>

              <button
                onClick={copyLink}
                className="py-3 px-4 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/30 flex items-center gap-1.5 transition-all"
                type="button"
              >
                <span>{copied ? '✓ Copied!' : 'Copy Link'}</span>
              </button>
            </div>

            {/* SPIN AGAIN */}
            <button
              onClick={() => setShowResult(false)}
              className="w-full py-3 px-5 rounded-xl font-bold text-sm border-2 border-amber-500/60 bg-white/5 hover:bg-amber-500/15 text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              type="button"
            >
              <span>SPIN AGAIN</span>
              <span className="text-amber-400 font-normal">({`Spin #${spinCount + 1}`})</span>
            </button>
          </div>

          {/* Teaser text below buttons */}
          <div className="text-xs text-violet-200/80 leading-relaxed max-w-sm">
            The real spin happens live on <strong className="text-amber-400 font-bold">{customDate}, {customTime}</strong>.<br />
            <strong>The AI PM: The Making.</strong> Free. Limited seats.
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhichPmSpinnerPage;
