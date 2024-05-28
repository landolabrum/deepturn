import {
  UiIconSet,
  UiIconStrokeOptions,
} from "../types/icons";
import {  spinner } from "./html/theme";
import { emptyCart } from "./html/ecommerce/empty-cart";
import { brandIcons } from "./categories/brand_icons";
import { methodIcons } from "./categories/method_icons";
import { fontAwesomeLight } from "./categories/fontAwesome/FontAwesomeLight";
import { fontAwesomeSolid } from "./categories/fontAwesome/FontAwesomeSolid";
import { socialIcons } from "./categories/social_icons";
import { offGridBox, smallBox, mediumBox, largeBox } from "./html/ecommerce/products/box";
import { customRaceLines } from "./categories/custom_icons";
import { fontAwesome } from "./categories/fontAwesome/FontAwesome";
const outline2px: UiIconStrokeOptions = {
  width: 2,
  lineCap: "round",
  lineJoin: "round",
};
const imported_icons = {
  ...socialIcons,
  ...methodIcons
}
 

const Icons: UiIconSet = {
  // PAYMENT METHODS
  ...imported_icons,
  ...fontAwesome,
  ...fontAwesomeLight,
  ...fontAwesomeSolid,
  //  THEME
  spinner: { width: 100, height: 100, html: spinner },
  "deepturn-logo":brandIcons.deepturn_logo,
  "nirvana-energy-logo":brandIcons.nirvana_logo,
  "aire-hotel-logo":brandIcons.aire_hotel_logo,
  "fmc-logo": brandIcons.fmc,

  'offgrid-box': offGridBox,
  'small-box': smallBox,
  'medium-box': mediumBox,
  'large-box': largeBox,
  'c-race-lines':customRaceLines,
  "theme-skull":{
    path: "M524.78,817.8c-12.49,14.45-20.13,16.17-34.56,7.64-6.6,8.16-14.56,16-25.68,15.31-9.79-.6-19.39-4.37-30.94-7.19-20.89,13.77-30,13.8-51.65-1.36-21,15.16-31.55,15.14-51.39,1.29-11.49,2.77-21.3,6.5-31.32,7.17-10.93.73-18.69-7-25.24-15.06-15.4,8.21-22.6,6.59-34.48-7.55-12.35,6.84-24.27-1.23-24.76-17.77-.57-18.76.21-37.55.11-56.32-.11-23.07-8.89-42.4-27.6-55.91a198.2,198.2,0,0,0-35.17-19.88c-16-7.16-32.78-12.46-49.06-19-20.85-8.36-37.45-21.78-45.91-43.12a75.19,75.19,0,0,1-4.86-24.14c-.67-15.65-.19-31.37.12-47a91.94,91.94,0,0,0-8.64-40.7C23.45,449.7,8.89,403.48,2.44,354.9c-8.8-66.34,6.13-126.79,45.68-181,63.22-86.6,146.16-144,251.76-165.11,125.39-25,238.87,3.33,338.93,83,39.57,31.49,72.58,69.24,96.9,113.8,25.52,46.77,32.84,97,25.73,149.62-6.59,48.85-21.19,95.22-41.63,139.9a92.57,92.57,0,0,0-8.35,40.1c.16,13.07.24,26.15.76,39.2,1.35,34.29-15.48,57.31-45.06,71.86-11.66,5.73-24.35,9.29-36.33,14.4-14.8,6.33-30,12.12-43.86,20.13-28.2,16.31-40.23,41.47-37.7,74.12a353.93,353.93,0,0,1,.19,44.18c-.25,5.35-2.84,11.06-5.8,15.69C538.65,822.67,533.15,823.18,524.78,817.8ZM422.24,444.68c.7,10.07.86,19.84,2.13,29.46,3.72,28.29,15.7,52.18,39.4,69a175.69,175.69,0,0,0,85.06,31.72c44.06,4.44,74-17.11,85.75-59.82,5.09-18.5,6.44-37.35,5.36-56.45-1.91-33.72-16.9-59.77-47-75.41C558.07,365,520.6,357.7,481.34,362.7c-29.75,3.78-50.42,23.21-56.33,52.53C423.06,424.94,423.09,435,422.24,444.68Zm-79.41,2.85-1.19-.22c-.4-6.87-.9-13.74-1.18-20.62-1.4-34.53-24.54-60.15-59-64.17-38.52-4.5-75.19,2.81-109.65,20.19-22.2,11.2-37.76,28.91-44,53.29-8.19,32-5.51,63.78,7.06,94.19,9.88,23.87,27.66,39.79,53.89,43.62,39.45,5.77,74.43-7.75,107.18-27.79,20.86-12.77,34.68-31.74,40.14-55.75C339.32,476.24,340.66,461.79,342.83,447.53Zm39.22,178.68c2.92,3.91,5.38,8,8.64,11.4,8.31,8.57,18.62,10,29.55,6.53,9.44-3,15.27-9.68,16.24-19.59,1-10.46-3.79-19.49-11.07-26-12.67-11.3-26.46-21.37-39.94-31.73-1.31-1-4.29-1.35-5.66-.55-17.75,10.29-34.62,21.77-46.36,39.12-4.3,6.35-7.27,13.38-5.41,21.45,2.19,9.5,8.32,15.5,17.47,17.82,11.07,2.8,21.3.81,29.16-8.23C377.43,633.28,379.62,629.61,382.05,626.21Z",
    height: 843,
    width: 765
  },

  "empty-cart":{
    html: emptyCart,
    height: 100,
    width: 100
  },
};
export default Icons;
