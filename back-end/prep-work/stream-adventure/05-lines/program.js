const through = require('through2');
const split = require('split');

const transformStream = through(write);

let lineCounter = 0;

process.stdin
  .pipe(split())
  .pipe(transformStream)
  .pipe(process.stdout);

function write(buffer, encoding, next) {
  lineCounter++;

  this.push(lineCounter % 2 === 0
    ? buffer.toString().toUpperCase() + '\n'
    : buffer.toString().toLowerCase() + '\n');

  next();
}
