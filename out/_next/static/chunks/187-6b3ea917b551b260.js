"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[187],{8187:function(e,t,i){i.d(t,{Z:function(){return home_controller_Home}});var s=i(5003),a=i.n(s),n=i(7294),r=[];r.__hash="2085888330";var o=[".surveillance.jsx-3472433715{min-height:500px;width:100%;}"];o.__hash="3472433715";var l=i(9499),c=["img.jsx-3422516844{width:100%;height:auto;z-index:1;position:relative;}","img.jsx-3422516844 .d-flex.jsx-3422516844,img.jsx-3422516844 img.jsx-3422516844{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}"];c.__hash="3422516844";var d=[".d-flex.jsx-2678087171,.image-control.jsx-2678087171 .image-control__controls.jsx-2678087171{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".image-control.jsx-2678087171{width:auto;position:relative;height:auto;overflow:hidden;outline:solid 1px var(--gray-80);}","@media (max-width:900px){.image-control.jsx-2678087171{max-width:calc(100vw - var(--padding) * 2);}}",".image-control.jsx-2678087171:hover .image-control__controls.jsx-2678087171{bottom:0;opacity:1;}",".image-control.jsx-2678087171 .image-control__element.jsx-2678087171{background-color:#000;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;height:auto;z-index:-1;}",".image-control.jsx-2678087171 .image-control__controls.jsx-2678087171{background-color:var(--gray-100);z-index:2;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;position:absolute;bottom:-100%;padding:0 var(--s-9);width:calc(100% - var(--s-9) * 2);left:0;height:var(--element-height);opacity:0;-webkit-transition:bottom 0.5s ease,opacity 0.5s ease;transition:bottom 0.5s ease,opacity 0.5s ease;}",".image-control.jsx-2678087171 .image-control__controls__control.jsx-2678087171{cursor:pointer;}",".image-control.jsx-2678087171 .image-control__controls__control.jsx-2678087171:hover{--ui-icon-color:var(--primary);}"];d.__hash="2678087171";var x=i(682),m=i(9817),h=i(2881),f=i(9073),p=i(5893),components_ImageControl_ImageControl=function ImageControl(e){var t=e.children,i=e.variant,s=e.mediaType,r=void 0===s?"image":s,o=e.refreshInterval,l=void 0===o?1e3:o,c=e.error,_=e.fixedLoad,g=(0,n.useRef)(null),j=(0,n.useState)(!0),b=j[0],v=j[1],u=(0,m.Z)("image-control__element",r,i),w=(0,f.dd)(),y=w.openModal,k=w.closeModal,X=w.isModalOpen;return(0,n.useEffect)(function(){var e=setInterval(function(){var e,t=null==g?void 0:null===(e=g.current)||void 0===e?void 0:e.offsetHeight;g.current&&t&&t>30?v(!1):c&&!b&&v(!0)},l);return function(){return clearInterval(e)}},[l,b,g.current]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a(),{id:d.__hash,children:d}),(0,p.jsxs)("div",{className:"jsx-".concat(d.__hash)+" "+"image-control".concat(b?" image-control__loading":""),children:[" ",!0==b&&(0,p.jsx)(x.Z,{height:300,position:void 0!==_&&_?void 0:"relative",text:c||void 0,dots:"string"!=typeof c&&void 0}),(0,p.jsx)("div",{id:"image-control__element",ref:g,className:"jsx-".concat(d.__hash)+" "+"".concat(u),children:n.Children.map(t,function(e){return(0,n.isValidElement)(e)?(0,n.cloneElement)(e):e})}),(0,p.jsxs)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls",children:[(0,p.jsx)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls__control",children:(0,p.jsx)(h.a,{icon:"fa-play-pause"})}),(0,p.jsx)("div",{className:"jsx-".concat(d.__hash)+" image-control__controls__control",children:(0,p.jsx)(h.a,{icon:"fa-expand",onClick:function(){X?k():y({children:(0,p.jsx)(ImageControl,{fixedLoad:!0,variant:i,mediaType:r,refreshInterval:l,error:c,children:t}),variant:"fullscreen"})}})})]})]})]})};function ownKeys(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,s)}return i}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?ownKeys(Object(i),!0).forEach(function(t){(0,l.Z)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):ownKeys(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var UiVideo_controller_UiMedia=function(e){var t=e.src,i=e.variant,s=e.type,r=e.alt,o=(0,n.useState)({variant:i,type:s}),l=o[0],d=o[1],handleError=function(e){e.preventDefault(),l.error||d(_objectSpread(_objectSpread({},l),{},{error:"failed to load media"}))};return(0,n.useEffect)(function(){},[handleError]),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a(),{id:c.__hash,children:c}),(0,p.jsx)(components_ImageControl_ImageControl,_objectSpread(_objectSpread({},l),{},{children:!l.error&&(0,p.jsx)("img",{src:t,alt:r,onError:handleError,className:"jsx-".concat(c.__hash)})}))]})},_=i(8991),g=i(7011),surveillance_controller_Surveillance=function(){return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a(),{id:o.__hash,children:o}),(0,p.jsx)("div",{className:"jsx-".concat(o.__hash)+" surveillance",children:(0,p.jsxs)(g.Z,{xs:1,md:2,padding:"0 0 200px",children:[(0,p.jsx)(UiVideo_controller_UiMedia,{src:"".concat(_.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=2")}),(0,p.jsx)(UiVideo_controller_UiMedia,{src:"".concat(_.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=3")}),(0,p.jsx)(UiVideo_controller_UiMedia,{src:"".concat(_.Z.serviceEndpoints.membership,"/api/stream/rtsp/?id=1")})]})})]})},j=i(5960),home_controller_Home=function(){var e={surveillance:(0,p.jsx)(surveillance_controller_Surveillance,{}),lights:(0,p.jsx)("h1",{children:"Hi World"})};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(a(),{id:r.__hash,children:r}),(0,p.jsx)(j.Z,{variant:"flat",title:"home",views:e})]})}},8568:function(e,t,i){i.d(t,{Z:function(){return components_UiDiv_UiDiv}});var s=i(5003),a=i.n(s),n=i(7294),r=[".d-flex.jsx-3118516192,.d-flex-col.jsx-3118516192,.d-flex-col_j-fs_a-fs.jsx-3118516192,.ui-div.jsx-3118516192,.div.jsx-3118516192,.d-flex_j-fs_a-fs.jsx-3118516192{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".d-flex_j-fs_a-fs.jsx-3118516192,.d-flex-col_j-fs_a-fs.jsx-3118516192,.ui-div.jsx-3118516192,.div.jsx-3118516192{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}",".d-flex-col.jsx-3118516192,.d-flex-col_j-fs_a-fs.jsx-3118516192,.ui-div.jsx-3118516192,.div.jsx-3118516192{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".ui-div.jsx-3118516192,.div.jsx-3118516192{height:-webkit-max-content;height:-moz-max-content;height:max-content;gap:var(--padding);font-size:var(--s-5);width:100%;}",".ui-div__card.jsx-3118516192,.div__card.jsx-3118516192{color:var(--gray-50);outline:solid 1px var(--gray-80);border:solid 1px var(--gray-60);border-radius:var(--border-radius);min-height:var(--element-height);border-radius:var(--border-radius);}",".ui-div__mc.jsx-3118516192,.div__mc.jsx-3118516192{color:var(--gray-40);background-color:var(--gray-80);border-radius:var(--border-radius);border-style:outset;border-color:var(--gray-40-opaque) var(--gray-40-opaque) var(--gray-60-opaque) var(--gray-20-opaque);border-width:2px;padding:var(--padding);width:calc(100% - 4px - var(--padding) * 2);}",".ui-div__lite.jsx-3118516192,.div__lite.jsx-3118516192{color:var(--gray-70);background-color:var(--gray-50);}",".ui-div__dark.jsx-3118516192,.div__dark.jsx-3118516192{background-color:var(--gray-90);}",".ui-div__shadow.jsx-3118516192,.div__shadow.jsx-3118516192{box-shadow:var(--box-shadow);}"];r.__hash="3118516192";var o=i(7360),l=i(5893),components_UiDiv_UiDiv=function(e){var t,i,s=e.children,c=e.variant,d=e.style,x=e.jsx,m=void 0===x?"":x,h=e.id,f=e.minWidth,p=e.maxWidth,_=(0,n.useRef)(null),g=null===(i=(0,o.Z)())||void 0===i?void 0:i.width,j=(0,n.useState)(!0),b=j[0],v=j[1],u=(t="div ui-div",c?"".concat(t," ").concat(c.split(" ").map(function(e){return"".concat(t,"__").concat(e)}).join(" ")):t),w=f&&f<g,y=p&&p>g;return((0,n.useEffect)(function(){b&&w?v(!1):b&&y?v(!1):b||v(!0)},[w,y]),(0,n.useEffect)(function(){var e;if(null!=_&&_.current&&h&&(null===(e=_.current.previousSibling)||void 0===e?void 0:e.tagName)!="STYLE"){var t=document.createElement("style");t.setAttribute("jsx",""),t.innerText="#".concat(h)+m,_.current.parentNode.insertBefore(t,_.current)}},[_.current]),b&&h&&m||b&&!m&&!h)?(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(a(),{id:r.__hash,children:r}),!!(!h&&m)&&"jsx needs [props.id]",(0,l.jsx)("div",{ref:_,style:d,id:h,className:"jsx-".concat(r.__hash)+" "+(u||""),children:s})]}):(0,l.jsx)(l.Fragment,{})}},5960:function(e,t,i){i.d(t,{Z:function(){return layouts_UiSettingsLayout_UiSettingsLayout}});var s=i(5003),a=i.n(s),n=i(7294),r=["@-webkit-keyframes borderAnimation-jsx-835705612{0%,100%{border-color:var(--dark);}25%{border-color:var(--dark-opaque);}50%{border-color:var(--primary);}75%{border-color:var(--primary-opaque);}}","@keyframes borderAnimation-jsx-835705612{0%,100%{border-color:var(--dark);}25%{border-color:var(--dark-opaque);}50%{border-color:var(--primary);}75%{border-color:var(--primary-opaque);}}",".d-flex.jsx-835705612,.settings.jsx-835705612 .settings__view__content.jsx-835705612,.settings.jsx-835705612 .settings__view--header.jsx-835705612,.settings.jsx-835705612 .settings__actions--content.jsx-835705612,.settings__content.jsx-835705612,.settings--icon.jsx-835705612{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".settings.jsx-835705612{z-index:999;height:100%;left:0;z-index:1;position:relative;padding:var(--padding) 0 0;width:100%;}",".settings--icon.jsx-835705612{--ui-icon-width:100%;--ui-icon-height:var(--s-5);display:none;position:absolute;top:var(--s-4);border-radius:var(--border-radius);left:0;z-index:2;color:var(--primary);text-align:center;height:var(--s-2);width:var(--s-2);line-height:1;font-size:var(--s-7);}","@media (min-width:1100px){.settings--icon.jsx-835705612{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}}",".settings--icon--hide.jsx-835705612{opacity:0.5;left:var(--s-5);}",".settings--icon.jsx-835705612:hover{border:solid 1px var(--gray-70);}",".settings__content.jsx-835705612{-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}","@media (min-width:1100px){.settings__content.jsx-835705612{padding:var(--element-height) 0 0;height:calc(100% - var(--element-height));}}","@media (max-width:1100px){.settings__content.jsx-835705612{height:100%;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}}","@media (max-width:1260px){.settings__content.jsx-835705612{margin:0 auto var(--s-1);-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}}","@-webkit-keyframes hideActions-jsx-835705612{0%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:auto;}10%{opacity:0.3;}65%{opacity:0;}98%{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}100%{opacity:0;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);width:0px;}}","@keyframes hideActions-jsx-835705612{0%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:auto;}10%{opacity:0.3;}65%{opacity:0;}98%{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;}100%{opacity:0;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);width:0px;}}","@-webkit-keyframes hideActionsSm-jsx-835705612{0%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;}100%{opacity:0;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);width:0px;}}","@keyframes hideActionsSm-jsx-835705612{0%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;}100%{opacity:0;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);width:0px;}}",".settings.jsx-835705612 .settings__actions.jsx-835705612{height:inherit;position:relative;z-index:3;}",".settings.jsx-835705612 .settings__actions--hide.jsx-835705612{-webkit-animation:hideActions-jsx-835705612 1s ease-in-out forwards;animation:hideActions-jsx-835705612 1s ease-in-out forwards;}","@media (max-width:1100px){.settings.jsx-835705612 .settings__actions--hide.jsx-835705612{-webkit-animation:hideActionsSm-jsx-835705612 1s ease-in-out forwards;animation:hideActionsSm-jsx-835705612 1s ease-in-out forwards;}}",".settings.jsx-835705612 .settings__actions--show.jsx-835705612{-webkit-animation:hideActions-jsx-835705612 1s ease-in-out forwards reverse;animation:hideActions-jsx-835705612 1s ease-in-out forwards reverse;}","@media (max-width:1100px){.settings.jsx-835705612 .settings__actions--show.jsx-835705612{-webkit-animation:unset;animation:unset;-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:100%;border:none;}}",".settings.jsx-835705612 .settings__actions--content.jsx-835705612{background-color:var(--gray-100);border-radius:var(--border-radius);width:100%;border:solid 1px;-webkit-animation:borderAnimation-jsx-835705612 5s infinite alternate;animation:borderAnimation-jsx-835705612 5s infinite alternate;}","@media (max-width:900px){.settings.jsx-835705612 .settings__actions--content.jsx-835705612{-webkit-animation:unset;animation:unset;}}","@media (max-width:1100px){.settings.jsx-835705612 .settings__actions--content.jsx-835705612{border-radius:var(--border-radius) var(--border-radius) 0 0;border-bottom:solid 0px transparent !important;width:var(--padding-width);padding:var(--padding);box-shadow:var(--box-shadow);}}","@media (min-width:2100px){.settings.jsx-835705612 .settings__actions--content.jsx-835705612{margin-left:auto;max-width:350px;}}","@media (min-width:1100px){.settings.jsx-835705612 .settings__actions.jsx-835705612{min-height:auto;margin-right:var(--padding);}}","@media (max-width:1100px){.settings.jsx-835705612 .settings__actions.jsx-835705612{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:100%;height:-webkit-max-content;height:-moz-max-content;height:max-content;overflow:visible;}}",".settings.jsx-835705612 .settings__view.jsx-835705612{color:var(--gray-40);background-color:var(--gray-100);height:auto;width:100%;position:relative;overflow-x:hidden;overflow-y:auto;border-style:solid;border-width:0 1px 1px 1px;border-radius:var(--border-radius);-webkit-animation:borderAnimation-jsx-835705612 5s infinite alternate;animation:borderAnimation-jsx-835705612 5s infinite alternate;}","@media (min-width:1100px){.settings.jsx-835705612 .settings__view.jsx-835705612{min-height:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;position:unset;border-width:1px;}}","@media (max-width:900px){.settings.jsx-835705612 .settings__view.jsx-835705612{border:none;border-radius:none;}}","@media (max-width:1100px){.settings.jsx-835705612 .settings__view.jsx-835705612{border-radius:0 0 var(--border-radius) var(--border-radius);height:calc(100vh - 170px);border-top-color:transparent !important;}}",".settings.jsx-835705612 .settings__view--header.jsx-835705612{position:absolute;top:var(--s-5);z-index:999;color:var(--gray-30);text-transform:capitalize;z-index:-1;}","@media (max-width:1100px){.settings.jsx-835705612 .settings__view--header.jsx-835705612{display:none;}}",".settings.jsx-835705612 .settings__view--header--title.jsx-835705612{font-size:var(--s-1);}",".settings.jsx-835705612 .settings__view--header--hide.jsx-835705612{-webkit-transform:translateX(var(--element-height));-ms-transform:translateX(var(--element-height));transform:translateX(var(--element-height));}",".settings.jsx-835705612 .settings__view__content.jsx-835705612{z-index:1000;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;padding:var(--s-4) var(--s-5);}","@media (max-width:1100px){.settings.jsx-835705612 .settings__view__content.jsx-835705612{padding:var(--s-5) var(--s-8);}}","@media (max-width:900px){.settings.jsx-835705612 .settings__view__content.jsx-835705612{padding:var(--s-7) var(--s-9);}}"];r.__hash="835705612";var o=i(8568),l=i(359),c=i(9492),d=i(5182),x=i(682),m=i(1163),h=i(9817),f=i(7360),p=i(2737),_=i(2881),g=i(5893),layouts_UiSettingsLayout_UiSettingsLayout=function(e){var t,i=e.views,s=e.setViewCallback,j=e.variant,b=e.title,v=e.defaultView,u=(0,f.Z)(),w=u.width;u.height;var y=(0,m.useRouter)(),k=(null==y?void 0:null===(t=y.query)||void 0===t?void 0:t.vid)&&y.query.vid,X=(0,n.useState)(v),S=X[0],Z=X[1],N=(0,n.useState)({width:350}),E=N[0];N[1];var handleView=function(e){y.push({pathname:null==y?void 0:y.pathname,query:{vid:(0,p.Z)(e,!1)||k}},void 0,{shallow:!1}),s&&s(e)},O=(0,h.Z)("settings",void 0,j),A=(0,h.Z)("settings__content",void 0,j),z=(0,h.Z)("settings__view",void 0,j),U=(0,n.useState)(""),V=U[0],C=U[1],optionViews=function(){var e=!(arguments.length>0)||void 0===arguments[0]||arguments[0];return Object.keys(i).map(function(t){return(0,p.Z)(t,e)})};return((0,n.useEffect)(function(){w<1100&&"hide"==V&&C("show")},[C,w]),(0,n.useEffect)(function(){if(i){var e=k||v||Object.keys(i)[0];e&&Z(String(e))}},[k]),S)?(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(a(),{id:r.__hash,children:r}),(0,g.jsx)("div",{id:"settings-container",className:"jsx-".concat(r.__hash)+" "+(O||""),children:(0,g.jsxs)("div",{className:"jsx-".concat(r.__hash)+" "+(A||""),children:[(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" "+"settings--icon ".concat("settings--icon--".concat(V)),children:(0,g.jsx)(_.a,{icon:""==V?"fa-xmark":"hide"==V?"fa-bars":"fa-xmark",onClick:function(){""==V?C("hide"):"hide"==V?C("show"):"show"==V?C("hide"):C("")}})}),(0,g.jsxs)("div",{className:"jsx-".concat(r.__hash)+" "+"settings__actions ".concat(""!==V?"settings__actions--".concat(V):""),children:[(0,g.jsx)(o.Z,{maxWidth:1100,style:E,children:(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__actions--content",children:(0,g.jsx)(l.Z,{options:optionViews(!1),variant:"flat",value:S,onSelect:handleView})})}),(0,g.jsx)(o.Z,{minWidth:1100,children:(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__actions--content",children:(0,g.jsx)(c.Z,{onSelect:handleView,title:(0,d.R)(S||""),options:optionViews(!1)})})})]}),(0,g.jsxs)("div",{className:"jsx-".concat(r.__hash)+" "+(z||""),children:[b&&(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" "+"settings__view--header".concat(""==V?" settings__view--header--init":"show"==V?" settings__view--header--show":" settings__view--header--hide"),children:(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__view--header--title",children:b})}),(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__view__content",children:S&&i[S]})]})]})})]}):(0,g.jsx)(x.Z,{})}}}]);