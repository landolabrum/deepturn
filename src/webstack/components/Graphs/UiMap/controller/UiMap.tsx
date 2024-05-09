import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";

import styles from "./UiMap.scss";
import token from "../data/token";
import useWindow from "@webstack/hooks/useWindow";
import useElement from "@webstack/hooks/useElement";
import addVessels, { Vessel } from "../functions/mapVessels";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import mapVessels from "../data/mapVessels";
import { mapRotate, setUpInteractionListeners } from "../functions/mapRotate";

mapboxgl.accessToken = token;

const UiMap = ({ vessels }: { vessels?: Vessel[] }) => {
    const { openModal } = useModal();
    const mapContainer = useRef<HTMLDivElement>(null);
    const [currentLocation, setCurrentLocation]=useState();
    const { width } = useWindow();
    const { remove } = useElement();

    const handleVesselClick = (vessel: Vessel) => {
        console.log(vessel);
        openModal({variant:'popup',children:<ol>{Object.entries(vessel).map(([a,b])=><li key={a}><strong>{JSON.stringify(a)}</strong>:{JSON.stringify(b)}</li>)}</ol>});
    };
    const initializeMap = (map: MapboxMap) => {
        if (!map) return;
        addVessels(map, vessels || mapVessels, handleVesselClick);
        mapRotate(map); // This now handles setting up interaction listeners internally
    };
    

    const setZoomLevel = () => width > 1260 ? 2 : 0.9;

    useEffect(() => {
        if (!mapContainer.current) return;

        const config: mapboxgl.MapboxOptions = {
            container: mapContainer.current,
            style: 'mapbox://styles/landolabrum/clvu95nn901lc01q14qdf7w97',
            projection: { name: "globe" },
            center: [0, 0],
            zoom: setZoomLevel(),
            antialias: true
        };

        const map = new mapboxgl.Map(config);
        initializeMap(map);

        map.on('style.load', () => {
            remove("mapboxgl-ctrl-logo");
            remove("mapboxgl-canary");
            remove("mapboxgl-ctrl");
        });

        return () => map.remove();
    }, [mapContainer, vessels, setZoomLevel]); // Ensure dependencies are correctly listed to avoid excessive re-renders

    return (
        <>
            <style jsx>{styles}</style>
            <div className='map-container'>
                <div className='map' ref={mapContainer} />
                <div className="menu"></div>
                {/* <ol>{Object.entries(vessel).map(([a,b])=><li><strong>{JSON.stringify(a)}</strong>:{JSON.stringify(b)}</li>)}</ol> */}
            </div>
        </>
    );
};

export default UiMap;