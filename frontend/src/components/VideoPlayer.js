import React, { useEffect, useRef, useState } from 'react';
import { sendHeartbeat } from '../utils/api';

const HEARTBEAT_INTERVAL = 10;           // seconds per segment

const s = {
  // ── Outer wrapper ─────────────────────────────────────────────────────────
  wrapper: {
    borderRadius: '12px', overflow: 'hidden',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
    background: '#000',
  },

  // ── 16:9 video box ────────────────────────────────────────────────────────
  aspectBox: { position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' },
  iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },

  // Transparent overlay that absorbs clicks on YouTube's seekbar area (bottom 80px).
  seekbarBlock: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
    zIndex: 10, cursor: 'not-allowed', background: 'transparent',
  },
// Making dummy update to trigger redeploy and test production build, since YouTube blocking seems to only happen in prod for some reason. Will remove this comment after confirming the fix works
  // Transparent overlay that absorbs clicks on YouTube's top title area (top 80px).
  titleBlock: {
    position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
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
  speedSelect: {
    background: 'rgba(255,255,255,0.12)', color: '#fff',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px',
    padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700,
    outline: 'none',
  },

  // ── Completion banner ─────────────────────────────────────────────────────
  completionBanner: {
    background: 'var(--success-light)', color: 'var(--success-fg)',
    padding: '0.65rem 1rem', fontSize: '0.875rem', textAlign: 'center', fontWeight: 600,
    borderTop: '1px solid var(--border)',
  },
};

