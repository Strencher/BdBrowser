var request;

export function findModule(filter, all = false) {
   const id = "bd-browser";
   const req = request || (request = window.webpackJsonp.push([[], {[id]: (module, exports, req) => module.exports = req}, [[id]]]));
   delete req.m[id];
   delete req.c[id];
   const found = [];
   for (let i in req.c) if (req.c.hasOwnProperty(i)) {
       var m = req.c[i].exports;
       if (m && (typeof m == "object" || typeof m == "function") && filter(m)) found.push(m);
       if (m && m.__esModule) for (let j in m) if (m[j] && (typeof m[j] == "object" || typeof m[j] == "function") && filter(m[j])) found.push(m[j]);
   }
   return all ? found : found.shift();
}

export function findModules(filter) {
   return findModule(filter, true);
}

export function findByProps(...props) {
   return findModule(m => m && props.every(prop => m[prop] !== undefined));
}

export function findByDisplayName(displayName) {
   return findModule(m => m && m.displayName === displayName);
}