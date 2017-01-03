const crypto = require('crypto');
const passphrase = process.argv[2];
const decrypt = crypto.createDecipher('aes256', passphrase);

process.stdin
  .pipe(decrypt)
  .pipe(process.stdout);