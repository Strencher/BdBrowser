import ipcRenderer from "./ipc";
import Logger from "common/logger";
import require from "./modules/require";
import * as DiscordNative from "./modules/discordnative";
import process from "./modules/process";
import fs from "./modules/fs";
import { IPCEvents } from "common/constants";
import { default as fetchAPI } from "./modules/fetch";
import * as monaco from "./modules/monaco"; 
import DOM from "common/dom";
import {findByProps} from "webpack";

Object.defineProperty(findByProps("requireModule"), "canBootstrapNewUpdater", {
    value: false,
    configurable: true
});

window.fallbackClassName = "bdfdb_is_garbage";
window.value = null;
window.firstArray = [];
window.user = "";

window.DiscordNative = DiscordNative;
window.require = require;
window.process = process;
window.fs = fs;
window.fetchWithoutCSP = fetchAPI;
window.monaco = monaco;
window.IPC = ipcRenderer;

Logger.log("Frontend", "Loading...");

import "./modules/patches";

DOM.injectCSS("BetterDiscordWebStyles", `.CodeMirror {height: 100% !important;}`);

ipcRenderer.send(IPCEvents.MAKE_REQUESTS, {
    url: ENV === "development" ? "http://127.0.0.1:5500/betterdiscord.js" : "https://strencher.github.io/BdBrowser/dist/betterdiscord.js"
}, async bd => {
    const Dispatcher = findByProps("dirtyDispatch");

    const callback = () => {
        Dispatcher.unsubscribe("CONNECTION_OPEN", callback);

        Logger.log("Frontend", "Loading BD...");
        try {
            eval(`((fetch) => {${bd}})(window.fetchWithoutCSP)`);
        } catch (error) {
            Logger.error("FronEnd", "Failed to load BD:\n", error);
        }
    };
    
    Dispatcher.subscribe("CONNECTION_OPEN", callback);
});