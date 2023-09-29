// Relative Path: ./AddressInput.tsx
import React, { useEffect } from 'react';
import styles from '../UiInput.scss';
import { Loader } from '@googlemaps/js-api-loader';
import FormControl, { ITraits } from '@webstack/components/FormControl/FormControl';
import { IInput } from '@webstack/models/input';

interface IAddressInput{
  address?: any;
  setAddress:(e:any)=>void;
  traits?: ITraits,
  inputClasses?:string,
  label?: string;
}
const AutocompleteAddressInput = ({ address, setAddress, traits, inputClasses, label }:IAddressInput) => {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GAPI_KEY?.trim() || "";
  // console.log("[ PROPS ]", props)
  const initAutocomplete = async () => {
    const loader = new Loader({
      apiKey: GOOGLE_API_KEY,
      libraries: ['places'],
    });
    const google = await loader.load();
    const inputElement = document.getElementById('autocomplete-address');
    const autocomplete = new google.maps.places.Autocomplete(inputElement);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place && place.address_components) {
        const addressComponents = place.address_components.reduce((acc:any, component:any) => {
          const type = component.types[0];
          acc[type] = component.long_name || component.short_name;
          return acc;
        }, {});
        const formattedAddress = {
          line1: `${addressComponents.street_number || ''} ${addressComponents.route || ''}`,
          line2: addressComponents.sublocality || '',
          city: addressComponents.locality || '',
          state: addressComponents.administrative_area_level_1 || '',
          postal_code: addressComponents.postal_code || '',
          country: addressComponents.country || ''
        };
        setAddress({target:{name:"address", value:formattedAddress}});
      }
    });
  };
  
  useEffect(() => {
    initAutocomplete();
  }, [address]);

  const addressDisplay = address != undefined ?
    `${address?.line1? address?.line1+', ' : ''
    }${address?.line2? address?.line2+' ' : ''
    }${address?.city? address?.city+' ' : ''
    }${address?.state? address?.state+', ' : ''
    }${address?.postal_code? address?.postal_code+', ' : ''
    }${address?.country? address?.country : ''}`: undefined;

  return (<>
    <style jsx>{styles}</style>
    <FormControl traits={traits} label={label}>
    <input
    className={inputClasses}
      id="autocomplete-address"
      type="text"
      placeholder="Enter your address"
      defaultValue={addressDisplay}
      name="address"
    />
    </FormControl> 
    </>
  );
};

export default AutocompleteAddressInput;
