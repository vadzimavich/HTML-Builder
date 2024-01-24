const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const assetsSrcDir = path.join(__dirname, 'assets');
const assetsCopyDir = path.join(__dirname, 'project-dist\\assets');
const stylesDir = path.join(__dirname, 'styles');

async function copyDir(srcDir, destDir) {
  await fsPromises.mkdir(destDir, { recursive: true });

  let files = await fsPromises.readdir(srcDir);
  for (let file of files) {
    let srcFile = path.join(srcDir, file);
    let destFile = path.join(destDir, file);
    let statFile = await fsPromises.stat(srcFile);
    if (statFile.isFile()) {
      await fsPromises.copyFile(srcFile, destFile);
    } else {
      await copyDir(srcFile, destFile);
    }
  }
}

async function cssBundler() {
  const cssFiles = await fsPromises.readdir(stylesDir, { withFileTypes: true });
  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'style.css'),
  );

  for (let file of cssFiles) {
    if (path.extname(file.name) === '.css') {
      const readStream = fs.createReadStream(
        path.join(stylesDir, file.name),
        'utf-8',
      );
      readStream.pipe(writeStream);
    }
  }
}



copyDir(assetsSrcDir, assetsCopyDir);
cssBundler();
