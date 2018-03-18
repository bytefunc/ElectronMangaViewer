const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ElectronConnectPlugin = require("webpack-electron-connect-plugin");

const output_path = "dist";

module.exports = function (env, argv) {
    return [
        // Electron main process
        {
            target: "electron-main",
            entry: "./src/main.ts",
            output: {
                path: path.resolve(__dirname, output_path),
                filename: "main.js"
            },
            node: {
                __dirname: false,
                __filename: false,
            },
            resolve: {
                extensions: [".ts"]
            },
            module: {
                rules: [
                    {
                        // bundle TypeScript
                        test: /\.ts$/,
                        exclude: /node_modules/,
                        use: [
                            "ts-loader"
                        ]
                    },
                    {
                        // delete unnecessary code
                        test: /\.ts$/,
                        use: [
                            {
                                loader: "webpack-remove-block-loader",
                                options: {
                                    active: (argv.mode === "production"),
                                }
                            }
                        ]
                    }
                ]
            }
        },
        // Electron renderer process
        {
            target: "electron-renderer",
            entry: ["./src/entry.js", "./src/index.html"],
            output: {
                path: path.resolve(__dirname, output_path),
                filename: "index.js"
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js"]
            },
            devtool: (argv.mode === "production")? false: "source-map",
            module: {
                rules: [
                    {
                        // bundle TypeScript
                        test: /\.tsx?$/,
                        exclude: /node_modules/,
                        use: [
                            "ts-loader"
                        ]
                    },
                    {
                        // bundle CSS Modules
                        test: /\.scss$/,
                        include: [path.resolve(__dirname, "src/renderer")],
                        use: [
                            "style-loader",
                            "css-loader?modules",
                            "sass-loader"
                        ]
                    },
                    { 
                        // bundle rc-slider css from node_modules/rc-slider
                        test: /\.css/,
                        include: [path.resolve(__dirname, "node_modules/rc-slider")],
                        use: ["style-loader", "css-loader"]
                    },
                    {
                        // bundle scss files
                        test: /\.scss$/,
                        include: [path.resolve(__dirname, "src/sass")],
                        use: [
                            "style-loader",
                            {
                                loader: "css-loader",
                                options: {
                                    sourceMap: true
                                }
                            },
                            "sass-loader"
                        ]
                    },
                    {
                        // bundle image files
                        test: /\.(jpg|png)$/,
                        loaders: "url-loader"
                    },
                    {
                        // copy HTML and delete unnecessary code
                        test: /\.html$/,
                        use: [
                            {
                                loader: "file-loader?name=[name].[ext]"
                            },
                            {
                                loader: "webpack-remove-block-loader",
                                options: {
                                    active: (argv.mode === "production"),
                                    start: "<!--",
                                    end: "-->"
                                }
                            }
                        ]
                    }
                ]
            },
            plugins: [
                // Electron autoreload for development
                new ElectronConnectPlugin({
                    type: "reload"
                }),
                // Copy necessary files such as lib
                new CopyWebpackPlugin([
                    { from: "src/package.json" },
                    { from: "src/lib", to: "lib" }
                ])
            ]
        }
    ]
};
