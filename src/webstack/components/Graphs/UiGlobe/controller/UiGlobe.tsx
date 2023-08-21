import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import styles from './UiGlobe.scss';
import useWindow from '@webstack/hooks/useWindow';
// Remember to create a sibling SCSS file with the same name as this component

const UiGlobe: React.FC = () => {
  const size = useWindow();
  const [places, setPlaces] = useState([]);
  const globeEl = useRef<GlobeMethods | null>(null);

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
  }, []);

  useEffect(() => {
    // load data
    fetch('/data/ne_110m_populated_places_simple.geojson.json').then(res => res.json())
      .then(({ features }) => setPlaces(features));
  }, []);
// const globeSize = () =>{
//   let _size = size;
//   if(size.width > size.height)_size.height = size.width;
//   if(size.width < size.height)_size.width = size.height;
//   return _size

// }
  return (
    <>
      <style jsx>{styles}</style>
      <Globe
        ref={globeEl}
        width={size.width - 50}
        height={size.height - 200}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        labelsData={places}
        backgroundColor='#ffffff00'
        labelLat={(d) => d.properties.latitude}
        labelLng={(d) => d.properties.longitude}
        labelText={(d) => d.properties.name}
        labelSize={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
        labelDotRadius={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
        labelColor={() => 'rgba(255, 165, 0, 0.75)'}
        labelResolution={2}
        showAtmosphere={false}
      />
    </>
  );
};

export default UiGlobe;





// import { useState, useEffect, useMemo } from "react";
// import Globe from 'react-globe.gl';
// import * as d3 from 'd3';
// import styles from "./UiGlobe.scss"
// import { jsonCountries } from "../models/public/ne_110m_admin_0_countries.geojson";
// import * as THREE from 'three';
// import * as topojson from "topojson-client";


// const UiGlobe = () => {
//   const [landPolygons, setLandPolygons] = useState([]);
//   const polygonsMaterial = new THREE.MeshLambertMaterial({ color: 'darkslategrey', side: THREE.DoubleSide });

//   useEffect(() => {
//     // load data
//     fetch('//unpkg.com/world-atlas/land-110m.json').then(res => res.json())
//       .then(landTopo => {
//         setLandPolygons(topojson.feature(landTopo, landTopo.objects.land).features);
//       });
//   }, []);


//   return <>
//     <style jsx>{styles}</style>
//     <Globe
//       height={500}
//       width={500}
//       backgroundColor="rgba(0,0,0,0)"
//       showGlobe={false}
//       showAtmosphere={false}
//       polygonsData={landPolygons}
//       polygonCapMaterial={polygonsMaterial}
//       polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
//     />
//   </>;
// };
// export default UiGlobe





// VERSION 1
// import { useState, useEffect, useRef, useMemo } from "react";
// import Globe, { GlobeMethods } from 'react-globe.gl';
// import * as d3 from 'd3';
// import styles from "./UiGlobe.scss"
// import { jsonCountries } from "../models/public/ne_110m_admin_0_countries.geojson";
// import useWindow from "@webstack/hooks/useWindow";

// const World = () => {
//   const width = useWindow()?.width - 100;
//   const [countries, setCountries] = useState({ features: [] });
//   const [hoverD, setHoverD] = useState<any>();
//   const globeEl = useRef<GlobeMethods | null>(null);
  
//   // Example points data
//   const pointsData = [
//     { latitude: 52.5200, longitude: 13.4050, name: "Berlin", population: 3769000 },
//     { latitude: 40.7128, longitude: -74.0060, name: "New York", population: 8175000 },
//     { latitude: 34.0522, longitude: -118.2437, name: "Los Angeles", population: 3795000 },
//   ];

//   useEffect(() => {
//     // load data
//     setCountries(jsonCountries);
//     // fetch('../models/public/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
//   }, [setCountries]);

//   useEffect(() => {
//     // Start auto-rotation
//     const rotationInterval = setInterval(() => {
//       if (globeEl.current) {
//         globeEl.current.controls().autoRotate = true;
//       }
//     }, 1000);

//     return () => clearInterval(rotationInterval);
//   }, []);

//   const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

//   // GDP per capita (avoiding countries with small pop)
//   const getVal = (feat: any) => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

//   const maxVal = useMemo(
//     () => Math.max(...countries.features.map(getVal)),
//     [countries]
//   );
//   colorScale.domain([0, maxVal]);

//   const handleGlobeClick = () => {
//     if (globeEl.current) {
//       globeEl.current.controls().autoRotate = false;
//     }
//   };

//   return <>
//     <style jsx>{styles}</style>

//     <Globe
//       ref={globeEl}
//       height={1000}
//       width={width}
//       globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
//       lineHoverPrecision={0}
//       backgroundColor="#ffffff00"
//       polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
//       polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
//       polygonCapColor={d => d === hoverD ? 'steelblue' : colorScale(getVal(d))}
//       polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
//       polygonStrokeColor={() => '#111'}
//       polygonLabel={({ properties: d }) => `
//       <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
//       GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
//       Population: <i>${d.POP_EST}</i>
//       `}
//       onPolygonHover={setHoverD}
//       polygonsTransitionDuration={300}
//       onGlobeClick={handleGlobeClick}
//       pointsData={pointsData}
//       pointLabel={(point) => `
//         <b>${point.name}</b><br />
//         Population: <i>${point.population}</i>
//       `}
//       pointAltitude={0.2}
//       pointRadius={0.5}
//     />
//   </>;
// };
// export default World;
