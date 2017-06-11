const express = require('express');
const pg = require('pg');
const url = require('url');
const validURL = require('valid-url');
const Hashids = require('hashids');

const app = express();
const port = process.env.PORT || 3000;

// Heroku-specific. (See: https://www.npmjs.com/package/pg-pool.)
const poolParams = url.parse(process.env.DATABASE_URL || 'postgres://postgres:foobar@localhost:5432/mydb');
const poolAuth = poolParams.auth.split(':');
const pool = new pg.Pool({
  user: poolAuth[0],
  password: poolAuth[1],
  host: poolParams.hostname,
  port: poolParams.port,
  database: poolParams.pathname.split('/')[1],
  ssl: true,
});

const seed = 'URL Shortener Microservice';
const padding = 4;
const hashids = new Hashids(seed, padding);

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.send('index');
});

app.get('/new/*', (request, response) => {
  const original_url = validURL.isWebUri(request.path.split('new/')[1]);

  if (!original_url) {
    return response.json({
      error: 'Invalid URL.'
    });
  }

  storeURL(original_url)
    .then((id) => {
      const obfuscatedID = obfuscateShortID(id);
      const short_url = `${request.protocol}://${request.get('host')}/s/${obfuscatedID}`;

      response.json({
        original_url,
        short_url,
      });
    })
    .catch((err) => {
      console.error('Error storing URL:', err.message);
      // 500 Internal Server Error
      return response.status(500).send('Error storing URL: ' + err.message);
    });
});

app.get('/s/:id', (request, response) => {
  const obfuscatedID = request.params.id
  const id = deobfuscateShortID(obfuscatedID);

  retrieveURL(id)
    .then((url) => {
      if (!url) {
        // 404 Not Found
        return response.status(404).json({
          error: 'URL not in database.'
        });
      }

      response.redirect(url);
    })
    .catch((err) => {
      console.error('Error retrieving URL:', err.message);
      // 500 Internal Server Error
      return response.status(500).send('Error retrieving URL: ' + err.message);
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});

function storeURL(original) {
  return new Promise((resolve, reject) => {
    // First make sure it wasn't already stored.
    retrieveShortID(original)
      .then((id) => {
        if (id) {
          resolve(id);
        } else {
          // Hasn't been stored yet.
          pool.query(`INSERT INTO urls (original) VALUES ('${original}') RETURNING short_id`, (err, result) => {
            if (err) {
              reject(new Error('Failed to add url to database.'));
            }

            // Successfully stored.
            resolve(result.rows[0].short_id);
          });
        }
      })
      .catch((err) => reject(err));
  });
}

function retrieveURL(short_id) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT original FROM urls WHERE short_id = '${short_id}'`, (err, result) => {
      if (err) {
        reject(new Error('Failed to retrieve url from database.'));
      }

      resolve(result && result.rows.length ? result.rows[0].original : null);
    });
  });
}

function retrieveShortID(original) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT short_id FROM urls WHERE original = '${original}'`, (err, result) => {
      if (err) {
        reject(new Error('Failed to retrieve short_id from database.'));
      }

      resolve(result && result.rows.length ? result.rows[0].short_id : null);
    });
  });
}

function obfuscateShortID(short_id) {
  return hashids.encode(String(short_id).split(''));
}

function deobfuscateShortID(str) {
  return Number(hashids.decode(str).join(''));
}
