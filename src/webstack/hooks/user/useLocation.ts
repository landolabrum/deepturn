import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useModal } from '@webstack/components/modal/contexts/modalContext';

export interface ICoordinates {
    lat: number;
    lng: number;
}

const useLocation = () => {
    const { openModal, closeModal } = useModal();
    const [location, setLocation] = useState<ICoordinates | undefined>();
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

    const handlePermissionChange = useCallback(() => {
        const permissionStatus = permissionStatusRef.current;
        if (permissionStatus && permissionStatus.state === 'granted') {
            closeModal();
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            setPermissionDenied(true);
        }
    }, [closeModal, error, success]);

    const requestLocation = useCallback(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus: PermissionStatus) => {
                permissionStatusRef.current = permissionStatus;
                permissionStatus.addEventListener('change', handlePermissionChange);

                if (permissionStatus.state === 'granted') {
                    navigator.geolocation.getCurrentPosition(success, error);
                } else if (permissionStatus.state === 'prompt') {
                    openModal({
                        title: "Know Your Location",
                        confirm: {
                            title: "Enable Location",
                            body: "To use this feature, please enable location access.",
                            statements: [
                                {
                                    label: 'Allow',
                                    onClick: () => {
                                        permissionStatusRef.current?.addEventListener('change', handlePermissionChange);
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
            }).catch(error => {
                console.error("Error querying permissions", error);
                setPermissionDenied(true);
            });
        } else {
            console.error("Permission API not supported");
            setPermissionDenied(true);
        }
    }, [openModal, closeModal, success, error, handlePermissionChange]);

    return {
        location,
        requestLocation, // This function can be triggered by a user action
        permissionDenied,
    };
};

export default useLocation;
