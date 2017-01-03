const fs = require('fs');
const dir = process.argv[2];
const ext = '.' + process.argv[3];

fs.readdir(dir, (err, list) => {
    if (err) return console.log(err);

    const re = new RegExp(ext + '$');
    const filteredList = list.filter((file) => re.test(file));

    filteredList.forEach((file) => console.log(file));
});
