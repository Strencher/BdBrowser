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
import * as localStorage from "./modules/localStorage";

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

Logger.log("Frontend", `Loading. environment=${ENV}`);

import "./modules/patches";

DOM.injectCSS("BetterDiscordWebStyles", `.CodeMirror {height: 100% !important;}`);

// const getConfig = key => new Promise(resolve => chrome.storage.sync.get(key, resolve));

ipcRenderer.send(IPCEvents.MAKE_REQUESTS, {
    url: ENV === "development" ? "http://127.0.0.1:5500/betterdiscord.js" : "https://strencher.github.io/BdBrowser/dist/betterdiscord.js"
}, async bd => {
    const Dispatcher = findByProps("dirtyDispatch");

    const callback = async () => {
        const didSeeWarning = localStorage.getItem("didSeeWarning");

        if (!didSeeWarning) {
            const didSaw = confirm("ATTENTION!\nThere's a malicious version this BDBrowser going around! Please DO NOT INSTALL IT FROM ANY OTHER SOURCES THAN https://github.com/Strencher/bdbrowser. DO NOT USE THE VERSION FROM CHROME STORE. CONFIRM IF YOU WANT TO CONTINUE LOADING, CANCEL TO STOP LOADING. TO BE SAFE RESET YOUR DISCORD PASSWORD SO YOUR ACCOUNT IS SAFE AGAIN.");
            localStorage.setItem("didSeeWarning", didSaw);
            if (!didSaw) return Logger.info("Frontend", "Cancelled loading.");
        }


        Dispatcher.unsubscribe("CONNECTION_OPEN", callback);

        Logger.log("Frontend", "Loading BD...");
        try {
            eval(`((fetch) => {${bd}})(window.fetchWithoutCSP)`);
        } catch (error) {
            Logger.error("FronEnd", "Failed to load BD:\n", error);
        }
    };
    
    if (!findByProps("getCurrentUser")?.getCurrentUser()) Dispatcher.subscribe("CONNECTION_OPEN", callback);
    else setImmediate(callback);
});