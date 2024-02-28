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
        points = [{
            name: "Holladay", lat: 40.65654718559953, lng: -111.81447097331733,
            alt: 0,
        }],
        position = { lat: 40.65654718559953, lng: -111.81447097331733, alt: .5 },
        backgroundColor,
        showAtmosphere,
        backgroundImageUrl,
        showGraticules,
        rotate,
        onPointClick
    }: IEarth
) => {
    const earthRef = useRef<any | undefined>();
    const containerRef = useRef<any | undefined>();
    const earthImgs: any = [
        { name: "map", value: "no-clouds.jpg" },
        { name: "lrg", value: "earth-large.jpg" },
        // { name: "dark", value: "dark.jpg" },
        // { name: "day", value: "day.jpg" },
        // { name: "night", value: "night.jpg" },
    ]

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
        rotate,
    };
    const pointsDefinitions = { pts, points, setPoints };
    const myGlobe: GlobeInstance = earthRef?.current && Globe()(earthRef.current);

    // Ensure that controls are properly initialized
    const controls = myGlobe ? myGlobe.controls() : null;

    const handleEarthImg = (img: any) => {
        setEarthImg({ ...img, value: `/assets/globe-textures/${img.value}` });
        setUpEarth(
            myGlobe,
            controls, // Pass controls instead of null
            options 
        );
    }
    // Define handlePoint function
    const handlePoint = (id: string) => {
        onPointClick && onPointClick(id)
        // console.log(`Marker ID: ${id}`);
        // openModal({
        //     variant:'popup',
        //     // title:'ji',
        //     children:<AdminCustomerDetails customer_id={id}/>
        // });
        // You can add more logic here if needed
    };

    useEffect(() => {
        if (!myGlobe) return;
        setUpScene(myGlobe, containerRef, options, width);
        setUpEarth(myGlobe, controls, options);

        // Now pass handlePoint as an argument to setUpPoints
        setUpPoints(
            myGlobe,
            pointsDefinitions,
            handlePoint // Pass the function here
        );
    }, [width, myGlobe, setUpPoints, setUpEarth, setUpScene, earthRef.current, controls, ]); // Include handlePoint in the dependencies array


    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-earth' >
                <div className='ui-earth__header'>
                    <div className='ui-earth__tools'>
                        <div className='ui-earth__tools-tool'>
                            <UiSelect openDirection='left' value={earthImg?.name} options={earthImgs} onSelect={handleEarthImg} />
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
