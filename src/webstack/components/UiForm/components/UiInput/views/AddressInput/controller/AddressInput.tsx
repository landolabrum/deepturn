import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '@webstack/components/UiForm/components/UiInput/UiInput.scss';
import aStyles from './AddressInput.scss';
import { Loader } from '@googlemaps/js-api-loader';
import FormControl, { ITraits } from '@webstack/components/UiForm/components/FormControl/FormControl';
import { IFormControlVariant } from '@webstack/components/AdapTable/models/IVariant';
import UiMenu from '@webstack/components/UiMenu/UiMenu';

interface IAddressInput {
  name?: string;
  address?: any;
  setAddress: (e: any) => void;
  traits?: ITraits;
  variant?: IFormControlVariant;
  inputClasses?: string;
  label?: string;
  error?: string | null;
  size?: any;
  placeholder?: string;
  /** Optional override; if omitted we try NEXT_PUBLIC_GAPI_KEY and window.google if already loaded */
  apiKey?: string;
}

type Suggestion = { label: string; value: string; secondary?: string };

const useDebounce = (ms: number) => {
  const t = useRef<number | null>(null);
  const run = useCallback((fn: () => void) => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => { t.current = null; fn(); }, ms);
  }, [ms]);
  useEffect(() => () => { if (t.current) window.clearTimeout(t.current); }, []);
  return run;
};

