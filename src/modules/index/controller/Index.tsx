import { useEffect, useState } from 'react';
import styles from './Index.scss';

const Index = () => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <>
            <style jsx>{styles}</style>
            {isClient && (
                <video autoPlay={true} muted={true} loop className="background-video" controls={false}>
                    <source src="/assets/backgrounds/contour_bg.webm" type="video/webm" />
                    Your browser does not support the video tag.
                </video>
            )}
            <div className='home'>
                {/* Your content here */}
            </div>
        </>
    );
};

export default Index;
