import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import styles from './UiGlobe.scss';
import useWindow from '@webstack/hooks/useWindow';
import UiSelect from '@webstack/components/UiSelect/UiSelect';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
type IGlobeLocation = {
  properties:{
    name: string;
    latitude: number;
    longitude: number;
    size: number;
  }
}
interface IGlobe {
  pointSize: number;
  locations: IGlobeLocation[]
}
const UiGlobe: React.FC<any> = ({ locations, pointSize = 0.5 }: IGlobe) => {
  const layerOptions:string[] = [
    "earth-blue-marble",
    "earth-dark",
    "earth-day",
    "earth-night",
    // 'earth-water',
    // 'night-sky'
  ];
  const {width}=useWindow();
  const [layer, setLayer]=useState(layerOptions[0])
  const [places, setPlaces] = useState<IGlobeLocation[]>([
    {
      "properties": {
        "name": "Holladay",
        "latitude": 40.65654718559953,
        "longitude": -111.81447097331733,
        "size": 1,
      },
    }
  ]);
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

    return () => {
      clearInterval(rotationInterval);
    };
  }, [containerRef?.current?.offsetWidth, width, setLayer]);

  return (
    <>
      <style jsx>{styles}</style>
      <UiSelect 
      value={keyStringConverter(layer)}
      onSelect={(l)=>setLayer(keyStringConverter(l, true))}
      options={layerOptions}
      />
      <div className='globe' ref={containerRef}>
        <Globe
          ref={globeRef}
          width={containerRef?.current?.offsetWidth}
          height={containerRef?.current?.offsetWidth}
          globeImageUrl={`//unpkg.com/three-globe/example/img/${layer}.jpg`}
          bumpImageUrl={'//unpkg.com/three-globe/example/img/topology.png'}
          labelsData={places}
          backgroundColor='#00000000'
          labelLat={(d: any) => d.properties.latitude}
          labelLng={(d: any) => d.properties.longitude}
          labelText={(d: any) => d.properties.name}
          labelSize={(d: any) => Math.sqrt(d.properties.size) * pointSize}
          labelDotRadius={(d: any) => Math.sqrt(d.properties.size) * pointSize}
          labelColor={() => '#f30'}
          labelResolution={2}
          showAtmosphere={false}
        />
      </div>
    </>
  );
};

export default UiGlobe;
