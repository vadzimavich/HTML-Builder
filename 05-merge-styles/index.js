const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

async function cssBundler() {
  const stylesDir = path.join(__dirname, 'styles');
  const cssFiles = await fsPromises.readdir(stylesDir, { withFileTypes: true });

  const writeStream = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
  );

  for (const file of cssFiles) {
    if (path.extname(file.name) === '.css') {
      const readStream = fs.createReadStream(
        path.join(stylesDir, file.name),
        'utf-8',
      );
      readStream.pipe(writeStream);
    }
  }
}

cssBundler();
