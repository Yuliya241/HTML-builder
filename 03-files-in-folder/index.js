const fs = require('fs');
const path = require('path');
const newPath = path.join(__dirname, 'secret-folder');
fs.readdir(newPath, (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    const component = path.join(newPath, file);
    fs.stat(component, (err, stats) => {
      if (err) throw err;
      if(stats.isFile())
        console.log(`${path.basename(component, path.extname(component))} - ${path.extname(component).slice(1)} - ${stats.size}b`);
    });
  });
});
