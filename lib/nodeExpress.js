/* eslint-disable import/no-dynamic-require */
/* eslint-disable quotes */
const inquirer = require("inquirer");

const baseConfig = {
  builds: [
    {
      src: "src/index.js",
      use: "@deplee/node-server",
    },
  ],
  routes: [
    {
      src: "/.*",
      dest: "src/index.js",
    },
  ],
};

async function nodeExpress(config) {
  let mainFile = "src/index.js";

  try {
    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/no-dynamic-require
    // eslint-disable-next-line global-require
    const packageJSON = require(`${process.cwd()}/package.json`);
    mainFile = packageJSON.main;
    // eslint-disable-next-line no-empty
  } catch (error) {}

  const answers = await inquirer.prompt([
    {
      type: "text",
      name: "main",
      message: "What is the path to your express entry point?",
      default: mainFile,
    },
  ]);

  baseConfig.builds[0].src = answers.main;
  baseConfig.routes[0].dest = answers.main;

  return {
    ...config,
    ...baseConfig,
  };
}

module.exports = nodeExpress;
