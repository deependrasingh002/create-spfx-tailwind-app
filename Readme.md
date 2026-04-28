## 🚀 Usage

### Create a new SPFx project


npx create-spfx-tailwind-app-v1 MyProject

![npm version](https://img.shields.io/npm/v/create-spfx-tailwind-app-v1)
![npm downloads](https://img.shields.io/npm/dt/create-spfx-tailwind-app-v1)
![license](https://img.shields.io/npm/l/create-spfx-tailwind-app-v1)
![SPFx](https://img.shields.io/badge/SPFx-1.22+-green)

A modern CLI tool to scaffold **SharePoint Framework (SPFx)** projects
with **Tailwind CSS pre-configured** --- no manual setup required.

------------------------------------------------------------------------

## ✨ Features

-   ⚡ One-command SPFx project creation\
-   🎨 Tailwind CSS ready out of the box\
-   🧠 Smart CLI (interactive prompts + flags)\
-   📦 Optional dependency installation\
-   🏗 Built for SPFx v1.22+ (Heft-based projects)\
-   🔁 No manual renaming required

------------------------------------------------------------------------

## 📦 Usage

### ▶️ Create a project

``` bash
npx create-spfx-tailwind-app MyProject
```

------------------------------------------------------------------------

### ▶️ Or install globally

``` bash
npm install -g create-spfx-tailwind-app
create-spfx-app MyProject
```

------------------------------------------------------------------------

## ⚙️ CLI Options

``` bash
create-spfx-app <project-name> [options]
```

### Options

-   `--no-install` → Skip dependency installation

### Example

``` bash
create-spfx-app VendorPortal --no-install
```

------------------------------------------------------------------------

## 🛠 After Project Creation

### If you skipped install:

``` bash
cd MyProject
npm install
```

------------------------------------------------------------------------

## ▶️ Start Development

Run in **two terminals**:

``` bash
# Terminal 1
npm run start
```

``` bash
# Terminal 2 (Tailwind watcher)
npm run build:tailwind
```

------------------------------------------------------------------------

## 🧱 Tech Stack

-   SharePoint Framework (SPFx) v1.22+
-   React
-   Tailwind CSS
-   Heft build system
-   Node.js

------------------------------------------------------------------------

## 📁 Project Structure

    MyProject/
    ├── src/
    ├── config/
    ├── package.json
    ├── gulpfile.js
    ├── tailwind.config.js

------------------------------------------------------------------------

## 🎯 Why this tool?

The default SPFx generator:

``` bash
yo @microsoft/sharepoint
```

❌ Requires manual setup\
❌ No Tailwind support\
❌ Repetitive configuration

------------------------------------------------------------------------

This CLI solves that by:

✔ Automating setup\
✔ Adding Tailwind out of the box\
✔ Improving developer experience

------------------------------------------------------------------------

## 📌 Prerequisites

-   Node.js (v18 recommended)
-   npm
-   SPFx development environment

------------------------------------------------------------------------

## 🧪 Example

``` bash
npx create-spfx-tailwind-app VendorPortal
```

------------------------------------------------------------------------

## 🧑‍💻 Author

Deependra Singh

------------------------------------------------------------------------

## 📄 License

MIT License

------------------------------------------------------------------------

## ⚠️ Disclaimer

This project is not officially affiliated with Microsoft.\
Use at your own risk.

------------------------------------------------------------------------

## ⭐ Contributing

Contributions are welcome!\
Feel free to open issues or submit pull requests.

------------------------------------------------------------------------

## 🔗 References

-   https://learn.microsoft.com/sharepoint/dev/spfx/
-   https://tailwindcss.com/
-   https://heft.rushstack.io/

------------------------------------------------------------------------

## 💬 Support

If you find this useful:

⭐ Star the repo\
🔁 Share with your team

------------------------------------------------------------------------

Happy coding 🚀
