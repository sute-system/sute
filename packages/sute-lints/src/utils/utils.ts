import path from "path"
import fs from "fs"

const appDir = process.cwd()
const resolveApp = (dir: string) => path.resolve(appDir, dir)

export {
  resolveApp
}