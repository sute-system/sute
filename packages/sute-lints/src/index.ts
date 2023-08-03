#!/usr/bin/env node --max_old_space_size=4096

import program from "commander";
import { helpOptions } from "./core/help";
import { createCommands } from "./core/create"
import packageJson from "../package.json"

// 查看版本号
program.version(packageJson.version);
// 帮助和可选的信息
helpOptions()

// 创建其他指令-执行对应命令
createCommands()
program.parse(program.argv);
