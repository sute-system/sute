import { getAbsolutePath } from "../../../../utils/file"

class BabelLoader {

  private isProduction: Boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === "production"
  }
  get config() {
    return {
      loader: getAbsolutePath("babel-loader"),
      options: {
        presets: [
          [
            getAbsolutePath("@babel/preset-env"),
            {
              // targets: "last 2 version",
              useBuiltIns: "entry",
              corejs: 3,
            },
          ],
          [getAbsolutePath("@babel/preset-react")],
          [getAbsolutePath("@babel/preset-typescript")],
        ],
        plugins: this._plugins
      }
    }
  }
  get _plugins() {
    return [
      getAbsolutePath("@babel/plugin-transform-arrow-functions"),
      getAbsolutePath("@babel/plugin-transform-block-scoping"),
      !this.isProduction ? getAbsolutePath("react-refresh/babel") : ""
    ].filter(Boolean)
  }
}

export default BabelLoader