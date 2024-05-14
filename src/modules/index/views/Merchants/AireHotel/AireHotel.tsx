import React, { useEffect, useState } from 'react';
import styles from './AireHotel.scss';
import UiMap from '../../../../../webstack/components/Graphs/UiMap/controller/UiMap';
import useLocation from '@webstack/hooks/user/useLocation';
import { useLoader } from '@webstack/components/Loader/Loader';

// Remember to create a sibling SCSS file with the same name as this component

const AireHotel: React.FC = () => {
  const [loader, setLoader] = useLoader();
  const [mapOptions, setMapOptions] = useState<any>();
  const showLoader: boolean = loader?.active;
  const { location, requestLocation, permissionDenied } = useLocation();

  const handleVesselClick = (e: any) => {
    console.log("[ handleVesselClick ]", e)
  }
  const init = () => {
    if (location == undefined) {
      requestLocation();
      setLoader({
        active: true,
        body: "loading map"
      });
    } else {
      if(location)setMapOptions({center:[location.lng, location.lat]});
      setLoader({ active: false })
    }
  }
  useEffect(() => init, [location]);

  if (!mapOptions) return <></>;
  return (
    <>
      <style jsx>{styles}</style>
      <div className="aire-hotel">
        <UiMap
          options={mapOptions}
          onVesselClick={handleVesselClick}
          vessels={[{ name: "Vessel 1", location: location }]}
        />
      </div>
    </>
  );
};

export default AireHotel;