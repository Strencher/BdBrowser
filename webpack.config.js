const path = require("path");
const webpack = require("webpack");

module.exports = env => {
    const mode = env.mode ?? "development";

    return {
        mode: mode,
        target: "node",
        entry: "./src/index.js",
        devtool: "eval-cheap-source-map",
        output: {
            filename: env.type + ".js",
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
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader",
                        },
                        {
                            loader: "css-loader",
                        },
                    ],
                },
                {
                    test: /\.ttf$/,
                    use: "raw-loader"
                }
            ]
        },
        plugins: [
            new webpack.DefinePlugin({
                ENV: JSON.stringify(mode)
            })
        ],
        resolve: {
            extensions: [".js", ".jsx"],
            modules: [
                path.resolve("src", "modules")
            ],
            alias: {
                fs: path.join(__dirname, "src", "modules", "fs.js"),
                path: path.join(__dirname, "src", "modules", "path.js"),
                storage: path.join(__dirname, "src", "modules", "localStorage.js"),
                require: path.join(__dirname, "src", "modules", "require.js"),
                common: path.join(__dirname, "common")
            }
        }
    };
};