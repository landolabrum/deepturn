// Relative Path: ./lights.tsx
import React, { useEffect, useState } from 'react';
import styles from './Lights.scss';
import { getService } from '@webstack/common';
import IHomeService from '~/src/core/services/HomeService/IHomeService';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import UiInput from '@webstack/components/UiInput/UiInput';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiBar from '@webstack/components/Graphs/UiBar/UiBar';

// Remember to create a sibling SCSS file with the same name as this component

const Lights: React.FC = () => {
const [loader, setLoader]=useLoader();
  const [lights, setLights] = useState<any>(null);
  const homeService = getService<IHomeService>('IHomeService');
  const fetchLights = async () => {
    setLoader({active: true, body:'loading lights'});
    try {
      const response = await homeService.lights();
      setLights(response)

    } catch (e: any) {
      alert(JSON.stringify(e))
    }
  }
  useEffect(() => {
    if (!lights) {
      fetchLights().then(()=>setLoader({active: false}));
    }
  }, []);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='lights'>
        <h1>lights</h1>
        {/* {lights && <AdapTable data={lights}/>} */}
        {lights && <AdaptGrid xs={1} md={3} gap={18} variant='card'>
          {Object.entries(lights).map(
            ([key, light]:any, index:number) => 
            <div className='lights__light' key={index}>
              <div className='lights__light-name'>
                {light?.name}
              </div>
              <UiBar 
                barCount={5}
                percentage={light.bri * 100 / 254}
                icon={light?.is_on ?'fa-lightbulb-on':'fa-lightbulb-slash'}
                />
              {/* <UiInput type='color' value={light?.hex}/>
              <small>
            </small> */}
            {/* {JSON.stringify(light)} */}
            </div>
          )}
        </AdaptGrid>}
      </div>
    </>
  );
};

export default Lights;