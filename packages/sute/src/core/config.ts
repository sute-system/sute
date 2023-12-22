import fs from "fs"
import Print from "./stdout";
import detect from "detect-port"
import inquirer from "inquirer"
import _ from "lodash"
import { resolveApp } from "../utils/file"

import type { IWebpackConfig, IserviceConfig } from "../types/webpack"

class Config extends Print {
  private mustParams: string[] = []
  private additionalOptimize: string[] = [
    "miniCssExtractPlugin",
    "threadLoader",
    "buildFileAnaly",
    "buildTimeAnaly",
    "httpCompressiton",
    "buildSpeendUp",
    "esbuildMinimizer",
    "htmlWebpackPlugin",
    "copyWebpackPlugin",
    "definePlugin",
    "deploy",
    "prodConfig"
  ]
  // private prodConfig: Configuration = {}
  public commonConfig: IWebpackConfig = {}// 抽离出来entry, output等webpack源配置
  // 开发需要依赖
  public extraOptimizeConfig: Record<string, any> = this.extOpteConfDefault
  public serviceConfig: IserviceConfig = this.serviceConfigDefault
  constructor() {
    super()
  }
  private async init() {
    const ConfigFilePath = resolveApp("sute.config.js")
    if (!fs.existsSync(ConfigFilePath)) {
      this.warnStdout("sute.config.js file not exist!,suggest execute `sute init` command")
    }
    if (fs.existsSync(ConfigFilePath)) {
      // 1.获取对应配置
      const configFileInfo = require(ConfigFilePath)
      // 2.对配置进行检测.
      await this.checkConfig(configFileInfo)
      // 3.保存自定义的相关配置
      await this.setAdditionalOptimize(configFileInfo)
      //保存entry,output,resolve等webpack参数
      await this.setCommonConfigFn(configFileInfo)
      // serve存在,那么就保存合并开发依赖. 保存serve数据
      if (JSON.stringify(configFileInfo.serve) !== "{}") {
        await this.setServiceConfigFn(configFileInfo.serve)
      }
    }
  }
  public async run() {
    await this.init()
  }
  // 对配置检测.mustParams 必须要存在
  private async checkConfig(configInfo: IWebpackConfig) {
    const resParams = Object.keys(configInfo)
    this.mustParams.forEach((item) => {
      if (resParams.indexOf(item) === -1) {
        this.failStdout(`property "${item}" is must params config!`)
        process.exit(0);
      }
    })
  }
  // commonConfig
  private async setCommonConfigFn(commonConfig: IWebpackConfig) {
    const _newOriginConfig = _.cloneDeep(commonConfig)
    delete _newOriginConfig.serve
    Object.keys(_newOriginConfig).forEach((item) => {
      if (this.additionalOptimize.includes(item)) {
        if (this.isValidKey(item, _newOriginConfig)) {
          delete _newOriginConfig[item]
        }
      }
    })
    // 删除额外的参数
    this.commonConfig = _newOriginConfig
  }
  // 设置开发依赖
  private async setServiceConfigFn(serverConfig: IserviceConfig) {
    // 合并devServe
    const _serverConfig = _.cloneDeep(serverConfig)
    // ProxyConfigArrayItem devServeConfiguration["proxy"]
    const proxy = _serverConfig.proxy as Record<string, any>
    if (proxy) {
      delete _serverConfig.proxy;
      const serveProxy = Object.keys(proxy).map((p: string) => ({
        path: p,
        ...proxy[p],
      }))
      _serverConfig.proxy = serveProxy
    }
    this.serviceConfig = _serverConfig
  }
  // 保存生产环境下的配置-- 直接从extraOptimizeConfig 获取就行了，不用单独抽离出去
  // private async setProdConfig(prodConfig: Configuration) {
  //   this.prodConfig = prodConfig
  // }
  // 保存额外的性能优化相关配置
  private async setAdditionalOptimize(config: IWebpackConfig) {
    const _config = _.cloneDeep(config);
    Object.keys(_config).forEach(item => {
      if (this.additionalOptimize.includes(item)) {
        if (this.isValidKey(item, _config)) {
          this.extraOptimizeConfig[item] = _config[item]
        }
      }
    })
  }

  // dev环境测试端口号是否被占用
  public async devCheckPort(port: number) {
    if (port) {
      // 如果未占用,返回原来端口号, 如果占用, 返回新端口号!
      const newPort = await detect(port);
      if (newPort === port) return;
      // 判断是否在执行环境中.
      const isInteractive = process.stdout.isTTY;
      if (isInteractive) {
        const changePort = await this.changePort(newPort, port);
        this.serviceConfig.port = Number(changePort)
      }
    }
  }
  private async changePort(newPort: number, port: number) {
    const question = {
      type: 'confirm',
      name: 'changePort',
      message: `port: ${port} has been used，use new port ${newPort} instead?`,
      default: true,
    };
    const answer = await inquirer.prompt([question]);
    if (answer.changePort) {
      return newPort;
    }
    this.failStdout(`so sorry, ${port} already in use！！`);
    process.exit(0);
  }
  // 对象类型检测
  protected isValidKey(K: string | number | symbol, O: Object): K is keyof Object {
    return K in O
  }
  get extOpteConfDefault() {
    return {
      miniCssExtractPlugin: false, // 是否将css提取到一个独立的css文件中.
      threadLoader: false,// 是否开启多线程打包, boolean 类型和对象类型.
      buildFileAnaly: false,// 打包后的文件分析,使用webpack-bundile-analyzer.
      buildTimeAnaly: false,// 打包后的时间分析
      httpCompressiton: false,// http 压缩, 默认使用gzip压缩 使用compression-webpack-plugin库,
      buildSpeendUp: false, // 开发esbuild/swc加速~
      esbuildMinimizer: false,// 是否开启esbuild 压缩.
      deploy: false,// 部署
      prodConfig: false,// 生产环境下的配置
      htmlWebpackPlugin: {
        title: "sute_cli",
        template: resolveApp("./public/index.html")
      },
      definePlugin: {
        BASE_URL: '"./"'
      },
      copyWebpackPlugin: {
        patterns: [
          {
            from: resolveApp("./public"),
            globOptions: {//除了忽视的这几个文件,其他的全部copy.
              ignore: [
                "**/index.html"
              ]
            }
          }
        ]
      },
    }
  }
  get serviceConfigDefault() {
    return {
      port: 3000,
      host: "127.0.0.1",
      hot: true,
    }
  }
}

export default Config