const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");
const htmlMinifier = require("html-minifier-terser");
const cleanCSS = require("clean-css");
const { minify } = require("uglify-js");

// Пути
const rootDir = __dirname;
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");

// Импорты, которые нужно сохранить во всех CSS файлах
const PRESERVED_IMPORTS = ['@import "/src/assets/font/stylesheet.css";'];

// Папки и файлы, которые нужно исключить из обработки
const EXCLUDE_PATHS = [
  path.join(rootDir, "node_modules"),
  path.join(rootDir, "dist"),
  path.join(rootDir, ".git"),
  path.join(rootDir, ".vscode"),
  path.join(rootDir, "package.json"),
  path.join(rootDir, "package-lock.json"),
];

// Очистка папки dist
fse.emptyDirSync(distDir);

// Функция для проверки, нужно ли исключить путь
function shouldExclude(filePath) {
  return EXCLUDE_PATHS.some((excludedPath) => {
    const relative = path.relative(excludedPath, filePath);
    return relative === "" || !relative.startsWith("..");
  });
}

// Функция для минификации HTML
async function minifyHtml(filePath, destPath) {
  try {
    const html = await fs.promises.readFile(filePath, "utf8");
    const minified = await htmlMinifier.minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      keepClosingSlash: true,
    });
    await fse.ensureDir(path.dirname(destPath));
    await fs.promises.writeFile(destPath, minified);
  } catch (err) {
    console.error(`Error minifying HTML ${filePath}:`, err);
  }
}

// Функция для минификации CSS с сохранением нужных импортов
async function minifyCssWithPreservedImports(filePath, destPath) {
  try {
    let css = await fs.promises.readFile(filePath, "utf8");

    // Выделяем все импорты
    const importRegex = /@import\s+(['"])(.*?)\1[^;]*;/g;
    const allImports = [];
    let match;

    while ((match = importRegex.exec(css)) !== null) {
      allImports.push(match[0]);
    }

    // Удаляем все импорты из CSS для минификации
    let cssWithoutImports = css.replace(importRegex, "");

    // Минифицируем CSS без импортов
    const minifiedCss = new cleanCSS({
      level: {
        1: { specialComments: "none" },
        2: { mergeMedia: true },
      },
      rebase: false,
    }).minify(cssWithoutImports).styles;

    // Фильтруем импорты, оставляя только те, которые нужно сохранить
    const preservedImports = allImports.filter((imp) =>
      PRESERVED_IMPORTS.some((preserved) =>
        imp.includes(preserved.split('"')[1])
      )
    );

    // Добавляем все сохраненные импорты (если их еще нет)
    PRESERVED_IMPORTS.forEach((preserved) => {
      if (!preservedImports.includes(preserved)) {
        preservedImports.push(preserved);
      }
    });

    // Собираем финальный CSS: сохраненные импорты + минифицированный код
    const finalCss = preservedImports.join("\n") + "\n" + minifiedCss;

    await fse.ensureDir(path.dirname(destPath));
    await fs.promises.writeFile(destPath, finalCss);
  } catch (err) {
    console.error(
      `Error minifying CSS with preserved imports ${filePath}:`,
      err
    );
  }
}

// Функция для минификации JS
async function minifyJs(filePath, destPath) {
  try {
    const js = await fs.promises.readFile(filePath, "utf8");
    const minified = minify(js, {
      output: {
        comments: false,
      },
    }).code;
    await fse.ensureDir(path.dirname(destPath));
    await fs.promises.writeFile(destPath, minified);
  } catch (err) {
    console.error(`Error minifying JS ${filePath}:`, err);
  }
}

// Функция для копирования файлов без минификации
async function copyFile(filePath, destPath) {
  try {
    await fse.ensureDir(path.dirname(destPath));
    await fse.copy(filePath, destPath);
  } catch (err) {
    console.error(`Error copying file ${filePath}:`, err);
  }
}

// Обработка файла или папки
async function processPath(srcPath) {
  if (shouldExclude(srcPath)) {
    return;
  }

  const relativePath = path.relative(rootDir, srcPath);
  const destPath = path.join(distDir, relativePath);

  try {
    const stat = await fs.promises.stat(srcPath);

    if (stat.isDirectory()) {
      const files = await fs.promises.readdir(srcPath, { withFileTypes: true });
      for (const file of files) {
        await processPath(path.join(srcPath, file.name));
      }
    } else {
      const ext = path.extname(srcPath).toLowerCase();
      const filename = path.basename(srcPath);

      if (ext === ".html") {
        await minifyHtml(srcPath, destPath);
      } else if (ext === ".css") {
        await minifyCssWithPreservedImports(srcPath, destPath);
      } else if (ext === ".js") {
        await minifyJs(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error(`Error processing ${srcPath}:`, err);
  }
}

// Запуск сборки
(async () => {
  try {
    console.log("Starting build process...");

    // Обрабатываем все содержимое корневой директории, кроме исключенных
    const rootItems = await fs.promises.readdir(rootDir, {
      withFileTypes: true,
    });

    for (const item of rootItems) {
      const itemPath = path.join(rootDir, item.name);
      if (!shouldExclude(itemPath)) {
        await processPath(itemPath);
      }
    }

    // Копируем package.json и package-lock.json без обработки
    await copyFile(
      path.join(rootDir, "package.json"),
      path.join(distDir, "package.json")
    );
    await copyFile(
      path.join(rootDir, "package-lock.json"),
      path.join(distDir, "package-lock.json")
    );

    console.log("Build completed successfully!");
  } catch (err) {
    console.error("Build failed:", err);
    process.exit(1);
  }
})();
