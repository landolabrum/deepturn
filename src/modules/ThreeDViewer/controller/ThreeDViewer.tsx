// Relative Path: ./3dViewer.tsx
import React, { useEffect } from 'react';

import styles from './ThreeDViewer.scss';
import useWindow from '@webstack/hooks/window/useWindow';
import GLBViewer from '@webstack/components/ThreeComponents/ThreeGLB/ThreeGLB';

// Remember to create a sibling SCSS file with the same name as this component
interface ThreeDViewerProps {
  modelPath?: string;
  fov?: number;
  width?: string | number;
  height?: string | number;
}
const ThreeDViewer = ({modelPath}:ThreeDViewerProps) => {
  const { width } = useWindow();

  useEffect(() => { }, []);
  if (width) return (
    <>
      <style jsx>{styles}</style>
      <div className='three-d-viewer'>
        <GLBViewer
          fov={50}
          width={width > 1100 ? "var(--s-9-w)" : `100%`}
          height={width > 1100 ? "100vh" : "33vh"}
          modelPath={modelPath!=undefined?String(modelPath): modelPath='/merchant/nirv1/3dModels/plots/861RedRock.glb'}
        />
      </div>
    </>
  );
  return "loading"
};

export default ThreeDViewer;