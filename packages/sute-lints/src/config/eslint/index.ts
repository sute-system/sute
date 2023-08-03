
import { ESLint } from "eslint"
import Factory from "../../core/factory"

class SuteEslint extends Factory {
  static readonly EXTENSIONS = ['ts', "tsx", "js", "jsx"]
  exePath: string
  eslint: InstanceType<typeof ESLint>
  constructor(exePath: string, ...args: any[]) {
    super()
    this.exePath = exePath;
    this.eslint = this.createEslint(...args)
  }
  init() {

  }
  run() {
    this.init()
  }
  private createEslint(...args: any[]) {

    const eslintConfig = {}

    const eslint = new ESLint({
      fix: false,
      overrideConfig: eslintConfig,
      extensions: SuteEslint.EXTENSIONS,
      useEslintrc: false// 是否使用项目根目录下的.eslintrc文件或者package.json中的ESlint,默认情况下会向上查找~
    })
    return eslint
  }
  getConfig() {

  }
  getIgnoreConfig() {

  }
}

export default SuteEslint