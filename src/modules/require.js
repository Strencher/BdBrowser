import * as electron from './electron';
import Events from './events';
import Module from './module';
import * as fs from './fs';
import * as path from './path';
import * as webpack from './webpack';

export default function require(mod, es) {
   switch (mod) {
      case "fs": return fs;
      case "path": return path;
      case "module": return Module;
      case "electron": return electron;
      case "events": return Events;
      case "request": return webpack.findByProps("get", "Request");
      case "_webpack": return webpack;
      default: return Module._require(mod);
  }
}