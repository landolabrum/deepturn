import React from 'react';
import styles from './OverlayHud.scss';

interface OverlayHudProps {
  gpsData?: {
    lat?: number;
    lon?: number;
    timestamp?: string;
    [key: string]: any;
  };
}

const OverlayHud: React.FC<OverlayHudProps> = ({ gpsData }) => {
  return (
    <>
      <style jsx>{styles}</style>
      <div className="-overlay-hud">
        {gpsData ? (
          <>
            <div className="-overlay-hud__title">HUD DATA</div>
            <div className="-overlay-hud__coords">
              <span>Lat:</span> {gpsData.lat?.toFixed(6)} <br />
              <span>Lon:</span> {gpsData.lon?.toFixed(6)} <br />
              <span>Time:</span> {gpsData.timestamp}
            </div>
          </>
        ) : (
          <div className="-overlay-hud__empty">No GPS Data</div>
        )}
      </div>
    </>
  );
};

export default OverlayHud;
