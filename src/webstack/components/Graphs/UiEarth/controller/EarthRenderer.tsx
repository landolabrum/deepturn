// /home/web/servers/Deepturn/src/webstack/components/Graphs/UiEarth/controller/EarthRenderer.tsx
import dynamic from 'next/dynamic';
import { IEarth } from '../models/IEarth';

const Earth = dynamic(() => import('@webstack/components/Graphs/UiEarth/controller/UiEarth'), { ssr: false });
const UiEarth = (props:IEarth) => <Earth {...props}/>;
export default UiEarth;
