// Relative Path: ./3dViewer.tsx
import React, { useEffect } from 'react';

import styles from './ThreeDViewer.scss';
import useWindow from '@webstack/hooks/window/useWindow';
import GLBViewer from '@webstack/components/ThreeComponents/ThreeGLB/ThreeGLB';

// Remember to create a sibling SCSS file with the same name as this component

const ThreeDViewer = () => {
  const { width } = useWindow();

  useEffect(() => { }, []);
  if (width) return (
    <>
      <style jsx>{styles}</style>
      <div className='three-d-viewer'>
        <GLBViewer
          fov={50}
          width={width > 1100 ? "var(--s-9-width)" : `100%`}
          height={width > 1100 ? "100vh" : "33vh"}
          modelPath='/merchant/nirv1/3dModels/plots/861RedRock.glb'
        />
      </div>
    </>
  );
  return "loading"
};

export default ThreeDViewer;