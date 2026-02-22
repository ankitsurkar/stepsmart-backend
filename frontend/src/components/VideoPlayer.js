import React, { useEffect, useRef, useState, useCallback } from 'react';
import { sendHeartbeat } from '../utils/api';

// How often (in seconds) we record a new segment and send a heartbeat to the backend.
const HEARTBEAT_INTERVAL = 10;

// How long (ms) before the attention-check modal fires.
const ATTENTION_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

const s = {
  wrapper: { position: 'relative', width: '100%', background: '#000', borderRadius: '8px', overflow: 'hidden' },
  // 16:9 aspect ratio via padding-bottom trick
  aspectBox: { position: 'relative', paddingBottom: '56.25%', height: 0 },
  iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' },
  // Transparent overlay covers YouTube's control bar to block direct seekbar interaction.
  // zIndex must be above the iframe (which has no z-index of its own but is in stacking context).
  seekbarBlock: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px',
    zIndex: 10, cursor: 'not-allowed', background: 'transparent',
  },
  controls: {
    background: '#1a1a2e', padding: '0.75rem 1rem',
    display: 'flex', alignItems: 'center', gap: '0.75rem',
  },
  btn: {
    background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '6px',
    padding: '0.4rem 1rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
  },
  progressTrack: {
    flex: 1, height: '8px', background: '#2d2d4e', borderRadius: '4px',
    position: 'relative', overflow: 'hidden',
  },
  progressFill: {
    height: '100%', background: '#4f46e5', borderRadius: '4px',
    transition: 'width 0.5s',
  },
  progressComplete: { background: '#10b981' },
  completionPct: { color: '#9ca3af', fontSize: '0.8rem', minWidth: '40px', textAlign: 'right' },
  // Attention-check modal overlay
  modalOverlay: {
    position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 20,
  },
  modalCard: {
    background: '#1a1a2e', borderRadius: '12px', padding: '2rem',
    textAlign: 'center', maxWidth: '320px',
  },
  modalTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' },
  modalSubtitle: { color: '#9ca3af', fontSize: '0.875rem', marginBottom: '1.5rem' },
  modalBtn: {
    background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px',
    padding: '0.75rem 1.5rem', cursor: 'pointer', fontSize: '1rem', fontWeight: 600,
  },
};

