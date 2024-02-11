// Relative Path: ./GlobeTwo.tsx
import styles from './UiEarth.scss';
import React, { useEffect, useRef, useState } from 'react';
import Globe, { GlobeInstance } from 'globe.gl';
import { EarthPoint, IEarth } from '../models/IEarth';
import setUpEarth from '../functions/setUpEarth';
import setUpPoints from '../functions/setUpPoints';
import setUpScene from '../functions/setUpScene';
import useWindow from '@webstack/hooks/useWindow';
import UiSelect from '@webstack/components/UiSelect/UiSelect';


const UiEarthObject = (
    {
        globeImageUrl,
        points = [{
            name: "Holladay", lat: 40.65654718559953, lng: -111.81447097331733,
            alt: 0,
        }],
        position = { lat: 40.65654718559953, lng: -111.81447097331733, alt: .5 },
        backgroundColor,
        showAtmosphere,
        backgroundImageUrl,
        showGraticules,
        rotate
    }: IEarth
) => {
    const earthRef = useRef<any | undefined>();
    const containerRef = useRef<any | undefined>();
    const earthImgs: any = [
        { name: "map", value: "no-clouds.jpg" },
        { name: "lrg", value: "earth-large.jpg" },
        { name: "dark", value: "dark.jpg" },
        { name: "day", value: "day.jpg" },
        { name: "night", value: "night.jpg" },
        // { name: "topology", value: "topology.png" },
        // { name: "sky", value: "sky.png" },
    ]
    // const earthImgs: any = [
    //     { name: "map", value: "no-clouds.jpg" },
    //     { name: "blue marble", value: "blue-marble.jpg" },
    //     { name: "dark", value: "dark.jpg" },
    //     { name: "day", value: "day.jpg" },
    //     { name: "night", value: "night.jpg" },
    //     // { name: "topology", value: "topology.png" },
    //     // { name: "sky", value: "sky.png" },
    // ]
  
    const [earthImg, setEarthImg] = useState<any | undefined>({
        ...earthImgs[0],
        value: `/assets/globe-textures/${earthImgs[0].value}`
    });
    const [pts, setPoints] = useState<EarthPoint[] | undefined>();
    const { width } = useWindow();

    const options: IEarth = {
        showAtmosphere,
        showGraticules,
        backgroundColor,
        backgroundImageUrl,
        position,
        globeImageUrl: earthImg?.value,
        rotate,  // Add this line
    };
    const pointsDefinitions = { pts, points, setPoints };
    const myGlobe: GlobeInstance = earthRef?.current && Globe()(earthRef.current);
    const handleEarthImg = (img: any) => {

        setEarthImg({ ...img, value: `/assets/globe-textures/${img.value}` });
        // setEarthImg({ ...img, value: `//unpkg.com/three-globe/example/img/earth-${img.value}` });
        setUpEarth(
            myGlobe,
            options
        );
    }

    useEffect(() => {
        if (!myGlobe) return;
        setUpScene(myGlobe, containerRef, options, width);
        setUpEarth(
            myGlobe,
            options
        );

        const pointsSet = setUpPoints(
            myGlobe,
            pointsDefinitions
        );
    }, [width, myGlobe, setUpPoints, setUpEarth, setUpScene, earthRef.current]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-earth' >
                <div className='ui-earth__header'>
                    <div className='ui-earth__tools'>
                        <div className='ui-earth__tools-tool'>
                            <UiSelect openDirection='right' value={earthImg?.name} options={earthImgs} onSelect={handleEarthImg} />
                        </div>
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
