const path = require("path");

var commonConfig = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".js" ]
  }
};

var mainConfig = Object.assign({}, commonConfig, {
  entry: "./src/main.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  }
});
var optionsConfig = Object.assign({}, commonConfig, {
  entry: "./src/options/options.ts",
  output: {
    filename: "options.js",
    path: path.resolve(__dirname, "dist/options")
  }
});

module.exports = [mainConfig, optionsConfig];