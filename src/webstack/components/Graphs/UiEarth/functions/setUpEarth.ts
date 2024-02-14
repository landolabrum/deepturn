import { GlobeInstance } from "globe.gl";
import { IEarth } from "../models/IEarth";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three";


function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const calculateVisibleTiles = (myGlobe: GlobeInstance, controls: OrbitControls | null) => {
    if (!controls) return []; // If controls is null, return an empty array

    // Get the current camera position from OrbitControls
    const cameraPosition = controls && controls.target ? controls.target.clone() : new Vector3();


    // Calculate the zoom level based on the distance from the camera to the Earth's surface
    const zoomLevel = calculateZoomLevel(controls);

    // Calculate tile coordinates based on camera position and zoom level
    const visibleTiles: string[] = [];
    const tileSize = 256; // Standard tile size

    const tileCoordinates = myGlobe.toGlobeCoords(cameraPosition.x, cameraPosition.y);
    if (!tileCoordinates) return visibleTiles; // Unable to calculate tile coordinates

    const { lat, lng } = tileCoordinates;

    // Calculate the number of tiles to cover the viewport
    const numTilesX = Math.ceil(window.innerWidth / tileSize);
    const numTilesY = Math.ceil(window.innerHeight / tileSize);
    const generateTileUrl = (zoomLevel?:any, tileX:any, tileY:any, x, y) => {
        if (isNaN(zoomLevel) || isNaN(tileX) || isNaN(tileY)) {
            console.error('Invalid tile calculation:', {zoomLevel, tileX, tileY});
            return null; // Return null to indicate an invalid URL
        }
        return `https://a.tile.openstreetmap.org/${zoomLevel}/${tileX + x}/${tileY + y}.png`;
    };
    for (let y = 0; y < numTilesY; y++) {
        for (let x = 0; x < numTilesX; x++) {
            const tileX = Math.floor((lng + 180) / 360 * (1 << zoomLevel));
            const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * (1 << zoomLevel));
            const tileUrl = generateTileUrl(zoomLevel, tileX, tileY, x, y);
            if (tileUrl) visibleTiles.push(tileUrl); // Only add valid URLs
        }
    }

    return visibleTiles;
}
const calculateZoomLevel = (controls: OrbitControls) => {
    if (!controls || !controls.object) {
        console.error('OrbitControls or the associated camera is not properly initialized.');
        return 0; // Default zoom level if not properly initialized
    }

    // Ensure that the camera distance is always greater than the globe radius to avoid negative altitudes
    const globeRadius = 6371; // Approximate Earth's radius in kilometers
    const cameraDistance = Math.max(controls.object.position.length(), globeRadius + 1); // Ensure distance is greater than radius
    const altitude = cameraDistance - globeRadius;
    const maxAltitude = 20000; // Define max altitude for zoom level calculation

    // Ensure that altitude is positive to avoid NaN results
    let zoomLevel = altitude > 0 ? Math.max(0, 19 - Math.log2(altitude / maxAltitude * 19)) : 19;

    return Math.min(Math.max(zoomLevel, 0), 19); // Clamp zoom level between 0 and 19
};


const debouncedLoadTiles = debounce((tileUrl:string) => {
    const image = new Image();
    image.crossOrigin = "Anonymous"; // Enable CORS for cross-origin requests
    image.onload = () => console.log('Loaded tile:', tileUrl);
    image.onerror = (error) => console.error('Error loading tile:', tileUrl, error);
    image.src = tileUrl;
}, 250); // 250 ms delay

function loadTiles(tiles:any) {
    tiles.forEach(debouncedLoadTiles);
}


const setUpEarth = (
    myGlobe: GlobeInstance,
    controls: OrbitControls | null,
    options: IEarth // Options including globeImageUrl and other settings
) => {
    if (!myGlobe || !controls) return; // Ensure both myGlobe and controls are defined

    // Set globe texture
    if (options.globeImageUrl) {
        myGlobe.globeImageUrl(options.globeImageUrl);
    }

    // Example: Setting up atmosphere and other visual options
    myGlobe.atmosphereColor(options.atmosphereColor || 'rgba(0, 120, 255, 0.5)');
    myGlobe.atmosphereAltitude(options.atmosphereAltitude || 0.15);

    // Configure auto-rotation if enabled
    if (options.rotate && typeof options.rotate === 'object') {
        myGlobe.controls().autoRotate = true;
        myGlobe.controls().autoRotateSpeed = options.rotate.speed || 0.5; // Adjust speed as needed
    } else {
        myGlobe.controls().autoRotate = false;
    }

    // Dynamic tile loading (from your existing setup)
    document.addEventListener('mousemove', () => {
        const visibleTiles = calculateVisibleTiles(myGlobe, controls);
        loadTiles(visibleTiles);
    });
};





export default setUpEarth;
