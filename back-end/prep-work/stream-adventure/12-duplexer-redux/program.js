const duplexer = require('duplexer2');
const through = require('through2').obj;

module.exports = (counter) => {
  const input = through(write, end);
  const duplex = duplexer({objectMode: true}, input, counter);
  let countryCounts = {};

  return duplex;

  function write(obj, encoding, next) {
    countryCounts[obj.country] = (countryCounts[obj.country] || 0) + 1;
    next();
  }

  function end(done) {
    counter.setCounts(countryCounts);
    done();
  }
};
