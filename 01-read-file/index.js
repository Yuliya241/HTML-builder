const fs = require('fs');
const path = require('path');
const newPath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(newPath, 'utf-8');
readableStream.on('data', (data) => console.log(data));