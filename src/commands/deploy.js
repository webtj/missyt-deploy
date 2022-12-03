const childProcess = require("child_process");
const ora = require("ora");
const { NodeSSH } = require("node-ssh");
const path = require("path");
const {
  log,
  magentaColor,
  underlineColor,
  existsSync,
  sshConnect,
} = require("../utils");
const { checkConfig, getConfig } = require("../config");
const ssh = new NodeSSH();

//编辑打包
const build = async ({ script }) => {
  const spinner = ora(
    magentaColor(`1、执行打包脚本：${underlineColor(script)}\t`)
  ).start();
  const start = Date.now();
  try {
    await new Promise((resolve, reject) => {
      childProcess.exec(
        script,
        { cwd: process.cwd(), maxBuffer: 5000 * 1024 },
        (e) => {
          if (e === null) {
            const end = Date.now();
            log.success(`✔️ 打包成功，耗时${(end - start) / 1000}s`);
            resolve();
          } else {
            reject(e.message);
          }
          spinner.stop();
        }
      );
    });
  } catch (error) {
    log.error("✖️ 打包失败：" + error);
  }
};

//ssh连接
const connectSSH = (env) => {
  const spinner = ora(
    magentaColor(`2、连接远程服务器：${underlineColor(env.host)}\t`)
  ).start();
  const start = Date.now();
  return new Promise(async (resolve, reject) => {
    try {
      await sshConnect(ssh, env);
      const end = Date.now();
      log.success(`✔️ 连接成功，耗时${(end - start) / 1000}s`);
      spinner.stop();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

//备份远程文件
const backupRemoteFile = ({ remotePath }) => {
  const spinner = ora(
    magentaColor(`3、备份远程文件：${underlineColor(remotePath)}\t`)
  ).start();
  const start = Date.now();
  return new Promise(async (resolve, reject) => {
    try {
      const date = new Date();
      const backupPath = `${remotePath}.bak${date.getTime()}`;
      await ssh.execCommand(`cp -r ${remotePath} ${backupPath}`);
      const end = Date.now();
      log.success(`✔️ 备份成功，耗时${(end - start) / 1000}s`);
      spinner.stop();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

//上传文件
const uploadFile = ({ localPath, remotePath }) => {
  const spinner = ora(
    magentaColor(
      `4、上传文件：${underlineColor(localPath)}${underlineColor(
        " ➡️ "
      )}${underlineColor(remotePath)}\t`
    )
  ).start();
  const start = Date.now();
  return new Promise(async (resolve, reject) => {
    try {
      const distPath = path.resolve(process.cwd(), localPath);
      await ssh.putDirectory(distPath, remotePath, {
        recursive: true,
        concurrency: 10,
        tick: (localPath, remotePath, error) => {
          if (error) reject(error);
        },
      });
      const end = Date.now();
      log.success(`✔️ 上传成功，耗时${(end - start) / 1000}s`);
      spinner.stop();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

//执行命令
const execShell = ({ shellAfter, remotePath }) => {
  if (!shellAfter || shellAfter.length == 0) return;
  const spinner = ora(
    magentaColor(
      `5、执行命令:${underlineColor(shellAfter)}，执行目录:${underlineColor(
        remotePath
      )}\n`
    )
  ).start();
  const start = Date.now();
  return new Promise(async (resolve, reject) => {
    try {
      //执行脚本并返回结果
      for (let i = 0; i < shellAfter.length; i++) {
        const { stderr } = await ssh.execCommand(shellAfter[i], {
          cwd: remotePath,
        });
        if (stderr) {
          reject(`${shellAfter[i]}执行异常：${stderr}`);
        }
      }
      const end = Date.now();
      log.success(`✔️ 执行成功，耗时${(end - start) / 1000}s`);
      spinner.stop();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = async function deployAction(env) {
  try {
    await checkConfig(env);
    log.tips("⏸ 开始部署...");
    await build(env);
    await connectSSH(env);
    await backupRemoteFile(env);
    await uploadFile(env);
    await execShell(env);
    log.success("✔️ 部署成功！");
    ssh.dispose();
  } catch (error) {
    log.error(`✖️ 部署异常：${error}`);
  }
  process.exit(0);
};
