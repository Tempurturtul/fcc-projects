const express = require('express');
const crypto = require('crypto');
const port = process.argv[2];
const app = express();

app.put('/message/:id', (request, response) => {
  const hash = crypto
    .createHash('sha1')
    .update(new Date().toDateString() + request.params.id)
    .digest('hex');

  response.send(hash); 
});

app.listen(port);
