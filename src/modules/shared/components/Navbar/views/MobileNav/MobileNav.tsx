// Relative Path: ./MobileNav.tsx
import React, { useEffect } from 'react';
import styles from './MobileNav.scss';
import { IRoute } from '../../data/routes';
import UiButton from '@webstack/components/UiButton/UiButton';

// Remember to create a sibling SCSS file with the same name as this component
interface IMobileNav {
    routes: IRoute[],
    handleClick: (e: any) => void,
    onBack?: (e: any) => void,
};
const MobileNav: React.FC<IMobileNav> = ({ routes, handleClick, onBack, }) => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='navbar__mobile'>
                {onBack && <div className='navbar__mobile--actions'>
                    <div>
                        <UiButton
                            variant='flat'
                            traits={{ beforeIcon: 'fa-chevron-left' }}
                            onClick={onBack}>back</UiButton>
                    </div>
                </div>}
                <div className='navbar__mobile--content'>
                    {routes && routes.map((route: IRoute, key: number) => (
                        <div key={key} className='navbar__mobile--content__nav-item' 
                            onClick={() => handleClick(route)}
                        >
                            <UiButton
                                traits={{beforeIcon:route?.icon}}
                                variant='nav-item'
                            >{route.label}</UiButton>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default MobileNav;