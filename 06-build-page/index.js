const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const { mkdir, rm, readdir, copyFile } = require('fs/promises');
const folder = path.join(__dirname, 'assets');
const copyFolder = path.join(__dirname, 'project-dist/assets');
const folderStyles = path.join(__dirname, 'styles');
const folderDist = path.join(__dirname, 'project-dist/style.css');
const writableStream = fs.createWriteStream(folderDist, 'utf-8');
const folderDist2 = path.join(__dirname, 'project-dist/index.html');
const componentsFolder = path.join(__dirname, 'components');
const templateHtml = path.join(__dirname, 'template.html');

mkdir(projectDist, { recursive: true });

function createHtmlPage() {
  const readStreamTemplate = fs.createReadStream(templateHtml, {encoding:'utf-8'});
  let result = '';
  readStreamTemplate.on('data', data => {
    result = data.toString();
  });
  readStreamTemplate.on('end', () => {
    const components = readdir(componentsFolder, { withFileTypes: true });
    components.then((keys) => keys.forEach((file) => {
      if (file.isFile()) {
        const componentsFile = path.join(componentsFolder, file.name);
        const readStreamComponents = fs.createReadStream(componentsFile, 'utf-8');
        readStreamComponents.on('data', data => {
          const writeStreamHtml = fs.createWriteStream(folderDist2);
          const replacement = data.toString();
          result = result.replace(`{{${path.basename(componentsFile).split('.')[0]}}}`, replacement);
          writeStreamHtml.write(result);
        });
      }
    })
    );
  });
}
createHtmlPage();


async function copyDir(folder, copyFolder) {
  try {
    await rm(copyFolder, { recursive: true, force: true });
    await mkdir(copyFolder, { recursive: true });
    const files = await readdir(folder, { withFileTypes: true });
    files.forEach((file) => {
      const component = path.join(folder, file.name);
      const component2 = path.join(copyFolder, file.name); 
      if (file.isDirectory()) {
        copyDir(component, component2);
      } else {
        copyFile(component, component2);
      }
    });
  } catch(err) {
    console.log(err);
  }
}
copyDir(folder, copyFolder);


fs.readdir(folderStyles, (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    const component = path.join(folderStyles, file);
    fs.stat(component, (err, stats) => {
      if (err) throw err;
      if(stats.isFile() && (path.extname(component) === '.css')) {
        const readableStream = fs.createReadStream(component);
        readableStream.pipe(writableStream);
        readableStream.on('error', error => {
          console.log('Error', error.message);
        });
      }
    });
  });
});
