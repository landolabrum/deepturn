import React, { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl, { Map as MapboxMap } from "mapbox-gl";
import styles from "./UiMap.scss";
// import token from "../data/token";
import useWindow from "@webstack/hooks/window/useWindow";
import { useLoader } from "@webstack/components/Loader/Loader";
import { IVessel, IVesselActions } from "../models/IMapVessel";
import useProfile from "~/src/core/authentication/hooks/useProfile";
import { useRouter } from "next/router";
import { flyToView } from "../functions/mapControls";
import { UiIcon } from "@webstack/components/UiIcon/controller/UiIcon";
import MapVesselDetails, { IVesselType } from "../views/MapVessel/views/MapVesselDetails/MapVesselDetails";
import useMapSearch from "../hooks/useMapSearch";
import initializeMap from "../functions/initializeMap";
import handleResize from "../functions/handleResize";
import { useHeader } from "@webstack/components/Containers/Header/controller/MainHeader";
import useElement from "@webstack/hooks/useElement";
import { getCamera, saveCamera } from "../functions/mapCamera";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN?.trim();
mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapOptions {
    center?: [number, number];
    zoom?: number;
    rpm?: number;
    loadingDelay?: number;
    pitch?: number;
    tools?: any;
}

interface UiMapProps {
    options?: MapOptions;
    vessels?: IVessel[];
    onVesselClick?: (vessel: IVessel) => void;
    require?: "user" | "location" | "both";
    hideHover?: boolean;
    variant?: "fullscreen" | "embedded";
}

// WebGL feature detection
const isWebGLSupported = (): boolean => {
    if (typeof window === "undefined") return false;
    try {
        const canvas = document.createElement("canvas");
        return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
    } catch {
        return false;
    }
};
const VESSEL_ZOOM = 12;
const UiMap: React.FC<UiMapProps> = ({ options, vessels, onVesselClick, require, hideHover, variant = 'fullscreen' }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapboxMap | null>(null);
  const initialStyleID = "cmdlifumv00ex01pt4x5x3nyv";  
  const [header, setHeader]=useHeader();

  const [loader, setLoader] = useLoader();
  const profile = useProfile({ require });
  const router = useRouter();
  const [selectedVessel, setSelectedVessel] = useState<IVessel | null>(null);
  const [styleId, setStyleId] = useState(initialStyleID);
  const [mapPath, setMapPath] = useState<string>();
  const { width: windowWidth, height: windowHeight } = useWindow();
    const calculateZoomLevel = (width: number): number => {
        const minZoom = 0.6;
        const maxZoom = 2;
        const minWidth = 900;
        const maxWidth = 1400;
        if (width < minWidth) return minZoom;
        if (width > maxWidth) return maxZoom;
        return ((width - minWidth) / (maxWidth - minWidth)) * (maxZoom - minZoom) + minZoom;
    };

    const globeZoom = calculateZoomLevel(windowWidth);
    const [zoomLevel, setZoomLevel] = useState<number>(options?.zoom ?? globeZoom);
    const [centerCoordinates, setCenterCoordinates] = useState<[number, number]>(options?.center ?? [0, 10]);

    useEffect(() => {
        if (options?.center && mapRef.current && options?.zoom !== undefined) {
            setCenterCoordinates(options.center);
        }
    }, [options?.center, options?.zoom]);

    const mapOptions = {
        container: mapContainerRef.current!,
        center: centerCoordinates,
        zoom: zoomLevel,
        style: `mapbox://styles/landolabrum/${styleId}`,
        projection: { name: "globe" } as any,
        antialias: true,
        rpm: options?.rpm || 0,
        pitch: options?.pitch || 0
    };

    const { searched, handleSearch } = useMapSearch({ lngLat: centerCoordinates, setLngLat: setCenterCoordinates, map: mapRef.current });

    const userVesselConfig: IVessel = {
        name: profile?.name ?? 'You are here',
        className: "user",
        hover: <h1>{profile?.name}</h1>,
        lngLat: profile?.lngLat ?? [0, 0]
    };

const handleVesselClick = (vessel: IVessel) => {
  const map = mapRef.current;
  if (!vessel) return;

  // ✅ snapshot current camera before any UI changes
  if (map) saveCamera(getCamera(map));

  setSelectedVessel(vessel);
  onVesselClick?.(vessel);
  if (!header?.hide) setHeader({ hide: true });
};


    const vesselActions: IVesselActions = {
        onClick: handleVesselClick,
        onMouseEnter: () => {},
        onMouseLeave: () => {},
    };

    const stopLoader = () => {
        if (!options?.loadingDelay) {
            setLoader({ active: false });
        } else {
            setTimeout(() => setLoader({ active: false }), options.loadingDelay);
        }
    };
    const closeVessel = useCallback(() =>{
        setSelectedVessel(null);
        header?.hide&& setHeader({ hide: false });
    },[])
    useEffect(() => {
        if (typeof window === "undefined") return;

        const isMapInParent = mapPath && mapPath === router.asPath;
        const isReadyToLoadMap = mapContainerRef.current && isMapInParent;

        if (!mapPath) setMapPath(router.asPath);

        if (!mapRef.current && isMapInParent && !loader.active) {
            setLoader({ active: true, body: " ", iconSize: windowWidth <= 1100 ? "70vw" : "350px" });
        } else if (!isMapInParent && loader.active) {
            stopLoader();
        }

        if (isReadyToLoadMap) {
            if (!isWebGLSupported()) {
                console.warn("🧨 WebGL is not supported — skipping map initialization.");
                stopLoader();
                return;
            }

           // In your UiMap component's useEffect where you initialize the map:
try {
  const map = new mapboxgl.Map(mapOptions);
  mapRef.current = map;

  
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
    hideHover,
  });


  return () => {
   
    map.remove();
    mapRef.current = null;
  };
} catch (err) {
  console.error("🧨 Failed to initialize Mapbox GL:", err);
  stopLoader();
}
        }
    }, [mapContainerRef.current, require, profile, router.asPath, styleId, vessels]);
