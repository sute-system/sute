const program = require("commander");

import { initConfigFileAction, devCommponentAction, prodCommponentAction,testCommponentAction} from "./action"

export function createCommands() {
  program
    .command("init")
    .description("create init config file")
    .action(() => {
      initConfigFileAction()
    });
  program
    .command('dev')
    .description(" will be executed development command ")
    .action(() => {
      devCommponentAction()
    });

  program
    .command('build')
    .description(" will be executed build command ")
    .action(() => {
      prodCommponentAction()
    })
    program
    .command('test')
    .description("test ")
    .action(() => {
      testCommponentAction()
    })
}

