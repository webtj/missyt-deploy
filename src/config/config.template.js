module.exports = {
  projectName: "mdeploy",
  envList: [
    {
      value: "dev", //环境名称
      name: "开发环境(dev)", //环境描述
      script: "npm run build:dev", //打包脚本
      remotePath: "/data/www/dev", //远程服务器部署目录
      localPath: "./dist", //本地构建目录
      host: "", //远程服务器地址
      port: 22, //远程服务器端口
      username: "", //远程服务器用户名
      password: "", //远程服务器密码
      privateKey: "", //远程服务器私钥
      passphrase: "", //远程服务器私钥密码
      shellAfter: [], //部署后执行的脚本
    },
  ],
};
