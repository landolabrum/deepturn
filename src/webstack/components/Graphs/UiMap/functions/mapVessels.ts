import mapboxgl, { Map as MapboxMap } from "mapbox-gl";


// Define a type for the vessel object
export type Vessel = {
    location: {
        lat: number;
        lon: number;
    };
    // Add additional properties that a vessel might have
    name?: string;
    message?: string;
};

// Function to add markers to the map
const addVessels = (map: MapboxMap, vessels: Vessel[], handleClick: (vessel: Vessel) => void): void => {
    if(!vessels)return;
    vessels.forEach((vessel) => {
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = "10px";
        el.style.height = "10px";
        el.style.backgroundColor = "blue6541";
        el.style.borderRadius = "50%";
        el.style.boxShadow = "0 1px 4px 5px #ddf";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "#000";  // Text color changed for visibility

        el.onclick = () => handleClick(vessel);

        new mapboxgl.Marker(el)
            .setLngLat([vessel.location.lon, vessel.location.lat])
            .addTo(map);
    });
};

export default addVessels;