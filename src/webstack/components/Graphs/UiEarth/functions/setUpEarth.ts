import { GlobeInstance } from "globe.gl";
import {  IEarth } from "../models/IEarth";

const setUpEarth = (
    myGlobe: GlobeInstance,
    options: IEarth
) => {
    const {  globeImageUrl } = options;
    if (!myGlobe) return;
    myGlobe.globeImageUrl(globeImageUrl || '//unpkg.com/three-globe/example/img/earth-night.jpg')


    // backgroundImage? .backgroundImage(backgroundImage):.backgroundColor(backgroundColor)
    // myGlobe.htmlAltitude(100)

    //    .pointsData(gData)
    //    .pointAltitude('size')
    //    .pointColor('color');
}


export default setUpEarth;
