(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8152],{62705:function(e,t,i){var n=i(55639).Symbol;e.exports=n},44239:function(e,t,i){var n=i(62705),a=i(89607),r=i(2333),s=n?n.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":s&&s in Object(e)?a(e):r(e)}},27561:function(e,t,i){var n=i(67990),a=/^\s+/;e.exports=function(e){return e?e.slice(0,n(e)+1).replace(a,""):e}},31957:function(e,t,i){var n="object"==typeof i.g&&i.g&&i.g.Object===Object&&i.g;e.exports=n},89607:function(e,t,i){var n=i(62705),a=Object.prototype,r=a.hasOwnProperty,s=a.toString,o=n?n.toStringTag:void 0;e.exports=function(e){var t=r.call(e,o),i=e[o];try{e[o]=void 0;var n=!0}catch(e){}var a=s.call(e);return n&&(t?e[o]=i:delete e[o]),a}},2333:function(e){var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},55639:function(e,t,i){var n=i(31957),a="object"==typeof self&&self&&self.Object===Object&&self,r=n||a||Function("return this")();e.exports=r},67990:function(e){var t=/\s/;e.exports=function(e){for(var i=e.length;i--&&t.test(e.charAt(i)););return i}},80954:function(e,t,i){var n=i(13218),a=i(7771),r=i(14841),s=Math.max,o=Math.min;e.exports=function(e,t,i){var c,l,d,x,u,f,h=0,m=!1,p=!1,g=!0;if("function"!=typeof e)throw TypeError("Expected a function");function b(t){var i=c,n=l;return c=l=void 0,h=t,x=e.apply(n,i)}function j(e){var i=e-f,n=e-h;return void 0===f||i>=t||i<0||p&&n>=d}function v(){var e,i,n,r=a();if(j(r))return y(r);u=setTimeout(v,(e=r-f,i=r-h,n=t-e,p?o(n,d-i):n))}function y(e){return(u=void 0,g&&c)?b(e):(c=l=void 0,x)}function w(){var e,i=a(),n=j(i);if(c=arguments,l=this,f=i,n){if(void 0===u)return h=e=f,u=setTimeout(v,t),m?b(e):x;if(p)return clearTimeout(u),u=setTimeout(v,t),b(f)}return void 0===u&&(u=setTimeout(v,t)),x}return t=r(t)||0,n(i)&&(m=!!i.leading,d=(p="maxWait"in i)?s(r(i.maxWait)||0,t):d,g="trailing"in i?!!i.trailing:g),w.cancel=function(){void 0!==u&&clearTimeout(u),h=0,c=f=l=u=void 0},w.flush=function(){return void 0===u?x:y(a())},w}},13218:function(e){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},37005:function(e){e.exports=function(e){return null!=e&&"object"==typeof e}},33448:function(e,t,i){var n=i(44239),a=i(37005);e.exports=function(e){return"symbol"==typeof e||a(e)&&"[object Symbol]"==n(e)}},7771:function(e,t,i){var n=i(55639);e.exports=function(){return n.Date.now()}},14841:function(e,t,i){var n=i(27561),a=i(13218),r=i(33448),s=0/0,o=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,l=/^0o[0-7]+$/i,d=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(r(e))return s;if(a(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=a(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=n(e);var i=c.test(e);return i||l.test(e)?d(e.slice(2),i?2:8):o.test(e)?s:+e}},8152:function(e,t,i){"use strict";i.d(t,{Z:function(){return q}});var n=i(21378),a=i.n(n),r=[".d-flex.jsx-2620752589,.index.jsx-2620752589 .index__full--title.jsx-2620752589,.index.jsx-2620752589 .index__full-ol.jsx-2620752589>div.jsx-2620752589,.index.jsx-2620752589 .index__full-ol.jsx-2620752589,.d-flex-column.jsx-2620752589,.index.jsx-2620752589{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".d-pad.jsx-2620752589{padding:var(--s-padding);width:calc(100% - var(--s-padding) * 2);}",".index__clouds.jsx-2620752589{height:100vh;width:100vw;}",".d-flex-column.jsx-2620752589,.index.jsx-2620752589{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".index.jsx-2620752589{width:100%;color:var(--gray-20);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:0;gap:var(--s-9);position:relative;height:100%;}","@media (max-width:1260px){.index.jsx-2620752589{width:calc(100% - var(--s-9) * 2);margin:auto;height:100% !important;}}",".index--title.jsx-2620752589{width:100%;text-align:center;padding:var(--s-element) 0 0;text-transform:capitalize;font-size:var(--s-1);color:var(--gray-10);}",".index.jsx-2620752589 .index__full-max.jsx-2620752589{width:100%;z-index:1;aspect-ratio:1;}",".index.jsx-2620752589 .index__full.jsx-2620752589{width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;gap:var(--s-padding);margin:var(--s-padding) 0 0;}",".index.jsx-2620752589 .index__full--max.jsx-2620752589{height:80vw;z-index:1;width:100%;}",".index.jsx-2620752589 .index__full.no-wrap.jsx-2620752589{-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;}","@media (max-width:900px){.index.jsx-2620752589 .index__full.no-wrap.jsx-2620752589{-webkit-flex-wrap:wrap-reverse;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse;}}",".index.jsx-2620752589 .index__full-ol.jsx-2620752589{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;margin-top:0;line-height:1.5;padding:var(--s-padding) 0 var(--s-element);}",".index.jsx-2620752589 .index__full-ol.jsx-2620752589 h2.jsx-2620752589{color:var(--primary);}",".index.jsx-2620752589 .index__full-ol.jsx-2620752589>div.jsx-2620752589{font-family:Game;color:var(--gray-20);padding:0 var(--s-9);font-size:var(--s-5);--ui-icon-size:var(--s-5);--ui-icon-color:var(--gray-40);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;gap:var(--s-9);position:relative;}",".index.jsx-2620752589 .index__full-li.jsx-2620752589{width:100%;}",".index.jsx-2620752589 .index__full-li--title.jsx-2620752589{font-size:var(--s-5);}",".index.jsx-2620752589 .index__full-li--body.jsx-2620752589{padding:var(--s-padding);font-size:var(--s-7);}",".index.jsx-2620752589 .index__full--title.jsx-2620752589{width:100%;text-transform:capitalize;color:var(--primary);--ui-icon-color:var(--primary);gap:var(--s-9);font-size:var(--s-1);white-space:normal;font-family:Play;line-height:1;margin:var(--s-element) 0 var(--s-padding);--ui-icon-size:var(--s-1);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}",".index.jsx-2620752589 .index__full--title.main.jsx-2620752589{font-size:45px;--ui-icon-size:45px;}",".index.jsx-2620752589 .index__full--title-deepturn.jsx-2620752589{font-size:40px;--ui-icon-size:50px;color:var(--gray-20);--ui-icon-color:var(--gray-20);text-transform:uppercase;-webkit-filter:drop-shadow(4px 5px 3px var(--gray-60));filter:drop-shadow(4px 5px 3px var(--gray-60));}",".index.jsx-2620752589 .index__full-padding.jsx-2620752589{position:relative;border-radius:var(--border-radius);white-space:nowrap;outline:solid 1px var(--gray-90);background-color:var(--gray-90);padding:var(--s-9) var(--s-padding);width:calc(var(--s-padding-width) - var(--s-padding) * 2);margin:0;}",".index.jsx-2620752589 .index__full-padding--title.jsx-2620752589{width:var(--s-padding-width);padding:var(--s-9) var(--s-1);}",".index.jsx-2620752589 .index__sub-title.jsx-2620752589{width:100%;text-transform:capitalize;font-size:var(--s-4);color:var(--gray-50);}",".index__half.jsx-2620752589{display:block;width:50%;}",".index__sub-title.jsx-2620752589{color:var(--gray-30);font-size:var(--s-4);}"];r.__hash="2620752589";var s=i(16835),o=i(67294),c=[".mbone.jsx-1456639211{width:100%;height:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}",".mbone.jsx-1456639211 .background-video.jsx-1456639211{position:fixed;top:0;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);min-width:calc(100vw + var(--s-1));width:auto;height:100%;min-height:calc(100vh + var(--s-1));height:100%;}",".mbone.jsx-1456639211 .background-video.jsx-1456639211 img.jsx-1456639211{left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);height:auto;width:100%;min-height:100vw;z-index:-111;position:absolute;-webkit-filter:blur(4px);filter:blur(4px);background-position:center;background-repeat:no-repeat;background-size:cover;}"];c.__hash="1456639211";var l=i(6158),d=i.n(l),x=['@import url("https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css");',"@-webkit-keyframes space-jsx-4003097100{0%,100%{background:linear-gradient(217deg,#ff0000,rgba(32,32,32,0.5647058824) 70.71%),linear-gradient(127deg,rgba(56,0,93,0.1882352941),rgba(0,0,255,0.3137254902) 70.71%),linear-gradient(336deg,rgba(56,0,93,0.1882352941),#462300 70.71%);}50%{background:linear-gradient(127deg,rgba(56,0,93,0.1882352941),rgba(0,0,255,0.3137254902) 70.71%),linear-gradient(336deg,rgba(56,0,93,0.1882352941),#462300 70.71%),linear-gradient(217deg,#ff0000,rgba(32,32,32,0.5647058824) 70.71%);}}","@keyframes space-jsx-4003097100{0%,100%{background:linear-gradient(217deg,#ff0000,rgba(32,32,32,0.5647058824) 70.71%),linear-gradient(127deg,rgba(56,0,93,0.1882352941),rgba(0,0,255,0.3137254902) 70.71%),linear-gradient(336deg,rgba(56,0,93,0.1882352941),#462300 70.71%);}50%{background:linear-gradient(127deg,rgba(56,0,93,0.1882352941),rgba(0,0,255,0.3137254902) 70.71%),linear-gradient(336deg,rgba(56,0,93,0.1882352941),#462300 70.71%),linear-gradient(217deg,#ff0000,rgba(32,32,32,0.5647058824) 70.71%);}}",".p-fix.jsx-4003097100,.map-container.jsx-4003097100,.map-container.jsx-4003097100 .current-location.jsx-4003097100{position:absolute;bottom:0;top:0;left:0;right:0;height:100%;width:100%;}",".d-flex.jsx-4003097100,.map-container.jsx-4003097100 .map.jsx-4003097100{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:100%;height:100vh;}",".map-container.jsx-4003097100 .current-location.jsx-4003097100{z-index:1;top:auto;}","@media (max-width:1100px){.map-container.jsx-4003097100 .map.jsx-4003097100{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;}}"];x.__hash="4003097100";var u=i(42700),f=i(59499);function h(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,n)}return i}function m(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?h(Object(i),!0).forEach(function(t){(0,f.Z)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):h(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var p=function(){var e=(0,o.useState)(null),t=e[0],i=e[1],n=(0,o.useRef)(null),a=(0,o.useCallback)(function(e){if(n.current&&t){var a=m(m({},t),e);i(a),console.log("Modifying element:",a)}},[t]),r=(0,o.useCallback)(function(e){e?document.querySelectorAll(".".concat(e)).forEach(function(e){e.remove()}):n.current&&(n.current.remove(),i(null))},[]);return{element:t,elementRef:n,modify:a,remove:r,add:(0,o.useCallback)(function(e){i(e)},[])}},g=function(e,t,i){t&&t.forEach(function(t){var n=document.createElement("div");n.className="marker",n.style.width="10px",n.style.height="10px",n.style.backgroundColor="blue6541",n.style.borderRadius="50%",n.style.boxShadow="0 1px 4px 5px #ddf",n.style.display="flex",n.style.alignItems="center",n.style.justifyContent="center",n.style.color="#000",n.onclick=function(){return i(t)},new(d()).Marker(n).setLngLat([t.location.lon,t.location.lat]).addTo(e)})},b=i(36946),j=[{listingId:"12345",title:"Cozy Cottage by the Lake",description:"Enjoy a relaxing stay at our cozy lakefront cottage. Perfect for weekend getaways and family vacations.",location:{lat:20,lon:20,address:"123 Lakeview Drive, Lakeside, FL 32034",city:"Lakeside",state:"Florida",country:"USA",coordinates:{latitude:37.7749,longitude:-122.4194}},host:{hostId:"98765",name:"John Doe",contact:{email:"john.doe@example.com",phone:"+1234567890"},superhost:!0},propertyDetails:{type:"Cottage",guests:4,bedrooms:2,beds:3,bathrooms:1.5},amenities:{essentials:["Wi-Fi","TV","Heating","Air Conditioning"],safetyFeatures:["Smoke Detector","Carbon Monoxide Detector","First Aid Kit"],kitchen:["Refrigerator","Microwave","Dishwasher","Coffee Maker"],parking:{available:!0,type:"On-site parking"},extras:["Pool","Hot Tub","Gym"]},availability:{minimumStay:2,maximumStay:30,checkIn:"3:00 PM",checkOut:"11:00 AM",bookingWindow:{start:"2024-01-01",end:"2024-12-31"}},pricing:{basePricePerNight:150,cleaningFee:50,extraGuests:{allowed:!0,fee:20,maxGuests:6},discounts:{weekly:10,monthly:20}},ratings:{overall:4.8,accuracy:4.9,cleanliness:4.7,checkIn:4.9,communication:4.9,location:4.8,value:4.8},reviews:[{reviewId:"abc123",author:"Jane Smith",date:"2024-04-22",rating:5,text:"Had a wonderful stay at the cottage! The view was fantastic and the host was very accommodating. Will definitely come back."},{reviewId:"def456",author:"Mike Johnson",date:"2024-03-18",rating:4.5,text:"Great place but the road to get there was a bit rough. Everything else was perfect!"}],images:[{url:"https://example.com/images/listing1.jpg",description:"Front view of the cottage"},{url:"https://example.com/images/listing2.jpg",description:"Living room"}],houseRules:{petsAllowed:!1,smokingAllowed:!1,partiesAllowed:!1,additionalRules:"Please respect the property and the neighbors. Quiet hours from 10 PM to 7 AM."}}],v=i(80954),y=i.n(v),w=!1,k=null,_=1,O=i(85893);d().accessToken="pk.eyJ1IjoibGFuZG9sYWJydW0iLCJhIjoiY2xnMDZ1aGVsMHJ5MzNsdGF3aHZhM3dtbyJ9.UihOXtkEeRk5tQDgDK8cLg";var N=function(e){var t=e.vessels,i=(0,b.dd)().openModal,n=(0,o.useRef)(null),r=(0,o.useState)();r[0],r[1];var c=(0,u.Z)().width,l=p().remove,f=function(e){console.log(e),i({variant:"fullscreen",children:(0,O.jsx)("ol",{children:Object.entries(e).map(function(e){var t=(0,s.Z)(e,2),i=t[0],n=t[1];return(0,O.jsxs)("li",{children:[(0,O.jsx)("strong",{children:JSON.stringify(i)}),":",JSON.stringify(n)]},i)})})})},h=function(e){e&&(g(e,t||j,f),function(e){var t,i,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},a=n.rpm,r=void 0===a?180:a,s=n.zoom,o=void 0===s?3:s,c=n.maxZoom,l=void 0===c?5:c;function d(){if(!w){var t=e.getZoom();if(t<l){var i=360/r*_;t>o&&(i*=(l-t)/(l-o));var n=e.getCenter();n.lng-=i,e.easeTo({center:n,duration:1e3,easing:function(e){return e}})}}}e.on("moveend",d),d(),t=function(){w=!0,k=Date.now()},i=y()(function(){w=!1,_=1+(Date.now()-(k||Date.now()))/5e3,d()},5e3),e.on("mousedown",t),e.on("mouseup",i),e.on("touchstart",t),e.on("touchend",i),e.on("mousemove",i),e.on("touchmove",i)}(e))},m=function(){return c>1260?2:.9};return(0,o.useEffect)(function(){if(n.current){var e={container:n.current,style:"mapbox://styles/landolabrum/clvu95nn901lc01q14qdf7w97",projection:{name:"globe"},center:[0,0],zoom:m(),antialias:!0},t=new(d()).Map(e);return h(t),t.on("style.load",function(){l("mapboxgl-ctrl-logo"),l("mapboxgl-canary"),l("mapboxgl-ctrl")}),function(){return t.remove()}}},[n,t,m]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:x.__hash,children:x}),(0,O.jsxs)("div",{className:"jsx-".concat(x.__hash)+" map-container",children:[(0,O.jsx)("div",{ref:n,className:"jsx-".concat(x.__hash)+" map"}),(0,O.jsx)("div",{className:"jsx-".concat(x.__hash)+" menu"})]})]})},z=function(){var e=(0,b.dd)(),t=e.openModal,i=e.closeModal,n=(0,o.useState)(),a=n[0],r=n[1],s=(0,o.useState)(!1),c=(s[0],s[1]),l=(0,o.useRef)(null),d=function(e){r({lat:Number(e.coords.latitude.toFixed(2)),lng:Number(e.coords.longitude.toFixed(2))})},x=function(){console.error("Unable to retrieve your location"),c(!0)},u=function(){var e=l.current;e&&"granted"===e.state?(i(),navigator.geolocation.getCurrentPosition(d,x)):c(!0)},f=function(){navigator.permissions?navigator.permissions.query({name:"geolocation"}).then(function(e){l.current=e,e.addEventListener("change",u),"granted"===e.state?navigator.geolocation.getCurrentPosition(d,x):"prompt"===e.state?t({title:"Know Your Location",children:"To use this feature, please enable location access.",confirm:{title:"Enable Location",statements:[{label:"Allow",onClick:function(){var e;null===(e=l.current)||void 0===e||e.addEventListener("change",u),navigator.geolocation.getCurrentPosition(d,x)}},{label:"Deny",onClick:function(){i(),c(!0)}}]}}):c(!0)}):(console.error("Permission API not supported"),c(!0))};return(0,o.useEffect)(function(){f()},[]),a},P=i(82512),S=function(){var e=(0,P.U2)(),t=(0,s.Z)(e,2),i=t[0],n=t[1],r=null==i?void 0:i.active,l=z();return(0,o.useEffect)(function(){},[r,n,l]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:c.__hash,children:c}),(0,O.jsx)("div",{className:"jsx-".concat(c.__hash)+" mbone",children:(0,O.jsxs)("div",{className:"jsx-".concat(c.__hash)+" background-video",children:[(0,O.jsx)("img",{src:"/assets/backgrounds/lava1.jpeg",className:"jsx-".concat(c.__hash)}),(0,O.jsx)(N,{})]})})]})},E=["h2.jsx-2203866603{color:var(--gray-20);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;white-space:nowrap;font-size:var(--s-1);}","h3.jsx-2203866603{background-color:var(--primary-o);border-radius:var(--border-radius);margin:var(--s-element) 0 var(--s-9);padding:var(--s-9) var(--s-padding);color:var(--primary-lite);-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}","h4.jsx-2203866603{line-height:1.2;--ui-icon-height:var(--s-6);color:var(--gray-40);--ui-icon-color:var(--gray-40);width:auto;}",".d-flex.jsx-2203866603,.nirvana-index__content.jsx-2203866603 .list.jsx-2203866603,.nirvana-index__content.jsx-2203866603,.nirvana-index.jsx-2203866603,h3.jsx-2203866603{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".survey.jsx-2203866603{width:100%;position:relative;}",".nirvana-index.jsx-2203866603{width:100%;gap:var(--s-1);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".nirvana-index__content.jsx-2203866603{gap:var(--s-1);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}",".nirvana-index__content.jsx-2203866603 .list.jsx-2203866603{-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-padding);}"];E.__hash="2203866603";var C=i(85854),D=[".d-flex.jsx-600488437,.home-grid-item__icon.jsx-600488437,.home-grid-item__header.jsx-600488437,.home-grid-item.jsx-600488437{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".home-grid-item.jsx-600488437{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;border-radius:var(--border-radius);gap:var(--s-padding);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;background-color:var(--gray-90);overflow:hidden;padding:var(--s-element) var(--s-padding);}",".home-grid-item__header.jsx-600488437{width:100%;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-padding);}",".home-grid-item__title.jsx-600488437{height:100%;color:var(--primary);font-size:var(--s-3);text-transform:capitalize;}",".home-grid-item__body.jsx-600488437{color:var(--gray-50);}",".home-grid-item__icon.jsx-600488437{height:90px;--ui-icon-width:90px;--ui-icon-height:90px;--ui-icon-color:var(--primary-o);}",".home-grid-item__center.jsx-600488437{text-align:center;font-size:var(--s-5);line-height:1.5;}"];D.__hash="600488437";var M=i(55140),T=function(e){var t=e.icon,i=e.title,n=e.children;return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:D.__hash,children:D}),(0,O.jsxs)("div",{className:"jsx-".concat(D.__hash)+" home-grid-item",children:[(0,O.jsxs)("div",{className:"jsx-".concat(D.__hash)+" home-grid-item__header",children:[t&&(0,O.jsx)("div",{className:"jsx-".concat(D.__hash)+" home-grid-item__icon",children:(0,O.jsx)(M.a,{icon:t})}),(0,O.jsx)("div",{className:"jsx-".concat(D.__hash)+" home-grid-item__title",children:i})]}),(0,O.jsx)("div",{className:"jsx-".concat(D.__hash)+" home-grid-item__body home-grid-item__center",children:n})]})]})},F=i(22470),I=i(89360),A=function(){var e=".nirv{\n      display: flex;\n      color: var(--blue-10);\n      --ui-icon-color: var(--blue-10);\n      gap: var(--s-9);\n      font-size: var(--s-5);\n  }";return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:e.__hash,children:e}),(0,O.jsxs)("div",{className:"jsx-".concat(e.__hash)+" nirv",children:[(0,O.jsx)(M.a,{icon:"nirvana-energy-logo"}),"Nirvana Energy"]})]})},Z=function(){var e=[{manufacturer:"Tesla",capacity:13,output:5.5},{manufacturer:"LG",capacity:15,output:6.4},{manufacturer:"Enphase",capacity:12,output:5},{manufacturer:"Generack",capacity:15.5,output:4.5},{manufacturer:"GrowWatt",capacity:10,output:6},{manufacturer:(0,O.jsx)(A,{}),capacity:15,output:12}],t=(0,b.dd)();return t.openModal,t.isModalOpen,(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:E.__hash,children:E}),(0,O.jsxs)("div",{id:"nirvana-index",className:"jsx-".concat(E.__hash)+" nirvana-index",children:[(0,O.jsx)(F.default,{id:"configure",startButton:"configure your back up system"}),(0,O.jsxs)("div",{className:"jsx-".concat(E.__hash)+" nirvana-index__content",children:[(0,O.jsxs)("div",{className:"jsx-".concat(E.__hash)+" list",children:[(0,O.jsx)("h3",{className:"jsx-".concat(E.__hash),children:"6 Key Questions to Enhance Your Solar System with Batteries"}),(0,O.jsxs)("h4",{className:"jsx-".concat(E.__hash),children:[(0,O.jsx)(M.a,{icon:"fa-cube"}),"Can I add batteries to my exisiting solar system?"]}),(0,O.jsxs)("h4",{className:"jsx-".concat(E.__hash),children:[(0,O.jsx)(M.a,{icon:"fa-cube"}),"What determines that the battery will back up what I need?"]}),(0,O.jsxs)("h4",{className:"jsx-".concat(E.__hash),children:[(0,O.jsx)(M.a,{icon:"fa-cube"}),"Will this battery keep me backed up if the grid stays down?"]}),(0,O.jsxs)("h4",{className:"jsx-".concat(E.__hash),children:[(0,O.jsx)(M.a,{icon:"fa-cube"}),"What does this battery setup have that others dont?"]}),(0,O.jsxs)("h4",{className:"jsx-".concat(E.__hash),children:[(0,O.jsx)(M.a,{icon:"fa-cube"}),"Is there a limit to how much the batteries can power in my home at the same time?"]}),(0,O.jsxs)("h4",{className:"jsx-".concat(E.__hash),children:[(0,O.jsx)(M.a,{icon:"fa-cube"}),"Can I change what I want backed up in the future"]})]}),(0,O.jsx)("h2",{className:"jsx-".concat(E.__hash),children:"Time to Create your Nirvana!"}),(0,O.jsx)("h4",{className:"jsx-".concat(E.__hash),children:"On and Off-grid battery back up If you're thinking about going off grid or want to learn more about backup battery systems, it's time to create your"}),(0,O.jsx)("h2",{className:"jsx-".concat(E.__hash),children:"The Importance of Backup Batteries"}),(0,O.jsxs)(C.Z,{sm:1,md:3,margin:"0 0 45px",gap:15,children:[(0,O.jsx)(T,{icon:"fal-cloud-bolt-sun",title:"power outages",children:"With backup batteries, you can be sure your home will have power even during outages. Most batteries will only back up what is stored when the grid goes down. Be sure to get our system that refills the battery if the grid stays down."}),(0,O.jsx)(T,{icon:"fa-globe",title:"environmental concerns",children:"Using solar battery backup systems helps reduce your carbon footprint. The less you rely on the grid, the more you do for our planet."}),(0,O.jsx)(T,{icon:"fal-circle-dollar",title:"cost savings",children:"Solar battery backup systems can help you save money on electricity bills in the long run. The 30% Federal Tax credit applies to battery storage that is connected to a PV"})]}),(0,O.jsx)("h3",{className:"jsx-".concat(E.__hash),children:"On-grid vs Off-grid Solar Battery Backup Systems"}),(0,O.jsxs)(C.Z,{sm:1,md:2,margin:"0 0",gapX:10,children:[(0,O.jsx)(T,{title:"on-grid",children:"On-grid systems are connected to the utility grid and can sell excess energy back to the power company or store excess energy depending on how the system is"}),(0,O.jsx)(T,{title:"environmental concerns",children:"Off-grid systems are not connected to the utility grid. These systems can be tailored to fit your needs no matter how big or small and using several different power sources."})]}),(0,O.jsx)("h3",{className:"jsx-".concat(E.__hash),children:"Don't be fooled by ( Name Brand ) Batteries"}),(0,O.jsx)(I.Z,{options:{hide:["header","footer"]},data:e})]})]})]})},L=i(37164),X=i(11907),G=i(51633),W=[".aire-hotel.jsx-4286881685{width:100%;height:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}",".aire-hotel.jsx-4286881685 .background-video.jsx-4286881685{position:fixed;top:0;left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);min-width:calc(100vw + var(--s-1));width:auto;height:100%;min-height:calc(100vh + var(--s-1));height:100%;}",".aire-hotel.jsx-4286881685 .background-video.jsx-4286881685 img.jsx-4286881685{left:50%;-webkit-transform:translateX(-50%);-ms-transform:translateX(-50%);transform:translateX(-50%);height:auto;width:100%;min-height:100vw;z-index:-111;position:absolute;-webkit-filter:blur(4px);filter:blur(4px);background-position:center;background-repeat:no-repeat;background-size:cover;}"];W.__hash="4286881685";var J=[".d-flex.jsx-2259654605{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".over-layout.jsx-2259654605{position:fixed;width:100vw;height:100vh;overflow:hidden;inset:0 0 0 0;z-index:1111;}"];function R(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,n)}return i}function B(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?R(Object(i),!0).forEach(function(t){(0,f.Z)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):R(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}J.__hash="2259654605";var U=function(e){var t=e.children,i=(0,o.useRef)(null),n=(0,o.useState)({}),r=n[0],s=n[1];return(0,o.useEffect)(function(){i.current&&s(Array.from(i.current.children).reduce(function(e,t){return e[t.id||t.textContent]={position:"absolute",top:t.getAttribute("data-top")||"auto",right:t.getAttribute("data-right")||"auto",bottom:t.getAttribute("data-bottom")||"auto",left:t.getAttribute("data-left")||"auto"},e},{}))},[t]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:J.__hash,children:J}),(0,O.jsx)("div",{ref:i,className:"jsx-".concat(J.__hash)+" over-layout",children:o.Children.map(t,function(e){var t;return o.cloneElement(e,{style:B(B({},r[(null==e||null===(t=e.props)||void 0===t||null===(t=t.children)||void 0===t?void 0:t.toString())||"default"]),e.props.style)})})})]})},H=function(){return(0,o.useEffect)(function(){},[]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:W.__hash,children:W}),(0,O.jsxs)("div",{className:"jsx-".concat(W.__hash)+" aire-hotel",children:[(0,O.jsx)(U,{children:(0,O.jsx)("h1",{"data-top":"1","data-right":"1",className:"jsx-".concat(W.__hash),children:"h1"})}),(0,O.jsx)("div",{className:"jsx-".concat(W.__hash)+" background-video",children:(0,O.jsx)(N,{})})]})]})},q=function(){(0,X.a)();var e=(0,o.useState)(),t=e[0],i=e[1],n={nirv1:(0,O.jsx)(Z,{}),mb1:(0,O.jsx)(S,{}),ah1:(0,O.jsx)(H,{})};return(0,o.useEffect)(function(){var e=L.Z.merchant.mid;t||i(e)},[t]),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(a(),{id:r.__hash,children:r}),(0,O.jsx)("div",{className:"jsx-".concat(r.__hash)+" index",children:(0,O.jsx)(G.Z,{currentView:t,views:n})})]})}}}]);