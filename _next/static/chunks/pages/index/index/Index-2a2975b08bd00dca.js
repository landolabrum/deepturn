(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5635],{54909:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return S}});var r=n(8151),i=n.n(r),a=n(67294),o=[".d-flex.jsx-603837347,.index.jsx-603837347 .index__full--title.jsx-603837347{display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;}",".d-pad.jsx-603837347{padding:var(--padding);width:calc(100% - var(--padding) * 2);}",".index__clouds.jsx-603837347{height:100vh;width:100vw;}",".background-video.jsx-603837347{position:fixed;top:0;right:0;bottom:0;min-width:100vw;margin:0;overflow:hidden;-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);}",".index.jsx-603837347{width:100%;color:var(--gray-20);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;-webkit-align-items:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0;height:100%;min-height:500px;gap:var(--s-9);position:relative;}",".index--title.jsx-603837347{width:100%;text-align:center;padding:var(--element-height) 0 0;text-transform:capitalize;font-size:var(--s-1);}",".index.jsx-603837347 .index__full.jsx-603837347{width:var(--padding-width);display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-flex-wrap:wrap;-ms-flex-wrap:wrap;flex-wrap:wrap;gap:var(--padding);margin:0 0 var(--padding);}",".index.jsx-603837347 .index__full--five.jsx-603837347{height:80vw;z-index:1111;width:100%;}",".index.jsx-603837347 .index__full--title.jsx-603837347{width:100%;-webkit-box-pack:start;-webkit-justify-content:flex-start;-ms-flex-pack:start;justify-content:flex-start;text-transform:capitalize;color:var(--gray-70);--ui-icon-color:var(--gray-70);gap:var(--s-9);font-size:1.8rem;white-space:nowrap;font-family:Play;line-height:1;--ui-icon-size:2.3rem;}",".index.jsx-603837347 .index__full-padding.jsx-603837347{position:relative;border-radius:var(--border-radius);white-space:nowrap;outline:solid 1px var(--gray-90);background-color:var(--gray-90);padding:var(--s-9) var(--padding);width:calc(var(--padding-width) - var(--padding) * 2);margin:0;}",".index.jsx-603837347 .index__full-padding--title.jsx-603837347{width:var(--padding-width);padding:var(--s-9) var(--s-1);}",".index.jsx-603837347 .index__sub-title.jsx-603837347{width:100%;text-transform:capitalize;font-size:var(--s-4);color:var(--gray-40);}",".index__half.jsx-603837347{display:block;width:50%;}",".index__sub-title.jsx-603837347{color:var(--gray-40);font-size:var(--s-4);}"];o.__hash="603837347";var s=n(20978),l=n(6515),d=n(40384),c=n(68737),u=n(50029),x=n(59499),f=n(64687),p=n.n(f),v=n(20745),h=n(1300),m=n(15029),w=n(99477),g=n(30398),b=n(89646),y=n(81367),j=n(85893);function _(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function k(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?_(Object(n),!0).forEach(function(t){(0,x.Z)(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):_(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}(0,h.e)({OrbitControls:g.z});var z=function(e,t){var n=e?Number(e.toFixed(0)):0;return t&&(n*=t),n},O=function(e){var t=e.svg,n=e.size,r=e.color,i=e.animate,o=e.svgOptions,s=e.metalness;e.display,(0,a.useRef)(0);var l=(0,a.useRef)(null);(0,a.useRef)(null);var d=(0,a.useRef)(null),c=(0,a.useRef)(null),x=(0,h.A)(),f=x.scene,m=x.camera,_=(0,a.useState)(null),O=_[0],E=_[1],S=(0,a.useState)([0,0,null!=n&&n.z?2*n.z:0]),M=S[0],F=S[1],P=(0,a.useState)({x:0,y:0,z:0}),N=P[0];P[1],(0,a.useEffect)(function(){if(t&&"string"==typeof t)new y.u().load(t,function(e){var t=e.paths.flatMap(function(e){return e.toShapes(!0)}),r=new w.ExtrudeGeometry(t,{depth:(null==n?void 0:n.z)||2});l.current&&(l.current.geometry=r)},void 0,function(e){console.error("Error loading SVG:",e)}),E(t);else if(a.isValidElement(t)){var e=document.createElement("div");document.body.appendChild(e);var r=(0,v.createRoot)(e);r.render(t),setTimeout(function(){var t=e.querySelector("svg");if(t){var n=new XMLSerializer().serializeToString(t).replaceAll('fill="currentColor"',""),i=new Blob([n],{type:"image/svg+xml"});E(URL.createObjectURL(i))}else console.error("SVG content is not properly rendered.");r.unmount(),e.remove()},0)}},[t]);var Z=new w.Color(14737632);(0,a.useEffect)(function(){if(O)new y.u().load(O,function(e){var t=e.paths.flatMap(function(e){return e.toShapes(!0)}),a=new w.ExtrudeGeometry(t,k({depth:(null==n?void 0:n.z)||2},o)),d=new w.Box3().setFromObject(new w.Mesh(a)),c=new w.Vector3;d.getCenter(c),a.translate(-c.x,-c.y,-c.z);var u=new w.MeshStandardMaterial({color:r||Z,metalness:s||0}),x=new w.Mesh(a,u);if(l.current&&f.remove(l.current),l.current=x,0===N.x)x.rotation.x=-Math.PI;else if(l.current&&null!=i&&i.rotate){var p=N.x,v=N.y,h=N.z;x.rotation.set(p,v,h)}f.add(x)},void 0,function(e){console.error("Error loading SVG:",e)});else if(n&&n.x&&n.y&&n.z){var e=new w.BoxGeometry(n.x,n.y,n.z),t=new w.MeshStandardMaterial({color:r||"#FFFFFF",metalness:s||0}),a=new w.Group,d=new w.Mesh(e,t);if(l.current&&f.remove(l.current),l.current=a,0===N.x)a.rotation.x=-Math.PI;else if(l.current&&null!=i&&i.rotate){var c=N.x,u=N.y,x=N.z;a.rotation.set(c,u,x)}a.add(d),f.add(a)}var p=Math.max((null==n?void 0:n.x)||0,(null==n?void 0:n.y)||0,(null==n?void 0:n.z)||0)*(1+.1*Math.PI);n&&F([.5*n.x,0,p])},[O,f,n,N]),z(null==n?void 0:n.x),z(null==n?void 0:n.y,.5),z(null==n?void 0:n.z,1.5),z(null==n?void 0:n.x),z(null==n?void 0:n.y,.5),z(null==n?void 0:n.z,1.5);var C=(0,a.useState)({spotlight:null});return C[0],C[1],(0,a.useEffect)(function(){var e,i=(e=(0,u.Z)(p().mark(function e(){return p().wrap(function(e){for(;;)switch(e.prev=e.next){case 0:new y.u().load(t,function(e){var t=e.paths.flatMap(function(e){return e.toShapes(!0)}),i=new w.ExtrudeGeometry(t,{depth:(null==n?void 0:n.z)||2,bevelEnabled:!1});i.center();var a=new w.MeshStandardMaterial({color:r||"#FFFFFF",metalness:s||0}),o=new w.Mesh(i,a);f.add(o),l.current=o},void 0,function(e){return console.error(e)});case 2:case"end":return e.stop()}},e)})),function(){return e.apply(this,arguments)});"string"==typeof t&&(E(t),i())},[t,n,r,s,f]),(0,a.useEffect)(function(){F([0,0,2*Math.max((null==n?void 0:n.x)||0,(null==n?void 0:n.y)||0,(null==n?void 0:n.z)||0)])},[n]),(0,h.C)(function(){if(null!=i&&i.rotate&&l.current){var e=i.rotate,t=e.x,n=e.y,r=e.z,a=e.speed,o=void 0===a?1:a;l.current.rotation.x+=(void 0===t?0:t)*o,l.current.rotation.y+=(void 0===n?0:n)*o,l.current.rotation.z+=(void 0===r?0:r)*o}}),(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)("ambientLight",{ref:d}),(0,j.jsx)(b.c,{makeDefault:!0,position:M,frames:.5}),(0,j.jsx)(g.z,{ref:c,args:[m]})]})},E=function(e){return(0,j.jsx)(m.Xz,{children:(0,j.jsx)(O,k({},e))})},S=function(){var e=(0,a.useState)(!1),t=e[0],n=e[1];return(0,a.useEffect)(function(){n(!0)},[]),(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)(i(),{id:o.__hash,children:o}),(0,j.jsxs)("div",{className:"jsx-".concat(o.__hash)+" index",children:[(0,j.jsx)("div",{className:"jsx-".concat(o.__hash)+" index__full",children:(0,j.jsxs)("div",{className:"jsx-".concat(o.__hash)+" index__full--title",children:[l.Z.merchant.name&&(0,d.Z)(l.Z.merchant.name),(0,j.jsx)(c.a,{icon:"".concat(l.Z.merchant.name,"-logo")})]})}),"nirv1"===l.Z.merchant.mid&&(0,j.jsx)(s.Z,{}),"mb1"===l.Z.merchant.mid&&(0,j.jsxs)(j.Fragment,{children:[(0,j.jsx)("div",{className:"jsx-".concat(o.__hash)+" index__full--five",children:(0,j.jsx)(E,{svgOptions:{bevelEnabled:!0,bevelThickness:1,bevelSize:1,bevelSegments:2,animate:{rotate:{x:1,y:1,z:1}}},svg:(0,j.jsx)(c.a,{icon:"".concat(l.Z.merchant.name,"-logo")}),size:{x:100,y:100,z:30},metalness:3,color:"#dd4400"})}),t&&(0,j.jsxs)("video",{loop:!0,muted:!0,className:"jsx-".concat(o.__hash)+" background-video",children:[(0,j.jsx)("source",{src:"/assets/backgrounds/contour_bg.webm",type:"video/webm",className:"jsx-".concat(o.__hash)}),"Your browser does not support the video tag."]})]})]})]})}},13601:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/index/Index",function(){return n(54909)}])}},function(e){e.O(0,[3737,2665,978,2888,9774,179],function(){return e(e.s=13601)}),_N_E=e.O()}]);