export default function VideoPlayer({ videoId, courseId, weekId, initialProgress, onVideoComplete }) {
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const wrapperRef = useRef(null);
  const watchedSegmentsRef = useRef(new Set());
  const heartbeatTimerRef = useRef(null);
  const lastHeartbeatTimeRef = useRef(0);  // video-time (seconds) at last heartbeat
  const fireHeartbeatRef = useRef(null);   // always points to the latest heartbeat logic
  const onStateChangeRef = useRef(null);   // always points to the latest state-change handler

  const [isPlaying, setIsPlaying] = useState(false);
  const [completionPct, setCompletionPct] = useState(0);
  const [videoComplete, setVideoComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // If the user already completed the video on a previous visit, seeking is allowed.
  // We only set this to true initially, or mid-session when they hit 90%.
  const [seekAllowed, setSeekAllowed] = useState(initialProgress?.videoComplete === true);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

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
      if (playerInstanceRef.current) { playerInstanceRef.current.destroy(); playerInstanceRef.current = null; }
    };
  }, [videoId]);

  function initPlayer(startTime = 0, autoPlay = false) {
    if (!playerRef.current) return;
    if (playerInstanceRef.current) playerInstanceRef.current.destroy();

    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      videoId,
      playerVars: {
        controls: 0,
        disablekb: 1,
        fs: 0,
        rel: 0,
        modestbranding: 1,
        iv_load_policy: 3,
        start: Math.floor(startTime),
        autoplay: autoPlay ? 1 : 0
      },
      events: { onReady: () => {}, onStateChange: (e) => onStateChangeRef.current(e) },
    });
  }

  // Assign to ref on every render so the interval and YT callbacks always
  // use the latest values of videoComplete, onVideoComplete, etc.
  function checkAndMarkComplete(pct) {
    if (pct >= 80 && !videoComplete) {
      setVideoComplete(true);
      setSeekAllowed(true);
      onVideoComplete?.();
    }
  }

  onStateChangeRef.current = function (event) {
    if (event.data === 1) {          // PLAYING
      setIsPlaying(true);
      lastHeartbeatTimeRef.current = Math.floor(playerInstanceRef.current?.getCurrentTime() ?? 0);
      startHeartbeat();
    } else {
      setIsPlaying(false);
      if (event.data === 0) {        // ENDED — fill remaining segments up to video end
        const player = playerInstanceRef.current;
        if (player) {
          const duration = Math.floor(player.getDuration());
          if (duration) {
            const totalSegments = Math.ceil(duration / HEARTBEAT_INTERVAL);
            const startSeg = Math.floor(lastHeartbeatTimeRef.current / HEARTBEAT_INTERVAL);
            for (let seg = startSeg; seg < totalSegments; seg++) {
              watchedSegmentsRef.current.add(seg);
            }
            const pct = Math.min(Math.round((watchedSegmentsRef.current.size / totalSegments) * 100), 100);
            setCompletionPct(pct);
            checkAndMarkComplete(pct);
          }
        }
      }
      stopHeartbeat();
    }
  };

  fireHeartbeatRef.current = async function () {
    const player = playerInstanceRef.current;
    if (!player) return;
    const currentTime = Math.floor(player.getCurrentTime());
    const duration = Math.floor(player.getDuration());
    if (!duration) return;

    // Fill every segment between the previous heartbeat position and now.
    // At 1.25x or 1.5x the video advances faster than the 10-second interval,
    // so without this, segments are skipped and completion never reaches 80%.
    const prevTime = lastHeartbeatTimeRef.current;
    lastHeartbeatTimeRef.current = currentTime;
    const startSeg = Math.floor(prevTime / HEARTBEAT_INTERVAL);
    const endSeg   = Math.floor(currentTime / HEARTBEAT_INTERVAL);
    for (let seg = startSeg; seg <= endSeg; seg++) {
      watchedSegmentsRef.current.add(seg);
    }

    const totalSegments = Math.ceil(duration / HEARTBEAT_INTERVAL);
    const pct = Math.min(Math.round((watchedSegmentsRef.current.size / totalSegments) * 100), 100);
    setCompletionPct(pct);

    try { await sendHeartbeat(courseId, weekId, currentTime, duration); } catch { /* retry next interval */ }

    checkAndMarkComplete(pct);
  };

  function startHeartbeat() {
    clearInterval(heartbeatTimerRef.current);
    heartbeatTimerRef.current = setInterval(() => fireHeartbeatRef.current(), HEARTBEAT_INTERVAL * 1000);
  }
  function stopHeartbeat() { clearInterval(heartbeatTimerRef.current); }

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

  function handleForward() {
    const player = playerInstanceRef.current;
    if (!player) return;
    const duration = player.getDuration();
    if (duration) {
      player.seekTo(Math.min(duration, player.getCurrentTime() + 10), true);
    }
  }

  function handleFullScreen() {
    if (!wrapperRef.current) return;
    const doc = document;
    if (doc.fullscreenElement || doc.webkitFullscreenElement) {
      if (doc.exitFullscreen) doc.exitFullscreen();
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
    } else {
      const el = wrapperRef.current;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    }
  }

  function handleSpeedChange(rate) {
    playerInstanceRef.current?.setPlaybackRate(rate);
    setPlaybackRate(rate);
  }
  return (
    <div
      ref={wrapperRef}
      style={{
        ...s.wrapper,
        ...(isFullscreen ? { borderRadius: 0, border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } : {})
      }}
    >
      <div style={{ ...s.aspectBox, ...(isFullscreen ? { paddingBottom: 0, flex: 1, height: 'auto' } : {}) }}>
        <div ref={playerRef} style={s.iframe} />
        {/* Title block overlay - still block title clicking if we want, but definitely hide seekbar block if seekAllowed */}
        {!seekAllowed && <div style={s.titleBlock} />}
        {/* Seekbar block overlay */}
        {!seekAllowed && <div style={s.seekbarBlock} />}
      </div>

      {/* Controls */}
      <div style={s.controls}>
        <button style={s.btn} onClick={handlePlayPause}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
        <button style={{ ...s.btn, ...s.btnSecondary }} onClick={handleRewind}>−10s</button>
        {seekAllowed && (
          <button style={{ ...s.btn, ...s.btnSecondary }} onClick={handleForward}>+10s</button>
        )}
        <select
          style={s.speedSelect}
          value={playbackRate}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
        >
          {[1, 1.25, 1.5].map((rate) => (
            <option key={rate} value={rate}>{rate}x</option>
          ))}
        </select>
        <div style={s.progressTrack}>
          <div style={{
            ...s.progressFill,
            width: `${completionPct}%`,
            ...(videoComplete ? s.progressFillComplete : {}),
          }} />
        </div>
        <span style={s.pctLabel}>{completionPct}%</span>
        <button style={{ ...s.btn, ...s.btnSecondary, marginLeft: 'auto' }} onClick={handleFullScreen} title="Fullscreen">
          {isFullscreen ? '⤓ Exit Fullscreen' : '⛶ Fullscreen'}
        </button>
      </div>

      {videoComplete && (
        <div style={s.completionBanner}>
          ✓ Video complete — take the quiz in the sidebar
        </div>
      )}
    </div>
  );
}
