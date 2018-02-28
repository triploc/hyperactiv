!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],t):t(e["react-hyperactiv"]={},e.React)}(this,function(e,t){"use strict";const n=[],r=new WeakMap,o=function(e){return e&&"object"==typeof e&&!(e instanceof Date)},u=Array.isArray,c=function(e,t,n,r){Object.defineProperty(e,"__key",{value:t,enumerable:!1,configurable:!0}),Object.defineProperty(e,"__parent",{value:n,enumerable:!1,configurable:!0}),r&&Object.entries(e).forEach(function([t,n]){!o(n)||n.__key&&n.__parent||c(e[t],t,e)})},s={timeout:null,queue:new Set,process(){for(const e of s.queue)e();s.queue.clear(),s.timeout=null},enqueue(e){null===s.timeout&&(s.timeout=setTimeout(s.process,0)),s.queue.add(e)}},i=function(e,{autoRun:t=!0,callback:r=null,bind:o=null}={}){const u=new Proxy(e,{apply(e,t,c){const s=function(s=null){n.unshift(r||u);const i=s?s():e.apply(o||t,c);return n.shift(),i};return c.push({computeAsync:function(e){return s(e)}}),s()}});return t&&u(),u},a=function(e){return e.__disposed=!0},l=function(e,t={}){const{props:i=null,ignore:a=null,batch:p=!1,deep:d=!1,bubble:f=null,bind:_=!1}=t;if(e.__observed)return e;r.set(e,new Map),d&&Object.entries(e).forEach(function([n,r]){o(r)&&(e[n]=l(r,t),f&&c(e[n],n,e))});const b=new Proxy(e,{get(t,o){if("__observed"===o)return!0;if((!i||i.includes(o))&&(!a||!a.includes(o))&&n.length){const t=r.get(e);t.has(o)||t.set(o,new Set),t.get(o).add(n[0])}return e[o]},set(f,_,h){if("__handler"===_)return Object.defineProperty(e,"__handler",{value:h,enumerable:!1,configurable:!0}),!0;const y=r.get(e);if((!u(e)||"length"!==_)&&e[_]===h)return!0;const m=e[_];if(o(m)&&(delete m.__key,delete m.__parent),e[_]=d&&o(h)?l(h,t):h,e.__handler||e.__parent){d&&o(h)&&c(e[_],_,e,d);const t=[_];let n=e;for(;n&&(!n.__handler||!1!==n.__handler(t,h,m,b));)n.__key&&n.__parent?(t.unshift(n.__key),n=n.__parent):n=null}if((!i||i.includes(_))&&(!a||!a.includes(_))&&y.has(_)){const e=y.get(_);for(const t of e)t.__disposed?e.delete(t):t!==n[0]&&(p?s.enqueue(t):t())}return!0}});if(_){[...Object.getOwnPropertyNames(e),...Object.getPrototypeOf(e)&&["String","Number","Object","Array","Boolean","Date"].indexOf(Object.getPrototypeOf(e).constructor.name)<0?Object.getOwnPropertyNames(Object.getPrototypeOf(e)):[]].filter(t=>"constructor"!=t&&"function"==typeof e[t]).forEach(t=>e[t]=e[t].bind(b))}return b};var p={observe:l,computed:i,dispose:a,Observable:e=>(class extends e{constructor(e,t){super();const n=l(e||{},t||{deep:!0,batch:!0});return new Proxy(this,{set:(e,t,r)=>("function"==typeof r?this[t]=r:(n[t]=r,void 0===this[t]&&Object.defineProperty(this,t,{get:()=>n[t],enumerable:!0,configurable:!0})),!0),deleteProperty:(e,t)=>(delete n[t],delete e[t],!0)})}}),Computable:e=>(class extends e{constructor(){super(),Object.defineProperty(this,"__computed",{value:[],enumerable:!1})}computed(e){this.__computed.push(i(e))}dispose(){for(;this.__computed.length;)a(this.__computed.pop())}})};const{observe:d,computed:f,dispose:_}=p,b=e=>(class extends t.PureComponent{constructor(t,n){super(t,n),this.wrap=f(e,{autoRun:!1,callback:this.forceUpdate.bind(this)})}render(){return this.wrap(this.props)}componentWillUnmount(){_(this.wrap)}});var h;e.watch=(e=>e.prototype.render?(h=e,new Proxy(h,{construct:function(e,t){const n=new e(...t);n.forceUpdate=n.forceUpdate.bind(n);const r="function"==typeof n.componentWillUnmount&&n.componentWillUnmount.bind(n)();return n.componentWillUnmount=function(...e){_(n.forceUpdate),r&&r(...e)},new Proxy(n,{get:function(e,t){return"render"===t?f(e.render.bind(e),{autoRun:!1,callback:n.forceUpdate}):e[t]}})}})):b(e)),e.store=(e=>d(e,{deep:!0})),Object.defineProperty(e,"__esModule",{value:!0})});
