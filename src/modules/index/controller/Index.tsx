// Relative Path: ./Home.tsx
import React, { useEffect } from 'react';
import styles from './Index.scss';
import { useLoader } from '@webstack/components/Loader/Loader';

const Index = () => {
 

    return(
        <>
            <style jsx>{styles}</style>
            <video autoPlay={true} loop muted className="background-video">
    <source src="/assets/backgrounds/contour_bg.webm" type="video/webm"/>
    Your browser does not support the video tag.
</video>
            <div className='home'>
            </div>
        </>
    );
};

export default Index;