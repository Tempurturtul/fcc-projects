const express = require('express');
const pg = require('pg');
const app = express();

const port = process.env.PORT || 3000;

pg.defaults.ssl = true;

app.use(express.static('public'));

app.get('/', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' })
  response.end('index');
});

app.get('/new/*', (request, response) => {
  const original_url = request.path.split('new/')[1];
  // const id = store(original_url);
  const id = '0000';
  const short_url = `${request.protocol}://${request.get('host')}/${id}`;

  response.json({
    original_url,
    short_url,
  });
});

app.get('/:id', (request, response) => {
  pg.connect(process.env.DATABASE_URL, (err, client) => {
    if (err) {
      console.error(err);
      return response.status(500).end('Error connecting to database:\n' + err);  // 500 Internal Server Error
    }

    response.end('Successfully connected to databse.');
  });

  // // const url = retrieve(request.params.id);
  // const url = 'https://www.google.com';
  //
  // if (!url) {
  //   return response.status(404).end('Shortened URL not found.');
  // }
  //
  // response.redirect(302, url);  // 302 Found
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
