"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6378],{16378:function(e,t,i){i.d(t,{Z:function(){return E}});var a=i(21378),n=i.n(a),s=i(67294),r=[".d-flex.jsx-2989434223,.social__default.jsx-2989434223{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".social__default.jsx-2989434223{width:var(--s-4-width);padding:var(--s-4);}",".social__default--title.jsx-2989434223{color:var(--gray-30);font-size:var(--s-3);}",".social.jsx-2989434223{width:100%;height:-webkit-max-content;height:-moz-max-content;height:max-content;}"];r.__hash="2989434223";var o=i(11907),c=i(85153),l=i(59499),d=[".d-flex.jsx-2384609631,.instagram.jsx-2384609631{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;}",".instagram.jsx-2384609631{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;color:var(--gray-90);gap:var(--s-4);height:100%;width:100%;min-height:500px;border-radius:var(--border-radius);}"];d.__hash="2384609631";var x=i(50029),v=i(16835),u=i(64687),h=i.n(u),m=[".d-flex.jsx-3982938688,.instagram-sign-in__header.jsx-3982938688,.instagram-sign-in.jsx-3982938688{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".instagram-sign-in.jsx-3982938688{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-element);width:var(--s-4-width);padding:var(--s-1) var(--s-4) var(--s-5);background-color:var(--gray-90);border-radius:var(--border-radius);max-width:800px;--ui-icon-size:var(--s-1);font-size:var(--s-1);}",".instagram-sign-in__header.jsx-3982938688{color:var(--blue-30);--ui-icon-color:var(--blue-30);gap:var(--s-10);width:100%;}","@media (max-width:1100px){.instagram-sign-in.jsx-3982938688{max-width:unset;}}"];m.__hash="3982938688";var f=i(38903),g=function(e){var t=(0,s.useState)(e),i=t[0],a=t[1],n=(0,s.useState)(!0),r=(n[0],n[1]),o=function(e){void 0!==e&&r(e)},c=function(e){void 0!==e&&a(e)},l=function(e){var t=e.target,a=t.name,n=t.value,s=i.map(function(e){return e.name==a&&("value"==e.name&&String(e.value).length>=3?e.error="too long":e.error&&delete e.error,e.value=n),e});o(!!s.find(function(e){return void 0==e.value||0==e.value})),c(s)};return(0,s.useEffect)(function(){},[l]),[i,l]},b=i(10394),w=i(98014),j=i(55140),p=i(85893),y=function(e){var t,i=g([{name:"username",label:"username",type:"text",autoComplete:"off"},{label:"password",name:"password",type:"password",autoComplete:"off"}]),a=(0,v.Z)(i,2),s=a[0],r=a[1],o=(0,b.ko)("ISocialService"),c=(t=(0,x.Z)(h().mark(function t(i){var a,n,r,c,l;return h().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return console.log("[ onSubmit ]",i),r=null===(a=(0,w.PI)(s,"username"))||void 0===a?void 0:a.value,c=null===(n=(0,w.PI)(s,"password"))||void 0===n?void 0:n.value,l={email:e.email,username:r,password:c},t.prev=4,t.next=7,o.instagramAuthenticate(l);case 7:console.log("[ onSubmit ] ( SUCCESS! )",t.sent),t.next=14;break;case 11:t.prev=11,t.t0=t.catch(4),console.log("Instagram [ onSubmit ]( error )",t.t0);case 14:case"end":return t.stop()}},t,null,[[4,11]])})),function(e){return t.apply(this,arguments)});return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n(),{id:m.__hash,children:m}),(0,p.jsxs)("div",{className:"jsx-".concat(m.__hash)+" instagram-sign-in",children:[(0,p.jsxs)("div",{className:"jsx-".concat(m.__hash)+" instagram-sign-in__header",children:["Authenticate ",(0,p.jsx)(j.a,{icon:"fa-instagram"})]}),(0,p.jsx)(f.Z,{fields:s,onChange:r,onSubmit:c,submitText:"instagram sign in"})]})]})},_=i(51633);function k(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),i.push.apply(i,a)}return i}function N(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?k(Object(i),!0).forEach(function(t){(0,l.Z)(e,t,i[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):k(Object(i)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))})}return e}var Z=function(e){e.current;var t=(0,s.useState)("signin"),i=t[0];t[1];var a=(0,o.aF)(),r={signin:(0,p.jsx)(y,N({},a))};return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n(),{id:d.__hash,children:d}),(0,p.jsx)("div",{className:"jsx-".concat(d.__hash)+" instagram",children:(0,p.jsx)("div",{className:"jsx-".concat(d.__hash)+" instagram--view",children:(0,p.jsx)(_.Z,N({},{views:r,currentView:i}))})}),(0,p.jsx)("div",{className:"jsx-".concat(d.__hash)+" instagram__tandc",children:"Not Responsible"})]})},S=i(11163),O=i(35109),E=function(){var e,t=(0,S.useRouter)(),i=null==t||null===(e=t.query)||void 0===e?void 0:e.platform,a=(0,o.aF)(),l=(0,s.useState)(),d=l[0],x=l[1],v={instagram:(0,p.jsx)(Z,{})};return((0,s.useEffect)(function(){i&&!d&&x(String(i))},[i]),a&&i)?(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(n(),{id:r.__hash,children:r}),(0,p.jsx)(O.Z,{viewName:d,title:"social",subTitle:d,views:v})]}):(0,p.jsx)(p.Fragment,{children:(0,p.jsx)(c.Z,{})})}},79785:function(e,t,i){var a=i(67294);t.Z=function(e){var t=e.cls,i=e.type,n=e.variant,s=e.extras,r=e.minWidths,o=e.maxWidths,c=e.width,l=e.standalones,d=(0,a.useState)(t),x=d[0],v=d[1];return(0,a.useEffect)(function(){var e=t,a=function(i){i&&(e+=" ".concat(t,"__").concat(i))};a(n),a(i),s&&s.forEach(function(i){null!=i&&i.length&&(e+=" ".concat(t,"__").concat(i))}),l&&l.forEach(function(t){null!=t&&t.length&&(e+=" ".concat(t))});var d=function(i,a){c&&i.forEach(function(i){var n="number"==typeof i.width?i.width:"string"==typeof i.width&&i.width.endsWith("px")?parseInt(i.width):0;(a?n>c:n<c)&&(Array.isArray(i.classList)?i.classList.forEach(function(i){e+=" ".concat(t,"__").concat(i)}):e+=" ".concat(t).concat(i.classList))})};r&&d(r,!0),o&&d(o,!1),v(e)},[e]),x}},35109:function(e,t,i){i.d(t,{Z:function(){return m}});var a=i(21378),n=i.n(a),s=i(67294),r=[".d-flex.jsx-2778255082,.settings-view--logo.jsx-2778255082,.settings-nav--content.jsx-2778255082 .nav-item.jsx-2778255082,.settings-nav--content.jsx-2778255082,.settings-view--content.jsx-2778255082,.settings__loader.jsx-2778255082{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".settings.jsx-2778255082{width:100%;}",".settings__nav.jsx-2778255082{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;position:relative;}","@media (min-width:1101px){.settings__nav.jsx-2778255082{width:var(--s-5-width);padding:0 var(--s-5);}}",".settings__loader.jsx-2778255082{min-height:100%;}",".settings-view.jsx-2778255082{z-index:1;-webkit-animation:viewBorderAnimation-jsx-2778255082 5s infinite;animation:viewBorderAnimation-jsx-2778255082 5s infinite;border:solid 1px var(--gray-90);margin:0;}","@-webkit-keyframes viewBorderAnimation-jsx-2778255082{0%,100%{border-color:var(--gray-100);}25%{border-color:var(--gray-60);}50%{border-color:var(--orange-50);}}","@keyframes viewBorderAnimation-jsx-2778255082{0%,100%{border-color:var(--gray-100);}25%{border-color:var(--gray-60);}50%{border-color:var(--orange-50);}}","@media (min-width:1101px){.settings-view.jsx-2778255082{border-radius:var(--border-radius);background-color:var(--gray-100-o);}}",".settings-view--content.jsx-2778255082{min-height:500px;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;}","@media (min-width:1101px){.settings-view--content.jsx-2778255082{width:var(--s-9-width);padding:var(--s-9) var(--s-9) var(--s-4);}}","#settings.jsx-2778255082{width:100%;margin:var(--s-9) auto;border-spacing:var(--s-9) var(--s-5);}","@media (max-width:1100px){#settings.jsx-2778255082{border-spacing:0 var(--s-5);}}","@media (max-width:1100px){#settings.jsx-2778255082{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;margin:0 auto var(--s-1);width:var(--s-9-width);border-spacing:var(--s-9) 0;gap:var(--s-5);}#settings.jsx-2778255082 tr.jsx-2778255082{display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;display:inline-flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;gap:var(--s-9);}}","#settings.jsx-2778255082 tbody.jsx-2778255082 tr.jsx-2778255082{vertical-align:top;}","@-webkit-keyframes brightnessHover-jsx-2778255082{100%{-webkit-filter:brightness(1) blur(0);filter:brightness(1) blur(0);color:var(--gray-60);--ui-icon-color:var(--gray-60);background-color:transparent;border:solid 1px var(--gray-80);}}","@keyframes brightnessHover-jsx-2778255082{100%{-webkit-filter:brightness(1) blur(0);filter:brightness(1) blur(0);color:var(--gray-60);--ui-icon-color:var(--gray-60);background-color:transparent;border:solid 1px var(--gray-80);}}","@-webkit-keyframes navItemHighlight-jsx-2778255082{0%{border-color:transparent;}25%{border-color:var(--gray-60-o);}75%{border-color:var(--gray-90-o);}100%{border-color:transparent;}}","@keyframes navItemHighlight-jsx-2778255082{0%{border-color:transparent;}25%{border-color:var(--gray-60-o);}75%{border-color:var(--gray-90-o);}100%{border-color:transparent;}}",".settings-nav--content.jsx-2778255082{-webkit-transition:all 0.5s ease-in;transition:all 0.5s ease-in;-webkit-animation-play-state:paused;animation-play-state:paused;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-10);padding-left:0;}","@media (max-width:1100px){.settings-nav--content.jsx-2778255082{width:var(--s-9-width);box-shadow:inset 4px 2px 3px 3px var(--gray-100);top:0;left:0;right:0;margin:0;height:100%;border:solid 1px var(--gray-80-o);z-index:1;border-radius:var(--s-1);overflow:hidden;overflow-x:auto;-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;padding:var(--s-11) var(--s-9);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;background-color:var(--gray-90-o);}.settings-nav--content.jsx-2778255082::-webkit-scrollbar{display:none;}}",".settings-nav--content.jsx-2778255082 .nav-item.jsx-2778255082{width:calc(var(--s-4-width) - 2px);cursor:pointer;-webkit-animation:viewBorderAnimation-jsx-2778255082 5s ease-in-out infinite;animation:viewBorderAnimation-jsx-2778255082 5s ease-in-out infinite;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;height:var(--s-2);background-color:var(--gray-100);-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;font-size:var(--s-6);color:var(--gray-70);--ui-icon-color:var(--gray-70);padding:var(--s-11) var(--s-1);text-transform:capitalize;border-radius:var(--s-9);white-space:nowrap;cursor:pointer;position:relative;--ui-icon-size:var(--s-5);border:solid 1px transparent;z-index:1;-webkit-animation-delay:calc(var(--animation-order) * 0.5s);animation-delay:calc(var(--animation-order) * 0.5s);-webkit-filter:blur(1px);filter:blur(1px);}","@media (max-width:1100px){.settings-nav--content.jsx-2778255082 .nav-item.jsx-2778255082{border-radius:var(--s-1);padding:var(--s-9) var(--s-4);gap:var(--s-9);}}",".settings-nav--content.jsx-2778255082 .nav-item--selected-icon.jsx-2778255082{position:absolute;right:var(--s-7);--ui-icon-color:var(--primary-50) !important;}","@media (max-width:1100px){.settings-nav--content.jsx-2778255082 .nav-item--selected-icon.jsx-2778255082{position:relative;right:0;}}",".settings-nav--content.jsx-2778255082 .nav-item--selected.jsx-2778255082{color:var(--primary-50) !important;background-color:var(--dark) !important;-webkit-filter:blur(0) !important;filter:blur(0) !important;}",".settings-nav--content.jsx-2778255082:hover .nav-item.jsx-2778255082{-webkit-animation:brightnessHover-jsx-2778255082 0.1s forwards;animation:brightnessHover-jsx-2778255082 0.1s forwards;}",".settings-view.jsx-2778255082{width:100%;box-shadow:inset var(--s-11) -2px var(--s-10) var(--s-11) var(--gray-100-o);-webkit-animation-delay:calc(0.5s * var(--total-nav-items));animation-delay:calc(0.5s * var(--total-nav-items));position:relative;z-index:2;min-height:500px;}","@media (max-width:1100px){.settings-view.jsx-2778255082{-webkit-animation:unset;animation:unset;border:none;}}",".settings-view--logo.jsx-2778255082{z-index:-1;--ui-icon-color:var(--gray-70-o);position:absolute;-webkit-filter:blur(4px);filter:blur(4px);top:0;left:0;--ui-icon-size:300px;width:100%;height:100%;}"];r.__hash="2778255082";var o=i(85153),c=i(11163),l=i(79785),d=i(49334),x=i(55140),v=i(23992),u=i(85102),h=i(85893),m=function(e){var t,i=e.views,a=e.setViewCallback,m=e.variant,f=e.title,g=e.subTitle,b=e.viewName;e.showMenu;var w=(0,c.useRouter)(),j=(0,s.useState)(),p=j[0],y=j[1],_={container:(0,l.Z)({cls:"settings",variant:m}),content:(0,l.Z)({cls:"settings__content",variant:m}),header:(0,l.Z)({cls:"settings__header",variant:m}),viewContainer:(0,l.Z)({cls:"settings__view-container",variant:m}),view:(0,l.Z)({cls:"settings__view",variant:m}),nav:(0,l.Z)({cls:"settings__nav",variant:m})},k=(0,s.useCallback)(function(e){w.push({pathname:w.pathname,query:{vid:(null==e?void 0:e.includes("-"))&&(0,d.Z)(e)||e}},void 0,{shallow:!1}),null==a||a(e)},[w,a]),N="string"==typeof f&&(0,d.Z)(f),Z=w.query.vid||b||Object.keys(i)[0],S=p&&Object.keys(i).includes(p);return((0,s.useEffect)(function(){return y(null==Z?void 0:Z.toString())},[Z,S]),(0,s.useEffect)(function(){var e=document.querySelector(".settings-nav--content");e&&e.querySelectorAll(".nav-item").forEach(function(e,t){e.style.animationDelay="".concat(.1*t,"s")})},[i,p]),S)?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(n(),{id:r.__hash,children:r}),(0,h.jsxs)("table",{id:"settings",className:"jsx-".concat(r.__hash)+" "+"".concat(_.container),children:[(0,h.jsx)("thead",{className:"jsx-".concat(r.__hash),children:(0,h.jsxs)("tr",{className:"jsx-".concat(r.__hash),children:[(0,h.jsx)("th",{className:"jsx-".concat(r.__hash)}),(0,h.jsx)("th",{className:"jsx-".concat(r.__hash),children:S&&(0,h.jsx)(u.Z,{title:N,subTitle:g})})]})}),(0,h.jsx)("tbody",{className:"jsx-".concat(r.__hash),children:(0,h.jsxs)("tr",{className:"jsx-".concat(r.__hash),children:[(0,h.jsx)("td",{className:"jsx-".concat(r.__hash)+" "+(_.nav||""),children:(0,h.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings-nav--content",children:null===(t=Object.keys(i))||void 0===t?void 0:t.map(function(e){return(0,h.jsxs)("div",{onClick:function(){return k(e)},className:"jsx-".concat(r.__hash)+" "+"nav-item ".concat(p===e?"nav-item--selected":""),children:[(0,d.Z)(e)," ",p===e&&(0,h.jsx)("span",{className:"jsx-".concat(r.__hash)+" nav-item--selected-icon",children:(0,h.jsx)(x.a,{icon:"fa-check"})})]},e)})})}),(0,h.jsx)("td",{className:"jsx-".concat(r.__hash)+" settings-view",children:(0,h.jsxs)("div",{className:"jsx-".concat(r.__hash)+" settings-view--content",children:[i[p],(0,h.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings-view--logo",children:(0,h.jsx)(x.a,{icon:"".concat(v.Z.merchant.name,"-logo")})})]})})]})})]})]}):(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(n(),{id:r.__hash,children:r}),(0,h.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings",children:(0,h.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__loader",children:(0,h.jsx)(o.Z,{})})})]})}},51633:function(e,t,i){i.d(t,{Z:function(){return v}});var a=i(21378),n=i.n(a),s=i(67294),r=[".d-flex.jsx-437419458,.ui-view-layout__view.jsx-437419458,.ui-view-layout__header.jsx-437419458,.ui-view-layout__actions.jsx-437419458,.ui-view-layout.jsx-437419458,.back-btn.jsx-437419458{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".back-btn.jsx-437419458{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;height:var(--s-element);}",".ui-view-layout.jsx-437419458{position:relative;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;min-height:100%;}",".ui-view-layout.start.jsx-437419458>*.back-btn.jsx-437419458{display:none;}",".ui-view-layout__actions.jsx-437419458{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;gap:var(--s-9);}",".ui-view-layout__view.jsx-437419458{height:100%;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-4);}",".ui-view-layout__view.jsx-437419458,.ui-view-layout__actions.jsx-437419458{width:100%;}",".ui-view-layout__header.jsx-437419458{width:var(--s-4-width);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:0 var(--s-4) var(--s-9);}","@media (max-width:1100px){.ui-view-layout__header.jsx-437419458{width:var(--s-9-width);padding:0 var(--s-9) var(--s-9);}}",".ui-view-layout__header-title.jsx-437419458{font-size:var(--s-1);--ui-icon-color:var(--primary-50);color:var(--primary-50);text-transform:capitalize;}",".current.jsx-437419458{position:absolute;top:calc(var(--s-4) * 0.5);color:var(--gray-30-o);right:var(--s-9);height:var(--s-6);line-height:1;}"];r.__hash="437419458";var o=i(85153),c=i(27812),l=function(e,t){var i=(0,s.useState)([]),a=i[0],n=i[1],r=(0,s.useState)(),o=r[0],l=r[1],d=function(t){var i=String(t);e&&e[i]&&(l(e[i]),n(function(e){return[].concat((0,c.Z)(e),[i])}))};return(0,s.useEffect)(function(){t&&null!=e&&e[t]&&a[a.length-1]!==t&&d(t)},[e,t]),{view:o,setView:d,last:a[a.length-1],goBack:function(){n(function(t){if(t.length>1){var i=t.slice(0,-1);return l(e[i[i.length-1]]),i}return t})}}},d=i(10577),x=i(85893),v=function(e){var t=e.views,i=e.currentView,a=(e.onChange,e.title),c=(e.actions,e.showTitle),v=e.backBtn;(0,s.useEffect)(function(){},[i]);var u=l(t,i),h=u.view,m=(u.setView,u.goBack),f=u.last;return t&&h&&"loading"!=i?(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(n(),{id:r.__hash,children:r}),(0,x.jsxs)("div",{className:"jsx-".concat(r.__hash)+" ui-view-layout",children:[!!(void 0!==v&&v&&"start"!==f)&&(0,x.jsx)("div",{className:"jsx-".concat(r.__hash)+" back-btn",children:(0,x.jsx)("div",{className:"jsx-".concat(r.__hash),children:(0,x.jsx)(d.Z,{traits:{beforeIcon:"fa-chevron-left"},variant:"flat",onClick:m,children:"Back"})})}),void 0!==c&&c&&"start"!==f&&(0,x.jsx)("div",{className:"jsx-".concat(r.__hash)+" ui-view-layout__header",children:(0,x.jsx)("div",{className:"jsx-".concat(r.__hash)+" ui-view-layout__header-title",children:a})}),(0,x.jsx)("div",{"data-view":i,className:"jsx-".concat(r.__hash)+" ui-view-layout__view",children:h||(0,x.jsx)("div",{className:"jsx-".concat(r.__hash),children:"View not found"})})]})]}):(0,x.jsx)(o.Z,{})}}}]);