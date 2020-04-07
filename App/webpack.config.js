let port = process.env.PORT || "8085";

let CONFIG = {
    indexHtmlTemplate: './public/index.html',
    fsharpEntry: './App.fsproj',
    outputDir: './dist',
    assetsDir: './public',
    devServerPort: 8082,
    devServerProxy: {
        '/api/*': {
            target: 'http://localhost:' + port,
            changeOrigin: true
        },
        '/socket': {
            target: 'http://localhost:' + port,
            ws: true
        },
    },
};

let isProduction = !process.argv.find(v => v.indexOf('webpack-dev-server') !== -1);
console.log("Bundling for " + (isProduction ? "production" : "development") + "...");

let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require('html-webpack-plugin');
let CopyWebpackPlugin = require('copy-webpack-plugin');
let MiniCssExtractPlugin = require("mini-css-extract-plugin");

let commonPlugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: CONFIG.indexHtmlTemplate
    })
];

module.exports = {
    entry: {
        app: [CONFIG.fsharpEntry]
    } ,
    output: {
        path: path.join(__dirname, CONFIG.outputDir),
        filename: isProduction ? '[name].[hash].js' : '[name].js',
        devtoolModuleFilenameTemplate: info =>
          path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? "nosources-source-map" : "eval-source-map",
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    plugins: isProduction ?
        commonPlugins.concat([
            new MiniCssExtractPlugin({ filename: 'style.css' }),
            new CopyWebpackPlugin([{ from: CONFIG.assetsDir }]),
        ])
        : commonPlugins.concat([
            new webpack.HotModuleReplacementPlugin(),
        ]),
    resolve: {
        symlinks: false
    },
    devServer: {
        publicPath: "/",
        contentBase: CONFIG.assetsDir,
        port: CONFIG.devServerPort,
        proxy: CONFIG.devServerProxy,
        hot: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.fs(x|proj)?$/,
                use: {
                    loader: "fable-loader",
                },
            }
        ]
    }
};
