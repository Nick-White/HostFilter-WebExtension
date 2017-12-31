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
  entry: "./src/options.ts",
  output: {
    filename: "options.js",
    path: path.resolve(__dirname, "dist/options")
  }
});
var logEntriesConfig = Object.assign({}, commonConfig, {
  entry: "./src/logEntries.ts",
  output: {
    filename: "logEntries.js",
    path: path.resolve(__dirname, "dist/logEntries")
  }
});

module.exports = [mainConfig, optionsConfig, logEntriesConfig];