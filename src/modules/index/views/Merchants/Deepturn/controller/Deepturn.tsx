import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
import UiMap from '@webstack/components/ThreeComponents/UiMap/controller/UiMap';
import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
import { useRouter } from 'next/router';

import UiMedia from '@webstack/components/UiMedia/controller/UiMedia';
import useWindow from '@webstack/hooks/window/useWindow';
import MBWaterMark from '../../../MindBurner/views/WaterMark/MBWaterMark';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import useLayout from '@webstack/layouts/default/hooks/useLayout';

const Deepturn = () => {
  const { pathname } = useRouter();
  const [currentVessel, setCurrentVessel] = useState<IVessel | false | undefined>();
  const {layout,setLayout}=useLayout();
  const {width}=useWindow()
  const vessels: IVessel[] = [

    // ✅ New Antelope Point Marina marker
    {
      id: 2,
      name: 'Antelope Point Marina',
      lngLat: [-111.429722, 36.966389],
      className: 'partner',
      hover: 'Antelope Point Marina',
      description: (
        <UiMedia
          autoplay
          style={{ height: "100%" }}
          variant='cover'
          type='iframe'
          src='https://www.youtube.com/embed/N9tH-8UOFas?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1'
        />
      ),
      // description:  <UiMedia type='iframe' src='https://www.youtube.com/embed/N9tH-8UOFas?si=OCakKGOAEY4yrkU5'/>,
      // description:  <></>
    }
  ];
useEffect(() => {if(!layout?.background && pathname === "/"){
  setLayout({background:"var(--black)"})
}else{
  setLayout({background:  undefined})

}}, [width, pathname]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className="deepturn">
     
        <div className="deepturn__map">
          {pathname === "/" && (
            <UiMap
              onVesselClick={setCurrentVessel}
              options={{
                rpm: 1000,
                // hideTools: true,
                // loadingDelay: 3000,
                zoom:width>1260? 2.8: 3.8,
                pitch: 45,
                center: [-95, 43],
              }}
              vessels={vessels}
            />
          )}
        </div>
           <div className="deepturn__bg">

            
          <UiMedia variant='cover' src="/assets/backgrounds/space_ghost.gif"  />
        </div>
      </div>
      <MBWaterMark />
    </>
  );
};

export default Deepturn;