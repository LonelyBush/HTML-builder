const fs = require('fs');
const path = require('node:path');

const pathfolder = path.join(__dirname, 'files');
const pathfolderCopy = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fs.promises.mkdir(pathfolderCopy, { recursive: true });

    const copyFiles = await fs.promises.readdir(pathfolderCopy);
    for (let file of copyFiles) {
      await fs.promises.unlink(`${pathfolderCopy}/${file}`); // перебор скопированной папки и удаленние всех раннее скопированных файлов
    }
    const files = await fs.promises.readdir(pathfolder);
    for (let file of files) {
      let pathToFile = path.join(__dirname, 'files', file); // перебор файлов в существующей папке

      await fs.promises.copyFile(pathToFile, `${pathfolderCopy}/${file}`); // копирование файлов в новую папку
      console.log('Copy succeed!');
    }
  } catch (err) {
    console.error(err);
  }
}
copyDir();
