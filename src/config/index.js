const CONFIG_NAME = "deploy.config.js";
const { copyFileSync, existsSync } = require("../utils");
const path = require("path");
const ROOT = process.cwd();
const configPath = path.join(ROOT, CONFIG_NAME);
const pkgPath = path.join(ROOT, "package.json");
const gitingorePath = path.join(ROOT, ".gitignore");
const existConfigPath = existsSync(configPath) && existsSync(pkgPath);

//获取配置文件
const getConfig = () => {
  if (existConfigPath) return require(configPath);
  else return {};
};

//复制配置文件
const copyNewConfig = () => {
  copyFileSync(path.resolve(__dirname, "./config.template.js"), configPath);
};

//检查配置文件
const checkConfig = (env) => {
  return new Promise((resolve, reject) => {
    if (!env) reject("✖️ 请先配置环境信息");
    if (!env.value) reject("✖️ 请配置部署环境");
    if (!env.script) reject("✖️ 请配置打包脚本");
    if (!env.username) reject("✖️ 请配置服务器用户名");
    if (!env.host) reject("✖️ 请配置服务器地址");
    if (!env.port) reject("✖️ 请配置服务器端口");
    resolve();
  });
};

module.exports = {
  CONFIG_NAME,
  getConfig,
  copyNewConfig,
  existConfigPath,
  configPath,
  gitingorePath,
  checkConfig,
};