const AutocompleteAddressInput = ({
  name = 'address',
  address,
  placeholder,
  size,
  setAddress,
  variant,
  traits,
  inputClasses,
  label,
  error,
  apiKey,
}: IAddressInput) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionTokenRef = useRef<any>(null);
  const autocompleteServiceRef = useRef<any>(null); // AutocompleteService
  const [googleMaps, setGoogleMaps] = useState<any>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [display, setDisplay] = useState('');
  const [locating, setLocating] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const ENV_KEY = (process.env.NEXT_PUBLIC_GAPI_KEY || '').trim();
  const EFFECTIVE_KEY = (apiKey || ENV_KEY || '').trim();
  const debounce = useDebounce(120);

  /* ------------ load / reuse Google Places ------------- */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const already = (window as any).google?.maps?.places;
    const init = (google: any) => {
      setGoogleMaps(google);
      sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
      autocompleteServiceRef.current = new google.maps.places.AutocompleteService();
    };

    // Reuse if present (e.g., signup route loaded it)
    if (already) {
      init((window as any).google);
      return;
    }

    // If not present and no key, log and stop (explicit, not silent)
    if (!EFFECTIVE_KEY) {
      console.warn(
        '[AddressInput] Google Maps Places not loaded and no API key provided. ' +
        'Pass <AutocompleteAddressInput apiKey="..."> or set NEXT_PUBLIC_GAPI_KEY.'
      );
      return;
    }

    const loader = new Loader({
      apiKey: EFFECTIVE_KEY,
      version: 'weekly',
      libraries: ['places'],
      id: '__googleMapsScriptId',
    });

    loader.load().then(init).catch((err) => {
      console.error('[AddressInput] Failed to load Google Maps:', err);
    });
  }, [EFFECTIVE_KEY]);

  /* ---------------- helpers ---------------- */
  const componentsToAddress = useCallback((place: any) => {
    const comps = (place?.address_components ?? []).reduce((acc: any, c: any) => {
      const t = c?.types?.[0];
      if (t) acc[t] = c.short_name;
      return acc;
    }, {});
    return {
      line1: `${comps.street_number || ''} ${comps.route || ''}`.trim(),
      line2: comps.sublocality || '',
      city: comps.locality || '',
      state: comps.administrative_area_level_1 || '',
      postal_code: comps.postal_code || '',
      country: comps.country || '',
      lat: place?.geometry?.location?.lat?.() ?? 0,
      lng: place?.geometry?.location?.lng?.() ?? 0,
    };
  }, []);

  const setAddressAndDisplay = useCallback((addrObj: any) => {
    setAddress({ target: { name, value: addrObj } });
    const str =
      `${addrObj?.line1 ? addrObj.line1 + ', ' : ''}` +
      `${addrObj?.line2 ? addrObj.line2 + ' ' : ''}` +
      `${addrObj?.city ? addrObj.city + ' ' : ''}` +
      `${addrObj?.state ? addrObj.state + ', ' : ''}` +
      `${addrObj?.postal_code ? addrObj.postal_code + ', ' : ''}` +
      `${addrObj?.country ?? ''}`;
    setDisplay(str.trim());
  }, [setAddress, name]);

  /* ----------- reflect external address value into input ---------- */
  useEffect(() => {
    const s = address
      ? `${address?.line1 ? address.line1 + ', ' : ''}${address?.line2 ? address.line2 + ' ' : ''}${address?.city ? address.city + ' ' : ''}${address?.state ? address.state + ', ' : ''}${address?.postal_code ? address.postal_code + ', ' : ''}${address?.country ? address.country : ''}`
      : '';
    setDisplay(s);
  }, [address]);

  /* ---------------- position menu (portal) ---------------- */
  const updateMenuPos = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setMenuPos({ top: r.bottom + window.scrollY, left: r.left + window.scrollX, width: r.width });
  }, []);

  useEffect(() => {
    if (!suggestions.length) return;
    updateMenuPos();
    const handler = () => updateMenuPos();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler, true);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler, true);
    };
  }, [suggestions.length, updateMenuPos]);

  /* ---------------- fetch suggestions ---------------- */
  const normalize = (arr: any[]): Suggestion[] =>
    (arr ?? []).map((s: any) => ({
      label: s?.structured_formatting?.main_text || s?.description || '',
      value: s?.place_id,
      secondary: s?.structured_formatting?.secondary_text || '',
    })).filter(s => s.value && s.label);

  const fetchSuggestions = useCallback((input: string) => {
    const svc = autocompleteServiceRef.current;
    if (!svc || !input || input.length < 3) { setSuggestions([]); return; }

    const req: any = {
      input,
      types: ['geocode'],
      sessionToken: sessionTokenRef.current
    };

    svc.getPlacePredictions(req, (preds: any[], status: any) => {
      // Accept either enum or any non-empty results
      const gm = googleMaps?.maps?.places;
      const ok =
        (gm?.AutocompleteServiceStatus && status === gm.AutocompleteServiceStatus.OK) ||
        (gm?.PlacesServiceStatus && status === gm.PlacesServiceStatus.OK);

      const next = normalize(preds);
      setSuggestions(ok || next.length ? next : []);
    });
  }, [googleMaps]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDisplay(val);
    debounce(() => fetchSuggestions(val));
  };

  /* ---------------- suggestion → place details ---------------- */
  const handleSuggestionSelect = (optOrValue: any) => {
    if (!googleMaps) return;

    const placeId: string = typeof optOrValue === 'string' ? optOrValue : optOrValue?.value;
    if (!placeId) return;

    const service = new googleMaps.maps.places.PlacesService(document.createElement('div'));
    const req: any = {
      placeId,
      sessionToken: sessionTokenRef.current,
      fields: ['address_components', 'geometry.location'],
    };

    service.getDetails(req, (place: any, status: any) => {
      if (status !== googleMaps.maps.places.PlacesServiceStatus.OK || !place) return;
      const addrObj = componentsToAddress(place);
      setAddressAndDisplay(addrObj);
      setSuggestions([]);
      sessionTokenRef.current = new googleMaps.maps.places.AutocompleteSessionToken();
      inputRef.current?.focus();
    });
  };

  /* ---------------- crosshairs: use current location ---------------- */
  const handleUseCurrentLocationCore = useCallback(() => {
    if (!googleMaps || !('geolocation' in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const geocoder = new googleMaps.maps.Geocoder();
        geocoder.geocode(
          { location: { lat, lng }, resultType: ['street_address'] as any },
          (results: any[], status: any) => {
            setLocating(false);
            if (status !== 'OK' || !results?.length) return;
            const addrObj = componentsToAddress(results[0]);
            setAddressAndDisplay(addrObj);
            setSuggestions([]);
            inputRef.current?.focus();
          }
        );
      },
      () => setLocating(false),
      { enableHighAccuracy: true, maximumAge: 15000, timeout: 12000 }
    );
  }, [googleMaps, componentsToAddress, setAddressAndDisplay]);

  const handleCrosshairsClick = useCallback((e: any) => {
    try { e?.preventDefault?.(); e?.stopPropagation?.(); (e as any)?.nativeEvent?.stopImmediatePropagation?.(); } catch {}
    handleUseCurrentLocationCore();
  }, [handleUseCurrentLocationCore]);

  const fullTraits: ITraits | undefined = useMemo(() => ({
    ...traits,
    afterIcon: { icon: locating ? 'spinner' : 'fa-crosshairs', onClick: handleCrosshairsClick },
    variant: 'address',
  }), [traits, locating, handleCrosshairsClick]);

  /* ---------------- render ---------------- */
  const portalMenu = (suggestions.length > 0 && menuPos && typeof document !== 'undefined')
    ? createPortal(
        <div
          className="address-input--suggestions-portal"
          style={{ position: 'absolute', top: `${menuPos.top}px`, left: `${menuPos.left}px`, width: `${menuPos.width}px`, zIndex: 9999 }}
          onMouseDown={(e) => e.preventDefault()}
        >
          <UiMenu options={suggestions} onSelect={handleSuggestionSelect} />
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <style jsx>{styles}</style>
      <style jsx>{aStyles}</style>
      <div className="address-input">
        <FormControl
          size={size}
          error={error}
          label={label}
          traits={fullTraits}
          variant={variant}
        >
          <input
            data-element="input"
            className={`${inputClasses || ''} address-input`}
            id={`autocomplete-${name}`}
            type="text"
            ref={inputRef}
            placeholder={placeholder || 'Enter address'}
            value={display}
            name={name}
            autoComplete="street-address"
            onChange={handleInputChange}
            onFocus={() => { if ((display || '').length >= 3) debounce(() => fetchSuggestions(display)); }}
          />
        </FormControl>
        {portalMenu}
      </div>
    </>
  );
};

export default AutocompleteAddressInput;
