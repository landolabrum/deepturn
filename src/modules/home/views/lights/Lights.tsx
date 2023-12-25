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
  bri?: number;
}
const Lights: React.FC = () => {
  const [loader, setLoader] = useLoader();

  const [lights, setLights] = useState<any>(undefined);
  const homeService = getService<IHomeService>('IHomeService');

  const updateLight = (changedLight: ILight) => {
    setLights(() => lights.map((light: ILight) => {
      if (light.id_ == changedLight.id_) light = changedLight;
      return light;
    }))
  };

  const handleToggle = async (id: number | string) => {
    try {
      updateLight(await homeService.lightToggle(Number(id)));
    } catch (e: any) {
      console.log("[Toggle](ERROR)", e)
    }
  }
  const handleBrightness = async (id: number, bri: number | string) => {
    try {
      updateLight(await homeService.lightBrightness(id, Number(bri)));
    } catch (e: any) {
      console.log("[brightnessChangedLight](ERROR)", e)
    }
  }
  const handleColor = async (id: number, hex:  string) => {
    try {
      updateLight(await homeService.lightColor(id, hex));
    } catch (e: any) {
      console.log("[brightnessChangedLight](ERROR)", e)
    }
  }
  const toggleView = (id: string) => {
    const updateLightsWithView = lights.map((light: ILight) => {
      if (light?.id_ == id) {
        if (light?.view == undefined) {
          light.view = 'color'
        } else if (light?.view != undefined) delete light.view

      }
      return light
    });
    setLights(updateLightsWithView)
  }

  const fetchLights = async () => {
    setLoader({ active: true, body: 'loading lights' });
    try {
      const response = await homeService.lights();
      setLights(response);

    } catch (e: any) {
      console.log('[ FETCH LIGHTS (ERR) ]',JSON.stringify(e))
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
        {lights && <AdaptGrid xs={1} sm={2} lg={3} gap={15}>
          {Object.entries(lights).map(
            ([key, light]: any, index: number) =>
              <div className='lights__light' key={index}>
                <UiBar
                  header={<div className='lights__light-header'>
                    <div className='lights__light-header-title'>
                      {light?.name}
                      <ToggleSwitch name={light?.id_} value={light.is_on} onChange={() => handleToggle(light.id_)} />
                    </div>
                    <div className='lights__light-header-action'>
                      <UiIcon
                        onClick={() => toggleView(light.id_)}
                        icon={light?.view != 'color' ? 'fa-palette' : 'fa-sun'}
                      />
                    </div>

                  </div>}
                  onChange={(bri) => { String(bri).includes('#') ? handleColor(light.id_, String(bri)) : handleBrightness(light.id_, bri) }}
                  isColor={light.view == 'color'}
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