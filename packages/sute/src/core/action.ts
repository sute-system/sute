import fs from "fs";
import path from "path"
import webpack from "webpack"
import WebpackDevServer from 'webpack-dev-server';
// import lints from "sute-lints"

import { resolveApp, compile, writeToFile, getDefaultRootFile } from "../utils/file"
import exeConfig, { WebpackConfig } from "../config/index"

import Config from "./config";

// init初始化 sute.config.json配置文件.
export const initConfigFileAction = async () => {
  const ConfigFilePath = resolveApp("sute.config.js")
  if (fs.existsSync(ConfigFilePath)) {
    console.log("sute.config.js file alerady exist!");
    return;
  }
  // 不存在则write.sute.config.js
  const templateFilePath = path.resolve(__dirname, "../../src/config/template/sute.config.ejs")
  const targetPath = resolveApp("src")
  const defaultFileName = getDefaultRootFile(targetPath, WebpackConfig.EXTENSIONS)
  const result = await compile(templateFilePath, "sute.config.js", { entryName: defaultFileName })
  writeToFile(ConfigFilePath, result)
}
// 开发
export const devCommponentAction = async () => {
  // 初始化配置
  const initConfig = new Config();
  await initConfig.run()

  const webpackConfig = exeConfig("development", initConfig)
  const compiler = webpack(webpackConfig);

  // 测试端口号是否被占用
  await initConfig.devCheckPort(initConfig.serviceConfig.port!)
  // 开启本地服务
  const devServer = new WebpackDevServer(compiler, initConfig.serviceConfig)
  await devServer.start();

  const exitProcess = (callback?: () => void) => () => {
    callback && callback();
    process.exit(0);
  };
  process.stdin.on('end', () => {
    devServer.stopCallback(() => {
      exitProcess(() =>
        console.log('webpack devServer process exit successfully')
      );
    });
    // 重置输入流
    process.stdin.resume();
  });
}
// 生产
export const prodCommponentAction = async () => {
  // 初始化配置
  const initConfig = new Config();
  await initConfig.run()
  const webpackConfig = exeConfig("production", initConfig);
  webpack(webpackConfig, (error, stats: any) => {
    if (stats && stats.hasErrors()) {
      throw stats.toString({
        logging: 'error',
        colors: true,
      });
    }
    if (error) {
      throw error;
    }
  });
}

export const testCommponentAction = () => {
  // const lintsInstance = new lints()
  // lintsInstance.test()
}


