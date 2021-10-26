if (typeof (Array.prototype.at) !== "function") {
   Array.prototype.at = function (index) {
       return index < 0 ? this[this.length - Math.abs(index)] : this[index];
   };
}

export default class Webpack {
   static id = "kernel-req" + Math.random().toString().slice(2, 3);
   static _cache = null;

   static get webpackNamespace() {return window.webpackJsonp || window.webpackChunkdiscord_app;}

   static async wait(callback) {
       while (!this.webpackNamespace || this.webpackNamespace.flat(10).length < 50)
           await new Promise(res => setTimeout(res, 0));
       
       typeof(callback) === "function" && callback();
   }

   static request(cache) {
       if (cache && this._cache) return this._cache;
       let req = void 0;

       if ("webpackJsonp" in window) {
           req = window.webpackJsonp.push([[], {
               [this.id]: (module, exports, req) => module.exports = req
           }, [[this.id]]]);
       } else if ("webpackChunkdiscord_app" in window) {
           window.webpackChunkdiscord_app.push([[this.id], {}, __webpack_require__ => req = __webpack_require__]);
       }

       return this._cache = req;
   }

   static findModule(filter, all = false, cache = true) {
       const __webpack_require__ = this.request(cache);
       const found = [];   

       for (let i in __webpack_require__.c) {
           var m = __webpack_require__.c[i].exports;
           if (m && (typeof m == "object" || typeof m == "function") && filter(m)) found.push(m);
           if (m && m.__esModule) for (let j in m) if (m[j] && (typeof m[j] == "object" || typeof m[j] == "function") && filter(m[j])) found.push(m[j]);
       }
       return all ? found : found.shift();
   }

   static findModules(filter) {return this.findModule(filter, true);}

   static bulk(...filters) {
       const found = new Array(filters.length);
       
       this.findModule(module => {
           const matches = filters.filter(filter => {
               try {return filter(module);}
               catch {return false;}
           });

           if (!matches.length) return false;

           for (const filter of matches) {
               found[filters.indexOf(filter)] = module;
           }

           return false;
       });

       return found;
   }

   static findByProps(...props) {
       const bulk = typeof (props.at(-1)) === "boolean" && props.at(-1);
       const filter = (props, module) => props.every(prop => prop in module);
       
       return bulk
           ? this.bulk(...props.slice(0, -1).map(props => filter.bind(null, props)))
           : this.findModule(filter.bind(null, props));
   }

   static findByDisplayName(...displayName) {
       const bulk = typeof (displayName.at(-1)) === "boolean" && displayName.at(-1);
       const defaultExport = typeof (displayName.at(-2)) === "boolean" && displayName.at(-2);
       if (bulk) displayName = displayName.slice(0, -1);
       if (defaultExport) displayName = displayName.slice(0, -1);

       const filter = (name, module) => defaultExport
           ? module?.default?.displayName === name
           : module?.displayName === name;
       
       return bulk
           ? this.bulk(...displayName.map(name => filter.bind(null, name)))
           : this.findModule(filter.bind(null, displayName[0]));
   }
}