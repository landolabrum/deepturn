// functions/mapRotate.ts

const secondsPerRevolution = 180;
const maxSpinZoom = 5;
const slowSpinZoom = 3;

let userInteracting = false;
let spinEnabled = true;

function mapRotate(map: any) {
    const zoom = map.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
            const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
            distancePerSecond *= zoomDif;
        }

        const center = map.getCenter();
        center.lng -= distancePerSecond;
        map.easeTo({ center, duration: 1000, easing: (n: number) => n });
    }
}

function setUpInteractionListeners(map: any) {
    map.on("mousedown", () => {
        userInteracting = true;
    });

    map.on("mouseup", () => {
        userInteracting = false;
    });
}

export { mapRotate, setUpInteractionListeners };
