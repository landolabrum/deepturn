// Relative Path: ./UiWeather.tsx
import React, { useState } from 'react';
import styles from './UiWeather.scss';
import { UiIcon } from '@webstack/components/UiIcon/controller/UiIcon';
import UiCollapse from '@webstack/components/UiCollapse/UiCollapse';
import AdapTable from '@webstack/components/AdapTable/views/AdapTable';
import { dateFormat } from '@webstack/helpers/userExperienceFormats';

interface IUiWeather {
    lngLat?: [number, number];
}

const UiWeather: React.FC<IUiWeather> = ({ lngLat }) => {
    const [weather, setWeather] = React.useState<any>(null);
    const [error, setError] = React.useState<string | null>(null);
const [show, setShow]=useState(false);
    React.useEffect(() => {
        if (!lngLat) return;

        const [lng, lat] = lngLat;
        const apiKey = process.env.NEXT_PUBLIC_WEATHER_URL;
        if (!apiKey) {
            setError('Weather API key is missing');
            return;
        }

        const url = `${apiKey}/${lat},${lng}?units=us`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if(!data?.currently?.time)return;
                data.currently.time = dateFormat(data.currently.time,{isTimestamp:true});
                setWeather(data?.currently || null);
            })
            .catch((err) => {
                console.error('[Weather Fetch Error]', err);
                setError('Failed to fetch weather');
            });
    }, [lngLat]);

    if (error) return <div className="ui-weather">Error: {error}</div>;
    if (!lngLat) return <div className="ui-weather">No coordinates...</div>;
    if (!weather) return <div className="ui-weather">Loading...</div>;

    const { icon, temperature } = weather;
    // console.log(weather)
    const tempF = Math.round(temperature);
    const tempC = Math.round(((temperature - 32) * 5) / 9);
    const initIcon = () => {
        switch (icon) {
            case 'clear-day':
                return 'fa-sun';
            case 'clear-night':
                return 'fa-moon';
            case 'rain':
                return 'fa-cloud-showers-heavy';
            case 'snow':
                return 'fa-snowflake';
            case 'sleet':
                return 'fa-cloud-meatball'; // Closest for sleet or freezing rain
            case 'wind':
                return 'fa-wind';
            case 'fog':
                return 'fa-smog';
            case 'cloudy':
                return 'fa-cloud';
            case 'partly-cloudy-day':
                return 'fa-cloud-sun';
            case 'partly-cloudy-night':
                return 'fa-cloud-moon';
            case 'hail':
                return 'fa-cloud-meatball'; // Also used for hail; FA doesn't have a hail-specific icon
            case 'thunderstorm':
                return 'fa-bolt';
            case 'tornado':
                return 'fa-tornado';
            default:
                return 'fa-question'; // fallback for unknown icon types
        }
    };

    return (
      <>
        <style jsx>{styles}</style>
        <div className="ui-weather">
          <div className="ui-weather__header">
            <div className="ui-weather__header__title">
              <UiIcon icon={initIcon() || "fa-sun"} />
              <div className="ui-weather__temp">
                {tempF}°F / {tempC}°C
              </div>
            </div>
          </div>
          <div className="ui-weather__content">
            {weather &&
              Object.entries(weather).map(([key, value]) => {
                if(key == 'icon')return;
                return(
                  <div className="ui-weather__content__item" key={key}>
                    <div className="ui-weather__content__item__label">{key}</div>
                    <div className="ui-weather__content__item__value">{String(value)}</div>
                  </div>
              )
              })}
          </div>
          {/*      
          <UiCollapse label={         
          </UiCollapse> */}
        </div>
      </>
    );
};

export default UiWeather;
