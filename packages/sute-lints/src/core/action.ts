
import { SuteEslint } from "../config"

const testCommponentAction = () => {

}

const eslintAction = (path: string) => {
  // 默认执行src 下所有的css 文件
  // 传参则执行对应的css文件
  const suteEslint = new SuteEslint(path)

  suteEslint.run()
}

export {
  eslintAction,
  testCommponentAction
}