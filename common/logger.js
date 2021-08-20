export default class Logger {
    static _parseType(type) {
        switch (type) {
            case "info":
            case "warn":
            case "error":
                return type;
            default:
                return "log";
        }
    }

    static _log(type, module, ...nessage) {
        type = this._parseType(type);
        console[type](`%c[BetterDiscord]%c %c[${module}]%c`, "color: #3E82E5; font-weight: 700;", "", "color: #396CB8", "", ...nessage);
    }

    static log(module, ...message) {this._log("log", module, ...message);}
    static info(module, ...message) {this._log("info", module, ...message);}
    static warn(module, ...message) {this._log("warn", module, ...message);}
    static error(module, ...message) {this._log("error", module, ...message);}
}