const crypto = require('crypto');
const zlib = require('zlib');
const tar = require('tar');

const cipher = process.argv[2];
const pass = process.argv[3];

const decrypt = crypto.createDecipher(cipher, pass);
const unzip = zlib.createGunzip();
const parseTar = tar.Parse();

parseTar.on('entry', (e) => {
  if (e.type !== 'File') {
    return;
  }

  const hash = crypto.createHash('md5');
  
  e.on('data', (data) => {
    hash.update(data);
  });

  e.on('end', () => {
    const digest = hash.digest('hex');

    process.stdout.write(`${digest} ${e.path}\n`);
  });
});

process.stdin
  .pipe(decrypt)
  .pipe(unzip)
  .pipe(parseTar);
