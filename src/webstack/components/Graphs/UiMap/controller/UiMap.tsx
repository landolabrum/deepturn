"use client";
import ReactDOM from 'react-dom';

// https://github.com/louisyoong/mapbox-react/blob/main/src/components/Map.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl, { MapboxOptions } from "mapbox-gl";
import styles from "./UiMap.scss";
import useLocation from "@webstack/hooks/user/useLocation";
import IMap from "../models/IUiMap";
import handleVessels from '../functions/uiMapVessel';

mapboxgl.accessToken =
  "pk.eyJ1IjoibGFuZG9sYWJydW0iLCJhIjoiY2xnMDZ1aGVsMHJ5MzNsdGF3aHZhM3dtbyJ9.UihOXtkEeRk5tQDgDK8cLg";




const UiMap: React.FC<IMap> = (props: IMap) => {
  const { vessels } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const userLocation = useLocation();


 

  useEffect(() => {
    if (mapContainer.current && userLocation) {
      const mapBoxOptions: MapboxOptions = {
        container: mapContainer?.current,
        style: 'mapbox://styles/landolabrum/clvlv72k500np01rd1bb44jhc',
        // style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation,
        zoom: 3,
        maxZoom: 15
      };
      const map = new mapboxgl.Map(mapBoxOptions)
      handleVessels(map, vessels);
    }
    
// const colorBg = () =>{
//   const bgElement = mapContainer?.current
//   console.log("[ mapContainer?.current ]", mapContainer?.current)
//   if(bgElement){
//     console.log("[ mapContainer?.curren SUCCESS t ]", mapContainer?.current)
//   }
//   colorBg();
// }

  }, [userLocation, vessels]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='ui-map'>
      <div className='map-container' ref={mapContainer}   />
      </div>
    </>
  );
};

export default UiMap;