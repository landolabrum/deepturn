(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[277],{42450:function(e,t,a){"use strict";a.d(t,{Z:function(){return v}});var n=a(59499),s=a(50029),r=a(21378),c=a.n(r),i=a(64687),o=a.n(i),l=a(67294),d=[".d-flex.jsx-1944248964,.contact-form.jsx-1944248964{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".contact-form.jsx-1944248964{width:100%;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".contact-form__title.jsx-1944248964{font-size:var(--s-1);color:var(--gray-40);margin:var(--s-4) 0;text-transform:capitalize;}",".contact-form--action.jsx-1944248964{--ui-icon-color:var(--gray-20);}",".contact-form__payment-form.jsx-1944248964{width:100%;}"];d.__hash="1944248964";var u=a(38903),x=a(47265),m=a(11907),f=a(98014),h=a(85893);function p(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function _(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?p(Object(a),!0).forEach(function(t){(0,n.Z)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):p(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var v=function(e){var t,a,n,r=e.onSubmit,i=e.user,p=e.submit,v=e.title,j=void 0===v?"contact":v,b=(0,m.aF)(),g=(0,l.useState)([{name:"firstName",label:"First Name",width:"50%",type:"text",placeholder:"First Name",required:!0},{name:"lastName",label:"Last Name",width:"50%",type:"text",placeholder:"Last Name",required:!0},{name:"email",label:"Email",type:"email",placeholder:"your@email.com",required:!0},{name:"phone",label:"Phone",type:"tel",placeholder:"1 (555) 555-5555",required:!0},{name:"address",label:"Address",type:"text",placeholder:"Your Address",required:!0}]),w=g[0],y=g[1],k=(0,l.useState)(),N=k[0],O=k[1],P=(0,l.useState)(!0),Z=P[0],D=P[1],S=(t=(0,s.Z)(o().mark(function e(t){var a,n;return o().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(Array.isArray(t)){e.next=2;break}return e.abrupt("return");case 2:return(n=(null===(a=t.map(function(e){var t,a=N&&e.name&&(null===(t=(0,f.PI)(N,e.name))||void 0===t?void 0:t.value),n=(null==e?void 0:e.value)===a,s=!["",void 0,null,{}].includes(e.value);return!!(n&&s)}).filter(function(e){return!1===e}))||void 0===a?void 0:a.length)===0)!==Z&&D(n),e.abrupt("return");case 6:case"end":return e.stop()}},e)})),function(e){return t.apply(this,arguments)}),z=i||b,C=(a=(0,s.Z)(o().mark(function e(){var t,a;return o().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!z){e.next=5;break}return a=w.map(function(e){switch(e.name){case"firstName":return _(_({},e),{},{value:z.name?z.name.split(" ")[0]:e.value,width:"50%"});case"lastName":return _(_({},e),{},{value:z.name?z.name.split(" ")[1]:e.value,width:"50%"});case"email":return _(_({},e),{},{value:z.email||e.value});case"phone":return _(_({},e),{},{value:z.phone?(0,x.wW)(z.phone,"US",!0):e.value});case"address":return _(_({},e),{},{value:z.address||e.value});default:return e}}),null!==(t=w[0])&&void 0!==t&&t.value||y(a),N||O(a),e.abrupt("return",a);case 5:case"end":return e.stop()}},e)})),function(){return a.apply(this,arguments)}),F=(n=(0,s.Z)(o().mark(function e(){return o().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:C().then(function(e){return S(e)});case 1:case"end":return e.stop()}},e)})),function(){return n.apply(this,arguments)});return(0,l.useEffect)(function(){var e;null!==(e=w[0])&&void 0!==e&&e.value||F()},[b]),(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(c(),{id:d.__hash,children:d}),(0,h.jsxs)("div",{className:"jsx-".concat(d.__hash)+" contact-form",children:[j&&(0,h.jsx)("div",{className:"jsx-".concat(d.__hash)+" contact-form__title",children:j}),(0,h.jsx)(u.Z,{fields:w,disabled:Z,onChange:function(e){var t=e.target,a=t.name,n=t.value,s=w.map(function(e,t){return e.name===a&&(e.value=n),e});y(s),S(s)},onSubmit:function(e){e.preventDefault;var t=w.reduce(function(e,t){var a=t.name;return["firstName","lastName"].includes(a),e[a]=t.value,e},{});t.name="".concat(t.firstName," ").concat(t.lastName),delete t.firstName,delete t.lastName,r(t)},submitText:null==p?void 0:p.text})]})]})}},18515:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return J}});var n=a(59499),s=a(77191),r=a(21378),c=a.n(r),i=a(67294),o=[".d-grid.jsx-2070031882,.account.jsx-2070031882{display:grid;grid-template-columns:1fr 2fr;grid-template-rows:1fr;grid-column-gap:5px;grid-row-gap:0px;gap:10px;}",".account.jsx-2070031882{width:100%;position:relative;}","@media (max-width:900px){.account.jsx-2070031882{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:100%;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;}}",".account.jsx-2070031882 .account__view.jsx-2070031882{background-color:var(--gray-50);border-radius:var(--border-radius);width:calc(100% - var(--s-6) * 2);padding:var(--s-7);}",".account.jsx-2070031882 .account__view.jsx-2070031882 .account__view__title.jsx-2070031882{text-transform:uppercase;-webkit-letter-spacing:var(--s-9);-moz-letter-spacing:var(--s-9);-ms-letter-spacing:var(--s-9);letter-spacing:var(--s-9);font-weight:900;font-size:var(--s-1);line-height:1.5;margin-bottom:var(--s-9);color:var(--gray-20);}"];o.__hash="2070031882";var l=a(97268),d=a(11907),u=a(35109),x=[".subscriptions.jsx-857572766{width:100%;}",".subscriptions__calendar--title.jsx-857572766{font-size:var(--s-1);color:var(--gray-50);}"];x.__hash="857572766";var m=a(47265),f=[".d-flex.jsx-1096317770,.calendar__header--filters.jsx-1096317770,.calendar__header.jsx-1096317770{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".calendar.jsx-1096317770{background-color:var(--gray-90);border-radius:var(--border-radius);overflow:hidden;border:solid 1px var(--gray-70);width:auto;}",".calendar__header.jsx-1096317770{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;width:auto;padding:var(--s-9) var(--s-9);}","@media (max-width:900px){.calendar__header.jsx-1096317770{gap:var(--s-5);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}}",".calendar__header--title.jsx-1096317770{text-transform:capitalize;font-size:var(--s-3);color:var(--gray-50);font-family:Game;font-style:normal;}","@media (max-width:900px){.calendar__header--title.jsx-1096317770{width:100%;}}",".calendar__header--filters.jsx-1096317770{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;gap:var(--s-9);}","@media (max-width:900px){.calendar__header--filters.jsx-1096317770{width:100%;}}","@media (max-width:900px){.calendar__dows.jsx-1096317770{display:none;}}",".calendar__dow.jsx-1096317770{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;-webkit-align-items:flex-end;-webkit-box-align:flex-end;-ms-flex-align:flex-end;align-items:flex-end;padding:var(--s-9) var(--s-9) var(--s-9) 0;border-right:solid 1px var(--gray-70);text-transform:capitalize;color:var(--gray-50);background-color:var(--gray-80);line-height:1;text-align:right;}",".calendar__date-container.jsx-1096317770{width:auto;overflow:hidden;border-right:solid 1px var(--gray-80);border-bottom:solid 1px var(--gray-80);z-index:1;}","@media (min-width:1260px){.calendar__date-container.jsx-1096317770{aspect-ratio:1/1;}}"];f.__hash="1096317770";var h=a(85854),p=['@charset "UTF-8";',".d-flex.jsx-3142356280,.calendar-date.jsx-3142356280::before,.calendar-date.jsx-3142356280,.calendar-date-modal__event--header--time.jsx-3142356280,.calendar-date-modal__event--header.jsx-3142356280,.calendar-date-modal.jsx-3142356280{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".calendar-date-modal.jsx-3142356280{margin:var(--s-element) 2px;width:auto;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;gap:var(--s-9);}",".calendar-date-modal__title.jsx-3142356280{font-size:var(--s-2);line-height:1;}",".calendar-date-modal__event.jsx-3142356280{border:solid 1px var(--gray-70);border-radius:var(--border-radius);width:100%;}",".calendar-date-modal__event--header.jsx-3142356280{min-height:var(--s-element);-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;background-color:var(--gray-70);padding:0 var(--s-8);}",".calendar-date-modal__event--header--title.jsx-3142356280{font-size:var(--s-4);line-height:1;text-transform:capitalize;}",".calendar-date-modal__event--header--time.jsx-3142356280{font-family:Game;font-style:italic;--ui-icon-size:var(--s-8);--ui-icon-color:var(--gray-40);color:var(--gray-40);font-size:var(--s-8);line-height:1;gap:var(--s-9);}",".calendar-date-modal__event--description.jsx-3142356280,.calendar-date-modal__event--action.jsx-3142356280{padding:var(--s-8);}",".calendar-date.jsx-3142356280{-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-box-pack:stretch;-webkit-justify-content:stretch;-ms-flex-pack:stretch;justify-content:stretch;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;position:relative;gap:2px;padding:var(--s-2) 5px 0;width:auto;z-index:1;border:solid 1px transparent;height:calc(100% - 2px - var(--s-2));}",".calendar-date.jsx-3142356280::before{z-index:0;content:attr(data-day);width:auto;line-height:1;position:absolute;top:0;left:0 !important;color:var(--gray-80);padding:5px 8px;}","@media (max-width:900px){.calendar-date.jsx-3142356280::before{content:attr(data-mobile-day);}}","@media (max-width:900px){.calendar-date.jsx-3142356280{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;}.calendar-date__has-event.jsx-3142356280{z-index:1;}.calendar-date__has-event.jsx-3142356280::before{color:var(--primary-50);}}",".calendar-date__modal.jsx-3142356280{gap:var(--s-4);}",".calendar-date.jsx-3142356280:hover{border:solid 1px var(--gray-60);background-color:var(--gray-60-o);}",".calendar-date.jsx-3142356280:hover.jsx-3142356280::before{background-color:var(--gray-30-o);border-radius:0 0 4px 0;}",".calendar-date__title.jsx-3142356280{font-size:var(--s-2);color:var(--gray-30);}",".calendar-date__event.jsx-3142356280{z-index:2;position:relative;cursor:pointer;padding:2px 5px;font-size:var(--s-7);text-overflow:ellipsis;overflow:hidden;line-height:1;border-radius:var(--s-9);text-transform:capitalize;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;width:calc(100% - 10px);color:var(--gray-60);}","@media (min-width:900px){.calendar-date__event.jsx-3142356280{width:auto;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;}}",".calendar-date__event.jsx-3142356280:hover{color:var(--white);--ui-icon-color:var(--white);background-color:var(--primary-50);}",".calendar-date__event--title.jsx-3142356280{white-space:nowrap;}","@media (max-width:900px){.calendar-date__event--title.jsx-3142356280{margin-right:auto;}}",'.calendar-date__event--title.jsx-3142356280:before{vertical-align:middle;padding-right:5px;content:"\xb7";font-weight:900;font-size:var(--s-4);}',".calendar-date__event--time.jsx-3142356280{width:auto;font-size:var(--s-8);line-height:1;--ui-icon-size:var(--s-8);white-space:nowrap;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;gap:4px;font-family:Game;font-style:italic;}","@media (max-width:900px){.calendar-date__event.jsx-3142356280{display:none;}.calendar-date.jsx-3142356280:hover .calendar-date__event.jsx-3142356280{display:unset;}}",".calendar-date.jsx-3142356280 .calendar-date__modal__event.jsx-3142356280{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}"];p.__hash="3142356280";var _=a(36946),v=a(10577),j=a(55140),b=a(85893),g=function(e){var t,a=e.date,n=e.btnText,s=void 0===n?"rsvp":n,r=(0,_.dd)(),o=r.openModal;r.closeModal;var l=function(e){var t=e.events,n=(0,m.vc)("".concat(a.year,"-").concat(a.month,"-").concat(a.day));return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:p.__hash,children:p}),(0,b.jsxs)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal",children:[(0,b.jsx)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal__title",children:n}),t.map(function(e,t){return(0,b.jsxs)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal__event",children:[(0,b.jsxs)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal__event--header",children:[(0,b.jsx)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal__event--header--title",children:e.title}),(0,b.jsxs)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal__event--header--time",children:[(0,b.jsx)(j.a,{icon:"fa-clock"}),(0,m.vc)(e.iso)]})]}),(0,b.jsx)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal__event--description",children:e.description}),(0,b.jsx)("div",{className:"jsx-".concat(p.__hash)+" calendar-date-modal__event--action",children:(0,b.jsx)(v.Z,{children:s})})]},t)})]})]})},d=function(e,t){t.stopPropagation();var n=null==a?void 0:a.events;null!=n&&n.length&&o((0,b.jsx)(l,{events:[n[e]]}))};return(0,i.useEffect)(function(){},[a]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:p.__hash,children:p}),(0,b.jsx)("div",{"data-day":String(a.day),onClick:function(){var e=null==a?void 0:a.events;null!=e&&e.length&&o((0,b.jsx)(l,{events:e}))},"data-mobile-day":"".concat(m.hG[a.dow]," ").concat((0,m.vc)("".concat(a.month,"-").concat(a.day,"-").concat(a.year))),className:"jsx-".concat(p.__hash)+" "+"calendar-date".concat((null==a||null===(t=a.events)||void 0===t?void 0:t.length)&&" calendar-date__has-event"||""),children:(null==a?void 0:a.events)&&a.events.map(function(e,t){return(0,b.jsxs)("div",{onClick:function(e){return d(t,e)},className:"jsx-".concat(p.__hash)+" calendar-date__event",children:[(0,b.jsx)("div",{className:"jsx-".concat(p.__hash)+" calendar-date__event--title",children:e.title}),e.time&&(0,b.jsxs)("div",{className:"jsx-".concat(p.__hash)+" calendar-date__event--time",children:[(0,b.jsx)(j.a,{icon:"fa-clock"}),(0,b.jsxs)("div",{className:"jsx-".concat(p.__hash),children:[" ",e.time]})]})]},t)})})]})},w=a(84520),y=function(e){var t=e.events,a=void 0===t?[{title:"event test 1",description:"desc 1",iso:"2023-11-01"},{title:"event test 2",description:"desc 2",iso:"2023-11-01T12:00:00Z"}]:t,n=e.year,s=void 0===n?new Date().getFullYear():n,r=e.month,o=void 0===r?new Date().getMonth()+1:r,l=e.title,d=(0,i.useState)({mm:o,yy:s}),u=d[0],x=d[1],p=(0,i.useState)([]),_=p[0],j=p[1],y=function(e,t){for(var n=[],s=new Date(t,e-1,1);0!==s.getDay();)s.setDate(s.getDate()-1);for(var r=!0;!function(){if(s.getMonth()+1!==e){if(!r)return 1}else r=!1;var t="".concat(s.getFullYear(),"-").concat(String(s.getMonth()+1).padStart(2,"0"),"-").concat(String(s.getDate()).padStart(2,"0")),c=a.filter(function(e){return e.iso.startsWith(t)});n.push({month:s.getMonth()+1,year:s.getFullYear(),day:s.getDate(),dow:s.getDay(),events:c}),s.setDate(s.getDate()+1)}(););return n},k=function(e){var t="plus"===e?1:-1;x({mm:(u.mm-1+t+12)%12+1,yy:1===u.mm&&-1===t?u.yy-1:12===u.mm&&1===t?u.yy+1:u.yy})};return(0,i.useEffect)(function(){j(y(u.mm,u.yy))},[u]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:f.__hash,children:f}),(0,b.jsxs)("div",{className:"jsx-".concat(f.__hash)+" calendar",children:[(0,b.jsxs)("div",{className:"jsx-".concat(f.__hash)+" calendar__header",children:[(0,b.jsx)("div",{className:"jsx-".concat(f.__hash)+" calendar__header--title",children:l}),(0,b.jsxs)("div",{className:"jsx-".concat(f.__hash)+" calendar__header--filters",children:[(0,b.jsx)(v.Z,{variant:"dark",onClick:function(){var e=new Date().getMonth()+1,t=new Date().getFullYear();j(y(e,t)),x({mm:e,yy:t})},children:"Today"}),(0,b.jsx)(w.Z,{variant:"center dark",amount:"".concat(m.I3[u.mm-1],", ").concat(u.yy),setAmount:console.log,traits:{beforeIcon:{icon:"fas-minus",onClick:function(){return k("minus")}},afterIcon:{icon:"fas-plus",onClick:function(){return k("plus")}}}})]})]}),(0,b.jsx)("div",{className:"jsx-".concat(f.__hash)+" calendar__dows",children:(0,b.jsx)(h.Z,{xs:7,children:m.hG.map(function(e,t){return(0,b.jsx)("div",{className:"jsx-".concat(f.__hash)+" calendar__dow",children:e},t)})})}),(0,b.jsx)(h.Z,{xs:7,responsive:!0,children:_&&_.map(function(e,t){return(0,b.jsx)("div",{className:"jsx-".concat(f.__hash)+" calendar__date-container",children:(0,b.jsx)(g,{date:e})},t)})})]})]})},k=function(e){e.user,(0,m.vc)(new Date);var t=(0,i.useState)(void 0);return t[0],t[1],(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:x.__hash,children:x}),(0,b.jsx)("div",{className:"jsx-".concat(x.__hash)+" subscriptions",children:(0,b.jsx)("div",{className:"jsx-".concat(x.__hash)+" subscriptions__calendar",children:(0,b.jsx)(y,{title:"subscriptions"})})})]})},N=a(50029),O=a(16835),P=a(64687),Z=a.n(P),D=['@import url("https://fonts.googleapis.com/css2?family=Ephesis&family=Montserrat:wght@800&family=Play:wght@400;700&family=Poppins&display=swap");',".d-flex.jsx-3101664032,.account-documents__actions.jsx-3101664032,.account-documents .account-documents__list .account-documents--document__terms.jsx-3101664032,.account-documents__pdf-preview.jsx-3101664032,.account-documents__header.jsx-3101664032,.account-documents__status--docs--none.jsx-3101664032,.account-documents__status--docs--doc.jsx-3101664032,.account-documents__status--docs.jsx-3101664032{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".account-documents.jsx-3101664032{width:100%;margin:auto;height:100%;}",".account-documents__status.jsx-3101664032{padding:var(--s-9) var(--s-8);width:calc(100% - var(--s-8) * 2);text-transform:uppercase;font-size:var(--s-5);height:100%;}",".account-documents__status--docs.jsx-3101664032{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;gap:var(--s-9);font-size:var(--s-8);text-transform:unset;}",".account-documents__status--docs--doc.jsx-3101664032{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;font-size:var(--s-5);color:var(--orange-50);}",".account-documents__status--docs--none.jsx-3101664032{margin:var(--s-9) 0;border-radius:var(--border-radius);width:100%;background-color:var(--gray-70);min-height:100px;}",".account-documents__header.jsx-3101664032{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:0 0 var(--s-4);}",".account-documents__header--title.jsx-3101664032{font-size:var(--s-3);color:var(--gray-30);font-style:italic;font-weight:900;}",".account-documents__pdf-preview.jsx-3101664032{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;gap:var(--s-4);min-height:600px;}",".account-documents__pdf-preview--content.jsx-3101664032{min-height:600px;width:100%;overflow:hidden;}",".account-documents.jsx-3101664032 .account-documents__list.jsx-3101664032 .account-documents--document.jsx-3101664032 .account-documents__pdf.jsx-3101664032{background-color:var(--gray-90);}",".account-documents.jsx-3101664032 .account-documents__list.jsx-3101664032 .account-documents--document.jsx-3101664032 .account-documents__pdf__description.jsx-3101664032{color:var(--gray-40);padding:var(--s-4);}",".account-documents.jsx-3101664032 .account-documents__list.jsx-3101664032 .account-documents--document__terms.jsx-3101664032{-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-4);margin:var(--s-9) 0;}",".account-documents.jsx-3101664032 .account-documents__list.jsx-3101664032 .account-documents--document__terms--term.jsx-3101664032{max-width:calc(100% - var(--s-5) * 2);}",".account-documents.jsx-3101664032 .account-documents__list.jsx-3101664032 .account-documents--document__terms--term__title.jsx-3101664032{font-size:var(--s-5);color:var(--gray-40);}",".account-documents.jsx-3101664032 .account-documents__list.jsx-3101664032 .account-documents--document__terms--term__body.jsx-3101664032{font-size:var(--s-7);line-height:1.5;color:var(--gray-50);}",".account-documents__actions.jsx-3101664032{padding:calc(var(--s-element) * 2) var(--s-4) calc(var(--s-element) * 2);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-element);}"];D.__hash="3101664032";var S=a(10394),z=a(23992),C=a(39925),F=a(94983),E=a(31831),M=a(49334),R=a(98067),I=[".d-flex.jsx-1109658404,.documents-none--content.jsx-1109658404,.documents-none.jsx-1109658404{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".documents-none.jsx-1109658404{border-radius:var(--border-radius);background-color:var(--gray-80);height:500px;font-size:var(--s-2);font-weight:900;color:var(--secondary);text-transform:capitalize;}",".documents-none--content.jsx-1109658404{background-color:var(--gray-90);border-radius:var(--border-radius);width:var(--s-4-width);height:var(--s-4-width);}"];I.__hash="1109658404";var A=function(){return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:I.__hash,children:I}),(0,b.jsx)("div",{className:"jsx-".concat(I.__hash)+" documents-none",children:(0,b.jsx)("div",{className:"jsx-".concat(I.__hash)+" documents-none--content",children:"no docs"})})]})},L=a(61120),T=a.n(L),q=a(91819),G=function(e){var t,a,n,s,r=e.user,o=e.previewPdf,l=(0,i.useRef)(null),d=(0,i.useState)([]),u=d[0],x=d[1],m=(0,S.ko)("IProductService"),f=(0,E.U2)(),p=(0,O.Z)(f,2),j=p[0],g=p[1],w=(0,i.useState)(""),y=w[0],k=w[1],P=(0,i.useRef)(null),I=(0,S.ko)("IDocumentService"),L=(0,_.dd)(),G=L.openModal,U=L.closeModal;L.modalContent;var Y=(a=(0,N.Z)(Z().mark(function e(t){return Z().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return U(),g({active:!0,body:"Uploading your document"}),e.prev=2,e.next=5,I.uploadDocument(t,"tax_document_user_upload");case 5:console.log("PDF uploaded successfully",e.sent),e.next=12;break;case 9:e.prev=9,e.t0=e.catch(2),console.error("Error uploading PDF",e.t0);case 12:case"end":return e.stop()}},e,null,[[2,9]])})),function(e){return a.apply(this,arguments)}),H=(n=(0,N.Z)(Z().mark(function e(t){var a,n,s,r,i,l,d,u,x,m;return Z().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(console.log("[ PDF CONTAINER REF ]",null==(a=P.current)?void 0:a.offsetHeight),a){e.next=5;break}return console.error("PDF container element not found"),e.abrupt("return");case 5:return n=null==a?void 0:a.offsetWidth,s=null==a?void 0:a.offsetHeight,r=10,i=new q.kH("p","pt",[n,s]),l=r,d=0,e.next=13,T()(a,{scrollY:l});case 13:d=(u=e.sent).height,i.addImage(u,"PNG",r,l,n-2*r,d),x=i.output("blob"),(m=new FormData).append("file",x,"document.pdf"),o?G((0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:D.__hash,children:D}),(0,b.jsxs)("div",{className:"jsx-".concat(D.__hash)+" account-documents__pdf-preview",children:[(0,b.jsx)("h2",{className:"jsx-".concat(D.__hash),children:"Document Preview"}),(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents__pdf-preview--content",children:(0,b.jsx)("embed",{src:URL.createObjectURL(x),type:"application/pdf",width:"100%",height:"600px",className:"jsx-".concat(D.__hash)})}),(0,b.jsx)(v.Z,{variant:"primary",onClick:function(){return Y(m).then(function(){return g({active:!1})})},children:"Confirm & continue"}),(0,b.jsx)(v.Z,{variant:"link",onClick:U,children:"cancel"})]})]})):Y(m).then(function(){return g({active:!1})});case 20:case"end":return e.stop()}},e)})),function(e){return n.apply(this,arguments)}),W=function(e){k(e.target.value)},X=(s=(0,N.Z)(Z().mark(function e(){var t,a,n;return Z().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return g({active:!0,body:"getting your documents"}),e.prev=1,e.next=4,m.getProducts();case 4:a=e.sent,n=null==r||null===(t=r.metadata)||void 0===t?void 0:t.requirements,x(null==a?void 0:a.data.filter(function(e){var t,a;return(null==e||null===(t=e.metadata)||void 0===t?void 0:t.mid)==z.Z.merchant.mid&&(null==e||null===(a=e.metadata)||void 0===a?void 0:a.type)=="document"&&(null==n?void 0:n.includes(e.id))})),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(1),console.log("[ DOCS ERROR ]",e.t0);case 13:g({active:!1});case 14:case"end":return e.stop()}},e,null,[[1,10]])})),function(){return s.apply(this,arguments)}),V=(t=y.length,r&&(null==r?void 0:r.name)!=void 0?t<3||!!(t>=3&&String(r.name).toLowerCase().includes(y.toLowerCase()))||"full name incorrect":"no user");(0,i.useEffect)(function(){Object(u).length||X()},[x]);var B=function(e){var t=e.status,a=e.docs;return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:D.__hash,children:D}),(0,b.jsxs)("div",{className:"jsx-".concat(D.__hash)+" account-documents__status",children:[t," Documents",(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents__status--docs",children:(null==a?void 0:a.length)&&Object.entries(a).map(function(e){var t=(0,O.Z)(e,2),a=t[0],n=t[1];return(0,b.jsxs)("div",{className:"jsx-".concat(D.__hash)+" account-documents__status--docs--doc",children:[Number(a+1),". ",(0,b.jsx)(v.Z,{variant:"link",children:(0,C.R)(null==n?void 0:n.name)})]},a)})||(0,b.jsxs)("div",{className:"jsx-".concat(D.__hash)+" account-documents__status--docs--none",children:["NO documents are ",t]})})]})]})};return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:D.__hash,children:D}),(0,b.jsxs)("div",{ref:l,className:"jsx-".concat(D.__hash)+" account-documents",children:[(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents__header",children:(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents__header--title",children:(null==r?void 0:r.name)&&"".concat((0,C.R)(r.name),"'s Documents")})}),(null==u?void 0:u.length)&&(0,b.jsxs)(h.Z,{xs:1,md:2,variant:"card",gapX:10,margin:"var(--s-4) 0",children:[(0,b.jsx)(B,{status:"incomplete",docs:u,className:"jsx-".concat(D.__hash)}),(0,b.jsx)(B,{status:"complete",className:"jsx-".concat(D.__hash)})]})||null,(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents__list",children:(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents--document",children:null!=u&&u.length?u.map(function(e,t){return(0,b.jsx)("div",{className:"jsx-".concat(D.__hash),children:(0,b.jsx)(F.Z,{variant:"document",label:null==e?void 0:e.name,open:!0,children:(0,b.jsxs)("div",{ref:P,className:"jsx-".concat(D.__hash)+" account-documents__pdf",children:[(null==e?void 0:e.description)&&(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents__pdf__description",children:null==e?void 0:e.description}),(0,b.jsx)("ol",{className:"jsx-".concat(D.__hash)+" account-documents--document__terms",children:(null==e?void 0:e.metadata)&&Object.entries(null==e?void 0:e.metadata).filter(function(e){var t=(0,O.Z)(e,2),a=t[0];return t[1],"t-"===a.substring(0,2)}).map(function(e){var t=(0,O.Z)(e,2),a=t[0],n=t[1],s=String("".concat((0,C.Z)(null==a?void 0:a.split("_")[1])));return(0,b.jsxs)("li",{className:"jsx-".concat(D.__hash)+" account-documents--document__terms--term",children:[(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents--document__terms--term__title",children:(0,C.Z)((0,M.Z)(s))}),(0,b.jsx)("div",{className:"jsx-".concat(D.__hash)+" account-documents--document__terms--term__body",children:n&&n||""})]},a)})}),(0,b.jsxs)("div",{className:"jsx-".concat(D.__hash)+" account-documents__actions",children:[(0,b.jsx)(R.Z,{variant:"signature".concat("string"!=typeof V?"":" invalid"),name:"name",value:y,label:'Sign, "'.concat(null==r?void 0:r.name,'". to agree to the terms & conditions'),placeholder:null==r?void 0:r.name,onChange:W,error:"string"==typeof V&&V||void 0}),(0,b.jsx)(v.Z,{variant:String(null==r?void 0:r.name).toLowerCase()==y.toLowerCase()?"primary":"disabled",onClick:function(){return H(e.id)},children:"Agree"})]})]})})},t)}):!j.active&&(0,b.jsx)(A,{})})})]})]})},U=[".d-flex.jsx-3777189004,.user-profile__card.jsx-3777189004,.user-profile__header.jsx-3777189004,.user-profile.jsx-3777189004{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".user-profile.jsx-3777189004{width:100%;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;gap:var(--s-4);}",".user-profile__header.jsx-3777189004{-webkit-box-pack:end;-webkit-justify-content:flex-end;-ms-flex-pack:end;justify-content:flex-end;width:inherit;}",".user-profile__body.jsx-3777189004{width:inherit;}",".user-profile__card.jsx-3777189004{-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;gap:var(--s-4);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:var(--s-4);background-color:var(--gray-90);border-radius:var(--border-radius);}",".user-profile.jsx-3777189004 h3.jsx-3777189004{margin-bottom:var(--s-9);}"];U.__hash="3777189004";var Y=a(35486),H=a(42450);function W(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}var X=function(e){var t,a=e.user;(0,S.ko)("IMemberService");var s=(0,i.useState)(!1),r=s[0],o=s[1],l=(t=(0,N.Z)(Z().mark(function e(t){return Z().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:!function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?W(Object(a),!0).forEach(function(t){(0,n.Z)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):W(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}}({},t);case 1:case"end":return e.stop()}},e)})),function(e){return t.apply(this,arguments)});return(0,i.useEffect)(function(){},[r]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:U.__hash,children:U}),(0,b.jsxs)("div",{className:"jsx-".concat(U.__hash)+" user-profile",children:[(0,b.jsx)("div",{className:"jsx-".concat(U.__hash)+" user-profile__header",children:(0,b.jsx)("div",{className:"jsx-".concat(U.__hash)+" user-profile__header-view",children:(0,b.jsx)(v.Z,{onClick:function(){return o(!r)},children:"edit"})})}),(0,b.jsx)("div",{className:"jsx-".concat(U.__hash)+" user-profile__body",children:(0,b.jsx)("div",{className:"jsx-".concat(U.__hash)+" user-profile__card",children:(0,b.jsx)(Y.ZP,{cell:"member",data:a})})}),r&&(0,b.jsxs)("div",{className:"jsx-".concat(U.__hash),children:[(0,b.jsx)("h3",{className:"jsx-".concat(U.__hash),children:"Edit Profile"}),(0,b.jsx)("div",{className:"jsx-".concat(U.__hash)+" user-profile__card",children:(0,b.jsx)(H.Z,{onSubmit:l})})]})]})]})};function V(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),a.push.apply(a,n)}return a}function B(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?V(Object(a),!0).forEach(function(t){(0,n.Z)(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):V(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var J=function(e){(0,s.Z)(e);var t=(0,d.aF)(),a=(0,d.dN)(),n=(0,i.useState)("profile"),r=n[0],x=n[1],m=(0,i.useState)({profile:(0,b.jsx)(X,{user:t,open:!0}),billing:(0,b.jsx)(l.Z,{open:"opened"}),"email notification":"email notification","privacy & security":"privacy & security"}),f=m[0],h=m[1];return(0,i.useEffect)(function(){a&&a>9&&h(function(e){return B(B({},e),{},{documents:(0,b.jsx)(G,{user:t,previewPdf:!1}),subscriptions:(0,b.jsx)(k,{user:t})})})},[a,t]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(c(),{id:o.__hash,children:o}),a&&(0,b.jsx)(u.Z,{viewName:"profile",title:r,showMenu:"profile"===r,setViewCallback:function(e){return x(e)},views:f})]})}},84520:function(e,t,a){"use strict";a.d(t,{Z:function(){return x}});var n=a(16835),s=a(21378),r=a.n(s),c=a(67294),i=[".ui-pill.jsx-1002868648{width:-webkit-max-content;width:-moz-max-content;width:max-content;}",".ui-pill.ui-pill-responsive.jsx-1002868648{height:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}"];i.__hash="1002868648";var o=a(98067),l=a(80954),d=a.n(l),u=a(85893),x=function(e){var t=e.amount,a=e.setAmount,s=e.variant,l=e.traits,x=(0,c.useState)("0"),m=x[0],f=x[1],h=l;h||"number"!=typeof t||(h={beforeIcon:{icon:t>1?"fas-minus":"fa-trash-can",onClick:function(){return v("minus")},color:1==t?"red":""},afterIcon:{icon:"fas-plus",onClick:function(){return v("plus")}}}),l&&Object.entries(l).forEach(function(e){var t=(0,n.Z)(e,2),a=t[0],s=t[1];h[a]=s});var p=(0,c.useRef)(d()(function(e){isNaN(Number(e))||a(Number(e))},1500)).current,_=(0,c.useCallback)(function(e){f(e.target.value),p(e.target.value)},[p]),v=(0,c.useCallback)(function(e){"number"==typeof t&&a(t+("plus"===e?1:-1))},[t,a]);return(0,c.useEffect)(function(){t&&f(t.toString())},[t]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(r(),{id:i.__hash,children:i}),(0,u.jsx)("div",{className:"jsx-".concat(i.__hash)+" "+"ui-pill ".concat(null!=l&&l.responsive?" ui-pill-responsive":""),children:(0,u.jsx)(o.Z,{name:"ui-pill",variant:s,traits:h,value:m,onChange:_})})]})}},99813:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/profile",function(){return a(18515)}])}},function(e){e.O(0,[7847,5443,3796,5196,1695,7268,2888,9774,179],function(){return e(e.s=99813)}),_N_E=e.O()}]);