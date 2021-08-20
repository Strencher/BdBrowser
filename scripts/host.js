const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const filename = req.url;
    let filepath = "";

    switch (filename.slice(1)) {
        case "betterdiscord.js":
            filepath = path.resolve(process.cwd(), "dist", "betterdiscord.js");
            break;
        case "frontend.js":
            filepath = path.resolve(process.cwd(), "dist", "frontend.js");
            break;
        case "backend.js":
            filepath = path.resolve(process.cwd(), "dist", "backend.js");
            break;
    }

    if (!filepath) return res.writeHead(404);

    fs.promises.readFile(filepath, "utf8").then(content => {
        res.writeHead(200, {"Content-Type": "text-javascript"});
        res.end(content, "utf8");
    });
}).listen(5500).on("listening", () => console.log("Server Started!"));