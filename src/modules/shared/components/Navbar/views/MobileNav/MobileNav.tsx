// Relative Path: ./MobileNav.tsx
import React, { useEffect } from 'react';
import styles from './MobileNav.scss';
import { IRoute } from '../../data/routes';
import UiButton from '@webstack/components/UiButton/UiButton';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
interface IMobileNav {
    routes: IRoute[],
    handleClick: (e: any) => void,
    onBack?: (e: any) => void,
};
const MobileNav: React.FC<IMobileNav> = ({ routes, handleClick, onBack, }):React.ReactElement => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='navbar__mobile'>
                {onBack && <div className='navbar__mobile--actions'>
                    <div>
                        <UiButton
                            variant='inherit'
                            traits={{ beforeIcon: 'fa-chevron-left' }}
                            onClick={onBack}>back</UiButton>
                    </div>
                </div>}
                <div className='navbar__mobile--content'>
                    {routes && routes.reverse().map((route: IRoute, key: number) => 
                       {
                        if(route?.hide)return<></>;
                        return (
                            <div 
                                key={key} 
                                className='navbar__mobile--content__nav-item' 
                                onClick={() => handleClick(route)}
                            >
                                <div>
                                <UiButton
                                    traits={{beforeIcon:route?.icon}}
                                    variant='inherit'
                                >
                                    {route.label}{route?.href =='/cart' ?'cart':''}
                                </UiButton>
                            </div>
                            </div>
                        )}
                    )}
                </div>
            </div>
        </>
    );
};

export default MobileNav;