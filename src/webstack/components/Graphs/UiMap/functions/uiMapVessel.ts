import { IVessel, VesselFeature } from "../models/IUiMap"; // Importing as per your file structure
const INTERVALS = 5000

// Define the Vessel interface


// Revised handleVessels function
const handleVessels = (map: any, vessels?: IVessel[]) => {
  if (!map || !vessels) return;

  map.on('style.load', () => {
    map.loadImage('https://docs.mapbox.com/mapbox-gl-js/assets/cat.png', (error: any, image: any) => {
      if (error) throw error;
      map.addImage('custom-marker', image);

      vessels.forEach((vessel) => {
        // Add source and layers for vessel markers
        map.addSource(`vessel-source-${vessel.id}`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point', 
                coordinates: vessel.coordinates,
              },
              properties: {
                name: vessel.name,
              },
            }],
          },
        });

        map.addLayer({
          id: `vessel-layer-${vessel.id}`,
          type: 'symbol',
          source: `vessel-source-${vessel.id}`,
          layout: {
            'icon-image': 'custom-marker',
            'icon-size': 0.09,
            'icon-allow-overlap': true,
          },
        });

        // Initialize vessel path
        vessel.path = [{
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: vessel.coordinates,
          },
          properties: {
            name: vessel.name,
          },
        }];

        // Add source and layer for vessel path
        map.addSource(`vessel-line-source-${vessel.id}`, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [],
          },
        });

        map.addLayer({
          id: `vessel-line-layer-${vessel.id}`,
          type: 'line',
          source: `vessel-line-source-${vessel.id}`,
          paint: {
            'line-color': '#ff0000',
            'line-width': 2,
          },
        });
      });

      setInterval(() => {
        if (!map || !map.isStyleLoaded()) return; // Ensure map and style are fully loaded

        vessels.forEach(vessel => {
          vessel.coordinates = [
            vessel.coordinates[0] + 0.01 * Math.random(),
            vessel.coordinates[1] + 0.01 * Math.random(),
          ];

          const source = map.getSource(`vessel-source-${vessel.id}`);
          if (source && source.type === 'geojson') {
            const newFeature: VesselFeature = {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: vessel.coordinates,
              },
              properties: {
                name: vessel.name,
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

export default handleVessels;
