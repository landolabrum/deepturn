// src/modules/stream/views/overlays/WindowCaptureOverlay/WindowCaptureOverlay.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useModal } from '@webstack/components/Containers/modal/contexts/modalContext';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';

type WindowCaptureOverlayProps = {
  /** Overlay identity (optional, useful if you wire it to your store) */
  overlayId?: string;

  /** Positioning within the 1920×1080 design space (percentages) */
  xPct?: number;           // 0–100
  yPct?: number;           // 0–100
  widthPct?: number;       // 0–100 (video box width)
  zIndex?: number;

  /** Visual tweaks */
  borderRadiusPx?: number;
  muted?: boolean;         // default true (browsers block autoplay with audio)
  mirror?: boolean;        // CSS scaleX(-1)

  /** Callbacks so you can persist/reflect state elsewhere if needed */
  onStart?: (stream: MediaStream) => void;
  onStop?: () => void;
  onError?: (err: unknown) => void;

  /** Optional: start immediately (will still trigger browser picker) */
  autoStart?: boolean;

  /** Optional constraints */
  systemAudio?: boolean;   // include system audio
  frameRate?: number;      // desired frame rate
};

const DESIGN_W = 1920;
const DESIGN_H = 1080;

const pctClamp = (n?: number) => Math.max(0, Math.min(100, Number.isFinite(n ?? 0) ? (n as number) : 0));

