"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import styles from "./UiMap.scss";

const INTERVALS = 5
interface Vessel {
  id: number;
  name: string;
  coordinates: number[];
  path: VesselFeature[];
}

interface VesselFeatureProperties {
  name: string;
}

interface VesselFeature
  extends GeoJSON.Feature<GeoJSON.Point, VesselFeatureProperties> { }




const useLocation = ():LngLatLike | undefined => {
  const [loc, setLoc] = useState<LngLatLike | undefined>()
  function success(position: any) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    setLoc([ Number(longitude.toFixed(2)),Number(latitude.toFixed(2))]);
  }

  function error() {
    console.error("Unable to retrieve your location");
    return;
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.error("Geolocation not supported");
    }
  }, [setLoc]);
  return loc;
}
const MapComponent: React.FC<any> = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const vessels: Vessel[] = [
    {
      id: 1,
      name: "Vessel 1",
      coordinates: [-74.0060152, 40.7127281],
      path: [],
    },
    { id: 2, name: "Vessel 2", coordinates: [-74.1, 40.8], path: [] },
    { id: 3, name: "Vessel 3", coordinates: [-73.9, 40.6], path: [] },
    { id: 4, name: "Vessel 4", coordinates: [-73.5, 40.4], path: [] },
    
    // Add more vessels as needed
  ];
  
  const userLocation = useLocation();
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibGFuZG9sYWJydW0iLCJhIjoiY2xnMDZ1aGVsMHJ5MzNsdGF3aHZhM3dtbyJ9.UihOXtkEeRk5tQDgDK8cLg";
    console.log(userLocation)
    if (mapContainer.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: userLocation,
        zoom: 5,
        maxZoom: 15,
      });

      // Add zoom controls
      map.addControl(new mapboxgl.NavigationControl(), "top-left");

      map.on("style.load", () => {
        map.loadImage(
          "https://docs.mapbox.com/mapbox-gl-js/assets/cat.png",
          (error: any, image: any) => {
            if (error) throw error;

            if (image) {
              // Add custom image to the map
              map.addImage("custom-marker", image);

              vessels.forEach((vessel) => {
                // Add vessel point source and layer
                map.addSource(`vessel-source-${vessel.id}`, {
                  type: "geojson",
                  data: {
                    type: "FeatureCollection",
                    features: [],
                  },
                });

                map.addLayer({
                  id: `vessel-layer-${vessel.id}`,
                  type: "symbol", // Change the layer type to "symbol"
                  source: `vessel-source-${vessel.id}`,
                  layout: {
                    "icon-image": "custom-marker",
                    "icon-size": 0.09, // Adjust the size of the custom image
                    "icon-allow-overlap": true, // Allow overlapping symbols
                  },
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
            } else {
              console.error("Failed to load the custom image.");
            }
          }
        );

        setInterval(() => {
          if (!map || !map.isStyleLoaded()) return; // Ensure the map and its style are fully loaded
          vessels.forEach((vessel) => {
            vessel.coordinates = [
              vessel.coordinates[0] + 0.01 * Math.random(),
              vessel.coordinates[1] + 0.01 * Math.random(),
            ];
            const source = map.getSource(`vessel-source-${vessel.id}`);

            if (source && source.type === "geojson") {
              const newFeature: VesselFeature = {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: vessel.coordinates,
                },
                properties: {
                  name: vessel.name,
                },
              };

              source.setData({
                type: "FeatureCollection",
                features: [newFeature],
              });

              const lineSource = map.getSource(
                `vessel-line-source-${vessel.id}`
              );
              if (lineSource && lineSource.type === "geojson") {
                // Update vessel path
                vessel.path.push(newFeature);

                const lineStringFeature: GeoJSON.Feature<
                  GeoJSON.LineString,
                  {}
                > = {
                  type: "Feature",
                  geometry: {
                    type: "LineString",
                    coordinates: vessel.path.map((f: any) => f.geometry.coordinates),
                  },
                  properties: {},
                };

                lineSource.setData({
                  type: "FeatureCollection",
                  features: vessel.path.length > 1 ? [lineStringFeature] : [],
                });
              }
            }
          });
        }, INTERVALS * 1000); // Update every 20 seconds
      });

      // Clean up on unmount
      return () => map.remove();
    }
  }, []);

  return (<>
    <style jsx>{styles}</style>
    <div
      className='map-container'
      ref={mapContainer}
    />
  </>
  );
};

export default MapComponent;