import { normalizePath } from "./fs";

export function join(...paths) {
   let final = "";
   for (let path of paths) {
      if (!path) continue;
      path = normalizePath(path);
      if (path[0] == "/") path = path.slice(1);
      final += path[path.length - 1] == "/" ? path : path + "/";
   }
   return final[final.length - 1] == "/" ? final.slice(0, final.length - 1) : final;
}

export function basename(filename) {
   return filename.split("/").slice(-1)[0];
}

export function resolve(...paths) {
   return join(...paths);
}

export function extname(path) {
   return path.split(".").slice(-1)[0];
}

export function dirname(path) {
   return path.split("/").slice(0, -1).join("/");
}