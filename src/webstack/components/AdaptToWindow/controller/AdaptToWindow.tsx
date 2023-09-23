// Relative Path: ./AdaptToWindow.tsx
import React, { useEffect, useRef, useState } from 'react';
import styles from './AdaptToWindow.scss';
import { IAdaptToWindow, windowLoc } from '../models/IAdaptToWindow';
import AdaptWindowBackground from '../views/AdaptWindowBackground/AdaptWindowBackground';
import useWindow from '@webstack/hooks/useWindow';

// Remember to create a sibling SCSS file with the same name as this component




const AdaptToWindow: React.FC<IAdaptToWindow> = (props) => {
    const {
        children,
        variant,
        background,
        sm,
        md,
        lg
    }: IAdaptToWindow = props;
    const window = useWindow();
    const width = window.width;
    const [elClass, setElClass] = useState<string | ''>('');
    const elRef = useRef<any | null>(null);

    const elClassStylesHandler = (cless: any) => {
   
        let variantClass; 
        if (variant)variantClass = `${cless}__${variant}`;
        function styleDistributor(sZval: any){
            // alert(`${JSON.stringify(sZval)}`)
            if (sZval.style && elRef.current) {
                for (let key in sZval.style) {
                    if (key in elRef.current.style) {
                        elRef.current.style[key] = sZval.style[key];
                    }
                }
            }
            
        }
        function classArrayDistributor(sZval: any){
            let positionClass:string = ` ${cless}__${sZval}`;
            const strArr = typeof sZval == 'string' ? sZval.split(' '):sZval;
            function iT(val:any){
                positionClass = '';
                val.split(' ').forEach(
                    (p:windowLoc | undefined)=>positionClass += ` ${cless}__${p}`
                )
            }
            // (ex) SIZE = 'top'
            if(typeof sZval == 'object')iT(sZval.value);

            // (ex) SIZE = {value:'top', style:{padding: '10px}}
            else if(sZval && strArr.length > 1)iT(sZval);

            return positionClass;
        }
        switch (true) {
            case width < 900 && !!sm:
                styleDistributor(sm);
                cless += classArrayDistributor(sm);
                break;
                case width <= 1100 && !!md:
                styleDistributor(md);
                cless += classArrayDistributor(md);
                break;
                case width > 1260 && !!lg:
                styleDistributor(lg);
                cless += classArrayDistributor(lg);
                break;
            default:
                break;
        }
        return `${cless}${variantClass?' '+variantClass:''}`;
    }
    

    useEffect(() => {
       setElClass(elClassStylesHandler("adapt-to-window__element"));
    }, [width, elRef?.current]);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='dev' style={{padding: '1px'}}>
          ele: {elClass}
        </div>
            <AdaptWindowBackground background={background} window={window} />
            <div className='adapt-to-window'>
            <div className='adapt-to-window-content'>
                <div ref={elRef} className={elClass}>
                    {children}
                </div>
            </div>
            </div>
        </>
    );
};

export default AdaptToWindow;