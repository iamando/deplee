#! /usr/bin/env node

/* eslint-disable quotes */
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

// lib
const nodeExpress = require("../lib/nodeExpress");
const staticConfig = require("../lib/static");
const frontEndFramwork = require("../lib/frontEndFramwork");

const depleePath = path.join(process.cwd(), "deplee.json");
const existingConfig = fs.existsSync(depleePath);

async function buildConfig() {
  let config = {
    version: 1,
  };

  const answers = await inquirer.prompt([
    {
      type: "text",
      name: "name",
      message: "What is the name of the project?",
      default: path.basename(process.cwd()),
    },
    {
      type: "list",
      name: "type",
      message: "What type of project?",
      choices: [
        "node-express",
        "static",
        "static-build",
        "react",
        "vue",
        "angular",
      ],
    },
  ]);

  config.name = answers.name;
  // eslint-disable-next-line default-case
  switch (answers.type) {
    case "node-express":
      config = await nodeExpress(config);
      break;

    case "static":
      config = await staticConfig(config);
      break;

    case "static-build":
      config = await frontEndFramwork(config);
      break;

    case "react":
      config = await frontEndFramwork(config, "build");
      break;

    case "vue":
      config = await frontEndFramwork(config);
      break;

    case "angular":
      config = await frontEndFramwork(config, "build");
      break;
  }

  const moreAnswers = await inquirer.prompt([
    {
      type: "confirm",
      name: "specifyAlias",
      message: "Would you like to specify an alias?",
      default: true,
    },
    {
      type: "text",
      name: "alias",
      message: "What is the alias? (Specify multiple separated by commas.)",
      default: answers.name,
      when: (a) => a.specifyAlias,
    },
  ]);

  config.alias = moreAnswers.alias
    ? moreAnswers.alias.split(",").map((a) => a.trim())
    : undefined;

  fs.writeFileSync(depleePath, JSON.stringify(config, null, 2), "utf8");

  console.log("All done! Type deplee to deploy!");
  process.exit(0);
}

if (existingConfig) {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: "deplee.json already exists! Would you like to overwrite it?",
        default: false,
      },
    ])
    .then((answers) => {
      if (answers.overwrite) {
        buildConfig();
      } else {
        // eslint-disable-next-line no-console
        console.log("GoodBye!");
      }
    });
} else {
  buildConfig();
}
