import React, { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import styles from "./UiMap.scss";
import token from "../data/token";
import useWindow from "@webstack/hooks/useWindow";
import { useLoader } from "@webstack/components/Loader/Loader";
import { IVessel, IVesselActions } from "../models/IMapVessel";
import useProfile from "~/src/core/authentication/hooks/useProfile";
import { useRouter } from "next/router";
import { flyToView } from "../functions/mapControls";
import { UiIcon } from "@webstack/components/UiIcon/UiIcon";
import MapVesselDetails, { IVesselType } from "../views/MapVessel/views/MapVesselDetails/MapVesselDetails";
import MapSearch from "../views/MapSearch/MapSearch";
import useMapSearch from "../hooks/useMapSearch";
import initializeMap from "../functions/initializeMap";
import handleResize from "../functions/handleResize";

mapboxgl.accessToken = token;

interface MapOptions {
    center?: [number, number];
    zoom?: number;
    rpm?: number;
    loadingDelay?: number;
}

interface ICustomMapOptions extends mapboxgl.MapboxOptions {
    rpm?: number;
}

interface UiMapProps {
    hideHover?: boolean;
    options?: MapOptions;
    vessels?: IVessel[];
    onVesselClick?: (vessel: IVessel) => void;
    require?: "user" | "location" | "both";
}

const UiMap: React.FC<UiMapProps> = ({ options, vessels, onVesselClick, require, hideHover }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapboxMap | null>(null);
    const initialStyleID = "clw76pwt4003o01q120rh1mkk";

    const [loader, setLoader] = useLoader();
    const profile = useProfile({ require: require });
    const router = useRouter();
    const [selectedVessel, setSelectedVessel] = useState<IVessel | null | false>(null);
    const [styleId, setStyleId] = useState(initialStyleID);
    const [mapPath, setMapPath] = useState<string | undefined>();
    const { width: windowWidth, height: windowHeight } = useWindow();

    const calculateZoomLevel = (width: number) => {
        const minZoom = 0.6;
        const maxZoom = 2;
        const minWidth = 900;
        const maxWidth = 1400;
        if (width < minWidth) return minZoom;
        if (width > maxWidth) return maxZoom;
        return ((width - minWidth) / (maxWidth - minWidth)) * (maxZoom - minZoom) + minZoom;
    };

    const MAP_CONFIG = {
        globeZoom: calculateZoomLevel(windowWidth),
        mapZoom: 7,
        isGlobe: 5
    };

    const mapOptions: ICustomMapOptions = {
        container: mapContainerRef.current!,
        center: options?.center || profile?.lngLat || [0, 10],
        zoom: options?.zoom || MAP_CONFIG.globeZoom,
        style: `mapbox://styles/landolabrum/${styleId}`,
        projection: { name: "globe" } as any,
        antialias: true,
        rpm: options?.rpm
    };

    const [zoomLevel, setZoomLevel] = useState(mapOptions.zoom || 8);
    const [centerCoordinates, setCenterCoordinates] = useState(mapOptions.center || [0, 0]);
    const { searched, handleSearch } = useMapSearch({ lngLat: centerCoordinates, setLngLat: setCenterCoordinates, map: mapRef.current });

    const userVesselConfig: IVessel = {
        name: profile?.name ? `${profile.name}` : 'You are here',
        className: "user",
        images: [
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/e1573119-8f57-4e97-9d4f-9ed4be4de8b4.jpeg?im_w=1200",
            "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/a6f2bd88-0ef0-455b-8f00-433eee5b13c2.jpeg?im_w=720"
        ],
        lngLat: profile?.lngLat || [0, 0]
    };

    const handleVesselClick = (vessel: IVessel) => {
        const map = mapRef?.current;
        if (!map || !vessel) return;
        setSelectedVessel(vessel);
        onVesselClick && onVesselClick(vessel);
        flyToView(map, { lngLat: vessel.lngLat, zoom: 15 });
    };

    const handleVesselEnter = (vessel: IVessel) => {};

    const handleVesselLeave = () => {};

    const vesselActions: IVesselActions = {
        onClick: handleVesselClick,
        onMouseEnter: handleVesselEnter,
        onMouseLeave: handleVesselLeave,
    };

    const stopLoader = () => {
        if (!options?.loadingDelay) {
            setLoader({ active: false });
        } else if (options.loadingDelay) {
            setTimeout(() => {
                setLoader({ active: false });
            }, options.loadingDelay);
        }
    };

    const { width } = useWindow();

    useEffect(() => {
        const isMapInParent = mapPath && mapPath === router.asPath;
        const isReadyToLoadMap = (
            Boolean(profile?.lngLat || !require) && mapContainerRef.current && isMapInParent
        );

        if (!mapPath) setMapPath(router.asPath);
        if (!mapRef.current && isMapInParent && !loader.active) {
            setLoader({
                active: true,
                body: " ",
                iconSize: width <= 1100 ? "70vw" : "350px"
            });
        } else if (!isMapInParent && loader.active) {
            stopLoader();
        }
        if (isReadyToLoadMap) {
            const map = new mapboxgl.Map({
                ...mapOptions,
            });
            initializeMap({
                map,
                profile,
                vessels,
                userVesselConfig,
                vesselActions,
                mapOptions,
                stopLoader,
                setLngLat: setCenterCoordinates,
                setZoom: setZoomLevel,
                hideHover: hideHover
            });
            mapRef.current = map;
            return () => {
                map.remove();
                mapRef.current = null;
            };
        }
    }, [mapContainerRef.current, setStyleId, require, profile, windowWidth, router.asPath, styleId]);

    useEffect(() => {
        if (mapContainerRef?.current) {
            mapContainerRef.current.style.height = '100vh';
            mapContainerRef.current.style.width = '100%';
            if (mapRef.current) mapRef.current.resize();
        }
    }, [selectedVessel == false]);

    const handleResizeCallback = useCallback(
        (newSize: any) => handleResize(
            mapContainerRef,
            mapRef,
            windowWidth,
            windowHeight,
            selectedVessel !== null,
            newSize,
            setSelectedVessel,
            selectedVessel,
            zoomLevel
        ), [windowWidth, windowHeight, selectedVessel, zoomLevel]);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='map-container'>
                <div className='map-content'>
                    <div className="map" ref={mapContainerRef} onDoubleClick={() => selectedVessel && setSelectedVessel(false)} />
                    {selectedVessel && (
                        <MapVesselDetails
                            vessel={selectedVessel}
                            setVessel={setSelectedVessel as (vessel: IVesselType) => void}
                            onResize={handleResizeCallback}
                        />
                    )}
                    {!loader.active && (
                        <div className='map-tools'>
                            <div className='map-tools--layer'>
                                <UiIcon icon="fa-xmark" onClick={() => setStyleId("clwvqyuxe01bl01q11d6m8nh7")} />
                            </div>
                            <MapSearch searched={searched} handleSearch={handleSearch} />
                            <UiIcon onClick={() => { flyToView(mapRef?.current, { zoom: zoomLevel > 6 ? 10 : 6 }) }} icon={zoomLevel > 6 ? 'fa-globe' : 'fa-map'} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UiMap;