const WindowCaptureOverlay: React.FC<WindowCaptureOverlayProps> = ({
  overlayId,
  xPct = 5,
  yPct = 5,
  widthPct = 40,
  zIndex = 999,
  borderRadiusPx = 10,
  muted = true,
  mirror = false,
  onStart,
  onStop,
  onError,
  autoStart = false,
  systemAudio = false,
  frameRate = 30,
}) => {
  const { openModal, closeModal } = useModal();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const leftPx = useMemo(() => (pctClamp(xPct) / 100) * DESIGN_W, [xPct]);
  const topPx  = useMemo(() => (pctClamp(yPct) / 100) * DESIGN_H, [yPct]);
  const width  = useMemo(() => pctClamp(widthPct), [widthPct]);

  const cleanup = useCallback(() => {
    try {
      stream?.getTracks().forEach(t => t.stop());
    } catch {}
    setStream(null);
    setActive(false);
  }, [stream]);

  // ensure we stop on unmount
  useEffect(() => () => cleanup(), [cleanup]);

  // attach stream to <video>
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (stream) {
      try {
        v.srcObject = stream;
        v.muted = muted;
        v.play().catch(() => {/* ignore autoplay issues if user gesture missing */});
      } catch {}
    } else {
      v.srcObject = null as any;
    }
  }, [stream, muted]);

  // Handle “track ended” (user pressed “Stop sharing” in browser UI)
  useEffect(() => {
    if (!stream) return;
    const onEnded = () => {
      cleanup();
      onStop?.();
    };
    stream.getVideoTracks().forEach(t => t.addEventListener('ended', onEnded));
    stream.getAudioTracks().forEach(t => t.addEventListener('ended', onEnded));
    return () => {
      stream.getVideoTracks().forEach(t => t.removeEventListener('ended', onEnded));
      stream.getAudioTracks().forEach(t => t.removeEventListener('ended', onEnded));
    };
  }, [stream, cleanup, onStop]);

  const getConstraints = useCallback((): DisplayMediaStreamOptions => {
    // Note: actual surface selection is controlled by the browser picker.
    return {
      video: {
        frameRate,
        displaySurface: 'monitor', // hint only; browser decides
        cursor: 'always',
      } as MediaTrackConstraints,
      audio: systemAudio
        ? { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        : false,
    };
  }, [frameRate, systemAudio]);

  const startCapture = useCallback(async () => {
    try {
      setBusy(true);
      const constraints = getConstraints();
      const s = await (navigator.mediaDevices as any).getDisplayMedia(constraints);
      setStream(s);
      setActive(true);
      onStart?.(s);
    } catch (err) {
      onError?.(err);
    } finally {
      setBusy(false);
    }
  }, [getConstraints, onStart, onError]);

  const stopCapture = useCallback(() => {
    cleanup();
    onStop?.();
  }, [cleanup, onStop]);

  const openPickerModal = useCallback(() => {
    openModal({
      title: 'Share a window or screen',
      // Re-use your modal system’s confirm block layout
      confirm: {
        statements: [
          {
            label: active ? 'Replace Source' : 'Share Screen',
            variant: 'glow',
            onClick: async () => {
              await startCapture();
            },
          },
          ...(active
            ? [{
                label: 'Stop Sharing',
                variant: 'danger',
                onClick: () => stopCapture(),
              }]
            : []),
          {
            label: 'Close',
            variant: 'flat',
            onClick: () => closeModal(),
          },
        ],
      },
      children: (
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ fontSize: 14, opacity: 0.8 }}>
            Click <b>{active ? 'Replace Source' : 'Share Screen'}</b> then select a tab/window or a screen in your browser prompt.
          </div>

          <div
            style={{
              background: 'var(--gray-90)',
              borderRadius: 10,
              padding: 8,
              border: '1px solid var(--gray-70)',
            }}
          >
            <div style={{ fontSize: 12, marginBottom: 6, opacity: 0.75 }}>Live preview</div>
            <div style={{
              position: 'relative',
              width: '100%',
              paddingTop: '56.25%', // 16:9 preview box
              overflow: 'hidden',
              borderRadius: 6,
              background: 'black',
            }}>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted={muted}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transform: mirror ? 'scaleX(-1)' : undefined,
                }}
              />
              {!stream && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--gray-30)',
                  fontSize: 13,
                }}>
                  {busy ? 'Waiting for browser picker…' : 'No source selected'}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <UiButton
              onClick={() => startCapture()}
              disabled={busy}
              traits={{ afterIcon: busy ? 'fa-spinner fa-spin' : 'fa-display' }}
              variant="glow"
            >
              {active ? 'Replace Source' : 'Share Screen'}
            </UiButton>

            {active && (
              <UiButton
                onClick={stopCapture}
                variant="danger"
                traits={{ afterIcon: 'fa-stop' }}
              >
                Stop Sharing
              </UiButton>
            )}
          </div>
        </div>
      ),
    });
  }, [openModal, closeModal, active, busy, startCapture, stopCapture, muted, mirror]);

  // Optional: auto-open on mount if autoStart=true
  useEffect(() => {
    if (autoStart) openPickerModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // Absolute overlay box rendered on top of your canvas
  const overlayBoxStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${leftPx}px`,
    top: `${topPx}px`,
    width: `${(width / 100) * DESIGN_W}px`,
    // Height will follow incoming track aspect (via objectFit: 'cover'), but we keep the box 16:9 by default:
    height: `${((width / 100) * DESIGN_W) * (9 / 16)}px`,
    borderRadius: borderRadiusPx,
    overflow: 'hidden',
    zIndex,
    boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
    pointerEvents: 'none', // overlay should not steal clicks from control UI
  };

  return (
    <>
      {/* Control button (you can place this elsewhere) */}
      <div style={{ position: 'absolute', left: 8, top: 8, zIndex: zIndex + 1, pointerEvents: 'auto' }}>
        <UiButton
          variant={active ? 'ghost' : 'glow'}
          onClick={openPickerModal}
          traits={{ afterIcon: active ? 'fa-pen-to-square' : 'fa-display' }}
        >
          {active ? 'Change Source' : 'Share Screen'}
        </UiButton>
      </div>

      {/* The overlay video */}
      {stream && (
        <div style={overlayBoxStyle} data-overlay-id={overlayId || 'window-capture'}>
          {/* A dedicated hidden video element to drive the overlay (separate from the modal preview). */}
          <video
            playsInline
            autoPlay
            muted={muted}
            ref={(el) => {
              if (!el || !stream) return;
              // attach stream
              (el as any).srcObject = stream;
              el.play().catch(() => {});
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: mirror ? 'scaleX(-1)' : undefined,
            }}
          />
        </div>
      )}
    </>
  );
};

export default WindowCaptureOverlay;
