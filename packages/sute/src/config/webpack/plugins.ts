import FriendlyErrorsWebpackPlugin from "friendly-errors-webpack-plugin"
import progressBarWebpackPlugin from "progress-bar-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin"; // http压缩插件
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';// 检测路径大小写敏感
import type { configInstance } from "../../types/webpack"
import AutoUploadPlugin from "./customPlugins/autoUploadPlugins"


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
      this.initConfig.extraOptimizeConfig.httpCompressiton ? this.httpCompressiton : "",
      ...this.deploy
    ].filter(Boolean)
  }
  get httpCompressiton() {
    return new CompressionPlugin(
      {
        test: /.(css|js)$/,
        minRatio: 0.7,
        algorithm: "gzip"
      })
  }
  get deploy() {
    const deploy = this.initConfig.extraOptimizeConfig.deploy
    if (!deploy) return [""]
    const optionsArray = Array.isArray(deploy) ? deploy : [deploy];
    const result = optionsArray.map((option)=>{
      return new AutoUploadPlugin(option)
    })
    return result
  }
}

export default Plugins