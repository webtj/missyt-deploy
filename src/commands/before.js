const { prompt } = require("inquirer");
const { getConfig } = require("../config");
const { log, infoColor } = require("../utils");

module.exports = async function deployActionBefore(option) {
  const config = getConfig();
  if (Object.keys(config).length === 0) {
    log.error("✖️ 读取配置文件失败，请检查配置文件是否存在!");
    const answers = await prompt([
      {
        type: "confirm",
        name: "init",
        message: infoColor("是否需要初始化配置？"),
        default: true,
      },
    ]);
    if (answers.init) {
      await require("./init")();
    } else {
      process.exit(0);
    }
  }
  const envList = config.envList;
  if (envList.length === 0) {
    log.error("™️ 请配置envList，保证至少一个环境可用！");
    process.exit(0);
  }

  const deployEnvs = option.env;
  let evnToDeploy = envList.find((env) => env.value == deployEnvs);
  if (!deployEnvs || !evnToDeploy) {
    log.warn(`™️ 未找到部署环境${deployEnvs}！`);
    const answers = await prompt([
      {
        type: "list",
        name: "env",
        message: infoColor("请选择部署环境："),
        choices: envList,
        default: envList[0].value,
      },
    ]);
    evnToDeploy = envList.find((env) => env.value == answers.env);
  }
  await require("./deploy")(evnToDeploy);
};
