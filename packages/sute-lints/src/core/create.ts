const program = require("commander");

import { eslintAction, testCommponentAction, } from "./action"

export function createCommands() {
  program
    .option('-d --dest <string>')
    .command("eslint")
    .description("eslint file")
    .action(() => {
      eslintAction(program.opts().dest || "src/**/*")
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