export default function VideoPlayer({ videoId, courseId, weekId, initialProgress, onVideoComplete }) {
  const playerRef = useRef(null);          // DOM node where YouTube injects the iframe
  const playerInstanceRef = useRef(null);  // YT.Player instance

  // watchedSegmentsRef is a Set of integer segment indices.
  // Using a ref (not state) because mutations must not re-render the component —
  // that would destroy and recreate the YouTube iframe.
  const watchedSegmentsRef = useRef(new Set());
  const heartbeatTimerRef = useRef(null);
  const attentionTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [completionPct, setCompletionPct] = useState(0);
  const [videoComplete, setVideoComplete] = useState(false);
  const [attentionCheck, setAttentionCheck] = useState(false);

  // Hydrate watched segments from server-side progress on mount.
  useEffect(() => {
    if (initialProgress?.watchedSegments) {
      watchedSegmentsRef.current = new Set(initialProgress.watchedSegments);
      if (initialProgress.videoComplete) setVideoComplete(true);
      if (initialProgress.duration) {
        const total = Math.ceil(initialProgress.duration / HEARTBEAT_INTERVAL);
        const pct = Math.min(Math.round((watchedSegmentsRef.current.size / total) * 100), 100);
        setCompletionPct(pct);
      }
    }
  }, [initialProgress]);

  // Load the YouTube IFrame API script once.
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    // YouTube calls this global when its script is ready.
    window.onYouTubeIframeAPIReady = initPlayer;

    // If the API script was already loaded before this mount (e.g. navigating between weeks),
    // window.YT.Player is already available — init immediately.
    if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      clearInterval(heartbeatTimerRef.current);
      clearTimeout(attentionTimerRef.current);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [videoId]);

  function initPlayer() {
    if (!playerRef.current) return;
    if (playerInstanceRef.current) {
      playerInstanceRef.current.destroy();
    }
    playerInstanceRef.current = new window.YT.Player(playerRef.current, {
      videoId,
      playerVars: {
        controls: 0,      // Hide native YouTube UI entirely
        disablekb: 1,     // Disable keyboard shortcuts (space, arrow keys)
        fs: 0,            // No fullscreen button
        rel: 0,           // No related videos at end
        modestbranding: 1,
        iv_load_policy: 3, // No annotations
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onStateChange,
      },
    });
  }

  function onPlayerReady() {
    // Player is ready but we don't auto-play — the student must click Play.
  }

  function onStateChange(event) {
    const state = event.data;
    // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
    if (state === 1) {
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

  function stopHeartbeat() {
    clearInterval(heartbeatTimerRef.current);
  }

  function startAttentionTimer() {
    clearTimeout(attentionTimerRef.current);
    attentionTimerRef.current = setTimeout(() => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.pauseVideo();
      }
      setAttentionCheck(true);
    }, ATTENTION_INTERVAL_MS);
  }

  const fireHeartbeat = useCallback(async () => {
    const player = playerInstanceRef.current;
    if (!player) return;

    const currentTime = Math.floor(player.getCurrentTime());
    const duration = Math.floor(player.getDuration());
    if (!duration) return;

    const segment = Math.floor(currentTime / HEARTBEAT_INTERVAL);
    watchedSegmentsRef.current.add(segment);

    const totalSegments = Math.ceil(duration / HEARTBEAT_INTERVAL);
    const pct = Math.min(Math.round((watchedSegmentsRef.current.size / totalSegments) * 100), 100);
    setCompletionPct(pct);

    try {
      await sendHeartbeat(courseId, weekId, currentTime, duration);
    } catch {
      // Swallow network errors silently — the in-memory set still accumulated the segment.
      // It will be sent on the next heartbeat.
    }

    // Check completion on the frontend as well (the backend is the source of truth,
    // but this gives an immediate UI update without waiting for a progress re-fetch).
    if (pct >= 90 && !videoComplete) {
      setVideoComplete(true);
      if (onVideoComplete) onVideoComplete();
    }
  }, [courseId, weekId, videoComplete, onVideoComplete]);

  function handlePlayPause() {
    const player = playerInstanceRef.current;
    if (!player) return;
    const state = player.getPlayerState();
    if (state === 1) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function handleRewind() {
    const player = playerInstanceRef.current;
    if (!player) return;
    const current = player.getCurrentTime();
    player.seekTo(Math.max(0, current - 10), true);
  }

  function handleAttentionConfirm() {
    setAttentionCheck(false);
    if (playerInstanceRef.current) {
      playerInstanceRef.current.playVideo();
    }
  }

  const barColor = videoComplete ? s.progressComplete : {};

  return (
    <div style={s.wrapper}>
      <div style={s.aspectBox}>
        {/* YouTube injects the iframe into this div */}
        <div ref={playerRef} style={s.iframe} />

        {/* Transparent div that absorbs clicks on YouTube's seekbar area */}
        <div style={s.seekbarBlock} />

        {/* Attention-check modal */}
        {attentionCheck && (
          <div style={s.modalOverlay}>
            <div style={s.modalCard}>
              <div style={s.modalTitle}>Still watching?</div>
              <div style={s.modalSubtitle}>
                The video paused to check you're still there. Click to continue.
              </div>
              <button style={s.modalBtn} onClick={handleAttentionConfirm}>
                Yes, continue watching
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom controls */}
      <div style={s.controls}>
        <button style={s.btn} onClick={handlePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button style={{ ...s.btn, background: '#374151' }} onClick={handleRewind}>
          −10s
        </button>
        <div style={s.progressTrack}>
          <div style={{ ...s.progressFill, ...barColor, width: `${completionPct}%` }} />
        </div>
        <span style={s.completionPct}>{completionPct}%</span>
      </div>

      {videoComplete && (
        <div style={{ background: '#064e3b', color: '#6ee7b7', padding: '0.6rem 1rem', fontSize: '0.875rem', textAlign: 'center' }}>
          Video complete — scroll right to take the quiz.
        </div>
      )}
    </div>
  );
}
