const fs = require("fs");
const path = require("path");

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
    .replace(/__PROJECT_NAME_LOWER__/g, projectNameLower);

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

// 🔁 Rename files AFTER replacing content
renameFiles("./");

// 🔁 Rename webpart folder (adjust based on your original name)
const oldFolder = "./src/webparts/templateSpfx";
const newFolder = `./src/webparts/${projectNameLower}`;

if (fs.existsSync(oldFolder)) {
  fs.renameSync(oldFolder, newFolder);
}

