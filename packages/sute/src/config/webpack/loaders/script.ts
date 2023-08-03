
import BabelLoader from "./babel/index"
import type { configInstance } from "../../../types/webpack"
import { isObject, isBoolean } from "../../../utils/utils"
import Print from "../../../core/stdout"

class Script extends Print {

  private isProd: boolean
  private initConfig: configInstance
  private _bableLoader: BabelLoader
  private _esbuildLoader = "esbuild-loader"
  private _swcLoader = "swc-loader"
  private _threadLoader = "thread-loader"
  constructor(initConfig: configInstance) {
    super()
    this.isProd = process.env.NODE_ENV === "production"
    this.initConfig = initConfig
    this._bableLoader = new BabelLoader()
  }
  get config() {
    return [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          this.initConfig.extraOptimizeConfig?.buildSpeendUp
            ? this.buildSpeendUp
            : this._bableLoader.config,
          this.threadLoader(this.initConfig),// 是否开启多线程打包
        ].filter(Boolean)
      },
    ]
  }
  private threadLoader(initConfig: configInstance) {
    const threadLoader = initConfig.additionalOptimize.threadLoader
    if (!threadLoader) return "";
    if (threadLoader && typeof threadLoader === "boolean") {
      return {// 是否开启多进程打包
        loader: this._threadLoader,
        options: {
          workers: 3
        }
      }
    }
    return {
      loader: this._threadLoader,
      options: threadLoader
    }
  }

  get buildSpeendUp() {

    const buildSpeendUp = this.initConfig.extraOptimizeConfig?.buildSpeendUp
    if (!isBoolean(buildSpeendUp) && !isObject(buildSpeendUp)) {
      this.failStdout("please check the type of the parameter from sute.config.js config buildSpeendUp !")
      process.exit(1)
    }

    // 为true 默认值为esbuild
    if (isBoolean(buildSpeendUp)) {
      return {
        loader: this._esbuildLoader,
        options: this.esbuildDefault,
      }
    }

    const type = this.initConfig.extraOptimizeConfig?.buildSpeendUp.type
    if ((type !== "swc") && (type !== "esbuild")) {
      this.failStdout("please check the type of the parameter from sute.config.js config buildSpeendUp type !")
      process.exit(1)
    }
    const options = this.initConfig.extraOptimizeConfig?.buildSpeendUp.options

    let buildLoader = {
      loader: type === "swc" ? this._swcLoader : this._esbuildLoader,
      options: options ? options : type === "swc" ? this.swcDefault : this.esbuildDefault
    }
    console.log("buildLoader", buildLoader)
    return buildLoader;

  }

  // esbuild-loader 默认配置
  get esbuildDefault() {
    return {
      // JavaScript version to compile to
      loader: "tsx",
      target: 'es2015',
    }
  }

  // swc-loader 默认配置- 字节跳动~
  get swcDefault() {
    return {
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: true,
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
        },
        externalHelpers: true, // 注意这里设置true时，需要在项目下安装@swc/helpers
        target: 'es5',
      },
      env: {
        targets: "last 3 major versions, > 0.1%", // 根据项目设置
        mode: "usage",
        coreJs: "3" // 根据项目选择
      },
      isModule: 'unknown'
    }
  }
}

export default Script

