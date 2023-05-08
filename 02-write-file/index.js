const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const newPath = path.join(__dirname, 'text.txt');
const writableStream = fs.createWriteStream(newPath, 'utf-8');

stdout.write('Hi!Enter the text...\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    writableStream.write(data);
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => {
  console.log('Goodbye!');
});
