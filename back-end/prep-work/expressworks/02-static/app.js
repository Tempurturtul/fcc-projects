const express = require('express');
const port = process.argv[2];
const index = process.argv[3];
const app = express();

app.use(express.static(index));

app.listen(port);
