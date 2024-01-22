const fs = require('fs');
const path = require('node:path');

const pathfolder = path.join(__dirname, 'styles');
const pathProject = path.join(__dirname, 'project-dist');

const pathtoImg = path.join(__dirname, 'assets', 'img');
const pathtoFont = path.join(__dirname, 'assets', 'fonts');
const pathtoSvg = path.join(__dirname, 'assets', 'svg');
const pathtoComponents = path.join(__dirname, 'components');

const pathtoAssetsInPrjct = path.join(__dirname, 'project-dist', 'assets');
const pathtoImgInPrjct = path.join(__dirname, 'project-dist', 'assets', 'img');
const pathtoFontInPrjct = path.join(
  __dirname,
  'project-dist',
  'assets',
  'fonts',
);
const pathtoSvgInPrjct = path.join(__dirname, 'project-dist', 'assets', 'svg');

let arr = [];
/*
let arrTemp = [];
let arrIndex = [];
*/
fs.mkdir(pathProject, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('project-dist folder set!');
});

async function MergeStyles() {
  try {
    const files = await fs.promises.readdir(pathfolder);

    const filesProject = await fs.promises.readdir(pathProject);
    if (filesProject.includes('style.css')) {
      await fs.promises.unlink(`${pathProject}/style.css`);
    }

    if (files.length === 0) {
      return console.log('There is no files in "styles" folder!');
    }

    for (let file of files) {
      let pathToFile = path.join(__dirname, 'styles', file);
      fs.stat(pathToFile, function (err, stats) {
        if (stats.isFile() === true && path.extname(file).slice(1) === 'css') {
          const writeText = fs.createWriteStream(
            path.join(__dirname, 'project-dist', 'style.css'),
          );
          let readFile = fs.createReadStream(
            path.join(__dirname, 'styles', file),
          );
          readFile.on('data', (chunk) => {
            arr.push(chunk.toString());
            writeText.write(arr.join(''));
            console.log(`Merge to style.css of ${file} complete successfully!`);
          });
        } else {
          return console.log(`${file} is not CSS-file!!`);
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function copyDir() {
  try {
    await fs.promises.mkdir(pathtoAssetsInPrjct, { recursive: true });
    fs.promises.mkdir(pathtoFontInPrjct, { recursive: true });
    fs.promises.mkdir(pathtoImgInPrjct, { recursive: true });
    fs.promises.mkdir(pathtoSvgInPrjct, { recursive: true });

    const copiedFonts = await fs.promises.readdir(pathtoFontInPrjct);
    for (let file of copiedFonts) {
      await fs.promises.unlink(`${pathtoFontInPrjct}/${file}`);
    }

    const copiedImg = await fs.promises.readdir(pathtoImgInPrjct);
    for (let file of copiedImg) {
      await fs.promises.unlink(`${pathtoImgInPrjct}/${file}`);
    }

    const copiedSvg = await fs.promises.readdir(pathtoSvgInPrjct);
    for (let file of copiedSvg) {
      await fs.promises.unlink(`${pathtoSvgInPrjct}/${file}`);
    }

    const fonts = await fs.promises.readdir(pathtoFont);

    for (let file of fonts) {
      let pathToFile = `${pathtoFont}/${file}`;
      await fs.promises.copyFile(pathToFile, `${pathtoFontInPrjct}/${file}`);
      console.log(`Copy ${file} succeed!`);
    }

    const img = await fs.promises.readdir(pathtoImg);

    for (let file of img) {
      let pathToFile = `${pathtoImg}/${file}`;
      await fs.promises.copyFile(pathToFile, `${pathtoImgInPrjct}/${file}`);
      console.log(`Copy ${file} succeed!`);
    }

    const svg = await fs.promises.readdir(pathtoSvg);

    for (let file of svg) {
      let pathToFile = `${pathtoSvg}/${file}`;
      await fs.promises.copyFile(pathToFile, `${pathtoSvgInPrjct}/${file}`);
      console.log(`Copy ${file} succeed!`);
    }
  } catch (err) {
    console.error(err);
  }
}

async function ChangeTemplate() {
  try {
    let contentTemplate = '';
    const tempFiles = await fs.promises.readdir(pathtoComponents);

    if (tempFiles.length === 0) {
      console.log('There is no html files in components folder!');
    }

    fs.readFile(
      path.join(__dirname, 'template.html'),
      'utf8',
      function (err, data) {
        if (err) throw err;
        contentTemplate += data;
      },
    );

    const projFiles = await fs.promises.readdir(pathProject);
    for (let file of projFiles) {
      if (path.basename(file) === 'index.html') {
        await fs.promises.unlink(`${pathProject}/index.html`);
      }
    }

    for (let file of tempFiles) {
      let pathtoHtml = path.join(__dirname, 'components', file);
      fs.stat(pathtoHtml, function (err, stats) {
        if (err) {
          console.error(err);
        }
        if (stats.isFile() === true && path.extname(file).slice(1) === 'html') {
          let fileName = path.basename(file, path.extname(file));

          fs.readFile(
            path.join(__dirname, 'components', file),
            'utf8',
            function (err, data) {
              if (err) throw err;
              contentTemplate = contentTemplate.replace(
                `{{${fileName}}}`,
                data,
              );

              if (
                !contentTemplate.includes('{{header}}') &&
                !contentTemplate.includes('{{articles}}') &&
                !contentTemplate.includes('{{footer}}') &&
                !contentTemplate.includes('{{about}}')
              ) {
                fs.writeFile(
                  path.join(__dirname, 'project-dist', 'index.html'),
                  contentTemplate,
                  function (err) {
                    if (err) throw err;
                  },
                );
              }
            },
          );
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
}

copyDir();
MergeStyles();
ChangeTemplate();
