const fs = require('fs');
const path = require('path');
const folderStyles = path.join(__dirname, 'styles');
const folderDist = path.join(__dirname, 'project-dist/bundle.css');
const writableStream = fs.createWriteStream(folderDist, 'utf-8');

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