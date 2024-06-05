import React, { useEffect, useState } from 'react';
import { IVessel } from '../../../../models/IMapVessel';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import Image from 'next/image';
import useMouse from '@webstack/hooks/interfaces/useMouse/useMouse';

interface IMapVessel {
  vessel?: IVessel;
  hideHover?: boolean;
  onMouseEnter?: (vessel: IVessel) => void;
  onMouseLeave?: (vessel: IVessel) => void;
  onClick?: (vessel: IVessel) => void;
}

const MapVesselMarker: React.FC<IMapVessel> = (props) => {
  const { vessel, onClick, onMouseEnter, onMouseLeave, hideHover = false } = props;
  const initialVesselClass = `vsl ${vessel?.className ? vessel.className + '-mrkr' : ''}`;

  if (!vessel) return null;

  const handleAction = (action: "click" | "enter" | "leave") => {
    const cur = document.getElementById(`vsl-${vessel.id}`)
    if(!cur)return;
    if(action === 'click'){
      onClick && onClick(vessel);
    }
    else if(action === 'enter'){
      !hideHover && cur?.classList.add('vsl-mrkr--hover');
      onMouseEnter && onMouseEnter(vessel);
    }
    else if(action === 'leave'){
      setTimeout(() => {
        cur.className = "vsl-mrkr";
        onMouseLeave && onMouseLeave(vessel);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  };
  const isUser = vessel?.className == 'user';
  return (
    <>
      <div
        onMouseEnter={() =>  handleAction('enter')}
        onClick={() => handleAction('click')}
        className={initialVesselClass}
      >
        <div className="vsl-icon">
          <UiIcon glow={isUser} icon={isUser ? 'fal-circle-user' : 'fa-location-dot'} />
        </div>

        <div  
        id={`vsl-${vessel.id}`}
        onMouseLeave={() => handleAction('leave')}
        className="vsl-mrkr">
          <div className={`vsl-mrkr--content`}>
            <div className='vsl-mrkr--content-header'>
              <h4>{vessel?.name}</h4>
              {/* {JSON.stringify(vessel)} */}
            </div>
            {vessel?.images && (
              <div className='vsl-mrkr--content-image'>
                <Image fill src={vessel.images[0]} alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MapVesselMarker;
