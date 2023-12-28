import Rectangle3D from '@webstack/components/threeJs/Rectangle3d';
import HomeGridItem from '../views/HomeGridItem/HomeGridItem';
import styles from './Index.scss';

const Index = () => {

    return (
        <>
            <style jsx>{styles}</style>
            <div className='background-video' data-video="/assets/backgrounds/contour_bg.webm"/>
            <div className='home'>
            <HomeGridItem >
            {/* <img   src="/merchants/nirv1/product_line_1.png"/> */}

            <Rectangle3D/>
            </HomeGridItem>
            </div>
        </>
    );
};

export default Index;
