// Relative Path: ./AddressInput.tsx
import React, { useEffect } from 'react';
import styles from '../UiInput.scss';
import aStyles from './AddressInput.scss';
import { Loader } from '@googlemaps/js-api-loader';
import FormControl, { ITraits } from '@webstack/components/FormControl/FormControl';

interface IAddressInput {
  address?: any;
  setAddress: (e: any) => void;
  traits?: ITraits,
  inputClasses?: string,
  label?: string;
  error?: string | null;
}
const AutocompleteAddressInput = ({ address, setAddress, traits, inputClasses, label, error }: IAddressInput) => {
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
        const addressComponents = place.address_components.reduce((acc: any, component: any) => {
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
          country: addressComponents.country || '',
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        };
        const addressValue ={ target: { name: "address", value: formattedAddress } };
        // console.log('[ addressValue ]',addressValue)
        setAddress(addressValue);
      }
    });
  };
  const addressDisplay = address != undefined ?
    `${address?.line1 ? address?.line1 + ', ' : ''
    }${address?.line2 ? address?.line2 + ' ' : ''
    }${address?.city ? address?.city + ' ' : ''
    }${address?.state ? address?.state + ', ' : ''
    }${address?.postal_code ? address?.postal_code + ', ' : ''
    }${address?.country ? address?.country : ''}` : undefined;
  useEffect(()=>{initAutocomplete()}, []);

  return (<>
    <style jsx>{styles}</style>
    <style jsx>{aStyles}</style>
    <FormControl
          error={error}
          label={label}
          traits={{
            ...traits,
          }}>
      <input
        data-element='input'
        className={inputClasses}
        id="autocomplete-address"
        type="text"
        placeholder="Enter address"
        defaultValue={addressDisplay}
        name="address"
      />
      </FormControl>
  </>
  );
};

export default AutocompleteAddressInput;
