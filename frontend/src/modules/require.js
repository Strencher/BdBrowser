import * as electron from './electron';
import Events from './events';
import Module from './module';
import * as fs from './fs';
import * as path from './path';
import * as webpack from './webpack';
import * as vm from './vm';
import RequestModule from './request';
import process from "./process";
import * as https from "./https";

export default function require(mod) {
   switch (mod) {
      case "fs": return fs;
      case "vm": return vm;
      case "path": return path;
      case "module": return Module;
      case "electron": return electron;
      case "events": return Events;
      case "request": return RequestModule;
      case "_webpack": return webpack;
      case "process": return process;
      case "mime-types": return {lookup: () => {}};
      case "url": return {parse: () => {}};
      case "child_process": return;
      case "http":
      case "https": return https;
      default: return Module._require(mod);
  }
}
require.resolve = () => void 0;
require.cache = {};