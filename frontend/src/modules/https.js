import fetch from "./fetch";

export function request(url, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }

    fetch(url).then(res => res.text()).then(data => {
        callback({
            on: (event, callback) => {
                switch(event) {
                    case "data": return callback(data);
                    case "end": return callback();
                }
            }
        });
    });

    return {
        statusCode: 200,
        on: () => {},
        end: () => {}
    }
}

export const get = request;

export function createServer() {
    return {
        listen: () => {},
        close: () => {}
    };
}