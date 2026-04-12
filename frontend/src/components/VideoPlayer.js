import React, { useEffect, useRef, useState } from 'react';
import { sendHeartbeat } from '../utils/api';

const HEARTBEAT_INTERVAL = 10;           // seconds per segment
let youtubeApiReadyPromise = null;

function ensureYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);

  if (!youtubeApiReadyPromise) {
    youtubeApiReadyPromise = new Promise((resolve) => {
      window.onYouTubeIframeAPIReady = () => {
        resolve(window.YT);
        youtubeApiReadyPromise = Promise.resolve(window.YT);
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    });
  }

  return youtubeApiReadyPromise;
}

const s = {
  // ── Outer wrapper ─────────────────────────────────────────────────────────
  wrapper: {
    borderRadius: '12px', overflow: 'hidden',
    border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)',
    background: '#000',
    outline: 'none',
  },

  // ── 16:9 video box ────────────────────────────────────────────────────────
  aspectBox: { position: 'relative', paddingBottom: '56.25%', height: 0, background: '#000' },
  iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
  surfaceBlock: {
    position: 'absolute',
    inset: 0,
    zIndex: 5,
    background: 'transparent',
    cursor: 'pointer',
  },

  // Transparent overlay that absorbs clicks on YouTube's seekbar area (bottom 80px).
  seekbarBlock: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
    zIndex: 10, cursor: 'not-allowed', background: 'transparent',
  },
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
  btnDisabled: {
    opacity: 0.45,
    cursor: 'not-allowed',
  },
  // Progress track
  progressTrack: {
    position: 'relative',
    flex: 1,
    height: '8px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '999px',
    overflow: 'visible',
    touchAction: 'none',
  },
  progressFill: { height: '100%', borderRadius: '999px', transition: 'width 0.2s linear', background: 'var(--primary)' },
  progressFillComplete: { background: 'var(--success)' },
  progressThumb: {
    position: 'absolute',
    top: '50%',
    width: '16px',
    height: '16px',
    borderRadius: '999px',
    border: '2px solid rgba(255,255,255,0.95)',
    boxShadow: '0 0 0 4px rgba(0,0,0,0.16)',
    transform: 'translateY(-50%)',
    transition: 'left 0.2s linear, opacity 0.2s linear',
    pointerEvents: 'none',
  },
  timeLabel: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: '0.78rem',
    minWidth: '88px',
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
  },
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
  hintBanner: {
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.72)',
    padding: '0.65rem 1rem',
    fontSize: '0.8rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
};

