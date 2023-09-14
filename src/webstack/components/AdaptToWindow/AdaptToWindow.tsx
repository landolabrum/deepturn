// Relative Path: ./AdaptToWindow.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './AdaptToWindow.scss';
import { IAdaptToWindow } from './models/IAdaptToWindow';
import AdaptWindowBackground from './components/AdaptWindowBackground/AdaptWindowBackground';
import useWindow from '@webstack/hooks/useWindow';

// Remember to create a sibling SCSS file with the same name as this component




const AdaptToWindow: React.FC<IAdaptToWindow> = (props) => {
    const {
        children,
        variant,
        background,
    
    }: IAdaptToWindow = props;
    const window = useWindow();
    const height = window.height;
    const width = window.width;
    let sm = background?.sm;
    const md = background?.md;
    const lg = background?.lg;

    const [clzz, setClzz] = useState<string>('');
    const Clzz = (cless: string) => {
        let newClz = cless;
        // if (variant) cless = cless + ` ${cless}-${variant}`;
        if (sm && width < 900) cless = ` ${cless}-${sm}`;
        if (md && width < 1100) cless = ` ${cless}-${md}`;
        if (lg && width < 1200) cless = ` ${cless}-${lg}`;
        return newClz
    }

    useEffect(() => {
        setClzz(Clzz("adapt-to-window__element"));
    }, [width]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='adapt-to-window'>
                <AdaptWindowBackground background={background} />
                <div className={clzz}>
                    {children}
                </div>
            </div>
        </>
    );
};

export default AdaptToWindow;