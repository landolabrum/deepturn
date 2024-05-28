import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import styles from "./UiMap.scss";
import token from "../data/token";
import useWindow from "@webstack/hooks/useWindow";
import useElement from "@webstack/hooks/useElement";
import addVessels from "../functions/mapVessels";
import { useLoader } from "@webstack/components/Loader/Loader";
import { IVessel, IVesselActions } from "../models/IMapVessel";
import useProfile from "~/src/core/authentication/hooks/useProfile";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import { flyToView } from "../functions/mapPositions";
import { useRouter } from "next/router";
import mapRotate from "../functions/mapRotate";

mapboxgl.accessToken = token;
const styleId = "clw76pwt4003o01q120rh1mkk";

interface IuiMap {
    options?: any;
    vessels?: IVessel[];
    onVesselClick?: (vessel: IVessel) => void;
    require?: "user" | "location" | "both";
}

const UiMap: React.FC<IuiMap> = ({ options, vessels, onVesselClick, require = 'both' }) => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapboxMap | null>(null);
    const [loader, setLoader] = useLoader();
    const profile = useProfile({ require: require });
    const router = useRouter();
    const [mapPath, setMapPath] = useState<string | undefined>();
    const { width } = useWindow();
    const MAPCONFIG = {
        globeZoom: width < 900 ? 1.5 : 2,
        mapZoom: 7,
        isGlobe: 5
    };

    let mapOptions: any = {
        center: options?.center || profile?.lngLat || [0, 10],
        zoom: options?.zoom || MAPCONFIG.globeZoom,
        style: `mapbox://styles/landolabrum/${styleId}`,
        projection: { name: "globe" } as any,
        antialias: true,
        rpm: options?.rpm,
    };
    const [zoom, setZoom] = useState(mapOptions?.zoom || 8);
    const [lngLat, setLngLat] = useState(mapOptions?.center || [0, 0]);

    let userVesselConfig: IVessel = ({
        name: profile?.name ? `${profile.name}` : 'You are here',
        className: "user",
        images: [
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/e1573119-8f57-4e97-9d4f-9ed4be4de8b4.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/a6f2bd88-0ef0-455b-8f00-433eee5b13c2.jpeg?im_w=720"
        ],
        lngLat: profile?.lngLat || [0, 0]
    });

    const handleVesselClick = (vessel: IVessel) => {
        const map = mapRef?.current;
        if (!map || !vessel) return;
        onVesselClick && onVesselClick(vessel);
        flyToView(map, { lngLat: vessel.lngLat, zoom: 9 });
    };

    const handleVesselEnter = (vessel: IVessel) => {
        console.log('[ HANDLE VESSEL ENTER ]', { vessel });
    };

    const handleVesselLeave = () => {
        console.log('[ HANDLE VESSEL LEAVE ]');
    };

    const actions: IVesselActions = {
        onClick: handleVesselClick,
        onMouseEnter: handleVesselEnter,
        onMouseLeave: handleVesselLeave,
    };

    const handleToolZoom = (newLngLat: number[]) => {
        const map = mapRef.current;
        if (!map) return;
        setLngLat(newLngLat);
        flyToView(
            map,
            {
                zoom: zoom > MAPCONFIG.isGlobe ? MAPCONFIG.globeZoom : MAPCONFIG.mapZoom,
                lngLat: newLngLat
            }
        );
    };

    const initializeMap = (map: MapboxMap) => {
        const hasUserLocation = profile?.lngLat && profile.lngLat.every(item => item !== 0);
        mapRef.current = map;
        map.on('style.load', () => {
            const setInitialVessels = () => {
                if (profile?.lngLat) userVesselConfig.lngLat = profile?.lngLat;
                if (!vessels) return [userVesselConfig];
                if (hasUserLocation) {
                    return [...vessels, userVesselConfig].map((vessel, index) => ({
                        ...vessel,
                        id: index + 1,
                    }));
                } else {
                    flyToView(map, { lngLat: [-95, 37] })
                    return [...vessels].map((vessel, index) => ({
                        ...vessel,
                        id: index + 1,
                    }));
                }
            };
            const initializedVessels = setInitialVessels();
            addVessels(map, actions, initializedVessels);
            options?.rpm && mapRotate(map);
            setLoader({ active: false });
        });

        map.on('move', () => {
            setLngLat(map.getCenter().toArray());
            setZoom(map.getZoom());
        });
    };

    useEffect(() => {
        const isMapPath = mapPath && mapPath == router.asPath;
        if (!mapPath) setMapPath(router.asPath);
        else if (!isMapPath && loader.active) setLoader({ active: false });
        if (!mapRef.current && isMapPath) setLoader({ active: true, body: 'loading map' });
        if (Boolean(profile?.lngLat || !require) && mapContainer.current && isMapPath) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                ...mapOptions,
            });
            initializeMap(map);
            return () => map.remove();
        }
    }, [mapContainer.current, require, profile, router.asPath]);

    return (
        <>
            <style jsx>{styles}</style>
            <div className="map" ref={mapContainer} />
            <div className='map-tools__main'>
                <UiIcon
                    onClick={() => handleToolZoom(lngLat)}
                    icon={zoom > MAPCONFIG.isGlobe ? 'fa-globe' : 'fa-map'}
                />
            </div>
        </>
    );
};

export default UiMap;