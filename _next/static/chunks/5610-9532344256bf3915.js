"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5610],{21996:function(e,t,r){r.d(t,{Z:function(){return _}});var a=r(59499),s=r(50029),n=r(21378),i=r.n(n),o=r(64687),c=r.n(o),u=r(67294),l=[".d-flex.jsx-3589974209,.contact-form.jsx-3589974209{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".contact-form.jsx-3589974209{width:100%;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".contact-form__title.jsx-3589974209{font-size:var(--s-1);color:var(--gray-40);margin:var(--s-padding) 0;text-transform:capitalize;}",".contact-form--action.jsx-3589974209{--ui-icon-color:var(--gray-20);}",".contact-form__payment-form.jsx-3589974209{width:100%;}"];l.__hash="3589974209";var d=r(75839),p=r(47265),v=r(11907),x=r(98014);function m(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=new Date;if(e){var r=t.getHours().toString().padStart(2,"0"),a=t.getMinutes().toString().padStart(2,"0");return"".concat(r,":").concat(a)}var s=["January","February","March","April","May","June","July","August","September","October","November","December"][t.getMonth()],n=t.getFullYear().toString().substr(-2);return"".concat(s,"-").concat(n)}var h=r(85893);function f(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function b(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?f(Object(r),!0).forEach(function(t){(0,a.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):f(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var _=function(e){var t,r,a,n=e.onSubmit,o=e.user,f=e.submit,_=e.title,y=void 0===_?"contact":_,j=[{name:"firstName",label:"First Name",width:"50%",type:"text",placeholder:"First Name",required:!0,value:"Test"},{name:"lastName",label:"Last Name",width:"50%",type:"text",placeholder:"Last Name",required:!0,value:"".concat(m()," ").concat(m(!0))},{name:"email",label:"Email",type:"email",placeholder:"your@email.com",required:!0,value:"larzrandana@gmail.com"},{name:"phone",label:"Phone",type:"tel",placeholder:"1 (555) 555-5555",required:!0,value:"4344343433"},{name:"address",label:"Address",type:"text",placeholder:"Your Address",required:!0}],g=(0,v.a)(),w=(0,u.useState)(j),k=w[0],O=w[1],N=(0,u.useState)(),z=N[0],S=N[1],P=(0,u.useState)(!0),Z=P[0],D=P[1],E=(t=(0,s.Z)(c().mark(function e(t){var r,a;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(Array.isArray(t)){e.next=2;break}return e.abrupt("return");case 2:return(a=(null===(r=t.map(function(e){var t,r=z&&(null===(t=(0,x.P)(z,e.name))||void 0===t?void 0:t.value),a=(null==e?void 0:e.value)===r,s=!["",void 0,null,{}].includes(e.value);return!!(a&&s)}).filter(function(e){return!1===e}))||void 0===r?void 0:r.length)===0)!==Z&&D(a),e.abrupt("return");case 6:case"end":return e.stop()}},e)})),function(e){return t.apply(this,arguments)}),C=(r=(0,s.Z)(c().mark(function e(){var t,r;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:t=o||g,console.log({user:o,loggedInUser:g}),t&&(r=k.map(function(e){switch(console.log("fName: ",e),e.name){case"firstName":return b(b({},e),{},{value:t.name?t.name.split(" ")[0]:e.value,width:"50%"});case"lastName":return b(b({},e),{},{value:t.name?t.name.split(" ")[1]:e.value,width:"50%"});case"email":return b(b({},e),{},{value:t.email||e.value});case"phone":return b(b({},e),{},{value:t.phone?(0,p.wW)(t.phone,"US",!0):e.value});case"address":return b(b({},e),{},{value:t.address||e.value});default:return e}}),k||O(r),z||S(r));case 3:case"end":return e.stop()}},e)})),function(){return r.apply(this,arguments)}),F=(a=(0,s.Z)(c().mark(function e(){return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:C().then(function(e){return E(e)});case 1:case"end":return e.stop()}},e)})),function(){return a.apply(this,arguments)});return(0,u.useEffect)(function(){F()},[F,C]),(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(i(),{id:l.__hash,children:l}),(0,h.jsxs)("div",{className:"jsx-".concat(l.__hash)+" contact-form",children:[y&&(0,h.jsx)("div",{className:"jsx-".concat(l.__hash)+" contact-form__title",children:y}),(0,h.jsx)(d.Z,{fields:k,disabled:Z,onChange:function(e){var t=e.target,r=t.name,a=t.value,s=k.map(function(e,t){return e.name===r&&(e.value=a),e});O(s),E(s)},onSubmit:function(e){e.preventDefault;var t=k.reduce(function(e,t){var r=t.name;return["firstName","lastName"].includes(r),e[r]=t.value,e},{});t.name="".concat(t.firstName," ").concat(t.lastName),delete t.firstName,delete t.lastName,n(t)},submitText:null==f?void 0:f.text})]})]})}},5610:function(e,t,r){r.r(t),r.d(t,{default:function(){return Z}});var a=r(59499),s=r(50029),n=r(21378),i=r.n(n),o=r(64687),c=r.n(o),u=r(67294),l=[".selected-button.jsx-1663011084{background-color:var(--gray-10);padding-left:var(--s-9);color:var(--primary);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;border-radius:var(--border-radius);}",".selected-button.jsx-1663011084:hover{background-color:var(--gray-30);}",".d-flex.jsx-1663011084,.product-survey-btn-view.jsx-1663011084 .button-text.jsx-1663011084,.product-survey-btn-view.jsx-1663011084,.product-survey.jsx-1663011084 .product-description__choice__name--icon.jsx-1663011084,.product-survey.jsx-1663011084 .product-description__choice__name.jsx-1663011084,.product-survey.jsx-1663011084 .product-description__choice.jsx-1663011084,.product-survey__selected.jsx-1663011084 .product-survey__tools.jsx-1663011084,.product-survey__selected--content.jsx-1663011084,.product-survey__title.jsx-1663011084,.product-survey.jsx-1663011084,.product-survey__success--status.jsx-1663011084,.product-survey__invalid--status.jsx-1663011084,.product-survey__success.jsx-1663011084,.product-survey__invalid.jsx-1663011084,.back-btn.jsx-1663011084{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".back-btn.jsx-1663011084{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;}",".product-survey__success.jsx-1663011084{color:var(--green-60);--ui-icon-color:var(--green-60);}",".product-survey__invalid.jsx-1663011084{color:var(--orange);--ui-icon-color:var(--orange);}",".product-survey__success.jsx-1663011084,.product-survey__invalid.jsx-1663011084{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;margin:var(--s-element) 0;width:100%;-webkit-flex:1;-ms-flex:1;flex:1;gap:var(--s-element);}",".product-survey__success--email.jsx-1663011084,.product-survey__invalid--email.jsx-1663011084{font-size:var(--s-4);color:var(--primary);font-weight:600;}",".product-survey__success--status.jsx-1663011084,.product-survey__invalid--status.jsx-1663011084{background-color:var(--gray-30-o);gap:var(--s-9);text-transform:capitalize;font-size:var(--s-element);--ui-icon-size:var(--s-1);line-height:1;width:-webkit-max-content;width:-moz-max-content;width:max-content;border:solid var(--s-9);border-radius:var(--border-radius);padding:var(--s-9) var(--s-6);}",".product-survey__success--message.jsx-1663011084,.product-survey__invalid--message.jsx-1663011084{font-size:var(--s-5);}",".product-survey__success--action.jsx-1663011084,.product-survey__invalid--action.jsx-1663011084{margin-top:auto;width:50%;}","@media (max-width:900px){.product-survey__success--action.jsx-1663011084,.product-survey__invalid--action.jsx-1663011084{width:100%;}}",".product-survey.jsx-1663011084{width:var(--s-padding-width);padding:var(--s-padding);background-color:var(--gray-90);position:relative;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;border-radius:var(--border-radius);gap:var(--s-padding);color:var(--gray-30);overflow:hidden;}","@media (max-width:900px){.product-survey.jsx-1663011084{width:var(--s-9-width);}}","@media (min-width:1100px){.product-survey.jsx-1663011084{margin:0;}}","@media (max-width:900px){.product-survey.jsx-1663011084{margin:0;}}",".product-survey.jsx-1663011084 #product-survey__options.jsx-1663011084{width:100%;}",".product-survey__select-title.jsx-1663011084{width:100%;text-transform:capitalize;font-size:var(--s-4);color:var(--gray-50);}",".product-survey__title.jsx-1663011084{line-height:1.5;color:var(--gray-40);font-size:var(--s-1);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;}",".product-survey__instructions.jsx-1663011084{font-size:var(--s-4);color:var(--orange-o);width:100%;text-align:center;}",".product-survey__submit.jsx-1663011084{width:100%;margin:var(--s-element) 0 var(--s-padding);}",".product-survey__selected.jsx-1663011084{width:var(--s-9-width);background-color:var(--gray-70);position:relative;font-size:var(--s-6);border-radius:var(--border-radius);padding:var(--s-element) var(--s-padding);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;min-height:70px;gap:var(--s-9);color:var(--gray-50);z-index:5;opacity:0.9;}",".product-survey__selected--header.jsx-1663011084{position:absolute;text-transform:capitalize;left:var(--s-8);top:var(--s-9);}","@media (max-width:900px){.product-survey__selected--header.jsx-1663011084{top:var(--s-padding);color:var(--gray-10);font-size:var(--s-7);left:0;padding:var(--s-9);}}","@-webkit-keyframes slideUp-jsx-1663011084{0%{opacity:0.9;bottom:0;}100%{opacity:1;bottom:65px;}}","@keyframes slideUp-jsx-1663011084{0%{opacity:0.9;bottom:0;}100%{opacity:1;bottom:65px;}}",".product-survey__selected--content.jsx-1663011084{height:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:var(--s-padding);gap:var(--s-9);width:100%;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;}","@media (max-width:1100px){.product-survey__selected--content.jsx-1663011084{background-color:var(--gray-50);border-radius:var(--border-radius);}}",".product-survey__selected.jsx-1663011084 .product-survey__tools.jsx-1663011084{position:absolute;right:var(--s-5);top:var(--s-9);color:inerit;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;}","@media (max-width:900px){.product-survey__selected.jsx-1663011084 .product-survey__tools.jsx-1663011084{color:var(--gray-70);width:auto;font-size:var(--s-8);}}",".product-survey__selected.jsx-1663011084 .product-survey__tools--tool.jsx-1663011084{cursor:pointer;}",".product-survey__selected.jsx-1663011084 .product-survey__tools--tool.jsx-1663011084:hover{-webkit-filter:brightness(1.5);filter:brightness(1.5);}",".product-survey__sub-title.jsx-1663011084{width:100%;font-size:var(--s-4);color:var(--gray-30-o);text-transform:capitalize;line-height:1;}",".product-survey.jsx-1663011084 .product-description__choice.jsx-1663011084{color:var(--gray-40);min-height:var(--s-element);width:auto;cursor:pointer;border:solid 1px transparent;border-radius:var(--border-radius);--ui-icon-color:var(--white);border:solid 1px var(--gray-50);background-color:var(--gray-80);position:relative;overflow:hidden;}","@media (max-width:900px){.product-survey.jsx-1663011084 .product-description__choice.jsx-1663011084{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:var(--s-9);-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}}",".product-survey.jsx-1663011084 .product-description__choice.jsx-1663011084:hover{color:var(--gray-10);border:solid 1px var(--gray-20);background-color:var(--gray-70);}",".product-survey.jsx-1663011084 .product-description__choice--selected.jsx-1663011084{text-indent:unset;width:-webkit-max-content;width:-moz-max-content;width:max-content;background-color:none;-webkit-box-pack:space-around;-webkit-justify-content:space-around;-ms-flex-pack:space-around;justify-content:space-around;}",".product-survey.jsx-1663011084 .product-description__choice--selected.jsx-1663011084:hover{color:var(--white);background-color:var(--primary);}",".product-survey.jsx-1663011084 .product-description__choice--choice.jsx-1663011084{background-color:var(--primary-o);border:solid 1px var(--primary-lite);}",".product-survey.jsx-1663011084 .product-description__choice--choice.jsx-1663011084:hover{color:var(--white);background-color:var(--primary);}",".product-survey.jsx-1663011084 .product-description__choice__name.jsx-1663011084{text-align:center;text-transform:capitalize;width:100%;}","@media (max-width:900px){.product-survey.jsx-1663011084 .product-description__choice__name.jsx-1663011084{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;font-size:var(--s-7);text-align:unset;}}",".product-survey.jsx-1663011084 .product-description__choice__name--icon.jsx-1663011084{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;background-color:var(--green-o);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);color:var(--white);text-shadow:1px 1px var(--black);z-index:3;font-size:var(--s-3);--ui-icon-height:var(--s-9);--ui-icon-width:var(--s-9);position:absolute;top:0;right:0;height:100%;box-shadow:1px 1px var(--gray-100);width:var(--s-element);}",'.product-survey.jsx-1663011084 .product-description__choice__name--icon.jsx-1663011084::after{content:"amps";font-size:var(--s-9);text-transform:uppercase;}',".product-survey__action.jsx-1663011084{width:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}",".product-survey__action.jsx-1663011084 div.jsx-1663011084{width:-webkit-max-content;width:-moz-max-content;width:max-content;}",'.product-survey-btn-view.jsx-1663011084{height:-webkit-max-content;height:-moz-max-content;height:max-content;text-align:center;padding:var(--s-1) 0;background-color:transparent;cursor:pointer;-webkit-filter:blur(2px) brightness(0.77);filter:blur(2px) brightness(0.77);font-weight:900;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:Orbitron;text-align:center;text-transform:uppercase;line-height:1.6;-webkit-letter-spacing:1vw;-moz-letter-spacing:1vw;-ms-letter-spacing:1vw;letter-spacing:1vw;font-size:9vw;background-image:url("/merchant/nirv1/backgrounds/redrock-wall.jpeg");background-position:bottom;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:var(--primary-o);text-align:center;height:-webkit-max-content;height:-moz-max-content;height:max-content;background-position:bottom;-webkit-text-fill-color:var(--primary-o);width:var(--s-padding-width);margin:0 auto;aspect-ratio:20/9;}',".product-survey-btn-view.jsx-1663011084:hover{-webkit-animation-play-state:running;animation-play-state:running;-webkit-animation:hover-jsx-1663011084 1s forwards ease-in-out;animation:hover-jsx-1663011084 1s forwards ease-in-out;}","@-webkit-keyframes hover-jsx-1663011084{0%{background-position:bottom;-webkit-text-fill-color:var(--primary-o);opacity:0.7;}100%{background-position:top;opacity:1;-webkit-filter:blur(0) brightness(1.2);filter:blur(0) brightness(1.2);position:relative;}}","@keyframes hover-jsx-1663011084{0%{background-position:bottom;-webkit-text-fill-color:var(--primary-o);opacity:0.7;}100%{background-position:top;opacity:1;-webkit-filter:blur(0) brightness(1.2);filter:blur(0) brightness(1.2);position:relative;}}","@media (max-width:1100px){.product-survey-btn-view.jsx-1663011084{font-size:calc(12vw - var(--s-padding));}}","@media (max-width:900px){.product-survey-btn-view.jsx-1663011084{font-size:calc(10vw - var(--s-padding));}}","@media (min-width:1500px){.product-survey-btn-view.jsx-1663011084{font-size:calc(6.5vw - var(--s-padding));}}",".product-survey-btn-view__cancel.jsx-1663011084{width:100%;margin-top:var(--s-element);}",".product-survey-btn-view.jsx-1663011084 .product-survey__title.jsx-1663011084{display:none;}","@media (max-width:900px){.mobile-selected.jsx-1663011084{border-style:solid;border-width:1px;bottom:0;z-index:4;padding:var(--s-9);background-color:var(--gray-90);}}"];l.__hash="1663011084";var d=r(85854),p=r(10577),v=r(55140),x=r(58976),m=r(10394),h=[];h.__hash="2085888330";var f=r(75839),b=r(39925),_=r(85893),y=function(e){var t=e.onSubmit,r=e.title,a=[{name:"name",label:"Custom ".concat((0,b.Z)(r)," Name"),placeholder:"add your custom ".concat(r),required:!0,error:void 0},{name:"value",type:"pill",value:0,label:"Estimated Amps",required:!0,placeholder:0,error:void 0}],s=(0,u.useState)(a),n=s[0],o=s[1],c=(0,u.useState)(!0),l=c[0],d=c[1];return(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(i(),{id:h.__hash,children:h}),(0,_.jsx)(f.Z,{title:r,fields:n,onChange:function(e){var t=e.target,r=t.name,a=t.value,s=n.map(function(e){return e.name==r&&("value"==e.name&&String(e.value).length>=3?e.error="too long":e.error&&delete e.error,e.value=a),e});d(!!s.find(function(e){return void 0==e.value||0==e.value})),o(s)},onSubmit:function(){var e,r;t({name:null===(e=n.find(function(e){return"name"==e.name}))||void 0===e?void 0:e.value,value:null===(r=n.find(function(e){return"value"==e.name}))||void 0===r?void 0:r.value,selected:!0})},disabled:l})]})},j=r(36946),g=r(49334),w=r(37164),k=r(21996),O=r(11907),N=r(51633);function z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function S(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?z(Object(r),!0).forEach(function(t){(0,a.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):z(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var P=[{name:"refrigerator",selected:!1,value:6},{name:"freezer",selected:!1,value:6},{name:"tv",selected:!1,value:2},{name:"dishwasher",selected:!1,value:15},{name:"space heater",selected:!1,value:15},{name:"microwave",selected:!1,value:10},{name:"washing machine",selected:!1,value:10},{name:"dryer",selected:!1,value:30},{name:"oven",selected:!1,value:20},{name:"air conditioner",selected:!1,value:15},{name:"vacuum cleaner",selected:!1,value:11},{name:"toaster",selected:!1,value:9},{name:"blender",selected:!1,value:6},{name:"coffee maker",selected:!1,value:10},{name:"electric kettle",selected:!1,value:13},{name:"hair dryer",selected:!1,value:13},{name:"iron",selected:!1,value:10},{name:"fan",selected:!1,value:3},{name:"stove top",selected:!1,value:15},{name:"air fryer",selected:!1,value:15},{name:"other",selected:!1,value:10}],Z=function(e){var t,r,a=e.survey,n=void 0===a?P:a,o=e.startButton,h=e.title,f=void 0===h?"":h,b=e.id;e.subtitle;var z=(0,O.a)(),Z=(0,u.useRef)(),D=(0,u.useRef)(),E=(0,x.Z)(),C={survey:n},F=(0,j.dd)(),A=F.openModal,U=F.closeModal;F.replaceModal;var I=(0,u.useState)({survey:n}),M=I[0],T=I[1],q=(0,u.useState)(null),R=q[0],L=q[1],J=(0,u.useState)(null),V=J[0],Y=J[1],B=(0,u.useState)(!1);B[0],B[1],(0,m.ko)("IProspectService");var Q=(0,m.ko)("IMemberService"),H=M.survey,W=(0,u.useState)("start"),G=W[0],K=W[1],X=function e(t){var r,a=(r=(0,s.Z)(c().mark(function t(r){return c().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e(r));case 1:case"end":return t.stop()}},t)})),function(e){return r.apply(this,arguments)}),i=!n.find(function(e){return e.name===t.name});if("other"===t.name&&!i)return A((0,_.jsx)(y,{title:f,choice:t,onSubmit:function(e){a(e).then(U)}}));if(i){H.push(t),T(S(S({},M),{},{survey:H})),K("content");return}var o=H.map(function(e){return e.name===t.name?S(S({},e),{},{selected:!e.selected}):e});T(S(S({},M),{},{survey:o}))},$=M.survey.filter(function(e){return e.selected}),ee=(t=(0,s.Z)(c().mark(function e(t){return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:L(t),er("loading"),et(t);case 3:case"end":return e.stop()}},e)})),function(e){return t.apply(this,arguments)}),et=(r=(0,s.Z)(c().mark(function e(t){var r,a,s;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t||R){e.next=5;break}return console.error("No contact data available."),er("invalid"),e.abrupt("return");case 5:return a=S(S({},r),{},{metadata:{user:{user_agent:E,email:r.email},merchant:w.Z.merchant,survey:{id:b,data:M.survey.reduce(function(e,t){return t.selected&&(e[(0,g.Z)(t.name,!0)]=t.value),e},{}),created:new Date().getTime()}}}),e.prev=6,e.next=9,Q.signUp(a);case 9:console.log("[ PRODUCT SURVEY ( response ) ]",s=e.sent),null!=s&&s.email?(er("success"),Y(s.email)):null!=s&&s.status&&(er(s.status),Y(s.message)),e.next=18;break;case 14:e.prev=14,e.t0=e.catch(6),console.error("Submission failed: ",e.t0),er("error");case 18:case"end":return e.stop()}},e,null,[[6,14]])})),function(e){return r.apply(this,arguments)}),er=function(e){K(e)},ea={error:(0,_.jsx)(_.Fragment,{children:"error: (c-pff)"}),success:(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(i(),{id:l.__hash,children:l}),(0,_.jsxs)("div",{className:"jsx-".concat(l.__hash)+" product-survey__success",children:[(0,_.jsxs)("div",{className:"jsx-".concat(l.__hash)+" product-survey__success--status",children:["Success",(0,_.jsx)(v.a,{icon:"fa-circle-check"})]}),(0,_.jsxs)("div",{className:"jsx-".concat(l.__hash),children:["A verification email to",(0,_.jsxs)("span",{className:"jsx-".concat(l.__hash)+" product-survey__success--email",children:[" ",V,", "]}),"has been sent."]}),(0,_.jsx)("div",{className:"jsx-".concat(l.__hash),children:"To complete the process, simply click on the link in the email."})]})]}),invalid:(0,_.jsxs)("div",{className:"product-survey__invalid",children:[(0,_.jsxs)("div",{className:"product-survey__invalid--status",children:["Invalid",(0,_.jsx)(v.a,{icon:"fa-exclamation-triangle"})]}),(0,_.jsx)("div",{className:"product-survey__invalid--message",children:V||""}),(0,_.jsx)(p.Z,{onClick:function(){return er("contact")},children:"return to contact form"})]}),contact:(0,_.jsx)(k.Z,{title:!1,user:z,onSubmit:ee}),start:(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(i(),{id:l.__hash,children:l}),(0,_.jsx)("div",{onClick:function(){return er("form")},className:"jsx-".concat(l.__hash)+" product-survey-btn-view",children:(0,_.jsx)("div",{className:"jsx-".concat(l.__hash)+" button-text",children:o})})]}),form:(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(i(),{id:l.__hash,children:l}),(0,_.jsxs)("div",{ref:Z,className:"jsx-".concat(l.__hash)+" product-survey__selected",children:[(0,_.jsxs)("div",{className:"jsx-".concat(l.__hash)+" product-survey__selected--header",children:["Selected ".concat("Appliances to Power")," | total amps  ",H.reduce(function(e,t){return t.selected?e+t.value:e},0)]}),(0,_.jsx)("div",{className:"jsx-".concat(l.__hash)+" product-survey__tools",children:(0,_.jsx)("div",{className:"jsx-".concat(l.__hash)+" product-survey__tools--tool",children:!!(null==$?void 0:$.length)&&(0,_.jsx)("div",{onClick:function(){return T(C)},className:"jsx-".concat(l.__hash),children:"clear all"})})}),H&&!!(null==$?void 0:$.length)&&(0,_.jsx)("div",{className:"jsx-".concat(l.__hash)+" product-survey__selected--content",children:Object.values(H).map(function(e,t){if(null!=e&&e.selected)return(0,_.jsx)("div",{className:"jsx-".concat(l.__hash)+" selected-button",children:(0,_.jsxs)(p.Z,{variant:"flat",size:"sm",traits:{afterIcon:{icon:"fa-xmark",onClick:function(){return X(e)}}},onClick:function(){return X(e)},children:[e.name," - ",null==e?void 0:e.value]})},t)})}),!$.length&&(0,_.jsxs)("div",{className:"jsx-".concat(l.__hash)+" product-survey__instructions",children:["please Select, ",f," to continue."]})]}),(0,_.jsx)("div",{id:"product-survey__options",className:"jsx-".concat(l.__hash)}),(0,_.jsx)("div",{id:"product-survey__options",className:"jsx-".concat(l.__hash),children:(0,_.jsx)(d.Z,{xs:3,sm:4,lg:4,gap:10,children:null!==H&&H.map(function(e,t){return(0,_.jsx)("div",{onClick:function(){return X(e)},className:"jsx-".concat(l.__hash)+" "+"product-description__choice ".concat(null!=e&&e.selected?"product-description__choice--choice":""),children:(0,_.jsxs)("div",{className:"jsx-".concat(l.__hash)+" product-description__choice__name",children:[null==e?void 0:e.name," ",(null==e?void 0:e.selected)&&(0,_.jsx)("div",{className:"jsx-".concat(l.__hash)+" product-description__choice__name--icon ",children:null==e?void 0:e.value})]})},t)})})}),(0,_.jsx)("div",{className:"jsx-".concat(l.__hash)+" product-survey__submit",children:(0,_.jsx)(p.Z,{disabled:0==$.length,onClick:function(){return er("contact")},variant:!!$.length&&"glow"||"disabled",children:"Proceed to Quote"})})]})};return b?(0,_.jsxs)(_.Fragment,{children:[(0,_.jsx)(i(),{id:l.__hash,children:l}),(0,_.jsx)("div",{ref:D,className:"jsx-".concat(l.__hash)+" product-survey card",children:(0,_.jsx)(N.Z,{backBtn:!0,showTitle:"start"!==G,title:G,onViewChange:er,currentView:G,views:ea})})]}):(0,_.jsx)(_.Fragment,{children:"No ID FOR PRODUCT REQUEST"})}},58976:function(e,t,r){var a=r(59499),s=r(50029),n=r(64687),i=r.n(n),o=r(67294);function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,a)}return r}function u(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach(function(t){(0,a.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}t.Z=function(){var e=(0,o.useState)({user_agent:"",user_agent_data:null,public_ip:""}),t=e[0],r=e[1];return(0,o.useEffect)(function(){var e,t=(e=(0,s.Z)(i().mark(function e(){var t,a,s;return i().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r({user_agent:window.navigator.userAgent,user_agent_data:"userAgentData"in(t=navigator)?t.userAgentData:null}),e.prev=4,e.next=7,fetch("https://ipapi.co/json/");case 7:if(!(a=e.sent).ok){e.next=16;break}return e.next=11,a.json();case 11:s=e.sent.ip,r(function(e){return u(u({},e),{},{public_ip:s})}),e.next=17;break;case 16:console.error("Failed to fetch IP address information.");case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(4),console.error("Error fetching IP address information:",e.t0);case 22:case"end":return e.stop()}},e,null,[[4,19]])})),function(){return e.apply(this,arguments)});return t(),window.addEventListener("load",t),function(){window.removeEventListener("load",t)}},[]),t}}}]);