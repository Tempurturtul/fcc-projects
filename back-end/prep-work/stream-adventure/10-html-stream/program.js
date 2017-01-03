const through = require('through2');
const trumpet = require('trumpet');

const tr = trumpet();
const loud = tr.select('.loud').createStream();

loud.pipe(through(writeUppercase)).pipe(loud);

process.stdin.pipe(tr).pipe(process.stdout);

function writeUppercase(buffer, encoding, next) {
  this.push(buffer.toString().toUpperCase());
  next();
}
