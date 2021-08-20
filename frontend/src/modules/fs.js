import Events from "./events";
import {getItem, setItem} from "./localStorage";

const FILE_REGEX = /\.(.+)$/;

function isFile(name) {
   return FILE_REGEX.test(name);
};

const emitter = new Events();

if (!getItem("bd-files")) setItem("bd-files", JSON.stringify({
   type: "dir",
   files: {
      AppData: {
         type: "dir",
         files: {
            BetterDiscord: {
               type: "dir",
               files: {
                  plugins: {
                     type: "dir",
                     files: {}
                  },
                  themes: {
                     type: "dir",
                     files: {}
                  },
                  data: {
                     type: "dir",
                     files: {}
                  }
               }  
            }
         }
      }
   }
}));

export function getStore() {
   return JSON.parse(getItem("bd-files") || JSON.stringify(convertPath("AppData/BetterDiscord")));;
}


function convertPath(path) {
   let newPath = {type: "dir", files: {}}, currentItem = newPath;
   const split = path.split("/");

   for(const index in split) {
      const segment = split[index];
      const test = isFile(segment);
      if (test) continue;
      let final = {
         type: "dir",
         files: {}
      };
      currentItem.files[segment] = final;
      currentItem = final;
   }
   
   return newPath;
};

export function writeFileSync(path, content) {
   path = normalizePath(path);
   const files = getStore();
   const split = path.split("/");
   const filename = split[split.length - 1];
   if (!isFile(filename)) return false;
   let segment = files;
   for (const index in split) {
      const item = split[index];
      const isLast = parseInt(index) === split.length - 1;
      if(!isLast) segment = segment.files?.[item];
      if (!segment && !isLast) return "NOT_FOUND";
      if (isLast) {
         if (segment.type !== "dir") return "NOT_A_DIR";
         segment.files[filename] = {type: "file", content};
      }
   }
   setItem("bd-files", JSON.stringify(files));
};

export function writeFile(path, content, callback) {
   try {
      writeFileSync(path, content);
      callback(null);
   } catch (e) {
      callback(e);
   }
}

export function mkdirSync(path) {
   path = normalizePath(path);
   const files = getStore();
   const split = path.split("/");
   const filename = split[split.length - 1];
   if (isFile(filename)) return false;
   let segment = files;

   for(let i = 0; i < split.length; i++) {
      const item = split[i];
      const isLast = i === split.length - 1;
      if (!segment) return;
      if(!isLast) segment = segment.files?.[item];
      if(!segment && !isLast) return "NOT_FOUND";
      if(isLast) {
         if(segment.type !== "dir") return "NOT_A_DIR";
         segment.files[filename] = {type: "dir", files: {}};
      }
   }

   setItem("bd-files", JSON.stringify(files));
};

export function readdirSync(path) {
   path = normalizePath(path);
   const found = [];
   const files = getStore();
   const split = path.split("/")
   let segment = files;

   for (let i = 0; i < split.length; i++) {
      const isLast = i === split.length - 1;
      const item = split[i];

      segment = segment.files?.[item];
      if (!segment && !isLast) return "NOT_FOUND";
      if (isLast && segment) {
         if (segment.type !== "dir") return "NOT_A_DIR";
         found.push(...Object.keys(segment.files));
      }
   }
   return found.sort();
};

export function readFileSync(path) {
   path = normalizePath(path);
   const files = getStore();
   const split = path.split("/");
   let segment = files;
   
   for(let i = 0; i < split.length; i++) {
      const isLast = i === split.length - 1;
      const item = split[i];

      segment = segment.files?.[item];
      if (!segment && !isLast) return "NOT_FOUND";
      if (isLast && segment) {
         if (segment.type !== "file") return "NOT_A_FILE";
         return segment.content;
      }
   }
}

export function existsSync(path) {
   path = normalizePath(path);
   const stats = statSync(path);

   let exist = stats.isFile() || stats.isDirectory();
   return exist;
}

export const exists = existsSync;

export function statSync(path) {
   path = normalizePath(path);
   const files = getStore();
   const split = path.split("/");
   let file = files;

   for (const item of split) {
      file = file?.files?.[item];
   }

   return {
      mtime: {getTime: () => Date.now()},
      isFile: () => file?.type === "file",
      isDirectory: () => file?.type === "dir"
   };
}

export function unlinkSync(path) {
   path = normalizePath(path);
   const files = getStore();
   const split = path.split("/");
   const filename = split[split.length - 1];
   let segment = files;

   for(let i = 0; i < split.length; i++) {
      const item = split[i];
      const isLast = i === split.length - 1;
      if (!segment) return;
      if(!isLast) segment = segment.files?.[item];
      if(!segment && !isLast) return "NOT_FOUND";
      if(isLast) {
         delete segment.files[filename]
      }
   }

   setItem("bd-files", JSON.stringify(files));
}

export function normalizePath(path) {
   return path.replace(/\\/g, "/");
}

export const realpathSync = normalizePath;

export function basename(path) {
   if (!path) return;

   return path.split(/\/|\\/).pop();
}

export function watch(file, options, listener) {
   return;
   if (typeof (options) === "function") {
      listener = options;
      options = {};
   }

   const callback = (file, type) => {
      listener(type, basename(file));
   };

   emitter.on("change", callback);

   return {
      close: () => emitter.off("change", callback)
   };
}

const fs = {
   watch,
   mkdirSync,
   readdirSync,
   readFileSync,
   existsSync,
   writeFileSync,
   getStore,
   statSync,
   realpathSync,
   writeFile,
   basename,
   unlinkSync
};

export default fs;