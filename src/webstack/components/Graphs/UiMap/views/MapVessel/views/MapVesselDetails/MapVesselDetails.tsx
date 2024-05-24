import styles from './MapVesselDetails.scss';
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { IVessel } from "@webstack/components/Graphs/UiMap/models/IMapVessel";
import React, { useState, useEffect, useRef } from "react";

export type IVesselType = IVessel | false | undefined;

interface IVesselDetails {
  vessel: IVesselType;
  setVessel: (vessel: IVesselType) => void;
}

const MapVesselDetails: React.FC<IVesselDetails> = ({ vessel, setVessel }) => {
  const closeVessel = () => setVessel(false);

  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);
  const [swipedDown, setSwipedDown] = useState(false);
  const vesselDetailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (swipedDown) {
      closeVessel();
    }
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      setCurrentY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (startY !== null && currentY !== null && startY < currentY) {
      const deltaY = currentY - startY;
      if (deltaY > 50) { // Adjust threshold as needed
        setSwipedDown(true);
      }
    }
    setStartY(null);
    setCurrentY(null);
  };

  if (vessel === null || vessel === undefined) return null;

  return (
    <>
      <style jsx>{styles}</style>
      <div
        className={`vessel-details ${vessel === false ? 'hide' : 'show'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={vesselDetailsRef}
      >
        <div className='vessel-details__close'>
        </div>
        <div className='globe'>
          <UiIcon onClick={closeVessel} icon='fa-globe' />
        </div>
        <div className='vessel-details--content'>
          {vessel !== false && (
            <>
              <div className='vessel-details__header'>
                <div className='vessel-details__header--title'>
                  {vessel.name}
                </div>
              </div>
              <div className='vessel-details__body'>
                {vessel.images && <img src={vessel.images[0]} alt='main' className='vessel-image-main' />}
                {vessel.description && <div className='vessel-description'>{vessel.description}</div>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MapVesselDetails;
