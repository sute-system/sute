
import type { Configuration, Compiler, WebpackPluginInstance } from "webpack"
import type { Configuration as devServeConfiguration, Compiler, MultiCompiler, Configuration } from 'webpack-dev-server';
import type HtmlWebpackPlugin from "html-webpack-plugin"
import type CopyPlugin from "copy-webpack-plugin"
import CompressionPlugin from "compression-webpack-plugin"; // http压缩插件

import type { Config as configInstance } from "../core/config"
import type { DevWebpackConfig as DevConfigInstance } from "../config/webpack/dev";
import type { ProdWebpackConfig as ProdConfigInstance } from "../config/webpack/prod";

export type configInstance = InstanceType<typeof configInstance>
export type DevConfigInstance = InstanceType<typeof DevConfigInstance>
export type ProdConfigInstance = InstanceType<typeof ProdConfigInstance>

export type objType = {
  [key: string]: any
}

export type buildSpeendUpType = {
  type: "swc" | "esbuild",
  options: objType
}
export interface IExtraOptimConfig {
  miniCssExtractPlugin?: boolean, // 是否将css提取到一个独立的css文件中.
  threadLoader?: boolean | objType  // 是否开启多线程打包, boolean 类型和对象类型
  esBuild?: boolean // 是否开启esbuild,
  buildFileAnaly?: boolean//打包后的文件分析
  buildTimeAnaly?: boolean//打包后的时间分析
  httpCompressiton?: boolean | objType
  buildSpeendUp?: boolean | buildSpeendUpType,
  esbuildMinimizer?: boolean // 启用esbuild 压缩处理器,
  
  // 打包后自动部署~
  deploy?:any
  // 打包时写入CDN性能优化
  //  常用plugins 便捷化入口.
  htmlWebpackPlugin?: HtmlWebpackPlugin.Options,
  copyWebpackPlugin?: CopyPlugin.PluginOptions,
  definePlugin?: objType
}

export interface IWebpackConfig extends Configuration, IExtraOptimConfig {
  serve?: IserviceConfig | compilerType,// 开发环境相关依赖
}

// plugins
export type originPluginsType = (
  | ((this: Compiler, compiler: Compiler) => void)
  | WebpackPluginInstance
)[]

export type compilerType = Compiler | MultiCompiler | Configuration

export interface IserviceConfig extends devServeConfiguration {
  port?: number
}

