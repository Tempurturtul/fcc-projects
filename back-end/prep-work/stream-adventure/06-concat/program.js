const concatStream = require('concat-stream');

process.stdin
  .pipe(concatStream((buffer) => {
    console.log(buffer.toString().split('').reverse().join(''));
  }));
