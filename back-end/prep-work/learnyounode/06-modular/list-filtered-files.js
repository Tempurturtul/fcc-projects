const filterFiles = require('./filter-files');

filterFiles(process.argv[2], process.argv[3], (err, list) => {
    if (err) return console.log(err);

    list.forEach((file) => console.log(file));
});
