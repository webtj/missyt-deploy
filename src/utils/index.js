const chalk = require("chalk");
const { textSync } = require("figlet");
const updateNotifier = require("update-notifier");
const { logoName } = require("../config");
const pkg = require("../../package.json");
const fse = require("fs-extra");

//展示项目logo
const showLogo = chalk.green(textSync(logoName, { horizontalLayout: "full" }));

//打印日志
const log = {
  success: (msg) => console.log(chalk.green(msg)),
  error: (msg) => console.log(chalk.red(msg)),
  info: (msg) => console.log(chalk.blue(msg)),
  warn: (msg) => console.log(chalk.yellow(msg)),
  default: (msg) => console.log(chalk.white(msg)),
};

//检查更新
const checkUpdate = () => {
  updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 * 24 }).notify({
    isGlobal: true,
    defer: false,
  });
};

module.exports = {
  showLogo,
  log,
  checkUpdate,
};
