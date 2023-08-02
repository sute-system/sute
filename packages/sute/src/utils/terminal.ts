/**
 *
 * @param  {...any} args npm install
 * @returns promise
 */

const { spawn } = require("child_process");

export const commandSpawn = (...args:string[]) => {
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(...args);
    childProcess.stdout.pipe(process.stdout); // 将子进程的标准输出接到当前进程的标准输出上,以便方便查看过程.
    childProcess.stderr.pipe(process.stderr);
    childProcess.on("close", () => {
      resolve();
    });
  });
};

