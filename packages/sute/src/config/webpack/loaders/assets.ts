
const assetModulesFn = () => [
  {
    test: /\.(png|jpe?g|gif|svg)$/,
    type: "asset/resource",
    generator: {
      filename: "static/img/[name].[hash:12][ext]",
    },
    parser: {
      // url-loader 的limit 效果
      dataUrlCondition: {
        maxSize: 100 * 1024,
      },
    },
  },
  {
    test: /\.ttf|eot|woff2?$/i,
    type: "asset/resource",
    generator: {
      filename: "static/fonts/[name]/[hash:6][ext]",
    },
  },
]

export default assetModulesFn
