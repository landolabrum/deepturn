"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[838],{4838:function(e,t,i){i.d(t,{Z:function(){return k}});var r=i(9389),n=i.n(r),a=i(7294),s=[];s.__hash="2085888330";var o=[".surveillance.jsx-3472433715{min-height:500px;width:100%;}"];o.__hash="3472433715";var c=i(9499),l=["img.jsx-2370375329{width:100%;height:auto;z-index:1;position:relative;}","img.jsx-2370375329 .d-flex.jsx-2370375329,img.jsx-2370375329 img.jsx-2370375329{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}"];l.__hash="2370375329";var d=[".d-flex.jsx-3701184225,.image-control.jsx-3701184225 .image-control__controls.jsx-3701184225{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".image-control.jsx-3701184225{width:100%;position:relative;height:-webkit-max-content;height:-moz-max-content;height:max-content;overflow:hidden;}",".image-control__loading.jsx-3701184225{min-height:400px;}","@media (max-width:900px){.image-control.jsx-3701184225{max-width:calc(100vw - var(--default-padding) * 2);}}",".image-control.jsx-3701184225:hover .image-control__controls.jsx-3701184225{bottom:0;opacity:1;}",".image-control.jsx-3701184225 .image-control__element.jsx-3701184225{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:auto;z-index:-1;}",".image-control.jsx-3701184225 .image-control__controls.jsx-3701184225{background-color:var(--color-gray-100);z-index:2;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;position:absolute;bottom:-100%;padding:0 var(--s-9);width:calc(100% - var(--s-9) * 2);left:0;height:var(--default-element-height);opacity:0;-webkit-transition:bottom 0.5s ease,opacity 0.5s ease;transition:bottom 0.5s ease,opacity 0.5s ease;}",".image-control.jsx-3701184225 .image-control__controls__control.jsx-3701184225{cursor:pointer;}",".image-control.jsx-3701184225 .image-control__controls__control.jsx-3701184225:hover{--ui-icon-color:var(--color-primary);}"];d.__hash="3701184225";var x=i(8455),f=i(4049),h=i(991),g=i(8798),u=i(5893),m=function e(t){var i=t.children,r=t.variant,s=t.mediaType,o=void 0===s?"image":s,c=t.refreshInterval,l=void 0===c?1e3:c,m=t.error,v=t.fixedLoad,b=(0,a.useRef)(null),j=(0,a.useState)(!0),_=j[0],p=j[1],w=(0,f.Z)("image-control__element",o,r),y=(0,g.dd)(),k=y.openModal,E=y.closeModal,O=y.isModalOpen;return(0,a.useEffect)(function(){var e=setInterval(function(){var e,t=null==b?void 0:null===(e=b.current)||void 0===e?void 0:e.offsetHeight;b.current&&t&&t>30?p(!1):m&&!_&&p(!0)},l);return function(){return clearInterval(e)}},[l,_,b.current]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n(),{id:d.__hash,children:d}),(0,u.jsxs)("div",{className:"jsx-".concat(d.__hash)+" "+"image-control".concat(_?" image-control__loading":""),children:[" ",!0==_&&(0,u.jsx)(x.Z,{height:400,position:void 0!==v&&v?void 0:"relative",text:m||void 0,dots:"string"!=typeof m&&void 0}),(0,u.jsx)("div",{id:"image-control__element",ref:b,className:"jsx-".concat(d.__hash)+" "+"".concat(w),children:a.Children.map(i,function(e){return(0,a.isValidElement)(e)?(0,a.cloneElement)(e):e})}),(0,u.jsxs)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls",children:[(0,u.jsx)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls__control",children:(0,u.jsx)(h.a,{icon:"fa-play-pause"})}),(0,u.jsx)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls__control",children:(0,u.jsx)(h.a,{icon:"fa-expand",onClick:function(){console.log("[ EXPAND ]"),O?E():k({children:(0,u.jsx)(e,{fixedLoad:!0,variant:r,mediaType:o,refreshInterval:l,error:m,children:i}),variant:"fullscreen"})}})})]})]})]})};function v(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,r)}return i}function b(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?v(Object(i),!0).forEach(function(t){(0,c.Z)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):v(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var j=function(e){var t=e.src,i=e.variant,r=e.type,s=e.alt,o=(0,a.useState)({variant:i,type:r}),c=o[0],d=o[1],x=function(e){e.preventDefault(),c.error||d(b(b({},c),{},{error:"failed to load media"}))};return(0,a.useEffect)(function(){},[x]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n(),{id:l.__hash,children:l}),(0,u.jsx)(m,b(b({},c),{},{children:!c.error&&(0,u.jsx)("img",{src:t,alt:s,onError:x,className:"jsx-".concat(l.__hash)})}))]})},_=i(2972),p=i(2462),w=function(){return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n(),{id:o.__hash,children:o}),(0,u.jsx)("div",{className:"jsx-".concat(o.__hash)+" surveillance",children:(0,u.jsxs)(p.Z,{xs:1,md:2,padding:"0 0 200px",children:[(0,u.jsx)(j,{src:"".concat(_.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=2")}),(0,u.jsx)(j,{src:"".concat(_.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=3")})]})})]})},y=i(6592),k=function(){var e={surveillance:(0,u.jsx)(w,{}),hi:(0,u.jsx)("h1",{children:"Hi"})};return(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n(),{id:s.__hash,children:s}),(0,u.jsx)(y.Z,{variant:"flat",views:e})]})}},2533:function(e,t,i){i.d(t,{Z:function(){return l}});var r=i(9389),n=i.n(r),a=i(7294),s=[".d-flex.jsx-1302401060,.d-flex-col.jsx-1302401060,.d-flex-col_j-fs_a-fs.jsx-1302401060,.ui-div.jsx-1302401060,.div.jsx-1302401060,.d-flex_j-fs_a-fs.jsx-1302401060{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".d-flex_j-fs_a-fs.jsx-1302401060,.d-flex-col_j-fs_a-fs.jsx-1302401060,.ui-div.jsx-1302401060,.div.jsx-1302401060{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}",".d-flex-col.jsx-1302401060,.d-flex-col_j-fs_a-fs.jsx-1302401060,.ui-div.jsx-1302401060,.div.jsx-1302401060{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".ui-div.jsx-1302401060,.div.jsx-1302401060{height:-webkit-max-content;height:-moz-max-content;height:max-content;gap:var(--default-padding);font-size:var(--s-5);width:100%;}",".ui-div__card.jsx-1302401060,.div__card.jsx-1302401060{color:var(--color-gray-50);outline:solid 1px var(--color-gray-80);border:solid 1px var(--color-gray-60);border-radius:var(--default-border-radius);min-height:var(--default-element-height);border-radius:var(--default-border-radius);}",".ui-div__mc.jsx-1302401060,.div__mc.jsx-1302401060{color:var(--color-gray-40);background-color:var(--color-gray-80);border-radius:var(--default-border-radius);border-style:outset;border-color:var(--color-gray-40-opaque) var(--color-gray-40-opaque) var(--color-gray-60-opaque) var(--color-gray-20-opaque);border-width:2px;padding:var(--default-padding);width:calc(100% - 4px - var(--default-padding) * 2);}",".ui-div__lite.jsx-1302401060,.div__lite.jsx-1302401060{color:var(--color-gray-70);background-color:var(--color-gray-50);}",".ui-div__dark.jsx-1302401060,.div__dark.jsx-1302401060{background-color:var(--color-gray-90);}",".ui-div__shadow.jsx-1302401060,.div__shadow.jsx-1302401060{box-shadow:var(--default-box-shadow);}"];s.__hash="1302401060";var o=i(7149),c=i(5893),l=function(e){var t,i,r=e.children,l=e.variant,d=e.style,x=e.jsx,f=void 0===x?"":x,h=e.id,g=e.minWidth,u=e.maxWidth,m=(0,a.useRef)(null),v=null===(i=(0,o.Z)())||void 0===i?void 0:i.width,b=(0,a.useState)(!0),j=b[0],_=b[1],p=(t="div ui-div",l?"".concat(t," ").concat(l.split(" ").map(function(e){return"".concat(t,"__").concat(e)}).join(" ")):t),w=g&&g<v,y=u&&u>v;return((0,a.useEffect)(function(){j&&w?_(!1):j&&y?_(!1):j||_(!0)},[w,y]),(0,a.useEffect)(function(){var e;if(null!=m&&m.current&&h&&(null===(e=m.current.previousSibling)||void 0===e?void 0:e.tagName)!="STYLE"){var t=document.createElement("style");t.setAttribute("jsx",""),t.innerText="#".concat(h)+f,m.current.parentNode.insertBefore(t,m.current)}},[m.current]),j&&h&&f||j&&!f&&!h)?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(n(),{id:s.__hash,children:s}),!!(!h&&f)&&"jsx needs [props.id]",(0,c.jsx)("div",{ref:m,style:d,id:h,className:"jsx-".concat(s.__hash)+" "+(p||""),children:r})]}):(0,c.jsx)(c.Fragment,{})}},6592:function(e,t,i){i.d(t,{Z:function(){return m}});var r=i(9389),n=i.n(r),a=i(7294),s=[".d-flex.jsx-1318781579,.settings.jsx-1318781579 .settings__view.jsx-1318781579,.settings__content.jsx-1318781579{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".settings.jsx-1318781579{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;height:auto;}","@media (min-width:1260px){.settings.jsx-1318781579{background-color:var(--color-gray-100);}}","@media (max-width:900px){.settings.jsx-1318781579{width:100vw;height:100vh;}}",".settings__content.jsx-1318781579{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;height:100vh;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;}","@media (min-width:1262px){.settings__content.jsx-1318781579{inline-size:1260px;margin:0 auto;background-color:var(--color-gray-90);border:solid 1px var(--color-gray-70);}}","@media (max-width:900px){.settings__content.jsx-1318781579{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;min-height:unset;}}",".settings.jsx-1318781579 .settings__actions.jsx-1318781579{background-color:var(--color-dark);border-right:solid 1px var(--color-gray-70);position:relative;width:calc(35vw - var(--default-padding) * 2);min-width:300px;}","@media (max-width:900px){.settings.jsx-1318781579 .settings__actions.jsx-1318781579{border-right:unset;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:var(--default-padding) var(--default-padding) 0;width:calc(100% - var(--default-padding) * 2);}}","@-webkit-keyframes borderAnimation-jsx-1318781579{0%{border-color:rgba(255,48,48,0.2509803922);}25%{border-color:rgba(255,153,0,0.3137254902);}50%{border-color:rgba(0,153,255,0.5647058824);}75%{border-color:#0f00ff;}100%{border-color:rgba(255,48,48,0.2509803922);}}","@keyframes borderAnimation-jsx-1318781579{0%{border-color:rgba(255,48,48,0.2509803922);}25%{border-color:rgba(255,153,0,0.3137254902);}50%{border-color:rgba(0,153,255,0.5647058824);}75%{border-color:#0f00ff;}100%{border-color:rgba(255,48,48,0.2509803922);}}",".settings.jsx-1318781579 .settings__view.jsx-1318781579{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;border-style:solid;border-color:rgba(255,48,48,0.2509803922) rgba(255,153,0,0.3137254902) rgba(0,153,255,0.3137254902) #0f00ff;border-radius:var(--default-border-radius);border-width:1px;box-shadow:10px 10px 30px var(--color-gray-100);background-color:var(--color-gray-90);margin:var(--s-9);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;height:-webkit-max-content;height:-moz-max-content;height:max-content;color:var(--color-gray-40);-webkit-animation:borderAnimation-jsx-1318781579 5s infinite alternate;animation:borderAnimation-jsx-1318781579 5s infinite alternate;width:calc(65vw - var(--s-9) * 2 - var(--default-padding) * 2);padding:var(--default-padding);}",".settings.jsx-1318781579 .settings__view__flat.jsx-1318781579{width:calc(65vw - var(--s-9) * 2);padding:0;background-color:transparent;border:none;box-shadow:unset;}","@media (max-width:1100px){.settings.jsx-1318781579 .settings__view.jsx-1318781579{min-height:100%;border-left:unset;overflow:hidden;padding:var(--s-9) var(--s-9) var(--s-1);}}",".settings.jsx-1318781579 .settings__view.jsx-1318781579 .settings__view__title.jsx-1318781579{font-size:var(--s-1);line-height:1.5;text-transform:capitalize;color:var(--color-gray-40);}"];s.__hash="1318781579";var o=i(2533),c=i(8057),l=i(4253),d=i(9888),x=i(8455),f=i(1163),h=i(4049),g=i(7149),u=i(5893),m=function(e){var t,i=e.views,r=e.setViewCallback,m=e.variant,v=(e.name,e.defaultView),b=(0,f.useRouter)(),j=(null==b?void 0:null===(t=b.query)||void 0===t?void 0:t.vid)&&b.query.vid,_=(0,a.useState)(v),p=_[0],w=_[1],y=(0,g.Z)(),k=y.width,E=y.height,O=function(e){w(e),j&&b.push({pathname:null==b?void 0:b.pathname,query:{vid:e}},void 0,{shallow:!0}),r&&r(e)},N=(0,h.Z)("settings",void 0,m),Z=(0,h.Z)("settings__content",void 0,m),S=(0,h.Z)("settings__view",void 0,m),z=function(){setTimeout(function(){var e=document.getElementById("header-container"),t=document.getElementById("settings-container"),i=document.getElementsByTagName("main")[0];if(e&&i){var r=e.offsetHeight;i.style.marginTop,t&&""==t.style.top&&(t.style.minHeight="calc(100vh - calc(".concat(r,"px + 20px))"))}},100)};return((0,a.useEffect)(function(){z()},[k,E]),(0,a.useEffect)(function(){if(i){var e=j||Object.keys(i)[0];e&&w(String(e))}},[]),p)?(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(n(),{id:s.__hash,children:s}),(0,u.jsx)("div",{id:"settings-container",className:"jsx-".concat(s.__hash)+" "+(N||""),children:(0,u.jsxs)("div",{className:"jsx-".concat(s.__hash)+" "+(Z||""),children:[(0,u.jsxs)("div",{className:"jsx-".concat(s.__hash)+" settings__actions",children:[(0,u.jsx)(o.Z,{maxWidth:900,children:(0,u.jsx)(c.Z,{options:Object.keys(i),variant:"flat",value:p,onSelect:O})}),(0,u.jsx)(o.Z,{minWidth:900,children:(0,u.jsx)(l.Z,{onSelect:O,variant:"dark",title:(0,d.R)(p||""),options:Object.keys(i)})})]}),(0,u.jsxs)("div",{className:"jsx-".concat(s.__hash)+" "+(S||""),children:[(0,u.jsx)("div",{className:"jsx-".concat(s.__hash)+" settings__view__title",children:p}),(0,u.jsx)("div",{className:"jsx-".concat(s.__hash)+" settings__view__content",children:p&&i[p]})]})]})})]}):(0,u.jsx)(x.Z,{})}}}]);