import path, { resolve } from "path"
import fs from "fs"
import ejs from "ejs"

const appDir = process.cwd()
const resolveApp = (dir: string) => path.resolve(appDir, dir)

// 获取一个目录下的所有子目录
type dirObjType = {
  [key: string]: string
}
const getAllChildDir = (targetPath: string): dirObjType => {
  // 判断当前目录是否存在
  let dirObj: dirObjType = {}
  const currDirChildItems = fs.readdirSync(targetPath);//子文件数组
  currDirChildItems.forEach((item: any) => {
    const itemPath = path.join(targetPath, item)
    const isDirectory = fs.statSync(itemPath).isDirectory()
    if (isDirectory) {
      dirObj[item] = itemPath
    }
  })
  return dirObj
}

// 写入ejs
const compile = (templatePath: string, name: string, otherData?: dirObjType) => {
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, { otherData, }, {}, (err: any, str: string) => {
      if (err) {
        console.log(err)
        reject(err)
        return
      }
      resolve(str)
    });
  })
}

const writeToFile = (path: string, content: any) => {
  // 判断path 是否存在,如果不存在,创建对应的文件夹
  return fs.promises.writeFile(path, content)
}

// 获取一个目录下的子目录
const getFileArr = (targetPath: string) => {
  let fileArr: string[] = []
  const dirNameArr = fs.readdirSync(targetPath)
  for (let file of dirNameArr) {
    const itemPath = path.join(targetPath, file)
    const isFile = fs.statSync(itemPath).isFile()
    if (isFile) {
      fileArr.push(file)
    }
  }
  return fileArr
}

// 获取默认文件
const getDefaultRootFile = (rootPath: string, extensionsArr: string[]) => {
  let targetIndex = ""
  const fileArr = getFileArr(rootPath)
  for (let suffix of extensionsArr) {
    let indexName = `index${suffix}`;
    if (fileArr.includes(indexName)) {
      targetIndex = indexName
      break;
    }
  }
  return targetIndex
}

const getAbsolutePath = (name: string) => {
  // 搜索指定模块的绝对路径并返回该路径。
  // 这个方法的作用类似于 Node.js 的 require,但不会加载模块，只返回模块的路径。
  const path = require.resolve(name)
  return path
}

export {
  resolveApp,
  getAllChildDir,
  compile,
  writeToFile,
  getFileArr,
  getDefaultRootFile,
  getAbsolutePath
}
