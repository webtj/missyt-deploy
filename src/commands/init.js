const { prompt } = require("inquirer");
const {
  existConfigPath,
  gitingorePath,
  copyNewConfig,
  CONFIG_NAME,
} = require("../config");
const {
  log,
  writeFileSync,
  readFileSync,
  existsSync,
  infoColor,
} = require("../utils");
module.exports = async function initAction() {
  if (existConfigPath) {
    log.warn(`™️ 已存在${CONFIG_NAME}配置文件，无需初始化~`);
  } else {
    log.tips("⏸ 初始化配置文件中...");
    copyNewConfig();
  }

  //是否需要添加.gitignore询问
  let addGitIgnoreAsk = false;
  //是否需要添加.gitignore
  let addGitIgnore = false;
  //gitignore文件不存在或者文件存在但没有配置congfig文件时，询问是否需要添加
  if (
    !existsSync(gitingorePath) ||
    readFileSync(gitingorePath).toString().indexOf(CONFIG_NAME) === -1
  ) {
    addGitIgnoreAsk = true;
  }
  //需要询问
  if (addGitIgnoreAsk) {
    const { add } = await prompt([
      {
        type: "confirm",
        name: "add",
        message: infoColor(
          `${CONFIG_NAME}涉及敏感信息，是否需要添加到.gitignore中？`
        ),
        default: true,
      },
    ]);
    addGitIgnore = add;
  }
  //需要添加至gitignore
  if (addGitIgnore) {
    writeFileSync(gitingorePath, `\n# deploy config file\n${CONFIG_NAME}`, {
      flag: "a",
    });
  }
  log.success(`✔️ 初始化完成，可在项目根目录下完善配置${CONFIG_NAME}文件`);
  process.exit(0);
};
