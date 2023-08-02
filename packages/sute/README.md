# 说明文档

## sute-conf: 一个基于webapck更好管理react应用程序的工具.

想不起来其他名字，以这个命名吧~

如何安装？

### 特点:# 说明文档
## sute-conf: 一个基于webapck更好管理react应用程序的工具.
想不起来其他名字，以这个命名吧~
如何安装？
### 特点:

- 更方便灵活的配置webpack
- 内置支持TypeScript
### 环境要求:

- Node.js 版本Node.js 14+
### 安装:
```shell
npm install sute-conf -g
```
### 命令行
#### sute-conf  init
> 初始化配置, 生成一个sute-conf.json文件.

###### 基础配置
> 默认生成 enery, output,resolve 等webpack常用配置

```javascript
entry: {
    index: resolveApp("src/index.tsx")
  },
  output: {
    filename: "static/js/[name]_[[hash:8].js",
    path: resolveApp("./build"),
    clean: true
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".ts", ".tsx", ".vue"], //尝试按顺序解析这些后缀名.
    alias: {
      "@": resolveApp("./src"),
      pages: resolveApp("./src/pages"),
      config: resolveApp("./src/config"),
      utils: resolveApp("./src/utils")
    },
  },
```
###### 特殊配置
```javascript
// 服务端配置
serve: {
    port: 8083,
    host: "127.0.0.1",
    proxy:
},
// 是否将css提取到一个独立的css文件中.
miniCssExtractPlugin?: boolean, //默认值false
// 是否开启多线程打包, boolean类型或thread-loader 库相关配置参数
threadLoader?: boolean | Object // 默认值false
// 打包后的文件分析  boolean类型或webpack-bundle-analyzer等相关配置参数
buildFileAnaly?: boolean |object //默认值false
// 是否开启 http 压缩, boolean类型或 compression-webpack-plugin等相关配置参数
httpCompressiton?: boolean | Object. //默认值false
  
```

#### sute-conf dev
启动开发服务器
#### sute-conf build
使用内部webpack实例打包文件


- 更方便灵活的配置webpack
- 内置支持TypeScript

### 环境要求:

- Node.js 版本Node.js 14+

### 安装:

npm install sute-conf -g

### 命令行

#### sute-conf init

初始化配置, 生成一个sute.json文件.

###### 基础配置

默认生成 enery, output,resolve 等webpack常用配置

entry: {
    index: resolveApp("src/index.tsx")
  },
  output: {
    filename: "static/js/[name]_[[hash:8].js",
    path: resolveApp("./build"),
    clean: true
  },
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx", ".ts", ".tsx", ".vue"], //尝试按顺序解析这些后缀名.
    alias: {
      "@": resolveApp("./src"),
      pages: resolveApp("./src/pages"),
      config: resolveApp("./src/config"),
      utils: resolveApp("./src/utils")
    },
  },

###### 特殊配置

// 服务端配置
serve: {
    port: 8083,
    host: "127.0.0.1",
    proxy:
},
// 是否将css提取到一个独立的css文件中.
miniCssExtractPlugin?: boolean, //默认值false
// 是否开启多线程打包, boolean类型或thread-loader 库相关配置参数
threadLoader?: boolean | Object // 默认值false
// 打包后的文件分析  boolean类型或webpack-bundle-analyzer等相关配置参数
buildFileAnaly?: boolean |object //默认值false
// 是否开启 http 压缩, boolean类型或 compression-webpack-plugin等相关配置参数
httpCompressiton?: boolean | Object. //默认值false

#### sute-conf dev

启动开发服务器

#### sute-conf build

使用内部webpack实例打包文件
