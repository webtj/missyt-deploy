const commander = require("commander");
const chalk = require("chalk");
const initAction = require("./src/commands/init");
const deployAction = require("./src/commands/deploy");
const pkg = require("./package.json");

commander
  .version(pkg.version)
  .option("-v, --version", "output the version number");

commander.parse(process.argv);
