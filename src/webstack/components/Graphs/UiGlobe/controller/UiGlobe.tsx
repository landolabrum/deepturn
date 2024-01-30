import React, { useCallback, useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import styles from './UiGlobe.scss';
import useWindow from '@webstack/hooks/useWindow';

const UiGlobe: React.FC = () => {
  const {width} = useWindow();
  const [x, setx]=useState(width);
  const [places, setPlaces] = useState([]);
  const globeRef = useRef<GlobeMethods | undefined>(undefined); // Update the ref type
  const containerRef = useRef<any | undefined>(undefined); // Update the ref type

  useEffect(() => {
    // Start auto-rotation
    const rotationInterval = setInterval(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.2; // adjust this value to slow down the rotation
      }
    }, 1000);

    const handleGlobeClick = () => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = false;
      }
    };

    // Cleanup the interval and event listeners in the cleanup function
    return () => {
      clearInterval(rotationInterval);
    };
  }, []);
const handleWidth =()=>{

  if(!containerRef.current)return;
  setx( containerRef.current.offsetWidth)
  // containerRef.current.offsetWidth
 };
  useEffect(() => {
    handleWidth();
  },[width])
  useEffect(() => {
    fetch('/data/ne_110m_populated_places_simple.geojson.json')
      .then((res) => res.json())
      .then(({ features }) => setPlaces(features));
  }, []);

 

  return (
    <>
      <style jsx>{styles}</style>
      <div ref={containerRef} className='globe'>
        <Globe
          ref={globeRef}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          labelsData={places}
          backgroundColor='#00000000'
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
