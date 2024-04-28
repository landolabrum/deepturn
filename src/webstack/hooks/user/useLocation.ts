import { useEffect, useState } from "react";
interface IUseLocation{
    lat: number,
    lng: number
}
const useLocation = (): IUseLocation | undefined => {
    const [loc, setLoc] = useState<IUseLocation | undefined>()
    const success = (position: any) => setLoc(
        {lat: Number(position.coords.latitude.toFixed(2)), lng: Number(position.coords.longitude.toFixed(2))}
    );

    function error() {
        console.error("Unable to retrieve your location");
        return;
    }

    useEffect(() => {
        if (navigator.geolocation)navigator.geolocation.getCurrentPosition(
            success,
            error
        )
        else console.error("Geolocation not supported");
    }, [setLoc]);
    return loc;
}
export default useLocation;