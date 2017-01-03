const express = require('express');
const stylus = require('stylus');
const port = process.argv[2];
const files = process.argv[3];
const app = express();

app.use(stylus.middleware(files));
app.use(express.static(files));

app.listen(port);
