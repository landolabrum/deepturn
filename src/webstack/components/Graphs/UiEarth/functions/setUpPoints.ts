import { EarthPoint } from "../models/IEarth";
import { Dispatch, SetStateAction } from 'react';
import IconHelper from '@webstack/helpers/IconHelper';
const setUpPoints = (
    myGlobe: any,
    pointsDefinitions: {
        pts: EarthPoint[] | undefined;
        points: EarthPoint[];
        setPoints: React.Dispatch<React.SetStateAction<EarthPoint[] | undefined>>;
    }) => {
    const markerSvg = IconHelper.getIconSvg('fa-circle-user', { width: 17, height: 17, color: '#fff000' });

    const {pts, points, setPoints} = pointsDefinitions;
    if (!myGlobe) return false;
    if (!pts) setPoints(points);
    if (pts && myGlobe) {
        myGlobe.htmlElementsData(pts)
            .htmlElement((d: any) => {
                const el = document.createElement('a');
                const el_id = `mrkr-${d.id}`;
                el.className='globe-marker'
                el.id = el_id;
                el.onclick=()=>window.location.href = `admin?vid=customers&id=${d.id}`;
                el.innerHTML = `
                <div>${markerSvg}</div>
                <div class='globe-html'>${d.html}</div>`;
                return el;
            }).htmlAltitude('alt');
            return true
    }
    return false
}

export default setUpPoints;