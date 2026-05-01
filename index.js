#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const chalk = require("chalk");
const ora = require("ora");
const inquirer = require("inquirer");
const figlet = require("figlet");
const gradient = require("gradient-string").default;

// 🎨 Banner


console.log(
  gradient.instagram(figlet.textSync("SPFx CLI", { horizontalLayout: "full" })),
);

async function run() {
  try {
    const args = process.argv.slice(2);

    // 🔹 detect flags
    const noInstallFlag = args.includes("--no-install");

    // 🔹 get project name
    let projectName = args.find((arg) => !arg.startsWith("--"));

    if (!projectName) {
      const answer = await inquirer.prompt([
        {
          type: "input",
          name: "name",
          message: "Project name:",
          default: "my-spfx-app",
          validate: (input) => {
            if (!input) return "Project name is required";
            if (fs.existsSync(input)) return "Folder already exists";
            return true;
          },
        },
      ]);
      projectName = answer.name;
    }

    const templateDir = path.join(__dirname, "Template");
    const targetDir = path.join(process.cwd(), projectName);

    console.log(chalk.cyan("\n🚀 Creating your SPFx project...\n"));

    const spinner = ora("Copying template...").start();

    // 📁 Copy template
    fs.cpSync(templateDir, targetDir, { recursive: true });

    spinner.text = "Customizing project...";

    // ⚙ Run setup script
    execSync(`node setup.js "${projectName}"`, {
      cwd: targetDir,
      stdio: "inherit",
    });

    spinner.succeed(chalk.green("✔ Project setup complete"));

    // 🔍 detect Tailwind support
    let hasTailwind = false;
    try {
      const pkg = require(path.join(targetDir, "package.json"));
      hasTailwind = !!pkg.scripts?.["build:tailwind"];
    } catch {}

    // ❓ Ask install (unless flag used)
    let install = true;

    if (noInstallFlag) {
      install = false;
    } else {
      const answer = await inquirer.prompt([
        {
          type: "confirm",
          name: "install",
          message: "Install dependencies now?",
          default: true,
        },
      ]);
      install = answer.install;
    }

    // 📦 Install dependencies
    if (install) {
      const installSpinner = ora("Installing dependencies...").start();

      try {
        execSync("npm install", {
          cwd: targetDir,
          stdio: "inherit",
        });

        installSpinner.succeed(chalk.green("✔ Dependencies installed"));
      } catch (err) {
        installSpinner.fail(chalk.red("❌ Installation failed"));
      }
    }

    // 🎉 Success message
    console.log("\n" + chalk.bold.green("🎉 Project created successfully!\n"));

    console.log(chalk.yellow("👉 Next steps:"));
    console.log(chalk.white(`   cd ${projectName}`));

    if (!install) {
      console.log(chalk.white("   npm install"));
    }

    console.log("");

    console.log(chalk.yellow("👉 Start development:"));

    console.log(chalk.cyan("   # Terminal 1"));
    console.log(chalk.white("   npm run start"));

    if (hasTailwind) {
      console.log("");
      console.log(chalk.cyan("   # Terminal 2"));
      console.log(chalk.white("   npm run build:tailwind"));
    }

    console.log("\n" + chalk.gray("Happy coding 🚀\n"));
  } catch (err) {
    console.log(chalk.red("\n❌ Something went wrong\n"));
    console.error(err);
    process.exit(1);
  }
}

run();
