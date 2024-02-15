"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6559],{16559:function(e,t,o){o.r(t),o.d(t,{default:function(){return k}});var r,n,a=o(59499),i=o(8151),l=o.n(i),c=[".d-flex.jsx-1275881962,.ui-earth__tools.jsx-1275881962,.ui-earth.jsx-1275881962{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".ui-earth.jsx-1275881962{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;height:inherit;width:inherit;}",".ui-earth__header.jsx-1275881962{position:absolute;left:0;top:0;z-index:1;width:100%;}",".ui-earth__tools.jsx-1275881962{position:absolute;top:var(--s-10);padding:var(--padding);-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;opacity:0.5;right:var(--s-9);}","@media (max-width:1100px){.ui-earth__tools.jsx-1275881962{top:calc(var(--element-height) + var(--s-9));}}",".ui-earth__tools.jsx-1275881962:hover{opacity:1;}",".ui-earth__container.jsx-1275881962{width:inherit;}",".globe-marker.jsx-1275881962{min-width:var(--element-height);padding:var(--padding);background-color:#f30;z-index:1111;}"];c.__hash="1275881962";var s=o(67294),u=o(62699),h=o(99477),d=function(e,t){if(!t)return[];var o=t&&t.target?t.target.clone():new h.Pa4,r=p(t),n=[],a=e.toGlobeCoords(o.x,o.y);if(!a)return n;for(var i=a.lat,l=a.lng,c=Math.ceil(window.innerWidth/256),s=Math.ceil(window.innerHeight/256),u=0;u<s;u++)for(var d=0;d<c;d++){var f,g,m=Math.floor((l+180)/360*(1<<r)),b=Math.floor((1-Math.log(Math.tan(i*Math.PI/180)+1/Math.cos(i*Math.PI/180))/Math.PI)/2*(1<<r)),v=(f=d,g=u,isNaN(r)||isNaN(m)||isNaN(b)?(console.error("Invalid tile calculation:",{zoomLevel:r,tileX:m,tileY:b}),null):"https://a.tile.openstreetmap.org/".concat(r,"/").concat(m+f,"/").concat(b+g,".png"));v&&n.push(v)}return n},p=function(e){if(!e||!e.object)return console.error("OrbitControls or the associated camera is not properly initialized."),0;var t=Math.max(e.object.position.length(),6372)-6371;return Math.min(Math.max(t>0?Math.max(0,19-Math.log2(t/2e4*19)):19,0),19)},f=(r=function(e){var t=new Image;t.crossOrigin="Anonymous",t.onload=function(){return console.log("Loaded tile:",e)},t.onerror=function(t){return console.error("Error loading tile:",e,t)},t.src=e},n=null,function(){for(var e=this,t=arguments.length,o=Array(t),a=0;a<t;a++)o[a]=arguments[a];null!==n&&clearTimeout(n),n=setTimeout(function(){n=null,r.apply(e,o)},1e3)}),g=function(e,t,o){e&&t&&(o.globeImageUrl&&e.globeImageUrl(o.globeImageUrl),e.atmosphereColor(o.atmosphereColor||"rgba(0, 120, 255, 0.5)"),e.atmosphereAltitude(o.atmosphereAltitude||.15),o.rotate&&"object"==typeof o.rotate?(e.controls().autoRotate=!0,e.controls().autoRotateSpeed=o.rotate.speed||.5):e.controls().autoRotate=!1,document.addEventListener("mousemove",function(){!function(e){e.forEach(f)}(d(e,t))}))},m=o(57002),b=function(e,t){var o=m.Z.getIconSvg("fa-circle-user",{width:17,height:17,color:"#fff000"}),r=t.pts,n=t.points,a=t.setPoints;return!!e&&(r||a(n),!!r&&!!e&&(e.htmlElementsData(r).htmlElement(function(e){var t=document.createElement("a"),r="mrkr-".concat(e.id);return t.className="globe-marker",t.id=r,t.onclick=function(){return window.location.href="admin?vid=customers&id=".concat(e.id)},t.innerHTML="\n                <div>".concat(o,"</div>\n                <div class='globe-html'>").concat(e.html,"</div>"),t}).htmlAltitude("alt"),!0))};function v(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,r)}return o}var j=function(e,t,o,r){if(e&&t.current){var n=o.showAtmosphere,i=o.showGraticules,l=o.backgroundColor,c=o.backgroundImageUrl,s=o.position,u=e.getGlobeRadius(),h={lat:(null==s?void 0:s.lat)||0,lng:(null==s?void 0:s.lng)||0,altitude:(null==s?void 0:s.alt)||.02*u},d=t.current.offsetWidth,p=t.current.offsetHeight;e.width(d).height(p).pointOfView(function(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?v(Object(o),!0).forEach(function(t){(0,a.Z)(e,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):v(Object(o)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))})}return e}({},h),0).showAtmosphere(n||!1).showGraticules(i||!1),c?e.backgroundImageUrl(c):e.backgroundColor(l||"#00000000")}},x=o(34221),w=o(7044),y=o(85893);function _(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,r)}return o}function O(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?_(Object(o),!0).forEach(function(t){(0,a.Z)(e,t,o[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):_(Object(o)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))})}return e}var k=function(e){e.globeImageUrl;var t=e.points,o=e.position,r=e.backgroundColor,n=e.showAtmosphere,a=e.backgroundImageUrl,i=e.showGraticules,h=e.rotate,d=(0,s.useRef)(),p=(0,s.useRef)(),f=[{name:"map",value:"no-clouds.jpg"},{name:"lrg",value:"earth-large.jpg"},{name:"dark",value:"dark.jpg"},{name:"day",value:"day.jpg"},{name:"night",value:"night.jpg"}],m=(0,s.useState)(O(O({},f[0]),{},{value:"/assets/globe-textures/".concat(f[0].value)})),v=m[0],_=m[1],k=(0,s.useState)(),P=k[0],M=k[1],I=(0,x.Z)().width,N={showAtmosphere:n,showGraticules:i,backgroundColor:r,backgroundImageUrl:a,position:void 0===o?{lat:40.65654718559953,lng:-111.81447097331733,alt:.5}:o,globeImageUrl:null==v?void 0:v.value,rotate:h},E={pts:P,points:void 0===t?[{name:"Holladay",lat:40.65654718559953,lng:-111.81447097331733,alt:0}]:t,setPoints:M},C=(null==d?void 0:d.current)&&(0,u.Z)()(d.current),D=C?C.controls():null;return(0,s.useEffect)(function(){C&&(j(C,p,N,I),g(C,D,N),b(C,E))},[I,C,b,g,j,d.current,D]),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(l(),{id:c.__hash,children:c}),(0,y.jsxs)("div",{className:"jsx-".concat(c.__hash)+" ui-earth",children:[(0,y.jsx)("div",{className:"jsx-".concat(c.__hash)+" ui-earth__header",children:(0,y.jsx)("div",{className:"jsx-".concat(c.__hash)+" ui-earth__tools",children:(0,y.jsx)("div",{className:"jsx-".concat(c.__hash)+" ui-earth__tools-tool",children:(0,y.jsx)(w.Z,{openDirection:"right",value:null==v?void 0:v.name,options:f,onSelect:function(e){_(O(O({},e),{},{value:"/assets/globe-textures/".concat(e.value)})),g(C,D,N)}})})})}),(0,y.jsx)("div",{ref:p,className:"jsx-".concat(c.__hash)+" ui-earth__container",children:(0,y.jsx)("div",{id:"earth",ref:d,className:"jsx-".concat(c.__hash)})})]})]})}}}]);