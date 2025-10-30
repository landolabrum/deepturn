import styles from './MapVesselDetails.scss';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import useWindow from '@webstack/hooks/window/useWindow';
import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
import UiHeader from '@webstack/components/Containers/Header/views/UiHeader/UiHeader';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import { useHeader } from '@webstack/components/Containers/Header/controller/MainHeader';
import { head } from 'lodash';
import UiWeather from '@webstack/components/Widgets/Weather/UiWeather';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';


export type IVesselType = IVessel | false | undefined;

interface IVesselDetailsProps {
  vessel?: IVessel;
  setVessel: (vessel: IVesselType) => void;
  closeVessel?:(e:any)=>void;
  onResize?: (delta:number) => void;
}

const MapVesselDetails: React.FC<IVesselDetailsProps> = ({ vessel,  onResize,closeVessel }) => {
  const { height: viewportHeight } = useWindow();
  const containerRef = useRef<HTMLDivElement>(null);
  const [drawerHeight, setDrawerHeight] = useState(0);
  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(drawerHeight);
  const animationFrame = useRef<number | null>(null);
  const initialDrawerHeight= viewportHeight * 0.33;
  


  const handleMove = useCallback((clientY: number) => {
    if (startY.current === null) return;
    const delta = startY.current - clientY;
    const newHeight = Math.min(Math.max(100, startHeight.current + delta), viewportHeight);
    // console.log(delta)
    onResize?.(delta);

    setDrawerHeight(newHeight);
  }, [ viewportHeight]);

  const onMouseMove = (e: MouseEvent) => {
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(() => handleMove(e.clientY));
  };

  const onTouchMove = (e: TouchEvent) => {
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(() => handleMove(e.touches[0].clientY));
  };

  const stopDrag = (lastSize:any) => {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', stopDrag);

    // onResize?.(drawerHeight,lastSize);
    startY.current = null;
  };

  const onStartDrag = (clientY: number) => {
    const lastY = clientY;
    startY.current = clientY;
    startHeight.current = drawerHeight;
    document.addEventListener('mousemove',  onMouseMove);
    document.addEventListener('mouseup', ()=>stopDrag(lastY)); 
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('touchend', ()=>stopDrag(lastY));
  };

  const handleMouseDown = (e: React.MouseEvent) => onStartDrag(e.clientY);
  const handleTouchStart = (e: React.TouchEvent) => onStartDrag(e.touches[0].clientY);

const init = () =>{
  if(viewportHeight&&viewportHeight!=initialDrawerHeight) setDrawerHeight(initialDrawerHeight)
}
  useEffect(init,[viewportHeight,vessel]);
  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [drawerHeight]);

  
  const headerContext = (vesselName: string) => {
    const [title, subTitle] = vesselName.split(' ', 2);
    return { title, subTitle };
  };
  
  if (!vessel||!drawerHeight) return null;
  return (
    <>
      <style jsx>{styles}</style>
      <div
        className="vessel-details"
        ref={containerRef}
        style={{ height: `${drawerHeight}px` }}
      >
        <div
          className="vessel-details-sliver"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          Slide to resize
        </div>
        {vessel?.name && (
          <div className="vessel-details-content">
            <div className="vessel-details-content--header">
              <div>{vessel.name}</div>
              <div className='d-flex align-start justify-start' >

              <UiWeather lngLat={vessel.lngLat}/>
            <UiButton variant="flat" onClick={closeVessel} size="sm">close</UiButton>
            </div>

            </div>
            {vessel.description}
            {String(vessel?.name)?.includes("lando")&&   <UiMedia variant="cover" src={`https://tiktok.soy/api/stream/rtsp?id=bb`} alt="thumbnail" />}

          </div>
        )}
      </div>
    </>
  );
};

export default MapVesselDetails;
