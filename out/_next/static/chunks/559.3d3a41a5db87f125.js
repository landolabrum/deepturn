"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[559],{16559:function(e,t,r){r.r(t),r.d(t,{default:function(){return v}});var o=r(59499),n=r(8151),a=r.n(n),i=[".d-flex.jsx-1606357379,.ui-earth__tools.jsx-1606357379,.ui-earth.jsx-1606357379{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".ui-earth.jsx-1606357379{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;}","@media (max-width:1100px){.ui-earth.jsx-1606357379{height:inherit;}}",".ui-earth__header.jsx-1606357379{width:100%;}",".ui-earth__tools.jsx-1606357379{padding:var(--padding);-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;opacity:0.3;}",".ui-earth__tools.jsx-1606357379:hover{opacity:1;}",".ui-earth__container.jsx-1606357379{width:100%;aspect-ratio:1;}"];i.__hash="1606357379";var l=r(67294),s=r(62699),c=function(e,t){var r=t.globeImageUrl,o=t.rotate;e&&(e.globeImageUrl(r||"https://shadedrelief.com/natural3/ne3_data/8192/textures/2_no_clouds_8k.jpg"),o&&"object"==typeof o?(e.controls().autoRotate=!0,e.controls().autoRotateSpeed=o.speed||.5):e.controls().autoRotate=!1)},u=r(57002),h=function(e,t){var r=u.Z.getIconSvg("fa-circle-user",{width:25,height:25,color:"#fff000"}),o=t.pts,n=t.points,a=t.setPoints;e&&(o||a(n),o&&e&&e.htmlElementsData(o).htmlElement(function(e){var t=document.createElement("div");return t.className="globe-marker",t.style.userSelect="all",t.setAttribute("data-id",e.id),t.innerHTML="".concat(r,"<div class='globe-html'>").concat(e.html,"</div>"),t}).htmlAltitude("alt"))};function d(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,o)}return r}var p=function(e,t,r,n){if(e&&t.current){var a=r.showAtmosphere,i=r.showGraticules,l=r.backgroundColor,s=r.backgroundImageUrl,c=r.position,u=e.getGlobeRadius(),h={lat:(null==c?void 0:c.lat)||0,lng:(null==c?void 0:c.lng)||0,altitude:(null==c?void 0:c.alt)||.02*u},p=t.current.offsetWidth,f=t.current.offsetHeight;e.width(p).height(n<1100?f:p).pointOfView(function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?d(Object(r),!0).forEach(function(t){(0,o.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):d(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}({},h),0).showAtmosphere(a||!1).showGraticules(i||!1),s?e.backgroundImageUrl(s):e.backgroundColor(l||"#00000000")}},f=r(34221),g=r(7044),b=r(85893);function m(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,o)}return r}function j(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?m(Object(r),!0).forEach(function(t){(0,o.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):m(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var v=function(e){e.globeImageUrl;var t=e.points,r=e.position,o=e.backgroundColor,n=e.showAtmosphere,u=e.backgroundImageUrl,d=e.showGraticules,m=e.rotate,v=(0,l.useRef)(),x=(0,l.useRef)(),_=[{name:"blue marble",value:"blue-marble.jpg"},{name:"dark",value:"dark.jpg"},{name:"day",value:"day.jpg"},{name:"night",value:"night.jpg"},{name:"topology",value:"topology.png"},{name:"sky",value:"sky.png"}],y=j(j({},_[0]),{},{value:"/assets/globe-textures/no-clouds.jpg"}),w=(0,l.useState)(y),O=w[0],k=w[1],P=(0,l.useState)(),E=P[0],S=P[1],D=(0,f.Z)().width,I={showAtmosphere:n,showGraticules:d,backgroundColor:o,backgroundImageUrl:u,position:void 0===r?{lat:40.65654718559953,lng:-111.81447097331733,alt:.5}:r,globeImageUrl:null==O?void 0:O.value,rotate:m},N={pts:E,points:void 0===t?[{name:"Holladay",lat:40.65654718559953,lng:-111.81447097331733,alt:0}]:t,setPoints:S},U=(null==v?void 0:v.current)&&(0,s.Z)()(v.current);return(0,l.useEffect)(function(){U&&(p(U,x,I,D),c(U,I),h(U,N))},[D,U]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(a(),{id:i.__hash,children:i}),(0,b.jsxs)("div",{className:"jsx-".concat(i.__hash)+" ui-earth",children:[(0,b.jsx)("div",{className:"jsx-".concat(i.__hash)+" ui-earth__header",children:(0,b.jsx)("div",{className:"jsx-".concat(i.__hash)+" ui-earth__tools",children:(0,b.jsx)("div",{className:"jsx-".concat(i.__hash)+" ui-earth__tools-tool",children:(0,b.jsx)(g.Z,{value:null==O?void 0:O.name,options:_,onSelect:function(e){k(j(j({},e),{},{value:"//unpkg.com/three-globe/example/img/earth-".concat(e.value)})),c(U,I)}})})})}),(0,b.jsx)("div",{ref:x,className:"jsx-".concat(i.__hash)+" ui-earth__container",children:(0,b.jsx)("div",{id:"earth",ref:v,className:"jsx-".concat(i.__hash)})})]})]})}}}]);