// Relative Path: ./UiElements.tsx
import React from 'react';
import styles from './UiElements.scss';

// Remember to create a sibling SCSS file with the same name as this component

const UiElements: React.FC = () => {
    return (
        <>
            <style jsx>{styles}</style>
            <div className='ui-elements'>
                <div className='ui-elements__header'>
                    <div className='ui-elements__title'>
                        
                    </div>
                </div>
                <div className='ui-elements__content'>
                    <div className='ui-elements__body'>

                    </div>
                </div>
                <div className='ui-elements__footer'>

                </div>
            </div>
        </>
    );
};

export default UiElements;