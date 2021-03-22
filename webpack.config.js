const path = require("path");

module.exports = {
    mode: "development",
    target: "node",
    entry: "./src/index.js",
    devtool: "eval-cheap-source-map",
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
            },
            {
              test: /\.css$/i,
              use: ["css-loader"],
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [
            path.resolve("src", "modules")
        ],
        alias: {
            // modules: path.join(__dirname, "src", "modules", "modules.js"),
            fs: path.join(__dirname, "src", "modules", "fs.js"),
            path: path.join(__dirname, "src", "modules", "path.js"),
            storage: path.join(__dirname, "src", "modules", "localStorage.js"),
            require: path.join(__dirname, "src", "modules", "require.js")
        }
    }
};