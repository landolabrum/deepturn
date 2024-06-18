// Relative Path: ./MapSearch.tsx
import React, { useEffect, useState } from 'react';
import styles from './MapSearch.scss';
import UiInput from '@webstack/components/UiForm/components/UiInput/UiInput';

// Remember to create a sibling SCSS file with the same name as this component

const MapSearch: React.FC<any> = ({handleSearch, searched}:any) => {
    const [searchPlaceholder, setSearchPlaceholder] = useState<string>("where to?");
    let placeholderInterval: NodeJS.Timeout;
    const cityNames = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"];

    useEffect(() => {
        const handleSearchIntervals = () => {
            let index = 0;
            placeholderInterval = setInterval(() => {
                setSearchPlaceholder(cityNames[index]);
                index = (index + 1) % cityNames.length;
            }, 5000);

            return () => {
                clearInterval(placeholderInterval);
            };
        };

        setTimeout(() => {
            handleSearchIntervals();
        }, 5000);
    }, []);
    return (
        <>
            <style jsx>{styles}</style>
            <div className='map-search'>
                <UiInput name='address' variant='transparent round' placeholder={searchPlaceholder} value={searched} onChange={handleSearch} />
            </div>
        </>
    );
};

export default MapSearch;