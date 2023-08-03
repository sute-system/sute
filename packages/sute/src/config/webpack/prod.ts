import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import webpack from "webpack"
import { EsbuildPlugin } from "esbuild-loader"
import AutoUploadPlugin from "./customPlugins/autoUploadPlugins"
import Print from "../../core/stdout"

import type { configInstance, autoUploadPluginType } from "../../types/webpack"

class ProdWebpackConfig extends Print {
  private initConfig: configInstance
  constructor(options: configInstance) {
    super()
    this.initConfig = options
  }
  get prodConfig() {
    return {
      mode: "production",
      devtool: "source-map",
      optimization: this.optimization,
      performance: this.performance,
      plugins: this.plugins
    }
  }
  get plugins() {
    return [
      new CssMinimizerPlugin(),// 优化和压缩css
      this.initConfig.extraOptimizeConfig.buildFileAnaly ? new BundleAnalyzerPlugin() : "",
      new webpack.optimize.ModuleConcatenationPlugin(),//对作用域进行提升,并且让webpack打包后的代码更小,运行更快.
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css',
        chunkFilename: 'css/[id].[contenthash].css',
      }),
      ...this.deploy
    ].filter(Boolean)
  }
  get deploy() {
    const deploy = this.initConfig.extraOptimizeConfig.deploy
    if (!deploy) return [""];
    const optionsArray = Array.isArray(deploy) ? deploy : [deploy];;
    if (!this.isValiateDeploy(optionsArray)) return [""];
    const result = optionsArray.map((option) => {
      return new AutoUploadPlugin(option)
    })
    return result
  }
  isValiateDeploy(deployOptions: autoUploadPluginType[] = []) {
    let flag = true
    const validateArr = ["host", "username", "password", "remotePath", "buildPath"];
    deployOptions.forEach((options, index) => {
      const deployArr = Object.keys(options)
      let deployOptionParams = validateArr.filter((item) => {
        return (!deployArr.includes(item) && item !== "buildPath")
      })
      if (deployOptionParams.length) {
        flag = false
        this.failStdout('Deployment failure!', `Please check deploy[${index}]${deployOptionParams.join(",")} parameter is configured`)
      }
    })
    return flag
  }
  get optimization() {
    return {
      splitChunks: {
        chunks: "all",
        minSize: 20000,
        maxAsyncRequests: 6,
        maxInitialRequests: 9,
        automaticNameDelimiter: '~',
        cacheGroups: {
          uisother: {
            test: /([\\/]node_modules[\\/](moment|zrender)[\\/]|[\\/]src[\\/]assets[\\/]fonts[\\/]iconfont.js)/,
            name: 'uisother',
            priority: -1
          },
          uisantd: {
            test: /[\\/]node_modules[\\/](antd)[\\/]/,
            name: 'uisantd',
            priority: -3
          },
          locallibs: {
            test: /[\\/]node_modules[\\/](react|react-dom|redux|react-redux|react-router|react-router-dom)[\\/]/,
            name: 'locallibs',
            priority: -7
          },
          localcharts: {
            test: /[\\/]node_modules[\\/](echarts|echarts-for-react)[\\/]/,
            name: 'localcharts',
            priority: -8
          },
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10
          },
          default: {
            name: 'default',
            minChunks: 2,
            priority: -20,
            filename: "common_[name]_[hash:16].js",
            reuseExistingChunk: true
          }
        }
      },
      minimizer: [
        this.initConfig.extraOptimizeConfig?.esbuildMinimizer
          ? new EsbuildPlugin()
          : new TerserPlugin({
            parallel: true,//使用多进程并发以提高构建速度.
            extractComments: false// 是否将注释剥离到单独的文件当中.
          })
      ],
    }
  }
  get performance() {
    return {// 用于可以控制webpack 如何通知[asset] 和入口文件起点超过指定文件限制.用于计算性能提示的文件
      hints: false,
      maxAssetSize: 500000,//根据单个资源体积(单位: bytes)，控制 webpack 何时生成性能提示。
      maxEntrypointSize: 2000000,//对于所有资源，要充分利用初始加载时(initial load time)期间。此选项根据入口起点的最大体积，控制 webpack 何时生成性能提示。
      assetFilter: function (assetFilename: any) {
        // 提供资源文件名的断言函数
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
      },
    }
  }
}

export default ProdWebpackConfig
