"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3558],{99073:function(t,e,s){s.d(e,{Z:function(){return x}});var a=s(21378),i=s.n(a),n=s(67294),r=[".d-flex.jsx-3157623724,.bar.jsx-3157623724 .bar__container.jsx-3157623724 .bar__bars-container.jsx-3157623724 .bar__percentage.jsx-3157623724,.bar.jsx-3157623724 .bar__container.jsx-3157623724 .bars__icon.jsx-3157623724,.bar.jsx-3157623724 .bar__container.jsx-3157623724 .bar__header.jsx-3157623724{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".bar.jsx-3157623724{width:100%;}",".bar__primary.jsx-3157623724{background-color:var(--primary-o);}",".bar.jsx-3157623724 .bar__container.jsx-3157623724:hover .bar__bars-container.jsx-3157623724 .bar__percentage.jsx-3157623724{color:var(--white);text-shadow:#f30 1px 0 10px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;visibility:visible;}",".bar.jsx-3157623724 .bar__container.jsx-3157623724 .bar__header.jsx-3157623724{overflow:hidden;min-height:var(--s-element);white-space:nowrap;position:relative;line-height:1;}",".bar.jsx-3157623724 .bar__container.jsx-3157623724 .bars__icon.jsx-3157623724{height:var(--s-element);padding-top:20px;--ui-icon-color:var(--gray-60);padding:30px 0 20px;}",".bar.jsx-3157623724 .bar__container.jsx-3157623724 .bars__status.jsx-3157623724{position:absolute;right:var(--s-9);top:4px;text-transform:capitalize;font-size:var(--s-7);color:var(--yellow-o);--ui-icon-width:var(--s-6);}",".bar.jsx-3157623724 .bar__container.jsx-3157623724 .bars__status.jsx-3157623724 .bars__status-low.jsx-3157623724{-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;gap:5px;}",".bar.jsx-3157623724 .bar__container.jsx-3157623724 .bar__bars-container.jsx-3157623724{position:relative;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;gap:var(--border-radius);overflow:hidden;border-radius:var(--border-radius);}",".bar.jsx-3157623724 .bar__container.jsx-3157623724 .bar__bars-container.jsx-3157623724 .bar__percentage.jsx-3157623724{font-size:var(--s-1);visibility:hidden;position:absolute;top:0;bottom:0;width:100%;height:100%;text-align:center;color:var(--gray-20-o);}",".bar__bars-content.jsx-3157623724{box-shadow:inset 0 0 4px 2px var(--gray-100-o);border:solid 1px var(--gray-70);overflow:hidden;border-radius:var(--border-radius);-webkit-transform:rotate(180deg);-ms-transform:rotate(180deg);transform:rotate(180deg);height:var(--s-element);background-color:var(--gray-70-o);}",".bar__bars-content.jsx-3157623724 .bar__bars-bar-partial.jsx-3157623724{border-top:solid 1px var(--gray-70);}",".bar__bars-content.jsx-3157623724 .bar__bars-bar-filled.jsx-3157623724,.bar__bars-content.jsx-3157623724 .bar__bars-bar-partial.jsx-3157623724{height:100%;background-color:var(--bar-background,var(--yellow));}",".bar__timestamp.jsx-3157623724{width:100%;font-size:var(--s-9);padding-bottom:var(--s-9);line-height:1;color:var(--gray-50);white-space:nowrap;text-align:right;}"];r.__hash="3157623724";var o=s(55140),l=s(47265),c=s(49334),d=s(96486),_=s(85893),x=function(t){var e=t.barCount,s=t.percentage,a=t.icon,x=t.status,h=t.timestamp,m=t.header,g=t.onChange,f=(0,n.useState)(s),b=f[0],w=f[1],u=(0,n.useRef)(null),p=(0,n.useRef)((0,d.debounce)(function(t){g&&g(t)},1e3)).current,v=function(t){if(u.current){var e=u.current.getBoundingClientRect(),s=Math.max(0,Math.min(100-(t.clientY-e.top)/e.height*100,100));w(s),p(s.toFixed(0))}};return(0,n.useEffect)(function(){w(s)},[]),(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(i(),{id:r.__hash,children:r}),(0,_.jsxs)("div",{className:"jsx-".concat(r.__hash)+" bar",children:[h&&(0,_.jsx)("div",{className:"jsx-".concat(r.__hash)+" bar__timestamp",children:(0,l.vc)(h,{time:!0})}),(0,_.jsxs)("div",{className:"jsx-".concat(r.__hash)+" bar__container",children:[m&&(0,_.jsxs)("div",{className:"jsx-".concat(r.__hash)+" bar__header",children:[m,a&&(0,_.jsx)("div",{className:"jsx-".concat(r.__hash)+" bars__icon",children:(0,_.jsx)(o.a,{icon:a})}),x&&(0,_.jsx)("div",{className:"jsx-".concat(r.__hash)+" bars__status",children:["STATUS_LOW","low","high"].includes(x)&&(0,_.jsxs)("div",{className:"jsx-".concat(r.__hash)+" bars__status-low",children:[(0,_.jsx)(o.a,{color:"#f90",icon:"fa-exclamation-triangle"}),(0,c.Z)(x)]})})]}),(0,_.jsxs)("div",{ref:u,onMouseDown:function(t){return v(t)},onMouseMove:function(t){return 1===t.buttons&&v(t)},className:"jsx-".concat(r.__hash)+" bar__bars-container",children:[function(){for(var t=[],s={filledBar:"bar__bars-bar-filled",emptyBar:"bar__bars-bar-empty",partialBar:"bar__bars-bar-partial"},a=0;a<e;a++){var n=void 0,o={};a<Math.floor(b*e/100)?n=s.filledBar:a===Math.floor(b*e/100)?(o.height="".concat(b*e%100,"%"),n=s.partialBar):(delete o.height,n=s.emptyBar),t.push((0,_.jsxs)("span",{className:"jsx-".concat(r.__hash),children:[(0,_.jsx)(i(),{id:r.__hash,children:r}),(0,_.jsx)("div",{className:"jsx-".concat(r.__hash)+" bar__bars-content",children:(0,_.jsx)("div",{style:o,className:"jsx-".concat(r.__hash)+" "+"bar__bars-bar ".concat(n)})})]},a))}return t}(),(0,_.jsx)("div",{className:"jsx-".concat(r.__hash)+" bar__percentage",children:(0,_.jsxs)("div",{className:"jsx-".concat(r.__hash),children:[b.toString().split(".")[0],"%"]})})]})]})]})]})}},67996:function(t,e,s){s.d(e,{Z:function(){return f}});var a=s(21378),i=s.n(a),n=s(67294),r=[".d-flex.jsx-2667244450,.settings__view__full.jsx-2667244450 .settings__view--header.jsx-2667244450,.settings__view__full-width.jsx-2667244450 .settings__view--header.jsx-2667244450,.settings__view__content-background.jsx-2667244450,.settings__view__content.jsx-2667244450,.settings__view--header__full.jsx-2667244450,.settings__view.jsx-2667244450,.settings__trigger.jsx-2667244450,.settings__actions--content.jsx-2667244450,.settings__actions.jsx-2667244450,.settings__content.jsx-2667244450{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".settings.jsx-2667244450{height:100%;left:0;position:relative;width:calc(var(--s-padding-width));padding:var(--s-padding);right:auto;height:100%;margin-top:var(--s-padding);}","@media (max-width:1100px){.settings.jsx-2667244450{width:auto;}}","@media (max-width:900px){.settings.jsx-2667244450{padding:var(--s-padding) 0;margin:var(--s-2) auto 0;width:100%;position:absolute;}}",".settings__full.jsx-2667244450{padding:0;margin-top:0;position:fixed;}",".settings__full-width.jsx-2667244450{border-radius:var(--border-radius);}","@media (max-width:1100px){.settings__full-width.jsx-2667244450{margin-top:calc(var(--s-element) * 2);width:auto;}}",".settings__full.jsx-2667244450,.settings__full-width.jsx-2667244450{width:100vw;min-height:100vh;left:0;}",".settings__full.jsx-2667244450:not(.settings__full-width,.settings__full-width-width),.settings__full-width.jsx-2667244450:not(.settings__full-width,.settings__full-width-width){top:0;}",".settings__content.jsx-2667244450{-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;gap:var(--s-9);position:relative;}","@media (max-width:1100px){.settings__content.jsx-2667244450{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding-bottom:150px;}}",".settings__content__full.jsx-2667244450{gap:unset;margin:0;}",".settings__content__full-width.jsx-2667244450{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".settings__actions.jsx-2667244450{z-index:999;top:calc(var(--s-element) * 2);opacity:0;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);}","@-webkit-keyframes hideActions-jsx-2667244450{0%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;}99%{opacity:0;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);}100%{opacity:0;display:none;}}","@keyframes hideActions-jsx-2667244450{0%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;}99%{opacity:0;-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);}100%{opacity:0;display:none;}}","@-webkit-keyframes showActions-jsx-2667244450{0%{display:none;}1%{-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);opacity:0;}100%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;}}","@keyframes showActions-jsx-2667244450{0%{display:none;}1%{-webkit-transform:translateX(-100%);-ms-transform:translateX(-100%);transform:translateX(-100%);opacity:0;}100%{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;}}",".settings__actions--start.jsx-2667244450{display:none;}",".settings__actions--hide.jsx-2667244450{opacity:1;-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);margin-left:0;margin-right:auto;-webkit-animation:hideActions-jsx-2667244450 1s ease-out forwards;animation:hideActions-jsx-2667244450 1s ease-out forwards;}",".settings__actions--show.jsx-2667244450{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-animation:showActions-jsx-2667244450 1s ease-in forwards;animation:showActions-jsx-2667244450 1s ease-in forwards;}","@media (max-width:1100px){.settings__actions--show.jsx-2667244450{-webkit-transform:translateX(0);-ms-transform:translateX(0);transform:translateX(0);opacity:1;border:none;}}",".settings__actions--content.jsx-2667244450{border-radius:var(--border-radius);width:100%;}","@media (min-width:2100px){.settings__actions--content.jsx-2667244450{margin-left:auto;max-width:350px;}}","@media (max-width:1100px){.settings__actions--content.jsx-2667244450{border-radius:var(--border-radius) var(--border-radius) 0 0;border-bottom:solid 0px transparent;}}","@media (min-width:1100px){.settings__actions.jsx-2667244450{min-height:auto;}}","@media (max-width:1100px){.settings__actions.jsx-2667244450{top:calc(var(--s-5) * -1);width:100%;margin:auto;position:absolute;height:-webkit-max-content;height:-moz-max-content;height:max-content;overflow:visible;}}","@media (max-width:900px){.settings__actions.jsx-2667244450{width:auto;margin:auto var(--s-padding);}}",".settings__trigger.jsx-2667244450{z-index:2;width:var(--s-element);background-color:var(--gray-80-o);height:var(--s-element);--ui-icon-width:var(--s-5);top:calc(var(--s-2) * -2);--ui-icon-color:var(--white);overflow:hidden;position:absolute;}","@media (max-width:900px){.settings__trigger.jsx-2667244450{margin-left:var(--s-9);}}",".settings__trigger__show.jsx-2667244450{display:none;}",".settings__trigger__full.jsx-2667244450,.settings__trigger__full-width.jsx-2667244450{left:var(--s-padding);position:fixed;top:calc(var(--s-padding) * 1 + var(--s-element));}","@media (max-width:1100px){.settings__trigger__full.jsx-2667244450,.settings__trigger__full-width.jsx-2667244450{left:unset;top:var(--s-padding);right:calc(var(--s-padding) * 2 + var(--s-element));}}",".settings__view.jsx-2667244450{z-index:1;color:var(--gray-40);height:100%;width:var(--s-padding-width);position:relative;overflow-x:hidden;border-style:solid;border-width:0 1px 1px 1px;border-radius:var(--border-radius);-webkit-animation:viewBorderAnimation-jsx-2667244450 5s infinite alternate;animation:viewBorderAnimation-jsx-2667244450 5s infinite alternate;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}","@-webkit-keyframes viewBorderAnimation-jsx-2667244450{0%,100%{border-color:var(--dark);}25%{border-color:var(--dark-o);}50%{border-color:var(--primary);}75%{border-color:var(--primary-o);}}","@keyframes viewBorderAnimation-jsx-2667244450{0%,100%{border-color:var(--dark);}25%{border-color:var(--dark-o);}50%{border-color:var(--primary);}75%{border-color:var(--primary-o);}}","@media (min-width:1100px){.settings__view.jsx-2667244450{min-height:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;position:unset;border-width:1px;gap:var(--s-padding);background-color:var(--gray-100);padding:var(--s-padding);}}","@media (max-width:1100px){.settings__view.jsx-2667244450{border-radius:var(--border-radius);border:solid 1px transparent;-webkit-animation:unset;animation:unset;margin:auto;width:calc(100% - 2px);height:100%;overflow-y:auto;height:-webkit-max-content;height:-moz-max-content;height:max-content;}}","@media (max-width:900px){.settings__view.jsx-2667244450{width:calc(var(--s-border-width) - var(--s-9) * 2);}}",".settings__view--header.jsx-2667244450{display:none;}",".settings__view--header__full.jsx-2667244450{color:var(--gray-60);width:var(--s-padding-width);padding:var(--s-padding);text-transform:capitalize;position:absolute;top:var(--s-padding);line-height:1;right:calc((var(--s-element) + var(--s-padding)) * 2);width:-webkit-max-content;width:-moz-max-content;width:max-content;padding:0 var(--s-padding);height:var(--s-element);z-index:3;}",".settings__view--header--title.jsx-2667244450{font-size:var(--s-1);color:var(--gray-40);}",".settings__view__content.jsx-2667244450{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;width:100%;min-height:50vh;position:relative;height:100%;}",".settings__view__content-background.jsx-2667244450{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);-ms-transform:translate(-50%,-50%);transform:translate(-50%,-50%);--ui-icon-size:var(--s-padding-width);--ui-icon-color:var(--gray-90-o);width:100%;max-width:550px;z-index:-1;}",".settings__view__full.jsx-2667244450,.settings__view__full-width.jsx-2667244450{width:100%;padding:0;overflow:hidden;border:none;border-radius:unset;background-color:unset;}",".settings__view__full.jsx-2667244450 .settings__view--header.jsx-2667244450,.settings__view__full-width.jsx-2667244450 .settings__view--header.jsx-2667244450{position:absolute;top:0;color:var(--gray-30);text-transform:capitalize;margin-left:var(--s-3);height:var(--s-element);}",".settings__view__full.jsx-2667244450 .settings__view--header--show.jsx-2667244450,.settings__view__full-width.jsx-2667244450 .settings__view--header--show.jsx-2667244450{margin-left:calc(var(--s-element) + var(--s-3));}",".settings__view__full.jsx-2667244450 .settings__view__content.jsx-2667244450,.settings__view__full-width.jsx-2667244450 .settings__view__content.jsx-2667244450{padding:0;height:-webkit-max-content;height:-moz-max-content;height:max-content;background-color:unset;}"];r.__hash="2667244450";var o=s(13190),l=s(85153),c=s(11163),d=s(79785),_=s(49334),x=s(36946),h=s(55140),m=s(37164),g=s(85893),f=function(t){var e=t.views,s=t.setViewCallback,a=t.variant,f=t.title,b=t.defaultView,w=t.showMenu,u=void 0===w||w,p=(0,c.useRouter)(),v=(0,x.dd)(),j=v.openModal,k=v.closeModal,y=v.isModalOpen,X=(0,n.useState)(b),N=X[0],z=X[1],Z=(0,n.useState)("start"),A=Z[0],M=Z[1],B="full-width"===a||"full"===a,C={container:(0,d.Z)({cls:"settings",variant:a}),content:(0,d.Z)({cls:"settings__content",variant:a}),header:(0,d.Z)({cls:"settings__view--header",variant:a}),view:(0,d.Z)({cls:"settings__view",variant:a}),icon:(0,d.Z)({cls:"settings__trigger",variant:a,standalones:["card"]})},S=(0,n.useCallback)(function(t){p.push({pathname:p.pathname,query:{vid:(0,_.Z)(t,!1)}},void 0,{shallow:!1}),null==s||s(t)},[p,s]),E=(0,n.useMemo)(function(){return{title:(0,_.Z)("settings-views"),statements:Object.keys(e).map(function(t){return{label:t,onClick:function(){return S(t)}}})}},[e,S]);(0,n.useEffect)(function(){var t;return(t=document.querySelector("main"))&&("full-width"===a||"full"===a?(t.style.margin="0px",t.style.width="100%"):(t.style.margin="",t.style.width="")),function(){var t=document.querySelector("main");t&&(t.style.margin="",t.style.width="")}},[a,B]);var q=(0,n.useCallback)(function(){M(function(t){return["hide","start"].includes(t)?"show":"hide"}),"full-width"!==a&&"full"!==a||("show"===A&&y?k():y||j({confirm:E}))},[y,k,j,a]);return((0,n.useEffect)(function(){!N&&b&&z(b)},[b,N]),(0,n.useEffect)(function(){var t=p.query.vid||b||Object.keys(e)[0];t&&z(t.toString())},[p.query.vid,b,e]),(0,n.useEffect)(function(){u&&M("show"),!1===u&&M("hide")},[u]),void 0===N)?(0,g.jsx)(l.Z,{}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:r.__hash,children:r}),(0,g.jsx)("div",{id:"settings-container",className:"jsx-".concat(r.__hash)+" "+(C.container||""),children:(0,g.jsxs)("div",{className:"jsx-".concat(r.__hash)+" "+(C.content||""),children:[f&&(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" "+(C.header||""),children:(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__view--header--title",children:f})}),!!("show"!==A||B)&&(0,g.jsx)("div",{id:"settings-trigger",className:"jsx-".concat(r.__hash)+" "+(C.icon||""),children:(0,g.jsx)(h.a,{glow:!0,icon:"fa-ellipsis",onClick:q})}),!B&&(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" "+"settings__actions settings__actions--".concat(A),children:(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__actions--content",children:(0,g.jsx)(o.Z,{options:Object.keys(e).map(function(t){return(0,_.Z)(t,!1)}),variant:"flat",value:N,onSelect:S,onClose:q})})}),(0,g.jsx)("div",{id:"settings-view",className:"jsx-".concat(r.__hash)+" "+(C.view||""),children:(0,g.jsxs)("div",{className:"jsx-".concat(r.__hash)+" settings__view__content",children:[(0,g.jsx)("div",{className:"jsx-".concat(r.__hash)+" settings__view__content-background",children:(0,g.jsx)(h.a,{icon:"".concat(m.Z.merchant.name,"-logo")})}),e[N]]})})]})})]})}}}]);