!function(){var t,n,e,r,o,i,u,c,f,a,l,s,p={495:function(){},7147:function(){},1418:function(){},3380:function(){},319:function(){},8386:function(){},3342:function(){},2689:function(t,n,e){"use strict";async function r(t,n){try{let e=await fetch(t);if(!e.ok)throw Error("HTTP error! status: ".concat(e.status));let r=await e.arrayBuffer(),o=[];for(let t=0;t<r.byteLength;t+=n){let e=r.slice(t,t+n);o.push(new Uint8Array(e))}return o}catch(t){return console.error("Error loading binary file: ",t),null}}function o(t,n,e,r,o,i){let u=function(t){let n=t.map(t=>t.nb_of_embeddings);for(let t=1;t<n.length;t++)n[t]+=n[t-1];return n}(t),c=function(t,n,e,r,o){let i=t.length;if(i!==e*r)throw Error("Input dimension must be Ds * M");let u=Array(r);for(let t=0;t<r;t++)u[t]=new Float32Array(o);for(let i=0;i<r;i++){let r=t.subarray(i*e,(i+1)*e);for(let t=0;t<o;t++)u[i][t]=/*
@licstart  The following is the entire license notice for the
JavaScript code in this page.

Copyright (C) 2014  Sebastien Campion

The JavaScript code in this page is free software: you can
redistribute it and/or modify it under the terms of the GNU
General Public License (GNU GPL) as published by the Free Software
Foundation, either version 3 of the License, or (at your option)
any later version.  The code is distributed WITHOUT ANY WARRANTY;
without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.

As additional permission under GNU GPL version 3 section 7, you
may distribute non-source (e.g., minimized or compacted) forms of
that code without the copy of the GNU GPL normally required by
section 4, provided you include this license notice and a URL
through which recipients can access the Corresponding Source.


@licend  The above is the entire license notice
for the JavaScript code in this page.
*/function(t,n){if(t.length!==n.length)throw Error("Vectors must have the same dimensionality for distance calculation.");let e=0;for(let r=0;r<t.length;r++)e+=Math.pow(t[r]-n[r],2);return Math.sqrt(e)}(r,n[i][t])}return u}(n,e,o.dim/o.M,o.M,o.Ks),f=function(t,n){if(0===t.length||t[0].length!==n.length)throw Error("Invalid input dimensions");let e=t.length,r=new Float32Array(e);for(let o=0;o<e;o++){r[o]=0;for(let e=0;e<n.length;e++)r[o]+=n[e][t[o][e]]}return r}(r,c),a=function(t){let n=Array.from(t.keys());return n.sort((n,e)=>t[n]-t[e]),n}(f);console.log(a);let l=function(t,n,e){let r={},o=0;for(let i=0;i<t.length;i++){let u=function(t,n){let e=0,r=t.length-1;for(;e<=r;){let o=Math.floor((e+r)/2);if(t[o]===n)return o;t[o]<n?e=o+1:r=o-1}return e}(n,t[i]);if(r[u]=(r[u]||0)+1,o+=1,Object.keys(r).length>e&&o>e*e)break}return r}(a,u,i),s=function(t){let n=Object.values(t).reduce((t,n)=>t+n,0),e={};for(let r in t)e[r]=t[r]/n;return e}(l);var p=Object.keys(s).map(t=>[t,s[t]]);return p.sort((t,n)=>n[1]-t[1]),function(t,n){let e=[];return t.forEach((t,r)=>{let[o,i]=t,u=n[o];e.push({rank:r,score:i,...u})}),e}(p,t)}e.d(n,{o:function(){return r},y:function(){return o}})},4245:function(t,n,e){"use strict";e.a(t,async function(t,n){try{let t;var r=e(552),o=e(2689);t=await fetch("/documents.json");let i=await t.json();t=await fetch("/codewords.json");let u=await t.json();t=await fetch("/conf.json");let c=await t.json(),f=await (0,o.o)("/pq.bin",c.M);r.OBj.allowLocalModels=!1;class a{static async getInstance(){let t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;return null===this.instance&&(this.instance=(0,r.EUT)(this.task,this.model,{quantized:!0,progress_callback:t})),this.instance}}a.task="feature-extraction",a.model="Xenova/"+c.model.split("/")[1],a.instance=null,self.addEventListener("message",async t=>{let n=await a.getInstance(t=>{self.postMessage(t)}),e=await n(t.data.text,{pooling:"mean",normalize:!0}),r=(0,o.y)(i,e.data,u,f,c,5);console.log(JSON.stringify(r.length,null,2)),self.postMessage({status:"complete",output:r})}),n()}catch(t){n(t)}},1)}},h={};function d(t){var n=h[t];if(void 0!==n)return n.exports;var e=h[t]={exports:{}},r=!0;try{p[t](e,e.exports,d),r=!1}finally{r&&delete h[t]}return e.exports}d.m=p,d.x=function(){var t=d.O(void 0,[15,990],function(){return d(4245)});return d.O(t)},t="function"==typeof Symbol?Symbol("webpack queues"):"__webpack_queues__",n="function"==typeof Symbol?Symbol("webpack exports"):"__webpack_exports__",e="function"==typeof Symbol?Symbol("webpack error"):"__webpack_error__",r=function(t){t&&!t.d&&(t.d=1,t.forEach(function(t){t.r--}),t.forEach(function(t){t.r--?t.r++:t()}))},d.a=function(o,i,u){u&&((c=[]).d=1);var c,f,a,l,s=new Set,p=o.exports,h=new Promise(function(t,n){l=n,a=t});h[n]=p,h[t]=function(t){c&&t(c),s.forEach(t),h.catch(function(){})},o.exports=h,i(function(o){f=o.map(function(o){if(null!==o&&"object"==typeof o){if(o[t])return o;if(o.then){var i=[];i.d=0,o.then(function(t){u[n]=t,r(i)},function(t){u[e]=t,r(i)});var u={};return u[t]=function(t){t(i)},u}}var c={};return c[t]=function(){},c[n]=o,c});var i,u=function(){return f.map(function(t){if(t[e])throw t[e];return t[n]})},a=new Promise(function(n){(i=function(){n(u)}).r=0;var e=function(t){t===c||s.has(t)||(s.add(t),t&&!t.d&&(i.r++,t.push(i)))};f.map(function(n){n[t](e)})});return i.r?a:u()},function(t){t?l(h[e]=t):a(p),r(c)}),c&&(c.d=0)},o=[],d.O=function(t,n,e,r){if(n){r=r||0;for(var i=o.length;i>0&&o[i-1][2]>r;i--)o[i]=o[i-1];o[i]=[n,e,r];return}for(var u=1/0,i=0;i<o.length;i++){for(var n=o[i][0],e=o[i][1],r=o[i][2],c=!0,f=0;f<n.length;f++)u>=r&&Object.keys(d.O).every(function(t){return d.O[t](n[f])})?n.splice(f--,1):(c=!1,r<u&&(u=r));if(c){o.splice(i--,1);var a=e();void 0!==a&&(t=a)}}return t},u=Object.getPrototypeOf?function(t){return Object.getPrototypeOf(t)}:function(t){return t.__proto__},d.t=function(t,n){if(1&n&&(t=this(t)),8&n||"object"==typeof t&&t&&(4&n&&t.__esModule||16&n&&"function"==typeof t.then))return t;var e=Object.create(null);d.r(e);var r={};i=i||[null,u({}),u([]),u(u)];for(var o=2&n&&t;"object"==typeof o&&!~i.indexOf(o);o=u(o))Object.getOwnPropertyNames(o).forEach(function(n){r[n]=function(){return t[n]}});return r.default=function(){return t},d.d(e,r),e},d.d=function(t,n){for(var e in n)d.o(n,e)&&!d.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:n[e]})},d.f={},d.e=function(t){return Promise.all(Object.keys(d.f).reduce(function(n,e){return d.f[e](t,n),n},[]))},d.u=function(t){return"static/chunks/"+(15===t?"b2db8554":t)+"."+({15:"501a8fbaf2ca19ba",990:"285f629f1fc6f9b3"})[t]+".js"},d.miniCssF=function(t){},d.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||Function("return this")()}catch(t){if("object"==typeof window)return window}}(),d.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},d.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},d.tt=function(){return void 0===c&&(c={createScriptURL:function(t){return t}},"undefined"!=typeof trustedTypes&&trustedTypes.createPolicy&&(c=trustedTypes.createPolicy("nextjs#bundler",c))),c},d.tu=function(t){return d.tt().createScriptURL(t)},d.p="/pqjs_demo/_next/",f={227:1},d.f.i=function(t,n){f[t]||importScripts(d.tu(d.p+d.u(t)))},l=(a=self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push.bind(a),a.push=function(t){var n=t[0],e=t[1],r=t[2];for(var o in e)d.o(e,o)&&(d.m[o]=e[o]);for(r&&r(d);n.length;)f[n.pop()]=1;l(t)},s=d.x,d.x=function(){return Promise.all([d.e(15),d.e(990)]).then(s)},_N_E=d.x()}();