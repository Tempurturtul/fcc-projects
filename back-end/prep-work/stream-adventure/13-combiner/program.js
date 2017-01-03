const combine = require('stream-combiner');
const split = require('split');
const zlib = require('zlib');
const through = require('through2');

const transform = through(write, end);
const zip = zlib.createGzip();

let genre;

function write(line, _, next) {
  let row;

  try {
    row = JSON.parse(line);
  } catch(e) {
    return next();
  }

  if (row.type === 'genre') {
    if (genre) {
      this.push(JSON.stringify(genre) + '\n');
    }

    genre = { 'name': row.name, 'books': [] };
  } else if (row.type === 'book') {
    genre.books.push(row.name);
  }

  next();
}

function end(done) {
  this.push(JSON.stringify(genre) + '\n');
  done();
}

module.exports = () => {
  return combine(
    split(),
    transform,
    zip
  );
};
