
import ReactRefreshPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import type { configInstance } from "../../types/webpack"

class DevWebpackConfig {
  private initConfig: configInstance
  constructor(options: configInstance) {
    this.initConfig = options
  }
  get devConfig() {
    return {
      mode: "development",
      devtool: "source-map",
      plugins: [
        new ReactRefreshPlugin(),//热更新
      ]
    }
  }
}

export default DevWebpackConfig
