const fs = require('fs');
const path = require('node:path');

const pathfolder = path.join(__dirname, 'secret-folder');

async function filesInFolder() {
  const files = await fs.promises.readdir(pathfolder);

  for (let file of files) {
    let pathToFile = path.join(__dirname, 'secret-folder', file);
    fs.stat(pathToFile, function (err, stats) {
      if (stats.isFile() === true) {
        let fileSize = `${stats.size / 1000}kb`;
        let fileExtens = path.extname(file).slice(1);
        let fileName = path.basename(file, path.extname(file));
        let result = `${fileName} - ${fileExtens} - ${fileSize}`;
        console.log(result);
      }
    });
  }
}
filesInFolder();
