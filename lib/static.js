/* eslint-disable import/no-dynamic-require */
/* eslint-disable quotes */
const inquirer = require("inquirer");
const path = require("path");

const baseConfig = {
  builds: [
    {
      src: "./*",
      use: "@deplee/static",
    },
  ],
};

async function staticConfig(config) {
  const answers = await inquirer.prompt([
    {
      type: "text",
      name: "directory",
      message: "What folder would you like to deploy?",
      default: ".",
    },
  ]);

  baseConfig.builds[0].src = path.join(answers.directory, "*");

  return {
    ...config,
    ...baseConfig,
  };
}

module.exports = staticConfig;
