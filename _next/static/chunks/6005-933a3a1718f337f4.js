"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6005],{42450:function(e,t,r){r.d(t,{Z:function(){return j}});var s=r(59499),n=r(50029),a=r(21378),i=r.n(a),o=r(64687),c=r.n(o),l=r(67294),u=[".d-flex.jsx-1944248964,.contact-form.jsx-1944248964{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".contact-form.jsx-1944248964{width:100%;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".contact-form__title.jsx-1944248964{font-size:var(--s-1);color:var(--gray-40);margin:var(--s-4) 0;text-transform:capitalize;}",".contact-form--action.jsx-1944248964{--ui-icon-color:var(--gray-20);}",".contact-form__payment-form.jsx-1944248964{width:100%;}"];u.__hash="1944248964";var d=r(38903),x=r(47265),v=r(11907),m=r(98014),f=r(85893);function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,s)}return r}function h(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(Object(r),!0).forEach(function(t){(0,s.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var j=function(e){var t,r,s,a,o=e.onSubmit,p=e.user,j=e.submit,_=e.title,b=void 0===_?"contact":_,y=(0,v.aF)(),w=(0,l.useState)([{name:"firstName",label:"First Name",width:"50%",type:"text",placeholder:"First Name",required:!0},{name:"lastName",label:"Last Name",width:"50%",type:"text",placeholder:"Last Name",required:!0},{name:"email",label:"Email",type:"email",placeholder:"your@email.com",required:!0},{name:"phone",label:"Phone",type:"tel",placeholder:"1 (555) 555-5555",required:!0},{name:"address",label:"Address",type:"text",placeholder:"Your Address",required:!0}]),g=w[0],k=w[1],O=(0,l.useState)(),N=O[0],z=O[1],S=(0,l.useState)(!0),P=S[0],Z=S[1],E=(t=(0,n.Z)(c().mark(function e(t){var r,s;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(Array.isArray(t)){e.next=2;break}return e.abrupt("return");case 2:return(s=(null===(r=t.map(function(e){var t,r=N&&e.name&&(null===(t=(0,m.PI)(N,e.name))||void 0===t?void 0:t.value),s=(null==e?void 0:e.value)===r,n=!["",void 0,null,{}].includes(e.value);return!!(s&&n)}).filter(function(e){return!1===e}))||void 0===r?void 0:r.length)===0)!==P&&Z(s),e.abrupt("return");case 6:case"end":return e.stop()}},e)})),function(e){return t.apply(this,arguments)}),D=p||y,C=(r=(0,n.Z)(c().mark(function e(){var t,r;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!D){e.next=5;break}return r=g.map(function(e){switch(e.name){case"firstName":return h(h({},e),{},{value:D.name?D.name.split(" ")[0]:e.value,width:"50%"});case"lastName":return h(h({},e),{},{value:D.name?D.name.split(" ")[1]:e.value,width:"50%"});case"email":return h(h({},e),{},{value:D.email||e.value});case"phone":return h(h({},e),{},{value:D.phone?(0,x.wW)(D.phone,"US",!0):e.value});case"address":return h(h({},e),{},{value:D.address||e.value});default:return e}}),null!==(t=g[0])&&void 0!==t&&t.value||k(r),N||z(r),e.abrupt("return",r);case 5:case"end":return e.stop()}},e)})),function(){return r.apply(this,arguments)}),F=(s=(0,n.Z)(c().mark(function e(){return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:C().then(function(e){return E(e)});case 1:case"end":return e.stop()}},e)})),function(){return s.apply(this,arguments)});return(0,l.useEffect)(function(){var e;null!==(e=g[0])&&void 0!==e&&e.value||F()},[y]),(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(i(),{id:u.__hash,children:u}),(0,f.jsxs)("div",{className:"jsx-".concat(u.__hash)+" contact-form",children:[JSON.stringify((null===(a=g[0])||void 0===a?void 0:a.value)==void 0),b&&(0,f.jsx)("div",{className:"jsx-".concat(u.__hash)+" contact-form__title",children:b}),(0,f.jsx)(d.Z,{fields:g,disabled:P,onChange:function(e){var t=e.target,r=t.name,s=t.value,n=g.map(function(e,t){return e.name===r&&(e.value=s),e});k(n),E(n)},onSubmit:function(e){e.preventDefault;var t=g.reduce(function(e,t){var r=t.name;return["firstName","lastName"].includes(r),e[r]=t.value,e},{});t.name="".concat(t.firstName," ").concat(t.lastName),delete t.firstName,delete t.lastName,o(t)},submitText:null==j?void 0:j.text})]})]})}},6005:function(e,t,r){r.r(t),r.d(t,{default:function(){return A}});var s=r(59499),n=r(50029),a=r(21378),i=r.n(a),o=r(64687),c=r.n(o),l=r(67294),u=[".d-flex.jsx-4219291912,.product-survey-btn-view.jsx-4219291912 .button-text.jsx-4219291912,.product-survey__title.jsx-4219291912,.product-survey.jsx-4219291912,.product-survey__success--status.jsx-4219291912,.product-survey__invalid--status.jsx-4219291912,.product-survey-card.jsx-4219291912,.product-survey-btn-view.jsx-4219291912,.product-survey__contact-form.jsx-4219291912,.product-survey__success.jsx-4219291912,.product-survey__invalid.jsx-4219291912,.back-btn.jsx-4219291912{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".back-btn.jsx-4219291912{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;}",".product-survey-card.jsx-4219291912,.product-survey-btn-view.jsx-4219291912,.product-survey__contact-form.jsx-4219291912,.product-survey__success.jsx-4219291912,.product-survey__invalid.jsx-4219291912{gap:var(--s-4);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:var(--s-4) var(--s-4) var(--s-1);border-radius:var(--border-radius);background-color:var(--gray-90);width:calc(var(--s-4-width) - 2px);min-height:400px;border:solid 1px var(--gray-80);}","@media (max-width:900px){.product-survey-card.jsx-4219291912,.product-survey-btn-view.jsx-4219291912,.product-survey__contact-form.jsx-4219291912,.product-survey__success.jsx-4219291912,.product-survey__invalid.jsx-4219291912{gap:var(--s-9);padding:var(--s-4) var(--s-9) var(--s-1);}}",".product-survey__success--email.jsx-4219291912,.product-survey__invalid--email.jsx-4219291912{font-size:var(--s-4);color:var(--primary-50);font-weight:600;}",".product-survey__success--status.jsx-4219291912,.product-survey__invalid--status.jsx-4219291912{gap:var(--s-9);text-transform:capitalize;font-size:var(--s-element);--ui-icon-size:var(--s-1);line-height:1;width:-webkit-max-content;width:-moz-max-content;width:max-content;border:solid var(--s-9);border-radius:var(--border-radius);padding:var(--s-9) var(--s-6);}","@media (max-width:900px){.product-survey__success--status.jsx-4219291912,.product-survey__invalid--status.jsx-4219291912{gap:var(--s-9);width:var(--s-9-width);padding:var(--s-4) 0 var(--s-1);}}",".product-survey__success--message.jsx-4219291912,.product-survey__invalid--message.jsx-4219291912{font-size:var(--s-5);}",".product-survey__success--action.jsx-4219291912,.product-survey__invalid--action.jsx-4219291912{margin-top:auto;width:50%;}","@media (max-width:900px){.product-survey__success--action.jsx-4219291912,.product-survey__invalid--action.jsx-4219291912{width:100%;}}",".product-survey__invalid.jsx-4219291912{color:var(--orange-50);--ui-icon-color:var(--orange-50);}",".product-survey.jsx-4219291912{-webkit-transition:all 1s ease-out;transition:all 1s ease-out;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;position:relative;width:var(--s-border-width);gap:var(--s-4);color:var(--gray-30);overflow:hidden;}","@media (min-width:1100px){.product-survey.jsx-4219291912{margin:0;}}",".product-survey__description.jsx-4219291912{text-align:center;margin-bottom:var(--s-6);}",".product-survey__description.jsx-4219291912 h2.jsx-4219291912{font-size:var(--s-2);color:var(--gray-50);}",".product-survey__description.jsx-4219291912 p.jsx-4219291912{font-size:var(--s-4);color:var(--gray-40);}",".product-survey__select-title.jsx-4219291912{width:100%;text-transform:capitalize;font-size:var(--s-4);color:var --gray-50;}",".product-survey__title.jsx-4219291912{line-height:1.5;color:var(--gray-40);font-size:var(--s-1);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;}",".product-survey__instructions.jsx-4219291912{font-size:var(--s-4);color:var(--orange-o);width:100%;text-align:center;}",".product-survey__sub-title.jsx-4219291912{width:100%;font-size:var(--s-4);color:var(--gray-30-o);text-transform:capitalize;line-height:1;}",".product-survey__action.jsx-4219291912{width:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}",".product-survey__action.jsx-4219291912 div.jsx-4219291912{width:-webkit-max-content;width:-moz-max-content;width:max-content;}",'.product-survey-btn-view.jsx-4219291912{height:-webkit-max-content;height:-moz-max-content;height:max-content;text-align:center;background-color:transparent;cursor:pointer;-webkit-filter:blur(2px) brightness(0.77);filter:blur(2px) brightness(0.77);font-weight:900;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-family:Orbitron;text-align:center;text-transform:uppercase;line-height:1.6;-webkit-letter-spacing:1vw;-moz-letter-spacing:1vw;-ms-letter-spacing:1vw;letter-spacing:1vw;font-size:9vw;background-image:url("/merchant/nirv1/backgrounds/redrock-wall.jpeg");background-position:bottom;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:var(--primary-o);}',".product-survey-btn-view.jsx-4219291912:hover{-webkit-animation-play-state:running;animation-play-state:running;-webkit-animation:hover-jsx-4219291912 1s forwards ease-in-out;animation:hover-jsx-4219291912 1s forwards ease-in-out;}","@-webkit-keyframes hover-jsx-4219291912{0%{background-position:bottom;-webkit-text-fill-color:var(--primary-o);opacity:0.7;}100%{background-position:top;opacity:1;-webkit-filter:blur(0) brightness(1.2);filter:blur(0) brightness(1.2);position:relative;}}","@keyframes hover-jsx-4219291912{0%{background-position:bottom;-webkit-text-fill-color:var(--primary-o);opacity:0.7;}100%{background-position:top;opacity:1;-webkit-filter:blur(0) brightness(1.2);filter:blur(0) brightness(1.2);position:relative;}}","@media (max-width:1100px){.product-survey-btn-view.jsx-4219291912{font-size:calc(12vw - var(--s-4));}}","@media (max-width:900px){.product-survey-btn-view.jsx-4219291912{line-height:2;font-size:calc(14vw - var(--s-4));}}","@media (min-width:1500px){.product-survey-btn-view.jsx-4219291912{font-size:calc(6.5vw - var(--s-4));}}",".product-survey-btn-view__cancel.jsx-4219291912{width:100%;margin-top:var(--s-element);}",".product-survey-btn-view.jsx-4219291912 .product-survey__title.jsx-4219291912{display:none;}","@media (max-width:900px){.mobile-selected.jsx-4219291912{border-style:solid;border-width:1px;bottom:0;z-index:4;padding:var(--s-9);background-color:var(--gray-90);}}"];u.__hash="4219291912";var d=r(10577),x=r(6253),v=r(48834),m=r(10394),f=r(49334),p=r(23992),h=r(42450),j=r(11907),_=r(51633),b=[".d-flex.jsx-2661351715,.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name--icon.jsx-2661351715,.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name.jsx-2661351715,.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option.jsx-2661351715,.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715,.survey-form__selection--selected.jsx-2661351715,.survey-form.jsx-2661351715 .selection--selected.jsx-2661351715,.survey-form__selection__tools.jsx-2661351715,.survey-form.jsx-2661351715 .selection__tools.jsx-2661351715,.survey-form__selection__header.jsx-2661351715,.survey-form.jsx-2661351715 .selection__header.jsx-2661351715,.survey-form__selection.jsx-2661351715,.survey-form.jsx-2661351715 .selection.jsx-2661351715,.survey-form__instructions.jsx-2661351715,.survey-form.jsx-2661351715{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".survey-form.jsx-2661351715{position:relative;font-size:var(--s-6);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;min-height:70px;gap:var(--s-4);color:var(--gray-50);z-index:5;opacity:0.9;width:var(--s-border-width);-webkit-align-items:stretch;-webkit-box-align:stretch;-ms-flex-align:stretch;align-items:stretch;}","@media (max-width:1100px){.survey-form.jsx-2661351715{gap:var(--s-element);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}}",".survey-form__instructions.jsx-2661351715{width:100%;min-height:var(--s-element);background-color:var(--gray-80);border-radius:var(--border-radius);}","@-webkit-keyframes slideUp-jsx-2661351715{0%{opacity:0.9;bottom:0;}100%{opacity:1;bottom:65px;}}","@keyframes slideUp-jsx-2661351715{0%{opacity:0.9;bottom:0;}100%{opacity:1;bottom:65px;}}",".survey-form__selection.jsx-2661351715,.survey-form.jsx-2661351715 .selection.jsx-2661351715{height:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:var(--s-9) var(--s-4) var(--s-4);width:100%;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;gap:var(--s-9);position:relative;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}","@media (max-width:1100px){.survey-form__selection.jsx-2661351715,.survey-form.jsx-2661351715 .selection.jsx-2661351715{border-radius:var(--border-radius);width:var(--s-9-width);padding:var(--s-9);}}",".survey-form__selection__header.jsx-2661351715,.survey-form.jsx-2661351715 .selection__header.jsx-2661351715{text-transform:capitalize;-webkit-flex-wrap:nowrap;-ms-flex-wrap:nowrap;flex-wrap:nowrap;width:100%;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;}",".survey-form__selection__header--title.jsx-2661351715,.survey-form.jsx-2661351715 .selection__header--title.jsx-2661351715{color:var(--primary-10);font-size:var(--s-4);}","@media (max-width:900px){.survey-form__selection__header.jsx-2661351715,.survey-form.jsx-2661351715 .selection__header.jsx-2661351715{-webkit-flex-direction:column-reverse;-ms-flex-direction:column-reverse;flex-direction:column-reverse;gap:var(--s-9);font-size:var(--s-4);}}",".survey-form__selection__tools.jsx-2661351715,.survey-form.jsx-2661351715 .selection__tools.jsx-2661351715{right:var(--s-5);color:inerit;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;font-size:var(--s-6);}","@media (max-width:900px){.survey-form__selection__tools.jsx-2661351715,.survey-form.jsx-2661351715 .selection__tools.jsx-2661351715{color:var(--gray-70);width:100%;}}",".survey-form__selection__tools--tool.jsx-2661351715,.survey-form.jsx-2661351715 .selection__tools--tool.jsx-2661351715{cursor:pointer;}",".survey-form__selection__tools--tool.jsx-2661351715:hover,.survey-form.jsx-2661351715 .selection__tools--tool.jsx-2661351715:hover{-webkit-filter:brightness(1.5);filter:brightness(1.5);}",".survey-form__selection--selected.jsx-2661351715,.survey-form.jsx-2661351715 .selection--selected.jsx-2661351715{height:100%;gap:var(--s-10);-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;max-height:var(--s-element);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}",".survey-form__selection--selected.jsx-2661351715 .selected-button.jsx-2661351715,.survey-form.jsx-2661351715 .selection--selected.jsx-2661351715 .selected-button.jsx-2661351715{background-color:var(--gray-10);padding-left:var(--s-9);color:var(--primary-50);-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;position:relative;border-radius:var(--border-radius);}",".survey-form__selection--selected.jsx-2661351715 .selected-button.jsx-2661351715:hover,.survey-form.jsx-2661351715 .selection--selected.jsx-2661351715 .selected-button.jsx-2661351715:hover{background-color:var(--gray-30);}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715{border-radius:var(--border-radius);background-color:var(--gray-80-o);box-shadow:inset var(--box-shadow);border:solid 1px var(--gray-80);padding:var(--s-4);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-4);}","@media (min-width:1100px){.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715{width:var(--s-4-width);}}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option.jsx-2661351715{color:var(--gray-40);min-height:var(--s-element);width:auto;cursor:pointer;border:solid 1px transparent;border-radius:var(--border-radius);--ui-icon-color:var(--white);border:solid 1px var(--gray-50);background-color:var(--gray-80);position:relative;overflow:hidden;}","@media (max-width:900px){.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option.jsx-2661351715{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:var(--s-9);-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;min-height:unset;}}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option.jsx-2661351715:hover{color:var(--gray-10);border:solid 1px var(--gray-20);background-color:var(--gray-70);}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option--selected.jsx-2661351715{text-indent:unset;width:100%;background-color:none;-webkit-box-pack:space-around;-webkit-justify-content:space-around;-ms-flex-pack:space-around;justify-content:space-around;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option--selected.jsx-2661351715:hover{color:var(--white);background-color:var(--primary-50);}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option--choice.jsx-2661351715{background-color:var(--primary-o);border:solid 1px var(--primary-10);}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option--choice.jsx-2661351715:hover{color:var(--white);background-color:var(--primary-50);}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name.jsx-2661351715{width:100%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;text-align:center;text-transform:capitalize;}","@media (max-width:900px){.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name.jsx-2661351715{-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}}",".survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name--icon.jsx-2661351715{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;background-color:var(--green-20-o);-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);color:var(--white);text-shadow:1px 1px var(--black);z-index:3;font-size:var(--s-3);--ui-icon-height:var(--s-4);--ui-icon-width:var(--s-4);position:absolute;top:0;right:0;height:100%;box-shadow:1px 1px var(--gray-100);width:var(--s-element);}","@media (max-width:900px){.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name--icon.jsx-2661351715{gap:var(--s-11);font-size:var(--s-6);-webkit-flex-direction:row;-ms-flex-direction:row;flex-direction:row;width:-webkit-max-content;width:-moz-max-content;width:max-content;padding:0 var(--s-9);}}",'.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name--icon.jsx-2661351715::after{content:"amps";font-size:var(--s-7);text-transform:uppercase;}',"@media (max-width:900px){.survey-form.jsx-2661351715 .survey-form__options.jsx-2661351715 .option__name--icon.jsx-2661351715::after{font-size:var(--s-6);}}",".survey-form__submit.jsx-2661351715{width:100%;}"];b.__hash="2661351715";var y=r(85854),w=[];w.__hash="2085888330";var g=r(38903),k=r(39925),O=r(85893),N=function(e){var t=e.onSubmit,r=e.title,s=[{name:"name",label:"Custom ".concat((0,k.Z)(r)," Name"),placeholder:"add your custom ".concat(r),required:!0,error:void 0},{name:"value",type:"pill",value:0,label:"Estimated Amps",required:!0,placeholder:0,error:void 0}],n=(0,l.useState)(s),a=n[0],o=n[1],c=(0,l.useState)(!0),u=c[0],d=c[1];return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(i(),{id:w.__hash,children:w}),(0,O.jsx)(g.Z,{title:r,fields:a,onChange:function(e){var t=e.target,r=t.name,s=t.value,n=a.map(function(e){return e.name==r&&("value"==e.name&&String(e.value).length>=3?e.error="too long":e.error&&delete e.error,e.value=s),e});d(!!n.find(function(e){return void 0==e.value||0==e.value})),o(n)},onSubmit:function(){var e,r;t({name:null===(e=a.find(function(e){return"name"==e.name}))||void 0===e?void 0:e.value,value:null===(r=a.find(function(e){return"value"==e.name}))||void 0===r?void 0:r.value,selected:!0})},disabled:u})]})},z=r(36946);function S(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,s)}return r}function P(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?S(Object(r),!0).forEach(function(t){(0,s.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):S(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var Z=function(e){var t=e.handleView,r=e.title,s=e.survey,a=e.setSurvey,o=(0,l.useRef)(),u=(0,z.dd)(),x=u.openModal,v=u.closeModal;u.replaceModal;var m=(0,l.useState)(s),f=m[0],p=m[1],h=f.filter(function(e){return e.selected}),j=function e(s){var a,i=(a=(0,n.Z)(c().mark(function t(r){return c().wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",e(r));case 1:case"end":return t.stop()}},t)})),function(e){return a.apply(this,arguments)}),o=!f.find(function(e){return e.name===s.name});if("other"===s.name&&!o)return x({children:(0,O.jsx)(N,{title:r,choice:s,onSubmit:function(e){i(e).then(v)}})});if(o){f.push(s),p(P({},f)),t("form");return}p(f.map(function(e){return e.name===s.name?P(P({},e),{},{selected:!e.selected}):e}))};return(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(i(),{id:b.__hash,children:b}),(0,O.jsx)("div",{ref:o,className:"jsx-".concat(b.__hash)+" survey-form",children:(0,O.jsxs)("div",{className:"jsx-".concat(b.__hash)+" survey-form__options",children:[(0,O.jsx)("div",{className:"jsx-".concat(b.__hash)+" survey-form__selection selection",children:f&&!!(null==h?void 0:h.length)&&(0,O.jsx)(O.Fragment,{children:(0,O.jsxs)("div",{className:"jsx-".concat(b.__hash)+" selection__header",children:[(0,O.jsxs)("div",{className:"jsx-".concat(b.__hash)+" selection__header--title",children:["Selected ".concat("Appliances to Power")," | total amps  ",f.reduce(function(e,t){return t.selected?e+t.value:e},0)]}),(0,O.jsx)("div",{className:"jsx-".concat(b.__hash)+" selection__tools",children:(0,O.jsx)("div",{className:"jsx-".concat(b.__hash)+" selection__tools--tool",children:!!(null==h?void 0:h.length)&&(0,O.jsx)("div",{onClick:function(){return p(s)},className:"jsx-".concat(b.__hash),children:"clear all"})})})]})})||(0,O.jsxs)("div",{className:"jsx-".concat(b.__hash)+" survey-form__instructions",children:["please Select, ",r," to continue."]})}),(0,O.jsx)(y.Z,{xs:2,sm:4,lg:3,gap:10,children:null!==f&&f.map(function(e,t){return(0,O.jsx)("div",{onClick:function(){return j(e)},className:"jsx-".concat(b.__hash)+" "+"option ".concat(null!=e&&e.selected?"option--choice":""),children:(0,O.jsxs)("div",{className:"jsx-".concat(b.__hash)+" option__name",children:[null==e?void 0:e.name," ",(null==e?void 0:e.selected)&&(0,O.jsx)("div",{className:"jsx-".concat(b.__hash)+" option__name--icon ",children:null==e?void 0:e.value})]})},t)})}),(0,O.jsx)("div",{className:"jsx-".concat(b.__hash)+" survey-form__submit",children:(0,O.jsx)(d.Z,{disabled:0==h.length,onClick:function(){a(f),t("contact")},variant:!!h.length&&"glow"||"disabled",children:"Proceed to Quote"})})]})})]})},E=r(42700),D=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=t.offsetY,s=void 0===r?200:r,n=t.min,a=t.max,i=null===(e=(0,E.Z)())||void 0===e?void 0:e.width,o=(0,l.useState)(null),c=o[0],u=o[1];return(0,l.useEffect)(function(){if(c){var e=document.getElementById(c);if(e&&!(n&&i<n)&&!(a&&i>a)){var t=e.getBoundingClientRect().top+window.pageYOffset+Number(-1*s);window.scrollTo({top:t,behavior:"smooth"})}}},[c]),{scrollTo:c,setScrollTo:function(e){u(null),setTimeout(function(){u(e)},0)}}};function C(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,s)}return r}function F(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?C(Object(r),!0).forEach(function(t){(0,s.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):C(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var T=[{name:"refrigerator",selected:!1,value:6},{name:"freezer",selected:!1,value:6},{name:"tv",selected:!1,value:2},{name:"dishwasher",selected:!1,value:15},{name:"space heater",selected:!1,value:15},{name:"microwave",selected:!1,value:10},{name:"washing machine",selected:!1,value:10},{name:"dryer",selected:!1,value:30},{name:"oven",selected:!1,value:20},{name:"air conditioner",selected:!1,value:15},{name:"vacuum cleaner",selected:!1,value:11},{name:"toaster",selected:!1,value:9},{name:"blender",selected:!1,value:6},{name:"coffee maker",selected:!1,value:10},{name:"electric kettle",selected:!1,value:13},{name:"hair dryer",selected:!1,value:13},{name:"iron",selected:!1,value:10},{name:"fan",selected:!1,value:3},{name:"stove top",selected:!1,value:15},{name:"air fryer",selected:!1,value:15},{name:"other",selected:!1,value:10}],A=function(e){var t,r,s=e.survey,a=e.startButton,o=e.title,b=e.id;e.subtitle;var y=(0,m.ko)("IMemberService"),w=(0,j.aF)(),g=(0,v.Z)(),k=(0,l.useRef)(),N=(0,l.useState)(null),z=N[0],S=N[1],P=(0,l.useState)("start"),E=P[0],C=P[1],A=(0,l.useState)(null),I=A[0],q=A[1],B=(0,l.useState)(void 0===s?T:s),V=B[0],R=B[1],U=(t=(0,n.Z)(c().mark(function e(t){return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:S(t),Q("loading"),L(t);case 3:case"end":return e.stop()}},e)})),function(e){return t.apply(this,arguments)}),L=(r=(0,n.Z)(c().mark(function e(t){var r,s,n;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t||z){e.next=5;break}return console.error("No contact data available."),Q("invalid"),e.abrupt("return");case 5:return s=F(F({},r),{},{metadata:{user:{user_agent:g,email:r.email},merchant:p.Z.merchant,survey:{id:b,data:V.reduce(function(e,t){return t.selected&&(e[(0,f.Z)(t.name,{dashed:!0})]=t.value),e},{}),created:new Date().getTime()}}}),e.prev=6,e.next=9,y.signUp(s);case 9:null!=(n=e.sent)&&n.email?(Q("success"),q(n.email)):null!=n&&n.status&&(Q(n.status),q(n.message)),e.next=17;break;case 13:e.prev=13,e.t0=e.catch(6),console.error("Submission failed: ",e.t0),Q("error");case 17:case"end":return e.stop()}},e,null,[[6,13]])})),function(e){return r.apply(this,arguments)}),M=D(),Y=(M.scrollTo,M.setScrollTo),Q=function(e){Y(b="product-survey"),C(e)};(0,l.useEffect)(function(){},[Q]);var J={start:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(i(),{id:u.__hash,children:u}),(0,O.jsx)("div",{onClick:function(){return Q("appliances")},className:"jsx-".concat(u.__hash)+" product-survey-btn-view",children:(0,O.jsx)("div",{className:"jsx-".concat(u.__hash)+" button-text",children:a})})]}),contact:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(i(),{id:u.__hash,children:u}),(0,O.jsxs)("div",{className:"jsx-".concat(u.__hash)+" product-survey__contact-form",children:[(0,O.jsxs)("div",{className:"jsx-".concat(u.__hash)+" product-survey__description",children:[(0,O.jsx)("h2",{className:"jsx-".concat(u.__hash),children:"Contact Information"}),(0,O.jsx)("p",{className:"jsx-".concat(u.__hash),children:"Please provide your contact information so we can reach out to you with the quote."})]}),(0,O.jsx)(h.Z,{title:!1,user:w,onSubmit:U})]})]}),appliances:(0,O.jsx)(Z,{title:void 0===o?"Appliances to Power":o,handleView:Q,survey:V,setSurvey:R}),error:(0,O.jsx)("div",{className:"c-error",children:(0,O.jsx)("h1",{children:"An error occurred"})}),success:(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(i(),{id:u.__hash,children:u}),(0,O.jsxs)("div",{className:"jsx-".concat(u.__hash)+" product-survey__success c-success",children:[(0,O.jsxs)("div",{className:"jsx-".concat(u.__hash)+" product-survey__success--status",children:["Success",(0,O.jsx)(x.a,{icon:"fa-circle-check"})]}),(0,O.jsxs)("div",{className:"jsx-".concat(u.__hash),children:["A verification email to",(0,O.jsxs)("span",{className:"jsx-".concat(u.__hash)+" product-survey__success--email",children:[" ",I,", "]}),"has been sent."]}),(0,O.jsx)("div",{className:"jsx-".concat(u.__hash),children:"To complete the process, simply click on the link in the email."})]})]}),invalid:(0,O.jsxs)("div",{className:"product-survey__invalid",children:[(0,O.jsxs)("div",{className:"product-survey__invalid--status",children:["Invalid",(0,O.jsx)(x.a,{icon:"fa-exclamation-triangle"})]}),(0,O.jsx)("div",{className:"product-survey__invalid--message",children:I||""}),(0,O.jsx)(d.Z,{onClick:function(){return Q("contact")},children:"return to contact appliances"})]})};return b?(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(i(),{id:u.__hash,children:u}),(0,O.jsx)("div",{id:"product-survey",ref:k,className:"jsx-".concat(u.__hash)+" product-survey",children:(0,O.jsx)(_.Z,{backBtn:"start"!==E,showTitle:"start"!==E,title:E,onChange:Q,currentView:E,views:J})})]}):(0,O.jsx)(O.Fragment,{children:"No ID FOR PRODUCT REQUEST"})}},48834:function(e,t,r){var s=r(59499),n=r(50029),a=r(64687),i=r.n(a),o=r(67294);function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,s)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach(function(t){(0,s.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}t.Z=function(){var e=(0,o.useState)({user_agent:"",user_agent_data:null,public_ip:""}),t=e[0],r=e[1];return(0,o.useEffect)(function(){var e,t=(e=(0,n.Z)(i().mark(function e(){var t,s,n;return i().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r({user_agent:window.navigator.userAgent,user_agent_data:"userAgentData"in(t=navigator)?t.userAgentData:null}),e.prev=4,e.next=7,fetch("https://ipapi.co/json/");case 7:if(!(s=e.sent).ok){e.next=16;break}return e.next=11,s.json();case 11:n=e.sent.ip,r(function(e){return l(l({},e),{},{public_ip:n})}),e.next=17;break;case 16:console.error("Failed to fetch IP address information.");case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(4),console.error("Error fetching IP address information:",e.t0);case 22:case"end":return e.stop()}},e,null,[[4,19]])})),function(){return e.apply(this,arguments)});return t(),window.addEventListener("load",t),function(){window.removeEventListener("load",t)}},[]),t}},51633:function(e,t,r){r.d(t,{Z:function(){return x}});var s=r(21378),n=r.n(s),a=r(67294),i=[".d-flex.jsx-437419458,.ui-view-layout__view.jsx-437419458,.ui-view-layout__header.jsx-437419458,.ui-view-layout__actions.jsx-437419458,.ui-view-layout.jsx-437419458,.back-btn.jsx-437419458{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".back-btn.jsx-437419458{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;width:100%;height:var(--s-element);}",".ui-view-layout.jsx-437419458{position:relative;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;min-height:100%;}",".ui-view-layout.start.jsx-437419458>*.back-btn.jsx-437419458{display:none;}",".ui-view-layout__actions.jsx-437419458{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;gap:var(--s-9);}",".ui-view-layout__view.jsx-437419458{height:100%;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-4);}",".ui-view-layout__view.jsx-437419458,.ui-view-layout__actions.jsx-437419458{width:100%;}",".ui-view-layout__header.jsx-437419458{width:var(--s-4-width);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:0 var(--s-4) var(--s-9);}","@media (max-width:1100px){.ui-view-layout__header.jsx-437419458{width:var(--s-9-width);padding:0 var(--s-9) var(--s-9);}}",".ui-view-layout__header-title.jsx-437419458{font-size:var(--s-1);--ui-icon-color:var(--primary-50);color:var(--primary-50);text-transform:capitalize;}",".current.jsx-437419458{position:absolute;top:calc(var(--s-4) * 0.5);color:var(--gray-30-o);right:var(--s-9);height:var(--s-6);line-height:1;}"];i.__hash="437419458";var o=r(85153),c=r(27812),l=function(e,t){var r=(0,a.useState)([]),s=r[0],n=r[1],i=(0,a.useState)(),o=i[0],l=i[1],u=function(t){var r=String(t);e&&e[r]&&(l(e[r]),n(function(e){return[].concat((0,c.Z)(e),[r])}))};return(0,a.useEffect)(function(){t&&null!=e&&e[t]&&s[s.length-1]!==t&&u(t)},[e,t]),{view:o,setView:u,last:s[s.length-1],goBack:function(){n(function(t){if(t.length>1){var r=t.slice(0,-1);return l(e[r[r.length-1]]),r}return t})}}},u=r(10577),d=r(85893),x=function(e){var t=e.views,r=e.currentView,s=(e.onChange,e.title),c=(e.actions,e.showTitle),x=e.backBtn;(0,a.useEffect)(function(){},[r]);var v=l(t,r),m=v.view,f=(v.setView,v.goBack),p=v.last;return t&&m&&"loading"!=r?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(n(),{id:i.__hash,children:i}),(0,d.jsxs)("div",{className:"jsx-".concat(i.__hash)+" ui-view-layout",children:[void 0!==x&&x&&"start"!==p&&(0,d.jsx)("div",{className:"jsx-".concat(i.__hash)+" back-btn",children:(0,d.jsx)("div",{className:"jsx-".concat(i.__hash),children:(0,d.jsx)(u.Z,{traits:{beforeIcon:"fa-chevron-left"},variant:"flat",onClick:f,children:"Back"})})}),void 0!==c&&c&&"start"!==p&&(0,d.jsx)("div",{className:"jsx-".concat(i.__hash)+" ui-view-layout__header",children:(0,d.jsx)("div",{className:"jsx-".concat(i.__hash)+" ui-view-layout__header-title",children:s})}),(0,d.jsx)("div",{"data-view":r,className:"jsx-".concat(i.__hash)+" ui-view-layout__view",children:m||(0,d.jsx)("div",{className:"jsx-".concat(i.__hash),children:"View not found"})})]})]}):(0,d.jsx)(o.Z,{})}}}]);