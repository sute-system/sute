
import { loader as MiniCssExtractPluginLoader } from 'mini-css-extract-plugin';

import type { configInstance } from "../../../types/webpack"
import { getAbsolutePath } from '../../../utils/file';

class Style {

  private initConfig: configInstance
  private isProd: Boolean
  constructor(options: configInstance) {
    this.initConfig = options
    this.isProd = process.env.NODE_ENV === "production"
  }

  private _styleLoader = getAbsolutePath("style-loader")
  private _cssLoader = getAbsolutePath("css-loader")
  private _sassLoader = getAbsolutePath("sass-loader")
  private _lessLoader = getAbsolutePath("less-loader")
  private _postcssLoader = getAbsolutePath("postcss-loader")

  get config() {

    return [
      {
        test: /\.css$/,
        use: [
          this.styleLoader,
          this.cssLoader,
          this.postcssLoader
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          this.styleLoader,
          this.cssLoader,
          this.postcssLoader,
          this.sassLoader
        ]
      },
      {
        test: /\.less$/,
        use: [
          this.styleLoader,
          this.cssLoader,
          this.postcssLoader,
          this.lessLoader
        ]
      },
    ]
  }
  get styleLoader() {
    const isShow = this.initConfig.extraOptimizeConfig.miniCssExtractPlugin && this.isProd
    return isShow ? MiniCssExtractPluginLoader : { loader: this._styleLoader }
  }
  get cssLoader() {
    return {
      loader: this._cssLoader,
      options: {
        importLoaders: 2,
        sourceMap: true,
      },
    }
  }
  get postcssLoader() {
    return {
      loader: this._postcssLoader,
      options: {
        sourceMap: true,
      },
    }
  }
  get sassLoader() {
    return {
      loader: this._sassLoader,
      options: {
        sourceMap: true,
      },
    }
  }
  get lessLoader() {
    return {
      loader: this._lessLoader,
      options: {
        sourceMap: true,
      },
    }
  }
}

export default Style