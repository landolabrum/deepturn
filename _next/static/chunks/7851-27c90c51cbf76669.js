"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7851],{10530:function(e,t,r){r.d(t,{Z:function(){return p}});var n=r(59499),i=r(16835),a=r(8151),s=r.n(a),c=r(67294),o=[".d-flex.jsx-1236424611,.contact-form.jsx-1236424611{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".contact-form.jsx-1236424611{width:100%;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".contact-form__title.jsx-1236424611{font-size:var(--s-1);color:var(--gray-40);margin:var(--s-element) 0 var(--s-padding);text-transform:capitalize;}",".contact-form--action.jsx-1236424611{--ui-icon-color:var(--gray-20);}"];o.__hash="1236424611";var l=r(2612),d=r(981),f=r(49263),u=r(85893);function m(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function x(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?m(Object(r),!0).forEach(function(t){(0,n.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):m(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var p=function(e){var t=e.onSubmit,r=e.user,n=e.submitText,a=[{name:"firstName",label:"First Name",type:"text",placeholder:"First Name",required:!0},{name:"lastName",label:"Last Name",type:"text",placeholder:"Last Name",required:!0},{name:"email",label:"Email",type:"email",placeholder:"your@email.com",required:!0},{name:"phone",label:"Phone",type:"tel",placeholder:"1 (555) 555-5555",required:!0},{name:"address",label:"Address",type:"text",placeholder:"Your Address",required:!0}],m=(0,f.a)(),p=(0,c.useState)(a),v=p[0],h=p[1],y=(0,c.useState)(!0),g=y[0],b=y[1],j=r||m;(0,c.useEffect)(function(){if(j){var e=[].concat(a);if(j.name){var t=j.name.split(" "),r=(0,i.Z)(t,2),n=r[0],s=r[1];e=e.map(function(e){return"firstName"===e.name?x(x({},e),{},{value:n}):"lastName"===e.name?x(x({},e),{},{value:s}):e})}j.email&&(e=e.map(function(e){return"email"===e.name?x(x({},e),{},{value:j.email}):e})),j.phone&&(e=e.map(function(e){return"phone"===e.name?x(x({},e),{},{value:(0,d.wW)(j.phone,"US",!0)}):e})),j.address&&(e=e.map(function(e){return"address"===e.name?x(x({},e),{},{value:j.address}):e})),h(e),b(!1)}},[j]);var _=function(e){var t=e.target,r=t.name,n=t.value;h(function(e){return e.map(function(e){return e.name===r?x(x({},e),{},{value:n}):e})})},w=function(){b(!v.every(function(e){return void 0!==e.value&&""!==e.value}))};return(0,c.useEffect)(function(){w()},[_]),(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s(),{id:o.__hash,children:o}),(0,u.jsxs)("div",{className:"jsx-".concat(o.__hash)+" contact-form",children:[(0,u.jsx)("div",{className:"jsx-".concat(o.__hash)+" contact-form__title",children:"Contact"}),(0,u.jsx)(l.Z,{fields:v,disabled:g,onChange:_,onSubmit:function(e){e.preventDefault;var r=v.reduce(function(e,t){var r=t.name;return["firstName","lastName"].includes(r),e[r]=t.value,e},{});r.name="".concat(r.firstName," ").concat(r.lastName),delete r.firstName,delete r.lastName,t(r)},submitText:n})]})]})}},67851:function(e,t,r){r.d(t,{Z:function(){return C}});var n=r(8151),i=r.n(n),a=r(67294),s=[".d-flex.jsx-966531911,.verify__default.jsx-966531911,.loadslider.jsx-966531911{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".loadslider.jsx-966531911{min-height:100px;min-width:100%;background-size:200% 100%;}","@-webkit-keyframes slidePulse-jsx-966531911{0%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}50%{background-image:linear-gradient(to right,#ff6347 25%,#f30 50%,#ff6347 75%);}100%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}}","@keyframes slidePulse-jsx-966531911{0%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}50%{background-image:linear-gradient(to right,#ff6347 25%,#f30 50%,#ff6347 75%);}100%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}}",".verify.jsx-966531911{margin-top:var(--s-padding);color:var(--white);}","@media (max-width:900px){.verify.jsx-966531911{margin-top:0;padding:var(--s-padding);}}",".verify--header.jsx-966531911{color:var(--gray-40);width:var(--s-padding-width);max-width:var(--s-padding-width);overflow:hidden;padding:var(--s-padding) 0;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;text-overflow:ellipsis;}",".verify--header--title.jsx-966531911{color:var(--gray-50);font-size:var(--s-3);}",".verify__default.jsx-966531911{background-color:var(--gray-80);min-height:50vh;color:var(--gray-40);line-height:1;padding:var(--s-padding);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;gap:var(--s-padding);-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;border-radius:var(--border-radius);border:solid 1px var(--gray-60);box-shadow:var(--box-shadow-xl);}",".verify__default.jsx-966531911 h1.jsx-966531911,.verify__default.jsx-966531911 p.jsx-966531911{line-height:1;margin:0;}",".verify__default.jsx-966531911 p.jsx-966531911{color:var(--gray-50);}"];s.__hash="966531911";var c=r(11163),o=r(59499),l=r(50029),d=r(64687),f=r.n(d),u=[".d-flex.jsx-2424990045,.verify-email__content--loader.jsx-2424990045,.verify-email__content.jsx-2424990045,.verify-email.jsx-2424990045{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".verify-email.jsx-2424990045{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:flex-end;-webkit-box-align:flex-end;-ms-flex-align:flex-end;align-items:flex-end;border-radius:var(--border-radius);margin:var(--s-element) 0;color:var(--gray-70);background-color:var(--gray-80);min-height:500px;}","@media (max-width:1100px){.verify-email.jsx-2424990045{margin:var(--s-element) var(--s-padding);width:var(--s-padding-width);-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}}",".verify-email__content.jsx-2424990045{margin:var(--s-padding);width:var(--s-padding-width);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:100%;}",".verify-email__content--loader.jsx-2424990045{height:100%;}","@media (max-width:1100px){.verify-email__content--loader.jsx-2424990045{height:100%;}}",".verify-email__content__sign-in.jsx-2424990045{width:100%;}",".verify-email__content__sign-in--title.jsx-2424990045{font-size:var(--s-2);color:var(--gray-20);line-height:2;}"];u.__hash="2424990045";var m=r(52553),x=r(5531),p=r(40384),v=r(2612),h=r(72967),y=r(18508),g=r(99013),b=r(85893);function j(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function _(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?j(Object(r),!0).forEach(function(t){(0,o.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):j(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var w=function(e){var t,r,n,s,c,o,d=e.token,h=e.onSuccess,j=(0,a.useState)({status:"verifying_email"}),w=j[0],k=j[1],O=(0,m.ko)("IMemberService");(0,g.dd)().openModal;var N=(t=(0,l.Z)(f().mark(function e(){var t;return f().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(d){e.next=3;break}return k({status:"no_token_present"}),e.abrupt("return");case 3:return e.next=5,O.verifyEmail(String(d));case 5:(t=e.sent)&&k(t);case 7:case"end":return e.stop()}},e)})),function(){return t.apply(this,arguments)}),S=(r=(0,l.Z)(f().mark(function e(){var t,r,n,i;return f().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=null==w||null===(t=w.fields)||void 0===t||null===(t=t.find(function(e){return"password"==e.name}))||void 0===t?void 0:t.value,(n=w.customer).metadata.password=r,e.next=5,O.updateMember(n.id,n);case 5:(i=e.sent)&&h(i.email);case 7:case"end":return e.stop()}},e)})),function(){return r.apply(this,arguments)});return(0,a.useEffect)(function(){N()},[d]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i(),{id:u.__hash,children:u}),(0,b.jsx)("div",{className:"jsx-".concat(u.__hash)+" verify-email",children:(0,b.jsxs)("div",{className:"jsx-".concat(u.__hash)+" "+"verify-email__content".concat("verification_success"===w.status?" verify-email__content--success":""),children:[(0,b.jsx)("div",{className:"jsx-".concat(u.__hash)+" verify-email__content--loader",children:(0,b.jsx)(x.Z,{position:"relative",text:(c="",(o=function(e){return"string"==typeof e})(w.status)?c=String(w.status):o(w.detail)?c=String(w.detail):null!==(n=w.detail)&&void 0!==n&&n.detail&&o(null===(s=w.detail)||void 0===s?void 0:s.detail)&&(c=w.detail.detail),(0,p.Z)(c)),dots:(null==w?void 0:w.status)!=void 0&&["verifying_email"].includes(null==w?void 0:w.status)})}),"incomplete"==w.status&&(null==w?void 0:w.fields)&&(0,b.jsx)(v.Z,{title:String(null==w?void 0:w.detail)||void 0,onChange:function(e){var t,r,n=e.target,i=n.name,a=n.value,s=null==w?void 0:w.fields,c=function(e){return null==s?void 0:s.find(function(t){return t.name===e})},o=null===(t=c("password"))||void 0===t?void 0:t.value,l=null===(r=c("confirm_password"))||void 0===r?void 0:r.value,d=null==s?void 0:s.map(function(e){if(e.name===i){var t=_(_({},e),{},{value:a});return"confirm_password"===i&&o!==a&&""!==o||"password"===i&&l!==a&&""!==l?t.error="Not Same as Password":t.error&&delete t.error,t}return e});k(_(_({},w),{},{fields:d}))},fields:w.fields,onSubmit:S}),"verification_success"===w.status&&w.customer.email&&(0,b.jsx)("div",{className:"jsx-".concat(u.__hash)+" verify-email__content__sign-in",children:(0,b.jsx)(y.Z,{href:"/account",children:"Go to Account"})})]})})]})},k=[".d-flex.jsx-1754337035,.verify-account.jsx-1754337035{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".verify-account.jsx-1754337035{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:var(--s-padding);border-radius:var(--border-radius);background-color:var(--gray-80);}"];k.__hash="1754337035";var O=function(){return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i(),{id:k.__hash,children:k}),(0,b.jsxs)("div",{className:"jsx-".concat(k.__hash)+" verify-account",children:[(0,b.jsx)("h1",{className:"jsx-".concat(k.__hash),children:"Verify Account"}),(0,b.jsx)(v.Z,{fields:[]})]})]})},N=[".d-flex.jsx-3061175848,.verify-payment--content__contact-form.jsx-3061175848,.verify-payment--header.jsx-3061175848,.verify-payment--content.jsx-3061175848,.verify-payment__token-needed.jsx-3061175848,.verify-payment.jsx-3061175848{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".card.jsx-3061175848,.verify-payment--content__contact-form.jsx-3061175848,.verify-payment__token-needed.jsx-3061175848{width:var(--s-padding-width);border-radius:var(--border-radius);padding:var(--s-padding);background-color:var(--gray-90);}",".verify-payment.jsx-3061175848{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;gap:var(--s-padding);width:100%;}",".verify-payment__item.jsx-3061175848{width:100%;}",".verify-payment__token-needed.jsx-3061175848{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;color:var(--secondary);font-size:var(--s-3);height:100%;min-height:400px;width:auto;}",".verify-payment--header.jsx-3061175848,.verify-payment--content.jsx-3061175848{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}",".verify-payment--header.jsx-3061175848{text-transform:capitalize;width:100%;color:var(--gray-40);font-size:var(--s-2);}",".verify-payment--content.jsx-3061175848{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;color:var(--gray-40);gap:var(--s-padding);width:100%;}",".verify-payment--content__contact-form.jsx-3061175848{margin-bottom:var(--s-element);}"];N.__hash="3061175848";var S=r(27017),P=r(10530),E=r(83941);function Z(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function D(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?Z(Object(r),!0).forEach(function(t){(0,o.Z)(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Z(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}var F=function(e){var t,r,n=e.token,s=(0,a.useState)(),c=s[0],o=s[1],d=(0,S.Z)(),u=d.addCartItem,x=d.getCartItems,p=(0,m.ko)("IMemberService"),v=(0,m.ko)("IShoppingService"),h=(0,a.useState)(),y=h[0],g=h[1],j=function(){if(!c||!c.items)return o({error:"Token is invalid"}),!1;var e=c.items.every(function(e){return e.price_id&&e.product_id&&String(e.price_id).startsWith("price_")&&String(e.product_id).startsWith("prod_")});return e||o({error:"Token is invalid"}),e},_=(t=(0,l.Z)(f().mark(function e(){return f().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,v.getProducts({price_ids:c.items.map(function(e){return e.price_id})});case 3:Object.values(e.sent.data).forEach(function(e){u(D(D({},e),{},{price:D(D({},e.price),{},{qty:1})}))}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error("[ getProducts ( error )]",e.t0);case 10:case"end":return e.stop()}},e,null,[[0,7]])})),function(){return t.apply(this,arguments)}),w=(r=(0,l.Z)(f().mark(function e(){var t,r,i;return f().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!n){e.next=12;break}return e.prev=1,e.next=4,p.decryptJWT({token:n,secret:"secretKey",algorithm:"HS256"});case 4:null!=(t=e.sent)&&t.decoded&&o(t.decoded),e.next=12;break;case 8:e.prev=8,e.t0=e.catch(1),o({error:null===e.t0||void 0===e.t0||null===(r=e.t0.detail)||void 0===r?void 0:r.detail}),console.error("[ JWT DECODE (ERROR) ]",null===e.t0||void 0===e.t0||null===(i=e.t0.detail)||void 0===i?void 0:i.detail);case 12:case"end":return e.stop()}},e,null,[[1,8]])})),function(){return r.apply(this,arguments)});(0,a.useEffect)(function(){console.log(c),n&&void 0===c&&w()},[n]);var k=x();return((0,a.useEffect)(function(){g(k),null!=c&&c.items&&j()&&_()},[o]),n&&(null==c||!c.error)&&j())?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i(),{id:N.__hash,children:N}),(0,b.jsxs)("div",{className:"jsx-".concat(N.__hash)+" verify-payment",children:[(0,b.jsx)("div",{className:"jsx-".concat(N.__hash)+" verify-payment--header"}),(0,b.jsxs)("div",{className:"jsx-".concat(N.__hash)+" verify-payment--content",children:[c.items&&(0,b.jsx)(E.Z,{cart:y}),(0,b.jsx)("div",{className:"jsx-".concat(N.__hash)+" verify-payment--content__contact-form",children:(0,b.jsx)(P.Z,{user:{email:c.email,name:c.name,phone:c.phone},onSubmit:function(e){console.log("[ ON SUBMIT ]",e)},submitText:"payment info"})})]})]})]}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i(),{id:N.__hash,children:N}),(0,b.jsx)("div",{className:"jsx-".concat(N.__hash)+" verify-payment__token-needed",children:(0,b.jsx)("div",{className:"jsx-".concat(N.__hash),children:String(null==c?void 0:c.error)||"No token is present, assure you clicked the right link."})})]})},z=function(){return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i(),{id:s.__hash,children:s}),(0,b.jsxs)("div",{className:"jsx-".concat(s.__hash)+" verify__default",children:[(0,b.jsx)("h1",{className:"jsx-".concat(s.__hash),children:"Verify"}),(0,b.jsx)("p",{className:"jsx-".concat(s.__hash),children:"Here is where you will verify a token in which you should have received via a specified contact method."})]})]})},C=function(){var e=(0,c.useRouter)(),t=(e.pathname,e.query),r=(0,a.useState)(""),n=r[0],o=r[1],l=(0,a.useState)(),d=l[0],f=l[1],u=(0,a.useState)(),m=u[0],x=u[1],p={"sign-in":(0,b.jsx)(h.Z,{email:d}),email:(0,b.jsx)(w,{token:m,onSuccess:function(e){return f(e)}}),account:(0,b.jsx)(O,{}),payment:(0,b.jsx)(F,{token:m})};return(0,a.useEffect)(function(){"string"==typeof t.vid&&o(t.vid),"string"==typeof t.token&&x(t.token),d&&o("sign-in")},[t,d,x]),(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(i(),{id:s.__hash,children:s}),(0,b.jsx)("div",{className:"jsx-".concat(s.__hash)+" verify",children:void 0===p[n]?(0,b.jsx)(z,{}):p[n]})]})}}}]);