const fs = require('fs');

const filePath = process.argv[2];

fs.readFile(filePath, (err, data) => {
  if (err) return console.log(err);

  const newlineCount = data.toString().split('\n').length - 1;
  console.log(newlineCount);
});
