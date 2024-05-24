import React from "react";
import { createRoot } from "react-dom/client";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import MapVessel from "../views/MapVessel/controller/MapVessel";

import { IVessel, IVesselActions } from "../models/IMapVessel";

const addVessels = (map: MapboxMap, actions: IVesselActions, vessels?: IVessel[]): void => {
    if (!vessels) return;
    vessels.forEach(vessel => {
        const el = document.createElement('div');
        const root = createRoot(el);
        root.render(MapVessel({ vessel, ...actions }));
        if (vessel.lngLat) {
            new mapboxgl.Marker(el)
                .setLngLat(vessel.lngLat)
                .addTo(map);
        }
    });
};

export default addVessels;
