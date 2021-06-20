/* eslint-disable import/no-dynamic-require */
/* eslint-disable quotes */
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const baseConfig = {
  builds: [
    {
      src: "package.json",
      use: "@deplee/static-build",
      config: { distDir: "build" },
    },
  ],
  routes: [{ handle: "filesystem" }, { src: "/.*", dest: "index.html" }],
};

async function frontEndFramwork(config, defaultBuild = "dist") {
  let packageJSON;
  let buildScript = "";
  let packageJSONPath;

  try {
    packageJSONPath = path.join(process.cwd(), "package.json");
    // eslint-disable-next-line global-require
    // eslint-disable-next-line import/no-dynamic-require
    // eslint-disable-next-line global-require
    packageJSON = require(packageJSONPath);
    // eslint-disable-next-line operator-linebreak
    buildScript =
      (packageJSON.scripts || {})["deplee-build"] || "npm run build";
  } catch (error) {
    console.error("package.json does not exist!");
    process.exit(1);
  }

  const answers = await inquirer.prompt([
    {
      type: "text",
      name: "directory",
      message: "What is the build directory?",
      default: defaultBuild,
    },
    {
      type: "confirm",
      name: "addBuildScript",
      message:
        "Do you want to add/update a 'deplee-build' script in your package.json?",
      default: true,
    },
    {
      type: "text",
      name: "buildScript",
      message: "What is the build command?",
      default: buildScript,
      when: (a) => a.addBuildScript,
    },
  ]);

  if (answers.addBuildScript) {
    packageJSON.scripts = packageJSON.scripts || {};
    packageJSON.scripts["deplee-build"] = answers.buildScript;

    fs.writeFileSync(
      packageJSONPath,
      JSON.stringify(packageJSON, null, 2),
      // eslint-disable-next-line comma-dangle
      "utf8"
    );
  }

  baseConfig.builds[0].config.distDir = answers.directory;

  return {
    ...config,
    ...baseConfig,
  };
}

module.exports = frontEndFramwork;
