const { log } = require("../utils");
const childProcess = require("child_process");

const build = async (env) => {
  if (!env.script) {
    log.error("请配置打包脚本");
    process.exit(1);
  }
  log.info("执行打包脚本：" + env.script);
  try {
    await new Promise((resolve, reject) => {
      childProcess.exec(
        env.script,
        { cwd: process.cwd(), maxBuffer: 5000 * 1024 },
        (e) => {
          if (e === null) {
            log.success("打包脚本执行成功");
            resolve();
          } else {
            reject(e.message);
          }
        }
      );
    });
  } catch (error) {
    log.error("执行打包脚本失败：" + error);
    process.exit(1);
  }
};

module.exports = async function deployAction(env) {
  log.info("环境准备：" + env.name + env.title);
  await build(env);
};
