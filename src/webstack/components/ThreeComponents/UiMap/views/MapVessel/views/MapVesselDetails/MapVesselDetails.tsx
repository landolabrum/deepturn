import styles from './MapVesselDetails.scss';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import useWindow from '@webstack/hooks/useWindow';
import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
import UiHeader from '@webstack/components/Header/views/UiHeader/UiHeader';

export type IVesselType = IVessel | false | undefined;

interface IVesselDetailsProps {
  vessel?: IVessel;
  setVessel: (vessel: IVesselType) => void;
  onResize?: (newSize: any) => void;
}

const CLOSE_BRK = 200;

const MapVesselDetails: React.FC<IVesselDetailsProps> = ({ vessel, setVessel, onResize }) => {
  const { width, height } = useWindow();
  const isDesktop = width >= 1100;
  const [isDragging, setIsDragging] = useState(false);
  const [swipedDown, setSwipedDown] = useState(false);
  const initialDimensions = isDesktop ? { width: 400, height: height } : { width: width - 30, height: 300 };
  const [dimensions, setDimensions] = useState<any>(initialDimensions);
  const vesselDetailsRef = useRef<any>(null);
  const vesselDetails = vesselDetailsRef?.current;

  const startY = useRef<number | null>(null);
  const currentY = useRef<number | null>(null);
  const translateY = useRef<number>(0);

  const closeVessel = useCallback(() => {
    if (vesselDetailsRef?.current?.style) vesselDetails.style = undefined;
    setDimensions(initialDimensions);
    setVessel(false);
  }, [setVessel, initialDimensions]);

  useEffect(() => {
    if (swipedDown) closeVessel();
  }, [swipedDown, closeVessel]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null) {
      currentY.current = e.touches[0].clientY;
      const isMobileDetailsArea = (Number(translateY.current) * -1) + (vesselDetails.offsetHeight / 2) < height / 2;
      translateY.current = currentY.current - startY.current;
      if (vesselDetails && isMobileDetailsArea) {
        vesselDetails.style.transform = `translateY(${translateY.current}px)`;
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (startY.current !== null && currentY.current !== null) {
      const deltaY = currentY.current - startY.current;
      if (deltaY > 50) {
        setSwipedDown(true);
      } else {
        if (vesselDetails) {
          vesselDetails.style.transform = 'translateY(0)';
        }
      }
    }
    startY.current = null;
    currentY.current = null;
    translateY.current = 0;
  };

  const handleMouseDown = () => setIsDragging(true);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    const newSize = isDesktop ? dimensions.width : dimensions.height;
    if (vesselDetails) {
      onResize?.(newSize);
      if (isDesktop) {
        vesselDetails.style.width = `${newSize}px`;
      } else {
        vesselDetails.style.height = `${newSize}px`;
      }
      if (newSize < CLOSE_BRK) closeVessel();
    }
  }, [dimensions, isDesktop, onResize, closeVessel]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (vesselDetails.style) vesselDetails.style = undefined;
    if (isDragging && vesselDetails) {
      if (isDesktop) {
        const newWidth = (width - 30) - e.clientX;
        if (newWidth > width / 2) return;
        setDimensions((prev: any) => ({ ...prev, width: newWidth }));
        vesselDetails.style.width = `${newWidth}px`;
        onResize?.(newWidth);
        if (newWidth < CLOSE_BRK) closeVessel();
        return;
      } else {
        const newHeight = height - e.clientY;
        if (newHeight > height / 2) return;
        setDimensions((prev: any) => ({ ...prev, height: newHeight }));
        vesselDetails.style.height = `${newHeight}px`;
        onResize?.(newHeight);
        if (newHeight < CLOSE_BRK) closeVessel();
      }
    }
  }, [isDragging, isDesktop, width, height, onResize, closeVessel]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!vessel) return null;

  const headerContext = (vesselName: string) => {
    const [title, subTitle] = vesselName.split(' ', 2);
    return {
      title,
      subTitle
    };
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div
        className={`vessel-details--container ${vessel ? 'show' : 'hide'}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={
          isDesktop ? 
          { width: dimensions.width, height: height }:
          { width: width == 0 ? 400 : undefined, height: dimensions.height }}
      >
        <div className="vessel-details" ref={vesselDetailsRef}>
          <div
            className={`vessel-details-sliver ${isDragging ? 'dragging' : ''}`}
            onMouseDown={handleMouseDown}
          />
          {vessel?.name && (
            <div className={`vessel-details-content ${isDragging ? 'dragging' : ''}`}>
              <div className='vessel-details-content--header'>
                <UiHeader {...headerContext(vessel.name)} />
              </div>
              <div className='vessel-details-content--body'>
                <div className='vessel-details--images'>
                  {vessel.images && vessel.images.map((src: string, index: number) => (
                    <img src={src} key={index} alt='main' className={`vessel-details--image${index === 0 ? '-main' : ''}`} />
                  ))}
                </div>
                {vessel.description && <div className='vessel-details-content--body-description'>{vessel.description}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MapVesselDetails;
