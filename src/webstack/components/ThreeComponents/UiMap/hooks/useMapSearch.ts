import { useEffect, useState } from "react"
import { flyToView } from "../functions/mapControls";

const useMapSearch = ({lngLat, setLngLat, map}:any)=>{
    const [searched, setSearched] = useState<number[] | undefined>();

    const handleSearch = (e: any) => {
        const value = e.target.value;
        const searchedLngLat: number[] = [value?.lng, value?.lat];
        if (searchedLngLat) {
            setSearched(value);
            setLngLat(searchedLngLat);
            flyToView(map, { lngLat: searchedLngLat, zoom: 14 });
        }
    };

    useEffect(()=>{},[handleSearch])
    return {searched, handleSearch}
};
export default useMapSearch;