import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sendHeartbeat } from '../utils/api';

const HEARTBEAT_INTERVAL    = 10;           // seconds per segment
const ATTENTION_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

const s = {
  // ── Outer wrapper ─────────────────────────────────────────────────────────
  wrapper: {
    borderRadius: '12px', overflow: 'hidden',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
    background: '#000',
  },

  // ── 16:9 video box ────────────────────────────────────────────────────────
  aspectBox: { position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' },
  iframe:    { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },

  // Transparent overlay that absorbs clicks on YouTube's seekbar area (bottom 80px).
  seekbarBlock: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
    zIndex: 10, cursor: 'not-allowed', background: 'transparent',
  },

  // ── Custom controls bar ───────────────────────────────────────────────────
  controls: {
    background: 'var(--foreground)', padding: '0.7rem 1rem',
    display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  btn: {
    background: 'var(--primary)', color: 'var(--primary-foreground)',
    border: 'none', borderRadius: '6px', padding: '0.4rem 0.9rem',
    cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
    transition: 'background 0.15s', flexShrink: 0,
  },
  btnSecondary: {
    background: 'rgba(255,255,255,0.12)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)',
  },
  // Progress track
  progressTrack: {
    flex: 1, height: '6px', background: 'rgba(255,255,255,0.2)',
    borderRadius: '3px', overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: '3px', transition: 'width 0.5s', background: 'var(--primary)' },
  progressFillComplete: { background: 'var(--success)' },
  pctLabel: { color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', minWidth: '36px', textAlign: 'right' },

  // ── Attention-check modal ─────────────────────────────────────────────────
  modalOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(15,30,60,0.88)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20,
    backdropFilter: 'blur(4px)',
  },
  modalCard: {
    background: 'var(--card)', borderRadius: '16px', padding: '2rem',
    textAlign: 'center', maxWidth: '300px', width: '90%',
    boxShadow: 'var(--shadow-lg)',
    border: '1px solid var(--border)',
  },
  modalIcon: {
    width: '48px', height: '48px', borderRadius: '50%',
    background: 'var(--accent)', margin: '0 auto 1rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.4rem',
  },
  modalTitle: { fontSize: '1rem', fontWeight: 800, color: 'var(--foreground)', marginBottom: '0.4rem' },
  modalSub:   { color: 'var(--muted-foreground)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.5 },
  modalBtn: {
    background: 'var(--primary)', color: 'var(--primary-foreground)',
    border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem',
    cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700, width: '100%',
  },

  // ── Completion banner ─────────────────────────────────────────────────────
  completionBanner: {
    background: 'var(--success-light)', color: 'var(--success-fg)',
    padding: '0.65rem 1rem', fontSize: '0.875rem', textAlign: 'center', fontWeight: 600,
    borderTop: '1px solid var(--border)',
  },
};

export default function VideoPlayer({ videoId, courseId, weekId, initialProgress, onVideoComplete }) {
  const playerRef         = useRef(null);
  const playerInstanceRef = useRef(null);
  const watchedSegmentsRef  = useRef(new Set());
  const heartbeatTimerRef   = useRef(null);
  const attentionTimerRef   = useRef(null);

  const [isPlaying,     setIsPlaying]     = useState(false);
  const [completionPct, setCompletionPct] = useState(0);
  const [videoComplete, setVideoComplete] = useState(false);
  const [attentionCheck,setAttentionCheck]= useState(false);

  // Hydrate from server progress on mount
  useEffect(() => {
    if (initialProgress?.watchedSegments) {
      watchedSegmentsRef.current = new Set(initialProgress.watchedSegments);
      if (initialProgress.videoComplete) setVideoComplete(true);
      if (initialProgress.duration) {
        const total = Math.ceil(initialProgress.duration / HEARTBEAT_INTERVAL);
        setCompletionPct(Math.min(Math.round((watchedSegmentsRef.current.size / total) * 100), 100));
      }
    }
  }, [initialProgress]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    window.onYouTubeIframeAPIReady = initPlayer;
    if (window.YT?.Player) initPlayer();

    return () => {
      clearInterval(heartbeatTimerRef.current);
      clearTimeout(attentionTimerRef.current);
      if (playerInstanceRef.current) { playerInstanceRef.current.destroy(); playerInstanceRef.current = null; }
    };
  }, [videoId]);

  function initPlayer() {
    if (!playerRef.current) return;
    if (playerInstanceRef.current) playerInstanceRef.current.destroy();
    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      videoId,
      playerVars: { controls: 0, disablekb: 1, fs: 0, rel: 0, modestbranding: 1, iv_load_policy: 3 },
      events: { onReady: () => {}, onStateChange },
    });
  }

  function onStateChange(event) {
    if (event.data === 1) {          // PLAYING
      setIsPlaying(true);
      startHeartbeat();
      startAttentionTimer();
    } else {
      setIsPlaying(false);
      stopHeartbeat();
      clearTimeout(attentionTimerRef.current);
    }
  }

  function startHeartbeat() {
    clearInterval(heartbeatTimerRef.current);
    heartbeatTimerRef.current = setInterval(fireHeartbeat, HEARTBEAT_INTERVAL * 1000);
  }
  function stopHeartbeat() { clearInterval(heartbeatTimerRef.current); }

  function startAttentionTimer() {
    clearTimeout(attentionTimerRef.current);
    attentionTimerRef.current = setTimeout(() => {
      playerInstanceRef.current?.pauseVideo();
      setAttentionCheck(true);
    }, ATTENTION_INTERVAL_MS);
  }

  const fireHeartbeat = useCallback(async () => {
    const player = playerInstanceRef.current;
    if (!player) return;
    const currentTime = Math.floor(player.getCurrentTime());
    const duration    = Math.floor(player.getDuration());
    if (!duration) return;

    const segment      = Math.floor(currentTime / HEARTBEAT_INTERVAL);
    const totalSegments = Math.ceil(duration / HEARTBEAT_INTERVAL);
    watchedSegmentsRef.current.add(segment);

    const pct = Math.min(Math.round((watchedSegmentsRef.current.size / totalSegments) * 100), 100);
    setCompletionPct(pct);

    try { await sendHeartbeat(courseId, weekId, currentTime, duration); } catch { /* retry next interval */ }

    if (pct >= 90 && !videoComplete) {
      setVideoComplete(true);
      onVideoComplete?.();
    }
  }, [courseId, weekId, videoComplete, onVideoComplete]);

  function handlePlayPause() {
    const player = playerInstanceRef.current;
    if (!player) return;
    player.getPlayerState() === 1 ? player.pauseVideo() : player.playVideo();
  }

  function handleRewind() {
    const player = playerInstanceRef.current;
    if (!player) return;
    player.seekTo(Math.max(0, player.getCurrentTime() - 10), true);
  }

  function handleAttentionConfirm() {
    setAttentionCheck(false);
    playerInstanceRef.current?.playVideo();
  }

  return (
    <div style={s.wrapper}>
      <div style={s.aspectBox}>
        <div ref={playerRef} style={s.iframe} />
        {/* Seekbar block overlay */}
        <div style={s.seekbarBlock} />
        {/* Attention modal */}
        {attentionCheck && (
          <div style={s.modalOverlay}>
            <div style={s.modalCard}>
              <div style={s.modalIcon}>👋</div>
              <div style={s.modalTitle}>Still watching?</div>
              <div style={s.modalSub}>The video paused to confirm you're still there.</div>
              <button style={s.modalBtn} onClick={handleAttentionConfirm}>
                Yes, continue watching
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={s.controls}>
        <button style={s.btn} onClick={handlePlayPause}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
        <button style={{ ...s.btn, ...s.btnSecondary }} onClick={handleRewind}>−10s</button>
        <div style={s.progressTrack}>
          <div style={{
            ...s.progressFill,
            width: `${completionPct}%`,
            ...(videoComplete ? s.progressFillComplete : {}),
          }} />
        </div>
        <span style={s.pctLabel}>{completionPct}%</span>
      </div>

      {videoComplete && (
        <div style={s.completionBanner}>
          ✓ Video complete — take the quiz in the sidebar
        </div>
      )}
    </div>
  );
}
