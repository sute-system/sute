import { ESLint } from "eslint"

import Factory from "../../core/factory";

import type { eslinOptsType } from "../../types/lints";

class SuteEslint extends Factory {
  static readonly EXTENSIONS = ['ts', "tsx", "js", "jsx"]
  private exePath: string
  private patternPathArr: string[] = []
  private eslintConfig: Record<string, any>
  private eslintInstance: InstanceType<typeof ESLint>
  constructor(exePath: string, opts: eslinOptsType) {
    super()
    this.exePath = exePath;
    this.eslintConfig = this.getConfig()
    this.eslintInstance = this.createEslint(opts)
  }

  async init() {
    // 加载指定的代码格式器
    const formatter = await this.eslintInstance.loadFormatter();
    // 在ESLint库中，lintFiles方法用于对指定的文件进行代码检测
    this.patternPathArr.map(async (patterPath) => {
      const checkFile = await this.eslintInstance.lintFiles(patterPath)// 需要检测的文件路径~
      const errText = formatter.format(checkFile)
      // 输出报错信息
      console.log(errText);
    })
  }
  run() {
    this.init()
  }
  public getConfig(): Record<string, any> {
    // 获取默认eslintrc 文件
    const eslintrcPath = this.getConfigPath("eslintrc");
    const ignoreArr = this.getIgnoreConfig(this.exePath, "eslintignore");
    this.patternPathArr = ignoreArr
    return eslintrcPath
  }
  private createEslint(opts: eslinOptsType) {
    const eslint = new ESLint({
      fix: false,
      overrideConfig: this.eslintConfig,
      extensions: SuteEslint.EXTENSIONS,
      useEslintrc: false// 是否使用项目根目录下的.eslintrc文件或者package.json中的ESlint,默认情况下会向上查找~
    })
    return eslint
  }
}

export default SuteEslint