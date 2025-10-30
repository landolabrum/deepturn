
import React, { useEffect, useMemo, useState } from 'react';
import styles from './XInsurance.scss';
import FullPageBackground from '@webstack/components/Text/FullPageBackground/FullPageBackground';

const XInsurance: React.FC = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const handler = () => setReduced(!!m?.matches);
    handler();
    m?.addEventListener?.('change', handler);
    return () => m?.removeEventListener?.('change', handler);
  }, []);

  const media = useMemo(
    () =>
      reduced
        ? { type: 'video' as const, url: 'https://tiktok.soy/files/srv/xi1/backgrounds/md500-HD.webm', playbackSpeed: 1.0, loop: true }
        : { type: 'video' as const, url: 'https://tiktok.soy/files/srv/xi1/backgrounds/md500-HD.webm', playbackSpeed: 0.5, loop: true },
    [reduced]
  );

  const mediaKey = `${media.url}:${media.playbackSpeed}`;

  return (
    <>
      <style jsx>{styles}</style>
      <div className="xinsurance">
        {/* fixed, behind everything */}
        <div className="xinsurance__bg">
          <FullPageBackground key={mediaKey} media={media} />
        </div>

        {/* put your page content here */}
        <div className="xinsurance__content">
          {/* …CTA / sections if needed… */}
        </div>
      </div>
    </>
  );
};

export default XInsurance;
