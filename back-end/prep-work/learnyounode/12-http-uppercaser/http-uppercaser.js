const http = require('http');
const throughMap = require('through2-map');

const port = process.argv[2];

const server = http.createServer((request, response) => {
  if (request.method !== 'POST') {
    return response.end('POST only\n');
  }

  request
    .pipe(throughMap((chunk) => chunk.toString().toUpperCase()))
    .pipe(response);
});

server.listen(port);
