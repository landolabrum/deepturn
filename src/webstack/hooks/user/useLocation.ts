import React, { useEffect, useState, useRef } from 'react';
import { useModal } from '@webstack/components/modal/contexts/modalContext';

interface IUseLocation {
    lat: number;
    lng: number;
}

const useLocation = (): IUseLocation | undefined => {
    const { openModal, closeModal } = useModal();
    const [location, setLocation] = useState<IUseLocation | undefined>();
    const [permissionDenied, setPermissionDenied] = useState<boolean>(false);
    const permissionStatusRef = useRef<PermissionStatus | null>(null);

    const success = (position: GeolocationPosition) => {
        setLocation({
            lat: Number(position.coords.latitude.toFixed(2)),
            lng: Number(position.coords.longitude.toFixed(2)),
        });
    };

    const error = () => {
        console.error("Unable to retrieve your location");
        setPermissionDenied(true);
    };

    const handlePermissionChange = () => {
        const permissionStatus = permissionStatusRef.current;
        if (permissionStatus && permissionStatus.state === 'granted') {
            closeModal();
            navigator.geolocation.getCurrentPosition(success, error); // Retrieve location after permission is granted
        } else {
            setPermissionDenied(true);
        }
    };

    const initializeLocation = () => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus: PermissionStatus) => {
                permissionStatusRef.current = permissionStatus;

                permissionStatus.addEventListener('change', handlePermissionChange);

                if (permissionStatus.state === 'granted') {
                    navigator.geolocation.getCurrentPosition(success, error);
                } else if (permissionStatus.state === 'prompt') {
                    openModal({
                        title: "Know Your Location",
                        children: "To use this feature, please enable location access.",
                        confirm: {
                            title: "Enable Location",
                            statements: [
                                {
                                    label: 'Allow',
                                    onClick: () => {
                                        permissionStatusRef.current?.addEventListener('change', handlePermissionChange);
                                        // Now try to retrieve location again
                                        navigator.geolocation.getCurrentPosition(success, error);
                                    }
                                },
                                {
                                    label: "Deny",
                                    onClick: () => {
                                        closeModal();
                                        setPermissionDenied(true);
                                    }
                                }
                            ]
                        }
                    });
                } else {
                    setPermissionDenied(true);
                }
            });
        } else {
            console.error("Permission API not supported");
            setPermissionDenied(true);
        }
    };

    useEffect(() => {
        // if(location) alert(JSON.stringify(location))
        initializeLocation();
    }, []);

    return location;
};

export default useLocation;
