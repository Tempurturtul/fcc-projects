const express = require('express');
const useragent = require('express-useragent');
const getip = require('ipware')().get_ip;
const app = express();

const port = process.env.PORT || 3000;

app.use(useragent.express());

app.get('*', (request, response) => {
  const ipaddress = getip(request).clientIp;
  const language = request.acceptsLanguages()[0];
  const os = request.useragent.os;

  response.json({
    ipaddress,
    language,
    os,
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}.`);
});
