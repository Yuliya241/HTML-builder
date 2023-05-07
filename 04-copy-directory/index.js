const fs = require('fs/promises');
const path = require('path');
const folder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copyDir(folder, copyFolder) {
  try {
    await fs.rm(copyFolder, { recursive: true, force: true });
    await fs.mkdir(copyFolder, { recursive: true });
    const files = await fs.readdir(folder, { withFileTypes: true });
    files.forEach((file) => {
      const component = path.join(folder, file.name);
      const component2 = path.join(copyFolder, file.name); 
      fs.copyFile(component, component2);
      if (file.isDirectory()) {
        copyDir(component, component2);
      }
    });
  } catch(err) {
    console.log(err);
  }
}
copyDir(folder, copyFolder);
