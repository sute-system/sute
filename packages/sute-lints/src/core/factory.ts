
import path from "path"
import { sync, Pattern } from "fast-glob"
import { resolveApp } from "../utils/utils"
import { existsSync, readFileSync } from "fs"


type configNameType = "eslintrc" | "prettierrc" | "stylelintrc"
type ignoreConfigNameType = "eslintignore" | "prettierignore"

abstract class Factory {

  constructor() {
  }
  abstract getConfig(): void;
  // abstract getIgnoreConfig(): void
  abstract init(): void

  // 获取默认配置路径~
  protected getConfigPath(configType: configNameType) {
    const configPath = path.resolve(__dirname, `../rules/.${configType}.js`)
    return require(configPath)
  }

  // 获取过滤后的路径~
  protected getIgnoreConfig(patternsPath: string, ignoreFileType: ignoreConfigNameType) {
    const ignoreFilePath = resolveApp(`.${ignoreFileType}`)
    
    const result = sync(patternsPath, {
      ignore: this.getIgnoreFile(ignoreFilePath)
    })
    return result
  }
  getIgnoreFile(ignorePath: string) {

    const getIgnoreArr = this.getIgnoreFileArr(ignorePath)

    return getIgnoreArr
  }

  getIgnoreFileArr(ignorePath: string) {
    let ignoreArr: string[] = [];
    if (existsSync(ignorePath)) {
      ignoreArr = readFileSync(ignorePath, "utf-8").split("\n").filter(Boolean)
    }
    return ignoreArr
  }
}

export default Factory