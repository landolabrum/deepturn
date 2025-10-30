import React, { useEffect, useState } from 'react';
import styles from './LocationAutoComplete.scss';
import {debounce} from 'lodash';

interface PlaceResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  placeholder?: string;
  onSelect: (place: PlaceResult) => void;
  className?: string;
}

const LocationAutoComplete: React.FC<Props> = ({ placeholder = 'Search location', onSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = debounce(async (text: string) => {
    if (!text) return setResults([]);
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&addressdetails=1&limit=5`);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error('LocationAutoComplete: error fetching results', err);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    fetchSuggestions(query);
    return () => fetchSuggestions.cancel();
  }, [query]);

  const handleSelect = (place: PlaceResult) => {
    onSelect(place);
    setQuery(place.display_name);
    setResults([]);
  };

  return (
    <>
      <style jsx>{styles}</style>
      <div className={`location-autocomplete ${className}`}>
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => setQuery(e.target.value)}
          className="location-autocomplete__input"
        />
        {loading && <div className="location-autocomplete__loading">Loading…</div>}
        {!!results.length && (
          <ul className="location-autocomplete__dropdown">
            {results.map((place, index) => (
              <li key={index} onClick={() => handleSelect(place)} className="location-autocomplete__item">
                {place.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default LocationAutoComplete;
