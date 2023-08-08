
import path from "path"
import { sync, Pattern } from "fast-glob"// 快速进行文件和目录的匹配操作的node.js库
import { resolveApp } from "../utils/utils"
import { existsSync, readFileSync } from "fs"


type configNameType = "eslintrc" | "prettierrc" | "stylelintrc"
type ignoreConfigNameType = "eslintignore" | "prettierignore"

abstract class Factory {
  abstract getConfig(): void;
  abstract init(): void
  
  // 获取默认配置路径~
  protected getConfigPath(configType: configNameType) {
    const configPath = path.resolve(__dirname, `../rules/.${configType}.js`)
    return require(configPath)
  }

  // 获取过滤后的路径~
  protected getIgnoreConfig(patternsPath: string, ignoreFileType: ignoreConfigNameType) {
    const ignoreConfigPath = resolveApp(`.${ignoreFileType}`)

    // 读取.ignore获取需要过滤的文件
    const ignoreFilePath = this.getIgnoreFile(ignoreConfigPath)
    // 根据sync获取过滤后的文件.
    return sync(patternsPath, {
      ignore: ignoreFilePath
    })
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