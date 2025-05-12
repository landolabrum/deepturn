import { useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface InteractionOptions {
  styles?: React.CSSProperties;
  className?: string;
  onClick?: (event: THREE.Event) => void;
  onHover?: (hovered: boolean) => void;
}

export const useThreeInteraction = (ref: React.RefObject<THREE.Mesh>, options: InteractionOptions) => {
  const { scene } = useThree();
  
  const handleClick = useCallback(
    (event: THREE.Event) => {
      if (options.onClick) {
        options.onClick(event);
      }
    },
    [options.onClick]
  );

  const handleHover = useCallback(
    (hovered: boolean) => {
      if (options.onHover) {
        options.onHover(hovered);
      }
    },
    [options.onHover]
  );

  useEffect(() => {
      const mesh:any = ref?.current as THREE.Mesh;
    if (ref.current && mesh?.length) {
      mesh.on('click', handleClick);
      mesh.on('hover', (event:any) => handleHover(event.hovered));

      // Apply styles and className
      if (options.styles) {
        Object.assign(mesh.material, options.styles);
      }
      if (options.className) {
        mesh.userData.className = options.className;
      }
      
      return () => {
        mesh.off('click', handleClick);
        mesh.off('hover', (event:any) => handleHover(event.hovered));
      };
    }
  }, [ref, options, handleClick, handleHover]);
};
