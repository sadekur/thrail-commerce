const path = require("path");

module.exports = (env, argv) => {
  return {
    mode: argv.mode || "development",
    entry: {
      admin: path.resolve(__dirname, "spa/admin/src/App.jsx"),
      block: path.resolve(__dirname, "spa/block/src/App.jsx"),
      public: path.resolve(__dirname, "spa/public/src/App.jsx"),
      tailwind: path.resolve(__dirname, "assets/css/tailwind.css"),
    },
    output: {
      filename: "[name].build.js",
      path: path.resolve(__dirname, "spa/build"),
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
              ],
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  ident: "postcss",
                  plugins: [require("tailwindcss"), require("autoprefixer")],
                },
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".json"],
    },
  };
};