import require from './modules/require';
import * as DiscordNative from './modules/discordnative';
import process from './modules/process';
import fs from "./modules/fs";

window.require = require;
window.DiscordNative = DiscordNative;
window.process = process;

if (!fs.existsSync("AppData/BetterDiscord/plugins")) fs.mkdirSync("AppData/BetterDiscord/plugins");
if (!fs.existsSync("AppData/BetterDiscord/themes")) fs.mkdirSync("AppData/BetterDiscord/themes");

console.log("[BetterDiscord] Starting.");

function makeGetRequest(url, callback) {
    var id = Math.random().toString().slice(2, 15);
    const onReply = message => {
        if (message.data.hash !== id || message.data.message) return;
        try {
            callback(message.data.content);
        } catch (error) {
            console.error(error);
        }
        window.removeEventListener("message", onReply);
    }
    window.addEventListener("message", onReply);
    window.postMessage({
        message: "bd-request-content", 
        url, 
        hash: id
    });
}

// const oldOpen = XMLHttpRequest.prototype.open;
// XMLHttpRequest.prototype.open = function () {
//     console.log(this, arguments);
//     return oldOpen.apply(this, arguments);
// }

makeGetRequest("https://rauenzi.github.io/BetterDiscordApp/dist/remote.js", data => {
    eval(data);
});


const old = document.head.append;
document.head.append = function (node) {
    if (["ace-script", "jquery"].indexOf(node?.id) < 0) return old.apply(this, arguments);
    makeGetRequest(node.src, data => {
        eval(data);
        node.onload();
    });
}

import "./modules/addonrequire";