const pkg = require("../../package.json");
const fse = require("fs-extra");
const path = require("path");
const ROOT = process.cwd();
const configPath = path.join(ROOT, "deploy.config.js");
const pkgPath = path.join(ROOT, "package.json");
const existConfigPath = fse.existsSync(configPath) && fse.existsSync(pkgPath);

//获取配置文件
const getConfig = () => {
  if (existConfigPath) return require(configPath);
  else return {};
};

const copyNewConfig = () => {
  fse.copyFileSync(path.resolve(__dirname, "./config.template.js"), configPath);
};

module.exports = {
  logoName: pkg.name,
  getConfig,
  copyNewConfig,
  existConfigPath,
};
