const http = require('http');

const urls = process.argv.slice(2);

let collection = [];

// Initialize the collection array.
urls.forEach((url, index) => collection[index] = { string: '', complete: false });

// Make the HTTP GET requests.
urls.forEach((url, index) => {
  http.get(url, (response) => {
    response.setEncoding('utf8');
    response.on('data', (data) => {
      collect(data, index);
    });
    response.on('error', console.error);
    response.on('end', () => finalize(index));
  });
});

function collect(data, index) {
  collection[index].string += data;
}

function finalize(index) {
  collection[index].complete = true;

  if (collection.every((item) => item.complete === true)) {
    collection.forEach((item) => console.log(item.string));
  }
}
