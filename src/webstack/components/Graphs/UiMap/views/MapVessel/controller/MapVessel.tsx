import React from 'react';
import styles from './MapVessel.scss';
import { IVessel } from '../../../models/IMapVessel';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import Image from 'next/image';

interface IMapVessel {
  vessel?: IVessel;
  onMouseEnter?: (vessel: IVessel) => void;
  onMouseLeave?: (vessel: IVessel) => void;
  onClick?: (vessel: IVessel) => void;
}

const MapVessel: React.FC<IMapVessel> = (props) => {
  const { vessel, onClick, onMouseEnter, onMouseLeave } = props;
  if (!vessel) return null;

  const handleAction = (action: "click" | "enter" | "leave") => {
    switch (action) {
      case "click":
        // console.log("[ ONCLICK VESSEL ]",{
        //   ...props
        // })
        onClick && onClick(vessel);
        break;
      case "enter":
        onMouseEnter && onMouseEnter(vessel);
        break;
      case "leave":
        onMouseLeave && onMouseLeave(vessel);
        break;
      default:
        break;
    }
  };

  
  const isUser = vessel?.className == 'user';
  return (
    <>
      <style jsx>{styles}</style>
      <div
        onMouseEnter={() => handleAction('enter')}
        onMouseLeave={() => handleAction('leave')}
        onClick={() => handleAction('click')}
        className={`vessel ${vessel?.className ? vessel.className + '-vessel' : ''}`}
      >
        <div className="vessel-icon">
          <UiIcon glow={isUser} icon={isUser ? 'fal-circle-user' : 'fa-location-dot'} />
        </div>

        <div className="vessel__prologue" >
          <div className='prologue'>
            <div className='prologue-header'>
              <h4>{vessel?.name}</h4>
            </div>
            {/* <div className='prologue-description'>
              <p>{vessel?.description}</p>
            </div> */}

            {vessel?.images && <div className='prologue-image'>
              <Image fill src={vessel.images[0]} alt="" />
            </div>
            }

          </div>
        </div>
      </div>

    </>
  );
};

export default MapVessel;
