import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from '../UiInput.scss';
import aStyles from './AddressInput.scss';
import { Loader } from '@googlemaps/js-api-loader';
import FormControl, { ITraits } from "@webstack/components/UiForm/components/FormControl/FormControl";
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
  size?: any;
  placeholder?: string;
}

const AutocompleteAddressInput = ({
  address,
  placeholder,
  size,
  setAddress,
  variant,
  traits,
  inputClasses,
  label,
  error
}: IAddressInput) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionTokenRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null);

  const [googleMaps, setGoogleMaps] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [display, setDisplay] = useState<string>("");

  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GAPI_KEY?.trim() || "";

  useEffect(() => {
    const loader = new Loader({
      apiKey: GOOGLE_API_KEY,
      version: "weekly",
      libraries: ['places'],
      id: "__googleMapsScriptId"
    });

    loader.load().then((google) => {
      setGoogleMaps(google);
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();

      if (google.maps.places.AutocompleteSuggestionService) {
        autocompleteServiceRef.current = new google.maps.places.AutocompleteSuggestionService();
      } else {
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
      }
    });
  }, []);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setDisplay(input);

    if (input.length > 2 && autocompleteServiceRef.current) {
      const request = {
        input,
        sessionToken: sessionTokenRef.current
      };

      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (predictions: any[]) => {
          setSuggestions(predictions || []);
        }
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionSelect = (option: any) => {
    const placeId = option.value;

    const service = new googleMaps.maps.places.PlacesService(document.createElement('div'));

    service.getDetails({ placeId, sessionToken: sessionTokenRef.current }, (place: any) => {
      if (place && place.address_components) {
        const addressComponents = place.address_components.reduce((acc: any, component: any) => {
          const type = component.types[0];
          acc[type] = component.short_name;
          return acc;
        }, {});

        const formattedAddress = {
          line1: `${addressComponents.street_number || ''} ${addressComponents.route || ''}`.trim(),
          line2: addressComponents.sublocality || '',
          city: addressComponents.locality || '',
          state: addressComponents.administrative_area_level_1 || '',
          postal_code: addressComponents.postal_code || '',
          country: addressComponents.country || '',
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        };

        setAddress({ target: { name: "address", value: formattedAddress } });
        setSuggestions([]);
        sessionTokenRef.current = new googleMaps.maps.places.AutocompleteSessionToken(); // refresh token
      }
    });
  };

  const handleDisplay = useCallback(() => {
    const addressDisplay = address
      ? `${address?.line1 ? address.line1 + ', ' : ''}${address?.line2 ? address.line2 + ' ' : ''}${address?.city ? address.city + ' ' : ''}${address?.state ? address.state + ', ' : ''}${address?.postal_code ? address.postal_code + ', ' : ''}${address?.country ? address.country : ''}`
      : '';
    setDisplay(addressDisplay);
  }, [address]);

  useEffect(() => {
    handleDisplay();
  }, [address, handleDisplay]);

  return (
    <>
      <style jsx>{styles}</style>
      <style jsx>{aStyles}</style>
      <div className='address-input'>
        <FormControl
          size={size}
          error={error}
          label={label}
          traits={{ ...traits, variant: "address" }}
          variant={variant}
        >
          <input
            data-element='input'
            className={`${inputClasses || ''} address-input`}
            id="autocomplete-address"
            type="text"
            ref={inputRef}
            placeholder={placeholder || "Enter address"}
            value={display}
            name="address"
            onChange={handleInputChange}
          />
        </FormControl>
        {suggestions.length > 0 && (
          <div className='address-input--suggestions'>
            <UiMenu
              options={suggestions.map(suggestion => ({
                label: suggestion.structured_formatting?.main_text || suggestion.description,
                value: suggestion.place_id,
                secondary: suggestion.structured_formatting?.secondary_text || ''
              }))}
              onSelect={handleSuggestionSelect}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AutocompleteAddressInput;
