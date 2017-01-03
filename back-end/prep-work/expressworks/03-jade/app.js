const express = require('express');
const port = process.argv[2];
const views = process.argv[3];
const app = express();

app.set('view engine', 'jade');
app.set('views', views);

app.get('/home', (req, res) => {
  res.render('index', { date: new Date().toDateString() });
});

app.listen(port);
