(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[352],{2615:function(t,n,e){"use strict";e.d(n,{Z:function(){return ecommerce_transaction_Transaction}});var a=e(5003),i=e.n(a),r=e(7294),s=[".d-flex.jsx-2722411607,.transaction.jsx-2722411607 .transaction__header.jsx-2722411607 .transaction__title.jsx-2722411607,.transaction.jsx-2722411607{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;width:100%;}",".transaction.jsx-2722411607{-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;}",".transaction.jsx-2722411607 .transaction__header.jsx-2722411607{width:100%;}",".transaction.jsx-2722411607 .transaction__header.jsx-2722411607 .transaction__title.jsx-2722411607{-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;font-size:32px;color:var(--primary);padding:var(--padding) 0;}"];s.__hash="2722411607";var c=e(1163),o=e(2031),l=e(5893),ecommerce_transaction_Transaction=function(){var t=(0,c.useRouter)(),n=(0,r.useState)(null),e=n[0],a=n[1];return(0,r.useEffect)(function(){var n;if("string"==typeof(null===(n=t.query)||void 0===n?void 0:n.token)&&null==e){var i=(0,o.N)(t.query.token,"EncryptionKey".trim());null!=i&&i.line_items&&(null==i||i.line_items.forEach(function(t,n){i.line_items[n]={name:t.name}})),a(i)}},[null==t?void 0:t.query]),(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(i(),{id:s.__hash,children:s}),(0,l.jsxs)("div",{className:"jsx-".concat(s.__hash)+" transaction",children:[(0,l.jsx)("div",{className:"jsx-".concat(s.__hash)+" transaction__header",children:(0,l.jsx)("div",{className:"jsx-".concat(s.__hash)+" transaction__title",children:(null==e?void 0:e.total)&&"Success"})}),(0,l.jsx)("div",{className:"jsx-".concat(s.__hash)+" transaction__content"})]}),JSON.stringify(e)]})}},2413:function(t,n,e){"use strict";e.r(n);var a=e(2615);n.default=a.Z},2031:function(t,n,e){"use strict";e.d(n,{N:function(){return decryptString},W:function(){return encryptString}});var a=e(6835),i=e(2474),r=e.n(i),s=e(8764).Buffer;function encryptString(t,n){if(n){var e=r().createHash("sha256");e.update(n);var a=e.digest(),i=r().randomBytes(16),c=r().createCipheriv("aes-256-cbc",a,i),o=c.update(t);return o=s.concat([o,c.final()]),i.toString("hex")+":"+o.toString("hex")}}function decryptString(t,n){if(!n||!t)return null;var e=r().createHash("sha256");e.update(n);var i=e.digest(),c=t.split(":"),o=(0,a.Z)(c,2),l=o[0],u=o[1],f=s.from(l,"hex"),_=s.from(u,"hex"),d=r().createDecipheriv("aes-256-cbc",i,f),x=d.update(_);return(x=s.concat([x,d.final()]))?JSON.parse(String(x)):null}},8510:function(t,n,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/transaction",function(){return e(2413)}])}},function(t){t.O(0,[714,969,774,888,179],function(){return t(t.s=8510)}),_N_E=t.O()}]);