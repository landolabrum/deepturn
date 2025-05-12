import React, { useState, useEffect } from 'react';
import styles from './Spotify.scss';
// import SpotifyControls from '../views/SpotifyControls/SpotifyControls';
import { getService } from '@webstack/common';
import IHomeService from '~/src/core/services/HomeService/IHomeService';

const Spotify: React.FC = () => {
    const homeService = getService<IHomeService>("IHomeService");
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await homeService.getSpotifyToken();
                setToken(response.access_token);
            } catch (error) {
                console.error('Failed to fetch Spotify token:', error);
            }
        };

        fetchToken();
    }, [homeService]);

    return (
        <>
            <style jsx>{styles}</style>
            <div className='spotify'>
            <div className='spotify-controller'>
                {/* 
                    {token ? <SpotifyControls token={token} /> : <div>Loading...</div>} */}
                </div>
            </div>
        </>
    );
};

export default Spotify;
