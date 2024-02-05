// Relative Path: ./GlobeTwo.tsx
import styles from './UiEarth.scss';
import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeInstance } from 'globe.gl';
import { EarthPoint, IEarth } from '../models/IEarth';
import setUpEarth from '../functions/setUpEarth';
import setUpPoints from '../functions/setUpPoints';
import setUpScene from '../functions/setUpScene';
import useWindow from '@webstack/hooks/useWindow';


const UiEarthObject = (
    {
        globeImageUrl,
        points = [{
            name: "Holladay", lat: 40.65654718559953, lng: -111.81447097331733,
            alt: 0,
        }],
        position = { lat: 40.65654718559953, lng: -111.81447097331733 },
        backgroundColor,
        showAtmosphere,
        backgroundImageUrl,
        showGraticules
    }: IEarth
) => {
    const earthRef = useRef<any | undefined>();
    const containerRef = useRef<any | undefined>();
    const [pts, setPoints] = useState<EarthPoint[] | undefined>();
    const {width}=useWindow();
    const options:IEarth = { showAtmosphere, showGraticules, backgroundColor, backgroundImageUrl, position, globeImageUrl };
    const pointsDefinitions = {pts, points, setPoints};
    const myGlobe: GlobeInstance = earthRef?.current && Globe()(earthRef.current);

    useEffect(() => {
        if (!myGlobe) return;
        setUpScene(myGlobe, containerRef, options);
    }, [earthRef?.current,myGlobe]);
    useEffect(() => {
        if (!myGlobe) return;
        setUpEarth(
            myGlobe,
            options
        );
        setUpPoints(
            myGlobe,
            pointsDefinitions
        );
    }, [ width, myGlobe]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-earth' >
                <div className='ui-earth__header'>
                    <h1>Earth</h1>
                    <div className='ui-earth__tools'>
                    </div>
                </div>
                <div ref={containerRef} className='ui-earth__container'>
                    <div id='earth' ref={earthRef} />
                </div>
            </div>
        </>
    );
};

export default UiEarthObject;
