
import { program } from "commander";

import { eslintAction, testCommponentAction, } from "./action"
import type { eslinOptsType } from "../types/lints"

export function createCommands() {

  program
    .option('-f --fix')
    .command("eslint [matchPamams]")
    .alias("el")
    .description("eslint file")
    .action((matchPamams: string = "src/**/*", opts: eslinOptsType) => {
      eslintAction(matchPamams,{...opts})
    });

  program
    .command('dev')
    .description(" will be executed development command ")
    .action(() => {
      testCommponentAction()
    });

  program
    .command('build')
    .description(" will be executed build command ")
    .action(() => {
      testCommponentAction()
    })
    
  program
    .command('test')
    .description("test ")
    .action(() => {
      testCommponentAction()
    })
}

