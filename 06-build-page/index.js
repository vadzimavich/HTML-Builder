const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const projectDir = path.join(__dirname, 'project-dist');
const assetsSrcDir = path.join(__dirname, 'assets');
const assetsCopyDir = path.join(__dirname, 'project-dist\\assets');
const stylesDir = path.join(__dirname, 'styles');
const compoDir = path.join(__dirname, 'components');

async function copyDir(srcDir, destDir) {
  await fsPromises.mkdir(destDir, { recursive: true });

  let files = await fsPromises.readdir(srcDir);
  for (let file of files) {
    let srcFile = path.join(srcDir, file),
      destFile = path.join(destDir, file),
      statFile = await fsPromises.stat(srcFile);
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

async function buildPage() {
  await fsPromises.mkdir(projectDir, { recursive: true });
  await fsPromises.copyFile(
    path.join(__dirname, 'template.html'),
    path.join(projectDir, 'index.html'),
  );

  let htmlDestFile = await fsPromises.readFile(
    path.join(projectDir, 'index.html'),
    'utf-8',
  );

  const htmlFiles = await fsPromises.readdir(compoDir);

  for (let file of htmlFiles) {
    if (file.split('.')[1].trim() === 'html') {
      let readStream = fs.createReadStream(path.join(compoDir, file), 'utf8');
      readStream.on('data', function (chunk) {
        let compo = '{{' + file.split('.')[0].trim() + '}}';
        htmlDestFile = htmlDestFile.replace(compo, chunk);
        let writeStream = fs.createWriteStream(
          path.join(projectDir, 'index.html'),
        );
        writeStream.write(htmlDestFile);
      });
    }
  }
}

copyDir(assetsSrcDir, assetsCopyDir);
cssBundler();
buildPage();
