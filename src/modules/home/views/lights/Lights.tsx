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
import UiInput from '@webstack/components/UiInput/UiInput';

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
  const [newName, setNewName] = useState<any | undefined>();
  const [lights, setLights] = useState<any>();
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
  const handleColor = async (id: number, hex: string) => {
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
      console.log('[ FETCH LIGHTS (ERR) ]', JSON.stringify(e))
    }
  }
  const handleNewName = (e: any) => {
    let { name, value } = e;
    if(e.target){
      name = e.target.name;
      value = e.target.value;
    }
    name && console.log('[new name]', name)
    if(name && value)setNewName(e);

    // if(!name  && typeof e == 'string') console.log('[e]',e);setNewName(e)

  }
  useEffect(() => {
    if (lights == undefined) {
      fetchLights().then(() => setLoader({ active: false }));
    }
  }, [setLights, ]);
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
                    <div className='lights__light-header-title' >

                        {newName == undefined || newName?.name != light.id_ ? (
                          <div onClick={()=>handleNewName({name:light.id_, value:'new light name'})} >
                            {light?.name}
                          </div>
                        ) : (<UiInput size='sm' name={newName.id_} onChange={handleNewName} value={newName.value}/>)}

                            <div onClick={() => handleToggle(light.id_)}>
                        <ToggleSwitch name={light?.id_} value={light?.is_on}
                        />
                      </div>
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