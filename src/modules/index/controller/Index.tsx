import React, { useEffect, useState } from 'react';
import styles from './Index.scss';
import ProductRequestSurvey from '../../ecommerce/ProductDescription/ProductRequestSurvey/controller/ProductRequestSurvey';
import environment from '~/src/environment';
import keyStringConverter from '@webstack/helpers/keyStringConverter';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';
import { TJSCube } from '@webstack/components/threeJs/TJSCube/controller/TJSCube';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import HomeGridItem from '../views/HomeGridItem/HomeGridItem';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';

const Nirvo = ({ prod }: { prod?: string }) => {
  const nStyle = `.nirv{
      display: flex;
      color: var(--blue-10);
      --ui-icon-color: var(--blue-10);
      gap: var(--s-9);
      font-size: var(--s-5);
  }`;
  return <>
    <style jsx>{nStyle}</style>
    <div className='nirv'>
      <UiIcon icon={`${environment.merchant.name}-logo`} />
      Nirvana Energy
    </div>
  </>
}


const Index = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  const tableData = [
    { manufacturer: 'Tesla', 'capacity': 13, 'output': 5.5 },
    { manufacturer: 'LG', 'capacity': 15, 'output': 6.4 },
    { manufacturer: 'Enphase', 'capacity': 12, 'output': 5 },
    { manufacturer: 'Generack', 'capacity': 15.5, 'output': 4.5 },
    { manufacturer: 'GrowWatt', 'capacity': 10, 'output': 6 },
    { manufacturer: <Nirvo />, 'capacity': 15, 'output': 12 },
  ];
  const svgOptions = {
    bevelEnabled: true,
    bevelThickness: 10, // Set the bevel thickness to 10px
    bevelSegments: 10, // Adjust the number of bevel segments as needed
    bevelSize: 2, // Adjust the bevel size as needed
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className='index'>
        <div className={`index__full--title index__full--title-${environment.merchant.name}`}>
          <UiIcon icon={`${environment.merchant.name}-logo`} />
          {environment.merchant.name && keyStringConverter(environment.merchant.name)}
        </div>

        {environment.merchant.mid === 'nirv1' &&
          < >
            <div className='index__full'>
              <div className='index__full--title'>
                {/* 6 Important Questions */}
                6 Key Questions to Enhance Your Solar System with Batteries
              </div>
              <div>Can I add batteries to my existing solar</div><br/><br/>
              {/* <div className='index__full-ol'>
                <div className='index__full-li'>
                  <div className='index__full-li--title'>
                    Can I add batteries to my existing solar
                  </div>
                </div>
              </div> */}
            </div>
              <ProductRequestSurvey id='configure' startButton='Configure your Solar Grid Box'/>

            <div className='index__full'>
              <div className='index--title'>
                Time to Create your Nirvana!
                On and Off-grid battery back up
              </div>
              <div className='index__sub-title'>
                If you&apos;re thinking about going off grid or want to learn more about backup battery systems, it&apos;s time to create your
              </div>
            </div>


            <div className='index__full'>
              <div className='index__full--title'>
                The Importance of Backup Batteries
              </div>
              <AdaptGrid sm={1} md={3} margin='0 0 45px' gapX={10} gapY={5}>
                <HomeGridItem icon='fal-cloud-bolt-sun' title='power outages' >
                  With backup batteries, you can be sure your home will have
                  power even during outages.
                  Most batteries will only back up what is stored when the grid goes down. Be sure to get our system that refills the battery if the grid stays down.
                </HomeGridItem>
                <HomeGridItem icon='fa-globe' title='environmental concerns' >
                  Using solar battery backup systems helps reduce your carbon footprint. The less you rely on the grid, the more you do for our planet.
                </HomeGridItem>
                <HomeGridItem icon='fal-circle-dollar' title='cost savings' >
                  Solar battery backup systems can help you save money on electricity bills in the long run.
                  The 30% Federal Tax credit applies to battery storage that is connected to a PV
                </HomeGridItem>
              </AdaptGrid>
            </div>

            <div className='index__full'>
              <div className='index--title'>
                On-grid vs Off-grid Solar Battery Backup
                Systems
              </div>
              <AdaptGrid sm={1} md={2} margin='0 0' gapX={10}>
                <HomeGridItem title='on-grid'>
                  On-grid systems are connected to the utility grid and can sell excess energy back to the power company or store excess energy depending on how the system is
                </HomeGridItem>
                <HomeGridItem title='environmental concerns' >
                  Off-grid systems are not connected to the utility grid. These systems can be tailored to fit your needs no matter how big or small and using several different power sources.
                </HomeGridItem>
              </AdaptGrid>
            </div>

            <div className='index__full'>
              <div className='index--title'>
                Don&apos;t be fooled by ( Name Brand ) Batteries
              </div>
              <br />
              <AdapTable
                // variant='mini'
                options={{ hide: ['header', 'footer'] }}
                data={tableData}
              />
            </div>
          </>}

        {environment.merchant.mid === 'mb1' && <>
          {isClient && (
            <div className="background-video" data-img="/assets/backgrounds/lava1.jpeg"/>
            // <video loop muted className="background-video" autoPlay>
            // <source src="/assets/backgrounds/contour_bg.webm" type="video/webm" />
            // Your browser does not support the video tag.
            // </video>
          )}
          <div className='index__full-max'>
            <TJSCube
              svgOptions={svgOptions}
              svg={<UiIcon icon={`${environment.merchant.name}-logo`} />}
              size={{ x: 120, y: 120, z: 0 }}
              metalness={5}
              animate={{ rotate: { y: -1, x:0.5, speed: .05 } }}
              color="#ffbb00"
            />
          </div>

        </>
        }


      </div>
    </>
  );
};

export default Index;