export default function VideoPlayer({ videoId, courseId, weekId, initialProgress, onVideoComplete, onQuizUnlock }) {
  const playerRef = useRef(null);
  const playerInstanceRef = useRef(null);
  const wrapperRef = useRef(null);
  const progressTrackRef = useRef(null);
  const watchedSegmentsRef = useRef(new Set());
  const heartbeatTimerRef = useRef(null);
  const uiTimerRef = useRef(null);
  const lastHeartbeatTimeRef = useRef(0);  // video-time (seconds) at last heartbeat
  const fireHeartbeatRef   = useRef(null);  // always points to the latest heartbeat logic
  const onStateChangeRef   = useRef(null);  // always points to the latest state-change handler
  const quizUnlockedRef    = useRef(false); // fired once when pct hits 50%
  const playbackRateRef    = useRef(1);
  const wasPlayingBeforeScrubRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const playerRecoveryCountRef = useRef(0);

  // Resume position: last watched segment converted to seconds, computed once at mount.
  const resumeTimeRef = useRef(
    initialProgress?.watchedSegments?.length > 0
      ? Math.max(...initialProgress.watchedSegments) * HEARTBEAT_INTERVAL
      : 0
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [completionPct, setCompletionPct] = useState(0);
  const [videoComplete, setVideoComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(resumeTimeRef.current);
  const [duration, setDuration] = useState(initialProgress?.duration || 0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [playerNonce, setPlayerNonce] = useState(0);

  // If the user already completed the video on a previous visit, custom seeking is allowed.
  // We only set this to true initially, or mid-session when the lesson is marked complete.
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
      if (initialProgress.videoComplete) {
        setVideoComplete(true);
        setSeekAllowed(true);
        quizUnlockedRef.current = true;
        onQuizUnlock?.();
      }
      if (initialProgress.duration) {
        setDuration(initialProgress.duration);
        const total = Math.ceil(initialProgress.duration / HEARTBEAT_INTERVAL);
        const pct = Math.min(Math.round((watchedSegmentsRef.current.size / total) * 100), 100);
        setCompletionPct(pct);
        if (pct >= 50) { quizUnlockedRef.current = true; onQuizUnlock?.(); }
      }
    }
  }, [initialProgress]);

  useEffect(() => {
    let cancelled = false;
    const bootPlayer = () => {
      let startTime = resumeTimeRef.current;
      let shouldAutoPlay = false;
      let currentRate = playbackRateRef.current;
      const existingPlayer = playerInstanceRef.current;

      if (existingPlayer) {
        try {
          startTime = existingPlayer.getCurrentTime() || startTime;
          shouldAutoPlay = existingPlayer.getPlayerState() === 1;
          currentRate = existingPlayer.getPlaybackRate?.() || currentRate;
        } catch {
          // If the player is not ready yet, fall back to the last known values.
        }
        stopHeartbeat();
        clearInterval(uiTimerRef.current);
        existingPlayer.destroy();
        playerInstanceRef.current = null;
      }

      initPlayer(startTime, shouldAutoPlay, currentRate);
    };

    ensureYouTubeApi().then(() => {
      if (!cancelled) bootPlayer();
    });

    return () => {
      cancelled = true;
    };
  }, [videoId, playerNonce]);

  useEffect(() => () => {
    clearInterval(heartbeatTimerRef.current);
    clearInterval(uiTimerRef.current);
    if (playerInstanceRef.current) {
      playerInstanceRef.current.destroy();
      playerInstanceRef.current = null;
    }
  }, []);

  useEffect(() => {
    playbackRateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    playerRecoveryCountRef.current = 0;
  }, [videoId]);

  useEffect(() => {
    if (!seekAllowed) return undefined;

    function handleKeyDown(event) {
      const targetTag = event.target?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA' || targetTag === 'SELECT' || event.target?.isContentEditable) {
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handleRewind();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleForward();
      }
    }

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [seekAllowed, currentTime, duration]);

  function formatTime(seconds) {
    const safeSeconds = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function syncTimelineState(forcedTime = null, forcedDuration = null) {
    const player = playerInstanceRef.current;
    const nextDuration = Math.max(
      0,
      Math.floor(typeof forcedDuration === 'number' ? forcedDuration : player?.getDuration?.() || 0),
    );
    const rawTime = typeof forcedTime === 'number' ? forcedTime : player?.getCurrentTime?.() || 0;
    const nextTime = Math.max(0, Math.min(rawTime, nextDuration || rawTime));

    setDuration(nextDuration);
    setCurrentTime(nextTime);
  }

  function startUiTimer() {
    clearInterval(uiTimerRef.current);
    uiTimerRef.current = setInterval(() => syncTimelineState(), 250);
  }

  function stopUiTimer() {
    clearInterval(uiTimerRef.current);
  }

  function seekToTime(nextTime) {
    const player = playerInstanceRef.current;
    if (!player || !seekAllowed) return;

    const nextDuration = Math.max(duration, Math.floor(player.getDuration() || 0));
    if (!nextDuration) return;

    const clampedTime = Math.max(0, Math.min(nextTime, nextDuration));
    player.seekTo(clampedTime, true);
    lastHeartbeatTimeRef.current = Math.floor(clampedTime);
    syncTimelineState(clampedTime, nextDuration);
  }

  function seekFromClientX(clientX) {
    const track = progressTrackRef.current;
    if (!track || !seekAllowed) return;

    const rect = track.getBoundingClientRect();
    if (!rect.width) return;

    const ratio = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
    const nextDuration = Math.max(duration, Math.floor(playerInstanceRef.current?.getDuration?.() || 0));
    seekToTime(nextDuration * ratio);
  }

  function finishScrub(pointerId = null) {
    if (pointerId !== null && activePointerIdRef.current !== pointerId) return;
    if (pointerId !== null) {
      progressTrackRef.current?.releasePointerCapture?.(pointerId);
    }

    activePointerIdRef.current = null;
    setIsScrubbing(false);

    if (wasPlayingBeforeScrubRef.current) {
      playerInstanceRef.current?.playVideo();
    }
    wasPlayingBeforeScrubRef.current = false;
  }

  function initPlayer(startTime = 0, autoPlay = false, rate = playbackRateRef.current) {
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
        playsinline: 1,
      },
      events: {
        onReady: (event) => {
          if (startTime > 0) event.target.seekTo(startTime, true);
          if (rate && rate !== 1) event.target.setPlaybackRate(rate);
          if (autoPlay) event.target.playVideo();
          syncTimelineState(startTime, event.target.getDuration?.() || 0);
        },
        onStateChange: (e) => onStateChangeRef.current(e),
        onError: () => {
          if (playerRecoveryCountRef.current >= 1) return;
          playerRecoveryCountRef.current += 1;
          window.setTimeout(() => {
            setPlayerNonce((value) => value + 1);
          }, 250);
        },
      },
    });
  }

  // Assign to ref on every render so the interval and YT callbacks always
  // use the latest values of videoComplete, onVideoComplete, etc.
  function checkAndMarkComplete(pct) {
    if (pct >= 50 && !quizUnlockedRef.current) {
      quizUnlockedRef.current = true;
      onQuizUnlock?.();
    }
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
      startUiTimer();
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
            syncTimelineState(duration, duration);
          }
        }
      }
      stopHeartbeat();
      stopUiTimer();
      syncTimelineState();
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
    syncTimelineState(currentTime, duration);

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
    const liveTime = playerInstanceRef.current?.getCurrentTime?.();
    seekToTime((typeof liveTime === 'number' ? liveTime : currentTime) - 10);
  }

  function handleForward() {
    const liveTime = playerInstanceRef.current?.getCurrentTime?.();
    seekToTime((typeof liveTime === 'number' ? liveTime : currentTime) + 10);
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

  function handleSurfaceMouseDown() {
    wrapperRef.current?.focus?.();
  }

  function handleSurfaceClick() {
    wrapperRef.current?.focus?.();
    handlePlayPause();
  }

  function handleProgressPointerDown(event) {
    if (!seekAllowed) return;

    event.preventDefault();
    activePointerIdRef.current = event.pointerId;
    wasPlayingBeforeScrubRef.current = playerInstanceRef.current?.getPlayerState?.() === 1;
    playerInstanceRef.current?.pauseVideo();
    progressTrackRef.current?.setPointerCapture?.(event.pointerId);
    setIsScrubbing(true);
    seekFromClientX(event.clientX);
  }

  function handleProgressPointerMove(event) {
    if (!isScrubbing || activePointerIdRef.current !== event.pointerId) return;
    seekFromClientX(event.clientX);
  }

  const playbackPct = duration > 0
    ? Math.max(0, Math.min((currentTime / duration) * 100, 100))
    : 0;
  const thumbOffset = duration > 0
    ? `calc(${playbackPct}% - 8px)`
    : 'calc(0% - 8px)';
  const metaLabel = duration > 0
    ? `${formatTime(currentTime)} / ${formatTime(duration)}`
    : `${completionPct}% watched`;

  return (
    <div
      ref={wrapperRef}
      tabIndex={0}
      style={{
        ...s.wrapper,
        ...(isFullscreen ? { borderRadius: 0, border: 'none', display: 'flex', flexDirection: 'column', height: '100%' } : {})
      }}
    >
      <div style={{ ...s.aspectBox, ...(isFullscreen ? { paddingBottom: 0, flex: 1, height: 'auto' } : {}) }}>
        <div ref={playerRef} style={s.iframe} />
        <div
          style={s.surfaceBlock}
          onMouseDown={handleSurfaceMouseDown}
          onClick={handleSurfaceClick}
        />
        <div style={s.titleBlock} />
        <div style={s.seekbarBlock} />
      </div>

      {/* Controls */}
      <div style={s.controls}>
        <button style={s.btn} onClick={handlePlayPause}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
        <button
          style={{ ...s.btn, ...s.btnSecondary, ...(seekAllowed ? {} : s.btnDisabled) }}
          onClick={handleRewind}
          disabled={!seekAllowed}
          title={seekAllowed ? 'Rewind 10 seconds' : 'Complete the video to unlock rewinding'}
        >
          −10s
        </button>
        <button
          style={{ ...s.btn, ...s.btnSecondary, ...(seekAllowed ? {} : s.btnDisabled) }}
          onClick={handleForward}
          disabled={!seekAllowed}
          title={seekAllowed ? 'Forward 10 seconds' : 'Complete the video to unlock forwarding'}
        >
          +10s
        </button>
        <select
          style={s.speedSelect}
          value={playbackRate}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
        >
          {[1, 1.25, 1.5].map((rate) => (
            <option key={rate} value={rate}>{rate}x</option>
          ))}
        </select>
        <div
          ref={progressTrackRef}
          style={{
            ...s.progressTrack,
            cursor: seekAllowed ? (isScrubbing ? 'grabbing' : 'pointer') : 'not-allowed',
            opacity: seekAllowed ? 1 : 0.85,
          }}
          onPointerDown={handleProgressPointerDown}
          onPointerMove={handleProgressPointerMove}
          onPointerUp={(event) => finishScrub(event.pointerId)}
          onPointerCancel={(event) => finishScrub(event.pointerId)}
        >
          <div style={{
            ...s.progressFill,
            width: `${playbackPct}%`,
            ...(videoComplete ? s.progressFillComplete : {}),
          }} />
          <div
            style={{
              ...s.progressThumb,
              left: thumbOffset,
              background: videoComplete ? 'var(--success)' : 'var(--primary)',
              opacity: duration > 0 ? 1 : 0,
            }}
          />
        </div>
        <span style={s.timeLabel}>{metaLabel}</span>
        <button style={{ ...s.btn, ...s.btnSecondary, marginLeft: 'auto' }} onClick={handleFullScreen} title="Fullscreen">
          {isFullscreen ? '⤓ Exit Fullscreen' : '⛶ Fullscreen'}
        </button>
      </div>

      {videoComplete && (
        <div style={s.completionBanner}>
          ✓ Video complete — drag the green line or use the arrow keys to move around the lecture.
        </div>
      )}

      {!seekAllowed && (
        <div style={s.hintBanner}>
          Complete the video first to unlock dragging, rewinding, forwarding, and arrow-key seeking.
        </div>
      )}
    </div>
  );
}
