const fs = require('fs/promises');
const path = require('path');

async function copyDir(srcDir, destDir) {
  srcDir = path.join(__dirname, 'files');
  destDir = path.join(__dirname, 'files-copy');

  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  try {
    const files = await fs.readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      await fs.copyFile(
        path.join(srcDir, file.name),
        path.join(destDir, file.name),
      );
    }
  } catch ({ err }) {
    console.log('Error!');
  }
}

copyDir();
