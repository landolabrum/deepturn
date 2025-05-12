import React, { useEffect, useState } from 'react';
import styles from './Deepturn.scss';
// import UiMap from '../../../../../webstack/components/ThreeComponents/UiMap/controller/UiMap';
// import { IVessel } from '@webstack/components/ThreeComponents/UiMap/models/IMapVessel';
import { useRouter } from 'next/router';
import UiButton from '@webstack/components/UiForm/views/UiButton/UiButton';
import environment from '~/src/core/environment';
import UiViewLayout from '@webstack/layouts/UiViewLayout/controller/UiViewLayout';
import { capitalizeAll } from '@webstack/helpers/Capitalize';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import useWindow from '@webstack/hooks/window/useWindow';
import MBWaterMark from '../../../MindBurner/views/WaterMark/MBWaterMark';
import GLBViewer from '@webstack/components/ThreeComponents/ThreeGLB/ThreeGLB';







// const BrowserInteraction = () => {
//   const { tabInfo } = useTab();

//   return (
//     <div>
//       <h1>Current Tab Info</h1>
//       <p>Tab ID: {tabInfo.tab_id}</p>
//       <p>Current URL: {tabInfo.url}</p>
//       <p>Tab is {tabInfo.isCurrent ? 'Active' : 'Inactive'}</p>
//       <p>Time Spent on Tab: {tabInfo.timeSpent / 1000} seconds</p>
//       <p>Viewport Size: {tabInfo.viewportWidth} x {tabInfo.viewportHeight}</p>
//       <p>Scroll Position: X: {tabInfo.scrollPosition.x}, Y: {tabInfo.scrollPosition.y}</p>
//     </div>
//   );
// };
const Deepturn = () => {
  const router = useRouter();

  const { pathname } = useRouter()

  const [loaded, setLoaded] = useState<boolean>(false);
  const [view, setView] = useState<string>('BallView');
  // const [view, setView] = useState<string>('entityChoice');
  const handleLoad = () => {
    if (!loaded && pathname == '/') setLoaded(true);
  }
  useEffect(() => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      handleLoad()
    } else {
      window.addEventListener('DOMContentLoaded', handleLoad);
    }
    return () => window.removeEventListener('DOMContentLoaded', handleLoad);

  }, [handleLoad]);

  const DeepturnCommercial = () => {

  }
  const DeepturnEntitySelect = () => {

    const EntityChoiceMarquee = ({ btnText, serviceType, description, onClick }: { btnText: string, serviceType?: string, description: string, onClick?: (e: any) => void }) => <>
      <style jsx>{styles}</style>
      <div className='business-select--marquee'>

        <div className='beta'>Beta</div>
        <div className='business-select--marquee__title'>
          <UiIcon icon={`${environment.merchant.name}-logo`} /> {capitalizeAll(btnText)}
        </div>
        <div className='business-select--marquee__description'>
          {description}
        </div>

        <div className='business-select--marquee__btn'>
          <div className='business-select--marquee__btn--content'>
            <UiButton
              variant="inherit"
              traits={{
                // width:"100%",
                // outline:"solid 1px var(--green-30)",
                beforeIcon: `${environment.merchant.name}-logo`
              }}
              size='xxl'
              onClick={() => {
                if (serviceType == 'marketing') {
                  router.push(`/services?sid=${serviceType}`)
                }
                else if (serviceType == 'campaigns') {
                  setView("coming-soon")
                }
              }}
            // FUTURE USAGE
            // onClick={()=>setView(btnText)}
            >visit {capitalizeAll(btnText)}</UiButton>
          </div>
        </div>
      </div>
    </>
    return <>
      <style jsx>{styles}</style>

      <div className='deepturn__business-select'>
        <EntityChoiceMarquee
          btnText="commercial"
          serviceType="marketing"
          description="We measurably improve your brand's marketing effectiveness by changing consumer behavior."
        />
        <EntityChoiceMarquee
          btnText="political"
          serviceType="campaigns"
          description="By knowing your electorate better, we achieve greater influence while lowering overall costs."
        />
      </div>
    </>
  }
  const BallView = () => <GLBViewer
  // width={width > 1100 ? "400px" : "90vw"}
  // height={width > 1100 ? "500px" : "90vw"}
  modelPath='/assets/threeModels/red_sand_desert_canyon1K.glb'
/>
  const ComingSoon = () => {
    return <>
      <style jsx>{styles}</style>
      <div className='deepturn__coming-soon'>
        <div className='deepturn__coming-soon--title'>
          <UiButton
            variant='link'
            onClick={() => setView('enter')}
          > {`${"< "}`}back</UiButton>
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

  const { width, height } = useWindow();
  const views = {
    // "ENTER": <div><UiButton  size='xxl' onClick={() => setView('entityChoice')}>&zwnj; &zwnj; &zwnj; enter &zwnj; &zwnj; &zwnj; </UiButton></div>,
    entityChoice: <DeepturnEntitySelect />,
    BallView:<BallView/>,
    "coming-soon": <ComingSoon />
  }
  const genLayouts = () => {
    function getPos(i: number) {
      const values = [-1, 0, 1,];
      // return 0
      return [
        values[Math.floor(Math.random() * values.length)],
        values[Math.floor(Math.random() * values.length)],
        i + 1
      ]
    }
    const layoutViews = ['one', 'two', 'three'];
    const layouts = layoutViews.map((f, i) => {
      const position = getPos(i);
      return {
        element: (
          <div key={i} className={f}>
            {f}: <span>{position.toString()}</span> {/* Avoid direct text */}
          </div>
        ),
        position
      };
    });

    return layouts
  }

  if (width) return (
    <>
      <style jsx>{styles}</style>
      <div className='deepturn'>
        {/* <div className='component--terrain'>
          <ThreeDLayout
            layers={[
              {
                element: <div className='front'>

                </div>, position: [0, 0, 90]
              },
              {
                element: <div className='s-w-100 d-flex'>
                </div>, position: [0, 0, 50]
              },
              { element: <div className='middle'>grid</div>, position: [0, 0, 50] },
              {
                element: <div className='middle'>
                  <UiLoader />
                </div>, position: [0, 0, 50]
              },
              { element: <div className='back'>back</div>, position: [0, 0, 30] },
            ]}
            settings={{
              camera: {
                position: { x: 0, y: 0, z: 100 },
                focalLength: 50,
              },
              scene: {
              },
            }}
            followMouse={{
              responsiveness: 1,
              invert: false,
              disable: { x: false, y: false, z: true },
            }}
          />
        </div> */}
          {/* <BrowserInteraction/> */}

        <UiViewLayout variant='anchor' views={views} currentView={view} />
      </div>
      <MBWaterMark />
    </>
  );
  return <>...loading</>;
};
export default Deepturn;