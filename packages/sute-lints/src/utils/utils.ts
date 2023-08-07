import path from "path"
import fs from "fs"
import assert from "assert"

const appDir = process.cwd()
const resolveApp = (dir: string) => path.resolve(appDir, dir)

const isAbsolutePath = (filePath: string) => {
  assert(path.isAbsolute(filePath), "我不是绝对路径~~~~~~~~")
  console.log("测试测试测试~~~")
}

export {
  resolveApp,
  isAbsolutePath
}