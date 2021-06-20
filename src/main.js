/* eslint-disable quotes */
const inquirer = require("inquirer");
const fs = require("fs");
const path = require("path");

// lib
const nodeExpress = require("./lib/nodeExpress");

const existingConfig = fs.existsSync("deplee.json");

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
        "lambda",
      ],
    },
  ]);

  config.name = answers.name;
  // eslint-disable-next-line default-case
  switch (answers.type) {
    case "node-express":
      config = await nodeExpress(config);
      console.log(config);
      break;

    case "static":
      console.log("Static...");
      break;
  }

  console.log(config);
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
        console.log("GoodBye!");
      }
    });
} else {
  buildConfig();
}
