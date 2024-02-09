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
import UiMediaSlider from '@webstack/components/UiMedia/views/UiMediaSlider/UiMediaSlider';
import UiButton from '@webstack/components/UiButton/UiButton';
import { calculateHexFromHueSatBri } from './LightHelpers';
import { reverseString } from '@webstack/helpers/Strings/reverseString';
import ColorPicker from '@webstack/components/ColorPicker/ColorPicker';
import keyStringConverter from '@webstack/helpers/keyStringConverter';

// Remember to create a sibling SCSS file with the same name as this component
type ILight = {
  id_: string;
  name: string;
  is_on: boolean;
  view?: string;
  bri: number;
  hue: number;
  sat: number;
  hex: string;
}
const Lights = () => {
  const [loader, setLoader] = useLoader();
  const [go, setGo] = useState<any | undefined>(false);
  // const [group, setGroup] = useState<string[] | undefined>();
  const [currentLight, setCurrentLight] = useState<ILight | undefined>();
  const [lights, setLights] = useState<any>();
  const [isAll, setIsAll] = useState<boolean | ILight>(false);
  const homeService = getService<IHomeService>('IHomeService');

  const updateLight = (changedLight: ILight, isColor?: boolean) => {
    setLights(() => lights.map((light: ILight) => {
      if (light.id_ == changedLight.id_) {
        if (isColor) changedLight.view = 'color'
        light = changedLight;
      }
      return light;
    }))
  };

  const toggleBarView = (id: string) => {
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

  const onLights = lights?.filter((light: ILight) => light.is_on) || [];
  const handleLightAnimation = (color: string) => {
    if (onLights.length === 0) return;
    const currentLightIndex = currentLight ? onLights.findIndex((light: ILight) => light.id_ === currentLight.id_) : -1;
    const nextLightIndex = (currentLightIndex + 1) % onLights.length;
    const nextLight = onLights[nextLightIndex];
    setCurrentLight(nextLight);
    multiHomeService('color', { id: nextLight.id_, hex: color });
  };
  const [group, setGroup] = useState<string[]>([]); // Changed from useState<string[] | undefined>();


  const initfetchLights = () => {
    if (lights !== undefined) return;
    fetchLights().then(() => setLoader({ active: false }));
  }
  const atPoints = onLights && onLights.map((light: ILight, index: number) => {
    const newHex = light?.hex ? `#${reverseString(light.hex.substring(1, light.hex.length))}` : '#ff3300'
    return {
      time: (index + 1) * 1000,
      value: newHex,
      backgroundColor: newHex,
      onPoint: handleLightAnimation
    };
  });
  const fetchLights = async () => {
    setLoader({ active: true, body: 'loading lights', animation: true });
    try {
      let response = await homeService.lights();
      setLights(response);

    } catch (e: any) {
      console.log('[ FETCH LIGHTS (ERR) ]', JSON.stringify(e))
    }
  }
  const addToGroup = (id_: string) => {
    setGroup(group !== undefined ? [...group, id_] : [id_]);
  }
  const removeFromGroup = (id_: string) => {
    if (group) {
      setGroup(group.filter((existingId) => existingId !== id_));
    }
  }

  const multiHomeService = async (action: string, data?: any) => {
    console.log('[ CHATGPT HELP! ]',{action, data, group});
    const handleLoader = (active: boolean, action?: string, name?: string) => {
      setLoader({ active: active, body: `${action}, ${name} `, animation: true });
    };
  
    handleLoader(true, action, data?.name);
  
    const applyAction = async (id_: string) => {
      let response;
      switch (action) {
        case 'toggle':
          response = await homeService.lightToggle(id_);
          break;
        case 'brightness':
          if (data?.bri !== undefined) {
            response = await homeService.lightBrightness(id_, data.bri);
          }
          break;
        case 'color':
          if (data?.hex) {
            response = await homeService.lightColor(id_, data.hex);
            const calculatedHex = calculateHexFromHueSatBri(response.hue, response.sat, response.bri);
            response = { ...response, hex: calculatedHex, view: 'color' };
          }
          break;
        // No default action needed as all cases are covered
      }
      if (response) {
        updateLight(response, action === 'color');
      }
    };
  
    // Perform action on all lights in the group if applicable
    if (group.length > 0 && ['toggle', 'brightness', 'color'].includes(action)) {
      for (const id_ of group) {
        await applyAction(id_);
      }
    } else if (data?.id) {
      // Perform action on a single light
      await applyAction(data.id);
    }
  
    handleLoader(false, action, data?.name);
  };
  

  useEffect(() => { }, [multiHomeService, ])
  useEffect(() => {
    initfetchLights();
  }, [currentLight]);
  return (
    <>
      <style jsx>{styles}</style>
      {JSON.stringify(group)}
      <div className='lights'>
        <AdaptGrid xs={2} lg={3} gap={15}>
          <UiButton variant={go && 'primary'} onClick={() => setGo(!go)}>start animation</UiButton>
          <UiButton variant={go && 'primary'} onClick={() => isAll == false ? setIsAll({ ...onLights[0], id_: 'all-lights' }) : false}>
            Set All
          </UiButton>
        </AdaptGrid>
        <UiMediaSlider
          backgroundColors={['#ff3300', '#00ff00', '#ff0000']}
          atPoints={atPoints}
          duration={10000}
          start={go}
        />

        {lights && !isAll && <AdaptGrid xs={1} sm={2} md={2} lg={3} gap={15}>
          {Object.entries(lights).map(([key, light]: any, index: number) =>
            <div
              className={`lights__light ${group?.includes(light.id_) ? 'in-group' : ''}`}
              key={index}
              onClick={() => {
                if (group?.includes(light.id_)) {
                  console.log(`removeFromGroup(${light.id_})`);
                  removeFromGroup(light.id_);
                } else {
                  console.log(`addToGroup(${light.id_})`);
                  addToGroup(light.id_);
                }
              }}
            >

              <div className='lights__light-header'>
                <div className='lights__light-header--action'>
                  <UiInput size='sm' value={light.name} disabled={true} label='name' />
                </div>

                <div className='lights__light-header--action' onClick={() => multiHomeService('toggle', { id: light.id_ })}>
                  <ToggleSwitch name={light?.id_} value={light?.is_on} />
                </div>
                <div
                  className='lights__light-header--action'
                  onClick={() => toggleBarView(light.id_)}
                >
                  <UiIcon icon='fa-palette' />
                </div>
              </div>

              {light?.view !== 'color' ? (
                <UiBar
                  onChange={(value) => {
                    if (String(value).length == 0 || !value) return;
                    else multiHomeService('brightness', { id: light.id_, bri: value, name: light.name });
                  }}
                  barCount={5}
                  percentage={light?.bri * 100 / 254}
                />
              ) : (
                <ColorPicker
                  hex={light.hex}
                  onChange={(hex: string) => multiHomeService('color', { id: light.id_, hex: hex, name: light.name })}
                />
              )}
            </div>
          )}
        </AdaptGrid>}
        {typeof isAll == 'object' && (
          <UiBar
            onChange={(value) => {
              if (String(value).length == 0 || !value) return;
              else if (String(value).startsWith('#')) multiHomeService('color', { id: isAll.id_, hex: value });
              else multiHomeService('brightness', { id: isAll.id_, bri: value });
            }}
            barCount={5}
            percentage={isAll?.bri * 100 / 254}
          />
        )}
      </div>
    </>
  );
};

export default Lights;
