const fs = require('fs/promises');
const path = require('path');

async function showFilesInfo() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    for (const file of files.filter((file) => file.isFile() === true)) {
      let currentFile = path.join(folderPath, file.name),
        fileSize = (await fs.stat(currentFile)).size / 1024,
        fileExt = path.extname(currentFile),
        fileName = path.basename(currentFile, fileExt);
      console.log(
        `${fileName} - ${fileExt.slice(1)} - ${fileSize.toFixed(3)}kb`,
      );
    }
  } catch ({ err }) {
    console.log('Error!');
  }
}

showFilesInfo();