const {element, elementRef}=useElement();

    useEffect(() => {
        if (mapContainerRef.current) {
            mapRef.current?.resize();
        }
    }, [selectedVessel,mapRef.current,mapContainerRef]);

    const handleResizeCallback = useCallback((newSize: any) => {
        handleResize(
            mapContainerRef,
            mapRef,
            selectedVessel !== null,
            newSize,
            (value: false | IVessel | null) => setSelectedVessel(value === false ? null : value),
            selectedVessel,
        );
    }, [windowWidth, windowHeight, zoomLevel]);
const tools = options?.tools;
    return (
      <>
        <style jsx>{styles}</style>
        <div className={variant === "fullscreen" ? "map-container" : "embedded"}>
          <div
            className="map-content"
            style={variant !== "fullscreen" ? { height: "100%", width: "100%", position: "relative" } : undefined}
          >
            <div
              className="map"
              ref={mapContainerRef}
              onDoubleClick={closeVessel}
              style={variant !== "fullscreen" ? { height: "100%", width: "100%" } : undefined}
            />
            {/* {selectedVessel && (
              <MapVesselDetails
              closeVessel={closeVessel}
                vessel={selectedVessel}
                setVessel={setSelectedVessel as (vessel: IVesselType) => void}
                onResize={handleResizeCallback}
              />
            )} */}
            {!loader.active && options?.tools && (
              <div className="map-tools">
                <div className="map-tools--layer">


                    <UiIcon icon="fa-xmark" onClick={() => setStyleId("clwvqyuxe01bl01q11d6m8nh7")}/>
            
                </div>
                <div className='d-flex s-w-100'> </div>
                {tools && typeof tools !== "boolean"&&tools}
                {/* <MapSearch searched={searched} handleSearch={handleSearch} /> */}
                <UiIcon
                  onClick={() => flyToView(mapRef.current, { zoom: zoomLevel > Number(options?.zoom) ? options?.zoom : VESSEL_ZOOM })}
                  icon={zoomLevel > VESSEL_ZOOM ? "fa-globe" : "fa-map"}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
};

export default UiMap;
