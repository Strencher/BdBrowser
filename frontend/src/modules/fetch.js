import ipcRenderer from "../ipc";
import {IPCEvents} from "common/constants";

export default function fetch(url) {
    return new Promise(resolve => {
        ipcRenderer.send(IPCEvents.MAKE_REQUESTS, {
            url
        }, data => {
            resolve(new Response(data, {url}));
        });
    });
}