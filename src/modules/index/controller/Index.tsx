import React from 'react';
import Rectangle3D from '@webstack/components/threeJs/Rectangle3d';
import styles from './Index.scss';

const Index = () => {
    const handleDrag = (event:any, mesh:any) => {
        // Custom drag logic here
        console.log("Dragging", event, mesh);
    };

    return (
        <>
            <style jsx>{styles}</style>
            <div className='background-video' data-video="/assets/backgrounds/contour_bg.webm"/>
            <div className='home'>
                <Rectangle3D 
                    object={{
                        // ... other object properties
                        onDrag: handleDrag
                    }}
                    // ... scene properties
                />
            </div>
        </>
    );
};

export default Index;
