import React, { useState, useEffect } from 'react';

interface IMouse {
    position: { x: number, y: number };
}

const useMouse = (): IMouse => {
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      
      setPosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  return {
    position,
  };
};

export default useMouse;


// import React, { useState, useEffect } from 'react';

// interface IMouse {
//     cursor: React.ReactElement | null;
//     position: {
//         x: Window['screenX'];
//         y: Window['screenY'];
//     } | {};
//     setCursor: (cursor: React.ReactElement | null) => void;
// }

// const useMouse = (): any => {
//   let window:any;
//   const [position, setPosition] = useState<{ x: Window['screenX'], y: Window['screenY'] } | {}>({});
//   // const [cursor, setCursor] = useState<React.ReactElement | null>(null);

//   useEffect(() => {
//     if(window?.screenY){
//       setPosition({ x: window.screenX, y: window.screenY })
//     }
//     const handleMouseMove = (e: MouseEvent) => {if(window?.screenY ){
//       setPosition({
//         x: e.clientX,
//         y: e.clientY
//       });
//     };}

//     document.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   return position;
//   // return {
//   //   cursor,
//   //   position,
//   //   setCursor
//   // };
// };

// export default useMouse;
