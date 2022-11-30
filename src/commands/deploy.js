const { log } = require("../utils");
module.exports = async function deployAction(env) {
  log.info("开始部署环境：" + env.name + env.title);
};
