import { useEffect, useRef, useState } from 'react';
import styles from './UiMedia.scss';
import ImageControl, { IImageMediaType, IImageVariant } from '../ImageControl/ImageControl';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import useWindow from '@webstack/hooks/window/useWindow';

export interface IMedia {
  src: string;
  alt?: string;
  variant?: IImageVariant;
  onLoad?: (e: any) => void;
    onClick?: (e: any) => void;
  type?: IImageMediaType;
  loadingText?: string;
  rotate?: number;
  autoplay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string | React.ReactNode;
  preload?: 'auto' | 'metadata' | 'none';
  width?: number;
  height?: number;
  playbackSpeed?: number;
  children?: any;
  style?: any;
  headers?: Record<string, string>; // <-- added
}

const UiMedia: React.FC<IMedia> = ({
  src,
  variant,
  type = 'image',
  alt,
  style,
  loadingText,
  rotate,
  onLoad,
  autoplay,
  controls,
  loop,
  muted,
  poster,
  preload = 'auto',
  width,
  height,
  playbackSpeed = 1,
  children,
  headers,
  onClick
}) => {
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(!!autoplay);
  const [resolvedSrc, setResolvedSrc] = useState<string>(src);

  const mediaRef = useRef<HTMLImageElement | HTMLVideoElement | HTMLIFrameElement | null>(null);
  const window = useWindow();
  const blobUrlRef = useRef<string | null>(null);
const handleClick = (e:any)=>{
onClick?.(e)
}
  const handleReload = () => {
    setHasError(false);
    setIsLoading(true);
    setReloadTrigger((prev) => prev + 1);
  };



  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(e);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const togglePlay = () => {
    if (type === 'video' && mediaRef.current) {
      const videoEl = mediaRef.current as HTMLVideoElement;
      if (videoEl.paused) {
        videoEl.play();
        setIsPlaying(true);
      } else {
        videoEl.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle fetching image when headers are provided
  useEffect(() => {
    if (type !== 'image') return;
    let aborted = false;
    const controller = new AbortController();

    const loadWithHeaders = async () => {
      if (!headers) {
        setResolvedSrc(src);
        return;
      }
      try {
        setIsLoading(true);
        setHasError(false);
        // cleanup previous blob
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }

        const resp = await fetch(src, {
          method: 'GET',
          headers: { ...headers },
          signal: controller.signal,
        });
        if (!resp.ok) {
          throw new Error(`Status ${resp.status}`);
        }
        const blob = await resp.blob();
        if (aborted) return;
        const objectUrl = URL.createObjectURL(blob);
        blobUrlRef.current = objectUrl;
        setResolvedSrc(objectUrl);
        setIsLoading(false);
      } catch (err) {
        if (aborted) return;
        console.warn('UiMedia image fetch failed:', err);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadWithHeaders();

    return () => {
      aborted = true;
      controller.abort();
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [ headers, reloadTrigger, type,src]);

// inside UiMedia: when type === 'video' and src endsWith('.m3u8')
useEffect(() => {
  if (type !== 'video' || !mediaRef.current) return;
  if (!src.endsWith('.m3u8')) return;

  const video = mediaRef.current as HTMLVideoElement;
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src;
  } else {
    // lazy load hls.js or import it
    import('hls.js').then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    });
  }
}, [src, type]);


  useEffect(() => {
    if (mediaRef.current) {
      if (rotate) {
        mediaRef.current.style.transform = `rotate(${rotate}deg)`;
      } else {
        mediaRef.current.style.transform = '';
      }
      if (height) {
        mediaRef.current.style.height = `${height}px`;
      }
      if (variant) {
        mediaRef.current.classList.add(`ui-media--${variant}`);
        if (variant === 'background') {
          const shadowHeight = window.height - mediaRef.current.offsetHeight;
          if (shadowHeight > 0) {
            mediaRef.current.style.boxShadow = `0 0 ${shadowHeight}px ${shadowHeight * 0.5}px var(--gray-80-o)`;
          }
        }
      }
    }
  }, [rotate, height, variant, window.height, resolvedSrc, reloadTrigger]);

  useEffect(() => {
    if (type === 'iframe' && mediaRef.current) {
      const iframe = mediaRef.current as HTMLIFrameElement;
      iframe.style.visibility = isLoading ? 'hidden' : 'visible';
    }
  }, [isLoading, type]);
const wrapText = (text: string, maxWidth: number, fontSize: number) => {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length * (fontSize * 0.6) < maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
};
  const stringPoster = typeof poster === 'string' ? poster : '';
      const containerWidth = mediaRef.current?.parentElement?.offsetWidth || 1000;
      const fontSize = Math.max(24, Math.min(72, containerWidth / 12));
      const lines = wrapText(alt || 'Product', containerWidth * 0.9, fontSize);
      const totalHeight = lines.length * fontSize * 1.2;
      const startY = (500 - totalHeight) / 2 + fontSize;
  return (
    <>
      <style jsx>{styles}</style>
      <ImageControl
      onClick={handleClick}
      isPlaying={isPlaying}
        mediaType={type}
        onComplete={() => setIsLoading(false)}
        onPlayPauseClick={togglePlay}
        showPlayPause={type === 'video'}
      >
        {isLoading && !hasError && <div className="loading">{loadingText || 'Loading...'}</div>}

        {hasError &&  <div
      className="ui-media__error"
      // style={{ color: '#f90', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5em' }}
    >
      <span>{loadingText ? `${loadingText}, Failed` : 'Loading failed'}</span>
      <UiIcon icon="fa-arrows-rotate" onClick={handleReload} />
    </div>}

        {!hasError && type === 'video' && (
          <video
            ref={mediaRef as React.Ref<HTMLVideoElement>}
            src={src}
            autoPlay={autoplay}
            controls={controls ?? false}
            loop={loop}
            muted={muted}
            poster={stringPoster}
            preload={preload}
            width={width}
            height={height}
            onLoadStart={() => {
              setIsLoading(true);
              setHasError(false);
            }}
            onCanPlayThrough={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            key={reloadTrigger}
            className="ui-media"
          />
        )}

        {!hasError && type === 'iframe' && (
          <div className="ui-media__iframe-wrapper">
            <iframe
              ref={mediaRef as React.Ref<HTMLIFrameElement>}
              src={src}
              width={width || '100%'}
              height={height || 360}
              title={alt || 'iframe'}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              key={reloadTrigger}
              className="ui-media__iframe"
              style={style || { border: 'none', visibility: isLoading ? 'hidden' : 'visible' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {isLoading && <div className="loading">{loadingText || 'Loading iframe...'}</div>}
          </div>
        )}

        {!hasError && type === 'image' && (
          variant === 'knockout' ? (
                 <svg
          className="ui-media ui-media--knockout"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id={`mask-${resolvedSrc}`} x="0" y="0" width="100%" height="100%">
              <rect className="rect" width="100%" height="100%" />
              {lines.map((line, i) => (
                <text
                  key={i}
                  x="50%"
                  y={startY + i * fontSize * 1.2}
                  fontSize={fontSize}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {line}
                </text>
              ))}
            </mask>
          </defs>
          <image
            href={resolvedSrc}
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
          />
          <rect width="100%" height="100%" mask={`url(#mask-${resolvedSrc})`} />
        </svg>
          ) : (
            <img
              ref={mediaRef as React.Ref<HTMLImageElement>}
              src={resolvedSrc}
              alt={alt}
              onLoad={handleImageLoad}
              onError={handleImageError}
              key={reloadTrigger}
              width={width}
              height={height}
              className="ui-media"
              style={style}
            />
          )
        )}

        {children && (
          <div className={`ui-media__children ${variant ? `ui-media__children--${variant}` : ''}`}>
            {children}
          </div>
        )}
      </ImageControl>
    </>
  );
};

export default UiMedia;
