(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5675],{7403:function(e,t,r){"use strict";var i=r(8416),o=r(7069),n=r(3171),a=r(968),s=["src","srcSet","sizes","height","width","decoding","className","style","fetchPriority","placeholder","loading","unoptimized","fill","onLoadRef","onLoadingCompleteRef","setBlurComplete","setShowAltText","onLoad","onError"];function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,i)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach(function(t){a(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"Image",{enumerable:!0,get:function(){return C}});var u=r(8754),d=r(1757),f=r(5893),p=d._(r(7294)),g=u._(r(3935)),h=u._(r(90)),m=r(852),v=r(2011),b=r(8681);r(3696);var y=r(7318),w=u._(r(5437)),j={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0};function O(e,t,r,i,o,n){var a=null==e?void 0:e.src;e&&e["data-loaded-src"]!==a&&(e["data-loaded-src"]=a,("decode"in e?e.decode():Promise.resolve()).catch(function(){}).then(function(){if(e.parentElement&&e.isConnected){if("empty"!==t&&o(!0),null==r?void 0:r.current){var n=new Event("load");Object.defineProperty(n,"target",{writable:!1,value:e});var a=!1,s=!1;r.current(l(l({},n),{},{nativeEvent:n,currentTarget:e,target:e,isDefaultPrevented:function(){return a},isPropagationStopped:function(){return s},persist:function(){},preventDefault:function(){a=!0,n.preventDefault()},stopPropagation:function(){s=!0,n.stopPropagation()}}))}(null==i?void 0:i.current)&&i.current(e)}}))}function P(e){var t=n(p.version.split(".",2),2),r=t[0],i=t[1],o=parseInt(r,10),a=parseInt(i,10);return o>18||18===o&&a>=3?{fetchPriority:e}:{fetchpriority:e}}var S=(0,p.forwardRef)(function(e,t){var r=e.src,i=e.srcSet,n=e.sizes,a=e.height,c=e.width,u=e.decoding,d=e.className,g=e.style,h=e.fetchPriority,m=e.placeholder,v=e.loading,b=e.unoptimized,y=e.fill,w=e.onLoadRef,j=e.onLoadingCompleteRef,S=e.setBlurComplete,z=e.setShowAltText,C=(e.onLoad,e.onError),_=o(e,s);return(0,f.jsx)("img",l(l(l({},_),P(h)),{},{loading:v,width:c,height:a,decoding:u,"data-nimg":y?"fill":"1",className:d,style:g,sizes:n,srcSet:i,src:r,ref:(0,p.useCallback)(function(e){t&&("function"==typeof t?t(e):"object"==typeof t&&(t.current=e)),e&&(C&&(e.src=e.src),e.complete&&O(e,m,w,j,S,b))},[r,m,w,j,S,C,b,t]),onLoad:function(e){O(e.currentTarget,m,w,j,S,b)},onError:function(e){z(!0),"empty"!==m&&S(!0),C&&C(e)}}))});function z(e){var t=e.isAppRouter,r=e.imgAttributes,i=l({as:"image",imageSrcSet:r.srcSet,imageSizes:r.sizes,crossOrigin:r.crossOrigin,referrerPolicy:r.referrerPolicy},P(r.fetchPriority));return t&&g.default.preload?(g.default.preload(r.src,i),null):(0,f.jsx)(h.default,{children:(0,f.jsx)("link",l({rel:"preload",href:r.srcSet?void 0:r.src},i),"__nimg-"+r.src+r.srcSet+r.sizes)})}var C=(0,p.forwardRef)(function(e,t){var r=(0,p.useContext)(y.RouterContext),o=(0,p.useContext)(b.ImageConfigContext),a=(0,p.useMemo)(function(){var e=j||o||v.imageConfigDefault,t=[].concat(i(e.deviceSizes),i(e.imageSizes)).sort(function(e,t){return e-t}),r=e.deviceSizes.sort(function(e,t){return e-t});return l(l({},e),{},{allSizes:t,deviceSizes:r})},[o]),s=e.onLoad,c=e.onLoadingComplete,u=(0,p.useRef)(s);(0,p.useEffect)(function(){u.current=s},[s]);var d=(0,p.useRef)(c);(0,p.useEffect)(function(){d.current=c},[c]);var g=n((0,p.useState)(!1),2),h=g[0],O=g[1],P=n((0,p.useState)(!1),2),C=P[0],_=P[1],x=(0,m.getImgProps)(e,{defaultLoader:w.default,imgConf:a,blurComplete:h,showAltText:C}),E=x.props,R=x.meta;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(S,l(l({},E),{},{unoptimized:R.unoptimized,placeholder:R.placeholder,fill:R.fill,onLoadRef:u,onLoadingCompleteRef:d,setBlurComplete:O,setShowAltText:_,ref:t})),R.priority?(0,f.jsx)(z,{isAppRouter:!r,imgAttributes:E}):null]})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},852:function(e,t,r){"use strict";r(3171);var i=r(968),o=r(7069),n=r(8416),a=["src","sizes","unoptimized","priority","loading","className","quality","width","height","fill","style","onLoad","onLoadingComplete","placeholder","blurDataURL","fetchPriority","layout","objectFit","objectPosition","lazyBoundary","lazyRoot"],s=["config"];function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,i)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach(function(t){i(e,t,r[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))})}return e}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImgProps",{enumerable:!0,get:function(){return g}}),r(3696);var u=r(6492),d=r(2011);function f(e){return void 0!==e.default}function p(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function g(e,t){var r,i,c,g,h=e.src,m=e.sizes,v=e.unoptimized,b=void 0!==v&&v,y=e.priority,w=void 0!==y&&y,j=e.loading,O=e.className,P=e.quality,S=e.width,z=e.height,C=e.fill,_=void 0!==C&&C,x=e.style,E=(e.onLoad,e.onLoadingComplete,e.placeholder),R=void 0===E?"empty":E,L=e.blurDataURL,I=e.fetchPriority,D=e.layout,k=e.objectFit,M=e.objectPosition,A=(e.lazyBoundary,e.lazyRoot,o(e,a)),N=t.imgConf,B=t.showAltText,F=t.blurComplete,q=t.defaultLoader,G=N||d.imageConfigDefault;if("allSizes"in G)i=G;else{var T=[].concat(n(G.deviceSizes),n(G.imageSizes)).sort(function(e,t){return e-t}),W=G.deviceSizes.sort(function(e,t){return e-t});i=l(l({},G),{},{allSizes:T,deviceSizes:W})}var U=A.loader||q;delete A.loader,delete A.srcSet;var H="__next_img_default"in U;if(H){if("custom"===i.loader)throw Error('Image with src "'+h+'" is missing "loader" prop.\nRead more: https://nextjs.org/docs/messages/next-image-missing-loader')}else{var V=U;U=function(e){return e.config,V(o(e,s))}}if(D){"fill"===D&&(_=!0);var J={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[D];J&&(x=l(l({},x),J));var Y={responsive:"100vw",fill:"100vw"}[D];Y&&!m&&(m=Y)}var $="",K=p(S),Q=p(z);if("object"==typeof(r=h)&&(f(r)||void 0!==r.src)){var X=f(h)?h.default:h;if(!X.src)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received "+JSON.stringify(X));if(!X.height||!X.width)throw Error("An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received "+JSON.stringify(X));if(c=X.blurWidth,g=X.blurHeight,L=L||X.blurDataURL,$=X.src,!_){if(K||Q){if(K&&!Q){var Z=K/X.width;Q=Math.round(X.height*Z)}else if(!K&&Q){var ee=Q/X.height;K=Math.round(X.width*ee)}}else K=X.width,Q=X.height}}var et=!w&&("lazy"===j||void 0===j);(!(h="string"==typeof h?h:$)||h.startsWith("data:")||h.startsWith("blob:"))&&(b=!0,et=!1),i.unoptimized&&(b=!0),H&&h.endsWith(".svg")&&!i.dangerouslyAllowSVG&&(b=!0),w&&(I="high");var er=p(P),ei=Object.assign(_?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:k,objectPosition:M}:{},B?{}:{color:"transparent"},x),eo=F||"empty"===R?null:"blur"===R?'url("data:image/svg+xml;charset=utf-8,'+(0,u.getImageBlurSvg)({widthInt:K,heightInt:Q,blurWidth:c,blurHeight:g,blurDataURL:L||"",objectFit:ei.objectFit})+'")':'url("'+R+'")',en=eo?{backgroundSize:ei.objectFit||"cover",backgroundPosition:ei.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:eo}:{},ea=function(e){var t=e.config,r=e.src,i=e.unoptimized,o=e.width,a=e.quality,s=e.sizes,c=e.loader;if(i)return{src:r,srcSet:void 0,sizes:void 0};var l=function(e,t,r){var i=e.deviceSizes,o=e.allSizes;if(r){for(var a,s=/(^|\s)(1?\d?\d)vw/g,c=[];a=s.exec(r);a)c.push(parseInt(a[2]));if(c.length){var l=.01*Math.min.apply(Math,c);return{widths:o.filter(function(e){return e>=i[0]*l}),kind:"w"}}return{widths:o,kind:"w"}}return"number"!=typeof t?{widths:i,kind:"w"}:{widths:n(new Set([t,2*t].map(function(e){return o.find(function(t){return t>=e})||o[o.length-1]}))),kind:"x"}}(t,o,s),u=l.widths,d=l.kind,f=u.length-1;return{sizes:s||"w"!==d?s:"100vw",srcSet:u.map(function(e,i){return c({config:t,src:r,quality:a,width:e})+" "+("w"===d?e:i+1)+d}).join(", "),src:c({config:t,src:r,quality:a,width:u[f]})}}({config:i,src:h,unoptimized:b,width:K,quality:er,sizes:m,loader:U});return{props:l(l({},A),{},{loading:et?"lazy":j,fetchPriority:I,width:K,height:Q,decoding:"async",className:O,style:l(l({},ei),en),sizes:ea.sizes,srcSet:ea.srcSet,src:ea.src}),meta:{unoptimized:b,priority:w,placeholder:R,fill:_}}}},6492:function(e,t){"use strict";function r(e){var t=e.widthInt,r=e.heightInt,i=e.blurWidth,o=e.blurHeight,n=e.blurDataURL,a=e.objectFit,s=i?40*i:t,c=o?40*o:r,l=s&&c?"viewBox='0 0 "+s+" "+c+"'":"";return"%3Csvg xmlns='http://www.w3.org/2000/svg' "+l+"%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='"+(l?"none":"contain"===a?"xMidYMid":"cover"===a?"xMidYMid slice":"none")+"' style='filter: url(%23b);' href='"+n+"'/%3E%3C/svg%3E"}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getImageBlurSvg",{enumerable:!0,get:function(){return r}})},4031:function(e,t,r){"use strict";var i=r(3171);Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{getImageProps:function(){return c},default:function(){return l}});var o=r(8754),n=r(852),a=r(7403),s=o._(r(5437)),c=function(e){for(var t=(0,n.getImgProps)(e,{defaultLoader:s.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}}).props,r=0,o=Object.entries(t);r<o.length;r++){var a=i(o[r],2),c=a[0];void 0===a[1]&&delete t[c]}return{props:t}},l=a.Image},5437:function(e,t){"use strict";function r(e){var t=e.config,r=e.src,i=e.width,o=e.quality;return t.path+"?url="+encodeURIComponent(r)+"&w="+i+"&q="+(o||75)}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return i}}),r.__next_img_default=!0;var i=r},5675:function(e,t,r){e.exports=r(4031)}}]);