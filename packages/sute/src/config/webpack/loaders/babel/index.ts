

class BabelLoader {

  private isProduction: Boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production"
  }

  get config() {

    return {
      loader: "babel-loader",
      options: {
        presets: [
          [
            "@babel/preset-env",
            {
              // targets: "last 2 version",
              useBuiltIns: "entry",
              corejs: 3,
            },
          ],
          ["@babel/preset-react"],
          ["@babel/preset-typescript"],
        ],
        plugins: [
          "@babel/plugin-transform-arrow-functions",
          "@babel/plugin-transform-block-scoping",
          !this.isProduction ? "react-refresh/babel" : ""
        ].filter(Boolean)
      }
    }
  }
}

export default BabelLoader