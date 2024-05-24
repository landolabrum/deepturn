import React, { useState, useEffect } from 'react';

export interface IMouse {
    position: { x: number, y: number };
    isDragging: boolean;
    isClicking: boolean;
}

const useMouse = (): IMouse => {
    const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isClicking, setIsClicking] = useState<boolean>(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({
                x: e.clientX,
                y: e.clientY,
            });

            if (isClicking) {
                setIsDragging(true);
            }
        };

        const handleMouseDown = () => {
            setIsClicking(true);
        };

        const handleMouseUp = () => {
            setIsClicking(false);
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isClicking]);

    return {
        position,
        isDragging,
        isClicking,
    };
};

export default useMouse;
