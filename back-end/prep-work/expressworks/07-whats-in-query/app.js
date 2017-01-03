const express = require('express');
const port = process.argv[2];
const app = express();

app.get('/search', (request, response) => {
  response.send(request.query);
});

app.listen(port);
