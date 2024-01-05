import { useCallback, useState } from 'react';
import * as THREE from 'three';

const use3dDragRotate = (
    cameraRef: React.RefObject<THREE.PerspectiveCamera>,
    cubeRef: React.RefObject<THREE.Mesh>,
    lastRotationRef:any,
    onDragStart: () => void
) => {
    const [isDragging, setIsDragging] = useState(false);

    const onMouseDown = useCallback((event: MouseEvent) => {
        if (!cameraRef.current || !cubeRef.current) return;
        setIsDragging(true);
        onDragStart(); // Trigger any onDragStart actions
    }, [cameraRef, cubeRef, onDragStart]);

// Inside use3dDragRotate hook
const onMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !cameraRef.current || !cubeRef.current) return;

    const deltaX = event.movementX;
    const deltaY = event.movementY;
    const rotationSpeed = 0.005;

    if (cubeRef.current instanceof THREE.Mesh) {
        cubeRef.current.rotation.y += deltaX * rotationSpeed;
        cubeRef.current.rotation.x += deltaY * rotationSpeed;
    }
}, [isDragging, cameraRef, cubeRef]);

const onMouseUp = useCallback(() => {
    setIsDragging(false);
    if (cubeRef.current) {
        // Store the last rotation
        lastRotationRef.current = {
          x: cubeRef.current.rotation.x,
          y: cubeRef.current.rotation.y,
          z: cubeRef.current.rotation.z
        };
    }
}, [cubeRef]);


    return { onMouseMove, onMouseDown, onMouseUp, isDragging };
};

export default use3dDragRotate;
