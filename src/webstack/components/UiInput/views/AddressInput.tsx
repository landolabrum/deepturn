import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../UiInput.scss';
import aStyles from './AddressInput.scss';
import { Loader } from '@googlemaps/js-api-loader';
import FormControl, { ITraits } from '@webstack/components/FormControl/FormControl';
import { IFormControlVariant } from '@webstack/components/AdapTable/models/IVariant';
import UiMenu from '@webstack/components/UiMenu/UiMenu';

interface IAddressInput {
  address?: any;
  setAddress: (e: any) => void;
  traits?: ITraits;
  variant?: IFormControlVariant;
  inputClasses?: string;
  label?: string;
  error?: string | null;
}

const AutocompleteAddressInput = ({ address, setAddress, variant, traits, inputClasses, label, error }: IAddressInput) => {
  const inputRef = useRef<any>();
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [display, setDisplay] = useState<string | undefined>("");

  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GAPI_KEY?.trim() || "";

  const initAutocomplete = async () => {
    const loader = new Loader({
      apiKey: GOOGLE_API_KEY,
      libraries: ['places'],
    });
    const google = await loader.load();
    const service = new google.maps.places.AutocompleteService();
    setAutocompleteService(service);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setDisplay(query);  // Update display state with input value
    if (query.length > 2 && autocompleteService) {
      autocompleteService.getPlacePredictions({ input: query }, (predictions: any) => {
        setSuggestions(predictions || []);
      });
    } else {
      setSuggestions([]);
    }
  };

  const handleDisplay = useCallback(() => {
    const addressDisplay = address ? 
      `${address?.line1 ? address?.line1 + ', ' : ''
      }${address?.line2 ? address?.line2 + ' ' : ''
      }${address?.city ? address?.city + ' ' : ''
      }${address?.state ? address?.state + ', ' : ''
      }${address?.postal_code ? address?.postal_code + ', ' : ''
      }${address?.country ? address?.country : ''}` : "";
    setDisplay(addressDisplay);
  }, [address]);

  const handleSuggestionSelect = (option: any) => {
    const placeId = option.value;
    const loader = new Loader({
      apiKey: GOOGLE_API_KEY,
      libraries: ['places'],
    });
    loader.load().then((google) => {
      const placesService = new google.maps.places.PlacesService(document.createElement('div'));
      placesService.getDetails({ placeId }, (place: any) => {
        if (place && place.address_components) {
          const addressComponents = place.address_components.reduce((acc: any, component: any) => {
            const type = component.types[0];
            acc[type] = component.short_name;
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
          const addressValue = { target: { name: "address", value: formattedAddress } };
          setAddress(addressValue);
          setSuggestions([]);
        }
      });
    });
  };

  useEffect(() => {
    initAutocomplete();
  }, []);

  useEffect(() => {
    handleDisplay();
  }, [address, handleDisplay]);

  return (
    <>
      <style jsx>{styles}</style>
      <style jsx>{aStyles}</style>
      <FormControl
        error={error}
        label={label}
        traits={traits}
        variant={variant}
      >
        <input
          data-element='input'
          className={inputClasses}
          id="autocomplete-address"
          type="text"
          ref={inputRef}
          placeholder="Enter address"
          value={display}
          name="address"
          onChange={handleInputChange}
        />
      </FormControl>
      {suggestions.length > 0 && (
        <div className='address-input--suggestions'>
          <UiMenu
            options={suggestions.map(suggestion => ({
              label: suggestion.structured_formatting.main_text,
              value: suggestion.place_id,
              secondary: suggestion.structured_formatting.secondary_text
            }))}
            onSelect={handleSuggestionSelect}
          />
        </div>
      )}
    </>
  );
};

export default AutocompleteAddressInput;
