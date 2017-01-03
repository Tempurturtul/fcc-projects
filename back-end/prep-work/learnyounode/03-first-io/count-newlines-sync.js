const fs = require('fs');

const filePath = process.argv[2];
const contents = fs.readFileSync(filePath);

const newlineCount = contents.toString().split('\n').length - 1;

console.log(newlineCount);
