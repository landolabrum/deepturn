import { IMapMarker, VesselFeature } from "../models/IUiMap"; // Importing as per your file structure
const INTERVALS = 5000

// Define the Vessel interface


// Revised handleVessels function
const setMarkers = (map: any, markers?: IMapMarker[]) => {
  if (!map || !markers) return;

  map.on('style.load', () => {
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', (error: any, image: any) => {
      if (error) throw error;
      map.addImage('custom-marker', image);

      markers.forEach((marker) => {
        // Add source and layers for marker markers
        map.addSource(`marker-source-${marker.id}`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point', 
                coordinates: marker.coordinates,
              },
              properties: {
                name: marker.name,
              },
            }],
          },
        });

        map.addLayer({
          id: `marker-layer-${marker.id}`,
          type: 'symbol',
          source: `marker-source-${marker.id}`,
          layout: {
            'icon-image': 'custom-marker',
            'icon-size': 0.09,
            'icon-allow-overlap': true,
          },
        });

        // Initialize marker path
        marker.path = [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: marker.coordinates,
          },
          properties: {
            name: marker.name,
          },
        }];

        // Add source and layer for marker path
        map.addSource(`marker-line-source-${marker.id}`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: `marker-line-layer-${marker.id}`,
          type: 'line',
          source: `marker-line-source-${marker.id}`,
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
          },
        });
      });

      setInterval(() => {
        if (!map || !map.isStyleLoaded()) return; // Ensure map and style are fully loaded

        markers.forEach(marker => {
          marker.coordinates = [
            marker.coordinates[0] + 0.01 * Math.random(),
            marker.coordinates[1] + 0.01 * Math.random(),
          ];

          const source = map.getSource(`marker-source-${marker.id}`);
          if (source && source.type === 'geojson') {
            const newFeature: VesselFeature = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: marker.coordinates,
              },
              properties: {
                name: marker.name,
              },
            };
            source.setData({
              type: 'FeatureCollection',
              features: [newFeature],
            });
          }
        });
      }, INTERVALS);
    });
  });

  return () => map.remove();
};

export default setMarkers;
