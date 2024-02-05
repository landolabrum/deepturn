import { GlobeInstance } from "globe.gl";
import {  IEarth } from "../models/IEarth";

const setUpScene = (
    myGlobe: GlobeInstance,
    containerRef: React.MutableRefObject<any>,
    options:IEarth
    ) => {
    if (!myGlobe || !containerRef.current) return;
    const {showAtmosphere, showGraticules, backgroundColor, backgroundImageUrl, position}=options;
    const globeRadius = myGlobe.getGlobeRadius();
    const pos={
        lat: position?.lat || 0,
        lng: position?.lng || 0,
        altitude:position?.alt || globeRadius * .02
    };
    const containerWidth = containerRef.current.offsetWidth;

    myGlobe.width(containerWidth)
        .height(containerWidth)
        .pointOfView({...pos}, 0)
        .showAtmosphere(showAtmosphere || false)
        .showGraticules(showGraticules || false)

    if (backgroundImageUrl) myGlobe.backgroundImageUrl(backgroundImageUrl);
    else myGlobe.backgroundColor(backgroundColor || "#00000000");
};


export default setUpScene;
