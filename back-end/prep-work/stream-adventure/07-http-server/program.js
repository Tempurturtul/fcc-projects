const http = require('http');
const through2 = require('through2');

const port = process.argv[2];
const transform = through2(write);

const server = http.createServer((request, response) => {
  if (request.method === 'POST') {
    request
      .pipe(transform)
      .pipe(response);
  } else {
    response.end('Try a POST request.\n');
  }
});

server.listen(port);

function write(buffer, encoding, next) {
  this.push(buffer.toString().toUpperCase());
  next();
}
