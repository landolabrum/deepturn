(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1231],{2705:function(e,t,n){var r=n(5639).Symbol;e.exports=r},4239:function(e,t,n){var r=n(2705),i=n(9607),a=n(2333),s=r?r.toStringTag:void 0;e.exports=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":s&&s in Object(e)?i(e):a(e)}},7561:function(e,t,n){var r=n(7990),i=/^\s+/;e.exports=function(e){return e?e.slice(0,r(e)+1).replace(i,""):e}},1957:function(e,t,n){var r="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g;e.exports=r},9607:function(e,t,n){var r=n(2705),i=Object.prototype,a=i.hasOwnProperty,s=i.toString,o=r?r.toStringTag:void 0;e.exports=function(e){var t=a.call(e,o),n=e[o];try{e[o]=void 0;var r=!0}catch(e){}var i=s.call(e);return r&&(t?e[o]=n:delete e[o]),i}},2333:function(e){var t=Object.prototype.toString;e.exports=function(e){return t.call(e)}},5639:function(e,t,n){var r=n(1957),i="object"==typeof self&&self&&self.Object===Object&&self,a=r||i||Function("return this")();e.exports=a},7990:function(e){var t=/\s/;e.exports=function(e){for(var n=e.length;n--&&t.test(e.charAt(n)););return n}},954:function(e,t,n){var r=n(3218),i=n(7771),a=n(4841),s=Math.max,o=Math.min;e.exports=function(e,t,n){var c,l,u,d,f,v,m=0,x=!1,p=!1,h=!0;if("function"!=typeof e)throw TypeError("Expected a function");function y(t){var n=c,r=l;return c=l=void 0,m=t,d=e.apply(r,n)}function j(e){var n=e-v,r=e-m;return void 0===v||n>=t||n<0||p&&r>=u}function g(){var e,n,r,a=i();if(j(a))return b(a);f=setTimeout(g,(e=a-v,n=a-m,r=t-e,p?o(r,u-n):r))}function b(e){return(f=void 0,h&&c)?y(e):(c=l=void 0,d)}function _(){var e,n=i(),r=j(n);if(c=arguments,l=this,v=n,r){if(void 0===f)return m=e=v,f=setTimeout(g,t),x?y(e):d;if(p)return clearTimeout(f),f=setTimeout(g,t),y(v)}return void 0===f&&(f=setTimeout(g,t)),d}return t=a(t)||0,r(n)&&(x=!!n.leading,u=(p="maxWait"in n)?s(a(n.maxWait)||0,t):u,h="trailing"in n?!!n.trailing:h),_.cancel=function(){void 0!==f&&clearTimeout(f),m=0,c=v=l=f=void 0},_.flush=function(){return void 0===f?d:b(i())},_}},3218:function(e){e.exports=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)}},7005:function(e){e.exports=function(e){return null!=e&&"object"==typeof e}},3448:function(e,t,n){var r=n(4239),i=n(7005);e.exports=function(e){return"symbol"==typeof e||i(e)&&"[object Symbol]"==r(e)}},7771:function(e,t,n){var r=n(5639);e.exports=function(){return r.Date.now()}},4841:function(e,t,n){var r=n(7561),i=n(3218),a=n(3448),s=0/0,o=/^[-+]0x[0-9a-f]+$/i,c=/^0b[01]+$/i,l=/^0o[0-7]+$/i,u=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(a(e))return s;if(i(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=i(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=r(e);var n=c.test(e);return n||l.test(e)?u(e.slice(2),n?2:8):o.test(e)?s:+e}},6723:function(e,t,n){"use strict";n.d(t,{Z:function(){return j}});var r=n(8151),i=n.n(r),a=n(7294),s=[".d-flex.jsx-1012828623,.sign-in.jsx-1012828623{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".sign-in.jsx-1012828623{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;gap:var(--s-padding);}"];s.__hash="1012828623";var o=n(6170),c=[];c.__hash="2085888330";var l=n(2612),u=n(2553),d=n(2624),f=n(1364),v=n(5893),m=function(e){var t=e.email,n=(0,u.ko)("IMemberService"),r=(0,a.useState)([{name:"email",value:t}]),s=r[0];r[1];var o=(0,d.Z)();return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(i(),{id:c.__hash,children:c}),(0,v.jsx)(l.Z,{fields:s,onSubmit:function(e){var t,r=null===(t=(0,f.P)(e,"email"))||void 0===t?void 0:t.value;r&&o&&(console.log("[handleResetPassword]",{email:r,user_agent:o}),n.resetPassword({email:r,user_agent:o}))},submitText:"send reset password"})]})},x=n(8508),p=n(384),h=n(4485),y=n(7273),j=function(e){var t=e.email,n=e.view,r=e.title,c=e.onSuccess,l=(0,a.useState)(n||"sign-in"),u=l[0],d=l[1],f={"sign-in":(0,v.jsx)(o.Z,{onSuccess:c,email:t}),"reset-password":(0,v.jsx)(m,{email:t})},j="sign-in"===u?"reset-password":"sign-in";return(0,a.useEffect)(function(){},[u,d]),(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(i(),{id:s.__hash,children:s}),(0,v.jsxs)("div",{className:"jsx-".concat(s.__hash)+" sign-in",children:[(0,v.jsx)(y.Z,{showTitle:!0,title:r,view:u,showActions:!1,views:f}),(0,v.jsx)("div",{className:"jsx-".concat(s.__hash)+" sign-in__reset",children:(0,v.jsx)(x.Z,{variant:"link",onClick:function(){return d(j)},children:(0,h.R)((0,p.Z)(j))})})]})]})}},530:function(e,t,n){"use strict";n.d(t,{Z:function(){return y}});var r=n(9499),i=n(29),a=n(8151),s=n.n(a),o=n(4687),c=n.n(o),l=n(7294),u=[".d-flex.jsx-3589974209,.contact-form.jsx-3589974209{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".contact-form.jsx-3589974209{width:100%;-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".contact-form__title.jsx-3589974209{font-size:var(--s-1);color:var(--gray-40);margin:var(--s-padding) 0;text-transform:capitalize;}",".contact-form--action.jsx-3589974209{--ui-icon-color:var(--gray-20);}",".contact-form__payment-form.jsx-3589974209{width:100%;}"];u.__hash="3589974209";var d=n(2612),f=n(981),v=n(9263),m=n(1364),x=n(5893);function p(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function h(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?p(Object(n),!0).forEach(function(t){(0,r.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var y=function(e){var t,n,r,a=e.onSubmit,o=e.user,p=e.submit,y=e.title,j=void 0===y?"contact":y,g=(0,v.a)(),b=(0,l.useState)([{name:"firstName",label:"First Name",width:"50%",type:"text",placeholder:"First Name",required:!0},{name:"lastName",label:"Last Name",width:"50%",type:"text",placeholder:"Last Name",required:!0},{name:"email",label:"Email",type:"email",placeholder:"your@email.com",required:!0},{name:"phone",label:"Phone",type:"tel",placeholder:"1 (555) 555-5555",required:!0},{name:"address",label:"Address",type:"text",placeholder:"Your Address",required:!0}]),_=b[0],w=b[1],k=(0,l.useState)(),O=k[0],S=k[1],P=(0,l.useState)(!0),N=P[0],Z=P[1],E=(0,l.useState)(),D=E[0];E[1];var C=(t=(0,i.Z)(c().mark(function e(t){var n,r;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(Array.isArray(t)){e.next=3;break}return console.error("updatedFields is not an array",t),e.abrupt("return");case 3:return(r=(null===(n=t.map(function(e){var t,n=O&&(null===(t=(0,m.P)(O,e.name))||void 0===t?void 0:t.value),r=(null==e?void 0:e.value)===n,i=!["",void 0,null,{}].includes(e.value);return!!(r&&i)}).filter(function(e){return!1===e}))||void 0===n?void 0:n.length)===0)!==N&&Z(r),e.abrupt("return");case 7:case"end":return e.stop()}},e)})),function(e){return t.apply(this,arguments)}),F=(n=(0,i.Z)(c().mark(function e(){var t,n;return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:(t=D||o||g)&&(n=_.map(function(e){switch(e.name){case"firstName":return h(h({},e),{},{value:t.name?t.name.split(" ")[0]:e.value,width:"50%"});case"lastName":return h(h({},e),{},{value:t.name?t.name.split(" ")[1]:e.value,width:"50%"});case"email":return h(h({},e),{},{value:t.email||e.value});case"phone":return h(h({},e),{},{value:t.phone?(0,f.wW)(t.phone,"US",!0):e.value});case"address":return h(h({},e),{},{value:t.address||e.value});default:return e}}),_||w(n),O||S(n));case 2:case"end":return e.stop()}},e)})),function(){return n.apply(this,arguments)}),T=(r=(0,i.Z)(c().mark(function e(){return c().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:F().then(function(e){return C(e)});case 1:case"end":return e.stop()}},e)})),function(){return r.apply(this,arguments)});return(0,l.useEffect)(function(){T()},[]),(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)(s(),{id:u.__hash,children:u}),(0,x.jsxs)("div",{className:"jsx-".concat(u.__hash)+" contact-form",children:[j&&(0,x.jsx)("div",{className:"jsx-".concat(u.__hash)+" contact-form__title",children:j}),(0,x.jsx)(d.Z,{fields:_,disabled:N,onChange:function(e){var t=e.target,n=t.name,r=t.value,i=_.map(function(e,t){return e.name===n&&(e.value=r),e});w(i),C(i)},onSubmit:function(e){e.preventDefault;var t=_.reduce(function(e,t){var n=t.name;return["firstName","lastName"].includes(n),e[n]=t.value,e},{});t.name="".concat(t.firstName," ").concat(t.lastName),delete t.firstName,delete t.lastName,a(t)},submitText:null==p?void 0:p.text})]})]})}},9277:function(e,t,n){"use strict";n.d(t,{Z:function(){return q}});var r=n(8151),i=n.n(r),a=n(7294),s=[".d-flex.jsx-966531911,.verify__default.jsx-966531911,.loadslider.jsx-966531911{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".loadslider.jsx-966531911{min-height:100px;min-width:100%;background-size:200% 100%;}","@-webkit-keyframes slidePulse-jsx-966531911{0%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}50%{background-image:linear-gradient(to right,#ff6347 25%,#f30 50%,#ff6347 75%);}100%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}}","@keyframes slidePulse-jsx-966531911{0%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}50%{background-image:linear-gradient(to right,#ff6347 25%,#f30 50%,#ff6347 75%);}100%{background-image:linear-gradient(to right,#f30 25%,#ff6347 50%,#f30 75%);}}",".verify.jsx-966531911{margin-top:var(--s-padding);color:var(--white);}","@media (max-width:900px){.verify.jsx-966531911{margin-top:0;padding:var(--s-padding);}}",".verify--header.jsx-966531911{color:var(--gray-40);width:var(--s-padding-width);max-width:var(--s-padding-width);overflow:hidden;padding:var(--s-padding) 0;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;text-overflow:ellipsis;}",".verify--header--title.jsx-966531911{color:var(--gray-50);font-size:var(--s-3);}",".verify__default.jsx-966531911{background-color:var(--gray-80);min-height:50vh;color:var(--gray-40);line-height:1;padding:var(--s-padding);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;gap:var(--s-padding);-webkit-align-items:flex-start;-webkit-box-align:flex-start;-ms-flex-align:flex-start;align-items:flex-start;border-radius:var(--border-radius);border:solid 1px var(--gray-60);box-shadow:var(--box-shadow-xl);}",".verify__default.jsx-966531911 h1.jsx-966531911,.verify__default.jsx-966531911 p.jsx-966531911{line-height:1;margin:0;}",".verify__default.jsx-966531911 p.jsx-966531911{color:var(--gray-50);}"];s.__hash="966531911";var o=n(1163),c=n(9499),l=n(29),u=n(4687),d=n.n(u),f=[".d-flex.jsx-1831036712,.verify-email__content--loader.jsx-1831036712,.verify-email__content.jsx-1831036712{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".verify-email.jsx-1831036712{border-radius:var(--border-radius);margin:var(--s-element) 0;color:var(--primary);background-color:var(--gray-90);height:100%;}","@media (max-width:1100px){.verify-email.jsx-1831036712{margin:var(--s-element) var(--s-padding);width:var(--s-padding-width);-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}}",".verify-email__content.jsx-1831036712{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;gap:var(--s-element);padding:var(--s-padding);width:var(--s-padding-width);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:100%;}",".verify-email__content--loader.jsx-1831036712{height:100%;}","@media (max-width:1100px){.verify-email__content--loader.jsx-1831036712{height:100%;}}",".verify-email__content--success.jsx-1831036712{height:100%;}",".verify-email__content__sign-in.jsx-1831036712{width:100%;}",".verify-email__content__sign-in--title.jsx-1831036712{font-size:var(--s-2);color:var(--gray-20);line-height:2;}"];f.__hash="1831036712";var v=n(2553),m=n(5531),x=n(384),p=n(2612),h=n(6723),y=n(8508),j=n(9013),g=n(5893);function b(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function _(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?b(Object(n),!0).forEach(function(t){(0,c.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):b(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var w=function(e){var t,n,r,s,o,c,u=e.token,b=e.onSuccess,w=(0,a.useState)({status:"verifying_email"}),k=w[0],O=w[1],S=(0,v.ko)("IMemberService"),P=(0,j.dd)().openModal,N=(t=(0,l.Z)(d().mark(function e(){var t;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(u){e.next=3;break}return O({status:"no_token_present"}),e.abrupt("return");case 3:return e.next=5,S.verifyEmail(String(u));case 5:(t=e.sent)&&O(t);case 7:case"end":return e.stop()}},e)})),function(){return t.apply(this,arguments)}),Z=(n=(0,l.Z)(d().mark(function e(){var t,n,r,i;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=null==k||null===(t=k.fields)||void 0===t||null===(t=t.find(function(e){return"password"==e.name}))||void 0===t?void 0:t.value,(r=k.customer).metadata.password=n,e.next=5,S.updateCustomerProfile(r.id,r);case 5:(i=e.sent)&&(E(),b(i.email));case 7:case"end":return e.stop()}},e)})),function(){return n.apply(this,arguments)}),E=function(){P((0,g.jsx)(h.Z,{email:k.customer.email}))};return(0,a.useEffect)(function(){N()},[u]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:f.__hash,children:f}),(0,g.jsx)("div",{className:"jsx-".concat(f.__hash)+" verify-email",children:(0,g.jsxs)("div",{className:"jsx-".concat(f.__hash)+" "+"verify-email__content".concat("verification_success"===k.status?" verify-email__content--success":""),children:[(0,g.jsx)("div",{className:"jsx-".concat(f.__hash)+" verify-email__content--loader",children:(0,g.jsx)(m.Z,{position:"relative",text:(o="",(c=function(e){return"string"==typeof e})(k.status)?o=String(k.status):c(k.detail)?o=String(k.detail):null!==(r=k.detail)&&void 0!==r&&r.detail&&c(null===(s=k.detail)||void 0===s?void 0:s.detail)&&(o=k.detail.detail),(0,x.Z)(o)),dots:(null==k?void 0:k.status)!=void 0&&["verifying_email"].includes(null==k?void 0:k.status)})}),"incomplete"==k.status&&(null==k?void 0:k.fields)&&(0,g.jsx)(p.Z,{title:String(null==k?void 0:k.detail)||void 0,onChange:function(e){var t,n,r=e.target,i=r.name,a=r.value,s=null==k?void 0:k.fields,o=function(e){return null==s?void 0:s.find(function(t){return t.name===e})},c=null===(t=o("password"))||void 0===t?void 0:t.value,l=null===(n=o("confirm_password"))||void 0===n?void 0:n.value,u=null==s?void 0:s.map(function(e){if(e.name===i){var t=_(_({},e),{},{value:a});return"confirm_password"===i&&c!==a&&""!==c||"password"===i&&l!==a&&""!==l?t.error="Not Same as Password":t.error&&delete t.error,t}return e});O(_(_({},k),{},{fields:u}))},fields:k.fields,onSubmit:Z}),"verification_success"===k.status&&k.customer.email&&(0,g.jsx)("div",{className:"jsx-".concat(f.__hash)+" verify-email__content__sign-in",children:(0,g.jsx)(y.Z,{onClick:E,children:"Login"})})]})})]})},k=n(6170),O=[".d-flex.jsx-1754337035,.verify-account.jsx-1754337035{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".verify-account.jsx-1754337035{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;padding:var(--s-padding);border-radius:var(--border-radius);background-color:var(--gray-80);}"];O.__hash="1754337035";var S=function(){return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:O.__hash,children:O}),(0,g.jsxs)("div",{className:"jsx-".concat(O.__hash)+" verify-account",children:[(0,g.jsx)("h1",{className:"jsx-".concat(O.__hash),children:"Verify Account"}),(0,g.jsx)(p.Z,{fields:[]})]})]})},P=[".d-flex.jsx-3061175848,.verify-payment--content__contact-form.jsx-3061175848,.verify-payment--header.jsx-3061175848,.verify-payment--content.jsx-3061175848,.verify-payment__token-needed.jsx-3061175848,.verify-payment.jsx-3061175848{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".card.jsx-3061175848,.verify-payment--content__contact-form.jsx-3061175848,.verify-payment__token-needed.jsx-3061175848{width:var(--s-padding-width);border-radius:var(--border-radius);padding:var(--s-padding);background-color:var(--gray-90);}",".verify-payment.jsx-3061175848{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;gap:var(--s-padding);width:100%;}",".verify-payment__item.jsx-3061175848{width:100%;}",".verify-payment__token-needed.jsx-3061175848{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;color:var(--secondary);font-size:var(--s-3);height:100%;min-height:400px;width:auto;}",".verify-payment--header.jsx-3061175848,.verify-payment--content.jsx-3061175848{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}",".verify-payment--header.jsx-3061175848{text-transform:capitalize;width:100%;color:var(--gray-40);font-size:var(--s-2);}",".verify-payment--content.jsx-3061175848{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;color:var(--gray-40);gap:var(--s-padding);width:100%;}",".verify-payment--content__contact-form.jsx-3061175848{margin-bottom:var(--s-element);}"];P.__hash="3061175848";var N=n(7017),Z=n(530),E=n(5590);function D(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function C(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?D(Object(n),!0).forEach(function(t){(0,c.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):D(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var F=function(e){var t,n,r=e.token,s=(0,a.useState)(),o=s[0],c=s[1],u=(0,N.Z)(),f=u.addCartItem,m=u.getCartItems,x=(0,v.ko)("IMemberService"),p=(0,v.ko)("IProductService"),h=(0,a.useState)(),y=(h[0],h[1]),j=function(){if(console.log("[ ITEM ]",{tokenData:o}),!o||!o.items)return c({error:"Token is invalid"}),!1;var e=o.items.every(function(e){return e.price_id&&e.product_id&&String(e.price_id).startsWith("price_")&&String(e.product_id).startsWith("prod_")});return e||c({error:"Token is invalid"}),e},b=(t=(0,l.Z)(d().mark(function e(){return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,p.getProducts({price_ids:o.items.map(function(e){return e.price_id})});case 3:Object.values(e.sent.data).forEach(function(e){f(C(C({},e),{},{price:C(C({},e.price),{},{qty:1})}))}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error("[ getProducts ( error )]",e.t0);case 10:case"end":return e.stop()}},e,null,[[0,7]])})),function(){return t.apply(this,arguments)}),_=(n=(0,l.Z)(d().mark(function e(){var t,n,i;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!r){e.next=12;break}return e.prev=1,e.next=4,x.decryptJWT({token:r,secret:"secretKey",algorithm:"HS256"});case 4:null!=(t=e.sent)&&t.decoded&&(console.log("[ JWT DECODE (SUCCESS) ]",t.decoded),c(t.decoded)),e.next=12;break;case 8:e.prev=8,e.t0=e.catch(1),c({error:null===e.t0||void 0===e.t0||null===(n=e.t0.detail)||void 0===n?void 0:n.detail}),console.error("[ JWT DECODE (ERROR) ]",null===e.t0||void 0===e.t0||null===(i=e.t0.detail)||void 0===i?void 0:i.detail);case 12:case"end":return e.stop()}},e,null,[[1,8]])})),function(){return n.apply(this,arguments)});(0,a.useEffect)(function(){console.log("[ USE EFFECT ]",o,r),r&&void 0===o&&_()},[r]);var w=m();return((0,a.useEffect)(function(){y(w),null!=o&&o.items&&j()&&b()},[c]),r&&(null==o||!o.error)&&j())?(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:P.__hash,children:P}),(0,g.jsxs)("div",{className:"jsx-".concat(P.__hash)+" verify-payment",children:[(0,g.jsx)("div",{className:"jsx-".concat(P.__hash)+" verify-payment--header"}),(0,g.jsxs)("div",{className:"jsx-".concat(P.__hash)+" verify-payment--content",children:[o.items&&(0,g.jsx)(E.Z,{}),(0,g.jsx)("div",{className:"jsx-".concat(P.__hash)+" verify-payment--content__contact-form",children:(0,g.jsx)(Z.Z,{user:{email:o.email,name:o.name,phone:o.phone},onSubmit:function(e){console.log("[ ON SUBMIT ]",e)},submit:{text:"payment info"}})})]})]})]}):(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:P.__hash,children:P}),(0,g.jsx)("div",{className:"jsx-".concat(P.__hash)+" verify-payment__token-needed",children:(0,g.jsx)("div",{className:"jsx-".concat(P.__hash),children:String(null==o?void 0:o.error)||"No token is present, assure you clicked the right link."})})]})},T=[".d-flex.jsx-1831036712,.verify-email__content--loader.jsx-1831036712,.verify-email__content.jsx-1831036712{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".verify-email.jsx-1831036712{border-radius:var(--border-radius);margin:var(--s-element) 0;color:var(--primary);background-color:var(--gray-90);height:100%;}","@media (max-width:1100px){.verify-email.jsx-1831036712{margin:var(--s-element) var(--s-padding);width:var(--s-padding-width);-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}}",".verify-email__content.jsx-1831036712{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;gap:var(--s-element);padding:var(--s-padding);width:var(--s-padding-width);-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;height:100%;}",".verify-email__content--loader.jsx-1831036712{height:100%;}","@media (max-width:1100px){.verify-email__content--loader.jsx-1831036712{height:100%;}}",".verify-email__content--success.jsx-1831036712{height:100%;}",".verify-email__content__sign-in.jsx-1831036712{width:100%;}",".verify-email__content__sign-in--title.jsx-1831036712{font-size:var(--s-2);color:var(--gray-20);line-height:2;}"];function A(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function I(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?A(Object(n),!0).forEach(function(t){(0,c.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):A(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}T.__hash="1831036712";var z="00112233445566778899AABBCCDDEEFF00112233445566778899AABBCCDDEEFF".trim(),M=function(e){var t,n,r,s,o,c,u=e.token,f=e.onSuccess,b=(0,a.useState)({status:"verifying_email"}),_=b[0],w=b[1],k=(0,v.ko)("IMemberService"),O=(0,j.dd)().openModal,S=(t=(0,l.Z)(d().mark(function e(){var t;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(z){e.next=2;break}return e.abrupt("return");case 2:if(u){e.next=5;break}return w({status:"no_token_present"}),e.abrupt("return");case 5:return e.next=7,k.decryptJWT({token:u,secret:z,algorithm:"HS256"});case 7:(t=e.sent)&&w(t);case 9:case"end":return e.stop()}},e)})),function(){return t.apply(this,arguments)}),P=(n=(0,l.Z)(d().mark(function e(){var t,n,r,i;return d().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=null==_||null===(t=_.fields)||void 0===t||null===(t=t.find(function(e){return"password"==e.name}))||void 0===t?void 0:t.value,(r=_.customer).metadata.password=n,e.next=5,k.updateCustomerProfile(r.id,r);case 5:(i=e.sent)&&(N(),f(i.email));case 7:case"end":return e.stop()}},e)})),function(){return n.apply(this,arguments)}),N=function(){O((0,g.jsx)(h.Z,{email:_.customer.email}))};return(0,a.useEffect)(function(){S()},[u]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:T.__hash,children:T}),(0,g.jsx)("div",{className:"jsx-".concat(T.__hash)+" verify-email",children:(0,g.jsxs)("div",{className:"jsx-".concat(T.__hash)+" "+"verify-email__content".concat("verification_success"===_.status?" verify-email__content--success":""),children:[(0,g.jsx)("div",{className:"jsx-".concat(T.__hash)+" verify-email__content--loader",children:(0,g.jsx)(m.Z,{position:"relative",text:(o="",(c=function(e){return"string"==typeof e})(_.status)?o=String(_.status):c(_.detail)?o=String(_.detail):null!==(r=_.detail)&&void 0!==r&&r.detail&&c(null===(s=_.detail)||void 0===s?void 0:s.detail)&&(o=_.detail.detail),(0,x.Z)(o)),dots:(null==_?void 0:_.status)!=void 0&&["verifying_email"].includes(null==_?void 0:_.status)})}),"incomplete"==_.status&&(null==_?void 0:_.fields)&&(0,g.jsx)(p.Z,{title:String(null==_?void 0:_.detail)||void 0,onChange:function(e){var t,n,r=e.target,i=r.name,a=r.value,s=null==_?void 0:_.fields,o=function(e){return null==s?void 0:s.find(function(t){return t.name===e})},c=null===(t=o("password"))||void 0===t?void 0:t.value,l=null===(n=o("confirm_password"))||void 0===n?void 0:n.value,u=null==s?void 0:s.map(function(e){if(e.name===i){var t=I(I({},e),{},{value:a});return"confirm_password"===i&&c!==a&&""!==c||"password"===i&&l!==a&&""!==l?t.error="Not Same as Password":t.error&&delete t.error,t}return e});w(I(I({},_),{},{fields:u}))},fields:_.fields,onSubmit:P}),"verification_success"===_.status&&_.customer.email&&(0,g.jsx)("div",{className:"jsx-".concat(T.__hash)+" verify-email__content__sign-in",children:(0,g.jsx)(y.Z,{onClick:N,children:"Login"})})]})})]})},W=function(){return(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:s.__hash,children:s}),(0,g.jsxs)("div",{className:"jsx-".concat(s.__hash)+" verify__default",children:[(0,g.jsx)("h1",{className:"jsx-".concat(s.__hash),children:"Verify"}),(0,g.jsx)("p",{className:"jsx-".concat(s.__hash),children:"Here is where you will verify a token in which you should have received via a specified contact method."})]})]})},q=function(){var e=(0,o.useRouter)(),t=(e.pathname,e.query),n=(0,a.useState)(""),r=n[0],c=n[1],l=(0,a.useState)(),u=l[0],d=l[1],f=(0,a.useState)(),v=f[0],m=f[1],x={"sign-in":(0,g.jsx)(k.Z,{email:u}),email:(0,g.jsx)(w,{token:v,onSuccess:function(e){return d(e)}}),password:(0,g.jsx)(M,{token:v,onSuccess:function(e){return d(e)}}),account:(0,g.jsx)(S,{}),payment:(0,g.jsx)(F,{token:v})};return(0,a.useEffect)(function(){"string"==typeof t.vid&&c(t.vid),"string"==typeof t.token&&m(t.token)},[t,u,m]),(0,g.jsxs)(g.Fragment,{children:[(0,g.jsx)(i(),{id:s.__hash,children:s}),(0,g.jsx)("div",{className:"jsx-".concat(s.__hash)+" verify",children:void 0===x[r]?(0,g.jsx)(W,{}):x[r]})]})}},2624:function(e,t,n){"use strict";var r=n(9499),i=n(29),a=n(4687),s=n.n(a),o=n(7294);function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach(function(t){(0,r.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}t.Z=function(){var e=(0,o.useState)({user_agent:"",user_agent_data:null,public_ip:""}),t=e[0],n=e[1];return(0,o.useEffect)(function(){var e,t=(e=(0,i.Z)(s().mark(function e(){var t,r,i;return s().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n({user_agent:window.navigator.userAgent,user_agent_data:"userAgentData"in(t=navigator)?t.userAgentData:null}),e.prev=4,e.next=7,fetch("https://ipapi.co/json/");case 7:if(!(r=e.sent).ok){e.next=16;break}return e.next=11,r.json();case 11:i=e.sent.ip,n(function(e){return l(l({},e),{},{public_ip:i})}),e.next=17;break;case 16:console.error("Failed to fetch IP address information.");case 17:e.next=22;break;case 19:e.prev=19,e.t0=e.catch(4),console.error("Error fetching IP address information:",e.t0);case 22:case"end":return e.stop()}},e,null,[[4,19]])})),function(){return e.apply(this,arguments)});return t(),window.addEventListener("load",t),function(){window.removeEventListener("load",t)}},[]),t}},7273:function(e,t,n){"use strict";n.d(t,{Z:function(){return f}});var r=n(6835),i=n(8151),a=n.n(i),s=n(7294),o=[".d-flex.jsx-2074756550,.ui-view-layout__header.jsx-2074756550,.ui-view-layout__actions.jsx-2074756550,.ui-view-layout.jsx-2074756550{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".ui-view-layout.jsx-2074756550{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;}",".ui-view-layout__view.jsx-2074756550,.ui-view-layout__actions.jsx-2074756550{width:100%;}",".ui-view-layout__header.jsx-2074756550{width:var(--s-padding-width);-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;padding:var(--s-padding);}",".ui-view-layout__header-title.jsx-2074756550{font-size:var(--s-1);--ui-icon-color:var(--gray-30);color:var(--gray-30);text-transform:capitalize;}"];o.__hash="2074756550";var c=n(384),l=n(5531),u=function(e,t){var n=(0,s.useState)(),r=n[0],i=n[1];return(0,s.useEffect)(function(){i(t&&e[t]?e[t]:e?e[0]:void 0)},[e,t,i]),[r,function(t){var n=String(t);e&&e[n]&&i(e[n])}]},d=n(5893),f=function(e){var t=e.views,n=e.view,i=e.title,s=e.showActions,f=e.showTitle,v=void 0!==f&&f,m=u(t,n),x=(0,r.Z)(m,2),p=x[0],h=x[1],y=v&&i?(0,c.Z)(i):v&&p?"string"==typeof p&&(0,c.Z)(p):"";return t&&p?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a(),{id:o.__hash,children:o}),(0,d.jsxs)("div",{className:"jsx-".concat(o.__hash)+" ui-view-layout",children:[y&&(0,d.jsx)("div",{className:"jsx-".concat(o.__hash)+" ui-view-layout__header",children:(0,d.jsx)("div",{className:"jsx-".concat(o.__hash)+" ui-view-layout__header-title",children:y})}),void 0!==s&&s&&t&&(0,d.jsx)("div",{className:"jsx-".concat(o.__hash)+" ui-view-layout__actions",children:Object.keys(t).map(function(e){return(0,d.jsx)("button",{onClick:function(){return h(e)},className:"jsx-".concat(o.__hash),children:e},e)})}),(0,d.jsx)("div",{className:"jsx-".concat(o.__hash)+" ui-view-layout__view",children:p||(0,d.jsx)("div",{className:"jsx-".concat(o.__hash),children:"View not found"})})]})]}):(0,d.jsx)(l.Z,{})}}}]);