(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{41440:function(e,t,n){"use strict";n.r(t);var r=n(77846);t.default=r.default},77846:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return index_Index}});var r=n(65003),i=n.n(r),o=n(67294),a=[".d-flex.jsx-838213672,.home__half.jsx-838213672{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".d-pad.jsx-838213672,.home__half.jsx-838213672{padding:var(--padding);width:calc(100% - var(--padding) * 2);}",".home__clouds.jsx-838213672{height:100vh;width:100vw;}",".background-video.jsx-838213672{position:fixed;top:0;right:0;bottom:0;min-width:100vw;margin:0;overflow:hidden;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);}",".home.jsx-838213672{width:100%;color:var(--gray-20);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0;height:100%;min-height:500px;}",".home--title.jsx-838213672{width:100%;text-align:center;padding:var(--element-height) 0 0;text-transform:capitalize;font-size:var(--s-1);}",".home.jsx-838213672 .home__full.jsx-838213672{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;gap:var(--padding);margin:var(--padding) 0;}",".home.jsx-838213672 .home__full--title.jsx-838213672{width:100%;text-align:center;text-transform:capitalize;font-size:var(--s-2);}",".home.jsx-838213672 .home__sub-title.jsx-838213672{width:100%;text-transform:capitalize;font-size:var(--s-4);color:var(--gray-40);}",".home__half.jsx-838213672{-webkit-box-pack:justify;-webkit-justify-content:space-between;-ms-flex-pack:justify;justify-content:space-between;}",".home__sub-title.jsx-838213672{color:var(--gray-40);font-size:var(--s-4);}"];a.__hash="838213672";var s=n(66609),l=n(41927),c=n(68991),d=n(85893),index_Index=function(){var e=(0,o.useState)(!1),t=(e[0],e[1]);return(0,o.useEffect)(function(){t(!0)},[]),(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(i(),{id:a.__hash,children:a}),(0,d.jsx)("div",{className:"jsx-".concat(a.__hash)+" home",children:(0,d.jsx)("div",{style:{height:"500px",width:"100%"},className:"jsx-".concat(a.__hash)+" home__full",children:(0,d.jsx)(s.Z,{svgOptions:{depth:100},svg:(0,d.jsx)(l.a,{icon:"".concat(c.Z.merchant.name,"-logo")}),size:{x:200,y:300,z:100}})})})]})}},66609:function(e,t,n){"use strict";n.d(t,{Z:function(){return TJSCube_controller_TJSCube}});var r=n(65003),i=n.n(r),o=n(67294),a=n(20745),s=n(53459),l=n(15029),c=n(99477),d=n(30398),u=n(89646),f=n(81367),h=n(17360),x=[".tjscube__container.jsx-3364526432{width:100%;border:solid 1px;}"];x.__hash="3364526432";var p=n(85893);(0,s.e)({OrbitControls:d.z});var TJSCubeContent=function(e){var t=e.svg,n=e.svgOptions,r=e.size,i=(0,o.useRef)(null),l=(0,o.useRef)(null),h=(0,s.A)(),x=h.scene,m=h.camera,v=(0,o.useState)(null),b=v[0],g=v[1];return(0,o.useEffect)(function(){i.current&&l.current&&l.current.target.copy(i.current.position)},[i.current]),(0,o.useEffect)(function(){if(t&&"string"==typeof t)new f.u().load(t,function(e){var t=e.paths.flatMap(function(e){return e.toShapes(!0)}),r=new c.ExtrudeGeometry(t,{depth:(null==n?void 0:n.depth)||2,bevelEnabled:(null==n?void 0:n.bevelEnabled)||!1});i.current&&(i.current.geometry=r)},void 0,function(e){console.error("Error loading SVG:",e)}),g(t);else if(o.isValidElement(t)){var e=document.createElement("div");document.body.appendChild(e);var r=(0,a.createRoot)(e);r.render(t),setTimeout(function(){var t=e.querySelector("svg");if(t){var n=new XMLSerializer().serializeToString(t),i=new Blob([n],{type:"image/svg+xml"});g(URL.createObjectURL(i))}else console.error("SVG content is not properly rendered.");r.unmount(),e.remove()},0)}},[t]),(0,o.useEffect)(function(){if(b)new f.u().load(b,function(e){var t=e.paths.flatMap(function(e){return e.toShapes(!0)}),r=new c.ExtrudeGeometry(t,{depth:(null==n?void 0:n.depth)||2,bevelEnabled:(null==n?void 0:n.bevelEnabled)||!1}),o=new c.MeshStandardMaterial({color:(null==n?void 0:n.color)||"#FFFFFF"}),a=new c.Mesh(r,o);a.scale.multiplyScalar(.1),console.log("[ mesh ]",i.current),a.position.set(-50,50,0),a.rotation.x=-Math.PI/2,i.current&&x.remove(i.current),x.add(a)},void 0,function(e){console.error("Error loading SVG:",e)});else if(r&&r.x&&r.y&&r.z){var e=new c.BoxGeometry(r.x,r.y,r.z),t=new c.MeshStandardMaterial({color:(null==n?void 0:n.color)||"#FFFFFF"}),o=new c.Mesh(e,t);i.current&&x.remove(i.current),i.current=o,x.add(o)}},[b,n,x,r]),(0,s.C)(function(){l.current&&l.current.update()}),(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)("ambientLight",{}),(0,p.jsx)(u.c,{makeDefault:!0,position:[0,-45,300]}),(0,p.jsx)(d.z,{ref:l,args:[m]})]})},TJSCube_controller_TJSCube=function(e){var t=e.svg,n=e.svgOptions,r=e.size,o=(0,h.Z)(),a=o.width,s=o.height,c=Math.abs(s*a)/function(e,t){for(;0!==t;){var n=e;e=t,t=n%t}return e}(s,a);return(0,p.jsxs)(p.Fragment,{children:[(0,p.jsx)(i(),{id:x.__hash,children:x}),JSON.stringify(c),(0,p.jsx)("div",{style:{aspectRatio:"".concat(s,"/").concat(a)},className:"jsx-".concat(x.__hash)+" tjscube__container",children:(0,p.jsx)(l.Xz,{children:(0,p.jsx)(TJSCubeContent,{svg:t,svgOptions:n,size:r})})})]})}},48312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(41440)}])}},function(e){e.O(0,[737,665,774,888,179],function(){return e(e.s=48312)}),_N_E=e.O()}]);