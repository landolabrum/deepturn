// UiGlobe.tsx
import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Globe, HtmlMarker } from './GlobeElements';
import styles from './UiGlobe.scss';

interface MarkerData {
  lat: number;
  lng: number;
  size: number;
  color: string;
}

const UiGlobe: React.FC = () => {
  const markerData: MarkerData[] = Array.from({ length: 30 }, (_, i) => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: 7 + Math.random() * 30,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
  }));

  return (
    <>
      <style jsx>{styles}</style>
      <div className='globe'>
        <h4>GLOBE</h4>
        <div className='globe__content'>
          <Canvas
            style={{ width: '100%', height: '600px' }}
            camera={{ position: [0, 0, 500] }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} />
            {markerData.map((marker, index) => (
              <HtmlMarker
                key={index}
                position={[marker.lat, marker.lng, 0]}
                size={marker.size}
                color={marker.color}
              />
            ))}
          </Canvas>
        </div>
      </div>
    </>
  );
};

export default UiGlobe;