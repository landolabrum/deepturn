"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6378],{16378:function(e,t,i){i.d(t,{Z:function(){return O}});var a=i(21378),n=i.n(a),s=i(67294),r=[".d-flex.jsx-2989434223,.social__default.jsx-2989434223{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".social__default.jsx-2989434223{width:var(--s-4-width);padding:var(--s-4);}",".social__default--title.jsx-2989434223{color:var(--gray-30);font-size:var(--s-3);}",".social.jsx-2989434223{width:100%;height:-webkit-max-content;height:-moz-max-content;height:max-content;}"];r.__hash="2989434223";var o=i(11907),c=i(85153),l=i(59499),d=[".d-flex.jsx-2384609631,.instagram.jsx-2384609631{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;}",".instagram.jsx-2384609631{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;color:var(--gray-90);gap:var(--s-4);height:100%;width:100%;min-height:500px;border-radius:var(--border-radius);}"];d.__hash="2384609631";var x=i(50029),u=i(16835),h=i(64687),v=i.n(h),m=[".d-flex.jsx-3982938688,.instagram-sign-in__header.jsx-3982938688,.instagram-sign-in.jsx-3982938688{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".instagram-sign-in.jsx-3982938688{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-element);width:var(--s-4-width);padding:var(--s-1) var(--s-4) var(--s-5);background-color:var(--gray-90);border-radius:var(--border-radius);max-width:800px;--ui-icon-size:var(--s-1);font-size:var(--s-1);}",".instagram-sign-in__header.jsx-3982938688{color:var(--blue-30);--ui-icon-color:var(--blue-30);gap:var(--s-10);width:100%;}","@media (max-width:1100px){.instagram-sign-in.jsx-3982938688{max-width:unset;}}"];m.__hash="3982938688";var f=i(38903),b=function(e){var t=(0,s.useState)(e),i=t[0],a=t[1],n=(0,s.useState)(!0),r=(n[0],n[1]),o=function(e){void 0!==e&&r(e)},c=function(e){void 0!==e&&a(e)},l=function(e){var t=e.target,a=t.name,n=t.value,s=i.map(function(e){return e.name==a&&("value"==e.name&&String(e.value).length>=3?e.error="too long":e.error&&delete e.error,e.value=n),e});o(!!s.find(function(e){return void 0==e.value||0==e.value})),c(s)};return(0,s.useEffect)(function(){},[l]),[i,l]},w=i(10394),g=i(98014),p=i(6253),j=i(85893),y=function(e){var t,i=b([{name:"username",label:"username",type:"text",autoComplete:"off"},{label:"password",name:"password",type:"password",autoComplete:"off"}]),a=(0,u.Z)(i,2),s=a[0],r=a[1],o=(0,w.ko)("ISocialService"),c=(t=(0,x.Z)(v().mark(function t(i){var a,n,r,c,l;return v().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("[ onSubmit ]",i),r=null===(a=(0,g.PI)(s,"username"))||void 0===a?void 0:a.value,c=null===(n=(0,g.PI)(s,"password"))||void 0===n?void 0:n.value,l={email:e.email,username:r,password:c},t.prev=4,t.next=7,o.instagramAuthenticate(l);case 7:console.log("[ onSubmit ] ( SUCCESS! )",t.sent),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(4),console.log("Instagram [ onSubmit ]( error )",t.t0);case 14:case"end":return t.stop()}},t,null,[[4,11]])})),function(e){return t.apply(this,arguments)});return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(n(),{id:m.__hash,children:m}),(0,j.jsxs)("div",{className:"jsx-".concat(m.__hash)+" instagram-sign-in",children:[(0,j.jsxs)("div",{className:"jsx-".concat(m.__hash)+" instagram-sign-in__header",children:["Authenticate ",(0,j.jsx)(p.a,{icon:"fa-instagram"})]}),(0,j.jsx)(f.Z,{fields:s,onChange:r,onSubmit:c,submitText:"instagram sign in"})]})]})},_=i(51633);function k(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,a)}return i}function N(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?k(Object(i),!0).forEach(function(t){(0,l.Z)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):k(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var S=function(e){e.current;var t=(0,s.useState)("signin"),i=t[0];t[1];var a=(0,o.aF)(),r={signin:(0,j.jsx)(y,N({},a))};return(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(n(),{id:d.__hash,children:d}),(0,j.jsx)("div",{className:"jsx-".concat(d.__hash)+" instagram",children:(0,j.jsx)("div",{className:"jsx-".concat(d.__hash)+" instagram--view",children:(0,j.jsx)(_.Z,N({},{views:r,currentView:i}))})}),(0,j.jsx)("div",{className:"jsx-".concat(d.__hash)+" instagram__tandc",children:"Not Responsible"})]})},z=i(11163),Z=i(80727),O=function(){var e,t=(0,z.useRouter)(),i=null==t||null===(e=t.query)||void 0===e?void 0:e.platform,a=(0,o.aF)(),l=(0,s.useState)(),d=l[0],x=l[1],u={instagram:(0,j.jsx)(S,{})};return((0,s.useEffect)(function(){i&&!d&&x(String(i))},[i]),a&&i)?(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(n(),{id:r.__hash,children:r}),(0,j.jsx)(Z.Z,{viewName:d,title:"social",subTitle:d,views:u})]}):(0,j.jsx)(j.Fragment,{children:(0,j.jsx)(c.Z,{})})}},85102:function(e,t,i){i.d(t,{Z:function(){return x}});var a=i(50029),n=i(21378),s=i.n(n),r=i(64687),o=i.n(r),c=i(67294),l=[".d-flex.jsx-3278501827{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}","@-webkit-keyframes fadeInSubHeader-jsx-3278501827{from{opacity:0;}to{opacity:1;}}","@keyframes fadeInSubHeader-jsx-3278501827{from{opacity:0;}to{opacity:1;}}",".header.jsx-3278501827{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:-webkit-max-content;width:-moz-max-content;width:max-content;line-height:1;z-index:1;color:var(--primary-70);font-size:var(--s-element);min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;text-transform:uppercase;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:0;-webkit-animation:fadeInSubHeader-jsx-3278501827 4s ease-in forwards;animation:fadeInSubHeader-jsx-3278501827 4s ease-in forwards;}",".header--sub-title.jsx-3278501827{text-transform:capitalize;right:0;font-size:var(--s-1);color:var(--gray-40);opacity:0.8;text-shadow:-2px -2px 5px var(--gray-70);line-height:1;z-index:2;}",".header--sub-title-set.jsx-3278501827{-webkit-transform:translate(50%,50%);-ms-transform:translate(50%,50%);transform:translate(50%,50%);position:absolute;}"];l.__hash="3278501827";var d=i(85893),x=function(e){var t,i=e.title,n=e.subTitle,r=(0,c.useRef)(null),x=null==r?void 0:r.current,u=(0,c.useState)(!1),h=u[0],v=u[1],m=(t=(0,a.Z)(o().mark(function e(){var t,i;return o().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!(!0==h||!x)){e.next=2;break}return e.abrupt("return");case 2:v(!0),t=x.querySelector(".header--title"),i=x.querySelector(".header--sub-title"),x.style.width="".concat(x.offsetWidth,"px"),x.style.minHeight="".concat(Number(x.offsetHeight/2),"px"),null==t||t.classList.add("header--title-set"),null==i||i.classList.add("header--sub-title-set");case 9:case"end":return e.stop()}},e)})),function(){return t.apply(this,arguments)});return(0,c.useEffect)(function(){for(h||m();!h;){setTimeout(m,500);break}},[x]),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(s(),{id:l.__hash,children:l}),(0,d.jsxs)("div",{ref:r,className:"jsx-".concat(l.__hash)+" header",children:[(0,d.jsx)("div",{className:"jsx-".concat(l.__hash)+" header--title",children:i}),n&&(0,d.jsx)("div",{className:"jsx-".concat(l.__hash)+" header--sub-title",children:n})]})]})}},80727:function(e,t,i){i.d(t,{Z:function(){return m}});var a=i(21378),n=i.n(a),s=i(67294),r=[".d-flex.jsx-3535989449,.settings-view--logo.jsx-3535989449,.settings-nav--content.jsx-3535989449 .nav-item.jsx-3535989449,.settings-nav--content.jsx-3535989449,.settings-view--content.jsx-3535989449,.settings__loader.jsx-3535989449{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".settings.jsx-3535989449{width:100%;padding-top:var(--s-element);}",".settings__nav.jsx-3535989449{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;position:relative;}","@media (min-width:1101px){.settings__nav.jsx-3535989449{width:var(--s-5-width);padding:0 var(--s-5);}}",".settings__loader.jsx-3535989449{min-height:100%;}",".settings-view.jsx-3535989449{z-index:1;-webkit-animation:viewBorderAnimation-jsx-3535989449 5s infinite;animation:viewBorderAnimation-jsx-3535989449 5s infinite;border:solid 1px var(--gray-90);margin:0;}","@-webkit-keyframes viewBorderAnimation-jsx-3535989449{0%,100%{border-color:var(--gray-100);}25%{border-color:var(--gray-60);}50%{border-color:var(--orange-50);}}","@keyframes viewBorderAnimation-jsx-3535989449{0%,100%{border-color:var(--gray-100);}25%{border-color:var(--gray-60);}50%{border-color:var(--orange-50);}}","@media (min-width:1101px){.settings-view.jsx-3535989449{border-radius:var(--border-radius);background-color:var(--gray-100-o);}}",".settings-view--content.jsx-3535989449{min-height:500px;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;}","@media (min-width:1101px){.settings-view--content.jsx-3535989449{width:var(--s-9-width);padding:var(--s-9) var(--s-9) var(--s-4);}}","#settings.jsx-3535989449{width:100%;margin:var(--s-9) auto;border-spacing:var(--s-9) var(--s-5);}","@media (max-width:1100px){#settings.jsx-3535989449{border-spacing:0 var(--s-5);}}","@media (max-width:1100px){#settings.jsx-3535989449{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;margin:var(--s-1) auto;width:var(--s-9-width);border-spacing:var(--s-9) 0;gap:var(--s-5);}#settings.jsx-3535989449 tr.jsx-3535989449{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;gap:var(--s-9);}}","#settings.jsx-3535989449 tbody.jsx-3535989449 tr.jsx-3535989449{vertical-align:top;}","@-webkit-keyframes brightnessHover-jsx-3535989449{100%{-webkit-filter:brightness(1) blur(0);filter:brightness(1) blur(0);color:var(--gray-60);--ui-icon-color:var(--gray-60);background-color:transparent;border:solid 1px var(--gray-80);}}","@keyframes brightnessHover-jsx-3535989449{100%{-webkit-filter:brightness(1) blur(0);filter:brightness(1) blur(0);color:var(--gray-60);--ui-icon-color:var(--gray-60);background-color:transparent;border:solid 1px var(--gray-80);}}","@-webkit-keyframes navItemHighlight-jsx-3535989449{0%{border-color:transparent;}25%{border-color:var(--gray-60-o);}75%{border-color:var(--gray-90-o);}100%{border-color:transparent;}}","@keyframes navItemHighlight-jsx-3535989449{0%{border-color:transparent;}25%{border-color:var(--gray-60-o);}75%{border-color:var(--gray-90-o);}100%{border-color:transparent;}}",".settings-nav--content.jsx-3535989449{-webkit-transition:all 0.5s ease-in;transition:all 0.5s ease-in;-webkit-animation-play-state:paused;animation-play-state:paused;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-10);padding-left:0;}","@media (max-width:1100px){.settings-nav--content.jsx-3535989449{width:var(--s-9-width);box-shadow:inset 4px 2px 3px 3px var(--gray-100);top:0;left:0;right:0;margin:0;height:100%;border:solid 1px var(--gray-80-o);z-index:1;border-radius:var(--s-1);overflow:hidden;overflow-x:auto;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;padding:var(--s-11) var(--s-9);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;background-color:var(--gray-90-o);}.settings-nav--content.jsx-3535989449::-webkit-scrollbar{display:none;}}",".settings-nav--content.jsx-3535989449 .nav-item.jsx-3535989449{width:calc(var(--s-4-width) - 2px);cursor:pointer;-webkit-animation:viewBorderAnimation-jsx-3535989449 5s ease-in-out infinite;animation:viewBorderAnimation-jsx-3535989449 5s ease-in-out infinite;height:var(--s-2);-webkit-user-select:all;-moz-user-select:all;-ms-user-select:all;user-select:all;background-color:var(--gray-100);-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;font-size:var(--s-6);color:var(--gray-70);--ui-icon-color:var(--gray-70);padding:var(--s-11) var(--s-1);text-transform:capitalize;border-radius:var(--s-9);white-space:nowrap;cursor:pointer;position:relative;--ui-icon-size:var(--s-5);border:solid 1px transparent;z-index:1;-webkit-animation-delay:calc(var(--animation-order) * 0.5s);animation-delay:calc(var(--animation-order) * 0.5s);-webkit-filter:blur(1px);filter:blur(1px);}","@media (max-width:1100px){.settings-nav--content.jsx-3535989449 .nav-item.jsx-3535989449{border-radius:var(--s-1);padding:var(--s-9) var(--s-4);gap:var(--s-9);}}",".settings-nav--content.jsx-3535989449 .nav-item--selected-icon.jsx-3535989449{position:absolute;right:var(--s-7);--ui-icon-color:var(--primary-50) !important;}","@media (max-width:1100px){.settings-nav--content.jsx-3535989449 .nav-item--selected-icon.jsx-3535989449{position:relative;right:0;}}",".settings-nav--content.jsx-3535989449 .nav-item--selected.jsx-3535989449{color:var(--primary-50) !important;background-color:var(--dark) !important;-webkit-filter:blur(0) !important;filter:blur(0) !important;}",".settings-nav--content.jsx-3535989449:hover .nav-item.jsx-3535989449{-webkit-animation:brightnessHover-jsx-3535989449 0.1s forwards;animation:brightnessHover-jsx-3535989449 0.1s forwards;}",".settings-view.jsx-3535989449{width:100%;box-shadow:inset var(--s-11) -2px var(--s-10) var(--s-11) var(--gray-100-o);-webkit-animation-delay:calc(0.5s * var(--total-nav-items));animation-delay:calc(0.5s * var(--total-nav-items));position:relative;z-index:2;min-height:500px;}","@media (max-width:1100px){.settings-view.jsx-3535989449{-webkit-animation:unset;animation:unset;border:none;}}",".settings-view--logo.jsx-3535989449{z-index:-1;--ui-icon-color:var(--gray-70-o);position:absolute;-webkit-filter:blur(4px);filter:blur(4px);top:0;left:0;--ui-icon-size:300px;width:100%;height:100%;}"];r.__hash="3535989449";var o=i(85153),c=i(11163),l=function(e){var t=e.cls,i=e.type,a=e.variant,n=e.extras,r=e.minWidths,o=e.maxWidths,c=e.width,l=e.standalones,d=(0,s.useState)(t),x=d[0],u=d[1];return(0,s.useEffect)(function(){var e=t,s=function(i){i&&(e+=" ".concat(t,"__").concat(i))};s(a),s(i),n&&n.forEach(function(i){null!=i&&i.length&&(e+=" ".concat(t,"__").concat(i))}),l&&l.forEach(function(t){null!=t&&t.length&&(e+=" ".concat(t))});var d=function(i,a){c&&i.forEach(function(i){var n="number"==typeof i.width?i.width:"string"==typeof i.width&&i.width.endsWith("px")?parseInt(i.width):0;(a?n>c:n<c)&&(Array.isArray(i.classList)?i.classList.forEach(function(i){e+=" ".concat(t,"__").concat(i)}):e+=" ".concat(t).concat(i.classList))})};r&&d(r,!0),o&&d(o,!1),u(e)},[e]),x},d=i(49334),x=i(6253),u=i(23992),h=i(85102),v=i(85893),m=function(e){var t,i=e.views,a=e.setViewCallback,m=e.variant,f=e.title,b=e.subTitle,w=e.viewName;e.showMenu;var g=(0,c.useRouter)(),p=(0,s.useState)(),j=p[0],y=p[1],_={container:l({cls:"settings",variant:m}),content:l({cls:"settings__content",variant:m}),header:l({cls:"settings__header",variant:m}),viewContainer:l({cls:"settings__view-container",variant:m}),view:l({cls:"settings__view",variant:m}),nav:l({cls:"settings__nav",variant:m})},k=(0,s.useCallback)(function(e){g.push({pathname:g.pathname,query:{vid:(null==e?void 0:e.includes("-"))&&(0,d.Z)(e)||e}},void 0,{shallow:!1}),null==a||a(e)},[g,a]),N="string"==typeof f&&(0,d.Z)(f),S=g.query.vid||w||Object.keys(i)[0],z=j&&Object.keys(i).includes(j);return((0,s.useEffect)(function(){return y(null==S?void 0:S.toString())},[S,z]),(0,s.useEffect)(function(){var e=document.querySelector(".settings-nav--content");e&&e.querySelectorAll(".nav-item").forEach(function(e,t){e.style.animationDelay="".concat(.1*t,"s")})},[i,j]),z)?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(n(),{id:r.__hash,children:r}),(0,v.jsxs)("table",{id:"settings",className:"jsx-".concat(r.__hash)+" "+"".concat(_.container),children:[(0,v.jsx)("thead",{className:"jsx-".concat(r.__hash),children:(0,v.jsxs)("tr",{className:"jsx-".concat(r.__hash),children:[(0,v.jsx)("th",{className:"jsx-".concat(r.__hash)}),(0,v.jsx)("th",{className:"jsx-".concat(r.__hash),children:z&&(0,v.jsx)(h.Z,{title:N,subTitle:b})})]})}),(0,v.jsx)("tbody",{className:"jsx-".concat(r.__hash),children:(0,v.jsxs)("tr",{className:"jsx-".concat(r.__hash),children:[(0,v.jsx)("td",{className:"jsx-".concat(r.__hash)+" "+(_.nav||""),children:(0,v.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings-nav--content",children:null===(t=Object.keys(i))||void 0===t?void 0:t.map(function(e){return(0,v.jsxs)("div",{onClick:function(){return k(e)},className:"jsx-".concat(r.__hash)+" "+"nav-item ".concat(j===e?"nav-item--selected":""),children:[(0,d.Z)(e)," ",j===e&&(0,v.jsx)("span",{className:"jsx-".concat(r.__hash)+" nav-item--selected-icon",children:(0,v.jsx)(x.a,{icon:"fa-check"})})]},e)})})}),(0,v.jsx)("td",{className:"jsx-".concat(r.__hash)+" settings-view",children:(0,v.jsxs)("div",{className:"jsx-".concat(r.__hash)+" settings-view--content",children:[i[j],(0,v.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings-view--logo",children:(0,v.jsx)(x.a,{icon:"".concat(u.Z.merchant.name,"-logo")})})]})})]})})]})]}):(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(n(),{id:r.__hash,children:r}),(0,v.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings",children:(0,v.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__loader",children:(0,v.jsx)(o.Z,{})})})]})}},51633:function(e,t,i){i.d(t,{Z:function(){return u}});var a=i(21378),n=i.n(a),s=i(67294),r=[".d-flex.jsx-437419458,.ui-view-layout__view.jsx-437419458,.ui-view-layout__header.jsx-437419458,.ui-view-layout__actions.jsx-437419458,.ui-view-layout.jsx-437419458,.back-btn.jsx-437419458{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".back-btn.jsx-437419458{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;height:var(--s-element);}",".ui-view-layout.jsx-437419458{position:relative;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;min-height:100%;}",".ui-view-layout.start.jsx-437419458>*.back-btn.jsx-437419458{display:none;}",".ui-view-layout__actions.jsx-437419458{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;gap:var(--s-9);}",".ui-view-layout__view.jsx-437419458{height:100%;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-4);}",".ui-view-layout__view.jsx-437419458,.ui-view-layout__actions.jsx-437419458{width:100%;}",".ui-view-layout__header.jsx-437419458{width:var(--s-4-width);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:0 var(--s-4) var(--s-9);}","@media (max-width:1100px){.ui-view-layout__header.jsx-437419458{width:var(--s-9-width);padding:0 var(--s-9) var(--s-9);}}",".ui-view-layout__header-title.jsx-437419458{font-size:var(--s-1);--ui-icon-color:var(--primary-50);color:var(--primary-50);text-transform:capitalize;}",".current.jsx-437419458{position:absolute;top:calc(var(--s-4) * 0.5);color:var(--gray-30-o);right:var(--s-9);height:var(--s-6);line-height:1;}"];r.__hash="437419458";var o=i(85153),c=i(27812),l=function(e,t){var i=(0,s.useState)([]),a=i[0],n=i[1],r=(0,s.useState)(),o=r[0],l=r[1],d=function(t){var i=String(t);e&&e[i]&&(l(e[i]),n(function(e){return[].concat((0,c.Z)(e),[i])}))};return(0,s.useEffect)(function(){t&&null!=e&&e[t]&&a[a.length-1]!==t&&d(t)},[e,t]),{view:o,setView:d,last:a[a.length-1],goBack:function(){n(function(t){if(t.length>1){var i=t.slice(0,-1);return l(e[i[i.length-1]]),i}return t})}}},d=i(10577),x=i(85893),u=function(e){var t=e.views,i=e.currentView,a=(e.onChange,e.title),c=(e.actions,e.showTitle),u=e.backBtn;(0,s.useEffect)(function(){},[i]);var h=l(t,i),v=h.view,m=(h.setView,h.goBack),f=h.last;return t&&v&&"loading"!=i?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(n(),{id:r.__hash,children:r}),(0,x.jsxs)("div",{className:"jsx-".concat(r.__hash)+" ui-view-layout",children:[void 0!==u&&u&&"start"!==f&&(0,x.jsx)("div",{className:"jsx-".concat(r.__hash)+" back-btn",children:(0,x.jsx)("div",{className:"jsx-".concat(r.__hash),children:(0,x.jsx)(d.Z,{traits:{beforeIcon:"fa-chevron-left"},variant:"flat",onClick:m,children:"Back"})})}),void 0!==c&&c&&"start"!==f&&(0,x.jsx)("div",{className:"jsx-".concat(r.__hash)+" ui-view-layout__header",children:(0,x.jsx)("div",{className:"jsx-".concat(r.__hash)+" ui-view-layout__header-title",children:a})}),(0,x.jsx)("div",{"data-view":i,className:"jsx-".concat(r.__hash)+" ui-view-layout__view",children:v||(0,x.jsx)("div",{className:"jsx-".concat(r.__hash),children:"View not found"})})]})]}):(0,x.jsx)(o.Z,{})}}}]);