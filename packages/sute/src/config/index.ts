
import { merge } from "webpack-merge";
import SpeedMeasurePlugin from "speed-measure-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { DefinePlugin } from "webpack"
import CopyWebpackPlugin from "copy-webpack-plugin"
import path from "path";

import Plugins from "./webpack/plugins"
import loadersConfig from "./webpack/loaders";
import DevWebpackConfig from "./webpack/dev"
import ProdWebpackConfig from "./webpack/prod"
import Print from "../core/stdout"
import { resolveApp, getAllChildDir, getAbsolutePath } from "../utils/file";

import type { IWebpackConfig, configInstance, DevConfigInstance, ProdConfigInstance } from "../types/webpack"
type mergeConfigType = DevConfigInstance | ProdConfigInstance

export class WebpackConfig extends Print {

  static readonly EXTENSIONS = [
    ".wasm",
    ".mjs",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".vue",
    ".json",
    '.scss',
    '.sass',
    '.less',
    ".html"
  ]
  private initConfig: configInstance
  private isProd: boolean
  private smp: InstanceType<typeof SpeedMeasurePlugin>
  public commoConfig: IWebpackConfig;

  constructor(config: configInstance, isProdEnv: boolean) {
    super()
    this.initConfig = config
    this.isProd = isProdEnv
    this.smp = new SpeedMeasurePlugin()
    this.commoConfig = this._commonConifg(config)
  }

  private _commonConifg(config: configInstance) {

    return {
      ...config.commonConfig,
      output: this.output,
      resolve: this.resolve,
      cache: this.cache,
      module: {
        rules: loadersConfig(config),
      },
      plugins: this._plugins
    }
  }

  get output() {
    const output = this.initConfig.commonConfig.output
    let outPutDefault: IWebpackConfig["output"] = {
      filename: "static/js/[name]_[[hash:8].js",
      path: resolveApp("./build"),
      clean: true,
    }
    if (!output) {
      return outPutDefault
    }
    return {
      ...outPutDefault,
      ...output,
    }
  }
  get cache() {

    const buildSpeendUp = this.initConfig.extraOptimizeConfig.buildSpeendUp
    // 可能为 boolean | 对象 | undefined
    type cacheType = NonNullable<IWebpackConfig['cache']>
    let _cache: cacheType
    // 未设置buildSpeendUp 时取值,
    if (!buildSpeendUp) {
      _cache = this.isProd ? false : {
        // 设置最大代数数量为2;
        // 表示内存缓存中最多保存 2 代的生成文件
        type: "memory",
        maxGenerations: 2
      }
      return _cache
    }

    _cache = {
      type: "filesystem",
      version: this.projectVersion,
      maxAge: 7 * 24 * 3600000
    }
    return _cache
  }
  get resolve() {
    const resolve = this.initConfig.commonConfig.resolve
    if (!resolve) return this.resolveDefault
    return {
      ...this.resolveDefault,
      ...resolve,
    }
  }
  get _plugins() {

    const {
      htmlWebpackPlugin,
      copyWebpackPlugin,
      definePlugin
    } = this.initConfig.extraOptimizeConfig

    const commonPlugin = this.initConfig.commonConfig?.plugins ? this.initConfig.commonConfig.plugins : []
    return [
      new HtmlWebpackPlugin(htmlWebpackPlugin),
      new CopyWebpackPlugin(copyWebpackPlugin),
      new DefinePlugin(definePlugin),
      ...commonPlugin,
      ...new Plugins(this.initConfig).config
    ].filter(Boolean)
  }

  get projectVersion() {
    const packageJsonPath = resolveApp("package.json")
    if (!packageJsonPath) {
      this.warnStdout("package.json file not found!")
    }
    return require(packageJsonPath).version
  }
  get resolveDefault() {

    const rootDirPath = resolveApp("src")
    // const swcHelperPath = path.resolve(__dirname, "../../node_modules/@swc/helpers")
    // const swcCorePath = path.resolve(__dirname, "../../node_modules/@swc/core")

    let _alias = {
      "@": resolveApp("./src"),
      // "@swc/helpers": swcHelperPath,
      // "@swc/core": swcCorePath
    }
    // 获取src下的所有目录~
    const srcChildDirObj = getAllChildDir(rootDirPath)
    if (Object.keys(srcChildDirObj).length !== 0) {
      _alias = {
        ..._alias,
        ...srcChildDirObj
      }
    }
    console.log("_alias", _alias);
    return {
      extensions: WebpackConfig.EXTENSIONS,
      alias: _alias,
      //当正常解析失败后,重定向模块请求.
      fallback: {
        fs: false,
        assert: require.resolve('assert'),
        buffer: require.resolve('buffer'),
        os: require.resolve('os-browserify/browser'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        string_decoder: require.resolve('string_decoder'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
      }
    }
  }

  mergeConfig(config: mergeConfigType) {
    const buildTimeAnaly = this.initConfig.extraOptimizeConfig.buildTimeAnaly
    if (buildTimeAnaly && this.isProd) {
      return Object.freeze(this.smp.wrap(merge(config, this.commoConfig)))
    }
    return Object.freeze(merge(config, this.commoConfig))
  }
}

type envType = "development" | "production"
const exeConfig = (env: envType, initConfig: configInstance): IWebpackConfig => {

  process.env.NODE_ENV = env;
  const isProduction = env === "production";

  const webpackConfig = new WebpackConfig(initConfig, isProduction)

  // 获取生产环境和开发环境的配置
  const DevAndProdConfig = isProduction
    ? new ProdWebpackConfig(initConfig).prodConfig
    : new DevWebpackConfig(initConfig).devConfig

  return webpackConfig.mergeConfig(DevAndProdConfig);

}

export default exeConfig
