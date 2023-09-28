// Relative Path: ./AddressInput.tsx
import React, { useEffect } from 'react';
import styles from './AddressInput.scss';
import { Loader } from '@googlemaps/js-api-loader';
import UiInput from '@webstack/components/UiInput/UiInput';

const GOOGLE_API_KEY = 'AIzaSyCthMX-HyRujKH9WgIwvVoi6Hhms247Ts4';

const AutocompleteAddressInput = ({ address, setAddress }:any) => {
  useEffect(() => {
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
          setAddress(formattedAddress);
        }
      });
    };

    initAutocomplete();
  }, [address]);

  const addressDisplay = address?.line1 ?
    `${address?.line1? address?.line1+', ' : ''
    }${address?.line2? address?.line2+' ' : ''
    }${address?.city? address?.city+' ' : ''
    }${address?.state? address?.state+', ' : ''
    }${address?.postal_code? address?.postal_code+', ' : ''
    }${address?.country? address?.country : ''}`: undefined;

  return (
    <UiInput
      id="autocomplete-address"
      label='Address'
      type="text"
      placeholder="Enter your address"
      defaultValue={addressDisplay}
      name="address"
    />
  );
};

export default AutocompleteAddressInput;
