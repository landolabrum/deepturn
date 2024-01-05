
export const defaultRectangle = {
    object: {
      size: { x: 200, y: 300, z: 100 },
      color: '#ffffff',
      glossiness: { specular: '#e0e0e0', shininess: 50 },
      showShadows: true,
      image: null,
      animate: { duration: 3000, x: 0.001, y: 0.005, z: 0,  },
      // animate: { duration: 'infinite', x: 0.001, y: 0.005, z: 0 },
      onDrag: undefined,
      defaultRotation: { x: 0, y: 0, z: .1 } 
    },
    scene: {
      background: {
        color: "none",
        opacity: 0.2,
      },
      // size: {x: 300, y: 300}
    },
    camera: {
      position: { x: 0, y: 0, z: 500 },
      perspective: {
        fov: 50,
        aspectRatio: 1,
        near: 0.1,
        far: 1000,
      }
    },
    light: {
      color: '#ffffff',
      ambiance: '#000000',
      intensity: .4,
      position: {
        x: 0,
        y: 0,
        z: 10,
      }
    }
  };
  