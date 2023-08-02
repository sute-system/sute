
import chalk from "chalk"

class Print {
  protected successStdout(...args: string[]) {
    console.log(...args.map(item => chalk.green(item)))
  }
  protected warnStdout(...args: string[]) {
    console.log(...args.map(item => chalk.yellow(item)))
  }
  protected failStdout(...args: string[]) {
    console.log(...args.map(item => chalk.red(item)))
  }
}

export default Print
