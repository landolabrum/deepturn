import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import styles from "./UiMap.scss";
import useLocation from "@webstack/hooks/user/useLocation";
import setPoints from '../functions/setPoints';
import { mapRotate, setUpInteractionListeners } from "../functions/mapRotate";
import token from "../data/token";

// Ensure you have set your Mapbox access token in your environment variables

mapboxgl.accessToken = token;

const UiMap = ({ vessels }: any) => {
    const mapContainer = useRef(null);

    const initializeMap = (map: any) => {
        if (!map) return;
        setPoints(map, vessels);
        mapRotate(map);
        map.on("moveend", () => mapRotate(map));
        setUpInteractionListeners(map); // Setting up interaction listeners right after initializing the map
    };

    useEffect(() => {
        if (!mapContainer.current) return;
        const config: any = {
            container: mapContainer.current,
            style: 'mapbox://styles/landolabrum/clvu95nn901lc01q14qdf7w97',
            projection: 'globe',
            center: [0, 0],
            zoom: 1,
            minZoom: 1,
            antialias: true,
            bearing: 26.2
        }
        const map = new mapboxgl.Map(config);
        initializeMap(map);

        map.on('load', () => {
            //   map.setFog({
            //     color: 'rgba(0,0,0,1)', // black background
            //     'high-color': 'rgba(0,0,0,0)', // transitioning to clear
            //     'horizon-blend': 0.1,
            //     'space-color': '#1d1d1d01',
            //     'star-intensity': 0.3
            //   });

            // Example to add a custom grid layer, needs custom implementation
            //   map.addLayer({
            //     'id': 'custom-grid',
            //     'type': 'custom', // You would need to define this type
            //     'renderingMode': '3d', // 3d layer
            //     'onAdd': function (map, gl) {
            //       // Custom shader or grid drawing logic goes here
            //     },
            //     'render': function (gl, matrix) {
            //       // Drawing code for the grid
            //     }
            //   });
        });

        return () => {
            map.remove();
        };
    }, []);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='map-container' ref={mapContainer} />
        </>
    );
};

export default UiMap;
