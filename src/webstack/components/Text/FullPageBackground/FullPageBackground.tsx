import React, { useEffect, useRef, useState } from 'react';
import styles from './FullPageBackground.scss';
import useWindow from '@webstack/hooks/window/useWindow';
import Image from 'next/image';

interface MediaConfig {
  url: string;
  type?: 'image' | 'video' | 'youtube';
  playbackSpeed?: number;
  loop?: boolean;
}

interface TextConfig {
  content?: React.ReactNode;
  size?: string;
  position?: { top?: string; left?: string; bottom?: string; right?: string; };
  color?: string;
  fontWeight?: string;
  textTransform?: string;
  textAlign?: string;
  [key: string]: any;
}

interface Props {
  media: MediaConfig;
  text?: TextConfig;
  btn?: { text: React.ReactNode; onClick?: () => void };
}

const FullPageBackground: React.FC<Props> = ({ media, text, btn }) => {
  const { width } = useWindow();
  const [textStyles, setTextStyles] = useState<Record<string, any>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
 
  useEffect(() => {
    if (media.type === 'video' && videoRef.current && media.playbackSpeed) {
      videoRef.current.playbackRate = media.playbackSpeed;
    }
  }, [media.type, media.playbackSpeed]);

  useEffect(() => {
    if (!text) return;
    const base = Math.max(14, (width / 100) * 5);
    const fontSize = text.size || `${base}px`;
    const iconSize = text.size || `${base}px`;
    setTextStyles({
      fontSize,
      '--ui-icon-width': iconSize,
      fontWeight: text.fontWeight || 'bold',
      textTransform: text.textTransform || 'none',
      textAlign: text.textAlign || 'center',
      width: '100%',
      ...text,
    });
  }, [width, text]);

  const isYouTubeEmbed = (url: string) =>
    url.includes('youtube.com') || url.includes('youtu.be');

  const renderMedia = () => {
    if (media.type === 'youtube' && isYouTubeEmbed(media.url)) {
      const id = media.url.split('/').pop();
      const embedUrl = media.url.includes('embed')
        ? media.url
        : `https://www.youtube.com/embed/${id}?controls=0&autoplay=1&mute=1&loop=1&modestbranding=1&playlist=${id}`;
      return (
        <>
          <style jsx>{styles}</style>
          <iframe
            className="clip-text-video__youtube"
            src={embedUrl}
            title="YouTube Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </>
      );
    }

    if (media.type === 'video') {
      return (
        <>
          <style jsx>{styles}</style>
          <video
            ref={videoRef}
            className="clip-text-video__video"
            autoPlay
            loop={media?.loop ?? true}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={() => {}}
            onCanPlay={() => {}}
            onError={(e) => {
              const err = (e.target as HTMLVideoElement).error;
              console.error('[FullPageBackground] video error', err);
            }}
          >
            <source src={media.url} type="video/webm" />
          </video>
        </>
      );
    }

    return (
      <>
        <style jsx>{styles}</style>
      <Image
  src={media.url}
  alt="background"
  className="clip-text-video__image"
  fill
  priority       // ✅ preloads at high priority
  sizes="100vw"
/>
      </>
    );
  };
if(!media)return'no media';
  return (
    <>
      <style jsx>{styles}</style>
      <section className="clip-text-video">
        {renderMedia()}

        {(text?.content || btn) && (
          <div className="clip-text-video__text">
            {text?.content && (
              <span className="clip-text-video__mask" style={textStyles}>
                {text.content}
              </span>
            )}

            {btn && (
              <div className="clip-text-video__text--action" style={{ ...textStyles, width: "auto" }}>
                <div
                  className="clip-text-video__text--action--button"
                  onClick={btn.onClick}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' ? btn.onClick?.() : null)}
                >
                  {btn.text || 'Click here'}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default FullPageBackground;
