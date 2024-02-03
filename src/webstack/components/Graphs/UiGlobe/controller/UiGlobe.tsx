import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import styles from './UiGlobe.scss';
import useWindow from '@webstack/hooks/useWindow';
import UiSelect from '@webstack/components/UiSelect/UiSelect';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
type IGlobeLocation = {
  name: string;
  latitude: number;
  longitude: number;
  size: number;
}
interface IGlobe {
  pointSize: number;
  locations: IGlobeLocation[]
}
const UiGlobe: React.FC<any> = ({ locations, pointSize = 0.5 }: IGlobe) => {
  const layerOptions: string[] = [
    "earth-blue-marble",
    "earth-dark",
    "earth-day",
    "earth-night",
    // 'earth-water',
    // 'night-sky'
  ];
  const { width } = useWindow();
  const [layer, setLayer] = useState(layerOptions[0])
  const [places, setPlaces] = useState<IGlobeLocation[]>([
    {
      name: "Holladay",
      latitude: 40.65654718559953,
      longitude: -111.81447097331733,
      size: 1,
    }
  ]);
  const globeRef = useRef<any | undefined>(undefined); // Update the ref type
  const containerRef = useRef<any | undefined>(undefined); // Update the ref type
  useEffect(() => {
    const adjustGlobePosition = () => {
      if (width < 900) {
        // Example of adjusting the camera position
        // You'll need to determine the appropriate values for your specific use-case
        if (globeRef.current && globeRef.current?.camera) {
          const { camera } = globeRef.current;
          console.log('[ cam ]', globeRef.current.lights)

          // camera.position =[-100,0,0]
        }
      } else {
        // Reset to default position or handle as needed
        // if (globeRef.current) {
        //   const { camera } = globeRef.current;
        //   // Reset positions or set to default
        // }
      }
    };
    adjustGlobePosition();
    // Start auto-rotation
    const rotationInterval = setInterval(() => {
      if (globeRef.current) {
        globeRef.current.controls().autoRotate = true;
        globeRef.current.controls().autoRotateSpeed = 0.2; // adjust this value to slow down the rotation
      }
    }, 1000);

    return () => {
      clearInterval(rotationInterval);
    };
  }, [containerRef?.current?.offsetWidth, width, setLayer]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='globe' ref={containerRef}>
        <div className='globe__controls'>

          <UiSelect
            size='sm'
            variant='flat'
            value={keyStringConverter(layer)}
            onSelect={(l) => setLayer(keyStringConverter(l, true))}
            options={layerOptions}
          />
        </div>
        <Globe
          ref={globeRef}
          width={containerRef?.current?.offsetWidth}
          height={width > 900 ? containerRef?.current?.offsetWidth : containerRef?.current?.offsetHeight}
          globeImageUrl={`//unpkg.com/three-globe/example/img/${layer}.jpg`}
          bumpImageUrl={'//unpkg.com/three-globe/example/img/earth-topology.png'}
          labelsData={places}
          backgroundColor='#00000000'
          labelLat={(d: any) => d.latitude}
          labelLng={(d: any) => d.longitude}
          labelText={(d: any) => d.name}
          labelSize={(d: any) => Math.sqrt(d.size) * pointSize}
          labelDotRadius={(d: any) => Math.sqrt(d.size) * pointSize}
          labelColor={() => '#f30'}
          labelResolution={2}
          showAtmosphere={false}
        />
      </div>
    </>
  );
};

export default UiGlobe;
