"use client";

// https://github.com/louisyoong/mapbox-react/blob/main/src/components/Map.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl, { MapboxOptions } from "mapbox-gl";
import styles from "./UiMap.scss";
import useLocation from "@webstack/hooks/user/useLocation";
import IMap from "../models/IUiMap";
import handleVessels from '../functions/uiMapVessel';
import maps from "../models/maps";
import { isNumber } from "lodash";

mapboxgl.accessToken =
  "pk.eyJ1IjoibGFuZG9sYWJydW0iLCJhIjoiY2xnMDZ1aGVsMHJ5MzNsdGF3aHZhM3dtbyJ9.UihOXtkEeRk5tQDgDK8cLg";


const secondsPerRevolution = 120;
const maxSpinZoom = 5;
const slowSpinZoom = 3;

let userInteracting = false;
let spinEnabled = true;


const UiMap: React.FC<IMap> = (props: IMap) => {
  const { vessels } = props;
  const mapContainer = useRef<any>(null);

  const userLocation = useLocation();
  const defaultConfig = maps[1];

  useEffect(() => {
    if (mapContainer.current && userLocation) {
      const mapBoxOptions: MapboxOptions = {
        container: mapContainer.current,
        ...defaultConfig,
        center: userLocation,
      };

      const map = new mapboxgl.Map(mapBoxOptions);

      handleVessels(map, vessels);

      map && spinGlobe(map);

      map.on("load", () => spinGlobe(map));
      map.on("moveend", () => spinGlobe(map));
    }


    function spinGlobe(map: any) {
      const zoom = map.getZoom();
      if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }

        const center = map.getCenter();
        // const latitude = Number(center.lat.toFixed(0));
        // const tooHigh = latitude > 10;
        // const tooLow = latitude < 10;
        // if(tooLow)center.lat += distancePerSecond
        // else center.lat -= distancePerSecond;
        center.lng -= distancePerSecond;
        // console.log("[ TOOLOW  ]",{tooLow, tooHigh})
        // console.log("[ center  ]",center)
        map.easeTo({ center, duration: 1000, easing: (n: number) => n });
      }
    }

    // map.on("mousedown", () => {
    //   userInteracting = true;
    // });

    // map.on("mouseup", () => {
    //   userInteracting = false;
    // });

  }, [userLocation]);

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