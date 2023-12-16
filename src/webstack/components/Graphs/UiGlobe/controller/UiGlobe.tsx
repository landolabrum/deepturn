import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import styles from './UiGlobe.scss';
import useWindow from '@webstack/hooks/useWindow';

const UiGlobe: React.FC = () => {
  const size = useWindow();
  const [places, setPlaces] = useState([]);
  const [xy, setXy] = useState([0, 0]);
  const globeEl = useRef<GlobeMethods | undefined>(undefined); // Update the ref type

  useEffect(() => {
    // Start auto-rotation
    const rotationInterval = setInterval(() => {
      if (globeEl.current) {
        globeEl.current.controls().autoRotate = true;
        globeEl.current.controls().autoRotateSpeed = 0.2; // adjust this value to slow down the rotation
      }
    }, 1000);

    const handleGlobeClick = () => {
      if (globeEl.current) {
        globeEl.current.controls().autoRotate = false;
      }
    };

    // Cleanup the interval and event listeners in the cleanup function
    return () => {
      clearInterval(rotationInterval);
    };
  }, []);

  const globeSize = () => {
    const isPortrait: any = size.width < size.height;
    const isMobile: any = size.width < 900;
    let x:number = size.width;
    let y:number = size.height;

    if(isPortrait && isMobile)setXy([x, Math.trunc(y * .5)]);
    else if(!isPortrait && isMobile)setXy([Math.trunc(x), Math.trunc(x)]);
    else if(isPortrait && !isMobile)setXy([Math.trunc(x - 400), Math.trunc(x - 100)]);
    else if(!isPortrait && !isMobile)setXy([Math.trunc(x - 400), Math.trunc(y - 100)]);
        
  }
  useEffect(() => {
    globeSize();
  }, [size, setXy])
  useEffect(() => {
    // load data
    fetch('/data/ne_110m_populated_places_simple.geojson.json')
      .then(res => res.json())
      .then(({ features }) => setPlaces(features));
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      {/* {JSON.stringify(places)} */}
      <div className='globe'>
        <Globe
          ref={globeEl}
          width={xy[0]}
          // width={size?.width < 900? size?.width : size?.width - 400}
          height={xy[1]}
          // height={size?.width < 900? size?.height * .7 : size?.height * .8}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          labelsData={places}
          backgroundColor='#ffffff00'
          labelLat={(d: any) => d.properties.latitude}
          labelLng={(d: any) => d.properties.longitude}
          labelText={(d: any) => d.properties.name}
          labelSize={(d: any) => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelDotRadius={(d: any) => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelColor={() => '#f30'}
          labelResolution={2}
          showAtmosphere={false}
        />
      </div>
    </>
  );
};

export default UiGlobe;
