const net = require('net');
const port = process.argv[2];
const server = net.createServer(listener);

server.listen(port);

function listener(socket) {
  socket.end(time() + '\n');
}

function time() {
  const now = new Date();
  return now.getFullYear() + '-' +
    leftPad(now.getMonth() + 1, 2, '0') + '-' +
    leftPad(now.getDate(), 2, '0') + ' ' +
    leftPad(now.getHours(), 2, '0') + ':' +
    leftPad(now.getMinutes(), 2, '0');
}

function leftPad(string, length, character = ' ') {
  while (string.length < length) {
    string = character + string;
  }

  return string;
}
