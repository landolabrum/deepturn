// TypeScript type definitions for better type checking
type MapboxMap = mapboxgl.Map;

let userInteracting = false;
let spinEnabled = true;
let interactionTimeout: NodeJS.Timeout | null = null;
let interactionStartTime: number | null = null;
let speedMultiplier = 1;

export type IMapRotate = {
    rpm?: number;
    zoom?: number;
    maxZoom?: number;
};

const defaultRpm = 180;
const defaultMaxZoom = 5;
const defaultZoom = 3;
import debounce from 'lodash/debounce';

const interactionDelay = 5000; // 5000 ms delay to resume rotation after the last interaction

function setUpInteractionListeners(map: MapboxMap, rotateFunction: () => void): void {
    const startInteraction = () => {
        if (interactionTimeout) clearTimeout(interactionTimeout);
        userInteracting = true;
        interactionStartTime = Date.now();
    };

    const endInteraction = debounce(() => {
        userInteracting = false;
        const interactionDuration = Date.now() - (interactionStartTime || Date.now());
        speedMultiplier = 1 + interactionDuration / 5000;
        rotateFunction();
    }, interactionDelay);

    map.on("mousedown", startInteraction);
    map.on("mouseup", endInteraction);
    map.on("touchstart", startInteraction);
    map.on("touchend", endInteraction);
    map.on("mousemove", endInteraction);
    map.on("touchmove", endInteraction);
}

function mapRotate(map: MapboxMap, options: IMapRotate = {}): void {
    const { rpm = defaultRpm, zoom = defaultZoom, maxZoom = defaultMaxZoom } = options;

    function rotate(): void {
        if (userInteracting || !spinEnabled) return;
        const currentZoom = map.getZoom();
        if (currentZoom < maxZoom) {
            let distancePerSecond = (360 / rpm) * speedMultiplier;
            if (currentZoom > zoom) {
                const zoomDif = (maxZoom - currentZoom) / (maxZoom - zoom);
                distancePerSecond *= zoomDif;
            }
            const center = map.getCenter();
            center.lng -= distancePerSecond;
            map.easeTo({ center, duration: 1000, easing: (n: number) => n });
        }
    }

    map.on("moveend", rotate);
    rotate(); // Start the rotation when the map is loaded
    setUpInteractionListeners(map, rotate); // Set up interaction listeners and pass the rotate function
}

export { mapRotate, setUpInteractionListeners };
