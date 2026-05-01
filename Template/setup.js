const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const solutionId = randomUUID();
const webpartId = randomUUID();

const projectName = process.argv[2];

if (!projectName) {
  console.log("❌ Please provide project name");
  process.exit(1);
}

const projectNameLower = projectName.toLowerCase();


console.log("✅ Solution ID:", solutionId);
console.log("✅ WebPart ID:", webpartId);

// ✅ Only process safe text files
const allowedExtensions = [".json", ".js", ".ts", ".tsx", ".scss", ".md"];

// 🔁 Replace content inside files
function replaceInFile(filePath) {
  const ext = path.extname(filePath);
  if (!allowedExtensions.includes(ext)) return;

  let content = fs.readFileSync(filePath, "utf8");

  content = content
    .replace(/__PROJECT_NAME__/g, projectName)
    .replace(/__PROJECT_NAME_LOWER__/g, projectNameLower)
    .replace(/__WEBPART_ID__/g, webpartId)
    .replace(/__SOLUTION_ID__/g, solutionId);

  fs.writeFileSync(filePath, content);
}

// 🔁 Walk and process files safely
function walk(dir) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else {
      replaceInFile(fullPath);
    }
  });
}

// 🔁 Rename files safely
function renameFiles(dir) {
  if (!fs.existsSync(dir)) return;

  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      renameFiles(fullPath);
    } else {
      const newName = file
        .replace(/__PROJECT_NAME__/g, projectName)
        .replace(/__PROJECT_NAME_LOWER__/g, projectNameLower);

      if (newName !== file) {
        fs.renameSync(fullPath, path.join(dir, newName));
      }
    }
  });
}

// 🔁 Run replacements
walk("./");

// 🔁 Force update package.json name
const pkgPath = path.join("./package.json");

if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  pkg.name = projectNameLower;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

// 🔁 Rename files AFTER replacing content
renameFiles("./");

// 🔁 Rename webpart folder safely
const webpartsDir = "./src/webparts";

if (fs.existsSync(webpartsDir)) {
  fs.readdirSync(webpartsDir).forEach((folder) => {
    if (folder.includes("__PROJECT_NAME_LOWER__")) {
      const oldPath = path.join(webpartsDir, folder);
      const newPath = path.join(webpartsDir, projectNameLower);

      fs.renameSync(oldPath, newPath);
    }
  });
}

console.log("🎉 Setup complete!");
