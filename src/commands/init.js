const { getConfig, existConfigPath, copyNewConfig } = require("../config");
const { log } = require("../utils");

module.exports = async function initAction() {
  if (existConfigPath) {
    log.error("已存在deploy.config.js配置文件，请勿重复初始化~");
    process.exit(1);
  } else {
    log.info("初始化配置文件中...");
    copyNewConfig();
    log.success("配置文件已生成！");
  }
};
