const express = require('express');
const fs = require('fs');
const port = process.argv[2];
const file = process.argv[3];
const app = express();

app.get('/books', (request, response) => {
  fs.readFile(file, (err, data) => {
    if (err) {
      return response.sendStatus(500);
    }

    try {
      const books = JSON.parse(data);
      response.json(books);
    } catch (e) {
      response.sendStatus(500);
    }
  });
});

app.listen(port);
