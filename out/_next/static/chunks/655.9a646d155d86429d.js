(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[655],{37655:function(e,t,r){"use strict";var n=r(23322),o=r(16089),i=r(55667),a=r(81961),u=r(67731);Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return y}});var c=r(38754),s=r(85893),l=c._(r(67294)),d=c._(r(40090)),f={400:"Bad Request",404:"This page could not be found",405:"Method Not Allowed",500:"Internal Server Error"};function p(e){var t=e.res,r=e.err;return{statusCode:t&&t.statusCode?t.statusCode:r?r.statusCode:404}}var h={error:{fontFamily:'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',height:"100vh",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"},desc:{lineHeight:"48px"},h1:{display:"inline-block",margin:"0 20px 0 0",paddingRight:23,fontSize:24,fontWeight:500,verticalAlign:"top"},h2:{fontSize:14,fontWeight:400,lineHeight:"28px"},wrap:{display:"inline-block"}},y=function(e){i(c,e);var t,r=(t=function(){if("undefined"==typeof Reflect||!Reflect.construct||Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch(e){return!1}}(),function(){var e,r=u(c);if(t){var n=u(this).constructor;e=Reflect.construct(r,arguments,n)}else e=r.apply(this,arguments);return a(this,e)});function c(){return n(this,c),r.apply(this,arguments)}return o(c,[{key:"render",value:function(){var e=this.props,t=e.statusCode,r=e.withDarkMode,n=this.props.title||f[t]||"An unexpected error has occurred";return(0,s.jsxs)("div",{style:h.error,children:[(0,s.jsx)(d.default,{children:(0,s.jsx)("title",{children:t?t+": "+n:"Application error: a client-side exception has occurred"})}),(0,s.jsxs)("div",{style:h.desc,children:[(0,s.jsx)("style",{dangerouslySetInnerHTML:{__html:"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}"+(void 0===r||r?"@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}":"")}}),t?(0,s.jsx)("h1",{className:"next-error-h1",style:h.h1,children:t}):null,(0,s.jsx)("div",{style:h.wrap,children:(0,s.jsxs)("h2",{style:h.h2,children:[this.props.title||t?n:(0,s.jsx)(s.Fragment,{children:"Application error: a client-side exception has occurred (see the browser console for more information)"}),"."]})})]})]})}}]),c}(l.default.Component);y.displayName="ErrorPage",y.getInitialProps=p,y.origGetInitialProps=p,("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},38925:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"AmpStateContext",{enumerable:!0,get:function(){return n}});var n=r(38754)._(r(67294)).default.createContext({})},96452:function(e,t){"use strict";function r(e){var t=void 0===e?{}:e,r=t.ampFirst,n=t.hybrid,o=t.hasQuery;return void 0!==r&&r||void 0!==n&&n&&void 0!==o&&o}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"isInAmpMode",{enumerable:!0,get:function(){return r}})},40090:function(e,t,r){"use strict";var n=r(20968);function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{defaultHead:function(){return p},default:function(){return b}});var i=r(38754),a=r(61757),u=r(85893),c=a._(r(67294)),s=i._(r(26807)),l=r(38925),d=r(11295),f=r(96452);function p(e){void 0===e&&(e=!1);var t=[(0,u.jsx)("meta",{charSet:"utf-8"})];return e||t.push((0,u.jsx)("meta",{name:"viewport",content:"width=device-width"})),t}function h(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===c.default.Fragment?e.concat(c.default.Children.toArray(t.props.children).reduce(function(e,t){return"string"==typeof t||"number"==typeof t?e:e.concat(t)},[])):e.concat(t)}r(43696);var y=["name","httpEquiv","charSet","itemProp"];function v(e,t){var r,i,a,u,s=t.inAmpMode;return e.reduce(h,[]).reverse().concat(p(s).reverse()).filter((r=new Set,i=new Set,a=new Set,u={},function(e){var t=!0,n=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){n=!0;var o=e.key.slice(e.key.indexOf("$")+1);r.has(o)?t=!1:r.add(o)}switch(e.type){case"title":case"base":i.has(e.type)?t=!1:i.add(e.type);break;case"meta":for(var c=0,s=y.length;c<s;c++){var l=y[c];if(e.props.hasOwnProperty(l)){if("charSet"===l)a.has(l)?t=!1:a.add(l);else{var d=e.props[l],f=u[l]||new Set;("name"!==l||!n)&&f.has(d)?t=!1:(f.add(d),u[l]=f)}}}}return t})).reverse().map(function(e,t){var r=e.key||t;if(!s&&"link"===e.type&&e.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some(function(t){return e.props.href.startsWith(t)})){var i=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach(function(t){n(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}({},e.props||{});return i["data-href"]=i.href,i.href=void 0,i["data-optimized-fonts"]=!0,c.default.cloneElement(e,i)}return c.default.cloneElement(e,{key:r})})}var b=function(e){var t=e.children,r=(0,c.useContext)(l.AmpStateContext),n=(0,c.useContext)(d.HeadManagerContext);return(0,u.jsx)(s.default,{reduceComponentsToState:v,headManager:n,inAmpMode:(0,f.isInAmpMode)(r),children:t})};("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},26807:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return a}});var n=r(67294),o=n.useLayoutEffect,i=n.useEffect;function a(e){var t=e.headManager,r=e.reduceComponentsToState;function a(){if(t&&t.mountedInstances){var o=n.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(o,e))}}return o(function(){var r;return null==t||null==(r=t.mountedInstances)||r.add(e.children),function(){var r;null==t||null==(r=t.mountedInstances)||r.delete(e.children)}}),o(function(){return t&&(t._pendingUpdate=a),function(){t&&(t._pendingUpdate=a)}}),i(function(){return t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),function(){t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)}}),null}},43696:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"warnOnce",{enumerable:!0,get:function(){return r}});var r=function(e){}}}]);