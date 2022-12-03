const chalk = require("chalk");
const { textSync } = require("figlet");
const updateNotifier = require("update-notifier");
const fse = require("fs-extra");
const pkg = require("../../package.json");

//展示项目logo
const showLogo = (logoName) => {
  return chalk.green(textSync(logoName, { horizontalLayout: "full" }));
};

//打印日志
const log = {
  success: (...msg) => console.log(chalk.green(...msg)),
  error: (...msg) => console.log(chalk.red(...msg)),
  info: (...msg) => console.log(chalk.blue(...msg)),
  warn: (...msg) => console.log(chalk.yellow(...msg)),
  tips: (...msg) => console.log(chalk.cyan(...msg)),
  magenta: (...msg) => console.log(chalk.magenta(...msg)),
  underline: (...msg) => console.log(chalk.underline.blueBright.bold(...msg)),
  default: (...msg) => console.log(chalk.white(...msg)),
};

//检查更新
const checkUpdate = () => {
  updateNotifier({ pkg, updateCheckInterval: 1000 * 60 * 60 * 24 }).notify({
    isGlobal: true,
    defer: false,
  });
};

const sshConnect = (
  ssh,
  { username, host, port, password, privateKey, passphrase }
) => {
  let config = {
    username,
    host,
    port,
    password,
  };
  privateKey && (config.privateKey = privateKey);
  passphrase && (config.passphrase = passphrase);
  return ssh.connect(config);
};

module.exports = {
  log,
  showLogo,
  checkUpdate,
  copyFileSync: fse.copyFileSync,
  existsSync: fse.existsSync,
  writeFileSync: fse.writeFileSync,
  readFileSync: fse.readFileSync,
  sshConnect,
  warnColor: chalk.yellow,
  infoColor: chalk.blue,
  magentaColor: chalk.magenta,
  underlineColor: chalk.underline.blueBright.bold,
};
