import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";

import styles from "./UiMap.scss";
import token from "../data/token";
import useWindow from "@webstack/hooks/useWindow";
import useElement from "@webstack/hooks/useElement";
import addVessels, { Vessel } from "../functions/mapVessels";
import { useModal } from "@webstack/components/modal/contexts/modalContext";
import mapVessels from "../data/mapVessels";
import useMapRotate from "../functions/mapRotate";

mapboxgl.accessToken = token;
const styleId: string = "clw02qoqe01x701q1fe3zfdut";

interface IuiMap {
    options?: any,
    vessels?: Vessel[];
    onVesselClick?: (vessel: Vessel) => void;
};

const UiMap = ({ options, vessels, onVesselClick }: IuiMap) => {
    const { openModal } = useModal();
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapboxMap>(); // Reference to hold the map instance
    const { width } = useWindow();
    const { remove } = useElement();

    const setZoomLevel = () => width > 1260 ? 2 : 0.9;

    const _options: any = {
        center: options?.center || [0, 10],
        zoom: setZoomLevel(),
        style: `mapbox://styles/landolabrum/${styleId}`,
        projection: { name: "globe" },
        antialias: true,
    };

    const initializeMap = (map: MapboxMap) => {
        mapRef.current = map; // Save the map instance to the ref
        addVessels(map, vessels || mapVessels, handleVesselClick);
    };
    const handleVesselClick = (vessel: Vessel) => {
        if (!vessel.location || !mapRef.current) return;
        mapRef.current.flyTo({
            center: [vessel.location.lng, vessel.location.lat],
            zoom: 10, // Adjust zoom level as necessary
            essential: true // This option is for accessibility purposes
        });
        onVesselClick && onVesselClick(vessel);
    };
    useEffect(() => {
        if (!mapContainer.current) return;
        const map = new mapboxgl.Map({
            ..._options,
            container: mapContainer.current,
        });
        initializeMap(map);

        map.on('style.load', () => {
            remove("mapboxgl-ctrl-logo");
            remove("mapboxgl-canary");
            remove("mapboxgl-ctrl");
        });

        return () => map.remove();
    }, [options]);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='map-container'>
                <div className='map' ref={mapContainer} />
                <div className="menu"></div>
            </div>
        </>
    );
};

export default UiMap;
