
// GlobeElements.tsx
import React, { useEffect } from 'react';
import { Globe as ThreeGlobe } from 'three-globe';
import { useThree, useLoader } from '@react-three/fiber';

export const Globe: React.FC = () => {
  const globe = new ThreeGlobe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png');

  const { scene } = useThree();
  useEffect(() => {
    scene.add(globe);
  }, [globe, scene]);

  return null;
};

interface HtmlMarkerProps {
  position: [number, number, number];
  size: number;
  color: string;
}

export const HtmlMarker: React.FC<HtmlMarkerProps> = ({ position, size, color }) => {
  const markerSvg = `
    <svg viewBox="-4 0 36 36">
      <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
      <circle fill="black" cx="14" cy="14" r="7"></circle>
    </svg>`;

  const { domElement }:any = useThree();
  useEffect(() => {
    const el = document.createElement('div');
    el.innerHTML = markerSvg;
    el.style.color = color;
    el.style.width = `${size}px`;
    domElement.appendChild(el);
  }, [color, domElement, markerSvg, size]);

  return null;
};