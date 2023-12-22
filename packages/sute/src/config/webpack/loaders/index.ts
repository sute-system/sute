import assetModulesFn from "./assets"
import Style from "./style"
import Script from "./script"

import type { configInstance } from "../../../types/webpack"


function loadersConfig(initConfig: configInstance) {
  const assetModules = assetModulesFn()
  const style = new Style(initConfig).config
  const script = new Script(initConfig).config
  const result = [...style, ...script, ...assetModules]
  return result;
}

export default loadersConfig