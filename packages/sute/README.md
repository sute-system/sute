# 说明文档

## sute: 一个基于webapck管理react应用程序的工具.

### 特点:

- 简单,方便,快捷的配置webpack
  
- 支持通过swc和esbuild 加速打包.
  
- 内置支持TypeScript
  

### 环境要求

- Node.js 版本Node.js 16+
  

### 安装:

```javascript
npm install sute --save-dev
# or
yarn add sute --dev
# or 
pnpm add sute --save-dev
```

### 命令行

#### sute  init

- 初始化配置, 生成一个sute.config.js文件.
  
- 自动生成entry,output等默认配置
  

```javascript
"use strict";
const path = require("path");
const appDir = process.cwd();
const resolveApp = (dir) => path.resolve(appDir, dir);


const ConfigFile = {
  entry: {
    index: resolveApp("src/index.tsx")//默认resolve.extensions自动匹配src文件
  },
  output: {
    filename: "static/js/[name]_[[hash:8].js",
    path: resolveApp("./build"),
    clean: true
  },
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
        globOptions: {
          ignore: [
            "**/index.html"
          ]
        }
      }
    ]
  },
  serve: {
    port: 3000,
    host: "127.0.0.1",
    hot: true,
  },
};
module.exports = ConfigFile;
```

##### 说明

resolve 默认配置

- extensions:[".wasm", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".vue", ".json"]
- alias: 根据 src 下子目录自动生成,您无需匹配
  
  ```javascript
  {
   '@': resolveApp("./src"),
   pages: resolveApp("./src/pages"),  
   router: resolveApp("./src/router"),  
   services: resolveApp("./src/services"),
   ...
  }
  ```
  

#### sute dev

启动开发服务器

#### sute build

使用内部webpack实例打包文件

### 配置

#### 配置项

```javascript
  //  常用plugins 便捷化入口.
  htmlWebpackPlugin?: HtmlWebpackPlugin.Options,
  copyWebpackPlugin?: CopyPlugin.PluginOptions,
  definePlugin?: DefinePlugin.Options配置
  // 自定义
  miniCssExtractPlugin?: boolean, // 是否将css提取到一个独立的css文件中.
  threadLoader?: boolean | threadLoader.options  // 是否开启多线程打包, boolean 类型和对象类型
  buildFileAnaly?: boolean//打包后的文件分析
  buildTimeAnaly?: boolean//打包后的时间分析
  httpCompressiton?: boolean | compressionWebpackPlugin.options //  是否http 压缩
  buildSpeendUp?: boolean | buildSpeendUpType, // 开启esbuild 和swc 加速
  esbuildMinimizer?: boolean // 启用esbuild 压缩处理器,
  deploy?: autoUploadPluginType | autoUploadPluginType[], // 打包后自动部署~
  serve?: IserviceConfig | compilerType,// 开发环境相关依赖
```

#### 说明

##### buildSpeendUp

- 默认值为 false,
- buildSpeendUp:true 启动 esbuild 加速.
- buildSpeendUp 为对象时,可传type 和其对应的options

```markdown
export type buildSpeendUpType = {
  type: "swc" | "esbuild",
  options: objType
}
```

- type:"esbuild" 启动esbuild-loader 替代babel
- options 为对应的esbuild-loader 对应参数

type:esbuild 时options默认值

```typescript
{
      // JavaScript version to compile to
      loader: "tsx",
      target: 'es2015',
}
```

- type:"swc" 启动swc-loader 替代babel.
- options 为对应的swc-loader 对应参数

type:"swc" 时options默认值

```typescript
{
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
```

##### deploy

- 打包build时自动部署(传入单个对象或对象数组)

取参

```typescript
export type autoUploadPluginType = {
  buildPath?: string, // 不传为默认打包地址.build下
  host: string,
  username: string,
  password: string,
  remotePath: string
}
```

##### serve

proxy 传参

```javascript
{
  '/api':{
    target: 'http://test1.com/',
    changeOrigin: true,
  },
  '/api2': {
    target: 'http://test2.com/',
    changeOrigin: true,
  },
}
```

其余 port host hot 等传参和webpack-dev-serve 传参一致.

####