// const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

module.exports = (env = {}) => {
  const { mode = "development" } = env;

  const isProd = mode === "production";
  const isDev = mode === "development";

  const getStyleLoaders = () => {
    return [
      isProd ? MiniCssExtractPlugin.loader : "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: true,
        },
      },
    ];
  };

  const getPlugins = () => {
    const plugins = [];

    if (isProd) {
      plugins.push(
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin({
          filename: "main-[hash:8].css",
        })
      );
    }

    return plugins;
  };

  return {
    mode: isProd ? "production" : isDev && "development",

    output: {
      filename: "lib.js",
      publicPath: "dist",
      library: "New_lib", // Имя библиотеки в при экспорте. C большой буквы, тк класс
      libraryTarget: "window",
      libraryExport: "default",
    },
    resolve: { extensions: [".js", ".ts"] },

    devServer: {
      contentBase: "./public/",
      watchContentBase: true,
      open: true, // автоматически открывает браузер
    },

    plugins: getPlugins(),

    devtool: isDev ? "eval-cheap-source-map" : undefined,

    module: {
      rules: [
        // Loading JS
        {
          test: /\.(js|ts)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },

        // Loading SASS
        {
          test: /\.(s[ca]ss)$/,
          use: [
            ...getStyleLoaders(),
            {
              loader: "sass-loader",
              options: {
                // To enable CSS source maps, you'll need to pass the sourceMap option to the sass-loader and the css-loader
                sourceMap: true,
              },
            },
          ],
        },

        // Loading CSS
        {
          test: /\.css$/,
          use: getStyleLoaders(),
        },
      ],
    },
  };
};
