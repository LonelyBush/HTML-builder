const fs = require('fs');
const path = require('node:path');

const pathfolder = path.join(__dirname, 'styles');
const pathProject = path.join(__dirname, 'project-dist');
let arr = [];

async function MergeStyles() {
  try {
    const files = await fs.promises.readdir(pathfolder); // прочтение папки styles

    const filesProject = await fs.promises.readdir(pathProject);
    if (filesProject.includes('bundle.css')) {
      await fs.promises.unlink(`${pathProject}/bundle.css`); // очистка предыдущий версии bundle.css
    }

    if (files.length === 0) {
      return console.log('There is no files in "styles" folder!'); // проверка на пустую папку styles
    }

    for (let file of files) {
      // перебор всех файлов в папке styles
      let pathToFile = path.join(__dirname, 'styles', file); // создание пути к файлам стиля
      fs.stat(pathToFile, function (err, stats) {
        // вызов модуля для чтения файлов
        if (stats.isFile() === true && path.extname(file).slice(1) === 'css') {
          // проверка файла на соответствие CSS
          const writeText = fs.createWriteStream(
            path.join(__dirname, 'project-dist', 'bundle.css'),
          ); // создание файла bundle.css
          let readFile = fs.createReadStream(
            path.join(__dirname, 'styles', file),
          ); // создание потока на чтения файлов, что прошли проверку
          readFile.on('data', (chunk) => {
            // cчитывание всей информации находящейся внутри файлов
            arr.push(chunk.toString()); // пуш чанков в массив
            writeText.write(arr.join('')); // запись данных из массива в новый файл bundle.css
            console.log(
              `Merge to bundle.css of ${file} complete successfully!`,
            ); // консольный вызов об успешном завершении мержа файлов прошедших проверку
          });
        } else {
          return console.log(`${file} is not CSS-file!!`); // консольный вызов с файлами, которые не прошли проверку и не были замержаны
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}
MergeStyles();
