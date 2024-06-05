// src/functions/handleResize.ts
import { MutableRefObject } from "react";
import mapboxgl from "mapbox-gl";
import { IVessel } from "../models/IMapVessel";

const handleResize = (
    mapContainerRef: MutableRefObject<HTMLDivElement | null>,
    mapRef: MutableRefObject<mapboxgl.Map | null>,
    windowWidth: number,
    windowHeight: number,
    isVesselVisible: boolean,
    newSize: any,
    setVesselVisibility: (value: IVessel | false | null) => void
) => {
    if (!mapContainerRef.current) return;
    const isDesktop = windowWidth >= 1100;
    const hasVessel = isVesselVisible !== false;
    if (newSize < 100) {
        setVesselVisibility(false);
    } else if (hasVessel) {
        if (isDesktop) {
            mapContainerRef.current.style.width = `${windowWidth + 20 - newSize}px`;
            mapContainerRef.current.style.height = '100%';
        } else {
            mapContainerRef.current.style.height = `${windowHeight - newSize}px`;
        }
        if (mapRef.current) {
            mapRef.current.resize();
        }
    }
};

export default handleResize;
