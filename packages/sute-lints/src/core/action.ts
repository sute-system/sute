

import { SuteEslint } from "../config"
import type { eslinOptsType } from "../types/lints"

const eslintAction = (path: string, opts: eslinOptsType) => {
  const suteEslint = new SuteEslint(path, opts)
  suteEslint.run()
}

const testCommponentAction = () => {

}


export {
  eslintAction,
  testCommponentAction
}
