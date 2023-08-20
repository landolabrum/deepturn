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
import { useState, useEffect, useMemo } from "react";
import Globe from 'react-globe.gl';
import * as d3 from 'd3';
import styles from "./UiGlobe.scss"
import { jsonCountries } from "../models/public/ne_110m_admin_0_countries.geojson";
const World = () => {
  const [countries, setCountries] = useState({ features: [] });
  const [hoverD, setHoverD] = useState<any>();

  useEffect(() => {
    // load data
    setCountries(jsonCountries)
    // fetch('../models/public/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(setCountries);
  }, [setCountries]);

  const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

  // GDP per capita (avoiding countries with small pop)
  const getVal = (feat:any) => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

  const maxVal = useMemo(
    () => Math.max(...countries.features.map(getVal)),
    [countries]
  );
  colorScale.domain([0, maxVal]);

  return <>
  <style jsx>{styles}</style>

    <Globe
          height={500}
      width={500}
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
      lineHoverPrecision={0}
      backgroundColor="#ffffff00"
      polygonsData={countries.features.filter(d => d.properties.ISO_A2 !== 'AQ')}
      polygonAltitude={d => d === hoverD ? 0.12 : 0.06}
      polygonCapColor={d => d === hoverD ? 'steelblue' : colorScale(getVal(d))}
      polygonSideColor={() => 'rgba(0, 100, 0, 0.15)'}
      polygonStrokeColor={() => '#111'}
      polygonLabel={({ properties: d }) => `
      <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
      GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
      Population: <i>${d.POP_EST}</i>
    `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  </>;
};
export default World