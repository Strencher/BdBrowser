import {IPCEvents} from "common/constants";
import ipcRenderer from "../ipc";

export default function request(url, options, callback) {
    if (typeof options === "function") {
        callback = options
        options = {};
    }

    ipcRenderer.send(IPCEvents.MAKE_REQUESTS, {
        url: url
    }, data => {
        const res = new Response(data);
        res.statusCode = res.status;
        callback(null, res, data);
    });
}

Object.assign(request, {
    get: request
});