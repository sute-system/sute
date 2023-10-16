
import { program } from "commander";

import { eslintAction, testCommponentAction, } from "./action"
import type { eslinOptsType } from "../types/lints"

export function createCommands() {

  program
    .command("eslint [matchPamams]")
    .alias("el")
    .option('-f --fix')
    .description("eslint file")
    .action((matchPamams: string = "src/**/*", opts: eslinOptsType) => {
      eslintAction(matchPamams, { ...opts })
    });

  program
    .command('pretter')
    .description(" will be executed development command ")
    .action(() => {
      testCommponentAction()
    });

  program
    .command('test')
    .description("test ")
    .action(() => {
      testCommponentAction()
    })
}

