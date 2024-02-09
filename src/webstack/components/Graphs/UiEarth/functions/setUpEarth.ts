import { GlobeInstance } from "globe.gl";
import {  IEarth } from "../models/IEarth";
const setUpEarth = (
    myGlobe: GlobeInstance,
    options: IEarth
) => {
    const { globeImageUrl } = options;
    const rotate = options.rotate;
    if (!myGlobe) return;

    // Ensure the globe image URL points to a high-resolution image.
    myGlobe.globeImageUrl(globeImageUrl || 'https://shadedrelief.com/natural3/ne3_data/8192/textures/2_no_clouds_8k.jpg');

    // Configure auto-rotation if enabled.
    if (rotate && typeof rotate === 'object') {
        myGlobe.controls().autoRotate = true;
        myGlobe.controls().autoRotateSpeed = rotate.speed || 0.5; // Adjust speed as needed
    } else {
        myGlobe.controls().autoRotate = false;
    }

    // Additional configura
    // backgroundImage? .backgroundImage(backgroundImage):.backgroundColor(backgroundColor)
    // myGlobe.htmlAltitude(100)

    //    .pointsData(gData)
    //    .pointAltitude('size')
    //    .pointColor('color');
}


export default setUpEarth;
