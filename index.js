"use strict";
const commander = require("commander");
const { showLogo, checkUpdate } = require("./src/utils");
const initAction = require("./src/commands/init");
const deployActionBefore = require("./src/commands/before");
const { handleListAction, handleBackAction } = require("./src/commands/action");
const pkg = require("./package.json");

checkUpdate();
commander.version(pkg.version).description(showLogo(pkg.name));
commander.command("init").description("初始化配置环境").action(initAction);
commander.command("list").description("项目环境列表").action(handleListAction);
commander.command("back").description("部署项目回退").action(handleBackAction);
commander
  .command("run")
  .description("-e, --env <env> 待部署的环境")
  .option("-e, --env <env>", "待部署环境")
  .action(deployActionBefore);
//默认展示帮助信息
if (process.argv && process.argv.length < 3) {
  commander.help();
}
commander.parse(process.argv);
