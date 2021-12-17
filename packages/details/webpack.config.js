const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const deps = require("./package.json").dependencies;
module.exports = {
  mode: "development",
  devServer: {
    port: 3002,
    historyApiFallback: true,
  },
  
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /nodeModules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "details",
      filename: "remoteEntry.js",
      exposes:{
        './Details': "./src/Details"
      },
      shared: [
        {
          ...deps,
          react: {
            singleton: true,
            requiredVersion: deps.react,
          },
          "urql": {
            singleton: true,
            requiredVersion: deps["urql"]
          },
          "graphql": {
            singleton: true,
            requiredVersion: deps["graphql"]
          },
          "react-dom": {
            singleton: true,
            requiredVersion: deps["react-dom"],
          },
        },
        // Workaround explaination: https://www.youtube.com/watch?v=-LNcpralkjM&t=540
      ],
    }),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ],
};
