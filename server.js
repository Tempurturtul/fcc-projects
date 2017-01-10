const express = require('express');
const pg = require('pg');
const url = require('url');
const validURL = require('valid-url');

const app = express();
const port = process.env.PORT || 3000;

// Heroku-specific. (See: https://www.npmjs.com/package/pg-pool.)
const poolParams = url.parse(process.env.DATABASE_URL);
const poolAuth = poolParams.auth.split(':');
const pool = new pg.Pool({
  user: poolAuth[0],
  password: poolAuth[1],
  host: poolParams.hostname,
  port: poolParams.port,
  database: poolParams.pathname.split('/')[1],
  ssl: true,
});

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end('index');
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
      if (!id) {
        console.error('\`storeURL\` did not return an id.');
        return response.status(500).end();
      }

      const short_url = `${request.protocol}://${request.get('host')}/s/${id}`;

      response.json({
        original_url,
        short_url,
      });
    })
    .catch((err) => {
      console.error('Error storing URL:\n', err);
      return response.status(500).end();  // 500 Internal Server Error
    });
});

app.get('/s/:id', (request, response) => {
  const id = request.params.id;

  retrieveURL(id)
    .then((url) => {
      if (!url) {
        return response.status(404).end();
      }

      response.redirect(302, url);  // 302 Found
    })
    .catch((err) => {
      console.error('Error retrieving stored URL:\n', err)
      return response.status(500).end();  // 500 Internal Server Error
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
            if (err) reject('Failed to store url.');

            // Successfully stored.
            resolve(result && result.rows.length ? result.rows[0].short_id : null);
          });
        }
      })
      .catch((err) => reject('Failed to check if url was already stored.'));
  });
}

function retrieveURL(short_id) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT original FROM urls WHERE short_id = '${short_id}'`, (err, result) => {
      if (err) reject('Failed to retrieve URL.');

      resolve(result && result.rows.length ? result.rows[0].original : null);
    });
  });
}

function retrieveShortID(original) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT short_id FROM urls WHERE original = '${original}'`, (err, result) => {
      if (err) reject('Failed to retrieve short_id:\n' + err);

      resolve(result && result.rows.length ? result.rows[0].short_id : null);
    });
  });
}
