const { getConfig } = require("../config");
const { log } = require("../utils");
const inquirer = require("inquirer");

module.exports = async function deployActionBefore(option) {
  const config = getConfig();
  if (Object.keys(config).length === 0) {
    log.error(
      "未检测到根目录下的deploy.config.js配置文件,请先执行：mdeploy init 初始化配置"
    );
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "init",
        message: "是否立刻初始化配置文件？",
        default: true,
      },
    ]);
    if (answers.init) {
      require("./init")();
    } else {
      process.exit(1);
    }
  }
  const deployEnvs = option.env || "all";
  const envList = config.envList;
  if (envList.length === 0) {
    log.error("请配置envList，保证至少一个环境可用！");
    process.exit(1);
  }
  let deployEnvList = envList.find((env) => env.name == deployEnvs);
  if (!deployEnvList) {
    log.warn("未找到对应的部署环境，将重新部署所有环境！");
  }
  deployEnvList = deployEnvList ? [deployEnvList] : envList;
  deployEnvList.forEach((env) => {
    require("./deploy")(env);
  });
};
