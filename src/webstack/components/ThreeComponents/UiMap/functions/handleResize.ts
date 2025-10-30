// src/functions/handleResize.ts
import { MutableRefObject } from "react";
import { IVessel } from "../models/IMapVessel";
import { flyToView } from "./mapControls";

const handleResize = (
  mapContainerRef: MutableRefObject<HTMLDivElement | null>,
  mapRef: MutableRefObject<mapboxgl.Map | null>,
  isVesselVisible: boolean,
  delta: number,
  setVesselVisibility: (v: false | IVessel | null) => void,
  selectedVessel?: IVessel | null
) => {
  if (!mapContainerRef.current) return;
  const map = mapRef.current;
  if (!map) return;

  if (!isVesselVisible || !selectedVessel?.lngLat) {
    setVesselVisibility(false);
    map.resize();
    return;
  }

  const direction = delta < 1 ? "up" : "down";
  flyToView(map, {
    lngLat: selectedVessel.lngLat,
    zoom: 15,
    offset: { y: Math.abs(delta * 0.9), x: 0 },
    direction,
  });

  map.resize();
};

export default handleResize;
