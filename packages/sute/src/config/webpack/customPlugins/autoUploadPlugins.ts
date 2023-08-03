import { NodeSSH } from "node-ssh"
import { Compiler } from "webpack"

import type { autoUploadPluginType } from "../../../types/webpack"

type sshType = InstanceType<typeof NodeSSH>

class AutoUploadPlugin {
  private ssh: sshType
  private options: autoUploadPluginType
  constructor(options: autoUploadPluginType) {
    this.ssh = new NodeSSH()
    this.options = options
  }
  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapAsync("AutoUploadPlugin", async (compilation, callback) => {

      // 1.获取输出的文件夹
      const buildPath = this.options.buildPath
      const outputPath = buildPath ? buildPath : compilation.outputOptions.path;

      // 2.连接服务器(ssh连接)
      await this.connectServer();

      // 3.删除原来目录中的内容
      const serverDir = this.options.remotePath;
      await this.ssh.execCommand(`rm -rf ${serverDir}/*`);

      // 4.上传文件到服务器(ssh连接)
      await this.uploadFiles(outputPath!, serverDir);

      // 5.关闭ssh
      this.ssh.dispose();

      callback();
    });
  }

  async connectServer() {
    await this.ssh.connect({
      host: this.options.host,
      username: this.options.username,
      password: this.options.password
    });

    console.log("连接成功~");
  }

  async uploadFiles(localPath: string, remotePath: string) {
    const status = await this.ssh.putDirectory(localPath, remotePath, {
      recursive: true,
      concurrency: 10
    });
    console.log('传送到服务器: ', status ? "成功" : "失败");
  }
}

export default AutoUploadPlugin

