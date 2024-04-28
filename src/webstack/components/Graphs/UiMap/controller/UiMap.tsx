"use client";
import ReactDOM from 'react-dom';

// https://github.com/louisyoong/mapbox-react/blob/main/src/components/Map.tsx
import React, { useEffect, useRef } from "react";
import mapboxgl, { MapboxOptions } from "mapbox-gl";
import styles from "./UiMap.scss";
import useLocation from "@webstack/hooks/user/useLocation";
import IMap, { VesselFeature } from "../models/IUiMap";

const INTERVALS = 5000
mapboxgl.accessToken =
  "pk.eyJ1IjoibGFuZG9sYWJydW0iLCJhIjoiY2xnMDZ1aGVsMHJ5MzNsdGF3aHZhM3dtbyJ9.UihOXtkEeRk5tQDgDK8cLg";




const UiMap: React.FC<IMap> = (props: IMap) => {
  const { vessels } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const userLocation = useLocation();


  const handleVessels = (map: any) => {
    if (!map || !vessels) return;
    map.on('load', () => {
      // ADD EARTH BG
      // map.addLayer({
      //   id: `background-layer`,
      //   type: "background",
      //   paint: {
      //     "background-color": "#ff0000"
      //   },
      // });
      map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', 
      (error: any, image: any) => {
        if (error) throw error;
        map.addImage('custom-marker', image);
        vessels.forEach(vessel => {
          map.addSource(`vessel-source-${vessel.id}`, {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: vessel.coordinates
                },
                properties: {
                  name: vessel.name
                }
              }]
            }
          });

          map.addLayer({
            id: `vessel-layer-${vessel.id}`,
            type: 'symbol',
            source: `vessel-source-${vessel.id}`,
            layout: {
              'icon-image': 'custom-marker',
              'icon-size': 0.09,
              'icon-allow-overlap': true
            }
          });
          // Add vessel line source and layer
          map.addSource(`vessel-line-source-${vessel.id}`, {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.addLayer({
            id: `vessel-line-layer-${vessel.id}`,
            type: "line",
            source: `vessel-line-source-${vessel.id}`,
            paint: {
              "line-color": "#ff0000",
              "line-width": 2,
            },
          });

          // Initialize vessel path
          vessel.path = [
            {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: vessel.coordinates,
              },
              properties: {
                name: vessel.name,
              },
            },
          ];
        });

        setInterval(() => {
          if (!map || !map.isStyleLoaded()) return; // Ensure the map and its style are fully loaded

          vessels.forEach(vessel => {
            vessel.coordinates = [
              vessel.coordinates[0] + 0.01 * Math.random(),
              vessel.coordinates[1] + 0.01 * Math.random(),
            ];

            const source = map.getSource(`vessel-source-${vessel.id}`);
            if (source && source?.type && source.type === 'geojson') {
              const newFeature: VesselFeature = {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: vessel.coordinates
                },
                properties: {
                  name: vessel.name
                }
              };
              source.setData({
                type: 'FeatureCollection',
                features: [newFeature]
              });
            }
          });
        }, INTERVALS);
      });
      return () => map.remove();
    });
  }

  useEffect(() => {
    if (mapContainer.current && userLocation) {
      const mapBoxOptions: MapboxOptions = {
        container: mapContainer?.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation,
        zoom: 3,
        maxZoom: 15,
      };
      handleVessels(new mapboxgl.Map(mapBoxOptions));
    }
  }, [userLocation, vessels]);

  return (
    <>
      <style jsx>{styles}</style>
      <div className='ui-map'>
      <div className='map-container' ref={mapContainer}   />
      </div>
    </>
  );
};

export default UiMap;