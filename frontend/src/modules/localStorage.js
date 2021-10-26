import Webpack from "./webpack";

var discordStorage;

export function getItem(key, item) {
   const storage = discordStorage || (discordStorage = Webpack.findByProps("get", "set", "stringify"));

   return storage.get(key, item);
}

export function setItem(key, item) {
   const storage = discordStorage || (discordStorage = Webpack.findByProps("get", "set", "stringify"));

   return storage.set(key, item);
}