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
interface IuiMap{
     vessels?: Vessel[];
     onVesselClick?: (e?:Vessel)=>void;
};
const UiMap = ({ vessels, onVesselClick }: IuiMap) => {
    const { openModal } = useModal();
    const mapContainer = useRef<HTMLDivElement>(null);
    const { width } = useWindow();
    const { remove } = useElement();
    
    const setZoomLevel = () => width > 1260 ? 2 : 0.9;
    const CAMERA_POS:any = {
        center: [0, 10],
        zoom: setZoomLevel(),
        // bearing:10,
        // pitch: 12
    };
    

    const initializeMap = (map: MapboxMap) => {
        if (!map) return;
        addVessels(map, vessels || mapVessels, onVesselClick);
        const pos = mapRotate(map); // This now handles setting up interaction listeners internally
        console.log("[ POS ]", pos)
    };
    


    useEffect(() => {
        if (!mapContainer.current) return;
        const config: mapboxgl.MapboxOptions = {
            container: mapContainer.current,
            style: 'mapbox://styles/landolabrum/clw02qoqe01x701q1fe3zfdut',
            projection: { name: "globe" },
            antialias: true,
            ...CAMERA_POS
        };

        const map = new mapboxgl.Map(config);
        initializeMap(map);

        map.on('style.load', () => {
            remove("mapboxgl-ctrl-logo");
            remove("mapboxgl-canary");
            remove("mapboxgl-ctrl");
        });

        return () => map.remove();
    }, [setZoomLevel]); // Ensure dependencies are correctly listed to avoid excessive re-renders

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