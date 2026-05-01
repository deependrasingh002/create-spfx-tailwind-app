const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const solutionId = uuidv4();
const webpartId = uuidv4();

const projectName = process.argv[2];

if (!projectName) {
  console.log("❌ Please provide project name");
  process.exit(1);
}

const projectNameLower = projectName.toLowerCase();

// 🔁 Replace content inside files
function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");

  content = content
    .replace(/__PROJECT_NAME__/g, projectName)
    .replace(/__PROJECT_NAME_LOWER__/g, projectNameLower)
    .replace(/__WEBPART_ID__/g, webpartId)
    .replace(/__SOLUTION_ID__/g, solutionId);

  fs.writeFileSync(filePath, content);
}

// 🔁 Walk and process files
function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else {
      replaceInFile(fullPath);
    }
  });
}

// 🔁 Rename files (IMPORTANT FIX)
function renameFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      renameFiles(fullPath);
    } else {
      let newName = file
        .replace(/__PROJECT_NAME__/g, projectName)
        .replace(/__PROJECT_NAME_LOWER__/g, projectNameLower);

      if (newName !== file) {
        fs.renameSync(
          fullPath,
          path.join(dir, newName)
        );
      }
    }
  });
}

// 🔁 Run replacements
walk("./");

const pkgPath = path.join("./package.json");

if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  pkg.name = projectNameLower; // force update

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

// 🔁 Rename files AFTER replacing content
renameFiles("./");

// 🔁 Rename webpart folder (adjust based on your original name)
const webpartsDir = "./src/webparts";

fs.readdirSync(webpartsDir).forEach((folder) => {
  if (folder.includes("PROJECT_NAME_LOWER")) {
    const oldPath = path.join(webpartsDir, folder);
    const newPath = path.join(webpartsDir, projectNameLower);

    fs.renameSync(oldPath, newPath);
  }
});
