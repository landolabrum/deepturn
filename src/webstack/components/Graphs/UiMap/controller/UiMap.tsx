"use client";

// https://github.com/louisyoong/mapbox-react/blob/main/src/components/Map.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl, { MapboxOptions } from "mapbox-gl";
import styles from "./UiMap.scss";
import useLocation from "@webstack/hooks/user/useLocation";
import IMap from "../models/IUiMap";
import setMarkers from '../functions/setMarkers';
import maps from "../data/maps";
import mapRotate from "../functions/mapRotate";

mapboxgl.accessToken =
  "pk.eyJ1IjoibGFuZG9sYWJydW0iLCJhIjoiY2xnMDZ1aGVsMHJ5MzNsdGF3aHZhM3dtbyJ9.UihOXtkEeRk5tQDgDK8cLg";



const UiMap: React.FC<IMap> = (props: IMap) => {
  const { vessels } = props;
  const mapContainer = useRef<any>(null);

  const userLocation = useLocation();
  const defaultConfig = maps[1];

  const initializeMap = (map:any) =>{
    if(!map)return;
    setMarkers(map, vessels);
    mapRotate(map);
    map.on("moveend", () => mapRotate(map));
  }

  useEffect(() => {
    if (mapContainer.current && userLocation) {

      // REMOVE EXISTING MAPS
      const mapChildren = mapContainer.current?.children;
      if(mapChildren.length)Object.entries(mapChildren).map(([key,child])=>mapContainer.current.removeChild(child));

      
      const mapBoxOptions: MapboxOptions = {
        container: mapContainer.current,
        ...defaultConfig,
        center: userLocation
      };
      const map = new mapboxgl.Map(mapBoxOptions);
      initializeMap(map);
    }
  }, [userLocation, mapContainer?.current]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='ui-map'>
        <div className='map-container' ref={mapContainer} />
      </div>
    </>
  );
};

export default UiMap; 