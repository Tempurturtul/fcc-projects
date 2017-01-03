const http = require('http');

const url = process.argv[2];

http.get(url, (response) => {
  response.setEncoding('utf8');
  response.on('data', collect);
  response.on('error', console.error);
  response.on('end', print);
});

let collection = '';

function collect(string) {
  collection += string;
}

function print() {
  console.log(collection.split('').length);
  console.log(collection);
}
