"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[838],{4838:function(e,t,i){i.d(t,{Z:function(){return k}});var n=i(9389),s=i.n(n),r=i(7294),a=[];a.__hash="2085888330";var o=[".surveillance.jsx-3472433715{min-height:500px;width:100%;}"];o.__hash="3472433715";var c=i(9499),l=["img.jsx-3422516844{width:100%;height:auto;z-index:1;position:relative;}","img.jsx-3422516844 .d-flex.jsx-3422516844,img.jsx-3422516844 img.jsx-3422516844{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}"];l.__hash="3422516844";var d=[".d-flex.jsx-1415168387,.image-control.jsx-1415168387 .image-control__controls.jsx-1415168387{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".image-control.jsx-1415168387{width:100%;position:relative;height:-webkit-max-content;height:-moz-max-content;height:max-content;overflow:hidden;}","@media (max-width:900px){.image-control.jsx-1415168387{max-width:calc(100vw - var(--default-padding) * 2);}}",".image-control.jsx-1415168387:hover .image-control__controls.jsx-1415168387{bottom:0;opacity:1;}",".image-control.jsx-1415168387 .image-control__element.jsx-1415168387{background-color:#000;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:auto;z-index:-1;}",".image-control.jsx-1415168387 .image-control__controls.jsx-1415168387{background-color:var(--color-gray-100);z-index:2;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;position:absolute;bottom:-100%;padding:0 var(--s-9);width:calc(100% - var(--s-9) * 2);left:0;height:var(--default-element-height);opacity:0;-webkit-transition:bottom 0.5s ease,opacity 0.5s ease;transition:bottom 0.5s ease,opacity 0.5s ease;}",".image-control.jsx-1415168387 .image-control__controls__control.jsx-1415168387{cursor:pointer;}",".image-control.jsx-1415168387 .image-control__controls__control.jsx-1415168387:hover{--ui-icon-color:var(--color-primary);}"];d.__hash="1415168387";var x=i(3724),h=i(4049),m=i(991),f=i(8798),g=i(5893),u=function e(t){var i=t.children,n=t.variant,a=t.mediaType,o=void 0===a?"image":a,c=t.refreshInterval,l=void 0===c?1e3:c,u=t.error,j=t.fixedLoad,_=(0,r.useRef)(null),v=(0,r.useState)(!0),b=v[0],p=v[1],w=(0,h.Z)("image-control__element",o,n),y=(0,f.dd)(),k=y.openModal,Z=y.closeModal,N=y.isModalOpen;return(0,r.useEffect)(function(){var e=setInterval(function(){var e,t=null==_?void 0:null===(e=_.current)||void 0===e?void 0:e.offsetHeight;_.current&&t&&t>30?p(!1):u&&!b&&p(!0)},l);return function(){return clearInterval(e)}},[l,b,_.current]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(s(),{id:d.__hash,children:d}),(0,g.jsxs)("div",{className:"jsx-".concat(d.__hash)+" "+"image-control".concat(b?" image-control__loading":""),children:[" ",!0==b&&(0,g.jsx)(x.Z,{height:300,position:void 0!==j&&j?void 0:"relative",text:u||void 0,dots:"string"!=typeof u&&void 0}),(0,g.jsx)("div",{id:"image-control__element",ref:_,className:"jsx-".concat(d.__hash)+" "+"".concat(w),children:r.Children.map(i,function(e){return(0,r.isValidElement)(e)?(0,r.cloneElement)(e):e})}),(0,g.jsxs)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls",children:[(0,g.jsx)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls__control",children:(0,g.jsx)(m.a,{icon:"fa-play-pause"})}),(0,g.jsx)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls__control",children:(0,g.jsx)(m.a,{icon:"fa-expand",onClick:function(){console.log("[ EXPAND ]"),N?Z():k({children:(0,g.jsx)(e,{fixedLoad:!0,variant:n,mediaType:o,refreshInterval:l,error:u,children:i}),variant:"fullscreen"})}})})]})]})]})};function j(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,n)}return i}function _(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?j(Object(i),!0).forEach(function(t){(0,c.Z)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):j(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var v=function(e){var t=e.src,i=e.variant,n=e.type,a=e.alt,o=(0,r.useState)({variant:i,type:n}),c=o[0],d=o[1],x=function(e){e.preventDefault(),c.error||d(_(_({},c),{},{error:"failed to load media"}))};return(0,r.useEffect)(function(){},[x]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(s(),{id:l.__hash,children:l}),(0,g.jsx)(u,_(_({},c),{},{children:!c.error&&(0,g.jsx)("img",{src:t,alt:a,onError:x,className:"jsx-".concat(l.__hash)})}))]})},b=i(2972),p=i(2462),w=function(){return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(s(),{id:o.__hash,children:o}),(0,g.jsx)("div",{className:"jsx-".concat(o.__hash)+" surveillance",children:(0,g.jsxs)(p.Z,{xs:1,md:2,padding:"0 0 200px",children:[(0,g.jsx)(v,{src:"".concat(b.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=1")}),(0,g.jsx)(v,{src:"".concat(b.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=2")}),(0,g.jsx)(v,{src:"".concat(b.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=3")})]})})]})},y=i(6592),k=function(){var e={surveillance:(0,g.jsx)(w,{}),hi:(0,g.jsx)("h1",{children:"Hi"})};return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(s(),{id:a.__hash,children:a}),(0,g.jsx)(y.Z,{variant:"flat",views:e})]})}},2533:function(e,t,i){i.d(t,{Z:function(){return l}});var n=i(9389),s=i.n(n),r=i(7294),a=[".d-flex.jsx-1302401060,.d-flex-col.jsx-1302401060,.d-flex-col_j-fs_a-fs.jsx-1302401060,.ui-div.jsx-1302401060,.div.jsx-1302401060,.d-flex_j-fs_a-fs.jsx-1302401060{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".d-flex_j-fs_a-fs.jsx-1302401060,.d-flex-col_j-fs_a-fs.jsx-1302401060,.ui-div.jsx-1302401060,.div.jsx-1302401060{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}",".d-flex-col.jsx-1302401060,.d-flex-col_j-fs_a-fs.jsx-1302401060,.ui-div.jsx-1302401060,.div.jsx-1302401060{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".ui-div.jsx-1302401060,.div.jsx-1302401060{height:-webkit-max-content;height:-moz-max-content;height:max-content;gap:var(--default-padding);font-size:var(--s-5);width:100%;}",".ui-div__card.jsx-1302401060,.div__card.jsx-1302401060{color:var(--color-gray-50);outline:solid 1px var(--color-gray-80);border:solid 1px var(--color-gray-60);border-radius:var(--default-border-radius);min-height:var(--default-element-height);border-radius:var(--default-border-radius);}",".ui-div__mc.jsx-1302401060,.div__mc.jsx-1302401060{color:var(--color-gray-40);background-color:var(--color-gray-80);border-radius:var(--default-border-radius);border-style:outset;border-color:var(--color-gray-40-opaque) var(--color-gray-40-opaque) var(--color-gray-60-opaque) var(--color-gray-20-opaque);border-width:2px;padding:var(--default-padding);width:calc(100% - 4px - var(--default-padding) * 2);}",".ui-div__lite.jsx-1302401060,.div__lite.jsx-1302401060{color:var(--color-gray-70);background-color:var(--color-gray-50);}",".ui-div__dark.jsx-1302401060,.div__dark.jsx-1302401060{background-color:var(--color-gray-90);}",".ui-div__shadow.jsx-1302401060,.div__shadow.jsx-1302401060{box-shadow:var(--default-box-shadow);}"];a.__hash="1302401060";var o=i(7149),c=i(5893),l=function(e){var t,i,n=e.children,l=e.variant,d=e.style,x=e.jsx,h=void 0===x?"":x,m=e.id,f=e.minWidth,g=e.maxWidth,u=(0,r.useRef)(null),j=null===(i=(0,o.Z)())||void 0===i?void 0:i.width,_=(0,r.useState)(!0),v=_[0],b=_[1],p=(t="div ui-div",l?"".concat(t," ").concat(l.split(" ").map(function(e){return"".concat(t,"__").concat(e)}).join(" ")):t),w=f&&f<j,y=g&&g>j;return((0,r.useEffect)(function(){v&&w?b(!1):v&&y?b(!1):v||b(!0)},[w,y]),(0,r.useEffect)(function(){var e;if(null!=u&&u.current&&m&&(null===(e=u.current.previousSibling)||void 0===e?void 0:e.tagName)!="STYLE"){var t=document.createElement("style");t.setAttribute("jsx",""),t.innerText="#".concat(m)+h,u.current.parentNode.insertBefore(t,u.current)}},[u.current]),v&&m&&h||v&&!h&&!m)?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(s(),{id:a.__hash,children:a}),!!(!m&&h)&&"jsx needs [props.id]",(0,c.jsx)("div",{ref:u,style:d,id:m,className:"jsx-".concat(a.__hash)+" "+(p||""),children:n})]}):(0,c.jsx)(c.Fragment,{})}},6592:function(e,t,i){i.d(t,{Z:function(){return j}});var n=i(9389),s=i.n(n),r=i(7294),a=[".d-flex.jsx-1981062955,.settings.jsx-1981062955 .settings__view__content.jsx-1981062955,.settings.jsx-1981062955 .settings__actions--content.jsx-1981062955,.settings__content.jsx-1981062955{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}","@-webkit-keyframes borderAnimation-jsx-1981062955{0%{border-color:rgba(255,48,48,0.2509803922);}25%{border-color:rgba(255,153,0,0.3137254902);}50%{border-color:rgba(0,153,255,0.5647058824);}75%{border-color:#0f00ff;}100%{border-color:rgba(255,48,48,0.2509803922);}}","@keyframes borderAnimation-jsx-1981062955{0%{border-color:rgba(255,48,48,0.2509803922);}25%{border-color:rgba(255,153,0,0.3137254902);}50%{border-color:rgba(0,153,255,0.5647058824);}75%{border-color:#0f00ff;}100%{border-color:rgba(255,48,48,0.2509803922);}}",".settings.jsx-1981062955{width:100%;-webkit-transform:translateY(-2px);-ms-transform:translateY(-2px);transform:translateY(-2px);min-height:inherit;}","@media (min-width:1100px){.settings.jsx-1981062955{padding-top:var(--default-padding);background-color:var(--color-gray-90);}}",".settings__content.jsx-1981062955{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;min-height:inherit;}","@media (min-width:1100px){.settings__content.jsx-1981062955{gap:var(--s-9);margin-left:var(--s-9);}}","@media (max-width:1100px){.settings__content.jsx-1981062955{height:100%;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}}",".settings.jsx-1981062955 .settings__actions.jsx-1981062955{height:inherit;position:relative;background-color:var(--color-gray-90);}",".settings.jsx-1981062955 .settings__actions--content.jsx-1981062955{border-bottom:solid 1px var(--color-gray-70);border-radius:var(--default-border-radius);border:solid 1px var(--color-gray-60);width:100%;}","@media (min-width:2100px){.settings.jsx-1981062955 .settings__actions--content.jsx-1981062955{margin-left:auto;max-width:350px;}}","@media (min-width:1100px){.settings.jsx-1981062955 .settings__actions.jsx-1981062955{min-height:auto;}}","@media (max-width:1100px){.settings.jsx-1981062955 .settings__actions.jsx-1981062955{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:1px var(--default-padding) var(--default-padding);width:auto;height:-webkit-max-content;height:-moz-max-content;height:max-content;border-bottom:solid 1px var(--color-gray-70);overflow:visible;}}",".settings.jsx-1981062955 .settings__view.jsx-1981062955{width:100%;color:var(--color-gray-40);background-color:var(--color-gray-100);}","@media (min-width:1100px){.settings.jsx-1981062955 .settings__view.jsx-1981062955{min-height:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;position:unset;border-top:solid 1px;border-left:solid 1px;border-radius:var(--default-border-radius) 0 0 0;-webkit-animation:borderAnimation-jsx-1981062955 5s infinite alternate;animation:borderAnimation-jsx-1981062955 5s infinite alternate;}}","@media (max-width:1100px){.settings.jsx-1981062955 .settings__view.jsx-1981062955{border-left:unset;min-height:inherit;}}",".settings.jsx-1981062955 .settings__view__content.jsx-1981062955{z-index:1000;min-height:-webkit-max-content;min-height:-moz-max-content;min-height:max-content;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:auto;padding:var(--s-4) var(--s-5);}","@media (max-width:1100px){.settings.jsx-1981062955 .settings__view__content.jsx-1981062955{padding:var(--s-5) var(--s-8);}}","@media (max-width:900px){.settings.jsx-1981062955 .settings__view__content.jsx-1981062955{padding:var(--s-5) var(--s-6);}}"];a.__hash="1981062955";var o=i(2533),c=i(8057),l=i(4253),d=i(9888),x=i(3724),h=i(1163),m=i(4049),f=i(7149),g=i(1001),u=i(5893),j=function(e){var t,i=e.views,n=e.setViewCallback,j=e.variant,_=(e.name,e.defaultView),v=(0,h.useRouter)(),b=(null==v?void 0:null===(t=v.query)||void 0===t?void 0:t.vid)&&v.query.vid,p=(0,r.useState)(_),w=p[0],y=p[1],k=(0,f.Z)(),Z=k.width,N=k.height,E=(0,r.useState)({width:350}),O=E[0],S=E[1],z=function(e){v.push({pathname:null==v?void 0:v.pathname,query:{vid:(0,g.Z)(e,!1)||b}},void 0,{shallow:!1}),n&&n(e)},P=(0,m.Z)("settings",void 0,j),C=(0,m.Z)("settings__content",void 0,j),q=(0,m.Z)("settings__view",void 0,j),F=function(){setTimeout(function(){var e,t=null===(e=document.getElementById("header-container"))||void 0===e?void 0:e.firstChild;if(t){var i=Number((t&&window.getComputedStyle(t)).marginLeft.replace("px",""))-14;S({width:Z>1700?i:300})}else console.log("headerContainer not found")},100)},A=function(){return Object.keys(i).map(function(e){return(0,g.Z)(e,!0)})};return((0,r.useEffect)(function(){F()},[Z,N]),(0,r.useEffect)(function(){if(i){var e=b||_||Object.keys(i)[0];e&&y(String(e))}},[n]),w)?(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s(),{id:a.__hash,children:a}),(0,u.jsx)("div",{id:"settings-container",className:"jsx-".concat(a.__hash)+" "+(P||""),children:(0,u.jsxs)("div",{className:"jsx-".concat(a.__hash)+" "+(C||""),children:[(0,u.jsxs)("div",{className:"jsx-".concat(a.__hash)+" settings__actions",children:[(0,u.jsx)(o.Z,{maxWidth:1100,style:O,children:(0,u.jsx)("div",{className:"jsx-".concat(a.__hash)+" settings__actions--content",children:(0,u.jsx)(c.Z,{options:A(),variant:"flat",value:w,onSelect:z})})}),(0,u.jsx)(o.Z,{minWidth:1100,children:(0,u.jsx)("div",{className:"jsx-".concat(a.__hash)+" settings__actions--content",children:(0,u.jsx)(l.Z,{onSelect:z,title:(0,d.R)(w||""),options:A()})})})]}),(0,u.jsx)("div",{className:"jsx-".concat(a.__hash)+" "+(q||""),children:(0,u.jsx)("div",{className:"jsx-".concat(a.__hash)+" settings__view__content",children:w&&i[w]})})]})})]}):(0,u.jsx)(x.Z,{})}}}]);