const fs = require('fs');
const file = process.argv[2];
const stream = fs.createReadStream(file)

stream.pipe(process.stdout);
