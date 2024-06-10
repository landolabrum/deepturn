import { Map as MapboxMap } from "mapbox-gl";
import debounce from 'lodash/debounce';

let userInteracting = false;
let spinEnabled = true;
let hoverPaused = false;
let interactionTimeout: NodeJS.Timeout | null = null;
let interactionStartTime: number | null = null;
let speedMultiplier = 1;

const defaultRpm = 500;
const defaultMaxZoom = 5;
const defaultZoom = 3;
const interactionDelay = 3000;
const easeDuration = 1500;
const hoverLayer = 'LandSvg';

export type IMapRotate = {
    rpm?: number;
    zoom?: number;
    maxZoom?: number;
};

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

    map.on("userhoverstart", () => {
        hoverPaused = true;
    });

    map.on("userhoverend", () => {
        hoverPaused = false;
        rotateFunction();
    });

    if (map.getLayer(hoverLayer)) {
        map.on('mouseenter', hoverLayer, () => map.fire('userhoverstart'));
        map.on('mouseleave', hoverLayer, () => map.fire('userhoverend'));
    } else {
        console.warn(`Layer "${hoverLayer}" does not exist`);
    }
}

function mapRotate(map: MapboxMap, options: IMapRotate = {}): void {
    const { rpm = defaultRpm, zoom = defaultZoom, maxZoom = defaultMaxZoom } = options;

    function rotate() {
        if (userInteracting || !spinEnabled || hoverPaused) return;
        const currentZoom = map.getZoom();
        const center = map.getCenter();
        if (currentZoom < maxZoom) {
            let distancePerSecond = (360 / rpm) * speedMultiplier;
            if (currentZoom > zoom) {
                const zoomDif = (maxZoom - currentZoom) / (maxZoom - zoom);
                distancePerSecond *= zoomDif;
            }
            center.lng -= distancePerSecond;
            map.easeTo({ center, duration: easeDuration, easing: (n: number) => n });
        }
    }

    map.on("moveend", rotate);
    rotate();
    setUpInteractionListeners(map, rotate);
}

export default mapRotate;
