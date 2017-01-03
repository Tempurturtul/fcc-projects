const fs = require('fs');

module.exports = (dir, ext, cb) => {
  fs.readdir(dir, (err, list) => {
    if (err) return cb(err);

    const re = new RegExp('\.' + ext + '$');

    const filteredList = list.filter((file) => re.test(file));

    return cb(null, filteredList);
  });
};
