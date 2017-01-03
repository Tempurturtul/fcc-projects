const http = require('http');

const port = process.argv[2];

const server = http.createServer((request, response) => {
  if (request.method !== 'GET') {
    return response.end('Try a GET request.\n');
  }

  const iso = request.url.split('iso=')[1];
  const date = new Date(iso);
  let json;

  if (request.url.indexOf('/api/parsetime') === 0) {
    json = {
      "hour": date.getHours(),
      "minute": date.getMinutes(),
      "second": date.getSeconds()
    };
  }

  if (request.url.indexOf('/api/unixtime') === 0) {
    json = { "unixtime": date.getTime() };
  }

  if (json) {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    return response.end(JSON.stringify(json));
  }
});

server.listen(port);
