import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
// import UiMap from '../../../../../webstack/components/ThreeComponents/UiMap/controller/UiMap';
// import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiButton/UiButton';
import environment from '~/src/core/environment';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { TJSCube } from '@webstack/components/ThreeComponents/TJSCube/controller/test';
import useWindow from '@webstack/hooks/useWindow';
const Deepturn = () => {
  const {width} = useWindow();
  // const [currentVessel, setCurrentVessel] = useState<IVessel | false | undefined>();
  // const closeVessel = () => currentVessel && setCurrentVessel(false);
  const { pathname } = useRouter()
  // const vessels: IVessel[] = [
  //   {
  //     name: 'Two Story Smart Home',
  //     lngLat: [-75.1867254, 39.9307048],
  //     className: "partner",
  //     images: [
  //       "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/e1573119-8f57-4e97-9d4f-9ed4be4de8b4.jpeg?im_w=1200",
  //       "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEyNDAxNzM1NTk1NjgzMjg4Mw%3D%3D/original/a6f2bd88-0ef0-455b-8f00-433eee5b13c2.jpeg?im_w=720"
  //     ],
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  //   },
  // ];
  const [loaded, setLoaded]=useState<boolean>(false);
  const [view, setView]=useState<string>('enter');
  const handleLoad = () =>{
    if(!loaded && pathname == '/')setLoaded(true);
  }
  useEffect(() => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      handleLoad()
    }else{
      window.addEventListener('DOMContentLoaded', handleLoad);
    }
    return () => window.removeEventListener('DOMContentLoaded', handleLoad);

  }, []);
 
  const DeepturnCommercial = () => {

  }
  const ComingSoon = () =>{
    return <>
    <style jsx>{styles}</style>
    <div className='deepturn__coming-soon'>
    <div className='deepturn__coming-soon--title'>
Coming Soon
    </div>
    <div>
    <pre className='deepturn__coming-soon--body'>
    Digital marketing is the vehicle to take the insights from our Behavioral Microtargeting program and deliver the right messages to the right individuals in meaningful ways online.
    </pre>

    <pre className='deepturn__coming-soon--body'>
Our full-service in-house marketing operation gives you access to a powerful collaboration of behavioral insight and industry-leading advertising technology, with a transparent pricing structure driven solely by your success.
    </pre>
    </div>
    </div>
    </>
  }
  const DeepturnEntitySelect = () => {
    const BusinessSelectMarquee = ({ btnText, title, description, onClick }: { btnText: string, title?: string, description: string, onClick?: (e: any) => void }) => <>
      <style jsx>{styles}</style>
      <div className='business-select--marquee'>
        <div className='-deepturn__'>Beta</div>

        <div className='business-select--marquee__title'>
          <UiIcon icon={`${environment.merchant.name}-logo`} /> {capitalizeAll(btnText)}
        </div>
        <div className='business-select--marquee__description'>
          {description}
        </div>
        <UiButton 
          variant="primary"
          traits={{ 
            beforeIcon: `${environment.merchant.name}-logo`
            }}
          size='xxl'
          onClick={()=>setView('coming-soon')}
          // FUTURE USAGE
          // onClick={()=>setView(btnText)}
          >visit {capitalizeAll(btnText)}</UiButton>
      </div></>
    return <>
      <style jsx>{styles}</style>
  
      <div className='deepturn__business-select'>
        <BusinessSelectMarquee
          btnText="commercial"
          title="Data-driven marketing"
          description="We measurably improve your brand's marketing effectiveness by changing consumer behavior."
        />
        <BusinessSelectMarquee
          btnText="political"
          title="Data-driven campaigns"
          description="By knowing your electorate better, we achieve greater influence while lowering overall costs."
        />
      </div>
    </>
  }
  const views = {
    enter: <div><UiButton variant='dark' size='xxl' onClick={()=>setView('businessSelect')}>&zwnj; &zwnj; &zwnj; enter &zwnj; &zwnj; &zwnj; </UiButton></div>,
    businessSelect: <DeepturnEntitySelect />,
    "coming-soon":<ComingSoon/>
  }
  return (
    <>
      <style jsx>{styles}</style>
      {/* <div className='dev'>{JSON.stringify(userData, null, 2)}</div> */}
      <div className='deepturn'>
      <div className='component--terrain'>
      <TJSCube
      
icon={{
bevel: {
  bevelEnabled: true,
  bevelThickness: 5,
  bevelSegments: 15,
  bevelSize: 2
},
color:"#303030",
// backgroundColor:"#e0e0e0",
metalness: 15,
// roughness: .51,
// opacity: opacity !== 0 && opacity * .1 || .1,
// opacity: .7,
icon: "deepturn-logo",
// texture: "/assets/backgrounds/lava1.jpeg",
// bumpMap:"/assets/textures/texture-leaves.jpeg",
texture:"/assets/backgrounds/contour_bg.gif",
size: width > 1100?{ x: 100, y: 100, z: 9 }:{ x: 70, y: 70, z: 9 },
animate: { rotate: { y: -2, x: 1, speed: .0007 } }
}}
// metalness={5}
/> 
     </div>
        <UiViewLayout variant='anchor' views={views} currentView={view} />
      </div>
    </>
  );
};

export default Deepturn;
{/* <div className='component--map'>
<pre>{JSON.stringify(userData, null, 2)}</pre>

  {/* {userData && Object.entries(userData).map(([k, v]) => <div className='d-flex-col s-w-100 align-start gap-9'>
    <div >
      {k}: {typeof v == 'object' ? Object.entries(v).map(([l, b]) => <div className='d-flex-col s-w-100 align-start gap-9'>
        <div>--> {l}: {JSON.stringify(b)}</div>
      </div>) : v}
    </div><br />
  </div>)} */}
{/* <TJSCube
icon={{
bevel: {
  bevelEnabled: true,
  bevelThickness: 5,
  bevelSegments: 15,
  bevelSize: 2
},
// color:"#e0e0e0"/,
// backgroundColor:"#e0e0e0",
// metalness: 10,
// roughness: .51,
// opacity: opacity !== 0 && opacity * .1 || .1,
// opacity: .7,
icon: "deepturn-logo",
texture: "/assets/backgrounds/lava1.jpeg",
// bumpMap:"/assets/textures/texture-leaves.jpeg",
size: { x: 300, y: 300, z: 9 },
animate: { rotate: { y: -2, x: 1, speed: .0007 } }
}}
// metalness={5}
/>  */}
{/*
<UiMap
onVesselClick={setCurrentVessel}
require='both'
options={{
rpm: 200,
}}
vessels={vessels}
/>
<UiTerrain/>
</div>
 */}