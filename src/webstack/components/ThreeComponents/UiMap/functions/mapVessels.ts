import { createRoot } from "react-dom/client";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import MapVesselMarker from "../views/MapVessel/views/MapVesselMarker/MapVesselMarker";

import { IVessel, IVesselActions } from "../models/IMapVessel";

const addVessels = (
    map: MapboxMap,
    actions: IVesselActions, 
    vessels?: IVessel[],
    hideHover?: boolean
): void => {
    if (!vessels) return;
    vessels.forEach(vessel => {
        const el = document.createElement('div');
        const root = createRoot(el);
        root.render(MapVesselMarker({ vessel, ...actions, hideHover }));
        if (vessel.lngLat) {
            new mapboxgl.Marker(el)
                .setLngLat(vessel.lngLat)
                .addTo(map);
        }
    });
};

export default addVessels;
