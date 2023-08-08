
import type { Configuration, Compiler, WebpackPluginInstance } from "webpack"
import type { Configuration as devServeConfiguration, Compiler, MultiCompiler, Configuration } from 'webpack-dev-server';
import type HtmlWebpackPlugin from "html-webpack-plugin"
import type CopyPlugin from "copy-webpack-plugin"

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

export type autoUploadPluginType = {
  buildPath?: string,
  host: string,
  username: string,
  password: string,
  remotePath: string
}
export interface IExtraOptimConfig {
  //  常用plugins 便捷化入口.
  htmlWebpackPlugin?: HtmlWebpackPlugin.Options,
  copyWebpackPlugin?: CopyPlugin.PluginOptions,
  definePlugin?: objType
  miniCssExtractPlugin?: boolean, // 是否将css提取到一个独立的css文件中.
  threadLoader?: boolean | objType  // 是否开启多线程打包, boolean 类型和对象类型
  buildFileAnaly?: boolean//打包后的文件分析
  buildTimeAnaly?: boolean//打包后的时间分析
  httpCompressiton?: boolean | objType //  是否http 压缩
  buildSpeendUp?: boolean | buildSpeendUpType, // 开启esbuild 和swc 加速
  esbuildMinimizer?: boolean // 启用esbuild 压缩处理器,
  deploy?: autoUploadPluginType | autoUploadPluginType[], // 打包后自动部署~
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

