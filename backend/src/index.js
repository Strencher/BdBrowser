import IPC from "common/ipc";
import {IPCEvents} from "common/constants";
import DOM from "common/dom";
import Logger from "common/logger";

Logger.log("Backend", "Initializing modules");

const ipcMain = new IPC("backend");

Logger.log("Backend", "Registering events");
ipcMain.on(IPCEvents.INJECT_CSS, (_, data) => {
    DOM.injectCSS(data.id, data.css);
});

ipcMain.on(IPCEvents.MAKE_REQUESTS, (event, data) => {
    fetch(data.url)
        .catch(console.error.bind(null, "REQUEST FAILED:"))
        .then(res => res.text()).then(text => {
            ipcMain.reply(event, text);
        })
});

const SCRIPT_URL = (() => {
    switch (ENV) {
        case "production": return "https://strencher.github.io/BdBrowser/dist/frontend.js";
        case "development": return "http://127.0.0.1:5500/frontend.js";
        default: throw new Error("Unknown Environment")
    }
})();

Logger.log("Backend", "Loading frontend script from", SCRIPT_URL);
DOM.injectJS("BetterDiscordBrowser-frontend", SCRIPT_URL, false);