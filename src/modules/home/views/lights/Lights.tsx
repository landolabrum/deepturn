// Relative Path: ./lights.tsx
import React, { useEffect, useState } from 'react';
import styles from './Lights.scss';
import { getService } from '@webstack/common';
import IHomeService from '~/src/core/services/HomeService/IHomeService';
import AdaptGrid from '@webstack/components/AdaptGrid/AdaptGrid';
import { useLoader } from '@webstack/components/Loader/Loader';
import UiBar from '@webstack/components/Graphs/UiBar/UiBar';
import ToggleSwitch from '@webstack/components/UiToggle/UiToggle';
import { UiIcon } from '@webstack/components/UiIcon/UiIcon';

// Remember to create a sibling SCSS file with the same name as this component
type ILight = {
  id_: string;
  name: string;
  is_on: boolean;
  view?: string;
}
const Lights: React.FC = () => {
  const [loader, setLoader] = useLoader();

  const [lights, setLights] = useState<any>(null);
  const homeService = getService<IHomeService>('IHomeService');
  const handleToggle = (e: any) => {
    const { name, value } = e?.target;
    const updatedViews = lights.map((light: ILight) => {
      if(light?.id_ == name){
        if(!light?.view ){
          light.view = 'color'
        }else delete light.view

      }
      return light
    });
    console.log('[ e ]', updatedViews)
    console.log('[ e ]', name, value)
  }
  const fetchLights = async () => {
    setLoader({ active: true, body: 'loading lights' });
    try {
      const response = await homeService.lights();
      setLights(response);

    } catch (e: any) {
      alert(JSON.stringify(e))
    }
  }
  useEffect(() => {
    if (!lights) {
      fetchLights().then(() => setLoader({ active: false }));
    }
  }, [setLights]);
  return (
    <>
      <style jsx>{styles}</style>
      <div className='lights'>
        <h1>lights</h1>

        {lights && <AdaptGrid xs={2} sm={3} md={4} gap={15}>
          {Object.entries(lights).map(
            ([key, light]: any, index: number) =>
              <div className='lights__light' key={index}>
                <UiBar
                  header={<>
                    {light?.name}
                    <UiIcon
                      icon={light?.is_on ? 'fa-lightbulb-on' : 'fa-lightbulb-slash'}
                    />
                    <ToggleSwitch name={light?.id_} onChange={console.log}/>
                  </>}
                  onChange={console.log}
                  background={{ start: 'fffffff', end: "e0e0e0" }}
                  barCount={5}
                  percentage={light.bri * 100 / 254}
                />
              </div>
          )}
        </AdaptGrid>}
      </div>
    </>
  );
};

export default Lights;