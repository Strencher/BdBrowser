export default class IPC {
    constructor(context) {
        if (!context) throw new Error("Context is required");

        this.context = context;
    }

    createHash() {
        return Math.random().toString(36).substr(2, 10);
    }

    reply(message, data) {
        this.send(message.event + "-reply", data, void 0, message.hash);
    }

    on(event, listener, once = false) {
        const wrappedListener = message => {
            if (message.data.event !== event || message.data.context === this.context) return;

            const returnValue = listener(message.data, message.data.data);

            if (returnValue == true && once) {
                window.removeEventListener("message", wrappedListener);
            }
        };

        window.addEventListener("message", wrappedListener);
    }

    send(event, data, callback = null, hash) {
        if (!hash) hash = this.createHash();

        if (callback) {
            this.on(event + "-reply", message => {
                if (message.hash === hash) {
                    callback(message.data);
                    return true;
                }
                
                return false;
            }, true);
        }

        window.postMessage({
            source: "betterdiscord-browser-" + this.context,
            event: event,
            context: this.context,
            hash: hash,
            data
        });
    }
};