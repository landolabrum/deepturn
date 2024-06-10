// src/functions/handleResize.ts
import { MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";
import { IVessel } from "../models/IMapVessel";
import { flyToView } from "./mapControls";

const handleResize = (
    mapContainerRef: MutableRefObject<HTMLDivElement | null>,
    mapRef: MutableRefObject<mapboxgl.Map | null>,
    windowWidth: number,
    windowHeight: number,
    isVesselVisible: boolean,
    newSize: any,
    setVesselVisibility: (value: IVessel | false | null) => void,
    selectedVessel: any,
    zoomLevel: number,
) => {
    if (!mapContainerRef.current) return;
    const map = mapRef.current;
    const isDesktop = windowWidth >= 1100;
    const hasVessel = isVesselVisible !== false;
    let mapStyles = mapContainerRef.current.style
    if (newSize < 100) {
        setVesselVisibility(false);
    } else if (hasVessel) {

        flyToView(map,{ 
            lngLat: selectedVessel.lngLat,
            zoom: 15,
            offset: isDesktop?{ x: newSize * 0.5, y: 0 }:{ y: newSize * 0.5, x: 0 }, 
            direction: isDesktop?'right':'down'
        });

        if (mapRef.current) {
            mapRef.current.resize();
        }
    }
};

export default handleResize;
