"use strict";
const commander = require("commander");
const { log, showLogo, checkUpdate } = require("./src/utils");
const initAction = require("./src/commands/init");
const deployActionBefore = require("./src/commands/before");
const pkg = require("./package.json");

checkUpdate();
commander.version(pkg.version).description(showLogo);

commander.command("init").description("初始化部署配置").action(initAction);
commander
  .command("run")
  .option("-e, --env <env>", "部署环境: dev, test, prod, all")
  .description("部署项目,[options] -e, --env <env> 部署环境: dev|test|prod|all")
  .action(deployActionBefore);
//默认展示帮助信息
if (process.argv && process.argv.length < 3) {
  commander.help();
}
commander.parse(process.argv);
