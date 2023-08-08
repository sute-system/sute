import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin"
import progressBarWebpackPlugin from "progress-bar-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin"; // http压缩插件
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';// 检测路径大小写敏感
import type { configInstance } from "../../types/webpack"

class Plugins {

  private initConfig: configInstance
  constructor(options: configInstance) {
    this.initConfig = options
  }

  get config() {
    return [
      new progressBarWebpackPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new CaseSensitivePathsPlugin(),
      this.httpCompressiton
    ].filter(Boolean)
  }
  get httpCompressiton() {
    const httpComOps = this.initConfig.extraOptimizeConfig.httpCompressiton;
    if(!httpComOps) return ""
    const options = typeof httpComOps==="boolean"? this.httpDefault:httpComOps
    return new CompressionPlugin(options)

  }
  get httpDefault() {
    return {
      test: /.(css|js)$/,
      minRatio: 0.7,
      algorithm: "gzip"
    }
  }
}

export default Plugins