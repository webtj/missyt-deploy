const { NodeSSH } = require("node-ssh");
const { getConfig } = require("../config");
const { log, sshConnect, infoColor } = require("../utils");
const { prompt } = require("inquirer");
const path = require("path");

//展示所有版本列表
const handleListAction = () => {
  const config = getConfig();
  const envList = config.envList || [];
  envList.forEach((env, index) => {
    log.info(`${index + 1}. ${env.name}(${env.host})`);
  });
};

//现实所有版本列表
const handleBackAction = async () => {
  try {
    const config = getConfig();
    const envList = config.envList || [];
    if (!envList.length) {
      log.error("✖️ 请先配置环境列表");
      process.exit(0);
    }
    const answers = await prompt([
      {
        type: "list",
        name: "env",
        message: infoColor("请选择回滚环境："),
        choices: envList,
        default: envList[0].value,
      },
    ]);
    const env = envList.find((env) => env.value == answers.env);
    const ssh = new NodeSSH();
    await sshConnect(ssh, env);
    const dirname = path.dirname(env.remotePath);
    const basename = path.basename(env.remotePath);
    const { stdout, stderr } = await ssh.execCommand("ls", {
      cwd: dirname,
    });
    if (stderr) {
      log.error(`✖️ 获取版本列表失败：${stderr}`);
      process.exit(0);
    }
    const list = stdout
      .split("\n")
      .filter((item) => item.indexOf(`${basename}.bak`) > -1);
    if (!list.length) {
      log.warn("✖️ 暂无可回滚的版本");
      process.exit(0);
    }
    const vanswers = await prompt([
      {
        type: "list",
        name: "version",
        message: infoColor("请选择回滚版本："),
        choices: list,
      },
    ]);
    const version = vanswers.version;
    const { stderr: backError } = await ssh.execCommand(
      `rm -rf ${basename} && mv ${version} ${basename}`,
      {
        cwd: dirname,
      }
    );
    if (backError) {
      log.error(`✖️ 回滚版本失败：${stderr}`);
      process.exit(0);
    }
    log.success("✔️ 回滚版本成功");
    ssh.dispose();
  } catch (error) {
    log.error(`✖️ 回滚失败：${error}`);
  }
  process.exit(0);
};

module.exports = {
  handleListAction,
  handleBackAction,
};
