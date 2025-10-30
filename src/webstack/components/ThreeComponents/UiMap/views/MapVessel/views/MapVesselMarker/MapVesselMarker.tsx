import React from 'react';
import { IVessel } from '../../../../models/IMapVessel';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';

interface IMapVessel {
  vessel?: IVessel & { hover?: React.ReactNode };
  hideHover?: boolean;
  onMouseEnter?: (vessel: IVessel) => void;
  onMouseLeave?: (vessel: IVessel) => void;
  onClick?: (vessel: IVessel) => void;
}

const MapVesselMarker: React.FC<IMapVessel> = ({
  vessel,
  hideHover = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  if (!vessel) return null;

  const initialVesselClass = `vsl ${vessel.className ? vessel.className + '-mrkr' : ''}`;
  const isUser = vessel.className === 'user';
  let hoverTimeout: number | undefined;

  const handleAction = (action: 'click' | 'enter' | 'leave') => {
    const el = document.getElementById(`vsl-${vessel.id}`);
    if (!el) return;

    if (action === 'click') {
      onClick?.(vessel);
    } else if (action === 'enter') {
      if (!hideHover) el.classList.add('vsl-mrkr--hover');
      onMouseEnter?.(vessel);
    } else if (action === 'leave') {
      // Clear any pending resets to avoid flicker cascades
      if (hoverTimeout) window.clearTimeout(hoverTimeout);
      hoverTimeout = window.setTimeout(() => {
        el.className = 'vsl-mrkr';
        onMouseLeave?.(vessel);
      }, 250); // tighter than 2000ms to reduce "stuck hover" feel
    }
  };

  return (
    <div
      onMouseEnter={() => handleAction('enter')}
      onClick={() => handleAction('click')}
      className={initialVesselClass}
      onMouseLeave={() => handleAction('leave')}
    >
      <div className="vsl-icon">
        <UiIcon glow={isUser} icon={isUser ? 'fal-circle-user' : 'fa-location-dot'} />
      </div>

      <div id={`vsl-${vessel.id}`} className="vsl-mrkr">
        <div className="vsl-mrkr--content">
          {vessel.hover ?? (
            <div className="vsl-mrkr--content-header">
              <div className='dev'>{vessel.name}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapVesselMarker;
