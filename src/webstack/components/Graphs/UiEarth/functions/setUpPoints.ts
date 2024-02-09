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
    const markerSvg = IconHelper.getIconSvg('fa-circle-user', { width: 25, height: 25, color: '#fff000' });

    const {pts, points, setPoints} = pointsDefinitions;
    if (!myGlobe) return;
    if (!pts) setPoints(points);
    if (pts && myGlobe) {
        myGlobe.htmlElementsData(pts)
            .htmlElement((d: any) => {
                const el = document.createElement('div');
                el.className='globe-marker'
                el.style.userSelect = 'all';
                el.setAttribute('data-id',d.id)
                el.innerHTML = `${markerSvg}<div class='globe-html'>${d.html}</div>`;
                return el;
            }).htmlAltitude('alt');
    }
}

export default setUpPoints;